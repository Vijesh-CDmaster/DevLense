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


class DeveloperFriction(BaseModel):
    dev: str
    area: str
    hours_lost: float
    trend: str  # increasing | stable | decreasing
    top_blocker: str


class FrictionTrendPoint(BaseModel):
    week: str
    code_reviews: float
    meetings: float
    ci_cd: float
    context_switching: float
    ai_friction: float


class ImpactSimulation(BaseModel):
    issue: str
    current_cost_monthly: float
    fix_effort_hours: float
    projected_savings_monthly: float
    roi_pct: float
    payback_weeks: float
    priority: str


class EmpathyDimension(BaseModel):
    category: str
    leader_awareness: float
    dev_severity: float
    gap: float
    action_rate: float
    color: str


class LeadershipBriefing(BaseModel):
    period: str
    top_issues: list[str]
    actions_taken: int
    actions_ignored: int
    total_hours_recovered: float
    total_hours_lost: float
    empathy_score_delta: float
    recommendations: list[str]
    dollar_impact: str


class EscalationItem(BaseModel):
    issue: str
    ignored_since: str
    days_ignored: int
    dev_cost_accumulated: float
    escalation_level: str  # team-lead | director | vp
    affected_devs: int
    auto_escalation_date: str


class LeadershipDashboard(BaseModel):
    friction_heatmap: list[FrictionPoint]
    empathy_gaps: list[EmpathyGap]
    action_loop: list[ActionLoopItem]
    decision_impacts: list[DecisionImpact]
    translations: list[Translation]
    pulse_results: list[PulseResult]
    empathy_score: EmpathyScoreDetail
    developer_frictions: list[DeveloperFriction]
    friction_trends: list[FrictionTrendPoint]
    impact_simulations: list[ImpactSimulation]
    empathy_dimensions: list[EmpathyDimension]
    leadership_briefing: LeadershipBriefing
    escalations: list[EscalationItem]
