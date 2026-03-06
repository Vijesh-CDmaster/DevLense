"""Mock data for Productivity Hub — mirrors frontend arrays exactly."""

from app.models.productivity_hub import (
    HPSRadarPoint, HPSDimension, HPSWeekly,
    DevFlowScore, FlowTimelineSlot,
    ContextSwitchMetric, CognitiveLoadHourly,
    AIQualityModule, AIQualityTrendPoint,
    ReworkSprint, ReworkPR,
    ProductivityDashboard,
)

# ── HPS ──

_hps_radar: list[HPSRadarPoint] = [
    HPSRadarPoint(dimension="Speed", value=80),
    HPSRadarPoint(dimension="Quality", value=60),
    HPSRadarPoint(dimension="Wellbeing", value=55),
    HPSRadarPoint(dimension="Collab", value=70),
    HPSRadarPoint(dimension="AI Ratio", value=62),
]

_dimensions: list[HPSDimension] = [
    HPSDimension(label="Speed", value=80, color="#00D4FF", weight=25),
    HPSDimension(label="Quality", value=60, color="#7C3AED", weight=30),
    HPSDimension(label="Wellbeing", value=55, color="#10B981", weight=20),
    HPSDimension(label="Collaboration", value=70, color="#F59E0B", weight=15),
    HPSDimension(label="AI Quality Ratio", value=62, color="#EF4444", weight=10),
]

_hps_weekly: list[HPSWeekly] = [
    HPSWeekly(week="W1", hps=78, speed=82, quality=72, wellbeing=68, collab=74, ai_ratio=75),
    HPSWeekly(week="W2", hps=77, speed=83, quality=70, wellbeing=65, collab=73, ai_ratio=72),
    HPSWeekly(week="W3", hps=75, speed=81, quality=66, wellbeing=62, collab=72, ai_ratio=68),
    HPSWeekly(week="W4", hps=74, speed=80, quality=64, wellbeing=60, collab=71, ai_ratio=65),
    HPSWeekly(week="W5", hps=73, speed=82, quality=62, wellbeing=57, collab=70, ai_ratio=63),
    HPSWeekly(week="W6", hps=72, speed=80, quality=60, wellbeing=55, collab=70, ai_ratio=62),
]

# ── FLOW Score ──

_dev_flow_scores: list[DevFlowScore] = [
    DevFlowScore(name="Raj Kumar", deep_work=2.1, interrupted=2.8, meetings=2.3, flow_score=38, trend="down", delta=-8),
    DevFlowScore(name="Priya S.", deep_work=3.4, interrupted=1.6, meetings=2.1, flow_score=52, trend="down", delta=-3),
    DevFlowScore(name="Arjun M.", deep_work=4.8, interrupted=0.9, meetings=1.4, flow_score=74, trend="up", delta=5),
    DevFlowScore(name="Meena R.", deep_work=5.2, interrupted=0.6, meetings=1.3, flow_score=81, trend="up", delta=2),
    DevFlowScore(name="Dev K.", deep_work=1.8, interrupted=3.1, meetings=2.6, flow_score=31, trend="down", delta=-12),
]

_flow_timeline: list[FlowTimelineSlot] = [
    FlowTimelineSlot(hour="9 AM", deep=0, interrupted=1, meeting=0),
    FlowTimelineSlot(hour="10 AM", deep=1, interrupted=0, meeting=0),
    FlowTimelineSlot(hour="11 AM", deep=1, interrupted=0, meeting=0),
    FlowTimelineSlot(hour="12 PM", deep=0, interrupted=0, meeting=1),
    FlowTimelineSlot(hour="1 PM", deep=0, interrupted=1, meeting=0),
    FlowTimelineSlot(hour="2 PM", deep=1, interrupted=0, meeting=0),
    FlowTimelineSlot(hour="3 PM", deep=0, interrupted=0, meeting=1),
    FlowTimelineSlot(hour="4 PM", deep=0, interrupted=1, meeting=0),
    FlowTimelineSlot(hour="5 PM", deep=1, interrupted=0, meeting=0),
]

# ── Cognitive Load ──

_context_switches: list[ContextSwitchMetric] = [
    ContextSwitchMetric(label="Context Switches", value=14, icon="🔀", threshold=10, unit="/day"),
    ContextSwitchMetric(label="Tool Switches", value=8, icon="⚙️", threshold=6, unit="/day"),
    ContextSwitchMetric(label="Meetings Today", value=4, icon="📅", threshold=3, unit="today"),
    ContextSwitchMetric(label="Interruptions", value=11, icon="🔔", threshold=8, unit="/day"),
]

_cognitive_load_hourly: list[CognitiveLoadHourly] = [
    CognitiveLoadHourly(hour="9 AM", load=22),
    CognitiveLoadHourly(hour="10 AM", load=35),
    CognitiveLoadHourly(hour="11 AM", load=68),
    CognitiveLoadHourly(hour="12 PM", load=42),
    CognitiveLoadHourly(hour="1 PM", load=55),
    CognitiveLoadHourly(hour="2 PM", load=78),
    CognitiveLoadHourly(hour="3 PM", load=85),
    CognitiveLoadHourly(hour="4 PM", load=62),
    CognitiveLoadHourly(hour="5 PM", load=48),
]

# ── AI Quality Ratio ──

_ai_quality_by_module: list[AIQualityModule] = [
    AIQualityModule(module="auth/", accepted=34, reverted=18, modified=12, ratio=53, level="red"),
    AIQualityModule(module="payments/", accepted=28, reverted=8, modified=9, ratio=62, level="amber"),
    AIQualityModule(module="user/", accepted=45, reverted=4, modified=6, ratio=82, level="green"),
    AIQualityModule(module="api/routes", accepted=22, reverted=7, modified=5, ratio=65, level="amber"),
    AIQualityModule(module="notifications/", accepted=19, reverted=3, modified=4, ratio=73, level="green"),
    AIQualityModule(module="reporting/", accepted=15, reverted=11, modified=8, ratio=44, level="red"),
]

_ai_quality_trend: list[AIQualityTrendPoint] = [
    AIQualityTrendPoint(sprint="Sprint 1", ratio=78),
    AIQualityTrendPoint(sprint="Sprint 2", ratio=72),
    AIQualityTrendPoint(sprint="Sprint 3", ratio=65),
    AIQualityTrendPoint(sprint="Sprint 4", ratio=58),
    AIQualityTrendPoint(sprint="Sprint 5", ratio=53),
]

# ── Rework Attribution ──

_rework_data: list[ReworkSprint] = [
    ReworkSprint(sprint="Sprint 1", survived=88, reverted=12),
    ReworkSprint(sprint="Sprint 2", survived=79, reverted=21),
    ReworkSprint(sprint="Sprint 3", survived=72, reverted=28),
    ReworkSprint(sprint="Sprint 4", survived=62, reverted=38),
    ReworkSprint(sprint="Sprint 5", survived=58, reverted=42),
]

_rework_prs: list[ReworkPR] = [
    ReworkPR(
        pr="#487", title="Refactor auth token refresh flow", dev="Raj Kumar",
        ai_pct=78, rework_hrs=6.2,
        reason="AI-generated logic conflicted with existing session management — full rewrite needed",
        file="auth/jwt.ts", status="reverted",
    ),
    ReworkPR(
        pr="#491", title="Add payment webhook validation", dev="Dev K.",
        ai_pct=92, rework_hrs=4.8,
        reason="AI copy-pasted error handling pattern — missed idempotency key validation",
        file="payments/webhook.ts", status="reverted",
    ),
    ReworkPR(
        pr="#495", title="User profile PATCH endpoint", dev="Priya S.",
        ai_pct=65, rework_hrs=1.4,
        reason="AI suggestion lacked input sanitisation for nested objects — security review flagged",
        file="api/users.ts", status="modified",
    ),
    ReworkPR(
        pr="#498", title="Notification retry logic", dev="Dev K.",
        ai_pct=88, rework_hrs=3.1,
        reason="AI-generated exponential backoff had no jitter — would cause thundering herd in production",
        file="notifications/retry.ts", status="modified",
    ),
    ReworkPR(
        pr="#502", title="Report export CSV generation", dev="Raj Kumar",
        ai_pct=95, rework_hrs=5.6,
        reason="Entire function AI-generated — failed on datasets >10K rows, memory leak in stream handling",
        file="reporting/export.ts", status="reverted",
    ),
]


def get_full_dashboard() -> ProductivityDashboard:
    """Return the complete Productivity Hub dashboard payload."""
    return ProductivityDashboard(
        hps_radar=_hps_radar,
        dimensions=_dimensions,
        hps_weekly=_hps_weekly,
        dev_flow_scores=_dev_flow_scores,
        flow_timeline=_flow_timeline,
        context_switches=_context_switches,
        cognitive_load_hourly=_cognitive_load_hourly,
        ai_quality_by_module=_ai_quality_by_module,
        ai_quality_trend=_ai_quality_trend,
        rework_data=_rework_data,
        rework_prs=_rework_prs,
    )


def get_hps_radar() -> list[HPSRadarPoint]:
    return list(_hps_radar)

def get_dimensions() -> list[HPSDimension]:
    return list(_dimensions)

def get_hps_weekly() -> list[HPSWeekly]:
    return list(_hps_weekly)

def get_dev_flow_scores() -> list[DevFlowScore]:
    return list(_dev_flow_scores)

def get_flow_timeline() -> list[FlowTimelineSlot]:
    return list(_flow_timeline)

def get_context_switches() -> list[ContextSwitchMetric]:
    return list(_context_switches)

def get_cognitive_load_hourly() -> list[CognitiveLoadHourly]:
    return list(_cognitive_load_hourly)

def get_ai_quality_by_module() -> list[AIQualityModule]:
    return list(_ai_quality_by_module)

def get_ai_quality_trend() -> list[AIQualityTrendPoint]:
    return list(_ai_quality_trend)

def get_rework_data() -> list[ReworkSprint]:
    return list(_rework_data)

def get_rework_prs() -> list[ReworkPR]:
    return list(_rework_prs)
