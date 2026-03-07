"""Decision Contamination Tracker — computes contamination insights."""

from app.data.truth_lens_data import (
    DECISION_SIGNALS, CONTAMINATION_ASSESSMENTS,
    POST_DECISION_OUTCOMES, ORG_CONTAMINATION,
)


def compute_contamination_summary() -> dict:
    """Org-level decision contamination summary."""
    critical_assessments = [a for a in CONTAMINATION_ASSESSMENTS if a["contamination_risk"] == "critical"]
    high_assessments = [a for a in CONTAMINATION_ASSESSMENTS if a["contamination_risk"] == "high"]
    total_cost = sum(o["total_contamination_cost"] for o in POST_DECISION_OUTCOMES)
    avg_eqs = sum(a["evidence_quality_score"] for a in CONTAMINATION_ASSESSMENTS) / len(CONTAMINATION_ASSESSMENTS) if CONTAMINATION_ASSESSMENTS else 0
    open_signals = [s for s in DECISION_SIGNALS if s["status"] in ("detected", "assessed")]

    return {
        "total_decisions_tracked": len(DECISION_SIGNALS),
        "critical_contamination": len(critical_assessments),
        "high_contamination": len(high_assessments),
        "total_contamination_cost": round(total_cost),
        "avg_evidence_quality_score": round(avg_eqs, 1),
        "open_signals": len(open_signals),
        "decisions_below_eqs_40": ORG_CONTAMINATION["decisions_below_40"],
        "estimated_preventable_cost": ORG_CONTAMINATION["estimated_preventable_cost"],
    }
