"""Productivity Hub API router — /api/productivity-hub/*."""

from fastapi import APIRouter

from app.models.productivity_hub import (
    ProductivityDashboard,
    HPSRadarPoint, HPSDimension, HPSWeekly,
    DevFlowScore, FlowTimelineSlot,
    ContextSwitchMetric, CognitiveLoadHourly,
    AIQualityModule, AIQualityTrendPoint,
    ReworkSprint, ReworkPR,
)
from app.data.productivity_hub_data import (
    get_full_dashboard,
    get_hps_radar, get_dimensions, get_hps_weekly,
    get_dev_flow_scores, get_flow_timeline,
    get_context_switches, get_cognitive_load_hourly,
    get_ai_quality_by_module, get_ai_quality_trend,
    get_rework_data, get_rework_prs,
)
from app.services import ide_telemetry, calendar_service

router = APIRouter(prefix="/api/productivity-hub", tags=["Productivity Hub"])


# ── Full dashboard (single call) ──

@router.get("/dashboard", response_model=ProductivityDashboard)
async def dashboard():
    """Return the entire Productivity Hub payload in one shot."""
    return get_full_dashboard()


# ── HPS endpoints ──

@router.get("/hps/radar", response_model=list[HPSRadarPoint])
async def hps_radar():
    return get_hps_radar()


@router.get("/hps/dimensions", response_model=list[HPSDimension])
async def hps_dimensions():
    return get_dimensions()


@router.get("/hps/weekly", response_model=list[HPSWeekly])
async def hps_weekly():
    return get_hps_weekly()


# ── FLOW Score endpoints ──

@router.get("/flow/scores", response_model=list[DevFlowScore])
async def flow_scores():
    return await ide_telemetry.fetch_flow_scores()


@router.get("/flow/timeline", response_model=list[FlowTimelineSlot])
async def flow_timeline():
    return await ide_telemetry.fetch_flow_timeline()


# ── Cognitive Load endpoints ──

@router.get("/cognitive/switches", response_model=list[ContextSwitchMetric])
async def context_switches():
    return await ide_telemetry.fetch_context_switches()


@router.get("/cognitive/hourly", response_model=list[CognitiveLoadHourly])
async def cognitive_load_hourly():
    return await ide_telemetry.fetch_cognitive_load_hourly()


# ── AI Quality Ratio endpoints ──

@router.get("/ai-quality/modules", response_model=list[AIQualityModule])
async def ai_quality_modules():
    return get_ai_quality_by_module()


@router.get("/ai-quality/trend", response_model=list[AIQualityTrendPoint])
async def ai_quality_trend():
    return get_ai_quality_trend()


# ── Rework Attribution endpoints ──

@router.get("/rework/sprints", response_model=list[ReworkSprint])
async def rework_sprints():
    return get_rework_data()


@router.get("/rework/prs", response_model=list[ReworkPR])
async def rework_prs():
    return get_rework_prs()


# ── Calendar / Meetings ──

@router.get("/calendar/today")
async def calendar_today():
    hours = await calendar_service.meeting_hours_today()
    count = await calendar_service.meeting_count_today()
    return {"meeting_hours": hours, "meeting_count": count}
