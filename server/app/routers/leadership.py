from fastapi import APIRouter
from app.data.leadership_data import (
    get_full_dashboard, FRICTION_HEATMAP, EMPATHY_GAPS, ACTION_LOOP,
    DECISION_IMPACTS, TRANSLATIONS, PULSE_RESULTS, EMPATHY_SCORE,
)
from app.services.empathy_engine import compute_empathy_score, translate_pain_to_kpi

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
