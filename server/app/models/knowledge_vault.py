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


class KnowledgeVaultDashboard(BaseModel):
    nodes: list[KnowledgeNode]
    interview_history: list[InterviewMessage]
    decisions: list[ArchitecturalDecision]
    risk_score: KnowledgeRiskScore
    recent_extractions: list[ReasoningExtraction]
    onboarding_queries: list[OnboardingQuery]
    archaeology_results: list[ArchaeologyResult]
