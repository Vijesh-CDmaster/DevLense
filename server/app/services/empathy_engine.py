"""Empathy gap analysis — computes scores and translates dev pain to exec language."""

from app.data.leadership_data import (
    FRICTION_HEATMAP, EMPATHY_GAPS, ACTION_LOOP,
    DEVELOPER_FRICTIONS, EMPATHY_DIMENSIONS,
)


def compute_empathy_score() -> dict:
    """Calculate the overall empathy score based on friction gaps and action loop."""
    total_dev_hours = sum(f.dev_hours for f in FRICTION_HEATMAP)
    total_leader_est = sum(f.leader_estimate for f in FRICTION_HEATMAP)

    if total_dev_hours == 0:
        return {"score": 100, "label": "Perfect"}

    awareness_ratio = min(total_leader_est / total_dev_hours, 1.0)

    # Factor in action loop — ignored items reduce score
    ignored = sum(1 for a in ACTION_LOOP if a.status == "ignored")
    total = len(ACTION_LOOP)
    action_penalty = (ignored / total) * 30 if total > 0 else 0

    score = max(0, min(100, round(awareness_ratio * 100 - action_penalty)))
    if score >= 70:
        label = "Good Alignment"
    elif score >= 45:
        label = "Moderate Gap"
    else:
        label = "Critical Gap"

    return {"score": score, "label": label}


def translate_pain_to_kpi(dev_pain: str) -> str:
    """Translate a developer pain point into executive KPI language."""
    keywords = {
        "review": "Deployment Frequency / Lead Time for Changes",
        "meeting": "Engineering Throughput / Flow Efficiency",
        "ci": "MTTR / Change Failure Rate",
        "ai": "AI Tool ROI / Cost-per-Feature",
        "oncall": "Retention / eNPS / Attrition Risk",
        "on-call": "Retention / eNPS / Attrition Risk",
    }
    pain_lower = dev_pain.lower()
    for keyword, kpi in keywords.items():
        if keyword in pain_lower:
            return kpi
    return "Engineering Productivity Index"


def get_developer_friction_summary() -> dict:
    """Aggregate per-developer friction hours and biggest blockers."""
    devs: dict[str, dict] = {}
    for f in DEVELOPER_FRICTIONS:
        if f.dev not in devs:
            devs[f.dev] = {"total_hours": 0, "areas": [], "worst_trend": "stable"}
        devs[f.dev]["total_hours"] += f.hours_lost
        devs[f.dev]["areas"].append({"area": f.area, "hours_lost": f.hours_lost, "trend": f.trend, "blocker": f.top_blocker})
        if f.trend == "increasing":
            devs[f.dev]["worst_trend"] = "increasing"
    return {
        dev: {
            "total_hours_lost": round(info["total_hours"], 1),
            "area_count": len(info["areas"]),
            "worst_trend": info["worst_trend"],
            "areas": info["areas"],
        }
        for dev, info in devs.items()
    }


def compute_empathy_dimensions_summary() -> dict:
    """Return average gap and lowest-action dimension."""
    if not EMPATHY_DIMENSIONS:
        return {"avg_gap": 0, "worst_dimension": "N/A"}
    avg_gap = round(sum(d.gap for d in EMPATHY_DIMENSIONS) / len(EMPATHY_DIMENSIONS), 1)
    worst = max(EMPATHY_DIMENSIONS, key=lambda d: d.gap)
    return {"avg_gap": avg_gap, "worst_dimension": worst.category, "worst_gap": worst.gap}
