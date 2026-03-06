from fastapi import APIRouter
from app.data.org_cascade_data import (
    get_full_dashboard, SUMMARY, DORA_METRICS, BOTTLENECKS,
    AMPLIFIERS, CASCADE_FLOW, ROI_REPORT, DORA_CORRELATIONS,
)

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
