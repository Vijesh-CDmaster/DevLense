"""Cognitive Debt — computes team cognitive debt insights and predictions."""

from app.data.toolchain_radar_data import (
    COGNITIVE_DEBT_SCORES, TEAM_DEBT_FORECAST, ROI_TRIGGERS,
)


def compute_team_debt_summary() -> dict:
    """Org-level cognitive debt summary."""
    if not COGNITIVE_DEBT_SCORES:
        return {}

    scores = [d["score"] for d in COGNITIVE_DEBT_SCORES]
    avg_score = sum(scores) / len(scores)
    danger_count = sum(1 for d in COGNITIVE_DEBT_SCORES if d["zone"] == "danger")
    warning_count = sum(1 for d in COGNITIVE_DEBT_SCORES if d["zone"] == "warning")
    nearest_cliff = min(COGNITIVE_DEBT_SCORES, key=lambda d: d["predicted_cliff_min"])

    chronic_devs = [f["developer"] for f in TEAM_DEBT_FORECAST if f["chronic_warning_days"] >= 3]
    critical_triggers = [t for t in ROI_TRIGGERS if t["severity"] == "critical"]

    return {
        "avg_team_score": round(avg_score, 1),
        "team_zone": "danger" if avg_score >= 70 else "warning" if avg_score >= 50 else "yellow" if avg_score >= 35 else "green",
        "developers_in_danger": danger_count,
        "developers_in_warning": warning_count,
        "nearest_cliff_developer": nearest_cliff["developer"],
        "nearest_cliff_min": nearest_cliff["predicted_cliff_min"],
        "chronic_warning_developers": chronic_devs,
        "critical_roi_triggers": len(critical_triggers),
        "total_weekly_roi_cost_hrs": round(sum(t["weekly_cost_hrs"] for t in ROI_TRIGGERS), 1),
    }
