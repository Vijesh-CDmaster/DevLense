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


# ── Request / response helpers ──

class ScoreFileRequest(BaseModel):
    ai_pct: int
    churn_history: float
    pattern_issues: int


class ScoreFileResponse(BaseModel):
    debt_score: int
    verdict: str


class BudgetSettingsRequest(BaseModel):
    ceiling: int | None = None
    alert_threshold: int | None = None


# ── Composite Dashboard ──

class DebtRadarDashboard(BaseModel):
    modules: list[DebtModule]
    sprint_debt: list[SprintDebt]
    refactor_queue: list[RefactorItem]
    staged_files: list[StagedFile]
    survival_predictions: list[SurvivalPrediction]
    budget_tracker: BudgetTracker


# ── Enhanced Pre-Commit Debt Scorer (8-Signal) ──

class DebtSignal(BaseModel):
    signal: str
    value: float
    weight: float
    score_contribution: float
    detail: str


class SecurityFinding(BaseModel):
    pattern: str           # e.g. "SQL Injection (A03)"
    owasp_id: str          # e.g. "A03"
    severity: str          # "CRITICAL" | "HIGH" | "MEDIUM"
    line: int
    cvss: float
    description: str


class PreCommitBlock(BaseModel):
    block_id: str          # e.g. "Block A"
    lines: str             # e.g. "12–29"
    survival_pct: int      # 0–100
    risk_level: str        # "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    verdict: str           # "✅ Commit" | "⚠️ Review" | "🔴 Rewrite"
    signals: list[DebtSignal]
    security_findings: list[SecurityFinding]
    dry_violation: str | None = None      # e.g. "89% similarity to utils/..."
    duplicate_detail: str | None = None   # e.g. "4 near-copies in codebase"


class PreCommitScan(BaseModel):
    developer: str
    branch: str
    file: str
    blocks: list[PreCommitBlock]
    debt_hours_if_committed: float
    debt_hours_if_rewritten: float
    debt_reduction_pct: float
    security_gate: str     # "PASS" | "BLOCKED"
    security_gate_reason: str | None = None


class SprintDebtProjection(BaseModel):
    sprint: str
    projected_debt: int
    if_all_rewritten: int
    savings: int


# ── Architectural Drift Monitor ──

class CouplingPair(BaseModel):
    module_a: str
    module_b: str
    baseline_coupling: int
    current_coupling: int
    ai_attributed_pct: int
    danger_note: str | None = None


class ModuleCouplingDrift(BaseModel):
    sprint_range: str
    new_couplings_total: int
    ai_attributed_couplings: int
    ai_coupling_pct: int
    drift_score: int       # 0–100
    drift_level: str       # "LOW" | "WARNING" | "HIGH" | "CRITICAL"
    interpretation: str
    pairs: list[CouplingPair]


class ServiceBoundaryViolation(BaseModel):
    violation_id: str
    developer: str
    commit_hash: str
    violation_type: str
    detected_in: str
    violation_detail: str
    ai_origin_pct: int
    severity: str          # "CRITICAL" | "HIGH" | "MEDIUM"
    debt_level: str        # "HIGH" | "MEDIUM" | "LOW"
    recommendation: str
    auto_fix_available: bool
    sprint_remediation_hrs: float
    deferred_cost_hrs: float


class MonocultureInstance(BaseModel):
    file: str
    day: int
    ai_origin: bool


class GenerativeMonoculture(BaseModel):
    pattern_id: str
    pattern_name: str
    first_detected: str
    spread_rate: str       # e.g. "4 files / 12 days"
    risk_level: str        # "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    consequence: str
    flaw_confirmed: bool
    flaw_description: str | None = None
    cvss: float | None = None
    instances: list[MonocultureInstance]
    remediation_files: int
    remediation_hrs: float
    post_breach_cost: str  # e.g. "$4.4M avg."


class AHSComponent(BaseModel):
    component: str
    score: int             # 0–100
    ai_attribution_pct: int
    trend: str             # "↓ Declining" | "→ Stable" | "↑ Improving"


class ArchitecturalHealthScore(BaseModel):
    team: str
    quarter: str
    components: list[AHSComponent]
    overall_score: int     # 0–100
    status: str            # "HEALTHY" | "DEGRADING" | "DETERIORATING" | "CRITICAL"
    drift_velocity: float  # points/week (negative = worsening)
    projected_ahs_8wk: int
    critical_threshold: int
    remediation_cost_now: int
    remediation_cost_projected: int
    cost_multiplier: float


class ArchDriftSummary(BaseModel):
    overall_ahs: int
    drift_velocity: float
    total_sbvt_violations: int
    total_monoculture_alerts: int
    ai_coupling_pct: int
    remediation_cost_now: int
    remediation_cost_projected: int
    worst_component: str
    worst_score: int
