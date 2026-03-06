from fastapi import APIRouter
from app.data.toolchain_radar_data import (
    get_full_dashboard, DEVELOPERS, TRANSITION_MATRIX,
    HOURLY_TIMELINE, FRICTION_BY_TASK, TOOL_USAGE,
)

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
