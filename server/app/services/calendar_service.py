"""Calendar Service — fetches meeting data from Google Calendar / Outlook.

In production this would use OAuth2 to pull calendar events.
For now it derives meeting counts from the mock flow-timeline data.
"""

import logging
from app.data.productivity_hub_data import get_flow_timeline

log = logging.getLogger(__name__)


async def meeting_hours_today() -> float:
    """Return total meeting hours for today (each slot = 1 h)."""
    timeline = get_flow_timeline()
    total = sum(s.meeting for s in timeline)
    log.info("Calendar: %d meeting-hours today", total)
    return float(total)


async def meeting_count_today() -> int:
    """Return number of distinct meeting slots today."""
    timeline = get_flow_timeline()
    return sum(1 for s in timeline if s.meeting > 0)
