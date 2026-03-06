from pydantic import BaseModel


class FrictionPoint(BaseModel):
    area: str
    dev_hours: float
    leader_estimate: float
    severity: str


class EmpathyGap(BaseModel):
    dev_says: str
    leader_thinks: str
    gap: str
    cost: str
    category: str
    kpi_impact: str


class ActionLoopItem(BaseModel):
    issue: str
    action: str
    status: str  # done | pending | ignored
    date: str
    hours_recovered: float
    dev_satisfaction: float


class DecisionImpact(BaseModel):
    decision: str
    made_by: str
    date: str
    dev_hours_lost: float
    dollars_lost: float
    affected_devs: int
    category: str


class Translation(BaseModel):
    dev_pain: str
    exec_translation: str
    kpi: str
    dollar_impact: str
    priority: str  # critical | high | medium


class PulseResult(BaseModel):
    week: str
    productivity: float
    blocker_count: float
    ai_sentiment: float
    response_rate: float


class EmpathyScoreWeekPoint(BaseModel):
    week: str
    score: float


class EmpathyScoreDetail(BaseModel):
    score: float
    label: str
    trend: str
    monthly_cost: str
    gap_areas: int
    total_gaps: int
    weekly_trend: list[EmpathyScoreWeekPoint]


class LeadershipDashboard(BaseModel):
    friction_heatmap: list[FrictionPoint]
    empathy_gaps: list[EmpathyGap]
    action_loop: list[ActionLoopItem]
    decision_impacts: list[DecisionImpact]
    translations: list[Translation]
    pulse_results: list[PulseResult]
    empathy_score: EmpathyScoreDetail
