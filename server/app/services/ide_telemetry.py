"""IDE Telemetry Service — collects flow state, context-switch, and cognitive load data.

In production this would integrate with VS Code / JetBrains telemetry APIs.
For now it returns structured data derived from the mock layer.
"""

import logging
from datetime import datetime

from app.models.productivity_hub import (
    DevFlowScore, FlowTimelineSlot, ContextSwitchMetric, CognitiveLoadHourly,
)
from app.data.productivity_hub_data import (
    get_dev_flow_scores, get_flow_timeline,
    get_context_switches, get_cognitive_load_hourly,
)

log = logging.getLogger(__name__)


async def fetch_flow_scores() -> list[DevFlowScore]:
    """Return per-developer FLOW scores (deep-work / interrupted / meeting hours)."""
    log.info("Fetching IDE flow scores for %s", datetime.utcnow().date())
    return get_dev_flow_scores()


async def fetch_flow_timeline() -> list[FlowTimelineSlot]:
    """Return hourly flow-state timeline for selected developer."""
    return get_flow_timeline()


async def fetch_context_switches() -> list[ContextSwitchMetric]:
    """Return today's context-switch / tool-switch / interruption metrics."""
    return get_context_switches()


async def fetch_cognitive_load_hourly() -> list[CognitiveLoadHourly]:
    """Return hourly cognitive load percentage."""
    return get_cognitive_load_hourly()
