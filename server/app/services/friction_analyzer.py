"""Friction Analyzer — computes cross-tool friction insights."""

from app.data.toolchain_radar_data import (
    WEEKLY_FRICTION, RECOVERY_TIMES, FRICTION_TRENDS,
)


def compute_friction_summary() -> dict:
    """Org-level friction summary from weekly per-developer data."""
    total_friction_hrs = sum(d["total_friction_hrs"] for d in WEEKLY_FRICTION)
    total_cost = sum(d["org_cost_estimate"] for d in WEEKLY_FRICTION)
    avg_flow = sum(d["flow_pct"] for d in WEEKLY_FRICTION) / len(WEEKLY_FRICTION) if WEEKLY_FRICTION else 0
    worst_dev = max(WEEKLY_FRICTION, key=lambda d: d["total_friction_hrs"]) if WEEKLY_FRICTION else None
    worst_recovery = max(RECOVERY_TIMES, key=lambda r: r["avg_recovery_min"]) if RECOVERY_TIMES else None

    trend_direction = "rising"
    if len(FRICTION_TRENDS) >= 2:
        delta = FRICTION_TRENDS[-1]["total_hrs_lost"] - FRICTION_TRENDS[0]["total_hrs_lost"]
        trend_direction = "rising" if delta > 0 else "falling" if delta < 0 else "stable"

    return {
        "total_weekly_friction_hrs": round(total_friction_hrs, 1),
        "total_weekly_cost": round(total_cost),
        "avg_flow_pct": round(avg_flow, 1),
        "highest_friction_developer": worst_dev["developer"] if worst_dev else "N/A",
        "highest_friction_hrs": worst_dev["total_friction_hrs"] if worst_dev else 0,
        "worst_recovery_transition": worst_recovery["transition"] if worst_recovery else "N/A",
        "worst_recovery_min": worst_recovery["avg_recovery_min"] if worst_recovery else 0,
        "trend_direction": trend_direction,
        "developers_tracked": len(WEEKLY_FRICTION),
    }
