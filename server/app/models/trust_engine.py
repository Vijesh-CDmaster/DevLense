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


class TrustEngineDashboard(BaseModel):
    suggestions: list[Suggestion]
    task_types: list[TaskTypeAccuracy]
    calibration: list[CalibrationPoint]
    confidence_meters: list[ConfidenceMeter]
    verify_alerts: list[VerifyAlert]
    weekly_report: WeeklyReport
