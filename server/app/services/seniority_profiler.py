"""Seniority Profiler — computes org-level seniority distribution and AI harm summary."""

from app.data.dev_profiles_data import SENIORITY_PROFILES, AI_IMPACT_DASHBOARDS


def compute_seniority_summary() -> dict:
    """Aggregate seniority profile stats across all developers."""
    bands = {}
    for sp in SENIORITY_PROFILES:
        bands[sp.band] = bands.get(sp.band, 0) + 1

    harmed = [d for d in AI_IMPACT_DASHBOARDS if d.net_impact_hrs < 0]
    benefited = [d for d in AI_IMPACT_DASHBOARDS if d.net_impact_hrs >= 0]

    total_harm_hrs = sum(d.net_impact_hrs for d in harmed)
    total_benefit_hrs = sum(d.net_impact_hrs for d in benefited)

    worst = min(AI_IMPACT_DASHBOARDS, key=lambda d: d.net_impact_hrs)

    return {
        "total_developers": len(SENIORITY_PROFILES),
        "band_distribution": bands,
        "avg_seniority_score": round(sum(s.seniority_score for s in SENIORITY_PROFILES) / len(SENIORITY_PROFILES), 1),
        "developers_harmed": len(harmed),
        "developers_benefited": len(benefited),
        "total_harm_hrs": round(total_harm_hrs, 1),
        "total_benefit_hrs": round(total_benefit_hrs, 1),
        "net_org_impact_hrs": round(total_harm_hrs + total_benefit_hrs, 1),
        "worst_affected": worst.developer,
        "worst_impact_hrs": round(worst.net_impact_hrs, 1),
    }
