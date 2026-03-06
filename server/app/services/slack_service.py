"""Slack bot micro-survey service — sends post-commit surveys and collects responses."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

import httpx

from app.config import settings

logger = logging.getLogger(__name__)

SLACK_API = "https://slack.com/api"

# In-memory store for survey responses (replace with DB in production)
_survey_store: list[dict] = []

SURVEY_QUESTIONS = [
    {
        "id": "speed",
        "question": "How much did AI speed up this task?",
        "options": ["Much faster", "Slightly faster", "No difference", "Slower"],
    },
    {
        "id": "helpfulness",
        "question": "Rate AI helpfulness (1-10)",
        "options": ["1-3", "4-6", "7-8", "9-10"],
    },
    {
        "id": "without_ai",
        "question": "Would you have been faster without AI?",
        "options": ["Yes", "No", "About the same"],
    },
    {
        "id": "quality",
        "question": "Did AI code need modifications?",
        "options": ["Used as-is", "Minor edits", "Major rewrite", "Discarded"],
    },
]


def _headers() -> dict[str, str]:
    return {
        "Authorization": f"Bearer {settings.SLACK_BOT_TOKEN}",
        "Content-Type": "application/json",
    }


async def send_survey(dev_slack_id: str, commit_file: str, commit_sha: str) -> bool:
    """Send a post-commit micro-survey to a developer via Slack DM."""
    if not settings.SLACK_BOT_TOKEN:
        logger.warning("Slack bot token not configured — survey not sent")
        return False

    import random
    q = random.choice(SURVEY_QUESTIONS)

    blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*📋 Post-Commit Survey*\nYou just committed `{commit_file}` (`{commit_sha[:7]}`)\n\n*{q['question']}*",
            },
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {"type": "plain_text", "text": opt},
                    "value": f"{q['id']}|{opt}|{commit_sha}",
                    "action_id": f"survey_{q['id']}_{i}",
                }
                for i, opt in enumerate(q["options"])
            ],
        },
    ]

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(
            f"{SLACK_API}/chat.postMessage",
            headers=_headers(),
            json={
                "channel": dev_slack_id,
                "text": f"Survey: {q['question']}",
                "blocks": blocks,
            },
        )
        data = resp.json()
        if not data.get("ok"):
            logger.error("Slack API error: %s", data.get("error"))
            return False
        return True


async def send_alert_to_manager(
    manager_slack_id: str,
    dev_name: str,
    gap_pct: float,
    threshold: int,
) -> bool:
    """Send a manager alert when perception gap exceeds threshold."""
    if not settings.SLACK_BOT_TOKEN:
        logger.warning("Slack bot token not configured — alert not sent")
        return False

    text = (
        f"🔴 *Manager Alert — Perception Gap Exceeded*\n"
        f"Developer *{dev_name}* has a perception gap of *{gap_pct}%* "
        f"(threshold: {threshold}%).\n"
        f"Gap exceeds threshold by *{gap_pct - threshold:.0f}pts*.\n"
        f"_Action: Please schedule a 1:1 calibration session._"
    )

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.post(
            f"{SLACK_API}/chat.postMessage",
            headers=_headers(),
            json={"channel": manager_slack_id, "text": text},
        )
        data = resp.json()
        if not data.get("ok"):
            logger.error("Slack alert error: %s", data.get("error"))
            return False
        return True


def store_survey_response(
    dev: str, question: str, answer: str, commit_sha: str | None = None
) -> dict:
    """Store a survey response (in-memory; replace with DB)."""
    entry = {
        "dev": dev,
        "question": question,
        "answer": answer,
        "commit_sha": commit_sha,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    _survey_store.append(entry)
    return entry


def get_survey_responses(limit: int = 20) -> list[dict]:
    """Return recent survey responses."""
    return _survey_store[-limit:][::-1]


def get_survey_questions() -> list[dict]:
    """Return available survey questions."""
    return SURVEY_QUESTIONS
