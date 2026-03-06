"""Mock data for Debt Radar — mirrors frontend arrays exactly."""

from app.models.debt_radar import (
    DebtModule, SprintDebt, RefactorItem,
    StagedFile, SurvivalPrediction, BudgetTracker,
    DebtRadarDashboard,
)

# ── Codebase Debt Heatmap ──

_modules: list[DebtModule] = [
    DebtModule(name="auth/", risk=100, level="red", label="CRITICAL"),
    DebtModule(name="payments/", risk=68, level="amber", label="ELEVATED"),
    DebtModule(name="api/routes", risk=55, level="amber", label="MODERATE"),
    DebtModule(name="user/", risk=28, level="green", label="LOW"),
    DebtModule(name="notifications/", risk=45, level="amber", label="MODERATE"),
    DebtModule(name="reporting/", risk=85, level="red", label="HIGH"),
]

# ── AI Debt Accumulation Timeline (with budget ceiling overlay) ──

_sprint_debt: list[SprintDebt] = [
    SprintDebt(sprint="Sprint 1", debt=120, budget=800),
    SprintDebt(sprint="Sprint 2", debt=340, budget=1000),
    SprintDebt(sprint="Sprint 3", debt=570, budget=1200),
    SprintDebt(sprint="Sprint 4", debt=890, budget=1400),
    SprintDebt(sprint="Sprint 5", debt=1240, budget=1600),
]

# ── Refactor Recommendation Engine ──

_refactor_queue: list[RefactorItem] = [
    RefactorItem(
        file="auth/jwt.js", line=234,
        reason="Repeated patterns, 82% revert probability — AI duplicated existing token refresh logic",
        urgency="red", effort_hrs=4.5, debt_reduction=180, ai_pct=88,
    ),
    RefactorItem(
        file="auth/session.ts", line=89,
        reason="AI-generated logic not integrated with existing auth flow — session state conflicts",
        urgency="red", effort_hrs=3.0, debt_reduction=150, ai_pct=92,
    ),
    RefactorItem(
        file="reporting/export.ts", line=45,
        reason="AI function fails on datasets >10K rows — memory leak in stream handling",
        urgency="red", effort_hrs=5.0, debt_reduction=200, ai_pct=95,
    ),
    RefactorItem(
        file="api/routes.js", line=156,
        reason="Copy-pasted error handling from AI — no centralised error middleware used",
        urgency="amber", effort_hrs=2.0, debt_reduction=80, ai_pct=72,
    ),
    RefactorItem(
        file="payments/gateway.ts", line=67,
        reason="AI suggestions for business logic — needs expert review, edge cases missed",
        urgency="amber", effort_hrs=3.5, debt_reduction=120, ai_pct=68,
    ),
    RefactorItem(
        file="notifications/retry.ts", line=112,
        reason="AI exponential backoff lacks jitter — thundering herd risk in production",
        urgency="amber", effort_hrs=1.5, debt_reduction=60, ai_pct=85,
    ),
]

# ── Pre-commit AI Debt Scorer ──

_staged_files: list[StagedFile] = [
    StagedFile(
        file="auth/oauth2.ts", ai_pct=91, churn_risk=88,
        pattern_issues=5, debt_score=245, verdict="block",
    ),
    StagedFile(
        file="payments/stripe-webhook.ts", ai_pct=84, churn_risk=72,
        pattern_issues=3, debt_score=185, verdict="block",
    ),
    StagedFile(
        file="api/middleware.ts", ai_pct=67, churn_risk=55,
        pattern_issues=2, debt_score=120, verdict="warn",
    ),
    StagedFile(
        file="user/preferences.ts", ai_pct=45, churn_risk=28,
        pattern_issues=1, debt_score=55, verdict="pass",
    ),
    StagedFile(
        file="notifications/email.ts", ai_pct=78, churn_risk=65,
        pattern_issues=4, debt_score=165, verdict="warn",
    ),
]

# ── 14-Day Survival Predictor ──

_survival_predictions: list[SurvivalPrediction] = [
    SurvivalPrediction(
        file="auth/jwt.ts", block="refreshAccessToken()", lines="230-298",
        ai_pct=88, survival_prob=22,
        risk_factors=["High churn history", "Pattern duplication", "No test coverage"],
        predicted_lifespan_days=4,
    ),
    SurvivalPrediction(
        file="reporting/export.ts", block="generateCSVStream()", lines="40-120",
        ai_pct=95, survival_prob=18,
        risk_factors=["Memory leak detected", "No pagination", "Fails >10K rows"],
        predicted_lifespan_days=3,
    ),
    SurvivalPrediction(
        file="payments/webhook.ts", block="validateWebhookSignature()", lines="55-92",
        ai_pct=92, survival_prob=35,
        risk_factors=["Missing idempotency check", "Copy-paste pattern"],
        predicted_lifespan_days=7,
    ),
    SurvivalPrediction(
        file="api/routes.js", block="errorHandler()", lines="150-180",
        ai_pct=72, survival_prob=58,
        risk_factors=["Not using centralised middleware", "Inconsistent format"],
        predicted_lifespan_days=11,
    ),
    SurvivalPrediction(
        file="user/profile.ts", block="updateProfile()", lines="30-65",
        ai_pct=55, survival_prob=78,
        risk_factors=["Minor style issues"],
        predicted_lifespan_days=20,
    ),
    SurvivalPrediction(
        file="notifications/retry.ts", block="retryWithBackoff()", lines="100-140",
        ai_pct=85, survival_prob=42,
        risk_factors=["No jitter", "Thundering herd risk", "Hardcoded delays"],
        predicted_lifespan_days=8,
    ),
]

# ── Tech Debt Budget Tracker ──

_budget_tracker = BudgetTracker(
    ceiling=2000,
    current=1240,
    sprint_added=420,
    sprint_resolved=70,
    trend="rising",
    alert_threshold=80,
    weeks_to_breach=3,
)


# ── Accessor functions ──

def get_full_dashboard() -> DebtRadarDashboard:
    """Return the complete Debt Radar dashboard payload."""
    return DebtRadarDashboard(
        modules=_modules,
        sprint_debt=_sprint_debt,
        refactor_queue=_refactor_queue,
        staged_files=_staged_files,
        survival_predictions=_survival_predictions,
        budget_tracker=_budget_tracker,
    )


def get_modules() -> list[DebtModule]:
    return list(_modules)

def get_sprint_debt() -> list[SprintDebt]:
    return list(_sprint_debt)

def get_refactor_queue() -> list[RefactorItem]:
    return list(_refactor_queue)

def get_staged_files() -> list[StagedFile]:
    return list(_staged_files)

def get_survival_predictions() -> list[SurvivalPrediction]:
    return list(_survival_predictions)

def get_budget_tracker() -> BudgetTracker:
    return _budget_tracker


def resolve_refactor_item(index: int) -> RefactorItem | None:
    """Mark a refactor item as resolved and decrease budget current by its debt_reduction."""
    if 0 <= index < len(_refactor_queue):
        item = _refactor_queue.pop(index)
        _budget_tracker.current = max(0, _budget_tracker.current - item.debt_reduction)
        _budget_tracker.sprint_resolved += item.debt_reduction
        return item
    return None


def update_budget_settings(ceiling: int | None, alert_threshold: int | None) -> BudgetTracker:
    """Update budget ceiling and/or alert threshold."""
    global _budget_tracker
    if ceiling is not None:
        _budget_tracker = _budget_tracker.model_copy(update={"ceiling": ceiling})
    if alert_threshold is not None:
        _budget_tracker = _budget_tracker.model_copy(update={"alert_threshold": alert_threshold})
    return _budget_tracker
