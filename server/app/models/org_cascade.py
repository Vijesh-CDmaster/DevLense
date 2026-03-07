from pydantic import BaseModel


class DoraMetric(BaseModel):
    metric: str
    value: float
    target: float
    unit: str


class Bottleneck(BaseModel):
    label: str
    loss: float
    color: str


class Amplifier(BaseModel):
    practice: str
    impact: str
    color: str


class CascadeStage(BaseModel):
    stage: str
    pct: float
    color: str


class OrgGapSummary(BaseModel):
    org_gap: float
    individual_gain: float
    team_impact: float


class RoiReportEntry(BaseModel):
    week: str
    ai_investment: float
    measured_gain: float
    org_throughput_delta: float
    effective_roi: float


class DoraCorrelation(BaseModel):
    metric: str
    ai_usage_pct: float
    metric_change_pct: float
    correlation: float
    trend: str


# ── AI Waste Classifier models ──

class AIWasteEntry(BaseModel):
    waste_type: str  # rework | review_overflow | context_switch | quality_tax | coordination
    label: str
    hours_consumed: float
    detection_source: str
    severity: str  # low | medium | high | critical
    detail: str
    color: str


class WasteWeeklyTrend(BaseModel):
    week: str
    rework: float
    review_overflow: float
    context_switch: float
    quality_tax: float
    coordination: float
    total_waste: float
    gross_gain: float
    net_gain: float


class TrueAIROI(BaseModel):
    period: str
    ai_assisted_commits: int
    gross_hours_saved: float
    waste_breakdown: list[dict]
    net_org_gain: float
    waste_absorption_rate: float


class TeamWasteBreakdown(BaseModel):
    team: str
    total_waste_hrs: float
    dominant_waste: str
    rework: float
    review_overflow: float
    context_switch: float
    quality_tax: float
    coordination: float
    waste_absorption_rate: float


# ── DORA-AI Cascade Dashboard models ──

class CascadeEfficiencyScore(BaseModel):
    score: float
    individual_gain_pct: float
    team_throughput_pct: float
    org_delivery_pct: float
    trend: str
    leak_stages: list[dict]


class TeamCascadeView(BaseModel):
    team: str
    ai_usage_pct: float
    pr_volume: int
    pr_review_latency_hrs: float
    deploy_frequency: float
    lead_time_days: float
    cascade_efficiency: float
    waste_absorption_rate: float
    platform_maturity: str


class FlowStageDetail(BaseModel):
    stage: str
    source: str
    value_in: float
    value_out: float
    loss: float
    leak_reason: str
    color: str


class StoryPointTracker(BaseModel):
    sprint: str
    planned: int
    completed: int
    ai_assisted_pct: float
    delivery_rate: float


class OrgCascadeDashboard(BaseModel):
    summary: OrgGapSummary
    dora_metrics: list[DoraMetric]
    bottlenecks: list[Bottleneck]
    amplifiers: list[Amplifier]
    cascade_flow: list[CascadeStage]
    roi_report: list[RoiReportEntry]
    dora_correlations: list[DoraCorrelation]
    # AI Waste Classifier
    waste_entries: list[AIWasteEntry]
    waste_trends: list[WasteWeeklyTrend]
    true_ai_roi: TrueAIROI
    team_waste: list[TeamWasteBreakdown]
    # DORA-AI Cascade
    cascade_efficiency: CascadeEfficiencyScore
    team_cascades: list[TeamCascadeView]
    flow_details: list[FlowStageDetail]
    story_points: list[StoryPointTracker]
