from pydantic import BaseModel


class Developer(BaseModel):
    name: str
    switches: int
    time_lost: float
    primary: str
    top_friction: str
    alert: bool


class Transition(BaseModel):
    from_tool: str
    to_tool: str
    switches: int
    avg_min_lost: float


class HourlySlot(BaseModel):
    hour: str
    copilot: int
    cursor: int
    claude: int


class FrictionByTask(BaseModel):
    task: str
    minutes_lost: float
    switches: int
    worst_transition: str


class ToolUsage(BaseModel):
    tool: str
    pct: int
    accepts: int
    quality: int
    color: str


class ToolchainRadarDashboard(BaseModel):
    developers: list[Developer]
    transition_matrix: list[Transition]
    hourly_timeline: list[HourlySlot]
    friction_by_task: list[FrictionByTask]
    tool_usage: list[ToolUsage]
