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


# ══════════════════════════════════════════════
# Real-Time Developer Friction Heatmap + Net AI ROI
# ══════════════════════════════════════════════

class FrictionHeatmapRow(BaseModel):
    source: str
    hours_lost: float
    team_cost: float
    trend: str        # ↑ +14% wk/wk | → Stable | ↓ -6% wk/wk | ↑ NEW this wk
    trend_direction: str  # up | stable | down | new


class NetAIROI(BaseModel):
    total_friction_hours: float
    total_friction_cost: float
    ai_hours_saved: float
    ai_cost_saved: float
    net_roi_dollars: float
    net_status: str  # positive | negative | neutral
    consecutive_weeks_negative: int


class LeadershipBrief(BaseModel):
    recipient_role: str   # VP Engineering | CTO | CFO
    focus: str            # delivery | cost | retention
    period: str
    items: list[dict]     # freeform brief items
    empathy_score: int
    alerts_sent: int
    alerts_acted: int
    alerts_acted_pct: float


# ══════════════════════════════════════════════
# Organisational Friction Debt Ledger
# ══════════════════════════════════════════════

class DecisionEvent(BaseModel):
    id: str
    event_type: str       # process_policy | approval_gate | tool_mandate | meeting_mandate | resource_reallocation | non_decision
    decision: str
    decision_maker: str
    enacted_date: str
    scope: str
    detection_signal: str


class DecisionImpactMeasurement(BaseModel):
    decision_id: str
    decision: str
    decision_maker: str
    enacted_date: str
    scope: str
    pre_merge_time_hrs: float
    post_merge_time_hrs: float
    pre_blocked_tickets: int
    post_blocked_tickets: int
    pre_friction_hrs: float
    post_friction_hrs: float
    pre_approval_loops: int
    post_approval_loops: int
    causal_score: float
    net_friction_hrs: float
    financial_impact_week: float
    cumulative_cost: float
    weeks_since: int
    mitigation_available: str
    mitigation_cost: float
    mitigation_weekly_saving: float
    status: str  # mitigated | not_mitigated | partial


class FrictionDebtEntry(BaseModel):
    decision: str
    maker: str
    cumulative_cost: float
    duration_weeks: int
    resolution: str  # resolved | unresolved | partial | roi_positive
    status_icon: str


class FrictionDebtLedger(BaseModel):
    quarter: str
    org: str
    entries: list[FrictionDebtEntry]
    total_friction_introduced: float
    total_friction_saved: float
    net_friction_debt: float
    decision_quality_scores: list[dict]


class ActionLoopDevView(BaseModel):
    friction_flagged: str
    first_reported: str
    weeks_ago: int
    alerts_sent: int
    leader_response: str  # action description or "No documented action"
    response_status: str  # acted | not_acted
    outcome_measured: str
    personal_hours_affected: float
    personal_cost: float
    team_hours_affected: float
    team_cost: float


class BidirectionalDashboard(BaseModel):
    developer: str
    team: str
    action_loops: list[ActionLoopDevView]
    empathy_score: int
    alerts_this_quarter: int
    acted_within_2wk: int
    acted_after_2wk: int
    not_acted: int


class EmpathyROIReport(BaseModel):
    quarter: str
    total_alerts: int
    actions_taken: int
    friction_cost_reduced: float
    friction_cost_persisting: float
    estimated_additional_recovery: float
    cost_of_interventions: float
    net_forgone_roi: float
    empathy_roi_multiplier: float
    empathy_score_trend: list[int]
    highest_roi_intervention: dict
    lowest_roi_non_decision: dict
