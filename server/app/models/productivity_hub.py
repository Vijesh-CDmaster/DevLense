"""Pydantic models for Productivity Hub (Problem 2)."""

from pydantic import BaseModel


# ── HPS (Holistic Productivity Score) ──

class HPSRadarPoint(BaseModel):
    dimension: str
    value: int


class HPSDimension(BaseModel):
    label: str
    value: int
    color: str
    weight: int


class HPSWeekly(BaseModel):
    week: str
    hps: int
    speed: int
    quality: int
    wellbeing: int
    collab: int
    ai_ratio: int


# ── FLOW Score ──

class DevFlowScore(BaseModel):
    name: str
    deep_work: float
    interrupted: float
    meetings: float
    flow_score: int
    trend: str
    delta: int


class FlowTimelineSlot(BaseModel):
    hour: str
    deep: int
    interrupted: int
    meeting: int


# ── Cognitive Load ──

class ContextSwitchMetric(BaseModel):
    label: str
    value: int
    icon: str
    threshold: int
    unit: str


class CognitiveLoadHourly(BaseModel):
    hour: str
    load: int


# ── AI Quality Ratio ──

class AIQualityModule(BaseModel):
    module: str
    accepted: int
    reverted: int
    modified: int
    ratio: int
    level: str


class AIQualityTrendPoint(BaseModel):
    sprint: str
    ratio: int


# ── Rework Attribution ──

class ReworkSprint(BaseModel):
    sprint: str
    survived: int
    reverted: int


class ReworkPR(BaseModel):
    pr: str
    title: str
    dev: str
    ai_pct: int
    rework_hrs: float
    reason: str
    file: str
    status: str


# ── Composite Dashboard ──

class ProductivityDashboard(BaseModel):
    hps_radar: list[HPSRadarPoint]
    dimensions: list[HPSDimension]
    hps_weekly: list[HPSWeekly]
    dev_flow_scores: list[DevFlowScore]
    flow_timeline: list[FlowTimelineSlot]
    context_switches: list[ContextSwitchMetric]
    cognitive_load_hourly: list[CognitiveLoadHourly]
    ai_quality_by_module: list[AIQualityModule]
    ai_quality_trend: list[AIQualityTrendPoint]
    rework_data: list[ReworkSprint]
    rework_prs: list[ReworkPR]
