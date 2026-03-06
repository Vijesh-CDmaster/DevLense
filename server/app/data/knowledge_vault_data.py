"""Mock data for Knowledge Vault."""

from app.models.knowledge_vault import (
    KnowledgeNode, InterviewMessage, ArchitecturalDecision,
    ArchaeologyResult, KnowledgeRiskScore, ReasoningExtraction,
    OnboardingQuery, KnowledgeDecayItem, InterviewSession,
    KnowledgeTransferEntry, UndocumentedRegion, OnboardingInsight,
    DecisionChainLink,
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


def get_full_dashboard():
    from app.models.knowledge_vault import KnowledgeVaultDashboard
    return KnowledgeVaultDashboard(
        nodes=NODES,
        interview_history=INTERVIEW_HISTORY,
        decisions=DECISIONS,
        risk_score=RISK_SCORE,
        recent_extractions=EXTRACTIONS,
        onboarding_queries=ONBOARDING_QUERIES,
        archaeology_results=ARCHAEOLOGY_RESULTS,
        decay_items=DECAY_ITEMS,
        interview_sessions=INTERVIEW_SESSIONS,
        transfer_matrix=TRANSFER_MATRIX,
        undocumented_regions=UNDOCUMENTED_REGIONS,
        onboarding_insights=ONBOARDING_INSIGHTS,
        decision_chains=DECISION_CHAINS,
    )
