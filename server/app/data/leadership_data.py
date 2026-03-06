from app.models.leadership import (
    FrictionPoint, EmpathyGap, ActionLoopItem, DecisionImpact,
    Translation, PulseResult, EmpathyScoreDetail, EmpathyScoreWeekPoint,
    LeadershipDashboard, DeveloperFriction, FrictionTrendPoint,
    ImpactSimulation, EmpathyDimension, LeadershipBriefing, EscalationItem,
)

FRICTION_HEATMAP = [
    FrictionPoint(area="Code Reviews", dev_hours=4.2, leader_estimate=1.5, severity="critical"),
    FrictionPoint(area="Meetings", dev_hours=2.8, leader_estimate=1.0, severity="critical"),
    FrictionPoint(area="CI/CD Waits", dev_hours=1.9, leader_estimate=0.3, severity="high"),
    FrictionPoint(area="Context Switching", dev_hours=1.4, leader_estimate=0.5, severity="high"),
    FrictionPoint(area="AI Tool Friction", dev_hours=1.1, leader_estimate=0.0, severity="medium"),
    FrictionPoint(area="Doc & Planning", dev_hours=0.9, leader_estimate=0.8, severity="low"),
    FrictionPoint(area="Environment Setup", dev_hours=0.7, leader_estimate=0.2, severity="medium"),
]

EMPATHY_GAPS = [
    EmpathyGap(
        dev_says="Code review waits are > 48hrs — blocking us daily",
        leader_thinks="Code review process is working fine",
        gap="red", cost="4.2 hrs/dev/day", category="Process",
        kpi_impact="Deployment frequency down 35% — directly affects release velocity OKR",
    ),
    EmpathyGap(
        dev_says="Too many meetings — losing 2.8hrs of deep work daily",
        leader_thinks="Meetings are necessary for alignment",
        gap="red", cost="2.8 hrs/dev/day", category="Culture",
        kpi_impact="Flow time reduced by 40% — engineering throughput declining quarter-over-quarter",
    ),
    EmpathyGap(
        dev_says="CI/CD pipeline takes 45min — we deploy less often",
        leader_thinks="Unknown — no visibility",
        gap="amber", cost="1.9 hrs/dev/day", category="Tooling",
        kpi_impact="MTTR increased 2.3x — incident resolution SLA at risk",
    ),
    EmpathyGap(
        dev_says="AI tools create context switching — hurts deep thinking flow",
        leader_thinks="AI tools are increasing productivity by 40%",
        gap="amber", cost="1.4 hrs/dev/day", category="AI Tooling",
        kpi_impact="Senior dev productivity down 22% — AI ROI is negative for experienced engineers",
    ),
    EmpathyGap(
        dev_says="On-call rotation is burning out the team — 3am pages weekly",
        leader_thinks="On-call is well-distributed and manageable",
        gap="red", cost="3.1 hrs/dev/week", category="Operations",
        kpi_impact="Attrition risk: 2 senior engineers considering leaving — replacement cost $340K",
    ),
]

ACTION_LOOP = [
    ActionLoopItem(
        issue="Slow code reviews (>48hrs)",
        action="Escalated to eng leads — assigned review SLA of 24hrs",
        status="pending", date="3 days ago",
        hours_recovered=0, dev_satisfaction=0,
    ),
    ActionLoopItem(
        issue="Broken CI/CD pipeline for feature branches",
        action="DevOps team patched pipeline — build time reduced from 45min to 12min",
        status="done", date="1 week ago",
        hours_recovered=14.2, dev_satisfaction=87,
    ),
    ActionLoopItem(
        issue="Too many mandatory meetings (>12/week)",
        action="No action taken — leadership considers meetings essential",
        status="ignored", date="2 weeks ago",
        hours_recovered=0, dev_satisfaction=0,
    ),
    ActionLoopItem(
        issue="AI tool generating low-quality suggestions for senior devs",
        action="Implemented seniority-aware AI modes (Architect/Standard/Scaffold)",
        status="done", date="5 days ago",
        hours_recovered=8.7, dev_satisfaction=92,
    ),
    ActionLoopItem(
        issue="On-call rotation unfair — same 3 people every week",
        action="No action taken",
        status="ignored", date="3 weeks ago",
        hours_recovered=0, dev_satisfaction=0,
    ),
    ActionLoopItem(
        issue="Sprint planning takes full day — devs lose momentum",
        action="Under review — considering async sprint planning",
        status="pending", date="1 week ago",
        hours_recovered=0, dev_satisfaction=0,
    ),
]

DECISION_IMPACTS = [
    DecisionImpact(
        decision="Mandatory daily standup extended to 30 minutes",
        made_by="VP Engineering", date="2 weeks ago",
        dev_hours_lost=47, dollars_lost=11750, affected_devs=12, category="Process",
    ),
    DecisionImpact(
        decision="All PRs require 2 reviewers (up from 1)",
        made_by="CTO", date="3 weeks ago",
        dev_hours_lost=62, dollars_lost=15500, affected_devs=15, category="Quality",
    ),
    DecisionImpact(
        decision="Adopted new AI coding tool without pilot",
        made_by="VP Product", date="1 month ago",
        dev_hours_lost=84, dollars_lost=21000, affected_devs=18, category="Tooling",
    ),
    DecisionImpact(
        decision="Moved to weekly sprint cycle (from 2-week)",
        made_by="Director of Engineering", date="3 weeks ago",
        dev_hours_lost=35, dollars_lost=8750, affected_devs=10, category="Agile",
    ),
]

TRANSLATIONS = [
    Translation(
        dev_pain="Code reviews are blocking for 48+ hours, killing our velocity",
        exec_translation="Engineering throughput bottleneck: review latency is reducing deployment frequency by 35%, directly impacting time-to-market KPI",
        kpi="Deployment Frequency", dollar_impact="$18K/month", priority="critical",
    ),
    Translation(
        dev_pain="Too many meetings destroy my flow — I can't think deeply anymore",
        exec_translation="Deep work capacity reduced 40%: excessive meeting load is degrading engineering output-per-engineer, affecting quarterly OKR delivery",
        kpi="Engineering Throughput", dollar_impact="$12K/month", priority="critical",
    ),
    Translation(
        dev_pain="AI tools are slowing me down — I spend time fixing AI suggestions",
        exec_translation="Negative AI ROI for senior talent: AI tool adoption is reducing experienced developer productivity by 22%, increasing cost-per-feature",
        kpi="AI Tool ROI", dollar_impact="$9K/month", priority="high",
    ),
    Translation(
        dev_pain="CI/CD takes 45 minutes — I context-switch while waiting",
        exec_translation="Infrastructure bottleneck: build pipeline latency is increasing MTTR by 2.3x, putting incident response SLAs at risk",
        kpi="MTTR / DORA Metrics", dollar_impact="$7K/month", priority="high",
    ),
    Translation(
        dev_pain="On-call is burning me out — I got paged at 3am three times this week",
        exec_translation="Attrition risk: unfair on-call distribution is driving senior engineer burnout — 2 engineers flagged as flight risks ($340K replacement cost)",
        kpi="Retention / eNPS", dollar_impact="$340K risk", priority="critical",
    ),
]

PULSE_RESULTS = [
    PulseResult(week="Wk 1", productivity=62, blocker_count=34, ai_sentiment=45, response_rate=78),
    PulseResult(week="Wk 2", productivity=58, blocker_count=38, ai_sentiment=42, response_rate=82),
    PulseResult(week="Wk 3", productivity=55, blocker_count=41, ai_sentiment=38, response_rate=85),
    PulseResult(week="Wk 4", productivity=61, blocker_count=32, ai_sentiment=48, response_rate=88),
    PulseResult(week="Wk 5", productivity=64, blocker_count=29, ai_sentiment=52, response_rate=91),
    PulseResult(week="Wk 6", productivity=67, blocker_count=26, ai_sentiment=55, response_rate=89),
]

EMPATHY_SCORE = EmpathyScoreDetail(
    score=37,
    label="Critical Gap",
    trend="declining",
    monthly_cost="$48,000/month",
    gap_areas=5,
    total_gaps=7,
    weekly_trend=[
        EmpathyScoreWeekPoint(week="Wk 1", score=42),
        EmpathyScoreWeekPoint(week="Wk 2", score=40),
        EmpathyScoreWeekPoint(week="Wk 3", score=38),
        EmpathyScoreWeekPoint(week="Wk 4", score=36),
        EmpathyScoreWeekPoint(week="Wk 5", score=35),
        EmpathyScoreWeekPoint(week="Wk 6", score=37),
    ],
)


DEVELOPER_FRICTIONS = [
    DeveloperFriction(dev="Sarah Chen", area="Code Reviews", hours_lost=5.1, trend="increasing", top_blocker="Waiting on senior reviewer — only 2 available"),
    DeveloperFriction(dev="Sarah Chen", area="Meetings", hours_lost=2.2, trend="stable", top_blocker="Sprint planning takes full morning"),
    DeveloperFriction(dev="Marcus Rodriguez", area="Code Reviews", hours_lost=3.8, trend="stable", top_blocker="Cross-team PRs require 3 reviewers"),
    DeveloperFriction(dev="Marcus Rodriguez", area="CI/CD Waits", hours_lost=2.4, trend="decreasing", top_blocker="Feature branch builds queued behind main"),
    DeveloperFriction(dev="Marcus Rodriguez", area="Context Switching", hours_lost=1.8, trend="increasing", top_blocker="Slack interruptions during deep work"),
    DeveloperFriction(dev="Priya Patel", area="Meetings", hours_lost=3.4, trend="increasing", top_blocker="Architecture review meetings doubled"),
    DeveloperFriction(dev="Priya Patel", area="AI Tool Friction", hours_lost=1.9, trend="increasing", top_blocker="AI suggestions wrong for complex patterns — time wasted reviewing"),
    DeveloperFriction(dev="Jake Morrison", area="Code Reviews", hours_lost=4.6, trend="stable", top_blocker="Junior PRs get deprioritized"),
    DeveloperFriction(dev="Jake Morrison", area="Environment Setup", hours_lost=1.3, trend="decreasing", top_blocker="Docker build cache invalidation"),
    DeveloperFriction(dev="Alex Kim", area="Meetings", hours_lost=3.1, trend="stable", top_blocker="3 standups per day across squads"),
    DeveloperFriction(dev="Alex Kim", area="CI/CD Waits", hours_lost=2.1, trend="stable", top_blocker="Integration tests take 38 minutes"),
    DeveloperFriction(dev="Alex Kim", area="Context Switching", hours_lost=1.6, trend="increasing", top_blocker="On-call pages during sprint work"),
]

FRICTION_TRENDS = [
    FrictionTrendPoint(week="Wk 1", code_reviews=3.8, meetings=2.5, ci_cd=2.1, context_switching=1.2, ai_friction=0.8),
    FrictionTrendPoint(week="Wk 2", code_reviews=4.0, meetings=2.6, ci_cd=2.0, context_switching=1.3, ai_friction=0.9),
    FrictionTrendPoint(week="Wk 3", code_reviews=4.2, meetings=2.9, ci_cd=1.8, context_switching=1.4, ai_friction=1.0),
    FrictionTrendPoint(week="Wk 4", code_reviews=4.1, meetings=2.7, ci_cd=1.6, context_switching=1.5, ai_friction=1.1),
    FrictionTrendPoint(week="Wk 5", code_reviews=4.3, meetings=2.8, ci_cd=1.5, context_switching=1.4, ai_friction=1.2),
    FrictionTrendPoint(week="Wk 6", code_reviews=4.2, meetings=2.8, ci_cd=1.4, context_switching=1.5, ai_friction=1.1),
]

IMPACT_SIMULATIONS = [
    ImpactSimulation(
        issue="Code review SLA (48h → 24h)",
        current_cost_monthly=18000, fix_effort_hours=40,
        projected_savings_monthly=12600, roi_pct=315, payback_weeks=1.3, priority="critical",
    ),
    ImpactSimulation(
        issue="Reduce meetings to 6/week max",
        current_cost_monthly=12000, fix_effort_hours=8,
        projected_savings_monthly=7200, roi_pct=900, payback_weeks=0.4, priority="critical",
    ),
    ImpactSimulation(
        issue="CI/CD pipeline parallelisation",
        current_cost_monthly=7000, fix_effort_hours=80,
        projected_savings_monthly=5600, roi_pct=70, payback_weeks=5.7, priority="high",
    ),
    ImpactSimulation(
        issue="AI tool seniority-aware modes",
        current_cost_monthly=9000, fix_effort_hours=60,
        projected_savings_monthly=6300, roi_pct=105, payback_weeks=3.8, priority="high",
    ),
    ImpactSimulation(
        issue="Fair on-call rotation automation",
        current_cost_monthly=4000, fix_effort_hours=24,
        projected_savings_monthly=3200, roi_pct=133, payback_weeks=3.0, priority="medium",
    ),
]

EMPATHY_DIMENSIONS = [
    EmpathyDimension(category="Process", leader_awareness=35, dev_severity=88, gap=53, action_rate=33, color="#EF4444"),
    EmpathyDimension(category="Culture", leader_awareness=28, dev_severity=82, gap=54, action_rate=0, color="#F59E0B"),
    EmpathyDimension(category="Tooling", leader_awareness=45, dev_severity=71, gap=26, action_rate=67, color="#00D4FF"),
    EmpathyDimension(category="AI Tooling", leader_awareness=15, dev_severity=68, gap=53, action_rate=50, color="#7C3AED"),
    EmpathyDimension(category="Operations", leader_awareness=22, dev_severity=79, gap=57, action_rate=0, color="#EC4899"),
]

LEADERSHIP_BRIEFING = LeadershipBriefing(
    period="Week of Feb 24 – Mar 2, 2026",
    top_issues=[
        "Code review latency increased to 52hrs avg — deployment frequency dropped 35%",
        "Meeting load at 12.4 hrs/dev/week — exceeds 8hr deep-work threshold",
        "2 senior engineers flagged as attrition risk due to unfair on-call rotation",
        "AI tool ROI is negative for senior developers — they spend more time reviewing AI output than writing code",
        "CI/CD pipeline improved (45min → 12min) — dev satisfaction up 87%",
    ],
    actions_taken=2,
    actions_ignored=2,
    total_hours_recovered=22.9,
    total_hours_lost=228,
    empathy_score_delta=-5,
    recommendations=[
        "URGENT: Implement 24hr code review SLA — projected to save $12.6K/month (ROI: 315%)",
        "Reduce mandatory meetings to 6/week cap — 900% ROI, 0.4 week payback",
        "Address on-call rotation before Q2 — $340K attrition risk",
        "Deploy seniority-aware AI modes — stops negative ROI for experienced engineers",
        "Schedule skip-level 1:1s with devs flagged as high-friction",
    ],
    dollar_impact="$48,000/month total developer friction cost",
)

ESCALATIONS = [
    EscalationItem(
        issue="Too many mandatory meetings (>12/week)",
        ignored_since="3 weeks ago", days_ignored=21,
        dev_cost_accumulated=8400, escalation_level="director",
        affected_devs=12, auto_escalation_date="Mar 10, 2026",
    ),
    EscalationItem(
        issue="On-call rotation unfair — same 3 people every week",
        ignored_since="3 weeks ago", days_ignored=21,
        dev_cost_accumulated=6300, escalation_level="director",
        affected_devs=3, auto_escalation_date="Mar 10, 2026",
    ),
    EscalationItem(
        issue="Sprint planning takes full day — devs lose momentum",
        ignored_since="1 week ago", days_ignored=7,
        dev_cost_accumulated=2100, escalation_level="team-lead",
        affected_devs=10, auto_escalation_date="Mar 17, 2026",
    ),
]


def get_full_dashboard() -> LeadershipDashboard:
    return LeadershipDashboard(
        friction_heatmap=FRICTION_HEATMAP,
        empathy_gaps=EMPATHY_GAPS,
        action_loop=ACTION_LOOP,
        decision_impacts=DECISION_IMPACTS,
        translations=TRANSLATIONS,
        pulse_results=PULSE_RESULTS,
        empathy_score=EMPATHY_SCORE,
        developer_frictions=DEVELOPER_FRICTIONS,
        friction_trends=FRICTION_TRENDS,
        impact_simulations=IMPACT_SIMULATIONS,
        empathy_dimensions=EMPATHY_DIMENSIONS,
        leadership_briefing=LEADERSHIP_BRIEFING,
        escalations=ESCALATIONS,
    )
