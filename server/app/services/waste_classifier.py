"""AI Waste Classifier — quantifies where AI-generated value is destroyed."""

from app.data.org_cascade_data import WASTE_ENTRIES, WASTE_WEEKLY_TRENDS, TRUE_AI_ROI


def compute_waste_summary() -> dict:
    """Aggregate waste metrics across all types."""
    total_hours = sum(e["hours_consumed"] for e in WASTE_ENTRIES)
    gross = TRUE_AI_ROI["gross_hours_saved"]
    return {
        "total_waste_hours": round(total_hours, 1),
        "gross_hours_saved": gross,
        "net_hours": round(gross - total_hours, 1),
        "waste_absorption_rate": round((total_hours / gross) * 100, 1) if gross else 0,
        "dominant_waste": max(WASTE_ENTRIES, key=lambda e: e["hours_consumed"])["waste_type"],
        "waste_count": len(WASTE_ENTRIES),
    }


def compute_waste_trend_direction() -> dict:
    """Compare latest two weeks to determine improvement direction."""
    if len(WASTE_WEEKLY_TRENDS) < 2:
        return {"direction": "insufficient_data", "delta": 0}
    prev = WASTE_WEEKLY_TRENDS[-2]
    curr = WASTE_WEEKLY_TRENDS[-1]
    delta = curr["total_waste"] - prev["total_waste"]
    return {
        "direction": "improving" if delta < 0 else "worsening" if delta > 0 else "flat",
        "delta": round(delta, 1),
        "prev_week_waste": prev["total_waste"],
        "curr_week_waste": curr["total_waste"],
        "net_gain_change": round(curr["net_gain"] - prev["net_gain"], 1),
    }
