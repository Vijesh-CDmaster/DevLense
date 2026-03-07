from pydantic import BaseModel


class Developer(BaseModel):
    name: str
    switches: int
    time_lost: float
    primary: str
    top_friction: str
    alert: bool


class Transition(BaseModel):
    from_tool: str
    to_tool: str
    switches: int
    avg_min_lost: float


class HourlySlot(BaseModel):
    hour: str
    copilot: int
    cursor: int
    claude: int


class FrictionByTask(BaseModel):
    task: str
    minutes_lost: float
    switches: int
    worst_transition: str


class ToolUsage(BaseModel):
    tool: str
    pct: int
    accepts: int
    quality: int
    color: str


# ── Cross-Tool Friction Heatmap models ──

class WeeklyFrictionCell(BaseModel):
    day: str
    transition: str
    switches: int
    hours_lost: float
    intensity: float  # 0-1 heat intensity


class DevWeeklyFriction(BaseModel):
    developer: str
    week_label: str
    total_friction_hrs: float
    org_cost_estimate: float
    cells: list[WeeklyFrictionCell]
    top_transition: str
    flow_pct: float  # % of day in productive flow


class RecoveryTimeEntry(BaseModel):
    transition: str
    avg_recovery_min: float
    p95_recovery_min: float
    sample_count: int
    task_driven_pct: float  # % of switches that were task-driven vs forced


class FrictionTrendWeek(BaseModel):
    week: str
    total_switches: int
    total_hrs_lost: float
    avg_recovery_min: float
    cost_estimate: float


# ── Cognitive Debt Accumulator models ──

class CognitiveDebtSignal(BaseModel):
    signal: str
    weight: float
    current_value: str
    level: str  # low | moderate | elevated | high | critical


class CognitiveDebtScore(BaseModel):
    developer: str
    score: float  # 0-100
    zone: str  # green | yellow | warning | danger
    signals: list[CognitiveDebtSignal]
    predicted_cliff_min: int  # minutes until productivity cliff
    recommended_action: str
    last_deep_focus_min_ago: int
    concurrent_prs: int


class TeamCognitiveDebtForecast(BaseModel):
    developer: str
    mon: float
    tue: float
    wed: float
    thu: float
    fri: float
    avg_score: float
    chronic_warning_days: int
    primary_cause: str


class ToolchainROITrigger(BaseModel):
    combination: str
    avg_cognitive_debt: float
    comparison_debt: float
    comparison_label: str
    weekly_cost_hrs: float
    recommendation: str
    severity: str  # info | warning | critical


class ToolchainRadarDashboard(BaseModel):
    developers: list[Developer]
    transition_matrix: list[Transition]
    hourly_timeline: list[HourlySlot]
    friction_by_task: list[FrictionByTask]
    tool_usage: list[ToolUsage]
    # Cross-Tool Friction Heatmap
    weekly_friction: list[DevWeeklyFriction]
    recovery_times: list[RecoveryTimeEntry]
    friction_trends: list[FrictionTrendWeek]
    # Cognitive Debt Accumulator
    cognitive_debt_scores: list[CognitiveDebtScore]
    team_debt_forecast: list[TeamCognitiveDebtForecast]
    roi_triggers: list[ToolchainROITrigger]
