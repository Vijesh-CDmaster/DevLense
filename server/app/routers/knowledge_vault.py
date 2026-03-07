"""Knowledge Vault API router."""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard as repo_get_dashboard, get_data_key
from app.services.knowledge_analyzer import (
    compute_risk_score, compute_bus_factor,
    compute_decay_summary, compute_transfer_velocity, compute_knowledge_gaps,
)
from app.services.knowledge_mortality import (
    compute_mortality_summary, compute_departure_impact,
    compute_constraint_coverage,
)

router = APIRouter(prefix="/api/knowledge-vault", tags=["knowledge-vault"])


@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db)):
    return await repo_get_dashboard(db, "knowledge_vault")


@router.get("/nodes")
async def get_nodes(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "nodes")


@router.get("/interviews")
async def get_interviews(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "interview_history")


@router.get("/decisions")
async def get_decisions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "decisions")


@router.get("/risk-score")
async def get_risk_score(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "risk_score")


@router.get("/extractions")
async def get_extractions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "recent_extractions")


@router.get("/onboarding")
async def get_onboarding(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "onboarding_queries")


@router.get("/archaeology")
async def get_archaeology(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "archaeology_results")


@router.get("/bus-factor")
async def get_bus_factor(db: AsyncSession = Depends(get_db)):
    nodes = await get_data_key(db, "knowledge_vault", "nodes") or []
    result = []
    for node in nodes:
        result.append({
            "module": node["label"],
            "owners": node["owners"],
            "risk": compute_bus_factor(node["owners"]),
        })
    return result


@router.get("/decay")
async def get_decay(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "decay_items")


@router.get("/decay-summary")
async def get_decay_summary(db: AsyncSession = Depends(get_db)):
    items = await get_data_key(db, "knowledge_vault", "decay_items") or []
    return compute_decay_summary(items)


@router.get("/interview-sessions")
async def get_interview_sessions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "interview_sessions")


@router.get("/transfer-matrix")
async def get_transfer_matrix(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "transfer_matrix")


@router.get("/transfer-velocity")
async def get_transfer_velocity(db: AsyncSession = Depends(get_db)):
    matrix = await get_data_key(db, "knowledge_vault", "transfer_matrix") or []
    return compute_transfer_velocity(matrix)


@router.get("/undocumented")
async def get_undocumented(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "undocumented_regions")


@router.get("/onboarding-insights")
async def get_onboarding_insights(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "onboarding_insights")


@router.get("/knowledge-gaps")
async def get_knowledge_gaps(db: AsyncSession = Depends(get_db)):
    insights = await get_data_key(db, "knowledge_vault", "onboarding_insights") or []
    return compute_knowledge_gaps(insights)


@router.get("/decision-chains")
async def get_decision_chains(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "decision_chains")


# ── Contextual Extraction Engine ──

@router.get("/extraction-session")
async def get_extraction_session(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "extraction_session")


@router.get("/decision-nodes")
async def get_decision_nodes(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "decision_nodes")


@router.get("/constraint-alerts")
async def get_constraint_alerts(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "constraint_alerts")


@router.get("/constraint-coverage")
async def get_constraint_coverage(db: AsyncSession = Depends(get_db)):
    nodes = await get_data_key(db, "knowledge_vault", "decision_nodes") or []
    alerts = await get_data_key(db, "knowledge_vault", "constraint_alerts") or []
    return compute_constraint_coverage(nodes, alerts)


# ── Knowledge Mortality Forecaster ──

@router.get("/knowledge-decay-scores")
async def get_knowledge_decay_scores(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "knowledge_decay_scores")


@router.get("/asset-valuations")
async def get_asset_valuations(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "asset_valuations")


@router.get("/mortality-timeline")
async def get_mortality_timeline(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "mortality_timeline")


@router.get("/departure-exposure")
async def get_departure_exposure(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "knowledge_vault", "departure_exposure")


@router.get("/mortality-summary")
async def get_mortality_summary(db: AsyncSession = Depends(get_db)):
    decay_scores = await get_data_key(db, "knowledge_vault", "knowledge_decay_scores") or []
    valuations = await get_data_key(db, "knowledge_vault", "asset_valuations") or []
    timeline = await get_data_key(db, "knowledge_vault", "mortality_timeline") or {}
    return compute_mortality_summary(decay_scores, valuations, timeline)


@router.get("/departure-impact")
async def get_departure_impact(db: AsyncSession = Depends(get_db)):
    exposure = await get_data_key(db, "knowledge_vault", "departure_exposure") or []
    valuations = await get_data_key(db, "knowledge_vault", "asset_valuations") or []
    return compute_departure_impact(exposure, valuations)
