from fastapi import APIRouter
from app.data.trust_engine_data import (
    get_full_dashboard, SUGGESTIONS, TASK_TYPES, CALIBRATION,
    CONFIDENCE_METERS, VERIFY_ALERTS, WEEKLY_REPORT,
)
from app.services.trust_scorer import compute_trust_score, should_verify

router = APIRouter(prefix="/api/trust-engine", tags=["trust-engine"])


@router.get("/dashboard")
def dashboard():
    return get_full_dashboard()


@router.get("/suggestions")
def suggestions():
    return SUGGESTIONS


@router.get("/task-types")
def task_types():
    return TASK_TYPES


@router.get("/calibration")
def calibration():
    return CALIBRATION


@router.get("/confidence-meters")
def confidence_meters():
    return CONFIDENCE_METERS


@router.get("/verify-alerts")
def verify_alerts():
    return VERIFY_ALERTS


@router.get("/weekly-report")
def weekly_report():
    return WEEKLY_REPORT


@router.get("/score")
def score_suggestion(
    task_type: str = "Refactoring",
    complexity: str = "Medium",
    files_affected: int = 1,
    context_match: float = 70.0,
):
    return compute_trust_score(task_type, complexity, files_affected, context_match)


@router.get("/should-verify")
def check_verify(trust_score: float = 50.0, task_type: str = "Refactoring"):
    return {"should_verify": should_verify(trust_score, task_type)}
