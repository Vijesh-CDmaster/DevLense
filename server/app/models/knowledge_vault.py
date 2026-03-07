"""Pydantic models for Knowledge Vault (Problem 6 — Knowledge Transfer)."""

from pydantic import BaseModel


class KnowledgeNode(BaseModel):
    id: str
    label: str
    risk: str  # red | amber | green
    owners: int
    decisions: int
    code_regions: list[str]
    last_updated: str


class InterviewMessage(BaseModel):
    role: str  # bot | user
    msg: str
    timestamp: str
    decision_extracted: bool = False


class ArchitecturalDecision(BaseModel):
    id: str
    title: str
    reasoning: str
    alternatives_rejected: list[str]
    author: str
    date: str
    code_region: str
    tags: list[str]


class ArchaeologyResult(BaseModel):
    query: str
    answer: str
    author: str
    date: str
    decision_id: str
    confidence: int
    code_path: str


class KnowledgeRiskScore(BaseModel):
    overall_score: int
    high_risk_count: int
    medium_risk_count: int
    safe_count: int
    bus_factor_alerts: list[str]


class ReasoningExtraction(BaseModel):
    id: str
    code_region: str
    decision: str
    why: str
    alternatives: list[str]
    trade_offs: str
    author: str
    date: str


class OnboardingQuery(BaseModel):
    question: str
    answer: str
    source_decisions: list[str]
    confidence: int
    asked_by: str
    date: str


# ── New models for enhanced Knowledge Transfer ──


class KnowledgeDecayItem(BaseModel):
    module_id: str
    module_label: str
    last_validated: str
    days_since_validated: int
    decay_score: int  # 0-100, higher = more stale
    code_changes_since: int
    owner: str
    status: str  # fresh | aging | stale | critical


class InterviewSession(BaseModel):
    id: str
    senior_dev: str
    module: str
    status: str  # scheduled | completed | overdue
    scheduled_date: str
    topics: list[str]
    decisions_captured: int
    coverage_before: int
    coverage_after: int


class KnowledgeTransferEntry(BaseModel):
    from_dev: str
    to_dev: str
    module: str
    progress: int  # 0-100
    sessions_completed: int
    sessions_total: int
    last_session: str
    status: str  # not-started | in-progress | completed


class UndocumentedRegion(BaseModel):
    code_path: str
    complexity_score: int  # 1-100
    lines: int
    last_modified: str
    modified_by: str
    reason_suspected: str
    priority: str  # critical | high | medium


class OnboardingInsight(BaseModel):
    question: str
    ask_count: int
    avg_confidence: int
    has_documented_answer: bool
    gap_module: str
    last_asked: str


class DecisionChainLink(BaseModel):
    from_decision: str
    to_decision: str
    relationship: str  # led-to | replaced | depends-on | conflicts-with
    impact_radius: int  # number of modules affected
    description: str


class KnowledgeVaultDashboard(BaseModel):
    nodes: list[KnowledgeNode]
    interview_history: list[InterviewMessage]
    decisions: list[ArchitecturalDecision]
    risk_score: KnowledgeRiskScore
    recent_extractions: list[ReasoningExtraction]
    onboarding_queries: list[OnboardingQuery]
    archaeology_results: list[ArchaeologyResult]
    decay_items: list[KnowledgeDecayItem]
    interview_sessions: list[InterviewSession]
    transfer_matrix: list[KnowledgeTransferEntry]
    undocumented_regions: list[UndocumentedRegion]
    onboarding_insights: list[OnboardingInsight]
    decision_chains: list[DecisionChainLink]


# ═══════════════════════════════════════════════════════════════
# ██  CONVERSATIONAL EXTRACTION ENGINE + KNOWLEDGE MORTALITY
# ═══════════════════════════════════════════════════════════════


class ExtractionSessionMsg(BaseModel):
    role: str  # bot | dev
    text: str
    decision_logged: bool = False
    constraint_logged: bool = False


class ContextualExtractionSession(BaseModel):
    id: str
    target_dev: str
    commits_analysed: int
    bus_factor_modules: int
    trigger_file: str
    trigger_ownership_pct: int
    status: str  # active | completed | scheduled
    messages: list[ExtractionSessionMsg]
    decisions_captured: int
    constraints_captured: int


class DecisionNode(BaseModel):
    id: str
    decision: str
    context: str
    alternatives_rejected: list[dict]  # [{name, reason}]
    constraint_type: str  # hard | soft | none
    constraint_detail: str
    constraint_re_eval_trigger: str
    captured_date: str
    source_dev: str
    source_type: str  # interview | pr_review | commit_analysis
    code_regions: list[dict]  # [{file, lines}]
    status: str  # active | superseded | under_review


class ConstraintAlert(BaseModel):
    id: str
    decision_node_id: str
    pr_number: int
    pr_author: str
    file_modified: str
    lines_modified: str
    constraint_violated: str
    severity: str  # critical | warning
    auto_comment_posted: bool
    date: str
    resolution: str  # pending | acknowledged | overridden


class KnowledgeDecayEntry(BaseModel):
    code_region: str
    primary_holder: str
    ownership_pct: int
    decision_complexity: str  # high | medium | low
    months_since_decision: int
    months_since_last_touch: int
    kds_at_decision: int
    kds_6mo: int
    kds_12mo: int
    kds_18mo: int
    kds_current: int
    kds_projected_36mo: int
    critical_threshold_date: str  # when KDS crosses below 20
    months_to_critical: int


class KnowledgeAssetValuation(BaseModel):
    code_region: str
    module_label: str
    reconstruction_hours: int
    hourly_rate: int
    reconstruction_cost: int
    expected_incidents: float
    avg_incident_cost: int
    sla_penalty_exposure: int
    total_kav: int
    current_kds: int
    recoverable_value: int
    already_irrecoverable: int
    extraction_cost: int
    extraction_hours: float
    extraction_roi: int


class MortalityTimelineEntry(BaseModel):
    priority: str  # urgent | high | low
    code_region: str
    module_label: str
    kds: int
    kav: int
    expiry_date: str
    holder: str


class MortalityTimeline(BaseModel):
    org: str
    quarter: str
    entries: list[MortalityTimelineEntry]
    total_at_imminent_risk: int
    recommended_sessions: int
    recommended_hours: float
    preservation_roi: int
    extraction_cost: int


class DepartureExposure(BaseModel):
    dev: str
    signal: str
    signal_date: str
    modules_affected: int
    combined_kav: int
    recoverable_with_extraction: int
    extraction_sessions: int
    extraction_hours: int
    irrecoverable_immediately: int
    already_documented: int
    action_window_days: int
    first_critical_expiry: str
    extraction_cost: int
    preservation_roi: int
