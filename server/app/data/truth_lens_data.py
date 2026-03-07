"""Mock data for Truth Lens — mirrors the React frontend data structures exactly."""

from app.models.truth_lens import (
    AlertConfig,
    DevBreakdown,
    DivergencePoint,
    GaugeData,
    IllusionDimension,
    IllusionScore,
    ManagerAlert,
    SelfReportEntry,
    SurveyResponse,
    TruthLensDashboard,
    WeeklyDrift,
)

# ── Divergence Timeline (6 months) ──
DIVERGENCE_TIMELINE: list[DivergencePoint] = [
    DivergencePoint(month="Jan", belief=15, reality=12, gap=3),
    DivergencePoint(month="Feb", belief=18, reality=10, gap=8),
    DivergencePoint(month="Mar", belief=22, reality=5, gap=17),
    DivergencePoint(month="Apr", belief=25, reality=-8, gap=33),
    DivergencePoint(month="May", belief=20, reality=-12, gap=32),
    DivergencePoint(month="Jun", belief=20, reality=-19, gap=39),
]

# ── Developer Breakdown ──
DEV_BREAKDOWN: list[DevBreakdown] = [
    DevBreakdown(name="Raj Kumar", belief="+25%", reality="-12%", gap=37, level="red"),
    DevBreakdown(name="Priya S.", belief="+18%", reality="+5%", gap=13, level="amber"),
    DevBreakdown(name="Arjun M.", belief="+30%", reality="+28%", gap=2, level="green"),
    DevBreakdown(name="Meena R.", belief="+22%", reality="+19%", gap=3, level="green"),
    DevBreakdown(name="Dev K.", belief="+35%", reality="-22%", gap=57, level="red"),
]

# ── Real-time Self-Report vs Telemetry Comparator ──
SELF_REPORT_COMPARATOR: list[SelfReportEntry] = [
    SelfReportEntry(
        dev="Raj Kumar",
        task="Auth token refresh refactor",
        self_report="Saved ~2 hrs with AI",
        actual_time="4.3h (3.1h avg for this task type)",
        self_gain="+35%",
        telemetry_gain="-38%",
        timestamp="2:14 PM today",
    ),
    SelfReportEntry(
        dev="Priya S.",
        task="Unit tests for payment service",
        self_report="AI generated 12 tests in 20min",
        actual_time="48min (32min avg)",
        self_gain="+60%",
        telemetry_gain="-50%",
        timestamp="11:42 AM today",
    ),
    SelfReportEntry(
        dev="Arjun M.",
        task="REST endpoint for user profile",
        self_report="Copilot got it mostly right",
        actual_time="22min (25min avg)",
        self_gain="+12%",
        telemetry_gain="+12%",
        timestamp="10:08 AM today",
    ),
    SelfReportEntry(
        dev="Dev K.",
        task="Database migration script",
        self_report="AI wrote the migration perfectly",
        actual_time="1.8h (0.9h avg) + 2 reverts",
        self_gain="+50%",
        telemetry_gain="-100%",
        timestamp="9:31 AM today",
    ),
]

# ── Weekly Perception Drift ──
WEEKLY_DRIFT: list[WeeklyDrift] = [
    WeeklyDrift(week="W1", belief=22, reality=18, gap=4, momentum="stable"),
    WeeklyDrift(week="W2", belief=24, reality=14, gap=10, momentum="widening"),
    WeeklyDrift(week="W3", belief=23, reality=8, gap=15, momentum="widening"),
    WeeklyDrift(week="W4", belief=26, reality=2, gap=24, momentum="widening"),
    WeeklyDrift(week="W5", belief=25, reality=-4, gap=29, momentum="widening"),
    WeeklyDrift(week="W6", belief=22, reality=-9, gap=31, momentum="widening"),
    WeeklyDrift(week="W7", belief=21, reality=-14, gap=35, momentum="accelerating"),
    WeeklyDrift(week="W8", belief=20, reality=-19, gap=39, momentum="accelerating"),
]

# ── Manager Alert History ──
ALERT_HISTORY: list[ManagerAlert] = [
    ManagerAlert(
        id=1,
        type="threshold",
        severity="red",
        msg="Dev K. perception gap hit 57% — exceeds 20% threshold by 37pts",
        action="Auto-notified manager + scheduled 1:1",
        time="35 min ago",
        resolved=False,
    ),
    ManagerAlert(
        id=2,
        type="threshold",
        severity="red",
        msg="Raj Kumar gap reached 37% — 3rd consecutive week above threshold",
        action="Escalated to engineering lead",
        time="2 hrs ago",
        resolved=False,
    ),
    ManagerAlert(
        id=3,
        type="drift",
        severity="amber",
        msg="Team-wide perception drift rate accelerating — gap grew 4pts this week",
        action="Weekly reality report sent to team",
        time="1 day ago",
        resolved=True,
    ),
    ManagerAlert(
        id=4,
        type="threshold",
        severity="amber",
        msg="Priya S. gap crossed 13% — approaching 20% alert threshold",
        action="Added to monitoring watchlist",
        time="2 days ago",
        resolved=True,
    ),
    ManagerAlert(
        id=5,
        type="drift",
        severity="green",
        msg="Arjun M. perception gap stable at 2% for 4 consecutive weeks",
        action="Marked as well-calibrated developer",
        time="3 days ago",
        resolved=True,
    ),
]

# ── Micro-Survey Responses ──
RECENT_SURVEYS: list[SurveyResponse] = [
    SurveyResponse(dev="Raj K.", question="How much did AI speed up this task?", answer="~35% faster", real_delta="-38%", time="2:14 PM"),
    SurveyResponse(dev="Priya S.", question="Rate AI helpfulness (1-10)", answer="8/10", real_delta="-50%", time="11:42 AM"),
    SurveyResponse(dev="Arjun M.", question="Would you have been faster without AI?", answer="No", real_delta="+12%", time="10:08 AM"),
    SurveyResponse(dev="Dev K.", question="How much did AI speed up this task?", answer="~50% faster", real_delta="-100%", time="9:31 AM"),
    SurveyResponse(dev="Meena R.", question="Rate AI helpfulness (1-10)", answer="7/10", real_delta="+19%", time="Yesterday"),
]

# ── Illusion Score ──
ILLUSION_SCORE = IllusionScore(
    score=64,
    drift_rate="+4pts/wk",
    threshold=20,
    dimensions=[
        IllusionDimension(dimension="Code Speed", belief=78, reality=42, icon="⚡"),
        IllusionDimension(dimension="Code Quality", belief=72, reality=38, icon="🎯"),
        IllusionDimension(dimension="Bug Resolution", belief=65, reality=55, icon="🐛"),
        IllusionDimension(dimension="Test Coverage", belief=80, reality=61, icon="🧪"),
        IllusionDimension(dimension="Review Throughput", belief=60, reality=58, icon="👀"),
    ],
)

# ── Gauge Data ──
GAUGE_DATA = GaugeData(
    team_belief="+20%",
    telemetry_reality="-19%",
    belief_sub="Average self-reported AI productivity gain",
    reality_sub="Actual measured impact on experienced developers",
)


# ══════════════════════════════════════════════
# Belief Audit Engine — Per-Developer Weekly Audits
# ══════════════════════════════════════════════

BELIEF_AUDITS = [
    {
        "developer": "Dev K.",
        "week_label": "Week of Mar 3",
        "daily": [
            {"day": "Mon", "self_reported": 38, "telemetry": 11, "gap": 27},
            {"day": "Tue", "self_reported": 42, "telemetry": -6, "gap": 48},
            {"day": "Wed", "self_reported": 51, "telemetry": 17, "gap": 34},
            {"day": "Thu", "self_reported": 44, "telemetry": -2, "gap": 46},
            {"day": "Fri", "self_reported": 39, "telemetry": 9, "gap": 30},
        ],
        "avg_self_reported": 42.8,
        "avg_telemetry": 5.8,
        "avg_gap": 37.0,
        "bias_pattern": "Consistent Optimism Bias — 5-day streak",
        "bias_type": "Effort Substitution",
        "alert_status": "notified",
        "streak_days": 5,
    },
    {
        "developer": "Raj Kumar",
        "week_label": "Week of Mar 3",
        "daily": [
            {"day": "Mon", "self_reported": 35, "telemetry": -8, "gap": 43},
            {"day": "Tue", "self_reported": 28, "telemetry": 2, "gap": 26},
            {"day": "Wed", "self_reported": 32, "telemetry": -12, "gap": 44},
            {"day": "Thu", "self_reported": 41, "telemetry": 5, "gap": 36},
            {"day": "Fri", "self_reported": 30, "telemetry": -3, "gap": 33},
        ],
        "avg_self_reported": 33.2,
        "avg_telemetry": -3.2,
        "avg_gap": 36.4,
        "bias_pattern": "Fluctuating Optimism Bias — variable but always positive",
        "bias_type": "Automation Bias",
        "alert_status": "escalated",
        "streak_days": 5,
    },
    {
        "developer": "Priya S.",
        "week_label": "Week of Mar 3",
        "daily": [
            {"day": "Mon", "self_reported": 18, "telemetry": 5, "gap": 13},
            {"day": "Tue", "self_reported": 22, "telemetry": 8, "gap": 14},
            {"day": "Wed", "self_reported": 15, "telemetry": 12, "gap": 3},
            {"day": "Thu", "self_reported": 20, "telemetry": 6, "gap": 14},
            {"day": "Fri", "self_reported": 19, "telemetry": 10, "gap": 9},
        ],
        "avg_self_reported": 18.8,
        "avg_telemetry": 8.2,
        "avg_gap": 10.6,
        "bias_pattern": "Mild Optimism Bias — approaching threshold",
        "bias_type": "Novelty Effect",
        "alert_status": "monitoring",
        "streak_days": 4,
    },
    {
        "developer": "Arjun M.",
        "week_label": "Week of Mar 3",
        "daily": [
            {"day": "Mon", "self_reported": 12, "telemetry": 11, "gap": 1},
            {"day": "Tue", "self_reported": 15, "telemetry": 14, "gap": 1},
            {"day": "Wed", "self_reported": 10, "telemetry": 12, "gap": -2},
            {"day": "Thu", "self_reported": 14, "telemetry": 15, "gap": -1},
            {"day": "Fri", "self_reported": 13, "telemetry": 11, "gap": 2},
        ],
        "avg_self_reported": 12.8,
        "avg_telemetry": 12.6,
        "avg_gap": 0.2,
        "bias_pattern": "Well Calibrated — within ±5% threshold",
        "bias_type": "None",
        "alert_status": "none",
        "streak_days": 0,
    },
    {
        "developer": "Meena R.",
        "week_label": "Week of Mar 3",
        "daily": [
            {"day": "Mon", "self_reported": 22, "telemetry": 19, "gap": 3},
            {"day": "Tue", "self_reported": 20, "telemetry": 18, "gap": 2},
            {"day": "Wed", "self_reported": 25, "telemetry": 22, "gap": 3},
            {"day": "Thu", "self_reported": 18, "telemetry": 16, "gap": 2},
            {"day": "Fri", "self_reported": 21, "telemetry": 20, "gap": 1},
        ],
        "avg_self_reported": 21.2,
        "avg_telemetry": 19.0,
        "avg_gap": 2.2,
        "bias_pattern": "Well Calibrated — consistent minor optimism",
        "bias_type": "None",
        "alert_status": "none",
        "streak_days": 0,
    },
]

BIAS_TYPOLOGIES = [
    {
        "type": "Effort Substitution",
        "description": "Cognitive load relief mistaken for time savings — AI reduces perceived effort, creating a false sense of speed",
        "affected_developers": ["Dev K."],
        "severity": "critical",
        "prevalence_pct": 20.0,
    },
    {
        "type": "Automation Bias",
        "description": "Over-trust in AI output leading to reduced verification — accepts AI suggestions without adequate review",
        "affected_developers": ["Raj Kumar"],
        "severity": "high",
        "prevalence_pct": 20.0,
    },
    {
        "type": "Novelty Effect",
        "description": "Initial excitement with new AI features inflates perceived value — typically fades within 4-6 weeks",
        "affected_developers": ["Priya S."],
        "severity": "moderate",
        "prevalence_pct": 20.0,
    },
]

CALIBRATION_SCORES = [
    {"developer": "Dev K.", "score": 21, "direction": "over", "avg_divergence_pts": 37.0, "weeks_tracked": 8, "trend": "worsening"},
    {"developer": "Raj Kumar", "score": 28, "direction": "over", "avg_divergence_pts": 36.4, "weeks_tracked": 8, "trend": "stable"},
    {"developer": "Priya S.", "score": 58, "direction": "over", "avg_divergence_pts": 10.6, "weeks_tracked": 8, "trend": "improving"},
    {"developer": "Arjun M.", "score": 94, "direction": "calibrated", "avg_divergence_pts": 0.2, "weeks_tracked": 8, "trend": "stable"},
    {"developer": "Meena R.", "score": 91, "direction": "calibrated", "avg_divergence_pts": 2.2, "weeks_tracked": 8, "trend": "stable"},
]


# ══════════════════════════════════════════════
# Decision Contamination Tracker — The Novel Feature
# ══════════════════════════════════════════════

DECISION_SIGNALS = [
    {"id": 1, "event": "Sprint velocity commitment", "team": "Alpha", "detection_signal": "Sprint creation — 94 pts committed vs 67 pts 4-week avg (+40%)", "detected_at": "Mar 3, 9:15 AM", "status": "tracked"},
    {"id": 2, "event": "AI license renewal", "team": "Beta", "detection_signal": "Procurement calendar — Cursor Enterprise renewal + expansion request", "detected_at": "Feb 28, 2:30 PM", "status": "assessed"},
    {"id": 3, "event": "Headcount freeze citing AI", "team": "Gamma", "detection_signal": "HR system — 2 open reqs closed with note 'AI covering capacity'", "detected_at": "Feb 24, 11:00 AM", "status": "tracked"},
    {"id": 4, "event": "Roadmap promise to board", "team": "Platform", "detection_signal": "Calendar event tagged 'board review' — Q2 deliverables presentation in 12 days", "detected_at": "Mar 5, 3:45 PM", "status": "detected"},
    {"id": 5, "event": "Tool consolidation", "team": "Infrastructure", "detection_signal": "Finance — budget transfer from multi-tool to single Copilot license", "detected_at": "Feb 20, 10:00 AM", "status": "closed"},
]

CONTAMINATION_ASSESSMENTS = [
    {
        "decision_signal_id": 1,
        "event": "Sprint velocity commitment",
        "team": "Alpha",
        "committed_value": "94 story points",
        "baseline_value": "67 pts 4-week average",
        "spike_pct": 40.0,
        "evidence_quality_score": 21,
        "self_report_weeks": 8,
        "belief_calibration": 21,
        "bias_direction": "Consistent over-estimation",
        "telemetry_divergence": 38.4,
        "days_since_calibration": 54,
        "contamination_risk": "critical",
        "predicted_failure_pct": 68.0,
        "recommended_action": "Calibration review before sprint lock",
        "send_to": ["@engineering.manager", "@product.lead"],
    },
    {
        "decision_signal_id": 2,
        "event": "AI license renewal",
        "team": "Beta",
        "committed_value": "$62K annual Cursor Enterprise",
        "baseline_value": "$38K previous year",
        "spike_pct": 63.0,
        "evidence_quality_score": 34,
        "self_report_weeks": 6,
        "belief_calibration": 34,
        "bias_direction": "Moderate over-estimation",
        "telemetry_divergence": 24.8,
        "days_since_calibration": 38,
        "contamination_risk": "high",
        "predicted_failure_pct": 55.0,
        "recommended_action": "Request telemetry-backed ROI report before approval",
        "send_to": ["@engineering.director", "@finance.partner"],
    },
    {
        "decision_signal_id": 3,
        "event": "Headcount freeze citing AI",
        "team": "Gamma",
        "committed_value": "2 open positions closed",
        "baseline_value": "Team at 85% capacity before freeze",
        "spike_pct": 0,
        "evidence_quality_score": 19,
        "self_report_weeks": 4,
        "belief_calibration": 19,
        "bias_direction": "Severe over-estimation",
        "telemetry_divergence": 42.1,
        "days_since_calibration": 62,
        "contamination_risk": "critical",
        "predicted_failure_pct": 74.0,
        "recommended_action": "Re-open headcount discussion — AI productivity claims unsupported by telemetry",
        "send_to": ["@hr.partner", "@vp.engineering"],
    },
    {
        "decision_signal_id": 4,
        "event": "Roadmap promise to board",
        "team": "Platform",
        "committed_value": "8 features in Q2 roadmap",
        "baseline_value": "5 features avg last 3 quarters",
        "spike_pct": 60.0,
        "evidence_quality_score": 41,
        "self_report_weeks": 8,
        "belief_calibration": 41,
        "bias_direction": "Moderate over-estimation",
        "telemetry_divergence": 18.6,
        "days_since_calibration": 28,
        "contamination_risk": "high",
        "predicted_failure_pct": 48.0,
        "recommended_action": "Stress-test roadmap against telemetry baseline before board presentation",
        "send_to": ["@cto", "@product.vp"],
    },
    {
        "decision_signal_id": 5,
        "event": "Tool consolidation",
        "team": "Infrastructure",
        "committed_value": "Consolidate to single Copilot license",
        "baseline_value": "3-tool multi-vendor setup",
        "spike_pct": 0,
        "evidence_quality_score": 78,
        "self_report_weeks": 8,
        "belief_calibration": 78,
        "bias_direction": "Well-calibrated",
        "telemetry_divergence": 4.2,
        "days_since_calibration": 7,
        "contamination_risk": "low",
        "predicted_failure_pct": 12.0,
        "recommended_action": "Decision well-supported by telemetry — proceed",
        "send_to": [],
    },
]

POST_DECISION_OUTCOMES = [
    {
        "decision_signal_id": 1,
        "event": "Sprint velocity commitment",
        "team": "Alpha",
        "committed": "94 story points",
        "actual": "58 story points",
        "shortfall_pct": 38.0,
        "overtime_hrs": 14.2,
        "overtime_cost": 4260.0,
        "feature_delay_sprints": 2,
        "sla_missed": 1,
        "total_contamination_cost": 18400.0,
        "eqs_at_decision": 21,
        "avoidable": "HIGH",
    },
    {
        "decision_signal_id": 3,
        "event": "Headcount freeze citing AI",
        "team": "Gamma",
        "committed": "AI covers 2 FTE capacity",
        "actual": "Team at 68% throughput — burnout signals rising",
        "shortfall_pct": 32.0,
        "overtime_hrs": 22.5,
        "overtime_cost": 6750.0,
        "feature_delay_sprints": 3,
        "sla_missed": 2,
        "total_contamination_cost": 34200.0,
        "eqs_at_decision": 19,
        "avoidable": "HIGH",
    },
]

ORG_CONTAMINATION = {
    "quarter": "Q1 2026",
    "entries": [
        {"team": "Alpha", "decision": "Sprint overcommit", "eqs": 21, "eqs_level": "red", "outcome": "Failed", "cost": "$18.4K"},
        {"team": "Beta", "decision": "AI license renewal", "eqs": 34, "eqs_level": "amber", "outcome": "Under review", "cost": "$62K sunk"},
        {"team": "Gamma", "decision": "Headcount freeze", "eqs": 19, "eqs_level": "red", "outcome": "Failed", "cost": "$34.2K"},
        {"team": "Platform", "decision": "Roadmap promise", "eqs": 41, "eqs_level": "amber", "outcome": "At risk", "cost": "TBD"},
        {"team": "Infrastructure", "decision": "Tool consolidation", "eqs": 78, "eqs_level": "green", "outcome": "On track", "cost": "Saved $14K"},
    ],
    "decisions_below_40": 3,
    "total_decisions": 5,
    "estimated_preventable_cost": "$80K+",
}


def get_full_dashboard(threshold: int = 20) -> dict:
    """Return the complete Truth Lens dashboard payload."""
    return {
        "illusion_score": ILLUSION_SCORE.model_dump(),
        "gauges": GAUGE_DATA.model_dump(),
        "divergence_timeline": [d.model_dump() for d in DIVERGENCE_TIMELINE],
        "dev_breakdown": [d.model_dump() for d in DEV_BREAKDOWN],
        "self_report_comparator": [s.model_dump() for s in SELF_REPORT_COMPARATOR],
        "weekly_drift": [w.model_dump() for w in WEEKLY_DRIFT],
        "alerts": [a.model_dump() for a in ALERT_HISTORY],
        "recent_surveys": [s.model_dump() for s in RECENT_SURVEYS],
        "alert_config": {"threshold_pct": threshold},
        # Belief Audit Engine
        "belief_audits": BELIEF_AUDITS,
        "bias_typologies": BIAS_TYPOLOGIES,
        "calibration_scores": CALIBRATION_SCORES,
        # Decision Contamination Tracker
        "decision_signals": DECISION_SIGNALS,
        "contamination_assessments": CONTAMINATION_ASSESSMENTS,
        "post_decision_outcomes": POST_DECISION_OUTCOMES,
        "org_contamination": ORG_CONTAMINATION,
    }
