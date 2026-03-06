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
