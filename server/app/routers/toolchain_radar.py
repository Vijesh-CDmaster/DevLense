from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key
from app.services.friction_analyzer import compute_friction_summary
from app.services.cognitive_debt import compute_team_debt_summary

router = APIRouter(prefix="/api/toolchain-radar", tags=["toolchain-radar"])


@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await get_dashboard(db, "toolchain_radar")


@router.get("/developers")
async def developers(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "developers")


@router.get("/transitions")
async def transitions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "transition_matrix")


@router.get("/hourly-timeline")
async def hourly_timeline(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "hourly_timeline")


@router.get("/friction-by-task")
async def friction_by_task(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "friction_by_task")


@router.get("/tool-usage")
async def tool_usage(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "tool_usage")


# ── Cross-Tool Friction Heatmap endpoints ──

@router.get("/weekly-friction")
async def weekly_friction(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "weekly_friction")


@router.get("/recovery-times")
async def recovery_times(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "recovery_times")


@router.get("/friction-trends")
async def friction_trends(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "friction_trends")


@router.get("/friction-summary")
async def friction_summary():
    return compute_friction_summary()


# ── Cognitive Debt Accumulator endpoints ──

@router.get("/cognitive-debt-scores")
async def cognitive_debt_scores(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "cognitive_debt_scores")


@router.get("/team-debt-forecast")
async def team_debt_forecast(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "team_debt_forecast")


@router.get("/roi-triggers")
async def roi_triggers(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "toolchain_radar", "roi_triggers")


@router.get("/cognitive-debt-summary")
async def cognitive_debt_summary():
    return compute_team_debt_summary()
