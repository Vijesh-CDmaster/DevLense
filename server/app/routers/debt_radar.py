"""Debt Radar API router — /api/debt-radar/*."""

from fastapi import APIRouter, HTTPException

from app.models.debt_radar import (
    DebtRadarDashboard,
    DebtModule, SprintDebt, RefactorItem,
    StagedFile, SurvivalPrediction, BudgetTracker,
    ScoreFileRequest, ScoreFileResponse, BudgetSettingsRequest,
    PreCommitScan, SprintDebtProjection,
    ModuleCouplingDrift, ServiceBoundaryViolation,
    GenerativeMonoculture, ArchitecturalHealthScore, ArchDriftSummary,
)
from app.data.debt_radar_data import (
    get_full_dashboard,
    get_modules, get_sprint_debt, get_refactor_queue,
    get_staged_files, get_survival_predictions, get_budget_tracker,
    resolve_refactor_item, update_budget_settings,
    PRE_COMMIT_SCANS, SPRINT_DEBT_PROJECTIONS,
    MODULE_COUPLING_DRIFT, SERVICE_BOUNDARY_VIOLATIONS,
    GENERATIVE_MONOCULTURES, ARCHITECTURAL_HEALTH_SCORE,
)
from app.services import debt_scorer
from app.services.arch_drift import compute_arch_drift_summary

router = APIRouter(prefix="/api/debt-radar", tags=["Debt Radar"])


# ── Full dashboard (single call) ──

@router.get("/dashboard", response_model=DebtRadarDashboard)
async def dashboard():
    """Return the entire Debt Radar payload in one shot."""
    return get_full_dashboard()


# ── Heatmap ──

@router.get("/modules", response_model=list[DebtModule])
async def modules():
    return get_modules()


# ── AI Debt Accumulation Timeline ──

@router.get("/sprint-debt", response_model=list[SprintDebt])
async def sprint_debt():
    return get_sprint_debt()


# ── Refactor Recommendation Engine ──

@router.get("/refactor-queue", response_model=list[RefactorItem])
async def refactor_queue():
    return get_refactor_queue()


# ── Pre-commit AI Debt Scorer ──

@router.get("/staged-files", response_model=list[StagedFile])
async def staged_files():
    return await debt_scorer.score_staged_files()


# ── 14-Day Survival Predictor ──

@router.get("/survival-predictions", response_model=list[SurvivalPrediction])
async def survival_predictions():
    return await debt_scorer.predict_survival()


# ── Tech Debt Budget Tracker ──

@router.get("/budget", response_model=BudgetTracker)
async def budget():
    return get_budget_tracker()


# ── Score a single file (exposes compute_debt_score) ──

@router.post("/score-file", response_model=ScoreFileResponse)
async def score_file(req: ScoreFileRequest):
    score = await debt_scorer.compute_debt_score(req.ai_pct, req.churn_history, req.pattern_issues)
    verdict = "block" if score >= 200 else "warn" if score >= 100 else "pass"
    return ScoreFileResponse(debt_score=score, verdict=verdict)


# ── Resolve / acknowledge a refactor item ──

@router.post("/refactor-queue/{index}/resolve", response_model=RefactorItem)
async def resolve_refactor(index: int):
    item = resolve_refactor_item(index)
    if item is None:
        raise HTTPException(status_code=404, detail="Refactor item not found")
    return item


# ── Update budget ceiling / alert threshold ──

@router.put("/budget/settings", response_model=BudgetTracker)
async def budget_settings(req: BudgetSettingsRequest):
    return update_budget_settings(req.ceiling, req.alert_threshold)


# ── Rescan staged files ──

@router.post("/rescan", response_model=list[StagedFile])
async def rescan():
    return await debt_scorer.score_staged_files()


# ═══════════════════════════════════════════════════════════════════
# ██  ENHANCED PRE-COMMIT SCORER + ARCHITECTURAL DRIFT MONITOR
# ═══════════════════════════════════════════════════════════════════

@router.get("/pre-commit-scans", response_model=list[PreCommitScan])
async def pre_commit_scans():
    return PRE_COMMIT_SCANS


@router.get("/sprint-debt-projections", response_model=list[SprintDebtProjection])
async def sprint_debt_projections():
    return SPRINT_DEBT_PROJECTIONS


@router.get("/coupling-drift", response_model=ModuleCouplingDrift)
async def coupling_drift():
    return MODULE_COUPLING_DRIFT


@router.get("/boundary-violations", response_model=list[ServiceBoundaryViolation])
async def boundary_violations():
    return SERVICE_BOUNDARY_VIOLATIONS


@router.get("/monocultures", response_model=list[GenerativeMonoculture])
async def monocultures():
    return GENERATIVE_MONOCULTURES


@router.get("/architectural-health", response_model=ArchitecturalHealthScore)
async def architectural_health():
    return ARCHITECTURAL_HEALTH_SCORE


@router.get("/arch-drift-summary", response_model=ArchDriftSummary)
async def arch_drift_summary():
    return compute_arch_drift_summary()
