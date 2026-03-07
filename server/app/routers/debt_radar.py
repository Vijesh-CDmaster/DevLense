"""Debt Radar API router — /api/debt-radar/*."""

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard as repo_get_dashboard, get_data_key, update_data_key
from app.models.debt_radar import ScoreFileRequest, ScoreFileResponse, BudgetSettingsRequest
from app.services import debt_scorer
from app.services.arch_drift import compute_arch_drift_summary

router = APIRouter(prefix="/api/debt-radar", tags=["Debt Radar"])


# ── Full dashboard (single call) ──

@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await repo_get_dashboard(db, "debt_radar")


# ── Heatmap ──

@router.get("/modules")
async def modules(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "modules")


# ── AI Debt Accumulation Timeline ──

@router.get("/sprint-debt")
async def sprint_debt(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "sprint_debt")


# ── Refactor Recommendation Engine ──

@router.get("/refactor-queue")
async def refactor_queue(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "refactor_queue")


# ── Pre-commit AI Debt Scorer ──

@router.get("/staged-files")
async def staged_files():
    return await debt_scorer.score_staged_files()


# ── 14-Day Survival Predictor ──

@router.get("/survival-predictions")
async def survival_predictions():
    return await debt_scorer.predict_survival()


# ── Tech Debt Budget Tracker ──

@router.get("/budget")
async def budget(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "budget_tracker")


# ── Score a single file (exposes compute_debt_score) ──

@router.post("/score-file")
async def score_file(req: ScoreFileRequest):
    score = await debt_scorer.compute_debt_score(req.ai_pct, req.churn_history, req.pattern_issues)
    verdict = "block" if score >= 200 else "warn" if score >= 100 else "pass"
    return ScoreFileResponse(debt_score=score, verdict=verdict)


# ── Resolve / acknowledge a refactor item ──

@router.post("/refactor-queue/{index}/resolve")
async def resolve_refactor(index: int, db: AsyncSession = Depends(get_db)):
    queue = await get_data_key(db, "debt_radar", "refactor_queue") or []
    if not (0 <= index < len(queue)):
        raise HTTPException(status_code=404, detail="Refactor item not found")
    item = queue.pop(index)
    await update_data_key(db, "debt_radar", "refactor_queue", queue)
    # Update budget tracker
    budget = await get_data_key(db, "debt_radar", "budget_tracker") or {}
    budget["current"] = max(0, budget.get("current", 0) - item.get("debt_reduction", 0))
    budget["sprint_resolved"] = budget.get("sprint_resolved", 0) + item.get("debt_reduction", 0)
    await update_data_key(db, "debt_radar", "budget_tracker", budget)
    return item


# ── Update budget ceiling / alert threshold ──

@router.put("/budget/settings")
async def budget_settings(req: BudgetSettingsRequest, db: AsyncSession = Depends(get_db)):
    budget = await get_data_key(db, "debt_radar", "budget_tracker") or {}
    if req.ceiling is not None:
        budget["ceiling"] = req.ceiling
    if req.alert_threshold is not None:
        budget["alert_threshold"] = req.alert_threshold
    await update_data_key(db, "debt_radar", "budget_tracker", budget)
    return budget


# ── Rescan staged files ──

@router.post("/rescan")
async def rescan():
    return await debt_scorer.score_staged_files()


# ═══════════════════════════════════════════════════════════════════
# ██  ENHANCED PRE-COMMIT SCORER + ARCHITECTURAL DRIFT MONITOR
# ═══════════════════════════════════════════════════════════════════

@router.get("/pre-commit-scans")
async def pre_commit_scans(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "pre_commit_scans")


@router.get("/sprint-debt-projections")
async def sprint_debt_projections(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "sprint_debt_projections")


@router.get("/coupling-drift")
async def coupling_drift(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "module_coupling_drift")


@router.get("/boundary-violations")
async def boundary_violations(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "service_boundary_violations")


@router.get("/monocultures")
async def monocultures(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "generative_monocultures")


@router.get("/architectural-health")
async def architectural_health(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "debt_radar", "architectural_health_score")


@router.get("/arch-drift-summary")
async def arch_drift_summary():
    return compute_arch_drift_summary()
