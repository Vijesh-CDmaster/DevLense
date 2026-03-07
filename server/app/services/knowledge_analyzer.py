"""Knowledge Vault analysis service."""

from app.models.knowledge_vault import KnowledgeRiskScore


def compute_risk_score(
    total_modules: int,
    single_owner_count: int,
    two_owner_count: int,
) -> int:
    """Compute overall knowledge risk score (0-100).

    Higher score = higher risk.
    """
    if total_modules == 0:
        return 0
    single_ratio = single_owner_count / total_modules
    two_ratio = two_owner_count / total_modules
    score = int(single_ratio * 80 + two_ratio * 30)
    return min(score, 100)


def compute_bus_factor(owners: int) -> str:
    """Return risk level string based on owner count."""
    if owners <= 1:
        return "red"
    if owners <= 2:
        return "amber"
    return "green"


def match_archaeology_query(query: str, decisions: list[dict]) -> list[dict]:
    """Simple keyword match for archaeology queries against decisions."""
    query_lower = query.lower()
    keywords = [w for w in query_lower.split() if len(w) > 2]
    results = []
    for dec in decisions:
        text = f"{dec.get('title', '')} {dec.get('reasoning', '')} {dec.get('code_region', '')}".lower()
        match_count = sum(1 for kw in keywords if kw in text)
        if match_count > 0:
            confidence = min(98, 60 + match_count * 12)
            results.append({**dec, "confidence": confidence, "match_count": match_count})
    results.sort(key=lambda x: x["match_count"], reverse=True)
    return results[:5]


def _v(obj, key, default=None):
    """Access value by key from dict or attribute from object."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def compute_decay_summary(decay_items: list) -> dict:
    """Summarize knowledge decay across all modules."""
    if not decay_items:
        return {"avg_decay": 0, "critical_count": 0, "stale_count": 0, "fresh_count": 0}
    critical = sum(1 for d in decay_items if _v(d, "status") == "critical")
    stale = sum(1 for d in decay_items if _v(d, "status") == "stale")
    aging = sum(1 for d in decay_items if _v(d, "status") == "aging")
    fresh = sum(1 for d in decay_items if _v(d, "status") == "fresh")
    avg_decay = round(sum(_v(d, "decay_score", 0) for d in decay_items) / len(decay_items), 1)
    return {
        "avg_decay": avg_decay,
        "critical_count": critical,
        "stale_count": stale,
        "aging_count": aging,
        "fresh_count": fresh,
        "total": len(decay_items),
    }


def compute_transfer_velocity(transfer_matrix: list) -> dict:
    """Compute knowledge transfer velocity metrics."""
    if not transfer_matrix:
        return {"avg_progress": 0, "completed": 0, "in_progress": 0, "not_started": 0}
    completed = sum(1 for t in transfer_matrix if _v(t, "status") == "completed")
    in_progress = sum(1 for t in transfer_matrix if _v(t, "status") == "in-progress")
    not_started = sum(1 for t in transfer_matrix if _v(t, "status") == "not-started")
    avg_progress = round(sum(_v(t, "progress", 0) for t in transfer_matrix) / len(transfer_matrix), 1)
    return {
        "avg_progress": avg_progress,
        "completed": completed,
        "in_progress": in_progress,
        "not_started": not_started,
        "total": len(transfer_matrix),
    }


def compute_knowledge_gaps(onboarding_insights: list) -> list[dict]:
    """Return undocumented questions sorted by frequency — knowledge gaps."""
    gaps = [
        {"question": _v(i, "question"), "ask_count": _v(i, "ask_count"), "module": _v(i, "gap_module"), "avg_confidence": _v(i, "avg_confidence")}
        for i in onboarding_insights
        if not _v(i, "has_documented_answer", False)
    ]
    gaps.sort(key=lambda x: x["ask_count"], reverse=True)
    return gaps
