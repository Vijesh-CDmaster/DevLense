"""Knowledge Mortality Forecaster — computation service."""


def _v(obj, key, default=None):
    """Access value by key from dict or attribute from object."""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)


def compute_mortality_summary(
    decay_scores: list,
    asset_valuations: list,
    mortality_timeline,
) -> dict:
    """Aggregate mortality risk across all knowledge assets."""
    entries = _v(mortality_timeline, "entries", [])
    urgent = [e for e in entries if _v(e, "priority") == "urgent"]
    high = [e for e in entries if _v(e, "priority") == "high"]
    low = [e for e in entries if _v(e, "priority") == "low"]

    total_kav = sum(_v(a, "total_kav", 0) for a in asset_valuations)
    total_recoverable = sum(_v(a, "recoverable_value", 0) for a in asset_valuations)
    total_irrecoverable = sum(_v(a, "already_irrecoverable", 0) for a in asset_valuations)
    avg_kds = round(
        sum(_v(d, "kds_current", 0) for d in decay_scores) / len(decay_scores), 1
    ) if decay_scores else 0

    return {
        "total_knowledge_assets": total_kav,
        "total_recoverable": total_recoverable,
        "total_irrecoverable": total_irrecoverable,
        "avg_kds": avg_kds,
        "urgent_count": len(urgent),
        "high_count": len(high),
        "low_count": len(low),
        "imminent_risk_value": _v(mortality_timeline, "total_at_imminent_risk", 0),
        "preservation_roi": _v(mortality_timeline, "preservation_roi", 0),
        "recommended_sessions": _v(mortality_timeline, "recommended_sessions", 0),
    }


def compute_departure_impact(departure_exposure, asset_valuations: list) -> dict:
    """Compute financial impact of a single departure event."""
    de = departure_exposure
    combined = _v(de, "combined_kav", 0)
    pct_recoverable = round(
        _v(de, "recoverable_with_extraction", 0) / combined * 100, 1
    ) if combined > 0 else 0
    pct_gone = round(
        _v(de, "irrecoverable_immediately", 0) / combined * 100, 1
    ) if combined > 0 else 0

    return {
        "dev": _v(de, "dev"),
        "combined_kav": combined,
        "pct_recoverable": pct_recoverable,
        "pct_irrecoverable": pct_gone,
        "pct_documented": round(
            _v(de, "already_documented", 0) / combined * 100, 1
        ) if combined > 0 else 0,
        "extraction_roi": _v(de, "preservation_roi", 0),
        "urgency": "critical" if _v(de, "action_window_days", 30) <= 14 else "high",
    }


def compute_constraint_coverage(
    decision_nodes: list,
    constraint_alerts: list,
) -> dict:
    """Summarise constraint alert coverage."""
    active_nodes = [n for n in decision_nodes if _v(n, "status") == "active"]
    hard_constraints = [n for n in active_nodes if _v(n, "constraint_type") == "hard"]
    pending_alerts = [a for a in constraint_alerts if _v(a, "resolution") == "pending"]
    critical_alerts = [a for a in constraint_alerts if _v(a, "severity") == "critical"]

    return {
        "active_decision_nodes": len(active_nodes),
        "hard_constraints": len(hard_constraints),
        "total_alerts_fired": len(constraint_alerts),
        "pending_alerts": len(pending_alerts),
        "critical_alerts": len(critical_alerts),
        "auto_comments_posted": sum(
            1 for a in constraint_alerts if _v(a, "auto_comment_posted", False)
        ),
    }
