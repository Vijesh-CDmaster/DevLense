from app.models.leadership import (
    FrictionPoint, EmpathyGap, ActionLoopItem, DecisionImpact,
    Translation, PulseResult, EmpathyScoreDetail, EmpathyScoreWeekPoint,
    LeadershipDashboard,
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


def get_full_dashboard() -> LeadershipDashboard:
    return LeadershipDashboard(
        friction_heatmap=FRICTION_HEATMAP,
        empathy_gaps=EMPATHY_GAPS,
        action_loop=ACTION_LOOP,
        decision_impacts=DECISION_IMPACTS,
        translations=TRANSLATIONS,
        pulse_results=PULSE_RESULTS,
        empathy_score=EMPATHY_SCORE,
    )
