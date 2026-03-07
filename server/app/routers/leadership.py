from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key
from app.services.empathy_engine import (
    compute_empathy_score, translate_pain_to_kpi,
    get_developer_friction_summary, compute_empathy_dimensions_summary,
)
from app.services.friction_debt_engine import (
    compute_friction_summary, compute_debt_summary, compute_accountability_summary,
)

router = APIRouter(prefix="/api/leadership", tags=["leadership"])


@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await get_dashboard(db, "leadership")


@router.get("/friction-heatmap")
async def friction_heatmap(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "friction_heatmap")


@router.get("/empathy-gaps")
async def empathy_gaps(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "empathy_gaps")


@router.get("/action-loop")
async def action_loop(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "action_loop")


@router.get("/decision-impacts")
async def decision_impacts(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "decision_impacts")


@router.get("/translations")
async def translations(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "translations")


@router.get("/pulse-results")
async def pulse_results(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "pulse_results")


@router.get("/empathy-score")
async def empathy_score(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "empathy_score")


@router.get("/compute-empathy")
def compute_empathy():
    return compute_empathy_score()


@router.get("/translate")
def translate(pain: str = "Code reviews are slow"):
    return {"dev_pain": pain, "kpi": translate_pain_to_kpi(pain)}


@router.get("/developer-frictions")
async def developer_frictions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "developer_frictions")


@router.get("/developer-friction-summary")
def developer_friction_summary():
    return get_developer_friction_summary()


@router.get("/friction-trends")
async def friction_trends(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "friction_trends")


@router.get("/impact-simulations")
async def impact_simulations(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "impact_simulations")


@router.get("/empathy-dimensions")
async def empathy_dimensions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "empathy_dimensions")


@router.get("/empathy-dimensions-summary")
def empathy_dimensions_summary():
    return compute_empathy_dimensions_summary()


@router.get("/briefing")
async def briefing(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "leadership_briefing")


@router.get("/escalations")
async def escalations_endpoint(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "escalations")


@router.get("/rt-friction-heatmap")
async def rt_friction_heatmap(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "rt_friction_heatmap")


@router.get("/net-ai-roi")
async def net_ai_roi(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "net_ai_roi")


@router.get("/leadership-brief")
async def leadership_brief(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "leadership_brief")


@router.get("/decision-events")
async def decision_events(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "decision_events")


@router.get("/decision-impact-measurements")
async def decision_impact_measurements(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "decision_impact_measurements")


@router.get("/friction-debt-ledger")
async def friction_debt_ledger(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "friction_debt_ledger")


@router.get("/bidirectional-dashboard")
async def bidirectional_dashboard(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "bidirectional_dashboard")


@router.get("/empathy-roi-report")
async def empathy_roi_report(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "leadership", "empathy_roi_report")


@router.get("/friction-summary")
def friction_summary():
    return compute_friction_summary()


@router.get("/debt-summary")
def debt_summary():
    return compute_debt_summary()


@router.get("/accountability-summary")
def accountability_summary():
    return compute_accountability_summary()
