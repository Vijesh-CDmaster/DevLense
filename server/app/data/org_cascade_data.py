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


# ══════════════════════════════════════════════
# AI Waste Classifier — The Novel Feature
# ══════════════════════════════════════════════

WASTE_ENTRIES = [
    {
        "waste_type": "rework",
        "label": "Rework Waste",
        "hours_consumed": 6.1,
        "detection_source": "PRs reopened/reverted within 48hrs of AI-assisted merge",
        "severity": "high",
        "detail": "7 PRs reopened, 3 fully reverted. AI-generated auth middleware had race conditions in 2 services.",
        "color": "#EF4444",
    },
    {
        "waste_type": "review_overflow",
        "label": "Review Overflow Waste",
        "hours_consumed": 9.2,
        "detection_source": "Review latency spikes correlated to AI commit density",
        "severity": "critical",
        "detail": "Avg review time jumped from 2.1h to 4.0h. AI-heavy PRs are 3.2x larger, blocking 4 reviewers.",
        "color": "#DC2626",
    },
    {
        "waste_type": "context_switch",
        "label": "Context Switch Waste",
        "hours_consumed": 4.8,
        "detection_source": "Developers touching >5 concurrent PRs in same session",
        "severity": "medium",
        "detail": "3 devs managing 7+ concurrent AI-generated PRs. Focus time dropped 47% for Raj and Meera.",
        "color": "#F59E0B",
    },
    {
        "waste_type": "quality_tax",
        "label": "Quality Tax Waste",
        "hours_consumed": 3.4,
        "detection_source": "Bug tickets opened within 7 days of AI-flagged commits",
        "severity": "medium",
        "detail": "11 bug tickets traced to AI-assisted commits. 4 were null-pointer issues in generated code.",
        "color": "#F97316",
    },
    {
        "waste_type": "coordination",
        "label": "Coordination Waste",
        "hours_consumed": 4.5,
        "detection_source": "Meeting/comment volume spikes post AI-heavy sprints",
        "severity": "medium",
        "detail": "PR comment volume up 62%. 3 extra sync meetings scheduled to align on AI-generated architecture.",
        "color": "#8B5CF6",
    },
]

WASTE_WEEKLY_TRENDS = [
    {
        "week": "Week 1",
        "rework": 8.2, "review_overflow": 11.0, "context_switch": 5.1,
        "quality_tax": 4.8, "coordination": 5.5,
        "total_waste": 34.6, "gross_gain": 42.0, "net_gain": 7.4,
    },
    {
        "week": "Week 2",
        "rework": 7.1, "review_overflow": 10.3, "context_switch": 5.4,
        "quality_tax": 3.9, "coordination": 4.8,
        "total_waste": 31.5, "gross_gain": 44.0, "net_gain": 12.5,
    },
    {
        "week": "Week 3",
        "rework": 6.5, "review_overflow": 9.8, "context_switch": 4.6,
        "quality_tax": 3.2, "coordination": 4.2,
        "total_waste": 28.3, "gross_gain": 46.0, "net_gain": 17.7,
    },
    {
        "week": "Week 4",
        "rework": 6.1, "review_overflow": 9.2, "context_switch": 4.8,
        "quality_tax": 3.4, "coordination": 4.5,
        "total_waste": 28.0, "gross_gain": 48.0, "net_gain": 20.0,
    },
]

TRUE_AI_ROI = {
    "period": "This Week (Week 4)",
    "ai_assisted_commits": 340,
    "gross_hours_saved": 28.0,
    "waste_breakdown": [
        {"type": "Review Overflow", "hours": 9.2, "pct": 32.9},
        {"type": "Rework Loops", "hours": 6.1, "pct": 21.8},
        {"type": "Context Switching", "hours": 4.8, "pct": 17.1},
        {"type": "Coordination Tax", "hours": 4.5, "pct": 16.1},
        {"type": "Quality Tax", "hours": 3.4, "pct": 12.1},
    ],
    "net_org_gain": 9.3,
    "waste_absorption_rate": 66.8,
}

TEAM_WASTE_BREAKDOWN = [
    {
        "team": "Platform Core",
        "total_waste_hrs": 12.4,
        "dominant_waste": "review_overflow",
        "rework": 2.1, "review_overflow": 4.8, "context_switch": 2.3,
        "quality_tax": 1.5, "coordination": 1.7,
        "waste_absorption_rate": 72.1,
    },
    {
        "team": "API Services",
        "total_waste_hrs": 8.6,
        "dominant_waste": "rework",
        "rework": 3.2, "review_overflow": 2.1, "context_switch": 1.2,
        "quality_tax": 1.1, "coordination": 1.0,
        "waste_absorption_rate": 58.3,
    },
    {
        "team": "Frontend",
        "total_waste_hrs": 5.2,
        "dominant_waste": "context_switch",
        "rework": 0.8, "review_overflow": 1.5, "context_switch": 1.8,
        "quality_tax": 0.5, "coordination": 0.6,
        "waste_absorption_rate": 44.1,
    },
    {
        "team": "Data Pipeline",
        "total_waste_hrs": 3.8,
        "dominant_waste": "quality_tax",
        "rework": 0.4, "review_overflow": 0.8, "context_switch": 0.5,
        "quality_tax": 1.3, "coordination": 0.8,
        "waste_absorption_rate": 39.2,
    },
]


# ══════════════════════════════════════════════
# DORA-AI Cascade Dashboard — Enhanced
# ══════════════════════════════════════════════

CASCADE_EFFICIENCY = {
    "score": 33.2,
    "individual_gain_pct": 21.0,
    "team_throughput_pct": 7.8,
    "org_delivery_pct": 7.0,
    "trend": "slowly_improving",
    "leak_stages": [
        {"stage": "Code Review Bottleneck", "loss_pct": 18.0, "reason": "AI-generated PRs are 3.2x larger, overwhelming reviewers"},
        {"stage": "Deploy Pipeline", "loss_pct": 8.0, "reason": "Multi-stage CI/CD adds 45min per deploy, negating fast coding"},
        {"stage": "Meeting Overhead", "loss_pct": 5.0, "reason": "More code = more coordination meetings to align on direction"},
        {"stage": "Context Switch Tax", "loss_pct": 3.0, "reason": "Developers juggle 47% more concurrent work items with AI"},
    ],
}

TEAM_CASCADE_VIEWS = [
    {
        "team": "Platform Core",
        "ai_usage_pct": 92,
        "pr_volume": 47,
        "pr_review_latency_hrs": 6.2,
        "deploy_frequency": 1.8,
        "lead_time_days": 5.1,
        "cascade_efficiency": 28.4,
        "waste_absorption_rate": 72.1,
        "platform_maturity": "low",
    },
    {
        "team": "API Services",
        "ai_usage_pct": 85,
        "pr_volume": 38,
        "pr_review_latency_hrs": 3.4,
        "deploy_frequency": 3.2,
        "lead_time_days": 3.8,
        "cascade_efficiency": 41.6,
        "waste_absorption_rate": 58.3,
        "platform_maturity": "medium",
    },
    {
        "team": "Frontend",
        "ai_usage_pct": 71,
        "pr_volume": 29,
        "pr_review_latency_hrs": 2.1,
        "deploy_frequency": 4.5,
        "lead_time_days": 2.4,
        "cascade_efficiency": 55.9,
        "waste_absorption_rate": 44.1,
        "platform_maturity": "high",
    },
    {
        "team": "Data Pipeline",
        "ai_usage_pct": 64,
        "pr_volume": 18,
        "pr_review_latency_hrs": 1.8,
        "deploy_frequency": 5.1,
        "lead_time_days": 1.9,
        "cascade_efficiency": 60.8,
        "waste_absorption_rate": 39.2,
        "platform_maturity": "high",
    },
]

FLOW_STAGE_DETAILS = [
    {
        "stage": "AI Code Generation",
        "source": "GitHub Copilot API / IDE telemetry",
        "value_in": 100.0, "value_out": 100.0, "loss": 0.0,
        "leak_reason": "—",
        "color": "#00D4FF",
    },
    {
        "stage": "PR Creation & Review",
        "source": "GitHub API (PR volume, size, review latency)",
        "value_in": 100.0, "value_out": 67.1, "loss": 32.9,
        "leak_reason": "Review overflow: AI-generated PRs 3.2x larger, review time +91%",
        "color": "#7C3AED",
    },
    {
        "stage": "CI/CD & Deployment",
        "source": "GitHub Actions webhooks",
        "value_in": 67.1, "value_out": 52.3, "loss": 14.8,
        "leak_reason": "Pipeline waits absorb fast coding gains; +45min avg deploy cycle",
        "color": "#F59E0B",
    },
    {
        "stage": "Team Coordination",
        "source": "Jira comments + PR discussions",
        "value_in": 52.3, "value_out": 41.5, "loss": 10.8,
        "leak_reason": "62% more PR comments, 3 extra sync meetings per sprint",
        "color": "#F97316",
    },
    {
        "stage": "Org Delivery",
        "source": "Jira API (story points planned vs completed)",
        "value_in": 41.5, "value_out": 33.2, "loss": 8.3,
        "leak_reason": "Rework loops + quality tax consume remaining gains",
        "color": "#EF4444",
    },
]

STORY_POINT_TRACKER = [
    {"sprint": "Sprint 21", "planned": 84, "completed": 71, "ai_assisted_pct": 58, "delivery_rate": 84.5},
    {"sprint": "Sprint 22", "planned": 89, "completed": 74, "ai_assisted_pct": 65, "delivery_rate": 83.1},
    {"sprint": "Sprint 23", "planned": 92, "completed": 78, "ai_assisted_pct": 72, "delivery_rate": 84.8},
    {"sprint": "Sprint 24", "planned": 97, "completed": 79, "ai_assisted_pct": 78, "delivery_rate": 81.4},
    {"sprint": "Sprint 25", "planned": 103, "completed": 81, "ai_assisted_pct": 82, "delivery_rate": 78.6},
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
        # AI Waste Classifier
        "waste_entries": WASTE_ENTRIES,
        "waste_trends": WASTE_WEEKLY_TRENDS,
        "true_ai_roi": TRUE_AI_ROI,
        "team_waste": TEAM_WASTE_BREAKDOWN,
        # DORA-AI Cascade
        "cascade_efficiency": CASCADE_EFFICIENCY,
        "team_cascades": TEAM_CASCADE_VIEWS,
        "flow_details": FLOW_STAGE_DETAILS,
        "story_points": STORY_POINT_TRACKER,
    }
