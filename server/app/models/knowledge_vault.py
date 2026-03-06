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
