from fastapi import APIRouter
from app.data.toolchain_radar_data import (
    get_full_dashboard, DEVELOPERS, TRANSITION_MATRIX,
    HOURLY_TIMELINE, FRICTION_BY_TASK, TOOL_USAGE,
    WEEKLY_FRICTION, RECOVERY_TIMES, FRICTION_TRENDS,
    COGNITIVE_DEBT_SCORES, TEAM_DEBT_FORECAST, ROI_TRIGGERS,
)
from app.services.friction_analyzer import compute_friction_summary
from app.services.cognitive_debt import compute_team_debt_summary

router = APIRouter(prefix="/api/toolchain-radar", tags=["toolchain-radar"])


@router.get("/dashboard")
def dashboard():
    return get_full_dashboard()


@router.get("/developers")
def developers():
    return DEVELOPERS


@router.get("/transitions")
def transitions():
    return TRANSITION_MATRIX


@router.get("/hourly-timeline")
def hourly_timeline():
    return HOURLY_TIMELINE


@router.get("/friction-by-task")
def friction_by_task():
    return FRICTION_BY_TASK


@router.get("/tool-usage")
def tool_usage():
    return TOOL_USAGE


# ── Cross-Tool Friction Heatmap endpoints ──

@router.get("/weekly-friction")
def weekly_friction():
    return WEEKLY_FRICTION


@router.get("/recovery-times")
def recovery_times():
    return RECOVERY_TIMES


@router.get("/friction-trends")
def friction_trends():
    return FRICTION_TRENDS


@router.get("/friction-summary")
def friction_summary():
    return compute_friction_summary()


# ── Cognitive Debt Accumulator endpoints ──

@router.get("/cognitive-debt-scores")
def cognitive_debt_scores():
    return COGNITIVE_DEBT_SCORES


@router.get("/team-debt-forecast")
def team_debt_forecast():
    return TEAM_DEBT_FORECAST


@router.get("/roi-triggers")
def roi_triggers():
    return ROI_TRIGGERS


@router.get("/cognitive-debt-summary")
def cognitive_debt_summary():
    return compute_team_debt_summary()
