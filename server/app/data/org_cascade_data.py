"""Mock data for Org Cascade — AI Productivity Paradox at Org Level."""

SUMMARY = {
    "org_gap": -31.8,
    "individual_gain": 21.0,
    "team_impact": 0.0,
}

DORA_METRICS = [
    {"metric": "Lead Time", "value": 4.2, "target": 2, "unit": "d"},
    {"metric": "Deploy Freq", "value": 2, "target": 5, "unit": "/wk"},
    {"metric": "MTTR", "value": 3.1, "target": 1, "unit": "h"},
    {"metric": "Fail Rate", "value": 12, "target": 5, "unit": "%"},
]

BOTTLENECKS = [
    {"label": "Code Review Delays", "loss": 18, "color": "#EF4444"},
    {"label": "Deploy Pipeline Waits", "loss": 8, "color": "#F59E0B"},
    {"label": "Meeting Overhead", "loss": 5, "color": "#F59E0B"},
    {"label": "Context Switching", "loss": 3, "color": "#10B981"},
]

AMPLIFIERS = [
    {"practice": "Daily standups < 15min", "impact": "Amplifier ✅", "color": "#10B981"},
    {"practice": "PR size < 200 lines", "impact": "Amplifier ✅", "color": "#10B981"},
    {"practice": "Manual code review > 48h", "impact": "Killer ❌", "color": "#EF4444"},
    {"practice": "Multi-stage CI/CD pipeline", "impact": "Killer ❌", "color": "#EF4444"},
    {"practice": "Pair programming sessions", "impact": "Amplifier ✅", "color": "#10B981"},
]

CASCADE_FLOW = [
    {"stage": "Individual AI Gains", "pct": 100, "color": "#00D4FF"},
    {"stage": "After Code Review", "pct": 82, "color": "#7C3AED"},
    {"stage": "After Deploy Pipeline", "pct": 74, "color": "#F59E0B"},
    {"stage": "After Team Meetings", "pct": 69, "color": "#F59E0B"},
    {"stage": "Org Delivery Impact", "pct": 66, "color": "#EF4444"},
]

ROI_REPORT = [
    {"week": "Week 1", "ai_investment": 12000, "measured_gain": 8400, "org_throughput_delta": -2.1, "effective_roi": -0.30},
    {"week": "Week 2", "ai_investment": 12000, "measured_gain": 9100, "org_throughput_delta": -1.5, "effective_roi": -0.24},
    {"week": "Week 3", "ai_investment": 12000, "measured_gain": 9800, "org_throughput_delta": 0.3, "effective_roi": -0.18},
    {"week": "Week 4", "ai_investment": 12000, "measured_gain": 10200, "org_throughput_delta": 1.1, "effective_roi": -0.15},
]

DORA_CORRELATIONS = [
    {"metric": "Lead Time", "ai_usage_pct": 78, "metric_change_pct": -2.1, "correlation": 0.12, "trend": "flat"},
    {"metric": "Deploy Freq", "ai_usage_pct": 78, "metric_change_pct": 0.5, "correlation": 0.08, "trend": "flat"},
    {"metric": "MTTR", "ai_usage_pct": 78, "metric_change_pct": -5.3, "correlation": 0.31, "trend": "improving"},
    {"metric": "Fail Rate", "ai_usage_pct": 78, "metric_change_pct": 3.2, "correlation": -0.22, "trend": "worsening"},
]


def get_full_dashboard():
    return {
        "summary": SUMMARY,
        "dora_metrics": DORA_METRICS,
        "bottlenecks": BOTTLENECKS,
        "amplifiers": AMPLIFIERS,
        "cascade_flow": CASCADE_FLOW,
        "roi_report": ROI_REPORT,
        "dora_correlations": DORA_CORRELATIONS,
    }
