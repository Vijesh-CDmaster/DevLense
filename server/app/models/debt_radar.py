"""Pydantic models for Debt Radar (Problem 4 — AI-Induced Technical Debt)."""

from pydantic import BaseModel


# ── Codebase Debt Heatmap ──

class DebtModule(BaseModel):
    name: str
    risk: int
    level: str
    label: str


# ── AI Debt Accumulation Timeline ──

class SprintDebt(BaseModel):
    sprint: str
    debt: int
    budget: int


# ── Refactor Recommendation Engine ──

class RefactorItem(BaseModel):
    file: str
    line: int
    reason: str
    urgency: str
    effort_hrs: float
    debt_reduction: int
    ai_pct: int


# ── Pre-commit AI Debt Scorer ──

class StagedFile(BaseModel):
    file: str
    ai_pct: int
    churn_risk: int
    pattern_issues: int
    debt_score: int
    verdict: str          # "block" | "warn" | "pass"


# ── 14-Day Survival Predictor ──

class SurvivalPrediction(BaseModel):
    file: str
    block: str
    lines: str
    ai_pct: int
    survival_prob: int
    risk_factors: list[str]
    predicted_lifespan_days: int


# ── Tech Debt Budget Tracker ──

class BudgetTracker(BaseModel):
    ceiling: int
    current: int
    sprint_added: int
    sprint_resolved: int
    trend: str            # "rising" | "falling" | "stable"
    alert_threshold: int
    weeks_to_breach: int


# ── Composite Dashboard ──

class DebtRadarDashboard(BaseModel):
    modules: list[DebtModule]
    sprint_debt: list[SprintDebt]
    refactor_queue: list[RefactorItem]
    staged_files: list[StagedFile]
    survival_predictions: list[SurvivalPrediction]
    budget_tracker: BudgetTracker
