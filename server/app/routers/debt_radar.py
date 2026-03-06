"""Debt Radar API router — /api/debt-radar/*."""

from fastapi import APIRouter

from app.models.debt_radar import (
    DebtRadarDashboard,
    DebtModule, SprintDebt, RefactorItem,
    StagedFile, SurvivalPrediction, BudgetTracker,
)
from app.data.debt_radar_data import (
    get_full_dashboard,
    get_modules, get_sprint_debt, get_refactor_queue,
    get_staged_files, get_survival_predictions, get_budget_tracker,
)
from app.services import debt_scorer

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
