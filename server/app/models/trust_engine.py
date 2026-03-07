from pydantic import BaseModel


class Suggestion(BaseModel):
    code: str
    trust: float
    task_type: str
    complexity: str
    rec: str
    level: str  # green | amber | red
    files_affected: int
    context_match: float
    historical_accuracy: float
    risk_factors: list[str]


class TaskTypeAccuracy(BaseModel):
    type: str
    accuracy: float
    total: int
    accepted: int
    reverted: int


class CalibrationPoint(BaseModel):
    week: str
    trusted: float
    correct: float
    overtrust: float


class ConfidenceMeter(BaseModel):
    id: str
    suggestion: str
    context_score: float
    complexity_penalty: float
    history_bonus: float
    final_confidence: float
    factors: list[str]


class VerifyAlert(BaseModel):
    id: str
    code: str
    reason: str
    severity: str  # critical | high | medium
    false_positive_rate: float
    task_type: str
    suggested_action: str


class WeeklyTrendPoint(BaseModel):
    week: str
    accuracy: float
    acceptance: float


class WeeklyReport(BaseModel):
    total_suggestions: int
    accepted: int
    rejected: int
    reverted: int
    net_accuracy: float
    best_task_type: str
    worst_task_type: str
    calibration_score: float
    calibration_label: str
    trend: str  # improving | declining
    weekly_trend: list[WeeklyTrendPoint]


class DevTaskTypeAccuracy(BaseModel):
    type: str
    accuracy: float
    total: int
    accepted: int
    reverted: int


class DeveloperTrustProfile(BaseModel):
    name: str
    overall_trust_score: float
    calibration_score: float
    calibration_label: str  # Well-calibrated | Moderate | Poor
    total_suggestions: int
    accepted: int
    reverted: int
    overtrust_pct: float
    undertrust_pct: float
    best_task_type: str
    worst_task_type: str
    task_accuracies: list[DevTaskTypeAccuracy]
    calibration_history: list[CalibrationPoint]
    trend: str  # improving | stable | declining


class TrustScoreResult(BaseModel):
    trust: float
    level: str
    rec: str
    breakdown: dict


class TrustEngineDashboard(BaseModel):
    suggestions: list[Suggestion]
    task_types: list[TaskTypeAccuracy]
    calibration: list[CalibrationPoint]
    confidence_meters: list[ConfidenceMeter]
    verify_alerts: list[VerifyAlert]
    weekly_report: WeeklyReport
    developer_profiles: list[DeveloperTrustProfile]


# ══════════════════════════════════════════════════════════════════
# 9-Signal Per-Suggestion Trust Scorer with Explainability Panel
# ══════════════════════════════════════════════════════════════════

class TrustSignal(BaseModel):
    signal: str
    value: str
    weight: float
    score_contribution: float
    detail: str


class ExplainabilityItem(BaseModel):
    category: str  # why_low | what_to_check | personal_stats
    text: str
    severity: str  # critical | high | medium | info


class PerSuggestionTrustScore(BaseModel):
    suggestion_id: str
    code_snippet: str
    trust_score: int  # 0–100
    level: str  # green | amber | red
    recommendation: str
    signals: list[TrustSignal]
    why_low: list[ExplainabilityItem]
    what_to_check: list[ExplainabilityItem]
    personal_accuracy: float
    team_accuracy: float
    task_type: str
    developer: str
    timestamp: str


# ══════════════════════════════════════════════════════════════════
# Verification Tax Eliminator (VTE)
# ══════════════════════════════════════════════════════════════════

class SymbolCheck(BaseModel):
    symbol: str
    location: str  # e.g. "referenced on line 23"
    status: str  # not_in_context | verified | missing


class BoundaryTest(BaseModel):
    input_desc: str
    target_line: str  # e.g. "tests null handling on line 19"
    rationale: str


class ArchProbe(BaseModel):
    check: str
    target: str  # file/interface being checked
    risk: str  # new_signature | new_dependency | migration_mismatch


class SecurityFastPath(BaseModel):
    owasp_id: str
    risk_label: str  # SQL injection, XSS, etc.
    lines: str  # e.g. "41-44"
    current_code: str
    required_fix: str
    severity: str  # critical | high | medium


class VTEProtocol(BaseModel):
    suggestion_id: str
    trust_score: int
    estimated_seconds: int
    symbol_checks: list[SymbolCheck]
    boundary_tests: list[BoundaryTest]
    arch_probes: list[ArchProbe]
    security_fast_paths: list[SecurityFastPath]
    sections_order: list[str]  # ordered list of active sections: CRITICAL, HIGH, MEDIUM, SKIPPED


class VTEChecklistItem(BaseModel):
    section: str  # symbol | logic | arch | security
    priority: str  # CRITICAL | HIGH | MEDIUM | SKIPPED
    label: str
    estimated_sec: int


# ══════════════════════════════════════════════════════════════════
# Trust Calibration Report
# ══════════════════════════════════════════════════════════════════

class CalibrationBucket(BaseModel):
    label: str  # Correctly accepted | Correctly rejected | Over-rejected | Over-accepted
    pct: float
    status: str  # green | amber | red
    description: str


class CalibrationGap(BaseModel):
    task_type: str
    gap_type: str  # over-rejection | over-acceptance
    rate: float
    recommendation: str


class TrustCalibrationReport(BaseModel):
    team: str
    week_label: str
    suggestions_displayed: int
    protocols_run: int
    protocol_run_pct: float
    avg_verification_sec: int
    unstructured_avg_min: int
    verification_tax_saved_hrs: float
    buckets: list[CalibrationBucket]
    team_calibration_score: int  # 0–100
    primary_gap: CalibrationGap
    secondary_gaps: list[CalibrationGap]
