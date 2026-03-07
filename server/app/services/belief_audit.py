"""Belief Audit Engine — computes calibration and bias insights."""

from app.data.truth_lens_data import BELIEF_AUDITS, CALIBRATION_SCORES, BIAS_TYPOLOGIES


def compute_belief_summary() -> dict:
    """Org-level belief audit summary."""
    if not BELIEF_AUDITS:
        return {}

    avg_gaps = [a["avg_gap"] for a in BELIEF_AUDITS]
    avg_org_gap = sum(avg_gaps) / len(avg_gaps)
    miscalibrated = [c for c in CALIBRATION_SCORES if c["score"] < 40]
    calibrated = [c for c in CALIBRATION_SCORES if c["score"] >= 80]
    active_biases = [b for b in BIAS_TYPOLOGIES if b["severity"] in ("high", "critical")]

    return {
        "avg_org_gap_pts": round(avg_org_gap, 1),
        "miscalibrated_developers": len(miscalibrated),
        "well_calibrated_developers": len(calibrated),
        "active_bias_types": len(active_biases),
        "worst_calibrated": min(CALIBRATION_SCORES, key=lambda c: c["score"])["developer"] if CALIBRATION_SCORES else "N/A",
        "worst_calibration_score": min(CALIBRATION_SCORES, key=lambda c: c["score"])["score"] if CALIBRATION_SCORES else 0,
        "developers_notified": sum(1 for a in BELIEF_AUDITS if a["alert_status"] in ("notified", "escalated")),
        "total_developers": len(BELIEF_AUDITS),
    }
