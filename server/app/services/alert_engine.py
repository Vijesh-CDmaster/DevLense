"""Alert engine — evaluates perception gaps and fires alerts when thresholds breached."""

from __future__ import annotations

import logging
from datetime import datetime, timezone

from app.config import settings
from app.models.truth_lens import ManagerAlert

logger = logging.getLogger(__name__)

# In-memory alert store (replace with DB in production)
_alert_counter = 100
_alert_store: list[ManagerAlert] = []


def evaluate_dev_gap(
    dev_name: str,
    belief_pct: float,
    reality_pct: float,
    threshold: int | None = None,
) -> ManagerAlert | None:
    """
    Check if a developer's perception gap exceeds the configured threshold.
    Returns a ManagerAlert if threshold is breached, else None.
    """
    global _alert_counter
    thr = threshold or settings.ALERT_THRESHOLD_PCT
    gap = abs(belief_pct - reality_pct)

    if gap <= thr:
        return None

    _alert_counter += 1
    severity = "red" if gap > thr + 15 else "amber"
    alert = ManagerAlert(
        id=_alert_counter,
        type="threshold",
        severity=severity,
        msg=f"{dev_name} perception gap hit {gap:.0f}% — exceeds {thr}% threshold by {gap - thr:.0f}pts",
        action="Auto-notified manager + scheduled 1:1" if severity == "red" else "Added to monitoring watchlist",
        time=datetime.now(timezone.utc).strftime("%I:%M %p UTC"),
        resolved=False,
    )
    _alert_store.append(alert)
    logger.info("Alert fired for %s — gap %.0f%%", dev_name, gap)
    return alert


def evaluate_team_drift(
    weekly_gaps: list[float],
    threshold: int | None = None,
) -> ManagerAlert | None:
    """
    Check if team-wide perception drift is accelerating.
    Fires an alert if gap grew for 3+ consecutive weeks.
    """
    global _alert_counter
    if len(weekly_gaps) < 3:
        return None

    # Check last 3 weeks are all increasing
    recent = weekly_gaps[-3:]
    if not (recent[2] > recent[1] > recent[0]):
        return None

    growth = recent[2] - recent[0]
    _alert_counter += 1
    alert = ManagerAlert(
        id=_alert_counter,
        type="drift",
        severity="amber" if growth < 10 else "red",
        msg=f"Team-wide perception drift rate accelerating — gap grew {growth:.0f}pts over 3 weeks",
        action="Weekly reality report sent to team",
        time=datetime.now(timezone.utc).strftime("%I:%M %p UTC"),
        resolved=False,
    )
    _alert_store.append(alert)
    return alert


def get_alert_history(limit: int = 20) -> list[ManagerAlert]:
    """Return recent alerts."""
    return _alert_store[-limit:][::-1]


def resolve_alert(alert_id: int) -> bool:
    """Mark an alert as resolved."""
    for alert in _alert_store:
        if alert.id == alert_id:
            alert.resolved = True
            return True
    return False


def update_threshold(new_threshold: int) -> int:
    """Update the global alert threshold."""
    settings.ALERT_THRESHOLD_PCT = max(5, min(80, new_threshold))
    return settings.ALERT_THRESHOLD_PCT
