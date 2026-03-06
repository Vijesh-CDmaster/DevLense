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
