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


class OrgCascadeDashboard(BaseModel):
    summary: OrgGapSummary
    dora_metrics: list[DoraMetric]
    bottlenecks: list[Bottleneck]
    amplifiers: list[Amplifier]
    cascade_flow: list[CascadeStage]
    roi_report: list[RoiReportEntry]
    dora_correlations: list[DoraCorrelation]
