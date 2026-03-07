from pydantic import BaseModel

class Developer(BaseModel):
    name: str
    seniority: str
    level: int
    ai_impact: float
    mode: str
    commits: int
    pr_complexity: str
    alert: bool
    years_exp: int
    code_patterns: list[str]
    trust_score: float
    trust_threshold: float

class BenefitCurvePoint(BaseModel):
    seniority: str
    impact: float

class ImpactTimelinePoint(BaseModel):
    month: str
    gain: float

class BenefitHarm(BaseModel):
    dev: str
    help_rate: float
    harm_rate: float
    neutral_rate: float
    net_impact: float
    sessions_tracked: int
    last_alert: str

class ProductivityTimelinePoint(BaseModel):
    month: str
    productivity: float
    ai_usage: float
    quality: float

class ProductivityTimeline(BaseModel):
    dev: str
    timeline: list[ProductivityTimelinePoint]

class ReverseAlert(BaseModel):
    dev: str
    severity: str
    msg: str
    recommendation: str
    ai_time_lost: float
    manual_estimate: float
    triggered: str

class TrustScore(BaseModel):
    dev: str
    seniority: str
    trust_score: float
    threshold: float
    auto_accept_rate: float
    review_required: int
    override_count: int

class DevProfilesDashboard(BaseModel):
    developers: list[Developer]
    benefit_curve: list[BenefitCurvePoint]
    impact_timeline: list[ImpactTimelinePoint]
    benefit_harm: list[BenefitHarm]
    productivity_timelines: list[ProductivityTimeline]
    reverse_alerts: list[ReverseAlert]
    trust_scores: list[TrustScore]


class SwitchModeRequest(BaseModel):
    mode: str  # "Scaffold" | "Standard" | "Architect"


class UpdateTrustThresholdRequest(BaseModel):
    threshold: float


# ── Seniority Profiler + AI Benefit/Harm Detector (Enhanced) ──

class SenioritySignal(BaseModel):
    signal: str
    measurement: str
    raw_value: float
    score_contribution: float

class SeniorityProfile(BaseModel):
    developer: str
    seniority_score: int  # 0-100
    band: str  # Emerging / Developing / Proficient / Expert
    signals: list[SenioritySignal]
    top_signal: str
    years_active: int

class TaskTypeImpact(BaseModel):
    task_type: str
    ai_on_avg_hrs: float
    ai_off_avg_hrs: float
    delta_pct: float
    signal: str  # HARM / BENEFIT / MARGINAL

class AIImpactDashboard(BaseModel):
    developer: str
    seniority_score: int
    band: str
    task_impacts: list[TaskTypeImpact]
    net_impact_hrs: float
    recommended_disable: list[str]
    benefit_zone: list[str]


# ── Talent Pipeline Debt Forecaster (Novel) ──

class JDIWeek(BaseModel):
    week_range: str
    independent_pct: float

class JuniorDependencyIndex(BaseModel):
    developer: str
    band: str
    seniority_score: int
    weekly_jdi: list[JDIWeek]
    jdi_trend_pts: float
    atrophy_velocity: float  # pts/week
    projected_jdi_week28: float

class SeniorityVelocityDeficit(BaseModel):
    developer: str
    tenure_months: int
    expected_score_growth: float  # pts/yr
    actual_score_growth: float
    gap_pct: float
    expected_complexity_growth: float
    actual_complexity_growth: float
    complexity_gap_pct: float
    expected_review_pct: float
    actual_review_pct: float
    review_gap_pct: float
    svr: float  # Seniority Velocity Ratio
    projected_proficient_month: int
    expected_proficient_month: int
    timeline_cost_months: int

class TeamPipelineRisk(BaseModel):
    team: str
    juniors_tracked: int
    avg_jdi_trend: float
    avg_svr: float
    devs_on_atrophy: int
    atrophy_pct: float
    risk_score: int  # 0-100
    risk_level: str  # LOW / MODERATE / HIGH / CRITICAL
    external_hire_by: str

class InterventionOption(BaseModel):
    option: str
    description: str
    quarterly_cost: str
    debt_reduction: str

class OrgPipelineDebtReport(BaseModel):
    quarter: str
    severe_atrophy_count: int
    total_juniors: int
    atrophy_pct: float
    avg_svr: float
    svr_gap_below_ok: float
    projected_senior_gap: int
    gap_by_quarter: str
    cost_per_external_hire: float
    ramp_premium_per_role: float
    knowledge_loss_per_role: float
    total_pipeline_debt: float
    preventable_by: str
    interventions: list[InterventionOption]
