from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key
from app.services.waste_classifier import compute_waste_summary, compute_waste_trend_direction
from app.services.cascade_analyzer import compute_cascade_health, compute_story_point_gap

router = APIRouter(prefix="/api/org-cascade", tags=["org-cascade"])


@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await get_dashboard(db, "org_cascade")


@router.get("/summary")
async def summary(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "summary")


@router.get("/dora-metrics")
async def dora_metrics(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "dora_metrics")


@router.get("/bottlenecks")
async def bottlenecks(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "bottlenecks")


@router.get("/amplifiers")
async def amplifiers(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "amplifiers")


@router.get("/cascade-flow")
async def cascade_flow(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "cascade_flow")


@router.get("/roi-report")
async def roi_report(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "roi_report")


@router.get("/dora-correlations")
async def dora_correlations(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "dora_correlations")


# ── AI Waste Classifier endpoints ──

@router.get("/waste-entries")
async def waste_entries(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "waste_entries")


@router.get("/waste-summary")
def waste_summary():
    return compute_waste_summary()


@router.get("/waste-trends")
async def waste_trends(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "waste_trends")


@router.get("/waste-trend-direction")
def waste_trend_direction():
    return compute_waste_trend_direction()


@router.get("/true-ai-roi")
async def true_ai_roi(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "true_ai_roi")


@router.get("/team-waste")
async def team_waste(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "team_waste")


# ── DORA-AI Cascade Dashboard endpoints ──

@router.get("/cascade-efficiency")
async def cascade_efficiency(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "cascade_efficiency")


@router.get("/cascade-health")
def cascade_health():
    return compute_cascade_health()


@router.get("/team-cascades")
async def team_cascades(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "team_cascades")


@router.get("/flow-details")
async def flow_details(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "flow_details")


@router.get("/story-points")
async def story_points(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "org_cascade", "story_points")


@router.get("/story-point-gap")
def story_point_gap():
    return compute_story_point_gap()
