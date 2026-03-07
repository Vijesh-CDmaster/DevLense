from app.models.trust_engine import (
    Suggestion, TaskTypeAccuracy, CalibrationPoint, ConfidenceMeter,
    VerifyAlert, WeeklyReport, WeeklyTrendPoint, TrustEngineDashboard,
    DeveloperTrustProfile, DevTaskTypeAccuracy,
    TrustSignal, ExplainabilityItem, PerSuggestionTrustScore,
    SymbolCheck, BoundaryTest, ArchProbe, SecurityFastPath,
    VTEProtocol, VTEChecklistItem,
    CalibrationBucket, CalibrationGap, TrustCalibrationReport,
)

SUGGESTIONS = [
    Suggestion(
        code="async function getUserById(id: string) { ... }",
        trust=87, task_type="Simple retrieval", complexity="Low",
        rec="Safe to accept", level="green",
        files_affected=1, context_match=94, historical_accuracy=91,
        risk_factors=[],
    ),
    Suggestion(
        code="const authMiddleware = (req, res, next) => { ... }",
        trust=52, task_type="Auth logic", complexity="High",
        rec="Verify carefully", level="amber",
        files_affected=3, context_match=61, historical_accuracy=48,
        risk_factors=["Security-sensitive", "Multi-file dependency", "Auth pattern mismatch"],
    ),
    Suggestion(
        code="class PaymentGateway implements IPayment { ... }",
        trust=31, task_type="Architecture", complexity="Very High",
        rec="Human review required", level="red",
        files_affected=7, context_match=38, historical_accuracy=31,
        risk_factors=["Architecture decision", "Payment flow", "Interface contract", "Cross-service impact", "Low historical accuracy"],
    ),
    Suggestion(
        code="function validateEmail(email: string): boolean { ... }",
        trust=92, task_type="Utility function", complexity="Low",
        rec="Safe to accept", level="green",
        files_affected=1, context_match=97, historical_accuracy=95,
        risk_factors=[],
    ),
    Suggestion(
        code="const dbMigration = { up: async () => { ... } }",
        trust=41, task_type="Database migration", complexity="High",
        rec="Verify carefully", level="amber",
        files_affected=4, context_match=52, historical_accuracy=44,
        risk_factors=["Destructive operation", "Schema change", "Data loss risk"],
    ),
]

TASK_TYPES = [
    TaskTypeAccuracy(type="Simple bug fixes", accuracy=91, total=142, accepted=129, reverted=4),
    TaskTypeAccuracy(type="Unit test generation", accuracy=84, total=98, accepted=82, reverted=7),
    TaskTypeAccuracy(type="Utility functions", accuracy=79, total=67, accepted=53, reverted=5),
    TaskTypeAccuracy(type="Refactoring", accuracy=67, total=84, accepted=56, reverted=12),
    TaskTypeAccuracy(type="New feature code", accuracy=54, total=112, accepted=61, reverted=18),
    TaskTypeAccuracy(type="API integration", accuracy=48, total=73, accepted=35, reverted=14),
    TaskTypeAccuracy(type="Database operations", accuracy=42, total=51, accepted=21, reverted=9),
    TaskTypeAccuracy(type="Architecture decisions", accuracy=31, total=38, accepted=12, reverted=8),
]

CALIBRATION = [
    CalibrationPoint(week="Wk 1", trusted=90, correct=78, overtrust=12),
    CalibrationPoint(week="Wk 2", trusted=85, correct=71, overtrust=14),
    CalibrationPoint(week="Wk 3", trusted=88, correct=69, overtrust=19),
    CalibrationPoint(week="Wk 4", trusted=82, correct=73, overtrust=9),
    CalibrationPoint(week="Wk 5", trusted=79, correct=72, overtrust=7),
]

CONFIDENCE_METERS = [
    ConfidenceMeter(
        id="cm-1",
        suggestion="getUserById(id: string)",
        context_score=94, complexity_penalty=5, history_bonus=12,
        final_confidence=87,
        factors=["Single-file", "CRUD pattern", "Well-tested type"],
    ),
    ConfidenceMeter(
        id="cm-2",
        suggestion="authMiddleware(req, res, next)",
        context_score=61, complexity_penalty=28, history_bonus=8,
        final_confidence=52,
        factors=["Security-critical", "3 files affected", "Auth logic"],
    ),
    ConfidenceMeter(
        id="cm-3",
        suggestion="PaymentGateway implements IPayment",
        context_score=38, complexity_penalty=42, history_bonus=5,
        final_confidence=31,
        factors=["Architecture", "7 files", "Payment domain", "Interface contract"],
    ),
]

VERIFY_ALERTS = [
    VerifyAlert(
        id="va-1",
        code="class PaymentGateway implements IPayment { processPayment(amount: number) { ... } }",
        reason="Architecture-level suggestion with only 31% historical accuracy for this task type. Payment processing requires human validation for PCI compliance. 7 files affected across 3 services.",
        severity="critical", false_positive_rate=8, task_type="Architecture",
        suggested_action="Manually verify interface contract, payment flow logic, and error handling. Cross-reference with existing payment service patterns.",
    ),
    VerifyAlert(
        id="va-2",
        code="const authMiddleware = (req, res, next) => { if (!req.headers.authorization) return res.status(401) }",
        reason="Auth middleware suggestion missing token verification, role-based checks, and rate limiting. Historical accuracy for auth patterns is 48% — previous accepted suggestions required 3 security patches.",
        severity="critical", false_positive_rate=5, task_type="Security",
        suggested_action="Review against OWASP auth checklist. Verify JWT validation, token expiry, and role hierarchy handling before accepting.",
    ),
    VerifyAlert(
        id="va-3",
        code="const dbMigration = { up: async () => { await db.schema.dropColumn('users', 'legacy_id') } }",
        reason="Destructive migration detected: DROP COLUMN operation. AI suggestions for schema changes have 42% accuracy. Column 'legacy_id' is referenced in 4 other queries.",
        severity="high", false_positive_rate=12, task_type="Database migration",
        suggested_action="Run migration in staging first. Verify no downstream queries depend on 'legacy_id'. Create rollback migration before applying.",
    ),
    VerifyAlert(
        id="va-4",
        code="async function batchUpdatePrices(items: Item[]) { items.forEach(i => db.update(i)) }",
        reason="Sequential DB updates in a loop detected — should be a batch operation. AI pattern accuracy for DB operations is 42%. Potential N+1 query and transaction isolation issue.",
        severity="high", false_positive_rate=18, task_type="Database operations",
        suggested_action="Refactor to batch update using db.batchUpdate(). Wrap in transaction for atomicity.",
    ),
    VerifyAlert(
        id="va-5",
        code="export const apiClient = axios.create({ baseURL: config.API_URL, timeout: 30000 })",
        reason="API client missing retry logic, error interceptors, and auth token refresh. This pattern has been flagged in 3 previous code reviews.",
        severity="medium", false_positive_rate=22, task_type="API integration",
        suggested_action="Add request/response interceptors, implement exponential backoff retry, and include auth token refresh logic.",
    ),
]

WEEKLY_REPORT = WeeklyReport(
    total_suggestions=487,
    accepted=168,
    rejected=284,
    reverted=35,
    net_accuracy=72,
    best_task_type="Simple bug fixes (91%)",
    worst_task_type="Architecture decisions (31%)",
    calibration_score=68,
    calibration_label="Moderate",
    trend="improving",
    weekly_trend=[
        WeeklyTrendPoint(week="Wk 1", accuracy=65, acceptance=38),
        WeeklyTrendPoint(week="Wk 2", accuracy=68, acceptance=35),
        WeeklyTrendPoint(week="Wk 3", accuracy=64, acceptance=36),
        WeeklyTrendPoint(week="Wk 4", accuracy=72, acceptance=34),
        WeeklyTrendPoint(week="Wk 5", accuracy=75, acceptance=32),
    ],
)


DEVELOPER_PROFILES = [
    DeveloperTrustProfile(
        name="Sarah Chen",
        overall_trust_score=78,
        calibration_score=82,
        calibration_label="Well-calibrated",
        total_suggestions=142,
        accepted=68,
        reverted=6,
        overtrust_pct=8,
        undertrust_pct=14,
        best_task_type="Unit test generation (94%)",
        worst_task_type="API integration (52%)",
        task_accuracies=[
            DevTaskTypeAccuracy(type="Simple bug fixes", accuracy=93, total=38, accepted=35, reverted=1),
            DevTaskTypeAccuracy(type="Unit test generation", accuracy=94, total=29, accepted=27, reverted=0),
            DevTaskTypeAccuracy(type="Utility functions", accuracy=85, total=18, accepted=15, reverted=1),
            DevTaskTypeAccuracy(type="Refactoring", accuracy=72, total=22, accepted=16, reverted=2),
            DevTaskTypeAccuracy(type="New feature code", accuracy=58, total=19, accepted=11, reverted=1),
            DevTaskTypeAccuracy(type="API integration", accuracy=52, total=10, accepted=5, reverted=1),
            DevTaskTypeAccuracy(type="Database operations", accuracy=48, total=4, accepted=2, reverted=0),
            DevTaskTypeAccuracy(type="Architecture decisions", accuracy=35, total=2, accepted=1, reverted=0),
        ],
        calibration_history=[
            CalibrationPoint(week="Wk 1", trusted=88, correct=82, overtrust=6),
            CalibrationPoint(week="Wk 2", trusted=84, correct=78, overtrust=6),
            CalibrationPoint(week="Wk 3", trusted=86, correct=76, overtrust=10),
            CalibrationPoint(week="Wk 4", trusted=80, correct=74, overtrust=6),
            CalibrationPoint(week="Wk 5", trusted=82, correct=78, overtrust=4),
        ],
        trend="improving",
    ),
    DeveloperTrustProfile(
        name="Marcus Rodriguez",
        overall_trust_score=61,
        calibration_score=54,
        calibration_label="Moderate",
        total_suggestions=198,
        accepted=92,
        reverted=18,
        overtrust_pct=19,
        undertrust_pct=7,
        best_task_type="Simple bug fixes (88%)",
        worst_task_type="Architecture decisions (22%)",
        task_accuracies=[
            DevTaskTypeAccuracy(type="Simple bug fixes", accuracy=88, total=52, accepted=46, reverted=2),
            DevTaskTypeAccuracy(type="Unit test generation", accuracy=78, total=34, accepted=27, reverted=3),
            DevTaskTypeAccuracy(type="Utility functions", accuracy=71, total=24, accepted=17, reverted=2),
            DevTaskTypeAccuracy(type="Refactoring", accuracy=59, total=31, accepted=18, reverted=4),
            DevTaskTypeAccuracy(type="New feature code", accuracy=47, total=28, accepted=13, reverted=4),
            DevTaskTypeAccuracy(type="API integration", accuracy=41, total=15, accepted=6, reverted=2),
            DevTaskTypeAccuracy(type="Database operations", accuracy=33, total=9, accepted=3, reverted=1),
            DevTaskTypeAccuracy(type="Architecture decisions", accuracy=22, total=5, accepted=1, reverted=0),
        ],
        calibration_history=[
            CalibrationPoint(week="Wk 1", trusted=92, correct=72, overtrust=20),
            CalibrationPoint(week="Wk 2", trusted=88, correct=68, overtrust=20),
            CalibrationPoint(week="Wk 3", trusted=90, correct=65, overtrust=25),
            CalibrationPoint(week="Wk 4", trusted=85, correct=70, overtrust=15),
            CalibrationPoint(week="Wk 5", trusted=82, correct=72, overtrust=10),
        ],
        trend="improving",
    ),
    DeveloperTrustProfile(
        name="Priya Patel",
        overall_trust_score=84,
        calibration_score=88,
        calibration_label="Well-calibrated",
        total_suggestions=87,
        accepted=31,
        reverted=2,
        overtrust_pct=5,
        undertrust_pct=22,
        best_task_type="Utility functions (92%)",
        worst_task_type="New feature code (61%)",
        task_accuracies=[
            DevTaskTypeAccuracy(type="Simple bug fixes", accuracy=95, total=22, accepted=21, reverted=0),
            DevTaskTypeAccuracy(type="Unit test generation", accuracy=90, total=18, accepted=16, reverted=1),
            DevTaskTypeAccuracy(type="Utility functions", accuracy=92, total=15, accepted=14, reverted=0),
            DevTaskTypeAccuracy(type="Refactoring", accuracy=78, total=12, accepted=9, reverted=1),
            DevTaskTypeAccuracy(type="New feature code", accuracy=61, total=10, accepted=6, reverted=0),
            DevTaskTypeAccuracy(type="API integration", accuracy=55, total=6, accepted=3, reverted=0),
            DevTaskTypeAccuracy(type="Database operations", accuracy=50, total=3, accepted=2, reverted=0),
            DevTaskTypeAccuracy(type="Architecture decisions", accuracy=40, total=1, accepted=0, reverted=0),
        ],
        calibration_history=[
            CalibrationPoint(week="Wk 1", trusted=72, correct=70, overtrust=2),
            CalibrationPoint(week="Wk 2", trusted=68, correct=65, overtrust=3),
            CalibrationPoint(week="Wk 3", trusted=70, correct=64, overtrust=6),
            CalibrationPoint(week="Wk 4", trusted=65, correct=62, overtrust=3),
            CalibrationPoint(week="Wk 5", trusted=74, correct=72, overtrust=2),
        ],
        trend="stable",
    ),
    DeveloperTrustProfile(
        name="Jake Morrison",
        overall_trust_score=45,
        calibration_score=38,
        calibration_label="Poor",
        total_suggestions=231,
        accepted=142,
        reverted=34,
        overtrust_pct=28,
        undertrust_pct=3,
        best_task_type="Simple bug fixes (82%)",
        worst_task_type="Architecture decisions (18%)",
        task_accuracies=[
            DevTaskTypeAccuracy(type="Simple bug fixes", accuracy=82, total=64, accepted=52, reverted=5),
            DevTaskTypeAccuracy(type="Unit test generation", accuracy=72, total=42, accepted=30, reverted=6),
            DevTaskTypeAccuracy(type="Utility functions", accuracy=65, total=30, accepted=20, reverted=4),
            DevTaskTypeAccuracy(type="Refactoring", accuracy=48, total=35, accepted=17, reverted=7),
            DevTaskTypeAccuracy(type="New feature code", accuracy=38, total=32, accepted=12, reverted=6),
            DevTaskTypeAccuracy(type="API integration", accuracy=30, total=14, accepted=4, reverted=3),
            DevTaskTypeAccuracy(type="Database operations", accuracy=25, total=8, accepted=2, reverted=2),
            DevTaskTypeAccuracy(type="Architecture decisions", accuracy=18, total=6, accepted=1, reverted=1),
        ],
        calibration_history=[
            CalibrationPoint(week="Wk 1", trusted=95, correct=62, overtrust=33),
            CalibrationPoint(week="Wk 2", trusted=92, correct=58, overtrust=34),
            CalibrationPoint(week="Wk 3", trusted=94, correct=55, overtrust=39),
            CalibrationPoint(week="Wk 4", trusted=90, correct=60, overtrust=30),
            CalibrationPoint(week="Wk 5", trusted=88, correct=64, overtrust=24),
        ],
        trend="declining",
    ),
]


def get_full_dashboard() -> dict:
    return {
        "suggestions": SUGGESTIONS,
        "task_types": TASK_TYPES,
        "calibration": CALIBRATION,
        "confidence_meters": CONFIDENCE_METERS,
        "verify_alerts": VERIFY_ALERTS,
        "weekly_report": WEEKLY_REPORT,
        "developer_profiles": DEVELOPER_PROFILES,
        "per_suggestion_scores": PER_SUGGESTION_SCORES,
        "vte_protocols": VTE_PROTOCOLS,
        "calibration_report": CALIBRATION_REPORT,
    }


# ══════════════════════════════════════════════════════════════════
# 9-Signal Per-Suggestion Trust Scorer — Explainability Panels
# ══════════════════════════════════════════════════════════════════

PER_SUGGESTION_SCORES: list[PerSuggestionTrustScore] = [
    PerSuggestionTrustScore(
        suggestion_id="PST-001",
        code_snippet="async function refreshAuthToken(userId: string) {\n  const token = await db.query(`SELECT * FROM tokens WHERE user_id=${userId}`);\n  if (token) return jwt.sign({ id: userId }, SECRET);\n}",
        trust_score=31,
        level="red",
        recommendation="VERIFY BEFORE ACCEPTING",
        signals=[
            TrustSignal(signal="Task complexity index", value="High (CC=14, 4 files)", weight=0.15, score_contribution=18.5, detail="Cyclomatic complexity 14 across 4 referenced files — multi-file, high-complexity context"),
            TrustSignal(signal="Repository context completeness", value="48% (2/4 files in context)", weight=0.15, score_contribution=16.2, detail="2 of 4 referenced symbols are outside the current context window — high hallucination risk"),
            TrustSignal(signal="Language-specific accuracy baseline", value="TypeScript: 62% survival", weight=0.10, score_contribution=5.8, detail="TypeScript AI suggestions have 62% 14-day survival rate in this codebase"),
            TrustSignal(signal="AI origin probability", value="94% AI-generated", weight=0.10, score_contribution=9.4, detail="Pattern classifier identifies 94% AI origin → 2.3× baseline churn probability"),
            TrustSignal(signal="Historical accuracy for task type", value="Auth logic: 28% survival", weight=0.15, score_contribution=19.2, detail="Auth logic suggestions in this repo have only 28% 14-day survival rate"),
            TrustSignal(signal="Security pattern presence", value="SQL injection (A03)", weight=0.15, score_contribution=22.5, detail="Unparameterized SQL query on line 2 matches OWASP A03 injection profile — mandatory verify"),
            TrustSignal(signal="Suggestion scope delta", value="+47 lines, 2 new imports", weight=0.08, score_contribution=6.1, detail="Large scope: 47 lines introduced, 2 cross-module imports added — fragility spike"),
            TrustSignal(signal="Time-of-day cognitive load", value="11:42 PM (non-working)", weight=0.05, score_contribution=3.8, detail="Non-working hours: acceptance rates spike during late hours when scrutiny drops"),
            TrustSignal(signal="Codebase familiarity", value="Low (22% pattern match)", weight=0.07, score_contribution=5.5, detail="Only 22% of patterns in this suggestion match established repo conventions"),
        ],
        why_low=[
            ExplainabilityItem(category="why_low", text="Multi-file scope (4 files referenced, 2 outside context) — high hallucination risk when context window is incomplete", severity="critical"),
            ExplainabilityItem(category="why_low", text="Auth logic task type: 28% 14-day survival rate in this repo", severity="high"),
            ExplainabilityItem(category="why_low", text="SQL query pattern: matches OWASP A03 injection profile", severity="critical"),
            ExplainabilityItem(category="why_low", text="94% AI-origin probability → 2.3× baseline churn rate", severity="high"),
        ],
        what_to_check=[
            ExplainabilityItem(category="what_to_check", text="Verify auth/token_utils.py:validate_scope() still exists — referenced but not in context", severity="high"),
            ExplainabilityItem(category="what_to_check", text="Cross-check token expiry handling — common AI omission in auth flows", severity="high"),
            ExplainabilityItem(category="what_to_check", text="Parameterize the SQL query before committing: use db.query('SELECT * FROM tokens WHERE user_id=$1', [userId])", severity="critical"),
        ],
        personal_accuracy=29.0,
        team_accuracy=34.0,
        task_type="Auth logic",
        developer="Marcus Rodriguez",
        timestamp="2026-03-06T23:42:18Z",
    ),
    PerSuggestionTrustScore(
        suggestion_id="PST-002",
        code_snippet="function validateEmail(email: string): boolean {\n  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/.test(email);\n}",
        trust_score=91,
        level="green",
        recommendation="Safe to accept",
        signals=[
            TrustSignal(signal="Task complexity index", value="Low (CC=2, 1 file)", weight=0.15, score_contribution=1.2, detail="Single function, low cyclomatic complexity — minimal risk"),
            TrustSignal(signal="Repository context completeness", value="100% (all symbols in context)", weight=0.15, score_contribution=0.0, detail="All referenced symbols exist in the current context window"),
            TrustSignal(signal="Language-specific accuracy baseline", value="TypeScript: 62% survival", weight=0.10, score_contribution=3.8, detail="TypeScript baseline — but utility functions far exceed average"),
            TrustSignal(signal="AI origin probability", value="78% AI-generated", weight=0.10, score_contribution=2.2, detail="Standard utility pattern — even at 78% AI origin, churn risk is low"),
            TrustSignal(signal="Historical accuracy for task type", value="Utility: 92% survival", weight=0.15, score_contribution=1.2, detail="Utility function suggestions have 92% 14-day survival rate"),
            TrustSignal(signal="Security pattern presence", value="None detected", weight=0.15, score_contribution=0.0, detail="No OWASP patterns detected in this suggestion"),
            TrustSignal(signal="Suggestion scope delta", value="+3 lines, 0 imports", weight=0.08, score_contribution=0.4, detail="Minimal scope: 3 lines, no new dependencies introduced"),
            TrustSignal(signal="Time-of-day cognitive load", value="2:15 PM (working hours)", weight=0.05, score_contribution=0.0, detail="Standard working hours — normal scrutiny context"),
            TrustSignal(signal="Codebase familiarity", value="High (89% pattern match)", weight=0.07, score_contribution=0.8, detail="89% of patterns match established repo conventions — low hallucination risk"),
        ],
        why_low=[],
        what_to_check=[
            ExplainabilityItem(category="what_to_check", text="Regex is standard RFC 5322 approximation — consider edge cases with plus-addressing if relevant", severity="info"),
        ],
        personal_accuracy=94.0,
        team_accuracy=92.0,
        task_type="Utility function",
        developer="Sarah Chen",
        timestamp="2026-03-07T14:15:33Z",
    ),
    PerSuggestionTrustScore(
        suggestion_id="PST-003",
        code_snippet="class PaymentProcessor {\n  async processRefund(orderId: string, amount: number) {\n    const order = await this.orderRepo.findById(orderId);\n    await this.gateway.refund(order.transactionId, amount);\n    await this.notifyService.sendRefundEmail(order.userId);\n  }\n}",
        trust_score=38,
        level="red",
        recommendation="Human review required",
        signals=[
            TrustSignal(signal="Task complexity index", value="Very High (CC=8, 6 files)", weight=0.15, score_contribution=15.8, detail="Cross-service orchestration touching 6 files across 3 services"),
            TrustSignal(signal="Repository context completeness", value="33% (2/6 files in context)", weight=0.15, score_contribution=18.1, detail="Only 2 of 6 referenced files are in context — 4 external symbols unverified"),
            TrustSignal(signal="Language-specific accuracy baseline", value="TypeScript: 62% survival", weight=0.10, score_contribution=3.8, detail="TypeScript baseline applies"),
            TrustSignal(signal="AI origin probability", value="88% AI-generated", weight=0.10, score_contribution=8.8, detail="High AI probability on cross-service code → elevated refactor risk"),
            TrustSignal(signal="Historical accuracy for task type", value="Architecture: 31% survival", weight=0.15, score_contribution=18.5, detail="Architecture-level suggestions have only 31% 14-day survival rate"),
            TrustSignal(signal="Security pattern presence", value="Payment flow (PCI scope)", weight=0.15, score_contribution=12.0, detail="Payment processing pattern detected — PCI compliance requires human validation"),
            TrustSignal(signal="Suggestion scope delta", value="+28 lines, 3 new imports", weight=0.08, score_contribution=5.4, detail="3 new cross-service imports introduced — coupling risk"),
            TrustSignal(signal="Time-of-day cognitive load", value="5:48 PM (end of day)", weight=0.05, score_contribution=2.1, detail="End-of-day context — slightly elevated acceptance risk"),
            TrustSignal(signal="Codebase familiarity", value="Low (34% pattern match)", weight=0.07, score_contribution=4.6, detail="Only 34% pattern match with established repo conventions"),
        ],
        why_low=[
            ExplainabilityItem(category="why_low", text="Cross-service orchestration: 6 files across 3 services, only 2 in context", severity="critical"),
            ExplainabilityItem(category="why_low", text="Architecture-level task: only 31% 14-day survival rate for this category", severity="high"),
            ExplainabilityItem(category="why_low", text="Payment processing flow requires PCI compliance validation", severity="critical"),
            ExplainabilityItem(category="why_low", text="4 external symbols unverified — high hallucination risk", severity="high"),
        ],
        what_to_check=[
            ExplainabilityItem(category="what_to_check", text="Verify orderRepo.findById() exists and returns transactionId field", severity="high"),
            ExplainabilityItem(category="what_to_check", text="Confirm gateway.refund() signature matches payment provider SDK", severity="critical"),
            ExplainabilityItem(category="what_to_check", text="Check refund amount validation — no guard against negative or exceeding original", severity="critical"),
            ExplainabilityItem(category="what_to_check", text="Verify notifyService.sendRefundEmail exists in notification service", severity="high"),
        ],
        personal_accuracy=22.0,
        team_accuracy=31.0,
        task_type="Architecture",
        developer="Jake Morrison",
        timestamp="2026-03-07T17:48:22Z",
    ),
    PerSuggestionTrustScore(
        suggestion_id="PST-004",
        code_snippet="const rateLimiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  handler: (req, res) => res.status(429).json({ error: 'Too many requests' })\n});",
        trust_score=72,
        level="green",
        recommendation="Safe to accept",
        signals=[
            TrustSignal(signal="Task complexity index", value="Medium (CC=4, 2 files)", weight=0.15, score_contribution=5.2, detail="Middleware configuration — moderate complexity, 2 files"),
            TrustSignal(signal="Repository context completeness", value="85% (all key symbols present)", weight=0.15, score_contribution=2.3, detail="Rate limit lib and handler pattern both in context"),
            TrustSignal(signal="Language-specific accuracy baseline", value="TypeScript: 62% survival", weight=0.10, score_contribution=3.8, detail="TypeScript baseline applies"),
            TrustSignal(signal="AI origin probability", value="71% AI-generated", weight=0.10, score_contribution=2.9, detail="Common middleware pattern — lower churn risk despite AI origin"),
            TrustSignal(signal="Historical accuracy for task type", value="API integration: 48% survival", weight=0.15, score_contribution=10.2, detail="API integration suggestions have moderate 48% survival rate"),
            TrustSignal(signal="Security pattern presence", value="Rate limit (positive pattern)", weight=0.15, score_contribution=-2.0, detail="Rate limiting is a positive security pattern — trust bonus applied"),
            TrustSignal(signal="Suggestion scope delta", value="+6 lines, 1 import", weight=0.08, score_contribution=1.6, detail="Small scope: 6 lines, 1 import — low fragility"),
            TrustSignal(signal="Time-of-day cognitive load", value="10:22 AM (working hours)", weight=0.05, score_contribution=0.0, detail="Standard working hours"),
            TrustSignal(signal="Codebase familiarity", value="Moderate (61% match)", weight=0.07, score_contribution=2.7, detail="61% pattern match — reasonable familiarity"),
        ],
        why_low=[],
        what_to_check=[
            ExplainabilityItem(category="what_to_check", text="Verify rate limit values match your API's documented rate limits", severity="medium"),
            ExplainabilityItem(category="what_to_check", text="Consider adding IP-based vs user-based distinction if not already handled", severity="info"),
        ],
        personal_accuracy=55.0,
        team_accuracy=48.0,
        task_type="API integration",
        developer="Priya Patel",
        timestamp="2026-03-07T10:22:41Z",
    ),
]


# ══════════════════════════════════════════════════════════════════
# Verification Tax Eliminator (VTE) — Protocols
# ══════════════════════════════════════════════════════════════════

VTE_PROTOCOLS: list[VTEProtocol] = [
    VTEProtocol(
        suggestion_id="PST-001",
        trust_score=31,
        estimated_seconds=54,
        symbol_checks=[
            SymbolCheck(symbol="auth.utils.validate_token_scope()", location="referenced on line 23, not in context", status="not_in_context"),
            SymbolCheck(symbol="payments.models.Transaction.STATUS_PENDING", location="referenced on line 31, not in context", status="not_in_context"),
            SymbolCheck(symbol="config.RATE_LIMIT_AUTH_SECONDS", location="referenced on line 44, not in context", status="not_in_context"),
        ],
        boundary_tests=[
            BoundaryTest(input_desc="token = None", target_line="tests null handling on line 19", rationale="Common AI omission: null token not handled"),
            BoundaryTest(input_desc='token = ""', target_line="tests empty string path on line 19", rationale="Empty string bypasses many validation checks in AI-generated code"),
            BoundaryTest(input_desc="token with expired exp claim", target_line="tests expiry logic on line 34", rationale="AI-generated JWT handling frequently omits expiry validation"),
            BoundaryTest(input_desc="token signed with wrong key", target_line="tests signature validation on line 41", rationale="Signature verification is the most commonly hallucinated step"),
        ],
        arch_probes=[
            ArchProbe(check="Does UserToken.refresh() on line 28 match the existing interface in auth/interfaces.py:TokenInterface?", target="auth/interfaces.py", risk="new_signature"),
            ArchProbe(check="Does the new auth_session table reference on line 35 match current migration state?", target="db/migrations/0047_auth_session.py", risk="migration_mismatch"),
            ArchProbe(check="Is the new dependency on jwt_extended (line 3) already in requirements.txt?", target="requirements.txt", risk="new_dependency"),
        ],
        security_fast_paths=[
            SecurityFastPath(
                owasp_id="A03:2021",
                risk_label="SQL Injection",
                lines="2",
                current_code='db.query(`SELECT * FROM tokens WHERE user_id=${userId}`)',
                required_fix="db.query('SELECT * FROM tokens WHERE user_id=$1', [userId])",
                severity="critical",
            ),
        ],
        sections_order=["CRITICAL", "HIGH", "MEDIUM", "MEDIUM"],
    ),
    VTEProtocol(
        suggestion_id="PST-003",
        trust_score=38,
        estimated_seconds=62,
        symbol_checks=[
            SymbolCheck(symbol="this.orderRepo.findById()", location="referenced on line 3", status="not_in_context"),
            SymbolCheck(symbol="order.transactionId", location="field access on line 4", status="not_in_context"),
            SymbolCheck(symbol="this.gateway.refund()", location="referenced on line 4", status="not_in_context"),
            SymbolCheck(symbol="this.notifyService.sendRefundEmail()", location="referenced on line 5", status="not_in_context"),
        ],
        boundary_tests=[
            BoundaryTest(input_desc="orderId = non-existent ID", target_line="tests null order on line 3", rationale="No null check after findById — will throw on .transactionId access"),
            BoundaryTest(input_desc="amount > order.total", target_line="tests refund exceeds original on line 4", rationale="No validation that refund amount ≤ original transaction amount"),
            BoundaryTest(input_desc="amount = 0 or negative", target_line="tests zero/negative refund on line 4", rationale="Gateway may reject or produce undefined behavior with invalid amounts"),
            BoundaryTest(input_desc="gateway.refund() throws", target_line="tests error handling on line 4", rationale="No try/catch — email notification will be skipped if refund fails"),
        ],
        arch_probes=[
            ArchProbe(check="Does orderRepo.findById() return a transactionId field?", target="src/repos/order.repository.ts", risk="new_signature"),
            ArchProbe(check="Does gateway.refund() signature match payment provider SDK?", target="src/services/payment-gateway.ts", risk="new_signature"),
            ArchProbe(check="Does notifyService.sendRefundEmail() exist in notification service?", target="src/services/notification.service.ts", risk="new_dependency"),
        ],
        security_fast_paths=[
            SecurityFastPath(
                owasp_id="A04:2021",
                risk_label="Insecure Design — missing validation",
                lines="3-5",
                current_code="No amount validation, no error handling, no idempotency",
                required_fix="Add amount ≤ order.total check, wrap in try/catch, add idempotency key",
                severity="high",
            ),
        ],
        sections_order=["HIGH", "HIGH", "MEDIUM", "HIGH"],
    ),
    VTEProtocol(
        suggestion_id="PST-002",
        trust_score=91,
        estimated_seconds=8,
        symbol_checks=[],
        boundary_tests=[
            BoundaryTest(input_desc='email = ""', target_line="tests empty string", rationale="Quick sanity check"),
            BoundaryTest(input_desc="email = 'user+tag@domain.co.uk'", target_line="tests plus-addressing", rationale="Plus-addressing support varies by business need"),
        ],
        arch_probes=[],
        security_fast_paths=[],
        sections_order=["SKIPPED", "MEDIUM", "SKIPPED", "SKIPPED"],
    ),
    VTEProtocol(
        suggestion_id="PST-004",
        trust_score=72,
        estimated_seconds=18,
        symbol_checks=[
            SymbolCheck(symbol="rateLimit", location="imported on line 1", status="verified"),
        ],
        boundary_tests=[
            BoundaryTest(input_desc="101st request in window", target_line="tests rate limit trigger", rationale="Verify 429 response format matches API contract"),
            BoundaryTest(input_desc="Request after window reset", target_line="tests window expiry", rationale="Confirm counter resets properly"),
        ],
        arch_probes=[
            ArchProbe(check="Is express-rate-limit already in package.json?", target="package.json", risk="new_dependency"),
        ],
        security_fast_paths=[],
        sections_order=["SKIPPED", "MEDIUM", "MEDIUM", "SKIPPED"],
    ),
]


# ══════════════════════════════════════════════════════════════════
# Trust Calibration Report
# ══════════════════════════════════════════════════════════════════

CALIBRATION_REPORT = TrustCalibrationReport(
    team="Platform Engineering",
    week_label="Week of Mar 3",
    suggestions_displayed=847,
    protocols_run=312,
    protocol_run_pct=36.8,
    avg_verification_sec=48,
    unstructured_avg_min=31,
    verification_tax_saved_hrs=149.0,
    buckets=[
        CalibrationBucket(label="Correctly accepted", pct=61, status="green", description="High-score suggestions accepted, no issues found post-commit"),
        CalibrationBucket(label="Correctly rejected", pct=24, status="green", description="Low-score suggestions rejected, verification confirmed issues"),
        CalibrationBucket(label="Over-rejected", pct=11, status="amber", description="Low-score suggestions rejected, but VTE verification would have passed — waste"),
        CalibrationBucket(label="Over-accepted", pct=4, status="red", description="High-score suggestions accepted, but issues found post-commit — risk"),
    ],
    team_calibration_score=73,
    primary_gap=CalibrationGap(
        task_type="Auth logic",
        gap_type="over-rejection",
        rate=18.0,
        recommendation="Run trust calibration session for auth tasks — team is rejecting 18% of suggestions that would have passed VTE verification",
    ),
    secondary_gaps=[
        CalibrationGap(
            task_type="Database operations",
            gap_type="over-acceptance",
            rate=12.0,
            recommendation="Increase verification threshold for DB operations — 12% of accepted DB suggestions caused issues",
        ),
        CalibrationGap(
            task_type="API integration",
            gap_type="over-rejection",
            rate=9.0,
            recommendation="API integration over-rejection at 9% — consider lowering trust threshold from 50 to 45 for this category",
        ),
    ],
)
