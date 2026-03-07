"""Talent Pipeline Debt Forecaster — computes pipeline health summary."""

from app.data.dev_profiles_data import (
    JUNIOR_DEPENDENCY_INDICES, SENIORITY_VELOCITY_DEFICITS,
    TEAM_PIPELINE_RISK, ORG_PIPELINE_DEBT,
)


def compute_pipeline_summary() -> dict:
    """Aggregate pipeline debt metrics across all tracked juniors and teams."""
    total_juniors = len(JUNIOR_DEPENDENCY_INDICES)
    severe_atrophy = [j for j in JUNIOR_DEPENDENCY_INDICES if j.atrophy_velocity <= -2.0]
    moderate_atrophy = [j for j in JUNIOR_DEPENDENCY_INDICES if -2.0 < j.atrophy_velocity <= -1.0]

    avg_svr = round(
        sum(s.svr for s in SENIORITY_VELOCITY_DEFICITS) / len(SENIORITY_VELOCITY_DEFICITS), 2
    ) if SENIORITY_VELOCITY_DEFICITS else 0

    critical_teams = [t for t in TEAM_PIPELINE_RISK if t.risk_level in ("HIGH", "CRITICAL")]

    return {
        "total_juniors_tracked": total_juniors,
        "severe_atrophy": len(severe_atrophy),
        "moderate_atrophy": len(moderate_atrophy),
        "healthy": total_juniors - len(severe_atrophy) - len(moderate_atrophy),
        "avg_svr": avg_svr,
        "avg_jdi_trend": round(
            sum(j.jdi_trend_pts for j in JUNIOR_DEPENDENCY_INDICES) / total_juniors, 1
        ),
        "critical_teams": len(critical_teams),
        "total_teams": len(TEAM_PIPELINE_RISK),
        "total_pipeline_debt": ORG_PIPELINE_DEBT.total_pipeline_debt,
        "projected_senior_gap": ORG_PIPELINE_DEBT.projected_senior_gap,
        "gap_by_quarter": ORG_PIPELINE_DEBT.gap_by_quarter,
        "preventable_by": ORG_PIPELINE_DEBT.preventable_by,
    }
