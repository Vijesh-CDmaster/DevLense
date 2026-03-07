"""Knowledge Vault API router."""

from fastapi import APIRouter

from app.models.knowledge_vault import (
    KnowledgeVaultDashboard, KnowledgeNode, InterviewMessage,
    ArchitecturalDecision, ArchaeologyResult, KnowledgeRiskScore,
    ReasoningExtraction, OnboardingQuery, KnowledgeDecayItem,
    InterviewSession, KnowledgeTransferEntry, UndocumentedRegion,
    OnboardingInsight, DecisionChainLink,
    ContextualExtractionSession, DecisionNode, ConstraintAlert,
    KnowledgeDecayEntry, KnowledgeAssetValuation,
    MortalityTimeline, DepartureExposure,
)
from app.data.knowledge_vault_data import (
    NODES, INTERVIEW_HISTORY, DECISIONS, RISK_SCORE,
    EXTRACTIONS, ONBOARDING_QUERIES, ARCHAEOLOGY_RESULTS,
    DECAY_ITEMS, INTERVIEW_SESSIONS, TRANSFER_MATRIX,
    UNDOCUMENTED_REGIONS, ONBOARDING_INSIGHTS, DECISION_CHAINS,
    EXTRACTION_SESSION, DECISION_NODES, CONSTRAINT_ALERTS,
    KNOWLEDGE_DECAY_SCORES, KNOWLEDGE_ASSET_VALUATIONS,
    MORTALITY_TIMELINE, DEPARTURE_EXPOSURE,
    get_full_dashboard,
)
from app.services.knowledge_analyzer import (
    compute_risk_score, compute_bus_factor,
    compute_decay_summary, compute_transfer_velocity, compute_knowledge_gaps,
)
from app.services.knowledge_mortality import (
    compute_mortality_summary, compute_departure_impact,
    compute_constraint_coverage,
)

router = APIRouter(prefix="/api/knowledge-vault", tags=["knowledge-vault"])


@router.get("/dashboard")
async def get_dashboard():
    return get_full_dashboard()


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


@router.get("/decay", response_model=list[KnowledgeDecayItem])
async def get_decay():
    return DECAY_ITEMS


@router.get("/decay-summary")
async def get_decay_summary():
    return compute_decay_summary(DECAY_ITEMS)


@router.get("/interview-sessions", response_model=list[InterviewSession])
async def get_interview_sessions():
    return INTERVIEW_SESSIONS


@router.get("/transfer-matrix", response_model=list[KnowledgeTransferEntry])
async def get_transfer_matrix():
    return TRANSFER_MATRIX


@router.get("/transfer-velocity")
async def get_transfer_velocity():
    return compute_transfer_velocity(TRANSFER_MATRIX)


@router.get("/undocumented", response_model=list[UndocumentedRegion])
async def get_undocumented():
    return UNDOCUMENTED_REGIONS


@router.get("/onboarding-insights", response_model=list[OnboardingInsight])
async def get_onboarding_insights():
    return ONBOARDING_INSIGHTS


@router.get("/knowledge-gaps")
async def get_knowledge_gaps():
    return compute_knowledge_gaps(ONBOARDING_INSIGHTS)


@router.get("/decision-chains", response_model=list[DecisionChainLink])
async def get_decision_chains():
    return DECISION_CHAINS


# ── Contextual Extraction Engine ──

@router.get("/extraction-session")
async def get_extraction_session():
    return EXTRACTION_SESSION


@router.get("/decision-nodes", response_model=list[DecisionNode])
async def get_decision_nodes():
    return DECISION_NODES


@router.get("/constraint-alerts", response_model=list[ConstraintAlert])
async def get_constraint_alerts():
    return CONSTRAINT_ALERTS


@router.get("/constraint-coverage")
async def get_constraint_coverage():
    return compute_constraint_coverage(DECISION_NODES, CONSTRAINT_ALERTS)


# ── Knowledge Mortality Forecaster ──

@router.get("/knowledge-decay-scores", response_model=list[KnowledgeDecayEntry])
async def get_knowledge_decay_scores():
    return KNOWLEDGE_DECAY_SCORES


@router.get("/asset-valuations", response_model=list[KnowledgeAssetValuation])
async def get_asset_valuations():
    return KNOWLEDGE_ASSET_VALUATIONS


@router.get("/mortality-timeline")
async def get_mortality_timeline():
    return MORTALITY_TIMELINE


@router.get("/departure-exposure")
async def get_departure_exposure():
    return DEPARTURE_EXPOSURE


@router.get("/mortality-summary")
async def get_mortality_summary():
    return compute_mortality_summary(
        KNOWLEDGE_DECAY_SCORES, KNOWLEDGE_ASSET_VALUATIONS, MORTALITY_TIMELINE,
    )


@router.get("/departure-impact")
async def get_departure_impact():
    return compute_departure_impact(DEPARTURE_EXPOSURE, KNOWLEDGE_ASSET_VALUATIONS)
