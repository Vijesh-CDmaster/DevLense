from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard, get_data_key, update_data_key
from app.models.dev_profiles import SwitchModeRequest, UpdateTrustThresholdRequest
from app.services.seniority_detector import detect_seniority_level, compute_ai_impact, get_optimal_mode
from app.services.seniority_profiler import compute_seniority_summary
from app.services.pipeline_forecaster import compute_pipeline_summary

router = APIRouter(prefix="/api/dev-profiles", tags=["dev-profiles"])


@router.get("/dashboard")
async def dashboard(db: AsyncSession = Depends(get_db)):
    return await get_dashboard(db, "dev_profiles")


@router.get("/developers")
async def developers(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "developers")


@router.get("/benefit-curve")
async def benefit_curve(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "benefit_curve")


@router.get("/impact-timeline")
async def impact_timeline(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "impact_timeline")


@router.get("/benefit-harm")
async def benefit_harm(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "benefit_harm")


@router.get("/productivity-timelines")
async def productivity_timelines(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "productivity_timelines")


@router.get("/reverse-alerts")
async def reverse_alerts(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "reverse_alerts")


@router.get("/trust-scores")
async def trust_scores(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "trust_scores")


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
async def set_mode(dev_name: str, req: SwitchModeRequest, db: AsyncSession = Depends(get_db)):
    if req.mode not in ("Scaffold", "Standard", "Architect"):
        raise HTTPException(status_code=400, detail="Mode must be Scaffold, Standard, or Architect")
    devs = await get_data_key(db, "dev_profiles", "developers") or []
    for i, dev in enumerate(devs):
        if dev["name"] == dev_name:
            devs[i]["mode"] = req.mode
            await update_data_key(db, "dev_profiles", "developers", devs)
            return devs[i]
    raise HTTPException(status_code=404, detail="Developer not found")


@router.post("/reverse-alerts/{index}/acknowledge")
async def ack_alert(index: int, db: AsyncSession = Depends(get_db)):
    alerts = await get_data_key(db, "dev_profiles", "reverse_alerts") or []
    if not (0 <= index < len(alerts)):
        raise HTTPException(status_code=404, detail="Alert not found")
    alert = alerts.pop(index)
    await update_data_key(db, "dev_profiles", "reverse_alerts", alerts)
    return {"acknowledged": True, "alert": alert}


@router.put("/trust-scores/{dev_name}/threshold")
async def set_trust_threshold(dev_name: str, req: UpdateTrustThresholdRequest, db: AsyncSession = Depends(get_db)):
    scores = await get_data_key(db, "dev_profiles", "trust_scores") or []
    for i, ts in enumerate(scores):
        if ts["dev"] == dev_name:
            scores[i]["threshold"] = req.threshold
            await update_data_key(db, "dev_profiles", "trust_scores", scores)
            return scores[i]
    raise HTTPException(status_code=404, detail="Developer not found")


# ── Seniority Profiler + AI Impact Dashboard ──

@router.get("/seniority-profiles")
async def seniority_profiles(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "seniority_profiles")


@router.get("/seniority-profiles/{dev_name}")
async def seniority_profile(dev_name: str, db: AsyncSession = Depends(get_db)):
    profiles = await get_data_key(db, "dev_profiles", "seniority_profiles") or []
    sp = next((s for s in profiles if s["developer"] == dev_name), None)
    if sp is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return sp


@router.get("/ai-impact-dashboards")
async def ai_impact_dashboards(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "ai_impact_dashboards")


@router.get("/ai-impact-dashboards/{dev_name}")
async def ai_impact_dashboard(dev_name: str, db: AsyncSession = Depends(get_db)):
    dashboards = await get_data_key(db, "dev_profiles", "ai_impact_dashboards") or []
    aid = next((a for a in dashboards if a["developer"] == dev_name), None)
    if aid is None:
        raise HTTPException(status_code=404, detail="Developer not found")
    return aid


@router.get("/seniority-summary")
def seniority_summary():
    return compute_seniority_summary()


# ── Talent Pipeline Debt Forecaster ──

@router.get("/junior-dependency-indices")
async def junior_dependency_indices(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "junior_dependency_indices")


@router.get("/seniority-velocity-deficits")
async def seniority_velocity_deficits(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "seniority_velocity_deficits")


@router.get("/team-pipeline-risk")
async def team_pipeline_risk(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "team_pipeline_risk")


@router.get("/org-pipeline-debt")
async def org_pipeline_debt(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "dev_profiles", "org_pipeline_debt")


@router.get("/pipeline-summary")
def pipeline_summary():
    return compute_pipeline_summary()
