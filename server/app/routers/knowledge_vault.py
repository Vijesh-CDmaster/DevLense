"""Knowledge Vault API router."""

from fastapi import APIRouter

from app.models.knowledge_vault import (
    KnowledgeVaultDashboard, KnowledgeNode, InterviewMessage,
    ArchitecturalDecision, ArchaeologyResult, KnowledgeRiskScore,
    ReasoningExtraction, OnboardingQuery,
)
from app.data.knowledge_vault_data import (
    NODES, INTERVIEW_HISTORY, DECISIONS, RISK_SCORE,
    EXTRACTIONS, ONBOARDING_QUERIES, ARCHAEOLOGY_RESULTS,
)
from app.services.knowledge_analyzer import compute_risk_score, compute_bus_factor

router = APIRouter(prefix="/api/knowledge-vault", tags=["knowledge-vault"])


@router.get("/dashboard", response_model=KnowledgeVaultDashboard)
async def get_dashboard():
    return KnowledgeVaultDashboard(
        nodes=NODES,
        interview_history=INTERVIEW_HISTORY,
        decisions=DECISIONS,
        risk_score=RISK_SCORE,
        recent_extractions=EXTRACTIONS,
        onboarding_queries=ONBOARDING_QUERIES,
        archaeology_results=ARCHAEOLOGY_RESULTS,
    )


@router.get("/nodes", response_model=list[KnowledgeNode])
async def get_nodes():
    return NODES


@router.get("/interviews", response_model=list[InterviewMessage])
async def get_interviews():
    return INTERVIEW_HISTORY


@router.get("/decisions", response_model=list[ArchitecturalDecision])
async def get_decisions():
    return DECISIONS


@router.get("/risk-score", response_model=KnowledgeRiskScore)
async def get_risk_score():
    return RISK_SCORE


@router.get("/extractions", response_model=list[ReasoningExtraction])
async def get_extractions():
    return EXTRACTIONS


@router.get("/onboarding", response_model=list[OnboardingQuery])
async def get_onboarding():
    return ONBOARDING_QUERIES


@router.get("/archaeology", response_model=list[ArchaeologyResult])
async def get_archaeology():
    return ARCHAEOLOGY_RESULTS


@router.get("/bus-factor")
async def get_bus_factor():
    result = []
    for node in NODES:
        result.append({
            "module": node.label,
            "owners": node.owners,
            "risk": compute_bus_factor(node.owners),
        })
    return result
