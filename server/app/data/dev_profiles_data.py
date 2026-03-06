from app.models.dev_profiles import (
    Developer, BenefitCurvePoint, ImpactTimelinePoint, BenefitHarm,
    ProductivityTimeline, ProductivityTimelinePoint, ReverseAlert,
    TrustScore, DevProfilesDashboard,
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


def get_full_dashboard() -> DevProfilesDashboard:
    return DevProfilesDashboard(
        developers=DEVELOPERS,
        benefit_curve=BENEFIT_CURVE,
        impact_timeline=IMPACT_TIMELINE,
        benefit_harm=BENEFIT_HARM,
        productivity_timelines=PRODUCTIVITY_TIMELINES,
        reverse_alerts=REVERSE_ALERTS,
        trust_scores=TRUST_SCORES,
    )


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
