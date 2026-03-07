from fastapi import APIRouter, HTTPException
from app.data.dev_profiles_data import (
    get_full_dashboard, DEVELOPERS, BENEFIT_CURVE, IMPACT_TIMELINE,
    BENEFIT_HARM, PRODUCTIVITY_TIMELINES, REVERSE_ALERTS, TRUST_SCORES,
    switch_mode, acknowledge_alert, update_trust_threshold,
    SENIORITY_PROFILES, AI_IMPACT_DASHBOARDS,
    JUNIOR_DEPENDENCY_INDICES, SENIORITY_VELOCITY_DEFICITS,
    TEAM_PIPELINE_RISK, ORG_PIPELINE_DEBT,
)
from app.models.dev_profiles import SwitchModeRequest, UpdateTrustThresholdRequest
from app.services.seniority_detector import detect_seniority_level, compute_ai_impact, get_optimal_mode
from app.services.seniority_profiler import compute_seniority_summary
from app.services.pipeline_forecaster import compute_pipeline_summary

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


# ── Seniority Profiler + AI Impact Dashboard ──

@router.get("/seniority-profiles")
def seniority_profiles():
    return SENIORITY_PROFILES


@router.get("/seniority-profiles/{dev_name}")
def seniority_profile(dev_name: str):
    sp = next((s for s in SENIORITY_PROFILES if s.developer == dev_name), None)
    if sp is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return sp


@router.get("/ai-impact-dashboards")
def ai_impact_dashboards():
    return AI_IMPACT_DASHBOARDS


@router.get("/ai-impact-dashboards/{dev_name}")
def ai_impact_dashboard(dev_name: str):
    aid = next((a for a in AI_IMPACT_DASHBOARDS if a.developer == dev_name), None)
    if aid is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return aid


@router.get("/seniority-summary")
def seniority_summary():
    return compute_seniority_summary()


# ── Talent Pipeline Debt Forecaster ──

@router.get("/junior-dependency-indices")
def junior_dependency_indices():
    return JUNIOR_DEPENDENCY_INDICES


@router.get("/seniority-velocity-deficits")
def seniority_velocity_deficits():
    return SENIORITY_VELOCITY_DEFICITS


@router.get("/team-pipeline-risk")
def team_pipeline_risk():
    return TEAM_PIPELINE_RISK


@router.get("/org-pipeline-debt")
def org_pipeline_debt():
    return ORG_PIPELINE_DEBT


@router.get("/pipeline-summary")
def pipeline_summary():
    return compute_pipeline_summary()
