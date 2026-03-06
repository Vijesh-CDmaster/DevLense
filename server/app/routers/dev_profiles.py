from fastapi import APIRouter, HTTPException
from app.data.dev_profiles_data import (
    get_full_dashboard, DEVELOPERS, BENEFIT_CURVE, IMPACT_TIMELINE,
    BENEFIT_HARM, PRODUCTIVITY_TIMELINES, REVERSE_ALERTS, TRUST_SCORES,
    switch_mode, acknowledge_alert, update_trust_threshold,
)
from app.models.dev_profiles import SwitchModeRequest, UpdateTrustThresholdRequest
from app.services.seniority_detector import detect_seniority_level, compute_ai_impact, get_optimal_mode

router = APIRouter(prefix="/api/dev-profiles", tags=["dev-profiles"])


@router.get("/dashboard")
def dashboard():
    return get_full_dashboard()


@router.get("/developers")
def developers():
    return DEVELOPERS


@router.get("/benefit-curve")
def benefit_curve():
    return BENEFIT_CURVE


@router.get("/impact-timeline")
def impact_timeline():
    return IMPACT_TIMELINE


@router.get("/benefit-harm")
def benefit_harm():
    return BENEFIT_HARM


@router.get("/productivity-timelines")
def productivity_timelines():
    return PRODUCTIVITY_TIMELINES


@router.get("/reverse-alerts")
def reverse_alerts():
    return REVERSE_ALERTS


@router.get("/trust-scores")
def trust_scores():
    return TRUST_SCORES


@router.get("/detect-seniority")
def detect_seniority(commits: int = 100, pr_complexity: str = "Medium", years_exp: int = 3):
    level = detect_seniority_level(commits, pr_complexity, years_exp)
    return {"seniority": level}


@router.get("/ai-impact/{dev_name}")
def ai_impact(dev_name: str):
    return compute_ai_impact(dev_name)


@router.get("/optimal-mode/{dev_name}")
def optimal_mode(dev_name: str):
    mode = get_optimal_mode(dev_name)
    return {"dev": dev_name, "recommended_mode": mode}


@router.put("/developers/{dev_name}/mode")
def set_mode(dev_name: str, req: SwitchModeRequest):
    if req.mode not in ("Scaffold", "Standard", "Architect"):
        raise HTTPException(status_code=400, detail="Mode must be Scaffold, Standard, or Architect")
    dev = switch_mode(dev_name, req.mode)
    if dev is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return dev


@router.post("/reverse-alerts/{index}/acknowledge")
def ack_alert(index: int):
    alert = acknowledge_alert(index)
    if alert is None:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"acknowledged": True, "alert": alert}


@router.put("/trust-scores/{dev_name}/threshold")
def set_trust_threshold(dev_name: str, req: UpdateTrustThresholdRequest):
    ts = update_trust_threshold(dev_name, req.threshold)
    if ts is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return ts
