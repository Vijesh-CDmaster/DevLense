"""Friction Debt Engine — computes decision attribution, debt ledger summaries, and empathy ROI."""

from app.data.leadership_data import (
    RT_FRICTION_HEATMAP, NET_AI_ROI, DECISION_IMPACT_MEASUREMENTS,
    FRICTION_DEBT_LEDGER, BIDIRECTIONAL_DASHBOARD, EMPATHY_ROI_REPORT,
)


def compute_friction_summary() -> dict:
    """Aggregate real-time friction heatmap into org-level summary."""
    total_hours = sum(r.hours_lost for r in RT_FRICTION_HEATMAP)
    total_cost = sum(r.team_cost for r in RT_FRICTION_HEATMAP)
    worsening = sum(1 for r in RT_FRICTION_HEATMAP if r.trend_direction in ("up", "new"))
    return {
        "total_friction_hours": round(total_hours, 1),
        "total_friction_cost": total_cost,
        "sources_count": len(RT_FRICTION_HEATMAP),
        "worsening_count": worsening,
        "net_ai_roi": NET_AI_ROI.net_roi_dollars,
        "net_status": NET_AI_ROI.net_status,
    }


def compute_debt_summary() -> dict:
    """Aggregate decision impact data into a high-level debt summary."""
    unmitigated = [m for m in DECISION_IMPACT_MEASUREMENTS if m.status == "not_mitigated"]
    total_unmitigated_cost = sum(m.cumulative_cost for m in unmitigated)
    total_potential_saving = sum(m.mitigation_weekly_saving for m in unmitigated)
    total_mitigation_cost = sum(m.mitigation_cost for m in unmitigated)

    return {
        "unmitigated_decisions": len(unmitigated),
        "total_decisions_tracked": len(DECISION_IMPACT_MEASUREMENTS),
        "total_unmitigated_cost": total_unmitigated_cost,
        "total_potential_weekly_saving": total_potential_saving,
        "total_mitigation_investment": total_mitigation_cost,
        "net_friction_debt": FRICTION_DEBT_LEDGER.net_friction_debt,
        "highest_debt_maker": FRICTION_DEBT_LEDGER.decision_quality_scores[0]["leader"]
        if FRICTION_DEBT_LEDGER.decision_quality_scores else "N/A",
    }


def compute_accountability_summary() -> dict:
    """Summarise bidirectional accountability metrics."""
    dash = BIDIRECTIONAL_DASHBOARD
    acted = sum(1 for a in dash.action_loops if a.response_status == "acted")
    total_personal_cost = sum(a.personal_cost for a in dash.action_loops)
    total_team_cost = sum(a.team_cost for a in dash.action_loops)

    return {
        "developer": dash.developer,
        "team": dash.team,
        "total_friction_items": len(dash.action_loops),
        "acted_on": acted,
        "not_acted_on": len(dash.action_loops) - acted,
        "response_rate_pct": round(acted / len(dash.action_loops) * 100, 1) if dash.action_loops else 0,
        "total_personal_cost": total_personal_cost,
        "total_team_cost": total_team_cost,
        "empathy_score": dash.empathy_score,
    }
