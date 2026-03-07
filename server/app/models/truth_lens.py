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


# ═══════════════════════════════════════════
# Belief Audit Engine (Enhanced Self-Report vs Telemetry)
# ═══════════════════════════════════════════

class BeliefAuditDay(BaseModel):
    day: str
    self_reported: float  # % gain claimed
    telemetry: float      # % gain measured
    gap: float            # difference in pts


class DevBeliefAudit(BaseModel):
    developer: str
    week_label: str
    daily: list[BeliefAuditDay]
    avg_self_reported: float
    avg_telemetry: float
    avg_gap: float
    bias_pattern: str      # e.g. "Consistent Optimism Bias — 5-day streak"
    bias_type: str         # e.g. "Effort Substitution"
    alert_status: str      # none | monitoring | notified | escalated
    streak_days: int


class BiasTypology(BaseModel):
    type: str              # e.g. "Effort Substitution"
    description: str
    affected_developers: list[str]
    severity: str          # low | moderate | high | critical
    prevalence_pct: float  # % of team exhibiting this bias


class CalibrationScore(BaseModel):
    developer: str
    score: int             # 0-100 (100 = perfectly calibrated)
    direction: str         # over | under | calibrated
    avg_divergence_pts: float
    weeks_tracked: int
    trend: str             # improving | stable | worsening


# ═══════════════════════════════════════════
# Decision Contamination Tracker (Novel)
# ═══════════════════════════════════════════

class DecisionSignal(BaseModel):
    id: int
    event: str             # e.g. "Sprint velocity commitment"
    team: str
    detection_signal: str
    detected_at: str
    status: str            # detected | assessed | tracked | closed


class ContaminationAssessment(BaseModel):
    decision_signal_id: int
    event: str
    team: str
    committed_value: str   # e.g. "94 story points"
    baseline_value: str    # e.g. "67 pts 4-week average"
    spike_pct: float       # e.g. 40.0
    evidence_quality_score: int  # 0-100
    self_report_weeks: int
    belief_calibration: int    # team calibration score at decision time
    bias_direction: str
    telemetry_divergence: float  # pts
    days_since_calibration: int
    contamination_risk: str  # low | moderate | high | critical
    predicted_failure_pct: float
    recommended_action: str
    send_to: list[str]


class PostDecisionOutcome(BaseModel):
    decision_signal_id: int
    event: str
    team: str
    committed: str         # what was committed
    actual: str            # what was delivered
    shortfall_pct: float
    overtime_hrs: float
    overtime_cost: float
    feature_delay_sprints: int
    sla_missed: int
    total_contamination_cost: float
    eqs_at_decision: int
    avoidable: str         # HIGH | MODERATE | LOW


class OrgContaminationEntry(BaseModel):
    team: str
    decision: str
    eqs: int               # Evidence Quality Score at decision time
    eqs_level: str         # red | amber | green
    outcome: str           # Failed | Under review | At risk | On track
    cost: str              # e.g. "$18.4K" or "TBD" or "Saved $14K"


class OrgContaminationSummary(BaseModel):
    quarter: str
    entries: list[OrgContaminationEntry]
    decisions_below_40: int
    total_decisions: int
    estimated_preventable_cost: str


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
    # Belief Audit Engine
    belief_audits: list[DevBeliefAudit]
    bias_typologies: list[BiasTypology]
    calibration_scores: list[CalibrationScore]
    # Decision Contamination Tracker
    decision_signals: list[DecisionSignal]
    contamination_assessments: list[ContaminationAssessment]
    post_decision_outcomes: list[PostDecisionOutcome]
    org_contamination: OrgContaminationSummary
