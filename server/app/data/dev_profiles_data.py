from app.models.dev_profiles import (
    Developer, BenefitCurvePoint, ImpactTimelinePoint, BenefitHarm,
    ProductivityTimeline, ProductivityTimelinePoint, ReverseAlert,
    TrustScore, DevProfilesDashboard,
    SenioritySignal, SeniorityProfile, TaskTypeImpact, AIImpactDashboard,
    JDIWeek, JuniorDependencyIndex, SeniorityVelocityDeficit,
    TeamPipelineRisk, InterventionOption, OrgPipelineDebtReport,
)

DEVELOPERS = [
    Developer(
        name="Raj Kumar", seniority="EXPERT", level=4, ai_impact=-22,
        mode="Architect", commits=847, pr_complexity="High", alert=True,
        years_exp=14, code_patterns=["Microservices", "Event Sourcing", "DDD", "CQRS"],
        trust_score=42, trust_threshold=90,
    ),
    Developer(
        name="Priya S.", seniority="SENIOR", level=3, ai_impact=-8,
        mode="Architect", commits=612, pr_complexity="High", alert=False,
        years_exp=9, code_patterns=["REST APIs", "Clean Architecture", "TDD"],
        trust_score=65, trust_threshold=80,
    ),
    Developer(
        name="Arjun M.", seniority="MID", level=2, ai_impact=12,
        mode="Standard", commits=344, pr_complexity="Medium", alert=False,
        years_exp=4, code_patterns=["React", "Node.js", "GraphQL"],
        trust_score=78, trust_threshold=70,
    ),
    Developer(
        name="Meena R.", seniority="JUNIOR", level=1, ai_impact=34,
        mode="Scaffold", commits=87, pr_complexity="Low", alert=False,
        years_exp=1, code_patterns=["JavaScript", "HTML/CSS", "Git basics"],
        trust_score=91, trust_threshold=60,
    ),
    Developer(
        name="Dev K.", seniority="EXPERT", level=4, ai_impact=-31,
        mode="Architect", commits=992, pr_complexity="Very High", alert=True,
        years_exp=18, code_patterns=["Distributed Systems", "Consensus Algos", "Kernel Dev", "Perf Tuning"],
        trust_score=35, trust_threshold=90,
    ),
]

BENEFIT_CURVE = [
    BenefitCurvePoint(seniority="Intern", impact=42),
    BenefitCurvePoint(seniority="Junior", impact=34),
    BenefitCurvePoint(seniority="Mid", impact=12),
    BenefitCurvePoint(seniority="Senior", impact=-8),
    BenefitCurvePoint(seniority="Expert", impact=-22),
]

IMPACT_TIMELINE = [
    ImpactTimelinePoint(month="Jan", gain=-5),
    ImpactTimelinePoint(month="Feb", gain=-9),
    ImpactTimelinePoint(month="Mar", gain=-14),
    ImpactTimelinePoint(month="Apr", gain=-18),
    ImpactTimelinePoint(month="May", gain=-21),
    ImpactTimelinePoint(month="Jun", gain=-22),
]

BENEFIT_HARM = [
    BenefitHarm(dev="Raj Kumar", help_rate=18, harm_rate=52, neutral_rate=30, net_impact=-34, sessions_tracked=312, last_alert="2 hours ago"),
    BenefitHarm(dev="Priya S.", help_rate=35, harm_rate=28, neutral_rate=37, net_impact=-7, sessions_tracked=248, last_alert="1 day ago"),
    BenefitHarm(dev="Arjun M.", help_rate=62, harm_rate=14, neutral_rate=24, net_impact=48, sessions_tracked=189, last_alert="Never"),
    BenefitHarm(dev="Meena R.", help_rate=81, harm_rate=5, neutral_rate=14, net_impact=76, sessions_tracked=94, last_alert="Never"),
    BenefitHarm(dev="Dev K.", help_rate=12, harm_rate=61, neutral_rate=27, net_impact=-49, sessions_tracked=387, last_alert="45 min ago"),
]

PRODUCTIVITY_TIMELINES = [
    ProductivityTimeline(dev="Raj Kumar", timeline=[
        ProductivityTimelinePoint(month="Jan", productivity=82, ai_usage=20, quality=91),
        ProductivityTimelinePoint(month="Feb", productivity=78, ai_usage=35, quality=88),
        ProductivityTimelinePoint(month="Mar", productivity=71, ai_usage=50, quality=82),
        ProductivityTimelinePoint(month="Apr", productivity=65, ai_usage=60, quality=79),
        ProductivityTimelinePoint(month="May", productivity=62, ai_usage=65, quality=76),
        ProductivityTimelinePoint(month="Jun", productivity=60, ai_usage=68, quality=74),
    ]),
    ProductivityTimeline(dev="Priya S.", timeline=[
        ProductivityTimelinePoint(month="Jan", productivity=75, ai_usage=25, quality=87),
        ProductivityTimelinePoint(month="Feb", productivity=73, ai_usage=40, quality=85),
        ProductivityTimelinePoint(month="Mar", productivity=70, ai_usage=48, quality=83),
        ProductivityTimelinePoint(month="Apr", productivity=69, ai_usage=52, quality=82),
        ProductivityTimelinePoint(month="May", productivity=68, ai_usage=55, quality=80),
        ProductivityTimelinePoint(month="Jun", productivity=67, ai_usage=58, quality=79),
    ]),
    ProductivityTimeline(dev="Arjun M.", timeline=[
        ProductivityTimelinePoint(month="Jan", productivity=55, ai_usage=30, quality=72),
        ProductivityTimelinePoint(month="Feb", productivity=60, ai_usage=45, quality=75),
        ProductivityTimelinePoint(month="Mar", productivity=65, ai_usage=55, quality=78),
        ProductivityTimelinePoint(month="Apr", productivity=68, ai_usage=60, quality=80),
        ProductivityTimelinePoint(month="May", productivity=70, ai_usage=62, quality=81),
        ProductivityTimelinePoint(month="Jun", productivity=72, ai_usage=64, quality=83),
    ]),
    ProductivityTimeline(dev="Meena R.", timeline=[
        ProductivityTimelinePoint(month="Jan", productivity=32, ai_usage=45, quality=58),
        ProductivityTimelinePoint(month="Feb", productivity=42, ai_usage=60, quality=65),
        ProductivityTimelinePoint(month="Mar", productivity=51, ai_usage=72, quality=70),
        ProductivityTimelinePoint(month="Apr", productivity=58, ai_usage=78, quality=74),
        ProductivityTimelinePoint(month="May", productivity=63, ai_usage=82, quality=77),
        ProductivityTimelinePoint(month="Jun", productivity=66, ai_usage=85, quality=79),
    ]),
    ProductivityTimeline(dev="Dev K.", timeline=[
        ProductivityTimelinePoint(month="Jan", productivity=88, ai_usage=15, quality=95),
        ProductivityTimelinePoint(month="Feb", productivity=82, ai_usage=30, quality=91),
        ProductivityTimelinePoint(month="Mar", productivity=72, ai_usage=48, quality=84),
        ProductivityTimelinePoint(month="Apr", productivity=64, ai_usage=58, quality=78),
        ProductivityTimelinePoint(month="May", productivity=59, ai_usage=62, quality=73),
        ProductivityTimelinePoint(month="Jun", productivity=57, ai_usage=65, quality=70),
    ]),
]

REVERSE_ALERTS = [
    ReverseAlert(
        dev="Dev K.", severity="critical",
        msg="AI suggestions are consistently rejected (88% override rate). Developer's commit velocity dropped 31% since AI adoption. Pattern analysis shows AI completions break developer's architectural thinking flow.",
        recommendation="Switch to Architect mode immediately. Disable inline completions; only show high-level architecture suggestions. Dev K. thinks in distributed system patterns — step-by-step AI completions are counterproductive.",
        ai_time_lost=12.4, manual_estimate=4.2, triggered="45 min ago",
    ),
    ReverseAlert(
        dev="Raj Kumar", severity="critical",
        msg="Expert developer spending 22% of coding time dismissing or correcting AI suggestions. AI auto-complete is interrupting deep design thinking sessions averaging 47 min duration.",
        recommendation="Enable 'Deep Focus' mode: suppress all AI suggestions during detected focus sessions. Switch to pull-based AI (only suggest when explicitly asked). Senior devs benefit from AI as a search tool, not an autocomplete.",
        ai_time_lost=8.7, manual_estimate=3.1, triggered="2 hours ago",
    ),
    ReverseAlert(
        dev="Priya S.", severity="warning",
        msg="Moderate impact detected — AI suggestions accepted at 42% rate but 15% of accepted suggestions required immediate rework. Net productivity slightly negative.",
        recommendation="Adjust AI confidence threshold to only show high-confidence suggestions (>85%). Priya's clean architecture patterns are well-established; AI should only fill boilerplate, not suggest architecture.",
        ai_time_lost=3.2, manual_estimate=2.8, triggered="1 day ago",
    ),
]

TRUST_SCORES = [
    TrustScore(dev="Raj Kumar", seniority="EXPERT", trust_score=42, threshold=90, auto_accept_rate=12, review_required=34, override_count=89),
    TrustScore(dev="Priya S.", seniority="SENIOR", trust_score=65, threshold=80, auto_accept_rate=35, review_required=18, override_count=42),
    TrustScore(dev="Arjun M.", seniority="MID", trust_score=78, threshold=70, auto_accept_rate=62, review_required=8, override_count=11),
    TrustScore(dev="Meena R.", seniority="JUNIOR", trust_score=91, threshold=60, auto_accept_rate=81, review_required=3, override_count=2),
    TrustScore(dev="Dev K.", seniority="EXPERT", trust_score=35, threshold=90, auto_accept_rate=8, review_required=41, override_count=114),
]


# ── Seniority Profiler — 7-Signal Behavioral Classifier ──

SENIORITY_PROFILES = [
    SeniorityProfile(
        developer="Raj Kumar", seniority_score=84, band="Expert", years_active=14,
        top_signal="Cross-module edit radius",
        signals=[
            SenioritySignal(signal="Commit graph depth", measurement="14 yrs active across 23 repos", raw_value=14, score_contribution=18),
            SenioritySignal(signal="Cyclomatic complexity delta", measurement="Avg CC authored: 12.4 vs modified: 8.1", raw_value=12.4, score_contribution=14),
            SenioritySignal(signal="Cross-module edit radius", measurement="8.2 distinct modules per PR", raw_value=8.2, score_contribution=16),
            SenioritySignal(signal="Review-to-author ratio", measurement="3.4 reviews per authored PR", raw_value=3.4, score_contribution=13),
            SenioritySignal(signal="Infrastructure file ownership", measurement="34% infra commits", raw_value=34, score_contribution=11),
            SenioritySignal(signal="PR comment technical density", measurement="Avg 142 words, 68% technical vocabulary", raw_value=142, score_contribution=7),
            SenioritySignal(signal="Revert survival rate", measurement="96.2% commits survive 30+ days", raw_value=96.2, score_contribution=5),
        ],
    ),
    SeniorityProfile(
        developer="Priya S.", seniority_score=68, band="Proficient", years_active=9,
        top_signal="Review-to-author ratio",
        signals=[
            SenioritySignal(signal="Commit graph depth", measurement="9 yrs active across 11 repos", raw_value=9, score_contribution=12),
            SenioritySignal(signal="Cyclomatic complexity delta", measurement="Avg CC authored: 8.7 vs modified: 6.3", raw_value=8.7, score_contribution=11),
            SenioritySignal(signal="Cross-module edit radius", measurement="5.1 distinct modules per PR", raw_value=5.1, score_contribution=10),
            SenioritySignal(signal="Review-to-author ratio", measurement="2.8 reviews per authored PR", raw_value=2.8, score_contribution=14),
            SenioritySignal(signal="Infrastructure file ownership", measurement="22% infra commits", raw_value=22, score_contribution=9),
            SenioritySignal(signal="PR comment technical density", measurement="Avg 98 words, 54% technical vocabulary", raw_value=98, score_contribution=7),
            SenioritySignal(signal="Revert survival rate", measurement="93.8% commits survive 30+ days", raw_value=93.8, score_contribution=5),
        ],
    ),
    SeniorityProfile(
        developer="Arjun M.", seniority_score=42, band="Developing", years_active=4,
        top_signal="Commit graph depth",
        signals=[
            SenioritySignal(signal="Commit graph depth", measurement="4 yrs active across 5 repos", raw_value=4, score_contribution=8),
            SenioritySignal(signal="Cyclomatic complexity delta", measurement="Avg CC authored: 5.2 vs modified: 4.8", raw_value=5.2, score_contribution=7),
            SenioritySignal(signal="Cross-module edit radius", measurement="2.3 distinct modules per PR", raw_value=2.3, score_contribution=6),
            SenioritySignal(signal="Review-to-author ratio", measurement="0.8 reviews per authored PR", raw_value=0.8, score_contribution=6),
            SenioritySignal(signal="Infrastructure file ownership", measurement="8% infra commits", raw_value=8, score_contribution=5),
            SenioritySignal(signal="PR comment technical density", measurement="Avg 42 words, 31% technical vocabulary", raw_value=42, score_contribution=5),
            SenioritySignal(signal="Revert survival rate", measurement="87.1% commits survive 30+ days", raw_value=87.1, score_contribution=5),
        ],
    ),
    SeniorityProfile(
        developer="Meena R.", seniority_score=18, band="Emerging", years_active=1,
        top_signal="Revert survival rate",
        signals=[
            SenioritySignal(signal="Commit graph depth", measurement="1 yr active across 2 repos", raw_value=1, score_contribution=3),
            SenioritySignal(signal="Cyclomatic complexity delta", measurement="Avg CC authored: 2.8 vs modified: 3.1", raw_value=2.8, score_contribution=2),
            SenioritySignal(signal="Cross-module edit radius", measurement="1.1 distinct modules per PR", raw_value=1.1, score_contribution=2),
            SenioritySignal(signal="Review-to-author ratio", measurement="0.1 reviews per authored PR", raw_value=0.1, score_contribution=2),
            SenioritySignal(signal="Infrastructure file ownership", measurement="2% infra commits", raw_value=2, score_contribution=2),
            SenioritySignal(signal="PR comment technical density", measurement="Avg 18 words, 12% technical vocabulary", raw_value=18, score_contribution=3),
            SenioritySignal(signal="Revert survival rate", measurement="78.4% commits survive 30+ days", raw_value=78.4, score_contribution=4),
        ],
    ),
    SeniorityProfile(
        developer="Dev K.", seniority_score=92, band="Expert", years_active=18,
        top_signal="Infrastructure file ownership",
        signals=[
            SenioritySignal(signal="Commit graph depth", measurement="18 yrs active across 41 repos", raw_value=18, score_contribution=20),
            SenioritySignal(signal="Cyclomatic complexity delta", measurement="Avg CC authored: 16.1 vs modified: 9.4", raw_value=16.1, score_contribution=16),
            SenioritySignal(signal="Cross-module edit radius", measurement="11.4 distinct modules per PR", raw_value=11.4, score_contribution=14),
            SenioritySignal(signal="Review-to-author ratio", measurement="5.1 reviews per authored PR", raw_value=5.1, score_contribution=12),
            SenioritySignal(signal="Infrastructure file ownership", measurement="52% infra commits", raw_value=52, score_contribution=14),
            SenioritySignal(signal="PR comment technical density", measurement="Avg 218 words, 74% technical vocabulary", raw_value=218, score_contribution=9),
            SenioritySignal(signal="Revert survival rate", measurement="98.1% commits survive 30+ days", raw_value=98.1, score_contribution=7),
        ],
    ),
]


# ── AI Impact Dashboard — Per-Task-Type Benefit/Harm ──

AI_IMPACT_DASHBOARDS = [
    AIImpactDashboard(
        developer="Raj Kumar", seniority_score=84, band="Expert",
        net_impact_hrs=-12.4,
        recommended_disable=["Architecture work", "Known codebase bugs"],
        benefit_zone=["Greenfield features", "Large refactors"],
        task_impacts=[
            TaskTypeImpact(task_type="Architecture work", ai_on_avg_hrs=4.2, ai_off_avg_hrs=2.8, delta_pct=50, signal="HARM"),
            TaskTypeImpact(task_type="Large refactor", ai_on_avg_hrs=3.1, ai_off_avg_hrs=3.4, delta_pct=-9, signal="BENEFIT"),
            TaskTypeImpact(task_type="Known codebase bug", ai_on_avg_hrs=1.8, ai_off_avg_hrs=1.1, delta_pct=64, signal="HARM"),
            TaskTypeImpact(task_type="Greenfield feature", ai_on_avg_hrs=2.6, ai_off_avg_hrs=2.9, delta_pct=-10, signal="BENEFIT"),
            TaskTypeImpact(task_type="Code review", ai_on_avg_hrs=0.9, ai_off_avg_hrs=0.7, delta_pct=29, signal="MARGINAL"),
        ],
    ),
    AIImpactDashboard(
        developer="Priya S.", seniority_score=68, band="Proficient",
        net_impact_hrs=-3.8,
        recommended_disable=["Known codebase bugs"],
        benefit_zone=["Greenfield features", "Boilerplate tasks", "Large refactors"],
        task_impacts=[
            TaskTypeImpact(task_type="Architecture work", ai_on_avg_hrs=3.5, ai_off_avg_hrs=3.1, delta_pct=13, signal="MARGINAL"),
            TaskTypeImpact(task_type="Large refactor", ai_on_avg_hrs=2.8, ai_off_avg_hrs=3.2, delta_pct=-13, signal="BENEFIT"),
            TaskTypeImpact(task_type="Known codebase bug", ai_on_avg_hrs=1.6, ai_off_avg_hrs=1.0, delta_pct=60, signal="HARM"),
            TaskTypeImpact(task_type="Greenfield feature", ai_on_avg_hrs=2.1, ai_off_avg_hrs=2.8, delta_pct=-25, signal="BENEFIT"),
            TaskTypeImpact(task_type="Boilerplate task", ai_on_avg_hrs=0.4, ai_off_avg_hrs=0.9, delta_pct=-56, signal="BENEFIT"),
        ],
    ),
    AIImpactDashboard(
        developer="Arjun M.", seniority_score=42, band="Developing",
        net_impact_hrs=6.2,
        recommended_disable=[],
        benefit_zone=["Greenfield features", "Boilerplate tasks", "Large refactors", "Code review"],
        task_impacts=[
            TaskTypeImpact(task_type="Architecture work", ai_on_avg_hrs=5.1, ai_off_avg_hrs=4.8, delta_pct=6, signal="MARGINAL"),
            TaskTypeImpact(task_type="Large refactor", ai_on_avg_hrs=3.4, ai_off_avg_hrs=4.1, delta_pct=-17, signal="BENEFIT"),
            TaskTypeImpact(task_type="Known codebase bug", ai_on_avg_hrs=2.2, ai_off_avg_hrs=2.4, delta_pct=-8, signal="BENEFIT"),
            TaskTypeImpact(task_type="Greenfield feature", ai_on_avg_hrs=1.8, ai_off_avg_hrs=3.2, delta_pct=-44, signal="BENEFIT"),
            TaskTypeImpact(task_type="Boilerplate task", ai_on_avg_hrs=0.3, ai_off_avg_hrs=1.1, delta_pct=-73, signal="BENEFIT"),
        ],
    ),
    AIImpactDashboard(
        developer="Meena R.", seniority_score=18, band="Emerging",
        net_impact_hrs=14.8,
        recommended_disable=[],
        benefit_zone=["Greenfield features", "Boilerplate tasks", "Known codebase bugs", "Code review"],
        task_impacts=[
            TaskTypeImpact(task_type="Architecture work", ai_on_avg_hrs=6.8, ai_off_avg_hrs=7.2, delta_pct=-6, signal="BENEFIT"),
            TaskTypeImpact(task_type="Large refactor", ai_on_avg_hrs=4.1, ai_off_avg_hrs=5.8, delta_pct=-29, signal="BENEFIT"),
            TaskTypeImpact(task_type="Known codebase bug", ai_on_avg_hrs=2.4, ai_off_avg_hrs=3.9, delta_pct=-38, signal="BENEFIT"),
            TaskTypeImpact(task_type="Greenfield feature", ai_on_avg_hrs=1.4, ai_off_avg_hrs=3.5, delta_pct=-60, signal="BENEFIT"),
            TaskTypeImpact(task_type="Boilerplate task", ai_on_avg_hrs=0.2, ai_off_avg_hrs=1.4, delta_pct=-86, signal="BENEFIT"),
        ],
    ),
    AIImpactDashboard(
        developer="Dev K.", seniority_score=92, band="Expert",
        net_impact_hrs=-18.6,
        recommended_disable=["Architecture work", "Known codebase bugs", "Code review"],
        benefit_zone=["Greenfield features"],
        task_impacts=[
            TaskTypeImpact(task_type="Architecture work", ai_on_avg_hrs=5.6, ai_off_avg_hrs=2.4, delta_pct=133, signal="HARM"),
            TaskTypeImpact(task_type="Large refactor", ai_on_avg_hrs=3.8, ai_off_avg_hrs=3.2, delta_pct=19, signal="MARGINAL"),
            TaskTypeImpact(task_type="Known codebase bug", ai_on_avg_hrs=2.1, ai_off_avg_hrs=0.8, delta_pct=163, signal="HARM"),
            TaskTypeImpact(task_type="Greenfield feature", ai_on_avg_hrs=2.2, ai_off_avg_hrs=2.6, delta_pct=-15, signal="BENEFIT"),
            TaskTypeImpact(task_type="Code review", ai_on_avg_hrs=1.2, ai_off_avg_hrs=0.5, delta_pct=140, signal="HARM"),
        ],
    ),
]


# ── Talent Pipeline Debt Forecaster ──

JUNIOR_DEPENDENCY_INDICES = [
    JuniorDependencyIndex(
        developer="Meena R.", band="Emerging", seniority_score=18,
        jdi_trend_pts=-41, atrophy_velocity=-2.6, projected_jdi_week28=5,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=82),
            JDIWeek(week_range="Week 5-8", independent_pct=67),
            JDIWeek(week_range="Week 9-12", independent_pct=54),
            JDIWeek(week_range="Week 13-16", independent_pct=41),
        ],
    ),
    JuniorDependencyIndex(
        developer="Arjun M.", band="Developing", seniority_score=42,
        jdi_trend_pts=-22, atrophy_velocity=-1.4, projected_jdi_week28=24,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=74),
            JDIWeek(week_range="Week 5-8", independent_pct=66),
            JDIWeek(week_range="Week 9-12", independent_pct=58),
            JDIWeek(week_range="Week 13-16", independent_pct=52),
        ],
    ),
    JuniorDependencyIndex(
        developer="Sana T.", band="Emerging", seniority_score=12,
        jdi_trend_pts=-52, atrophy_velocity=-3.3, projected_jdi_week28=2,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=78),
            JDIWeek(week_range="Week 5-8", independent_pct=58),
            JDIWeek(week_range="Week 9-12", independent_pct=38),
            JDIWeek(week_range="Week 13-16", independent_pct=26),
        ],
    ),
    JuniorDependencyIndex(
        developer="Vikram P.", band="Developing", seniority_score=31,
        jdi_trend_pts=-18, atrophy_velocity=-1.1, projected_jdi_week28=32,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=70),
            JDIWeek(week_range="Week 5-8", independent_pct=64),
            JDIWeek(week_range="Week 9-12", independent_pct=58),
            JDIWeek(week_range="Week 13-16", independent_pct=52),
        ],
    ),
    JuniorDependencyIndex(
        developer="Anita D.", band="Emerging", seniority_score=15,
        jdi_trend_pts=-46, atrophy_velocity=-2.9, projected_jdi_week28=4,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=80),
            JDIWeek(week_range="Week 5-8", independent_pct=62),
            JDIWeek(week_range="Week 9-12", independent_pct=46),
            JDIWeek(week_range="Week 13-16", independent_pct=34),
        ],
    ),
    JuniorDependencyIndex(
        developer="Rohit S.", band="Developing", seniority_score=36,
        jdi_trend_pts=-12, atrophy_velocity=-0.8, projected_jdi_week28=42,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=72),
            JDIWeek(week_range="Week 5-8", independent_pct=68),
            JDIWeek(week_range="Week 9-12", independent_pct=64),
            JDIWeek(week_range="Week 13-16", independent_pct=60),
        ],
    ),
    JuniorDependencyIndex(
        developer="Neha K.", band="Emerging", seniority_score=10,
        jdi_trend_pts=-56, atrophy_velocity=-3.5, projected_jdi_week28=1,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=76),
            JDIWeek(week_range="Week 5-8", independent_pct=52),
            JDIWeek(week_range="Week 9-12", independent_pct=32),
            JDIWeek(week_range="Week 13-16", independent_pct=20),
        ],
    ),
    JuniorDependencyIndex(
        developer="Karthik V.", band="Developing", seniority_score=28,
        jdi_trend_pts=-30, atrophy_velocity=-1.9, projected_jdi_week28=16,
        weekly_jdi=[
            JDIWeek(week_range="Week 1-4", independent_pct=75),
            JDIWeek(week_range="Week 5-8", independent_pct=62),
            JDIWeek(week_range="Week 9-12", independent_pct=52),
            JDIWeek(week_range="Week 13-16", independent_pct=45),
        ],
    ),
]


SENIORITY_VELOCITY_DEFICITS = [
    SeniorityVelocityDeficit(
        developer="Meena R.", tenure_months=14,
        expected_score_growth=38, actual_score_growth=12, gap_pct=68,
        expected_complexity_growth=2.1, actual_complexity_growth=0.6, complexity_gap_pct=71,
        expected_review_pct=40, actual_review_pct=8, review_gap_pct=80,
        svr=0.32, projected_proficient_month=54, expected_proficient_month=28, timeline_cost_months=26,
    ),
    SeniorityVelocityDeficit(
        developer="Arjun M.", tenure_months=19,
        expected_score_growth=38, actual_score_growth=21, gap_pct=45,
        expected_complexity_growth=2.1, actual_complexity_growth=0.9, complexity_gap_pct=57,
        expected_review_pct=60, actual_review_pct=22, review_gap_pct=63,
        svr=0.41, projected_proficient_month=48, expected_proficient_month=28, timeline_cost_months=20,
    ),
    SeniorityVelocityDeficit(
        developer="Sana T.", tenure_months=8,
        expected_score_growth=38, actual_score_growth=8, gap_pct=79,
        expected_complexity_growth=2.1, actual_complexity_growth=0.3, complexity_gap_pct=86,
        expected_review_pct=20, actual_review_pct=2, review_gap_pct=90,
        svr=0.21, projected_proficient_month=72, expected_proficient_month=28, timeline_cost_months=44,
    ),
    SeniorityVelocityDeficit(
        developer="Vikram P.", tenure_months=22,
        expected_score_growth=38, actual_score_growth=24, gap_pct=37,
        expected_complexity_growth=2.1, actual_complexity_growth=1.2, complexity_gap_pct=43,
        expected_review_pct=65, actual_review_pct=34, review_gap_pct=48,
        svr=0.55, projected_proficient_month=38, expected_proficient_month=28, timeline_cost_months=10,
    ),
    SeniorityVelocityDeficit(
        developer="Anita D.", tenure_months=11,
        expected_score_growth=38, actual_score_growth=10, gap_pct=74,
        expected_complexity_growth=2.1, actual_complexity_growth=0.4, complexity_gap_pct=81,
        expected_review_pct=30, actual_review_pct=5, review_gap_pct=83,
        svr=0.26, projected_proficient_month=62, expected_proficient_month=28, timeline_cost_months=34,
    ),
    SeniorityVelocityDeficit(
        developer="Rohit S.", tenure_months=24,
        expected_score_growth=38, actual_score_growth=28, gap_pct=26,
        expected_complexity_growth=2.1, actual_complexity_growth=1.5, complexity_gap_pct=29,
        expected_review_pct=70, actual_review_pct=48, review_gap_pct=31,
        svr=0.72, projected_proficient_month=34, expected_proficient_month=28, timeline_cost_months=6,
    ),
    SeniorityVelocityDeficit(
        developer="Neha K.", tenure_months=6,
        expected_score_growth=38, actual_score_growth=5, gap_pct=87,
        expected_complexity_growth=2.1, actual_complexity_growth=0.2, complexity_gap_pct=90,
        expected_review_pct=15, actual_review_pct=1, review_gap_pct=93,
        svr=0.13, projected_proficient_month=84, expected_proficient_month=28, timeline_cost_months=56,
    ),
    SeniorityVelocityDeficit(
        developer="Karthik V.", tenure_months=16,
        expected_score_growth=38, actual_score_growth=18, gap_pct=53,
        expected_complexity_growth=2.1, actual_complexity_growth=0.8, complexity_gap_pct=62,
        expected_review_pct=50, actual_review_pct=16, review_gap_pct=68,
        svr=0.38, projected_proficient_month=52, expected_proficient_month=28, timeline_cost_months=24,
    ),
]


TEAM_PIPELINE_RISK = [
    TeamPipelineRisk(
        team="Platform Team", juniors_tracked=8, avg_jdi_trend=-28,
        avg_svr=0.44, devs_on_atrophy=6, atrophy_pct=75,
        risk_score=78, risk_level="HIGH",
        external_hire_by="Q1 2028",
    ),
    TeamPipelineRisk(
        team="Frontend Squad", juniors_tracked=5, avg_jdi_trend=-34,
        avg_svr=0.38, devs_on_atrophy=4, atrophy_pct=80,
        risk_score=84, risk_level="CRITICAL",
        external_hire_by="Q3 2027",
    ),
    TeamPipelineRisk(
        team="Data Engineering", juniors_tracked=4, avg_jdi_trend=-15,
        avg_svr=0.62, devs_on_atrophy=2, atrophy_pct=50,
        risk_score=52, risk_level="MODERATE",
        external_hire_by="Q2 2029",
    ),
    TeamPipelineRisk(
        team="DevOps / SRE", juniors_tracked=3, avg_jdi_trend=-8,
        avg_svr=0.78, devs_on_atrophy=1, atrophy_pct=33,
        risk_score=31, risk_level="LOW",
        external_hire_by="Q4 2030",
    ),
]


ORG_PIPELINE_DEBT = OrgPipelineDebtReport(
    quarter="Q1 2026",
    severe_atrophy_count=14,
    total_juniors=23,
    atrophy_pct=61,
    avg_svr=0.42,
    svr_gap_below_ok=31,
    projected_senior_gap=9,
    gap_by_quarter="Q3 2028",
    cost_per_external_hire=34000,
    ramp_premium_per_role=18000,
    knowledge_loss_per_role=22000,
    total_pipeline_debt=666000,
    preventable_by="Q3 2026",
    interventions=[
        InterventionOption(
            option="Option A",
            description="Structured AI-free learning sprints (2 hrs/wk)",
            quarterly_cost="$8,400",
            debt_reduction="$420,000",
        ),
        InterventionOption(
            option="Option B",
            description="Pair programming mandates on architecture tasks",
            quarterly_cost="$14,200",
            debt_reduction="$580,000",
        ),
    ],
)


def get_full_dashboard() -> dict:
    return {
        "developers": DEVELOPERS,
        "benefit_curve": BENEFIT_CURVE,
        "impact_timeline": IMPACT_TIMELINE,
        "benefit_harm": BENEFIT_HARM,
        "productivity_timelines": PRODUCTIVITY_TIMELINES,
        "reverse_alerts": REVERSE_ALERTS,
        "trust_scores": TRUST_SCORES,
        "seniority_profiles": SENIORITY_PROFILES,
        "ai_impact_dashboards": AI_IMPACT_DASHBOARDS,
        "junior_dependency_indices": JUNIOR_DEPENDENCY_INDICES,
        "seniority_velocity_deficits": SENIORITY_VELOCITY_DEFICITS,
        "team_pipeline_risk": TEAM_PIPELINE_RISK,
        "org_pipeline_debt": ORG_PIPELINE_DEBT,
    }


def switch_mode(dev_name: str, mode: str) -> Developer | None:
    """Switch AI suggestion mode for a developer and return updated dev."""
    for dev in DEVELOPERS:
        if dev.name == dev_name:
            idx = DEVELOPERS.index(dev)
            DEVELOPERS[idx] = dev.model_copy(update={"mode": mode})
            return DEVELOPERS[idx]
    return None


def acknowledge_alert(index: int) -> ReverseAlert | None:
    """Remove an acknowledged reverse mentoring alert."""
    if 0 <= index < len(REVERSE_ALERTS):
        return REVERSE_ALERTS.pop(index)
    return None


def update_trust_threshold(dev_name: str, threshold: float) -> TrustScore | None:
    """Update trust threshold for a specific developer."""
    for i, ts in enumerate(TRUST_SCORES):
        if ts.dev == dev_name:
            TRUST_SCORES[i] = ts.model_copy(update={"threshold": threshold})
            return TRUST_SCORES[i]
    return None
