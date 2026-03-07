from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key
from app.services.trust_scorer import compute_trust_score, should_verify
from app.services.vte_engine import get_vte_checklist, compute_verification_tax_summary

router = APIRouter(prefix="/api/trust-engine", tags=["trust-engine"])


@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await get_dashboard(db, "trust_engine")


@router.get("/suggestions")
async def suggestions(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "suggestions")


@router.get("/task-types")
async def task_types(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "task_types")


@router.get("/calibration")
async def calibration(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "calibration")


@router.get("/confidence-meters")
async def confidence_meters(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "confidence_meters")


@router.get("/verify-alerts")
async def verify_alerts(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "verify_alerts")


@router.get("/weekly-report")
async def weekly_report(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "weekly_report")


@router.get("/score")
def score_suggestion(
    task_type: str = "Refactoring",
    complexity: str = "Medium",
    files_affected: int = 1,
    context_match: float = 70.0,
    developer: str | None = None,
):
    return compute_trust_score(task_type, complexity, files_affected, context_match, developer)


@router.get("/should-verify")
def check_verify(trust_score: float = 50.0, task_type: str = "Refactoring"):
    return {"should_verify": should_verify(trust_score, task_type)}


@router.get("/developer-profiles")
async def developer_profiles(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "developer_profiles")


@router.get("/developer-profiles/{dev_name}")
async def developer_profile(dev_name: str, db: AsyncSession = Depends(get_db)):
    profiles = await get_data_key(db, "trust_engine", "developer_profiles") or []
    profile = next(
        (p for p in profiles if p["name"].lower() == dev_name.lower()), None
    )
    if profile is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return profile


@router.get("/per-suggestion-scores")
async def per_suggestion_scores(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "per_suggestion_scores")


@router.get("/vte-protocols")
async def vte_protocols(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "vte_protocols")


@router.get("/vte-checklist/{suggestion_id}")
def vte_checklist(suggestion_id: str):
    return get_vte_checklist(suggestion_id)


@router.get("/vte-summary")
def vte_summary():
    return compute_verification_tax_summary()


@router.get("/calibration-report")
async def calibration_report(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "trust_engine", "calibration_report")
