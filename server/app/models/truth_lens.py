"""Pydantic models for Truth Lens (Problem 1 — Perception vs Reality Gap)."""

from __future__ import annotations

from pydantic import BaseModel


# ── Divergence Timeline ──
class DivergencePoint(BaseModel):
    month: str
    belief: float
    reality: float
    gap: float


# ── Developer Breakdown ──
class DevBreakdown(BaseModel):
    name: str
    belief: str
    reality: str
    gap: float
    level: str  # red | amber | green


# ── Self-Report vs Telemetry ──
class SelfReportEntry(BaseModel):
    dev: str
    task: str
    self_report: str
    actual_time: str
    self_gain: str
    telemetry_gain: str
    timestamp: str


# ── Weekly Perception Drift ──
class WeeklyDrift(BaseModel):
    week: str
    belief: float
    reality: float
    gap: float
    momentum: str  # stable | widening | accelerating


# ── Manager Alert ──
class ManagerAlert(BaseModel):
    id: int
    type: str  # threshold | drift
    severity: str  # red | amber | green
    msg: str
    action: str
    time: str
    resolved: bool


# ── Micro-Survey ──
class SurveyQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    context_file: str | None = None


class SurveyResponse(BaseModel):
    dev: str
    question: str
    answer: str
    real_delta: str
    time: str


class SurveySubmission(BaseModel):
    dev: str
    question: str
    answer: str
    commit_sha: str | None = None
    file_path: str | None = None


# ── Illusion Score ──
class IllusionDimension(BaseModel):
    dimension: str
    belief: float
    reality: float
    icon: str


class IllusionScore(BaseModel):
    score: int
    drift_rate: str
    threshold: int
    dimensions: list[IllusionDimension]


# ── Gauge Data ──
class GaugeData(BaseModel):
    team_belief: str
    telemetry_reality: str
    belief_sub: str
    reality_sub: str


# ── Alert Config ──
class AlertConfig(BaseModel):
    threshold_pct: int


# ── Full Dashboard Response ──
class TruthLensDashboard(BaseModel):
    illusion_score: IllusionScore
    gauges: GaugeData
    divergence_timeline: list[DivergencePoint]
    dev_breakdown: list[DevBreakdown]
    self_report_comparator: list[SelfReportEntry]
    weekly_drift: list[WeeklyDrift]
    alerts: list[ManagerAlert]
    recent_surveys: list[SurveyResponse]
    alert_config: AlertConfig
