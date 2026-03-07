"""Architectural Drift Monitor — computes org-level architectural health summary."""

from app.data.debt_radar_data import (
    MODULE_COUPLING_DRIFT,
    SERVICE_BOUNDARY_VIOLATIONS,
    GENERATIVE_MONOCULTURES,
    ARCHITECTURAL_HEALTH_SCORE,
)
from app.models.debt_radar import ArchDriftSummary


def compute_arch_drift_summary() -> ArchDriftSummary:
    """Aggregate MCDS, SBVT, and GMD into a single summary."""
    ahs = ARCHITECTURAL_HEALTH_SCORE
    worst = min(ahs.components, key=lambda c: c.score)
    return ArchDriftSummary(
        overall_ahs=ahs.overall_score,
        drift_velocity=ahs.drift_velocity,
        total_sbvt_violations=len(SERVICE_BOUNDARY_VIOLATIONS),
        total_monoculture_alerts=len(GENERATIVE_MONOCULTURES),
        ai_coupling_pct=MODULE_COUPLING_DRIFT.ai_coupling_pct,
        remediation_cost_now=ahs.remediation_cost_now,
        remediation_cost_projected=ahs.remediation_cost_projected,
        worst_component=worst.component,
        worst_score=worst.score,
    )
