from app.models.toolchain_radar import (
    Developer, Transition, HourlySlot, FrictionByTask,
    ToolUsage, ToolchainRadarDashboard,
)

DEVELOPERS = [
    Developer(
        name="Raj Kumar", switches=47, time_lost=2.4,
        primary="Cursor", top_friction="Cursor → Claude Code", alert=True,
    ),
    Developer(
        name="Priya S.", switches=31, time_lost=1.6,
        primary="Copilot", top_friction="Copilot → Cursor", alert=False,
    ),
    Developer(
        name="Arjun M.", switches=22, time_lost=0.9,
        primary="Copilot", top_friction="Copilot → Claude Code", alert=False,
    ),
    Developer(
        name="Meena R.", switches=12, time_lost=0.4,
        primary="Claude Code", top_friction="Claude Code → Copilot", alert=False,
    ),
    Developer(
        name="Dev K.", switches=54, time_lost=3.1,
        primary="Cursor", top_friction="Cursor → Copilot", alert=True,
    ),
]

TRANSITION_MATRIX = [
    Transition(from_tool="Copilot", to_tool="Cursor", switches=38, avg_min_lost=4.2),
    Transition(from_tool="Copilot", to_tool="Claude Code", switches=26, avg_min_lost=5.8),
    Transition(from_tool="Cursor", to_tool="Copilot", switches=34, avg_min_lost=3.9),
    Transition(from_tool="Cursor", to_tool="Claude Code", switches=52, avg_min_lost=6.1),
    Transition(from_tool="Claude Code", to_tool="Copilot", switches=19, avg_min_lost=3.4),
    Transition(from_tool="Claude Code", to_tool="Cursor", switches=21, avg_min_lost=4.7),
]

HOURLY_TIMELINE = [
    HourlySlot(hour="9 AM", copilot=12, cursor=3, claude=1),
    HourlySlot(hour="10 AM", copilot=8, cursor=9, claude=4),
    HourlySlot(hour="11 AM", copilot=4, cursor=14, claude=7),
    HourlySlot(hour="12 PM", copilot=2, cursor=6, claude=2),
    HourlySlot(hour="1 PM", copilot=6, cursor=4, claude=8),
    HourlySlot(hour="2 PM", copilot=3, cursor=11, claude=12),
    HourlySlot(hour="3 PM", copilot=7, cursor=8, claude=5),
    HourlySlot(hour="4 PM", copilot=10, cursor=5, claude=3),
    HourlySlot(hour="5 PM", copilot=5, cursor=7, claude=9),
]

FRICTION_BY_TASK = [
    FrictionByTask(task="Debugging", minutes_lost=8.2, switches=14, worst_transition="Cursor → Claude Code"),
    FrictionByTask(task="Feature Code", minutes_lost=6.5, switches=11, worst_transition="Copilot → Cursor"),
    FrictionByTask(task="Code Review", minutes_lost=5.1, switches=9, worst_transition="Claude Code → Copilot"),
    FrictionByTask(task="Refactoring", minutes_lost=4.3, switches=7, worst_transition="Cursor → Copilot"),
    FrictionByTask(task="Tests", minutes_lost=2.8, switches=4, worst_transition="Copilot → Claude Code"),
]

TOOL_USAGE = [
    ToolUsage(tool="GitHub Copilot", pct=42, accepts=68, quality=71, color="#10B981"),
    ToolUsage(tool="Cursor", pct=35, accepts=74, quality=63, color="#7C3AED"),
    ToolUsage(tool="Claude Code", pct=23, accepts=81, quality=79, color="#00D4FF"),
]


def get_full_dashboard() -> ToolchainRadarDashboard:
    return ToolchainRadarDashboard(
        developers=DEVELOPERS,
        transition_matrix=TRANSITION_MATRIX,
        hourly_timeline=HOURLY_TIMELINE,
        friction_by_task=FRICTION_BY_TASK,
        tool_usage=TOOL_USAGE,
    )
