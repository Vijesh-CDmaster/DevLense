"""API routes for Truth Lens — Perception vs Reality Gap (Problem 1)."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.data.truth_lens_data import (
    ALERT_HISTORY,
    DEV_BREAKDOWN,
    DIVERGENCE_TIMELINE,
    GAUGE_DATA,
    ILLUSION_SCORE,
    RECENT_SURVEYS,
    SELF_REPORT_COMPARATOR,
    WEEKLY_DRIFT,
    get_full_dashboard,
    BELIEF_AUDITS,
    BIAS_TYPOLOGIES,
    CALIBRATION_SCORES,
    DECISION_SIGNALS,
    CONTAMINATION_ASSESSMENTS,
    POST_DECISION_OUTCOMES,
    ORG_CONTAMINATION,
)
from app.models.truth_lens import (
    AlertConfig,
    DevBreakdown,
    DivergencePoint,
    GaugeData,
    IllusionScore,
    ManagerAlert,
    SelfReportEntry,
    SurveyResponse,
    SurveySubmission,
    TruthLensDashboard,
    WeeklyDrift,
)
from app.services.alert_engine import (
    evaluate_dev_gap,
    evaluate_team_drift,
    get_alert_history,
    resolve_alert,
    update_threshold,
)
from app.services.github_service import get_recent_commits, get_commit_detail, compute_telemetry_gain
from app.services.slack_service import (
    get_survey_questions,
    get_survey_responses,
    send_survey,
    send_alert_to_manager,
    store_survey_response,
)
from app.services.belief_audit import compute_belief_summary
from app.services.contamination_tracker import compute_contamination_summary

router = APIRouter(prefix="/api/truth-lens", tags=["Truth Lens"])


# ── Full Dashboard ──
@router.get("/dashboard", response_model=TruthLensDashboard)
async def dashboard(threshold: int = Query(20, ge=5, le=80)):
    """Return the complete Truth Lens dashboard payload."""
    return get_full_dashboard(threshold)


# ── Divergence Timeline ──
@router.get("/divergence", response_model=list[DivergencePoint])
async def divergence_timeline():
    return DIVERGENCE_TIMELINE


# ── Developer Breakdown ──
@router.get("/developers", response_model=list[DevBreakdown])
async def dev_breakdown():
    return DEV_BREAKDOWN


# ── Real-time Self-Report vs Telemetry ──
@router.get("/self-report", response_model=list[SelfReportEntry])
async def self_report_comparator():
    return SELF_REPORT_COMPARATOR


# ── Weekly Perception Drift ──
@router.get("/drift", response_model=list[WeeklyDrift])
async def weekly_drift():
    return WEEKLY_DRIFT


# ── Illusion Score ──
@router.get("/illusion-score", response_model=IllusionScore)
async def illusion_score():
    return ILLUSION_SCORE


# ── Gauge Data ──
@router.get("/gauges", response_model=GaugeData)
async def gauges():
    return GAUGE_DATA


# ══════ Alerts ══════

@router.get("/alerts", response_model=list[ManagerAlert])
async def alerts():
    """Return alert history (mock + runtime alerts)."""
    runtime_alerts = get_alert_history()
    return ALERT_HISTORY + runtime_alerts


@router.put("/alerts/threshold", response_model=AlertConfig)
async def set_alert_threshold(config: AlertConfig):
    """Update alert threshold percentage."""
    new_thr = update_threshold(config.threshold_pct)
    return AlertConfig(threshold_pct=new_thr)


@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert_endpoint(alert_id: int):
    ok = resolve_alert(alert_id)
    return {"resolved": ok, "alert_id": alert_id}


@router.post("/alerts/evaluate")
async def evaluate_alerts():
    """Run alert evaluation on all developers against current threshold."""
    fired: list[dict] = []
    for dev in DEV_BREAKDOWN:
        belief = float(dev.belief.replace("+", "").replace("%", ""))
        reality = float(dev.reality.replace("+", "").replace("%", ""))
        alert = evaluate_dev_gap(dev.name, belief, reality)
        if alert:
            fired.append(alert.model_dump())

    gaps = [d.gap for d in WEEKLY_DRIFT]
    drift_alert = evaluate_team_drift(gaps)
    if drift_alert:
        fired.append(drift_alert.model_dump())

    return {"alerts_fired": len(fired), "alerts": fired}


@router.post("/alerts/notify-manager")
async def notify_manager(
    manager_slack_id: str = Query(...),
    dev_name: str = Query(...),
    gap_pct: float = Query(...),
    threshold: int = Query(20),
):
    """Send a Slack alert to a manager about a perception gap breach."""
    ok = await send_alert_to_manager(manager_slack_id, dev_name, gap_pct, threshold)
    return {"sent": ok}


# ══════ Micro-Surveys ══════

@router.get("/surveys/questions")
async def survey_questions():
    return get_survey_questions()


@router.get("/surveys/responses", response_model=list[SurveyResponse])
async def survey_responses(limit: int = Query(20, ge=1, le=100)):
    """Return recent survey responses (mock + runtime)."""
    runtime = get_survey_responses(limit)
    mock_as_dicts = [s.model_dump() for s in RECENT_SURVEYS]
    combined = mock_as_dicts + runtime
    return combined[:limit]


@router.post("/surveys/submit")
async def submit_survey(submission: SurveySubmission):
    """Submit a micro-survey response."""
    entry = store_survey_response(
        dev=submission.dev,
        question=submission.question,
        answer=submission.answer,
        commit_sha=submission.commit_sha,
    )
    return {"status": "recorded", "entry": entry}


@router.post("/surveys/send")
async def send_survey_to_dev(
    dev_slack_id: str = Query(...),
    commit_file: str = Query("unknown"),
    commit_sha: str = Query("unknown"),
):
    """Trigger a Slack survey DM to a developer."""
    ok = await send_survey(dev_slack_id, commit_file, commit_sha)
    return {"sent": ok}


# ══════ GitHub Integration ══════

@router.get("/github/commits")
async def recent_commits(since_hours: int = Query(24, ge=1, le=168)):
    """Fetch recent commits from configured GitHub repo."""
    commits = await get_recent_commits(since_hours)
    return {
        "count": len(commits),
        "commits": [
            {
                "sha": c.get("sha", "")[:7],
                "message": c.get("commit", {}).get("message", "")[:120],
                "author": c.get("commit", {}).get("author", {}).get("name", ""),
                "date": c.get("commit", {}).get("author", {}).get("date", ""),
            }
            for c in commits[:50]
        ],
    }


@router.get("/github/telemetry")
async def commit_telemetry(
    sha: str = Query(..., min_length=4, max_length=40),
    avg_minutes: float = Query(30, ge=1, le=480),
):
    """Compute telemetry gain for a specific commit vs baseline avg."""
    detail = await get_commit_detail(sha)
    if not detail:
        return {"error": "Commit not found or GitHub not configured"}
    return compute_telemetry_gain(detail, avg_minutes)


# ══════ Belief Audit Engine ══════

@router.get("/belief-audits")
async def belief_audits():
    return BELIEF_AUDITS


@router.get("/bias-typologies")
async def bias_typologies():
    return BIAS_TYPOLOGIES


@router.get("/calibration-scores")
async def calibration_scores():
    return CALIBRATION_SCORES


@router.get("/belief-summary")
async def belief_summary():
    return compute_belief_summary()


# ══════ Decision Contamination Tracker ══════

@router.get("/decision-signals")
async def decision_signals():
    return DECISION_SIGNALS


@router.get("/contamination-assessments")
async def contamination_assessments():
    return CONTAMINATION_ASSESSMENTS


@router.get("/post-decision-outcomes")
async def post_decision_outcomes():
    return POST_DECISION_OUTCOMES


@router.get("/org-contamination")
async def org_contamination():
    return ORG_CONTAMINATION


@router.get("/contamination-summary")
async def contamination_summary():
    return compute_contamination_summary()