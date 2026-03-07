"""Productivity Hub API router — /api/productivity-hub/*."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key
from app.services import ide_telemetry, calendar_service

router = APIRouter(prefix="/api/productivity-hub", tags=["Productivity Hub"])


# ── Full dashboard (single call) ──

@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    """Return the entire Productivity Hub payload in one shot."""
    return await get_dashboard(db, "productivity_hub")


# ── HPS endpoints ──

@router.get("/hps/radar")
async def hps_radar(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "hps_radar")


@router.get("/hps/dimensions")
async def hps_dimensions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "dimensions")


@router.get("/hps/weekly")
async def hps_weekly(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "hps_weekly")


# ── FLOW Score endpoints ──

@router.get("/flow/scores")
async def flow_scores():
    return await ide_telemetry.fetch_flow_scores()


@router.get("/flow/timeline")
async def flow_timeline():
    return await ide_telemetry.fetch_flow_timeline()


# ── Cognitive Load endpoints ──

@router.get("/cognitive/switches")
async def context_switches():
    return await ide_telemetry.fetch_context_switches()


@router.get("/cognitive/hourly")
async def cognitive_load_hourly():
    return await ide_telemetry.fetch_cognitive_load_hourly()


# ── AI Quality Ratio endpoints ──

@router.get("/ai-quality/modules")
async def ai_quality_modules(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "ai_quality_by_module")


@router.get("/ai-quality/trend")
async def ai_quality_trend(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "ai_quality_trend")


# ── Rework Attribution endpoints ──

@router.get("/rework/sprints")
async def rework_sprints(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "rework_data")


@router.get("/rework/prs")
async def rework_prs(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "productivity_hub", "rework_prs")


# ── Calendar / Meetings ──

@router.get("/calendar/today")
async def calendar_today():
    hours = await calendar_service.meeting_hours_today()
    count = await calendar_service.meeting_count_today()
    return {"meeting_hours": hours, "meeting_count": count}
