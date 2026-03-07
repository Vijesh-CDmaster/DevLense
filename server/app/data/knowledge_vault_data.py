"""Mock data for Knowledge Vault."""

from app.models.knowledge_vault import (
    KnowledgeNode, InterviewMessage, ArchitecturalDecision,
    ArchaeologyResult, KnowledgeRiskScore, ReasoningExtraction,
    OnboardingQuery, KnowledgeDecayItem, InterviewSession,
    KnowledgeTransferEntry, UndocumentedRegion, OnboardingInsight,
    DecisionChainLink,
    ExtractionSessionMsg, ContextualExtractionSession, DecisionNode,
    ConstraintAlert, KnowledgeDecayEntry, KnowledgeAssetValuation,
    MortalityTimelineEntry, MortalityTimeline, DepartureExposure,
)

NODES: list[KnowledgeNode] = [
    KnowledgeNode(id="auth", label="Auth Module", risk="red", owners=1, decisions=4,
                  code_regions=["src/auth/jwt.ts", "src/auth/middleware.ts", "src/auth/oauth.ts"],
                  last_updated="2025-12-10"),
    KnowledgeNode(id="payment", label="Payment API", risk="amber", owners=2, decisions=7,
                  code_regions=["src/payments/stripe.ts", "src/payments/webhook.ts", "src/payments/refund.ts", "src/payments/invoice.ts"],
                  last_updated="2026-01-15"),
    KnowledgeNode(id="user", label="User Service", risk="green", owners=4, decisions=12,
                  code_regions=["src/users/profile.ts", "src/users/roles.ts"],
                  last_updated="2026-02-28"),
    KnowledgeNode(id="notification", label="Notifications", risk="amber", owners=2, decisions=5,
                  code_regions=["src/notifications/email.ts", "src/notifications/push.ts", "src/notifications/sms.ts"],
                  last_updated="2026-01-22"),
    KnowledgeNode(id="reporting", label="Reporting Engine", risk="red", owners=1, decisions=9,
                  code_regions=["src/reports/generator.ts", "src/reports/scheduler.ts", "src/reports/export.ts", "src/reports/templates.ts", "src/reports/aggregator.ts"],
                  last_updated="2025-11-05"),
    KnowledgeNode(id="ci", label="CI/CD Pipeline", risk="green", owners=3, decisions=6,
                  code_regions=["infra/Dockerfile", "infra/pipeline.yml", ".github/workflows/deploy.yml"],
                  last_updated="2026-02-14"),
    KnowledgeNode(id="search", label="Search Service", risk="red", owners=1, decisions=3,
                  code_regions=["src/search/indexer.ts", "src/search/query.ts"],
                  last_updated="2025-10-18"),
    KnowledgeNode(id="cache", label="Caching Layer", risk="amber", owners=2, decisions=5,
                  code_regions=["src/cache/redis.ts", "src/cache/invalidation.ts"],
                  last_updated="2026-01-30"),
]

INTERVIEW_HISTORY: list[InterviewMessage] = [
    InterviewMessage(role="bot",
                     msg="Hi Raj! I want to capture your architectural reasoning. Why did you choose Redis over Memcached for session storage?",
                     timestamp="2026-02-15T10:00:00Z"),
    InterviewMessage(role="user",
                     msg="We needed persistence across server restarts. Memcached loses all data on restart, but Redis supports AOF persistence. Also, our session data is complex — nested objects — and Redis handles that natively.",
                     timestamp="2026-02-15T10:02:00Z",
                     decision_extracted=True),
    InterviewMessage(role="bot",
                     msg="Great insight! Saving that as an architectural decision. One follow-up: were there any alternatives you considered and rejected?",
                     timestamp="2026-02-15T10:02:30Z"),
    InterviewMessage(role="user",
                     msg="We looked at DynamoDB but the latency was 3-5x higher for our session-read pattern. Also considered PostgreSQL with JSONB, but it added unnecessary DB load for ephemeral data.",
                     timestamp="2026-02-15T10:04:00Z",
                     decision_extracted=True),
    InterviewMessage(role="bot",
                     msg="Excellent — I've captured those rejected alternatives. Now let's discuss the search service. Why was Elasticsearch chosen over Algolia?",
                     timestamp="2026-02-15T10:05:00Z"),
    InterviewMessage(role="user",
                     msg="Cost was the primary driver. Algolia charges per search operation and we do ~2M searches/month. Elasticsearch self-hosted on our existing k8s cluster costs us effectively nothing extra. The trade-off is we maintain it ourselves.",
                     timestamp="2026-02-15T10:07:00Z",
                     decision_extracted=True),
]

DECISIONS: list[ArchitecturalDecision] = [
    ArchitecturalDecision(
        id="dec-001", title="JWT for Stateless Authentication",
        reasoning="Stateless auth needed for horizontal scaling. Cookie-based sessions would require a shared session store across 4 servers. JWT tokens are self-contained and verifiable without DB lookups.",
        alternatives_rejected=["Cookie-based sessions", "OAuth2 opaque tokens", "API keys"],
        author="Raj Kumar", date="Mar 14, 2023", code_region="src/auth/jwt.ts",
        tags=["auth", "scaling", "security"],
    ),
    ArchitecturalDecision(
        id="dec-002", title="Redis for Session & Cache Storage",
        reasoning="Persistence across server restarts via AOF, native support for complex nested objects, pub/sub for real-time invalidation. Sub-millisecond latency for session reads.",
        alternatives_rejected=["Memcached", "DynamoDB", "PostgreSQL JSONB"],
        author="Raj Kumar", date="Apr 02, 2023", code_region="src/cache/redis.ts",
        tags=["cache", "performance", "infrastructure"],
    ),
    ArchitecturalDecision(
        id="dec-003", title="Stripe over Adyen for Payments",
        reasoning="Superior developer experience, comprehensive test mode, webhook reliability at 99.99%. Our team had prior Stripe experience reducing onboarding time from weeks to days.",
        alternatives_rejected=["Adyen", "Braintree", "Square"],
        author="Priya Singh", date="Jun 18, 2023", code_region="src/payments/stripe.ts",
        tags=["payments", "third-party", "DX"],
    ),
    ArchitecturalDecision(
        id="dec-004", title="Elasticsearch for Full-Text Search",
        reasoning="Self-hosted on existing k8s cluster for zero marginal cost at 2M+ monthly searches. Algolia per-search pricing would cost $4k+/month. Trade-off: we maintain the cluster ourselves.",
        alternatives_rejected=["Algolia", "Typesense", "PostgreSQL FTS"],
        author="Raj Kumar", date="Sep 05, 2023", code_region="src/search/indexer.ts",
        tags=["search", "cost", "infrastructure"],
    ),
    ArchitecturalDecision(
        id="dec-005", title="Event-Driven Notification Architecture",
        reasoning="Decoupled notification sending from business logic. Events published to a queue and consumed asynchronously, preventing notification failures from blocking user requests.",
        alternatives_rejected=["Synchronous sending", "Polling-based", "Firebase Cloud Messaging only"],
        author="Anika Patel", date="Nov 22, 2023", code_region="src/notifications/email.ts",
        tags=["notifications", "async", "architecture"],
    ),
    ArchitecturalDecision(
        id="dec-006", title="GitHub Actions over Jenkins for CI/CD",
        reasoning="Native integration with our GitHub repos. YAML-based configs versioned alongside code. Jenkins required dedicated server maintenance and plugin management overhead.",
        alternatives_rejected=["Jenkins", "CircleCI", "GitLab CI"],
        author="David Chen", date="Jan 10, 2024", code_region=".github/workflows/deploy.yml",
        tags=["CI/CD", "DevOps", "tooling"],
    ),
    ArchitecturalDecision(
        id="dec-007", title="Role-Based Access Control (RBAC) Model",
        reasoning="Hierarchical roles (admin > manager > dev > viewer) with permission inheritance. Simpler than ABAC for our current team size. Can migrate to ABAC later if needed.",
        alternatives_rejected=["ABAC", "ACL-based", "Custom permission flags"],
        author="Raj Kumar", date="Feb 28, 2024", code_region="src/users/roles.ts",
        tags=["auth", "access-control", "security"],
    ),
    ArchitecturalDecision(
        id="dec-008", title="Server-Side Report Generation",
        reasoning="PDF and Excel reports generated server-side using headless Chrome for pixel-perfect rendering. Client-side generation would expose raw data and couldn't handle 100k+ row exports.",
        alternatives_rejected=["Client-side jsPDF", "Google Sheets API export", "CSV-only"],
        author="Meera Joshi", date="May 15, 2024", code_region="src/reports/generator.ts",
        tags=["reporting", "performance", "security"],
    ),
]

RISK_SCORE = KnowledgeRiskScore(
    overall_score=72,
    high_risk_count=3,
    medium_risk_count=2,
    safe_count=3,
    bus_factor_alerts=[
        "Auth Module — only Raj Kumar",
        "Reporting Engine — only Meera Joshi",
        "Search Service — only Raj Kumar",
    ],
)

EXTRACTIONS: list[ReasoningExtraction] = [
    ReasoningExtraction(
        id="ext-001", code_region="src/auth/jwt.ts", decision="JWT for Stateless Auth",
        why="Horizontal scaling across 4 app servers required stateless auth. JWT tokens are self-verifiable without a centralized session store, reducing latency by ~40ms per request.",
        alternatives=["Cookie sessions + Redis", "OAuth2 opaque tokens", "API key rotation"],
        trade_offs="JWT tokens can't be individually revoked without a blacklist. We accept this trade-off with short TTL (15min) + refresh tokens.",
        author="Raj Kumar", date="Mar 14, 2023",
    ),
    ReasoningExtraction(
        id="ext-002", code_region="src/payments/stripe.ts", decision="Stripe Payment Integration",
        why="Team had prior Stripe experience (3 devs). Webhook reliability at 99.99% critical for payment processing. Test mode allowed full integration testing without real charges.",
        alternatives=["Adyen", "Braintree", "Square"],
        trade_offs="Higher per-transaction fee (2.9% + 30¢) vs Adyen (2.5%). Accepted due to 70% reduction in integration time.",
        author="Priya Singh", date="Jun 18, 2023",
    ),
    ReasoningExtraction(
        id="ext-003", code_region="src/search/indexer.ts", decision="Self-Hosted Elasticsearch",
        why="2M+ monthly searches would cost $4,200/mo on Algolia. Self-hosting on existing k8s cluster has near-zero marginal cost. Team already familiar with ELK stack from logging.",
        alternatives=["Algolia", "Typesense", "PostgreSQL full-text search"],
        trade_offs="We own maintenance: index corruption, upgrades, scaling. Estimated 4h/month ops overhead vs zero with managed service.",
        author="Raj Kumar", date="Sep 05, 2023",
    ),
    ReasoningExtraction(
        id="ext-004", code_region="src/reports/generator.ts", decision="Server-Side PDF Generation",
        why="100k+ row exports impossible client-side. Server-side headless Chrome gives pixel-perfect PDF rendering matching the web dashboard exactly. Also prevents raw data exposure to client.",
        alternatives=["jsPDF client-side", "Google Sheets API", "CSV export only"],
        trade_offs="Server CPU spikes during bulk report generation. Mitigated with queue-based processing and dedicated report worker pod.",
        author="Meera Joshi", date="May 15, 2024",
    ),
]

ONBOARDING_QUERIES: list[OnboardingQuery] = [
    OnboardingQuery(
        question="Why doesn't the auth system use cookies?",
        answer="We use JWT instead of cookies because the platform runs across 4 horizontally-scaled app servers. Cookies would require a shared session store (Redis/DB), adding latency. JWT tokens are self-contained and verified locally. Decision made by Raj Kumar in Mar 2023.",
        source_decisions=["JWT for Stateless Authentication"],
        confidence=96, asked_by="New Dev (Alex)", date="2026-01-08",
    ),
    OnboardingQuery(
        question="Why not use Algolia for search? It seems easier.",
        answer="We evaluated Algolia but at 2M+ searches/month the cost would be $4,200/mo. Self-hosted Elasticsearch on our existing k8s cluster costs near-zero. The trade-off is ~4h/month of maintenance. Decision by Raj Kumar, Sep 2023.",
        source_decisions=["Elasticsearch for Full-Text Search"],
        confidence=94, asked_by="New Dev (Alex)", date="2026-01-10",
    ),
    OnboardingQuery(
        question="Why is the notification system so complex? Can't we just send emails directly?",
        answer="The event-driven architecture decouples notification sending from business logic. If email sending fails, it doesn't block the user's action. Events go to a queue and are processed async. This was critical after a 2023 incident where synchronous email sending caused 30s request timeouts.",
        source_decisions=["Event-Driven Notification Architecture"],
        confidence=91, asked_by="New Dev (Sam)", date="2026-02-01",
    ),
    OnboardingQuery(
        question="Why do reports take so long to generate?",
        answer="Reports are generated server-side using headless Chrome because we need pixel-perfect PDFs and support 100k+ row exports. Client-side generation would expose raw data and crash browsers. Reports are queued to prevent CPU spikes. Decision by Meera Joshi, May 2024.",
        source_decisions=["Server-Side Report Generation"],
        confidence=88, asked_by="New Dev (Sam)", date="2026-02-12",
    ),
    OnboardingQuery(
        question="How does the RBAC system work and why not use attribute-based access?",
        answer="We use hierarchical RBAC (admin > manager > dev > viewer) because it's simpler for our current 25-person team. ABAC adds complexity we don't need yet. The system is designed to migrate to ABAC if we exceed 100 users. Decision by Raj Kumar, Feb 2024.",
        source_decisions=["Role-Based Access Control (RBAC) Model"],
        confidence=93, asked_by="New Dev (Jordan)", date="2026-02-20",
    ),
]

ARCHAEOLOGY_RESULTS: list[ArchaeologyResult] = [
    ArchaeologyResult(
        query="Why is JWT used for auth?",
        answer="Decision by Raj Kumar — Mar 2023. Stateless auth needed for horizontal scaling across 4 app servers. Cookie-based sessions would require a shared session store. JWT tokens are self-verifiable without DB lookups, reducing auth latency by ~40ms.",
        author="Raj Kumar", date="Mar 14, 2023", decision_id="dec-001",
        confidence=96, code_path="src/auth/jwt.ts",
    ),
    ArchaeologyResult(
        query="Why Redis instead of Memcached?",
        answer="Decision by Raj Kumar — Apr 2023. Redis chosen for AOF persistence (survives restarts), native complex data structures for nested session objects, and pub/sub for cache invalidation. Memcached is faster but loses all data on restart.",
        author="Raj Kumar", date="Apr 02, 2023", decision_id="dec-002",
        confidence=94, code_path="src/cache/redis.ts",
    ),
    ArchaeologyResult(
        query="Why Elasticsearch over Algolia?",
        answer="Decision by Raj Kumar — Sep 2023. Cost-driven: 2M+ monthly searches on Algolia would cost $4,200/mo. Self-hosted ES on existing k8s cluster has near-zero marginal cost. Trade-off: ~4h/month maintenance overhead.",
        author="Raj Kumar", date="Sep 05, 2023", decision_id="dec-004",
        confidence=92, code_path="src/search/indexer.ts",
    ),
]

# ── Knowledge Decay Tracker ──

DECAY_ITEMS: list[KnowledgeDecayItem] = [
    KnowledgeDecayItem(
        module_id="auth", module_label="Auth Module", last_validated="2025-12-10",
        days_since_validated=86, decay_score=82, code_changes_since=14,
        owner="Raj Kumar", status="critical",
    ),
    KnowledgeDecayItem(
        module_id="reporting", module_label="Reporting Engine", last_validated="2025-11-05",
        days_since_validated=121, decay_score=95, code_changes_since=22,
        owner="Meera Joshi", status="critical",
    ),
    KnowledgeDecayItem(
        module_id="search", module_label="Search Service", last_validated="2025-10-18",
        days_since_validated=139, decay_score=98, code_changes_since=8,
        owner="Raj Kumar", status="critical",
    ),
    KnowledgeDecayItem(
        module_id="payment", module_label="Payment API", last_validated="2026-01-15",
        days_since_validated=50, decay_score=45, code_changes_since=6,
        owner="Priya Singh", status="aging",
    ),
    KnowledgeDecayItem(
        module_id="notification", module_label="Notifications", last_validated="2026-01-22",
        days_since_validated=43, decay_score=38, code_changes_since=4,
        owner="Anika Patel", status="aging",
    ),
    KnowledgeDecayItem(
        module_id="cache", module_label="Caching Layer", last_validated="2026-01-30",
        days_since_validated=35, decay_score=30, code_changes_since=3,
        owner="Raj Kumar", status="aging",
    ),
    KnowledgeDecayItem(
        module_id="user", module_label="User Service", last_validated="2026-02-28",
        days_since_validated=6, decay_score=5, code_changes_since=1,
        owner="Raj Kumar", status="fresh",
    ),
    KnowledgeDecayItem(
        module_id="ci", module_label="CI/CD Pipeline", last_validated="2026-02-14",
        days_since_validated=20, decay_score=12, code_changes_since=2,
        owner="David Chen", status="fresh",
    ),
]

# ── Interview Session Planner ──

INTERVIEW_SESSIONS: list[InterviewSession] = [
    InterviewSession(
        id="sess-001", senior_dev="Raj Kumar", module="Auth Module",
        status="completed", scheduled_date="2026-02-15",
        topics=["JWT design", "Redis session choice", "RBAC model"],
        decisions_captured=3, coverage_before=40, coverage_after=85,
    ),
    InterviewSession(
        id="sess-002", senior_dev="Raj Kumar", module="Search Service",
        status="overdue", scheduled_date="2026-02-22",
        topics=["Elasticsearch cluster design", "Index strategy", "Query optimization"],
        decisions_captured=0, coverage_before=25, coverage_after=25,
    ),
    InterviewSession(
        id="sess-003", senior_dev="Meera Joshi", module="Reporting Engine",
        status="overdue", scheduled_date="2026-02-20",
        topics=["Report generation architecture", "Queue-based processing", "Template engine"],
        decisions_captured=0, coverage_before=15, coverage_after=15,
    ),
    InterviewSession(
        id="sess-004", senior_dev="Priya Singh", module="Payment API",
        status="scheduled", scheduled_date="2026-03-10",
        topics=["Stripe integration patterns", "Webhook reliability", "Refund flow"],
        decisions_captured=0, coverage_before=55, coverage_after=55,
    ),
    InterviewSession(
        id="sess-005", senior_dev="Anika Patel", module="Notifications",
        status="scheduled", scheduled_date="2026-03-12",
        topics=["Event-driven architecture", "Multi-channel dispatch", "Retry strategy"],
        decisions_captured=0, coverage_before=45, coverage_after=45,
    ),
    InterviewSession(
        id="sess-006", senior_dev="David Chen", module="CI/CD Pipeline",
        status="completed", scheduled_date="2026-02-10",
        topics=["GitHub Actions vs Jenkins", "Deploy strategy", "Environment management"],
        decisions_captured=2, coverage_before=60, coverage_after=90,
    ),
]

# ── Knowledge Transfer Matrix ──

TRANSFER_MATRIX: list[KnowledgeTransferEntry] = [
    KnowledgeTransferEntry(
        from_dev="Raj Kumar", to_dev="Alex (New)", module="Auth Module",
        progress=70, sessions_completed=3, sessions_total=5,
        last_session="2026-02-25", status="in-progress",
    ),
    KnowledgeTransferEntry(
        from_dev="Raj Kumar", to_dev="Sam (New)", module="Search Service",
        progress=15, sessions_completed=1, sessions_total=4,
        last_session="2026-01-18", status="in-progress",
    ),
    KnowledgeTransferEntry(
        from_dev="Raj Kumar", to_dev="Jordan (New)", module="Caching Layer",
        progress=0, sessions_completed=0, sessions_total=3,
        last_session="—", status="not-started",
    ),
    KnowledgeTransferEntry(
        from_dev="Meera Joshi", to_dev="Alex (New)", module="Reporting Engine",
        progress=0, sessions_completed=0, sessions_total=5,
        last_session="—", status="not-started",
    ),
    KnowledgeTransferEntry(
        from_dev="Priya Singh", to_dev="Sam (New)", module="Payment API",
        progress=40, sessions_completed=2, sessions_total=4,
        last_session="2026-02-14", status="in-progress",
    ),
    KnowledgeTransferEntry(
        from_dev="David Chen", to_dev="Jordan (New)", module="CI/CD Pipeline",
        progress=100, sessions_completed=3, sessions_total=3,
        last_session="2026-02-28", status="completed",
    ),
    KnowledgeTransferEntry(
        from_dev="Anika Patel", to_dev="Alex (New)", module="Notifications",
        progress=30, sessions_completed=1, sessions_total=3,
        last_session="2026-02-10", status="in-progress",
    ),
]

# ── Undocumented Decision Detector ──

UNDOCUMENTED_REGIONS: list[UndocumentedRegion] = [
    UndocumentedRegion(
        code_path="src/auth/oauth.ts", complexity_score=87, lines=340,
        last_modified="2025-12-08", modified_by="Raj Kumar",
        reason_suspected="Complex OAuth2 flow with custom token refresh — no decision record for provider choice",
        priority="critical",
    ),
    UndocumentedRegion(
        code_path="src/reports/aggregator.ts", complexity_score=92, lines=520,
        last_modified="2025-11-01", modified_by="Meera Joshi",
        reason_suspected="Multi-stage data aggregation pipeline with custom SQL — no documented reasoning for denormalization strategy",
        priority="critical",
    ),
    UndocumentedRegion(
        code_path="src/payments/refund.ts", complexity_score=74, lines=180,
        last_modified="2026-01-10", modified_by="Priya Singh",
        reason_suspected="Custom retry logic and partial refund handling — business rules not captured",
        priority="high",
    ),
    UndocumentedRegion(
        code_path="src/search/query.ts", complexity_score=78, lines=290,
        last_modified="2025-10-15", modified_by="Raj Kumar",
        reason_suspected="Custom ranking algorithm with boost factors — no documentation on why these weights were chosen",
        priority="high",
    ),
    UndocumentedRegion(
        code_path="src/notifications/sms.ts", complexity_score=55, lines=120,
        last_modified="2026-01-20", modified_by="Anika Patel",
        reason_suspected="SMS provider fallback chain (Twilio → SNS → Vonage) — selection criteria undocumented",
        priority="medium",
    ),
    UndocumentedRegion(
        code_path="src/reports/templates.ts", complexity_score=68, lines=410,
        last_modified="2025-11-03", modified_by="Meera Joshi",
        reason_suspected="Custom template engine instead of Handlebars — no decision record for build vs buy",
        priority="high",
    ),
]

# ── Onboarding Insights ──

ONBOARDING_INSIGHTS: list[OnboardingInsight] = [
    OnboardingInsight(
        question="Why doesn't the auth system use cookies?",
        ask_count=7, avg_confidence=96, has_documented_answer=True,
        gap_module="Auth Module", last_asked="2026-02-28",
    ),
    OnboardingInsight(
        question="Why not use Algolia for search?",
        ask_count=5, avg_confidence=94, has_documented_answer=True,
        gap_module="Search Service", last_asked="2026-02-25",
    ),
    OnboardingInsight(
        question="Why is the report aggregation so complex?",
        ask_count=4, avg_confidence=42, has_documented_answer=False,
        gap_module="Reporting Engine", last_asked="2026-03-01",
    ),
    OnboardingInsight(
        question="Why do we use 3 SMS providers in a fallback chain?",
        ask_count=3, avg_confidence=35, has_documented_answer=False,
        gap_module="Notifications", last_asked="2026-02-20",
    ),
    OnboardingInsight(
        question="Why was the custom template engine built instead of using Handlebars?",
        ask_count=3, avg_confidence=28, has_documented_answer=False,
        gap_module="Reporting Engine", last_asked="2026-02-18",
    ),
    OnboardingInsight(
        question="How does the RBAC system work?",
        ask_count=6, avg_confidence=93, has_documented_answer=True,
        gap_module="User Service", last_asked="2026-03-02",
    ),
    OnboardingInsight(
        question="Why is the OAuth flow so complicated?",
        ask_count=4, avg_confidence=30, has_documented_answer=False,
        gap_module="Auth Module", last_asked="2026-02-27",
    ),
]

# ── Decision Chain Links ──

DECISION_CHAINS: list[DecisionChainLink] = [
    DecisionChainLink(
        from_decision="JWT for Stateless Authentication",
        to_decision="Redis for Session & Cache Storage",
        relationship="led-to", impact_radius=3,
        description="Choosing JWT for auth created need for a separate cache for refresh tokens and rate limiting — Redis was selected for this role.",
    ),
    DecisionChainLink(
        from_decision="Redis for Session & Cache Storage",
        to_decision="Event-Driven Notification Architecture",
        relationship="led-to", impact_radius=2,
        description="Redis pub/sub was already available, enabling event-driven notification dispatch without adding a separate message broker.",
    ),
    DecisionChainLink(
        from_decision="Elasticsearch for Full-Text Search",
        to_decision="Server-Side Report Generation",
        relationship="depends-on", impact_radius=2,
        description="Report data aggregation queries rely on Elasticsearch indices for fast cross-module search during report generation.",
    ),
    DecisionChainLink(
        from_decision="GitHub Actions over Jenkins for CI/CD",
        to_decision="Role-Based Access Control (RBAC) Model",
        relationship="depends-on", impact_radius=1,
        description="CI/CD pipeline uses RBAC roles to determine who can trigger production deployments.",
    ),
    DecisionChainLink(
        from_decision="JWT for Stateless Authentication",
        to_decision="Role-Based Access Control (RBAC) Model",
        relationship="led-to", impact_radius=4,
        description="JWT tokens embed role claims, making RBAC checks a token-decode operation rather than a DB lookup — this shaped the entire auth architecture.",
    ),
    DecisionChainLink(
        from_decision="Stripe over Adyen for Payments",
        to_decision="Event-Driven Notification Architecture",
        relationship="led-to", impact_radius=2,
        description="Stripe webhooks are consumed as events in the notification system — payment confirmation triggers email/SMS via the same event bus.",
    ),
]


# ═══════════════════════════════════════════════════════════════
# ██  CONTEXTUAL EXTRACTION SESSION
# ═══════════════════════════════════════════════════════════════

EXTRACTION_SESSION = ContextualExtractionSession(
    id="exs-001",
    target_dev="@senior.dev",
    commits_analysed=847,
    bus_factor_modules=6,
    trigger_file="payments/core/transaction_engine.py",
    trigger_ownership_pct=89,
    status="active",
    messages=[
        ExtractionSessionMsg(
            role="bot",
            text="You rewrote the retry logic in transaction_engine.py in October — commit a4f2b1. The previous implementation used exponential backoff. You replaced it with a fixed-window approach with tiered priority. What drove that specific change?",
        ),
        ExtractionSessionMsg(
            role="dev",
            text="The exponential backoff was causing thundering herd problems during gateway outages. We'd have 400+ requests all retrying simultaneously after identical backoff periods.",
            decision_logged=True,
        ),
        ExtractionSessionMsg(
            role="bot",
            text="Was jitter-with-exponential evaluated as an alternative?",
        ),
        ExtractionSessionMsg(
            role="dev",
            text="Yes. Jitter solved the thundering herd but introduced unpredictable variance on Tier 1 SLA — we have a hard 200ms p99 requirement that jitter violated during load spikes.",
            decision_logged=True,
        ),
        ExtractionSessionMsg(
            role="bot",
            text="So the tiered priority structure in lines 441–478 was directly derived from that SLA constraint?",
        ),
        ExtractionSessionMsg(
            role="dev",
            text="Exactly. And that constraint needs to be re-evaluated before anyone changes the retry window — it's not obvious from the code alone.",
            constraint_logged=True,
        ),
        ExtractionSessionMsg(
            role="bot",
            text="I've logged that as a Decision Constraint — mandatory re-evaluation trigger on any edit to lines 441–478. One more: line 203 references a 'Stripe webhook race.' What was the incident behind that?",
        ),
        ExtractionSessionMsg(
            role="dev",
            text="In August we had concurrent webhook deliveries that triggered duplicate refunds. The mutex on line 203 was the fix — it uses a Redis distributed lock with a 30-second TTL scoped to the webhook idempotency key.",
            decision_logged=True,
        ),
    ],
    decisions_captured=3,
    constraints_captured=1,
)

# ═══════════════════════════════════════════════════════════════
# ██  DECISION NODES
# ═══════════════════════════════════════════════════════════════

DECISION_NODES: list[DecisionNode] = [
    DecisionNode(
        id="ret-2023-10",
        decision="Fixed-window retry with tiered priority",
        context="Thundering herd at 400+ concurrent requests during payment gateway outages",
        alternatives_rejected=[
            {"name": "Exponential backoff", "reason": "Thundering herd — identical retry windows"},
            {"name": "Jitter + exponential", "reason": "Tier 1 SLA variance — 200ms p99 violated during load spikes"},
        ],
        constraint_type="hard",
        constraint_detail="Tier 1 SLA = 200ms p99. MUST be re-evaluated before any retry window change.",
        constraint_re_eval_trigger="Any edit to lines 441–478 of transaction_engine.py",
        captured_date="Oct 14, 2025",
        source_dev="@senior.dev",
        source_type="interview",
        code_regions=[
            {"file": "payments/core/transaction_engine.py", "lines": "188–278"},
            {"file": "payments/core/transaction_engine.py", "lines": "441–478"},
            {"file": "payments/config/retry_config.py", "lines": "12–34"},
        ],
        status="active",
    ),
    DecisionNode(
        id="wh-2023-08",
        decision="Redis distributed lock for webhook idempotency",
        context="Concurrent Stripe webhook deliveries caused duplicate refunds in August 2023",
        alternatives_rejected=[
            {"name": "Database advisory lock", "reason": "30ms latency unacceptable in webhook path"},
            {"name": "Application-level dedup", "reason": "Race condition window too large with multi-pod deployment"},
        ],
        constraint_type="hard",
        constraint_detail="30-second TTL on distributed lock — changing TTL requires load testing under concurrent webhook storm.",
        constraint_re_eval_trigger="Any edit to webhook mutex logic (line 203+)",
        captured_date="Oct 14, 2025",
        source_dev="@senior.dev",
        source_type="interview",
        code_regions=[
            {"file": "payments/core/transaction_engine.py", "lines": "198–225"},
        ],
        status="active",
    ),
    DecisionNode(
        id="auth-2023-03",
        decision="JWT with 15-minute TTL + refresh token rotation",
        context="Horizontal scaling across 4 app servers required stateless auth — cookie sessions would need shared store",
        alternatives_rejected=[
            {"name": "Cookie sessions + Redis", "reason": "40ms latency per request for session lookup"},
            {"name": "OAuth2 opaque tokens", "reason": "Requires centralized token validation service"},
        ],
        constraint_type="soft",
        constraint_detail="15-minute TTL is a security/UX trade-off. Extending TTL requires security review.",
        constraint_re_eval_trigger="Any change to JWT expiry or refresh token rotation",
        captured_date="Feb 15, 2026",
        source_dev="Raj Kumar",
        source_type="interview",
        code_regions=[
            {"file": "src/auth/jwt.ts", "lines": "1–120"},
            {"file": "src/auth/middleware.ts", "lines": "45–89"},
        ],
        status="active",
    ),
    DecisionNode(
        id="search-2023-09",
        decision="Self-hosted Elasticsearch on existing k8s cluster",
        context="2M+ monthly searches — Algolia per-search pricing ($4,200/mo) vs near-zero marginal cost on existing infra",
        alternatives_rejected=[
            {"name": "Algolia", "reason": "$4,200/mo at current volume — 50x more expensive"},
            {"name": "Typesense", "reason": "Less mature ecosystem, fewer integrations"},
            {"name": "PostgreSQL FTS", "reason": "Poor performance beyond 500K documents"},
        ],
        constraint_type="soft",
        constraint_detail="~4h/month maintenance overhead accepted as trade-off. If volume exceeds 10M searches/mo, revisit managed service.",
        constraint_re_eval_trigger="Search volume crossing 10M/month threshold",
        captured_date="Feb 15, 2026",
        source_dev="Raj Kumar",
        source_type="interview",
        code_regions=[
            {"file": "src/search/indexer.ts", "lines": "1–180"},
            {"file": "src/search/query.ts", "lines": "1–290"},
        ],
        status="active",
    ),
]

# ═══════════════════════════════════════════════════════════════
# ██  CONSTRAINT ALERTS
# ═══════════════════════════════════════════════════════════════

CONSTRAINT_ALERTS: list[ConstraintAlert] = [
    ConstraintAlert(
        id="ca-001",
        decision_node_id="ret-2023-10",
        pr_number=2847,
        pr_author="@junior.dev",
        file_modified="payments/core/transaction_engine.py",
        lines_modified="441–478",
        constraint_violated="Tier 1 SLA = 200ms p99 — any retry window change requires re-evaluation",
        severity="critical",
        auto_comment_posted=True,
        date="2026-03-05",
        resolution="pending",
    ),
    ConstraintAlert(
        id="ca-002",
        decision_node_id="wh-2023-08",
        pr_number=2851,
        pr_author="@mid.dev",
        file_modified="payments/core/transaction_engine.py",
        lines_modified="203–210",
        constraint_violated="Redis distributed lock TTL — changing requires load testing under webhook storm",
        severity="warning",
        auto_comment_posted=True,
        date="2026-03-06",
        resolution="acknowledged",
    ),
    ConstraintAlert(
        id="ca-003",
        decision_node_id="auth-2023-03",
        pr_number=2860,
        pr_author="@junior.dev",
        file_modified="src/auth/jwt.ts",
        lines_modified="85–92",
        constraint_violated="JWT TTL change requires security review — 15-min TTL is security/UX trade-off",
        severity="warning",
        auto_comment_posted=True,
        date="2026-03-07",
        resolution="pending",
    ),
]

# ═══════════════════════════════════════════════════════════════
# ██  KNOWLEDGE DECAY SCORES (KDS)
# ═══════════════════════════════════════════════════════════════

KNOWLEDGE_DECAY_SCORES: list[KnowledgeDecayEntry] = [
    KnowledgeDecayEntry(
        code_region="payments/core/transaction_engine.py",
        primary_holder="@senior.dev",
        ownership_pct=89,
        decision_complexity="high",
        months_since_decision=28,
        months_since_last_touch=7,
        kds_at_decision=100, kds_6mo=82, kds_12mo=61, kds_18mo=44,
        kds_current=31,
        kds_projected_36mo=19,
        critical_threshold_date="Aug 2026",
        months_to_critical=5,
    ),
    KnowledgeDecayEntry(
        code_region="src/auth/jwt.ts + middleware.ts",
        primary_holder="Raj Kumar",
        ownership_pct=92,
        decision_complexity="high",
        months_since_decision=36,
        months_since_last_touch=3,
        kds_at_decision=100, kds_6mo=85, kds_12mo=68, kds_18mo=50,
        kds_current=26,
        kds_projected_36mo=12,
        critical_threshold_date="May 2026",
        months_to_critical=2,
    ),
    KnowledgeDecayEntry(
        code_region="infra/deploy_orchestrator.py",
        primary_holder="@senior.dev",
        ownership_pct=78,
        decision_complexity="high",
        months_since_decision=30,
        months_since_last_touch=9,
        kds_at_decision=100, kds_6mo=80, kds_12mo=58, kds_18mo=41,
        kds_current=29,
        kds_projected_36mo=16,
        critical_threshold_date="Jun 2026",
        months_to_critical=3,
    ),
    KnowledgeDecayEntry(
        code_region="src/payments/stripe.ts + webhook.ts",
        primary_holder="Priya Singh",
        ownership_pct=68,
        decision_complexity="medium",
        months_since_decision=20,
        months_since_last_touch=2,
        kds_at_decision=100, kds_6mo=88, kds_12mo=72, kds_18mo=58,
        kds_current=54,
        kds_projected_36mo=32,
        critical_threshold_date="Feb 2027",
        months_to_critical=11,
    ),
    KnowledgeDecayEntry(
        code_region="src/search/indexer.ts + query.ts",
        primary_holder="Raj Kumar",
        ownership_pct=85,
        decision_complexity="medium",
        months_since_decision=18,
        months_since_last_touch=5,
        kds_at_decision=100, kds_6mo=86, kds_12mo=70, kds_18mo=55,
        kds_current=61,
        kds_projected_36mo=38,
        critical_threshold_date="May 2027",
        months_to_critical=14,
    ),
    KnowledgeDecayEntry(
        code_region="src/reports/generator.ts",
        primary_holder="Meera Joshi",
        ownership_pct=95,
        decision_complexity="high",
        months_since_decision=22,
        months_since_last_touch=12,
        kds_at_decision=100, kds_6mo=78, kds_12mo=55, kds_18mo=36,
        kds_current=24,
        kds_projected_36mo=10,
        critical_threshold_date="Apr 2026",
        months_to_critical=1,
    ),
    KnowledgeDecayEntry(
        code_region="src/users/roles.ts",
        primary_holder="Raj Kumar",
        ownership_pct=45,
        decision_complexity="low",
        months_since_decision=12,
        months_since_last_touch=1,
        kds_at_decision=100, kds_6mo=92, kds_12mo=82, kds_18mo=74,
        kds_current=93,
        kds_projected_36mo=68,
        critical_threshold_date="N/A",
        months_to_critical=99,
    ),
]

# ═══════════════════════════════════════════════════════════════
# ██  KNOWLEDGE ASSET VALUATIONS (KAV)
# ═══════════════════════════════════════════════════════════════

KNOWLEDGE_ASSET_VALUATIONS: list[KnowledgeAssetValuation] = [
    KnowledgeAssetValuation(
        code_region="payments/core/transaction_engine.py",
        module_label="Payment Retry Engine",
        reconstruction_hours=40, hourly_rate=250, reconstruction_cost=10000,
        expected_incidents=2.3, avg_incident_cost=18000, sla_penalty_exposure=12000,
        total_kav=63400,
        current_kds=31,
        recoverable_value=19654,
        already_irrecoverable=43746,
        extraction_cost=625, extraction_hours=2.5,
        extraction_roi=31,
    ),
    KnowledgeAssetValuation(
        code_region="src/auth/jwt.ts + middleware.ts",
        module_label="Auth Token Validator",
        reconstruction_hours=24, hourly_rate=250, reconstruction_cost=6000,
        expected_incidents=3.1, avg_incident_cost=8500, sla_penalty_exposure=8850,
        total_kav=41200,
        current_kds=26,
        recoverable_value=10712,
        already_irrecoverable=30488,
        extraction_cost=500, extraction_hours=2.0,
        extraction_roi=21,
    ),
    KnowledgeAssetValuation(
        code_region="infra/deploy_orchestrator.py",
        module_label="Deploy Orchestrator",
        reconstruction_hours=56, hourly_rate=250, reconstruction_cost=14000,
        expected_incidents=1.8, avg_incident_cost=28000, sla_penalty_exposure=25300,
        total_kav=89700,
        current_kds=29,
        recoverable_value=26013,
        already_irrecoverable=63687,
        extraction_cost=750, extraction_hours=3.0,
        extraction_roi=34,
    ),
    KnowledgeAssetValuation(
        code_region="src/payments/stripe.ts + webhook.ts",
        module_label="Stripe Integration",
        reconstruction_hours=18, hourly_rate=250, reconstruction_cost=4500,
        expected_incidents=1.4, avg_incident_cost=12000, sla_penalty_exposure=7100,
        total_kav=28400,
        current_kds=54,
        recoverable_value=15336,
        already_irrecoverable=13064,
        extraction_cost=375, extraction_hours=1.5,
        extraction_roi=40,
    ),
    KnowledgeAssetValuation(
        code_region="src/search/indexer.ts + query.ts",
        module_label="Search & Ranking",
        reconstruction_hours=14, hourly_rate=250, reconstruction_cost=3500,
        expected_incidents=0.8, avg_incident_cost=6000, sla_penalty_exposure=11500,
        total_kav=19800,
        current_kds=61,
        recoverable_value=12078,
        already_irrecoverable=7722,
        extraction_cost=375, extraction_hours=1.5,
        extraction_roi=32,
    ),
    KnowledgeAssetValuation(
        code_region="src/reports/generator.ts",
        module_label="Report Generator",
        reconstruction_hours=32, hourly_rate=250, reconstruction_cost=8000,
        expected_incidents=1.6, avg_incident_cost=9500, sla_penalty_exposure=6200,
        total_kav=29400,
        current_kds=24,
        recoverable_value=7056,
        already_irrecoverable=22344,
        extraction_cost=500, extraction_hours=2.0,
        extraction_roi=14,
    ),
    KnowledgeAssetValuation(
        code_region="src/users/roles.ts",
        module_label="RBAC System",
        reconstruction_hours=4, hourly_rate=250, reconstruction_cost=1000,
        expected_incidents=0.2, avg_incident_cost=3000, sla_penalty_exposure=500,
        total_kav=2100,
        current_kds=93,
        recoverable_value=1953,
        already_irrecoverable=147,
        extraction_cost=125, extraction_hours=0.5,
        extraction_roi=15,
    ),
]

# ═══════════════════════════════════════════════════════════════
# ██  MORTALITY TIMELINE
# ═══════════════════════════════════════════════════════════════

MORTALITY_TIMELINE = MortalityTimeline(
    org="Platform Engineering",
    quarter="Q1 2026",
    entries=[
        MortalityTimelineEntry(
            priority="urgent", code_region="payments/retry_engine",
            module_label="Payment Retry Engine", kds=31, kav=63400,
            expiry_date="Aug 2026", holder="@senior.dev",
        ),
        MortalityTimelineEntry(
            priority="urgent", code_region="auth/token_validator",
            module_label="Auth Token Validator", kds=26, kav=41200,
            expiry_date="May 2026", holder="Raj Kumar",
        ),
        MortalityTimelineEntry(
            priority="urgent", code_region="infra/deploy_orchestrator",
            module_label="Deploy Orchestrator", kds=29, kav=89700,
            expiry_date="Jun 2026", holder="@senior.dev",
        ),
        MortalityTimelineEntry(
            priority="high", code_region="billing/invoice_calculator",
            module_label="Stripe Integration", kds=54, kav=28400,
            expiry_date="Feb 2027", holder="Priya Singh",
        ),
        MortalityTimelineEntry(
            priority="high", code_region="api/rate_limiter",
            module_label="Search & Ranking", kds=61, kav=19800,
            expiry_date="May 2027", holder="Raj Kumar",
        ),
        MortalityTimelineEntry(
            priority="urgent", code_region="reports/generator",
            module_label="Report Generator", kds=24, kav=29400,
            expiry_date="Apr 2026", holder="Meera Joshi",
        ),
        MortalityTimelineEntry(
            priority="low", code_region="utils/string_formatter",
            module_label="RBAC System", kds=93, kav=2100,
            expiry_date="N/A", holder="Raj Kumar",
        ),
    ],
    total_at_imminent_risk=223700,
    recommended_sessions=4,
    recommended_hours=9.5,
    preservation_roi=93,
    extraction_cost=2375,
)

# ═══════════════════════════════════════════════════════════════
# ██  DEPARTURE EXPOSURE
# ═══════════════════════════════════════════════════════════════

DEPARTURE_EXPOSURE = DepartureExposure(
    dev="@senior.dev",
    signal="LinkedIn profile updated — new headline and skills",
    signal_date="2026-03-03",
    modules_affected=14,
    combined_kav=387000,
    recoverable_with_extraction=184200,
    extraction_sessions=8,
    extraction_hours=16,
    irrecoverable_immediately=163400,
    already_documented=39400,
    action_window_days=14,
    first_critical_expiry="auth/token_validator (May 2026)",
    extraction_cost=4000,
    preservation_roi=46,
)


def get_full_dashboard():
    return {
        "nodes": [n.model_dump() for n in NODES],
        "interview_history": [m.model_dump() for m in INTERVIEW_HISTORY],
        "decisions": [d.model_dump() for d in DECISIONS],
        "risk_score": RISK_SCORE.model_dump(),
        "recent_extractions": [e.model_dump() for e in EXTRACTIONS],
        "onboarding_queries": [q.model_dump() for q in ONBOARDING_QUERIES],
        "archaeology_results": [a.model_dump() for a in ARCHAEOLOGY_RESULTS],
        "decay_items": [d.model_dump() for d in DECAY_ITEMS],
        "interview_sessions": [s.model_dump() for s in INTERVIEW_SESSIONS],
        "transfer_matrix": [t.model_dump() for t in TRANSFER_MATRIX],
        "undocumented_regions": [u.model_dump() for u in UNDOCUMENTED_REGIONS],
        "onboarding_insights": [o.model_dump() for o in ONBOARDING_INSIGHTS],
        "decision_chains": [c.model_dump() for c in DECISION_CHAINS],
        "extraction_session": EXTRACTION_SESSION.model_dump(),
        "decision_nodes": [dn.model_dump() for dn in DECISION_NODES],
        "constraint_alerts": [ca.model_dump() for ca in CONSTRAINT_ALERTS],
        "knowledge_decay_scores": [k.model_dump() for k in KNOWLEDGE_DECAY_SCORES],
        "asset_valuations": [a.model_dump() for a in KNOWLEDGE_ASSET_VALUATIONS],
        "mortality_timeline": MORTALITY_TIMELINE.model_dump(),
        "departure_exposure": DEPARTURE_EXPOSURE.model_dump(),
    }
