"""Knowledge Mortality Forecaster — computation service."""


def compute_mortality_summary(
    decay_scores: list,
    asset_valuations: list,
    mortality_timeline,
) -> dict:
    """Aggregate mortality risk across all knowledge assets."""
    urgent = [e for e in mortality_timeline.entries if e.priority == "urgent"]
    high = [e for e in mortality_timeline.entries if e.priority == "high"]
    low = [e for e in mortality_timeline.entries if e.priority == "low"]

    total_kav = sum(a.total_kav for a in asset_valuations)
    total_recoverable = sum(a.recoverable_value for a in asset_valuations)
    total_irrecoverable = sum(a.already_irrecoverable for a in asset_valuations)
    avg_kds = round(
        sum(d.kds_current for d in decay_scores) / len(decay_scores), 1
    ) if decay_scores else 0

    return {
        "total_knowledge_assets": total_kav,
        "total_recoverable": total_recoverable,
        "total_irrecoverable": total_irrecoverable,
        "avg_kds": avg_kds,
        "urgent_count": len(urgent),
        "high_count": len(high),
        "low_count": len(low),
        "imminent_risk_value": mortality_timeline.total_at_imminent_risk,
        "preservation_roi": mortality_timeline.preservation_roi,
        "recommended_sessions": mortality_timeline.recommended_sessions,
    }


def compute_departure_impact(departure_exposure, asset_valuations: list) -> dict:
    """Compute financial impact of a single departure event."""
    de = departure_exposure
    pct_recoverable = round(
        de.recoverable_with_extraction / de.combined_kav * 100, 1
    ) if de.combined_kav > 0 else 0
    pct_gone = round(
        de.irrecoverable_immediately / de.combined_kav * 100, 1
    ) if de.combined_kav > 0 else 0

    return {
        "dev": de.dev,
        "combined_kav": de.combined_kav,
        "pct_recoverable": pct_recoverable,
        "pct_irrecoverable": pct_gone,
        "pct_documented": round(
            de.already_documented / de.combined_kav * 100, 1
        ) if de.combined_kav > 0 else 0,
        "extraction_roi": de.preservation_roi,
        "urgency": "critical" if de.action_window_days <= 14 else "high",
    }


def compute_constraint_coverage(
    decision_nodes: list,
    constraint_alerts: list,
) -> dict:
    """Summarise constraint alert coverage."""
    active_nodes = [n for n in decision_nodes if n.status == "active"]
    hard_constraints = [n for n in active_nodes if n.constraint_type == "hard"]
    pending_alerts = [a for a in constraint_alerts if a.resolution == "pending"]
    critical_alerts = [a for a in constraint_alerts if a.severity == "critical"]

    return {
        "active_decision_nodes": len(active_nodes),
        "hard_constraints": len(hard_constraints),
        "total_alerts_fired": len(constraint_alerts),
        "pending_alerts": len(pending_alerts),
        "critical_alerts": len(critical_alerts),
        "auto_comments_posted": sum(
            1 for a in constraint_alerts if a.auto_comment_posted
        ),
    }
