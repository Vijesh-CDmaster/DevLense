"""API routes for Truth Lens — Perception vs Reality Gap (Problem 1)."""

from __future__ import annotations

from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.repository import get_dashboard as repo_get_dashboard, get_data_key
from app.models.truth_lens import AlertConfig, SurveySubmission
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
@router.get("/dashboard")
async def dashboard(threshold: int = Query(20, ge=5, le=80), db: AsyncSession = Depends(get_db)):
    data = await repo_get_dashboard(db, "truth_lens") or {}
    data["alert_config"] = {"threshold_pct": threshold}
    return data


# ── Divergence Timeline ──
@router.get("/divergence")
async def divergence_timeline(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "divergence_timeline")


# ── Developer Breakdown ──
@router.get("/developers")
async def dev_breakdown(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "dev_breakdown")


# ── Real-time Self-Report vs Telemetry ──
@router.get("/self-report")
async def self_report_comparator(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "self_report_comparator")


# ── Weekly Perception Drift ──
@router.get("/drift")
async def weekly_drift(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "weekly_drift")


# ── Illusion Score ──
@router.get("/illusion-score")
async def illusion_score(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "illusion_score")


# ── Gauge Data ──
@router.get("/gauges")
async def gauges(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "gauges")


# ══════ Alerts ══════

@router.get("/alerts")
async def alerts(db: AsyncSession = Depends(get_db)):
    """Return alert history (mock + runtime alerts)."""
    runtime_alerts = get_alert_history()
    mock_alerts = await get_data_key(db, "truth_lens", "alerts") or []
    return mock_alerts + runtime_alerts


@router.put("/alerts/threshold")
async def set_alert_threshold(config: AlertConfig):
    new_thr = update_threshold(config.threshold_pct)
    return AlertConfig(threshold_pct=new_thr)


@router.post("/alerts/{alert_id}/resolve")
async def resolve_alert_endpoint(alert_id: int):
    ok = resolve_alert(alert_id)
    return {"resolved": ok, "alert_id": alert_id}


@router.post("/alerts/evaluate")
async def evaluate_alerts(db: AsyncSession = Depends(get_db)):
    """Run alert evaluation on all developers against current threshold."""
    dev_list = await get_data_key(db, "truth_lens", "dev_breakdown") or []
    fired: list[dict] = []
    for dev in dev_list:
        belief = float(str(dev["belief"]).replace("+", "").replace("%", ""))
        reality = float(str(dev["reality"]).replace("+", "").replace("%", ""))
        alert = evaluate_dev_gap(dev["name"], belief, reality)
        if alert:
            fired.append(alert.model_dump())

    drift_data = await get_data_key(db, "truth_lens", "weekly_drift") or []
    gaps = [d["gap"] for d in drift_data]
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


@router.get("/surveys/responses")
async def survey_responses(limit: int = Query(20, ge=1, le=100), db: AsyncSession = Depends(get_db)):
    """Return recent survey responses (mock + runtime)."""
    runtime = get_survey_responses(limit)
    mock_surveys = await get_data_key(db, "truth_lens", "recent_surveys") or []
    combined = mock_surveys + runtime
    return combined[:limit]


@router.post("/surveys/submit")
async def submit_survey(submission: SurveySubmission):
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
    ok = await send_survey(dev_slack_id, commit_file, commit_sha)
    return {"sent": ok}


# ══════ GitHub Integration ══════

@router.get("/github/commits")
async def recent_commits(since_hours: int = Query(24, ge=1, le=168)):
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
    detail = await get_commit_detail(sha)
    if not detail:
        return {"error": "Commit not found or GitHub not configured"}
    return compute_telemetry_gain(detail, avg_minutes)


# ══════ Belief Audit Engine ══════

@router.get("/belief-audits")
async def belief_audits(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "belief_audits")


@router.get("/bias-typologies")
async def bias_typologies(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "bias_typologies")


@router.get("/calibration-scores")
async def calibration_scores(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "calibration_scores")


@router.get("/belief-summary")
async def belief_summary():
    return compute_belief_summary()


# ══════ Decision Contamination Tracker ══════

@router.get("/decision-signals")
async def decision_signals(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "decision_signals")


@router.get("/contamination-assessments")
async def contamination_assessments(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "contamination_assessments")


@router.get("/post-decision-outcomes")
async def post_decision_outcomes(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "post_decision_outcomes")


@router.get("/org-contamination")
async def org_contamination(db: AsyncSession = Depends(get_db)):
    return await get_data_key(db, "truth_lens", "org_contamination")


@router.get("/contamination-summary")
async def contamination_summary():
    return compute_contamination_summary()