from fastapi import APIRouter
from app.data.leadership_data import (
    get_full_dashboard, FRICTION_HEATMAP, EMPATHY_GAPS, ACTION_LOOP,
    DECISION_IMPACTS, TRANSLATIONS, PULSE_RESULTS, EMPATHY_SCORE,
    DEVELOPER_FRICTIONS, FRICTION_TRENDS, IMPACT_SIMULATIONS,
    EMPATHY_DIMENSIONS, LEADERSHIP_BRIEFING, ESCALATIONS,
    RT_FRICTION_HEATMAP, NET_AI_ROI, LEADERSHIP_BRIEF_VP,
    DECISION_EVENTS, DECISION_IMPACT_MEASUREMENTS,
    FRICTION_DEBT_LEDGER, BIDIRECTIONAL_DASHBOARD, EMPATHY_ROI_REPORT,
)
from app.services.empathy_engine import (
    compute_empathy_score, translate_pain_to_kpi,
    get_developer_friction_summary, compute_empathy_dimensions_summary,
)
from app.services.friction_debt_engine import (
    compute_friction_summary, compute_debt_summary, compute_accountability_summary,
)

router = APIRouter(prefix="/api/leadership", tags=["leadership"])


@router.get("/dashboard")
def dashboard():
    return get_full_dashboard()


@router.get("/friction-heatmap")
def friction_heatmap():
    return FRICTION_HEATMAP


@router.get("/empathy-gaps")
def empathy_gaps():
    return EMPATHY_GAPS


@router.get("/action-loop")
def action_loop():
    return ACTION_LOOP


@router.get("/decision-impacts")
def decision_impacts():
    return DECISION_IMPACTS


@router.get("/translations")
def translations():
    return TRANSLATIONS


@router.get("/pulse-results")
def pulse_results():
    return PULSE_RESULTS


@router.get("/empathy-score")
def empathy_score():
    return EMPATHY_SCORE


@router.get("/compute-empathy")
def compute_empathy():
    return compute_empathy_score()


@router.get("/translate")
def translate(pain: str = "Code reviews are slow"):
    return {"dev_pain": pain, "kpi": translate_pain_to_kpi(pain)}


@router.get("/developer-frictions")
def developer_frictions():
    return DEVELOPER_FRICTIONS


@router.get("/developer-friction-summary")
def developer_friction_summary():
    return get_developer_friction_summary()


@router.get("/friction-trends")
def friction_trends():
    return FRICTION_TRENDS


@router.get("/impact-simulations")
def impact_simulations():
    return IMPACT_SIMULATIONS


@router.get("/empathy-dimensions")
def empathy_dimensions():
    return EMPATHY_DIMENSIONS


@router.get("/empathy-dimensions-summary")
def empathy_dimensions_summary():
    return compute_empathy_dimensions_summary()


@router.get("/briefing")
def briefing():
    return LEADERSHIP_BRIEFING


@router.get("/escalations")
def escalations_endpoint():
    return ESCALATIONS


@router.get("/rt-friction-heatmap")
def rt_friction_heatmap():
    return RT_FRICTION_HEATMAP


@router.get("/net-ai-roi")
def net_ai_roi():
    return NET_AI_ROI


@router.get("/leadership-brief")
def leadership_brief():
    return LEADERSHIP_BRIEF_VP


@router.get("/decision-events")
def decision_events():
    return DECISION_EVENTS


@router.get("/decision-impact-measurements")
def decision_impact_measurements():
    return DECISION_IMPACT_MEASUREMENTS


@router.get("/friction-debt-ledger")
def friction_debt_ledger():
    return FRICTION_DEBT_LEDGER


@router.get("/bidirectional-dashboard")
def bidirectional_dashboard():
    return BIDIRECTIONAL_DASHBOARD


@router.get("/empathy-roi-report")
def empathy_roi_report():
    return EMPATHY_ROI_REPORT


@router.get("/friction-summary")
def friction_summary():
    return compute_friction_summary()


@router.get("/debt-summary")
def debt_summary():
    return compute_debt_summary()


@router.get("/accountability-summary")
def accountability_summary():
    return compute_accountability_summary()


@router.get("/escalations")
def escalations():
    return ESCALATIONS
