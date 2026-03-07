from fastapi import APIRouter
from app.data.org_cascade_data import (
    get_full_dashboard, SUMMARY, DORA_METRICS, BOTTLENECKS,
    AMPLIFIERS, CASCADE_FLOW, ROI_REPORT, DORA_CORRELATIONS,
    WASTE_ENTRIES, WASTE_WEEKLY_TRENDS, TRUE_AI_ROI, TEAM_WASTE_BREAKDOWN,
    CASCADE_EFFICIENCY, TEAM_CASCADE_VIEWS, FLOW_STAGE_DETAILS, STORY_POINT_TRACKER,
)
from app.services.waste_classifier import compute_waste_summary, compute_waste_trend_direction
from app.services.cascade_analyzer import compute_cascade_health, compute_story_point_gap

router = APIRouter(prefix="/api/org-cascade", tags=["org-cascade"])


@router.get("/dashboard")
def dashboard():
    return get_full_dashboard()


@router.get("/summary")
def summary():
    return SUMMARY


@router.get("/dora-metrics")
def dora_metrics():
    return DORA_METRICS


@router.get("/bottlenecks")
def bottlenecks():
    return BOTTLENECKS


@router.get("/amplifiers")
def amplifiers():
    return AMPLIFIERS


@router.get("/cascade-flow")
def cascade_flow():
    return CASCADE_FLOW


@router.get("/roi-report")
def roi_report():
    return ROI_REPORT


@router.get("/dora-correlations")
def dora_correlations():
    return DORA_CORRELATIONS


# ── AI Waste Classifier endpoints ──

@router.get("/waste-entries")
def waste_entries():
    return WASTE_ENTRIES


@router.get("/waste-summary")
def waste_summary():
    return compute_waste_summary()


@router.get("/waste-trends")
def waste_trends():
    return WASTE_WEEKLY_TRENDS


@router.get("/waste-trend-direction")
def waste_trend_direction():
    return compute_waste_trend_direction()


@router.get("/true-ai-roi")
def true_ai_roi():
    return TRUE_AI_ROI


@router.get("/team-waste")
def team_waste():
    return TEAM_WASTE_BREAKDOWN


# ── DORA-AI Cascade Dashboard endpoints ──

@router.get("/cascade-efficiency")
def cascade_efficiency():
    return CASCADE_EFFICIENCY


@router.get("/cascade-health")
def cascade_health():
    return compute_cascade_health()


@router.get("/team-cascades")
def team_cascades():
    return TEAM_CASCADE_VIEWS


@router.get("/flow-details")
def flow_details():
    return FLOW_STAGE_DETAILS


@router.get("/story-points")
def story_points():
    return STORY_POINT_TRACKER


@router.get("/story-point-gap")
def story_point_gap():
    return compute_story_point_gap()
