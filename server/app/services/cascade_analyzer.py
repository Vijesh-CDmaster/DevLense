"""Cascade Analyzer — computes cascade efficiency and team-level insights."""

from app.data.org_cascade_data import (
    CASCADE_EFFICIENCY, TEAM_CASCADE_VIEWS, FLOW_STAGE_DETAILS, STORY_POINT_TRACKER,
)


def compute_cascade_health() -> dict:
    """Overall cascade health with key diagnostics."""
    score = CASCADE_EFFICIENCY["score"]
    avg_team_eff = sum(t["cascade_efficiency"] for t in TEAM_CASCADE_VIEWS) / len(TEAM_CASCADE_VIEWS)
    total_leak = sum(s["loss"] for s in FLOW_STAGE_DETAILS)
    biggest_leak = max(FLOW_STAGE_DETAILS, key=lambda s: s["loss"])
    return {
        "cascade_score": score,
        "health": "critical" if score < 30 else "poor" if score < 50 else "moderate" if score < 70 else "healthy",
        "avg_team_efficiency": round(avg_team_eff, 1),
        "total_value_leaked_pct": round(total_leak, 1),
        "biggest_leak_stage": biggest_leak["stage"],
        "biggest_leak_pct": biggest_leak["loss"],
    }


def compute_story_point_gap() -> dict:
    """Detect the paradox: AI-assisted % rising but delivery rate falling."""
    if not STORY_POINT_TRACKER:
        return {}
    first = STORY_POINT_TRACKER[0]
    last = STORY_POINT_TRACKER[-1]
    ai_delta = last["ai_assisted_pct"] - first["ai_assisted_pct"]
    delivery_delta = last["delivery_rate"] - first["delivery_rate"]
    return {
        "ai_adoption_change": round(ai_delta, 1),
        "delivery_rate_change": round(delivery_delta, 1),
        "paradox_detected": ai_delta > 0 and delivery_delta < 0,
        "latest_delivery_rate": last["delivery_rate"],
        "latest_ai_pct": last["ai_assisted_pct"],
        "sprints_analyzed": len(STORY_POINT_TRACKER),
    }
