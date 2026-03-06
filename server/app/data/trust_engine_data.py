from app.models.trust_engine import (
    Suggestion, TaskTypeAccuracy, CalibrationPoint, ConfidenceMeter,
    VerifyAlert, WeeklyReport, WeeklyTrendPoint, TrustEngineDashboard,
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


def get_full_dashboard() -> TrustEngineDashboard:
    return TrustEngineDashboard(
        suggestions=SUGGESTIONS,
        task_types=TASK_TYPES,
        calibration=CALIBRATION,
        confidence_meters=CONFIDENCE_METERS,
        verify_alerts=VERIFY_ALERTS,
        weekly_report=WEEKLY_REPORT,
    )
