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


# ══════════════════════════════════════════════
# Cross-Tool AI Friction Heatmap — Weekly Per-Developer
# ══════════════════════════════════════════════

WEEKLY_FRICTION = [
    {
        "developer": "Raj Kumar",
        "week_label": "Week of Mar 3",
        "total_friction_hrs": 12.8,
        "org_cost_estimate": 2560,
        "top_transition": "Cursor → Claude Code",
        "flow_pct": 34,
        "cells": [
            {"day": "Mon", "transition": "Copilot → Cursor", "switches": 4, "hours_lost": 1.4, "intensity": 0.65},
            {"day": "Mon", "transition": "Cursor → Claude Code", "switches": 5, "hours_lost": 1.9, "intensity": 0.88},
            {"day": "Mon", "transition": "Tool → Slack → Tool", "switches": 6, "hours_lost": 2.3, "intensity": 0.95},
            {"day": "Tue", "transition": "Copilot → Cursor", "switches": 2, "hours_lost": 0.7, "intensity": 0.35},
            {"day": "Tue", "transition": "Cursor → Claude Code", "switches": 3, "hours_lost": 1.1, "intensity": 0.52},
            {"day": "Wed", "transition": "Copilot → Cursor", "switches": 4, "hours_lost": 1.5, "intensity": 0.68},
            {"day": "Wed", "transition": "Tool → Slack → Tool", "switches": 7, "hours_lost": 2.8, "intensity": 1.0},
            {"day": "Thu", "transition": "Cursor → Claude Code", "switches": 3, "hours_lost": 1.2, "intensity": 0.55},
            {"day": "Fri", "transition": "Copilot → Cursor", "switches": 1, "hours_lost": 0.4, "intensity": 0.18},
        ],
    },
    {
        "developer": "Dev K.",
        "week_label": "Week of Mar 3",
        "total_friction_hrs": 15.2,
        "org_cost_estimate": 3040,
        "top_transition": "Tool → Slack → Tool",
        "flow_pct": 28,
        "cells": [
            {"day": "Mon", "transition": "Cursor → Copilot", "switches": 5, "hours_lost": 1.8, "intensity": 0.72},
            {"day": "Mon", "transition": "Tool → Slack → Tool", "switches": 7, "hours_lost": 2.6, "intensity": 0.92},
            {"day": "Tue", "transition": "Cursor → Copilot", "switches": 6, "hours_lost": 2.1, "intensity": 0.78},
            {"day": "Tue", "transition": "Cursor → Claude Code", "switches": 4, "hours_lost": 1.5, "intensity": 0.62},
            {"day": "Wed", "transition": "Tool → Slack → Tool", "switches": 8, "hours_lost": 3.1, "intensity": 1.0},
            {"day": "Thu", "transition": "Cursor → Copilot", "switches": 4, "hours_lost": 1.4, "intensity": 0.58},
            {"day": "Thu", "transition": "Tool → Slack → Tool", "switches": 5, "hours_lost": 1.9, "intensity": 0.75},
            {"day": "Fri", "transition": "Cursor → Copilot", "switches": 2, "hours_lost": 0.8, "intensity": 0.32},
        ],
    },
    {
        "developer": "Priya S.",
        "week_label": "Week of Mar 3",
        "total_friction_hrs": 8.1,
        "org_cost_estimate": 1620,
        "top_transition": "Copilot → Cursor",
        "flow_pct": 44,
        "cells": [
            {"day": "Mon", "transition": "Copilot → Cursor", "switches": 3, "hours_lost": 1.2, "intensity": 0.55},
            {"day": "Tue", "transition": "Copilot → Cursor", "switches": 4, "hours_lost": 1.6, "intensity": 0.72},
            {"day": "Tue", "transition": "Tool → Slack → Tool", "switches": 3, "hours_lost": 1.1, "intensity": 0.48},
            {"day": "Wed", "transition": "Copilot → Cursor", "switches": 2, "hours_lost": 0.8, "intensity": 0.35},
            {"day": "Thu", "transition": "Copilot → Claude Code", "switches": 4, "hours_lost": 1.8, "intensity": 0.82},
            {"day": "Fri", "transition": "Copilot → Cursor", "switches": 4, "hours_lost": 1.6, "intensity": 0.72},
        ],
    },
    {
        "developer": "Arjun M.",
        "week_label": "Week of Mar 3",
        "total_friction_hrs": 4.6,
        "org_cost_estimate": 920,
        "top_transition": "Copilot → Claude Code",
        "flow_pct": 58,
        "cells": [
            {"day": "Mon", "transition": "Copilot → Claude Code", "switches": 2, "hours_lost": 0.9, "intensity": 0.42},
            {"day": "Tue", "transition": "Copilot → Claude Code", "switches": 3, "hours_lost": 1.3, "intensity": 0.60},
            {"day": "Wed", "transition": "Copilot → Cursor", "switches": 1, "hours_lost": 0.4, "intensity": 0.18},
            {"day": "Thu", "transition": "Copilot → Claude Code", "switches": 3, "hours_lost": 1.2, "intensity": 0.55},
            {"day": "Fri", "transition": "Copilot → Claude Code", "switches": 2, "hours_lost": 0.8, "intensity": 0.38},
        ],
    },
    {
        "developer": "Meena R.",
        "week_label": "Week of Mar 3",
        "total_friction_hrs": 2.1,
        "org_cost_estimate": 420,
        "top_transition": "Claude Code → Copilot",
        "flow_pct": 68,
        "cells": [
            {"day": "Mon", "transition": "Claude Code → Copilot", "switches": 1, "hours_lost": 0.3, "intensity": 0.15},
            {"day": "Tue", "transition": "Claude Code → Copilot", "switches": 2, "hours_lost": 0.6, "intensity": 0.28},
            {"day": "Wed", "transition": "Claude Code → Cursor", "switches": 1, "hours_lost": 0.4, "intensity": 0.20},
            {"day": "Thu", "transition": "Claude Code → Copilot", "switches": 2, "hours_lost": 0.5, "intensity": 0.25},
            {"day": "Fri", "transition": "Claude Code → Copilot", "switches": 1, "hours_lost": 0.3, "intensity": 0.15},
        ],
    },
]

RECOVERY_TIMES = [
    {"transition": "Cursor → Claude Code", "avg_recovery_min": 6.1, "p95_recovery_min": 14.8, "sample_count": 52, "task_driven_pct": 38},
    {"transition": "Copilot → Claude Code", "avg_recovery_min": 5.8, "p95_recovery_min": 13.2, "sample_count": 26, "task_driven_pct": 54},
    {"transition": "Cursor → Copilot", "avg_recovery_min": 3.9, "p95_recovery_min": 9.1, "sample_count": 34, "task_driven_pct": 62},
    {"transition": "Copilot → Cursor", "avg_recovery_min": 4.2, "p95_recovery_min": 10.5, "sample_count": 38, "task_driven_pct": 71},
    {"transition": "Claude Code → Cursor", "avg_recovery_min": 4.7, "p95_recovery_min": 11.3, "sample_count": 21, "task_driven_pct": 48},
    {"transition": "Claude Code → Copilot", "avg_recovery_min": 3.4, "p95_recovery_min": 8.2, "sample_count": 19, "task_driven_pct": 67},
    {"transition": "Tool → Slack → Tool", "avg_recovery_min": 8.9, "p95_recovery_min": 23.0, "sample_count": 48, "task_driven_pct": 12},
]

FRICTION_TRENDS = [
    {"week": "Week 1", "total_switches": 148, "total_hrs_lost": 38.4, "avg_recovery_min": 5.6, "cost_estimate": 7680},
    {"week": "Week 2", "total_switches": 156, "total_hrs_lost": 40.1, "avg_recovery_min": 5.4, "cost_estimate": 8020},
    {"week": "Week 3", "total_switches": 162, "total_hrs_lost": 42.8, "avg_recovery_min": 5.7, "cost_estimate": 8560},
    {"week": "Week 4", "total_switches": 166, "total_hrs_lost": 42.8, "avg_recovery_min": 5.5, "cost_estimate": 8560},
]


# ══════════════════════════════════════════════
# Cognitive Debt Accumulator — The Novel Feature
# ══════════════════════════════════════════════

COGNITIVE_DEBT_SCORES = [
    {
        "developer": "Dev K.",
        "score": 82,
        "zone": "danger",
        "predicted_cliff_min": 25,
        "recommended_action": "Lock to Cursor for next 90 min. Cancel optional meetings.",
        "last_deep_focus_min_ago": 68,
        "concurrent_prs": 5,
        "signals": [
            {"signal": "Tool switches in last 2 hours", "weight": 0.30, "current_value": "8 switches", "level": "critical"},
            {"signal": "Concurrent PRs open", "weight": 0.20, "current_value": "5 open", "level": "high"},
            {"signal": "Time since last 25-min focus", "weight": 0.25, "current_value": "68 min ago", "level": "high"},
            {"signal": "AI validation overhead today", "weight": 0.15, "current_value": "52 min", "level": "elevated"},
            {"signal": "Rework events (reverts/edits)", "weight": 0.10, "current_value": "3 today", "level": "moderate"},
        ],
    },
    {
        "developer": "Raj Kumar",
        "score": 71,
        "zone": "warning",
        "predicted_cliff_min": 40,
        "recommended_action": "Reduce to one AI tool for next 90 min. Close Slack notifications.",
        "last_deep_focus_min_ago": 47,
        "concurrent_prs": 4,
        "signals": [
            {"signal": "Tool switches in last 2 hours", "weight": 0.30, "current_value": "6 switches", "level": "high"},
            {"signal": "Concurrent PRs open", "weight": 0.20, "current_value": "4 open", "level": "elevated"},
            {"signal": "Time since last 25-min focus", "weight": 0.25, "current_value": "47 min ago", "level": "elevated"},
            {"signal": "AI validation overhead today", "weight": 0.15, "current_value": "38 min", "level": "moderate"},
            {"signal": "Rework events (reverts/edits)", "weight": 0.10, "current_value": "2 today", "level": "low"},
        ],
    },
    {
        "developer": "Priya S.",
        "score": 48,
        "zone": "yellow",
        "predicted_cliff_min": 95,
        "recommended_action": "On track. Consider a 15-min break after current PR.",
        "last_deep_focus_min_ago": 22,
        "concurrent_prs": 3,
        "signals": [
            {"signal": "Tool switches in last 2 hours", "weight": 0.30, "current_value": "3 switches", "level": "moderate"},
            {"signal": "Concurrent PRs open", "weight": 0.20, "current_value": "3 open", "level": "moderate"},
            {"signal": "Time since last 25-min focus", "weight": 0.25, "current_value": "22 min ago", "level": "low"},
            {"signal": "AI validation overhead today", "weight": 0.15, "current_value": "24 min", "level": "moderate"},
            {"signal": "Rework events (reverts/edits)", "weight": 0.10, "current_value": "1 today", "level": "low"},
        ],
    },
    {
        "developer": "Arjun M.",
        "score": 35,
        "zone": "green",
        "predicted_cliff_min": 140,
        "recommended_action": "Deep focus zone. No intervention needed.",
        "last_deep_focus_min_ago": 8,
        "concurrent_prs": 2,
        "signals": [
            {"signal": "Tool switches in last 2 hours", "weight": 0.30, "current_value": "2 switches", "level": "low"},
            {"signal": "Concurrent PRs open", "weight": 0.20, "current_value": "2 open", "level": "low"},
            {"signal": "Time since last 25-min focus", "weight": 0.25, "current_value": "8 min ago", "level": "low"},
            {"signal": "AI validation overhead today", "weight": 0.15, "current_value": "15 min", "level": "low"},
            {"signal": "Rework events (reverts/edits)", "weight": 0.10, "current_value": "0 today", "level": "low"},
        ],
    },
    {
        "developer": "Meena R.",
        "score": 22,
        "zone": "green",
        "predicted_cliff_min": 180,
        "recommended_action": "Excellent focus. In a productive flow state.",
        "last_deep_focus_min_ago": 3,
        "concurrent_prs": 1,
        "signals": [
            {"signal": "Tool switches in last 2 hours", "weight": 0.30, "current_value": "1 switch", "level": "low"},
            {"signal": "Concurrent PRs open", "weight": 0.20, "current_value": "1 open", "level": "low"},
            {"signal": "Time since last 25-min focus", "weight": 0.25, "current_value": "3 min ago", "level": "low"},
            {"signal": "AI validation overhead today", "weight": 0.15, "current_value": "8 min", "level": "low"},
            {"signal": "Rework events (reverts/edits)", "weight": 0.10, "current_value": "0 today", "level": "low"},
        ],
    },
]

TEAM_DEBT_FORECAST = [
    {"developer": "Dev K.", "mon": 78, "tue": 82, "wed": 85, "thu": 74, "fri": 68, "avg_score": 77.4, "chronic_warning_days": 4, "primary_cause": "tool_fragmentation"},
    {"developer": "Raj Kumar", "mon": 65, "tue": 58, "wed": 72, "thu": 71, "fri": 55, "avg_score": 64.2, "chronic_warning_days": 3, "primary_cause": "tool_fragmentation"},
    {"developer": "Priya S.", "mon": 42, "tue": 51, "wed": 38, "thu": 48, "fri": 45, "avg_score": 44.8, "chronic_warning_days": 1, "primary_cause": "meeting_density"},
    {"developer": "Arjun M.", "mon": 32, "tue": 38, "wed": 28, "thu": 35, "fri": 30, "avg_score": 32.6, "chronic_warning_days": 0, "primary_cause": "none"},
    {"developer": "Meena R.", "mon": 18, "tue": 24, "wed": 22, "thu": 20, "fri": 15, "avg_score": 19.8, "chronic_warning_days": 0, "primary_cause": "none"},
]

ROI_TRIGGERS = [
    {
        "combination": "Cursor + Claude Code",
        "avg_cognitive_debt": 71.4,
        "comparison_debt": 42.1,
        "comparison_label": "Copilot-only days",
        "weekly_cost_hrs": 18.2,
        "recommendation": "Cursor→Claude Code switching generates 69% more cognitive debt than Copilot-only days. Consider consolidating refactoring workflows to a single tool.",
        "severity": "critical",
    },
    {
        "combination": "Copilot + Cursor + Claude Code (3-tool days)",
        "avg_cognitive_debt": 78.3,
        "comparison_debt": 35.8,
        "comparison_label": "Single-tool days",
        "weekly_cost_hrs": 22.6,
        "recommendation": "Three-tool days produce 2.2x the cognitive debt of single-tool days. Highest waste occurs when devs switch all three for the same task.",
        "severity": "critical",
    },
    {
        "combination": "Any tool + Slack interruption",
        "avg_cognitive_debt": 84.1,
        "comparison_debt": 51.2,
        "comparison_label": "Tool-only switches",
        "weekly_cost_hrs": 14.8,
        "recommendation": "Tool→Slack→Tool transitions have 23-min avg recovery (vs 5.2min tool-only). Enable Slack DND during deep work blocks.",
        "severity": "warning",
    },
]


def get_full_dashboard() -> dict:
    return {
        "developers": [d.model_dump() for d in DEVELOPERS],
        "transition_matrix": [t.model_dump() for t in TRANSITION_MATRIX],
        "hourly_timeline": [h.model_dump() for h in HOURLY_TIMELINE],
        "friction_by_task": [f.model_dump() for f in FRICTION_BY_TASK],
        "tool_usage": [t.model_dump() for t in TOOL_USAGE],
        # Cross-Tool Friction Heatmap
        "weekly_friction": WEEKLY_FRICTION,
        "recovery_times": RECOVERY_TIMES,
        "friction_trends": FRICTION_TRENDS,
        # Cognitive Debt Accumulator
        "cognitive_debt_scores": COGNITIVE_DEBT_SCORES,
        "team_debt_forecast": TEAM_DEBT_FORECAST,
        "roi_triggers": ROI_TRIGGERS,
    }
