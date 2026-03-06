"""GitHub API integration — fetches commit telemetry to compare against self-reports."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

GITHUB_API = "https://api.github.com"


def _headers() -> dict[str, str]:
    h = {"Accept": "application/vnd.github+json"}
    if settings.GITHUB_TOKEN:
        h["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    return h


async def get_recent_commits(since_hours: int = 24) -> list[dict]:
    """Fetch commits from the last N hours for the configured repo."""
    if not settings.GITHUB_ORG or not settings.GITHUB_REPO:
        logger.warning("GitHub org/repo not configured — returning empty commits")
        return []

    since = (datetime.now(timezone.utc) - timedelta(hours=since_hours)).isoformat()
    url = f"{GITHUB_API}/repos/{settings.GITHUB_ORG}/{settings.GITHUB_REPO}/commits"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers=_headers(), params={"since": since, "per_page": 100})
        if resp.status_code != 200:
            logger.error("GitHub API error %s: %s", resp.status_code, resp.text[:200])
            return []
        return resp.json()


async def get_commit_detail(sha: str) -> dict | None:
    """Fetch full diff stats for a single commit."""
    if not settings.GITHUB_ORG or not settings.GITHUB_REPO:
        return None

    url = f"{GITHUB_API}/repos/{settings.GITHUB_ORG}/{settings.GITHUB_REPO}/commits/{sha}"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers=_headers())
        if resp.status_code != 200:
            return None
        return resp.json()


async def get_pr_reviews(pr_number: int) -> list[dict]:
    """Fetch review data for a pull request."""
    if not settings.GITHUB_ORG or not settings.GITHUB_REPO:
        return []

    url = f"{GITHUB_API}/repos/{settings.GITHUB_ORG}/{settings.GITHUB_REPO}/pulls/{pr_number}/reviews"

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.get(url, headers=_headers())
        if resp.status_code != 200:
            return []
        return resp.json()


def compute_telemetry_gain(commit_data: dict, avg_time_minutes: float) -> dict:
    """
    Compare actual commit duration to baseline avg.
    Returns telemetry-based gain/loss percentage.
    """
    stats = commit_data.get("stats", {})
    additions = stats.get("additions", 0)
    deletions = stats.get("deletions", 0)
    total_changes = additions + deletions

    # Estimate time from commit message timestamps (simplified)
    committed_at = commit_data.get("commit", {}).get("committer", {}).get("date")
    authored_at = commit_data.get("commit", {}).get("author", {}).get("date")

    if committed_at and authored_at:
        commit_dt = datetime.fromisoformat(committed_at.replace("Z", "+00:00"))
        author_dt = datetime.fromisoformat(authored_at.replace("Z", "+00:00"))
        actual_minutes = (commit_dt - author_dt).total_seconds() / 60
    else:
        actual_minutes = avg_time_minutes

    if avg_time_minutes > 0:
        gain_pct = ((avg_time_minutes - actual_minutes) / avg_time_minutes) * 100
    else:
        gain_pct = 0.0

    return {
        "actual_minutes": round(actual_minutes, 1),
        "avg_minutes": round(avg_time_minutes, 1),
        "gain_pct": round(gain_pct, 1),
        "total_changes": total_changes,
    }
