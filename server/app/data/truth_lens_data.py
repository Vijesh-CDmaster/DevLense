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


def get_full_dashboard(threshold: int = 20) -> TruthLensDashboard:
    """Return the complete Truth Lens dashboard payload."""
    return TruthLensDashboard(
        illusion_score=ILLUSION_SCORE,
        gauges=GAUGE_DATA,
        divergence_timeline=DIVERGENCE_TIMELINE,
        dev_breakdown=DEV_BREAKDOWN,
        self_report_comparator=SELF_REPORT_COMPARATOR,
        weekly_drift=WEEKLY_DRIFT,
        alerts=ALERT_HISTORY,
        recent_surveys=RECENT_SURVEYS,
        alert_config=AlertConfig(threshold_pct=threshold),
    )
