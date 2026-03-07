from fastapi import APIRouter
from app.data.trust_engine_data import (
    get_full_dashboard, SUGGESTIONS, TASK_TYPES, CALIBRATION,
    CONFIDENCE_METERS, VERIFY_ALERTS, WEEKLY_REPORT, DEVELOPER_PROFILES,
    PER_SUGGESTION_SCORES, VTE_PROTOCOLS, CALIBRATION_REPORT,
)
from app.services.trust_scorer import compute_trust_score, should_verify
from app.services.vte_engine import get_vte_checklist, compute_verification_tax_summary

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
    developer: str | None = None,
):
    return compute_trust_score(task_type, complexity, files_affected, context_match, developer)


@router.get("/should-verify")
def check_verify(trust_score: float = 50.0, task_type: str = "Refactoring"):
    return {"should_verify": should_verify(trust_score, task_type)}


@router.get("/developer-profiles")
def developer_profiles():
    return DEVELOPER_PROFILES


@router.get("/developer-profiles/{dev_name}")
def developer_profile(dev_name: str):
    profile = next(
        (p for p in DEVELOPER_PROFILES if p.name.lower() == dev_name.lower()), None
    )
    if profile is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Developer not found")
    return profile


@router.get("/per-suggestion-scores")
def per_suggestion_scores():
    return PER_SUGGESTION_SCORES


@router.get("/vte-protocols")
def vte_protocols():
    return VTE_PROTOCOLS


@router.get("/vte-checklist/{suggestion_id}")
def vte_checklist(suggestion_id: str):
    return get_vte_checklist(suggestion_id)


@router.get("/vte-summary")
def vte_summary():
    return compute_verification_tax_summary()


@router.get("/calibration-report")
def calibration_report():
    return CALIBRATION_REPORT
