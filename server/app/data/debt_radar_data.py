"""Mock data for Debt Radar — mirrors frontend arrays exactly."""

from app.models.debt_radar import (
    DebtModule, SprintDebt, RefactorItem,
    StagedFile, SurvivalPrediction, BudgetTracker,
    DebtSignal, SecurityFinding, PreCommitBlock, PreCommitScan,
    SprintDebtProjection,
    CouplingPair, ModuleCouplingDrift,
    ServiceBoundaryViolation,
    MonocultureInstance, GenerativeMonoculture,
    AHSComponent, ArchitecturalHealthScore,
)

# ── Codebase Debt Heatmap ──

_modules: list[DebtModule] = [
    DebtModule(name="auth/", risk=100, level="red", label="CRITICAL"),
    DebtModule(name="payments/", risk=68, level="amber", label="ELEVATED"),
    DebtModule(name="api/routes", risk=55, level="amber", label="MODERATE"),
    DebtModule(name="user/", risk=28, level="green", label="LOW"),
    DebtModule(name="notifications/", risk=45, level="amber", label="MODERATE"),
    DebtModule(name="reporting/", risk=85, level="red", label="HIGH"),
]

# ── AI Debt Accumulation Timeline (with budget ceiling overlay) ──

_sprint_debt: list[SprintDebt] = [
    SprintDebt(sprint="Sprint 1", debt=120, budget=800),
    SprintDebt(sprint="Sprint 2", debt=340, budget=1000),
    SprintDebt(sprint="Sprint 3", debt=570, budget=1200),
    SprintDebt(sprint="Sprint 4", debt=890, budget=1400),
    SprintDebt(sprint="Sprint 5", debt=1240, budget=1600),
]

# ── Refactor Recommendation Engine ──

_refactor_queue: list[RefactorItem] = [
    RefactorItem(
        file="auth/jwt.js", line=234,
        reason="Repeated patterns, 82% revert probability — AI duplicated existing token refresh logic",
        urgency="red", effort_hrs=4.5, debt_reduction=180, ai_pct=88,
    ),
    RefactorItem(
        file="auth/session.ts", line=89,
        reason="AI-generated logic not integrated with existing auth flow — session state conflicts",
        urgency="red", effort_hrs=3.0, debt_reduction=150, ai_pct=92,
    ),
    RefactorItem(
        file="reporting/export.ts", line=45,
        reason="AI function fails on datasets >10K rows — memory leak in stream handling",
        urgency="red", effort_hrs=5.0, debt_reduction=200, ai_pct=95,
    ),
    RefactorItem(
        file="api/routes.js", line=156,
        reason="Copy-pasted error handling from AI — no centralised error middleware used",
        urgency="amber", effort_hrs=2.0, debt_reduction=80, ai_pct=72,
    ),
    RefactorItem(
        file="payments/gateway.ts", line=67,
        reason="AI suggestions for business logic — needs expert review, edge cases missed",
        urgency="amber", effort_hrs=3.5, debt_reduction=120, ai_pct=68,
    ),
    RefactorItem(
        file="notifications/retry.ts", line=112,
        reason="AI exponential backoff lacks jitter — thundering herd risk in production",
        urgency="amber", effort_hrs=1.5, debt_reduction=60, ai_pct=85,
    ),
]

# ── Pre-commit AI Debt Scorer ──

_staged_files: list[StagedFile] = [
    StagedFile(
        file="auth/oauth2.ts", ai_pct=91, churn_risk=88,
        pattern_issues=5, debt_score=245, verdict="block",
    ),
    StagedFile(
        file="payments/stripe-webhook.ts", ai_pct=84, churn_risk=72,
        pattern_issues=3, debt_score=185, verdict="block",
    ),
    StagedFile(
        file="api/middleware.ts", ai_pct=67, churn_risk=55,
        pattern_issues=2, debt_score=120, verdict="warn",
    ),
    StagedFile(
        file="user/preferences.ts", ai_pct=45, churn_risk=28,
        pattern_issues=1, debt_score=55, verdict="pass",
    ),
    StagedFile(
        file="notifications/email.ts", ai_pct=78, churn_risk=65,
        pattern_issues=4, debt_score=165, verdict="warn",
    ),
]

# ── 14-Day Survival Predictor ──

_survival_predictions: list[SurvivalPrediction] = [
    SurvivalPrediction(
        file="auth/jwt.ts", block="refreshAccessToken()", lines="230-298",
        ai_pct=88, survival_prob=22,
        risk_factors=["High churn history", "Pattern duplication", "No test coverage"],
        predicted_lifespan_days=4,
    ),
    SurvivalPrediction(
        file="reporting/export.ts", block="generateCSVStream()", lines="40-120",
        ai_pct=95, survival_prob=18,
        risk_factors=["Memory leak detected", "No pagination", "Fails >10K rows"],
        predicted_lifespan_days=3,
    ),
    SurvivalPrediction(
        file="payments/webhook.ts", block="validateWebhookSignature()", lines="55-92",
        ai_pct=92, survival_prob=35,
        risk_factors=["Missing idempotency check", "Copy-paste pattern"],
        predicted_lifespan_days=7,
    ),
    SurvivalPrediction(
        file="api/routes.js", block="errorHandler()", lines="150-180",
        ai_pct=72, survival_prob=58,
        risk_factors=["Not using centralised middleware", "Inconsistent format"],
        predicted_lifespan_days=11,
    ),
    SurvivalPrediction(
        file="user/profile.ts", block="updateProfile()", lines="30-65",
        ai_pct=55, survival_prob=78,
        risk_factors=["Minor style issues"],
        predicted_lifespan_days=20,
    ),
    SurvivalPrediction(
        file="notifications/retry.ts", block="retryWithBackoff()", lines="100-140",
        ai_pct=85, survival_prob=42,
        risk_factors=["No jitter", "Thundering herd risk", "Hardcoded delays"],
        predicted_lifespan_days=8,
    ),
]

# ── Tech Debt Budget Tracker ──

_budget_tracker = BudgetTracker(
    ceiling=2000,
    current=1240,
    sprint_added=420,
    sprint_resolved=70,
    trend="rising",
    alert_threshold=80,
    weeks_to_breach=3,
)


# ═══════════════════════════════════════════════════════════════════
# ██  ENHANCED PRE-COMMIT DEBT SCORER (8-Signal per-block)
# ═══════════════════════════════════════════════════════════════════

PRE_COMMIT_SCANS: list[PreCommitScan] = [
    PreCommitScan(
        developer="Raj Patel",
        branch="feature/payment-flow",
        file="src/payments/transaction_handler.py",
        blocks=[
            PreCommitBlock(
                block_id="Block A", lines="12–29", survival_pct=94,
                risk_level="LOW", verdict="✅ Commit",
                signals=[
                    DebtSignal(signal="Duplicate line block ratio", value=0.02, weight=0.15, score_contribution=0.3, detail="No significant duplication detected"),
                    DebtSignal(signal="Cyclomatic complexity delta", value=1.2, weight=0.15, score_contribution=1.8, detail="Minimal complexity increase"),
                    DebtSignal(signal="DRY violation score", value=0.05, weight=0.15, score_contribution=0.8, detail="No semantic duplicates found"),
                    DebtSignal(signal="Cross-module dependency", value=0.0, weight=0.10, score_contribution=0.0, detail="No new imports added"),
                    DebtSignal(signal="AI origin probability", value=0.34, weight=0.15, score_contribution=5.1, detail="Low AI signature — likely human-written"),
                    DebtSignal(signal="File ownership age", value=14.0, weight=0.10, score_contribution=1.4, detail="Recently maintained file"),
                    DebtSignal(signal="Commit-code alignment", value=0.92, weight=0.10, score_contribution=0.8, detail="Commit message accurately describes changes"),
                    DebtSignal(signal="Security pattern classifier", value=0.0, weight=0.10, score_contribution=0.0, detail="No OWASP patterns detected"),
                ],
                security_findings=[],
            ),
            PreCommitBlock(
                block_id="Block B", lines="32–61", survival_pct=31,
                risk_level="HIGH", verdict="⚠️ Review",
                signals=[
                    DebtSignal(signal="Duplicate line block ratio", value=0.18, weight=0.15, score_contribution=2.7, detail="3 duplicated blocks of 5+ lines"),
                    DebtSignal(signal="Cyclomatic complexity delta", value=8.4, weight=0.15, score_contribution=12.6, detail="High nested branching introduced"),
                    DebtSignal(signal="DRY violation score", value=0.89, weight=0.15, score_contribution=13.4, detail="89% similarity to utils/payment_helpers.py:validate_transaction"),
                    DebtSignal(signal="Cross-module dependency", value=2.0, weight=0.10, score_contribution=2.0, detail="2 new cross-module imports added"),
                    DebtSignal(signal="AI origin probability", value=0.87, weight=0.15, score_contribution=13.1, detail="High AI signature — code-gen patterns detected"),
                    DebtSignal(signal="File ownership age", value=142.0, weight=0.10, score_contribution=14.2, detail="Legacy file not touched in 142 days"),
                    DebtSignal(signal="Commit-code alignment", value=0.41, weight=0.10, score_contribution=5.9, detail="Vague commit message — 'fix payment flow'"),
                    DebtSignal(signal="Security pattern classifier", value=0.0, weight=0.10, score_contribution=0.0, detail="No critical OWASP patterns"),
                ],
                security_findings=[],
                dry_violation="89% similarity to utils/payment_helpers.py:validate_transaction",
            ),
            PreCommitBlock(
                block_id="Block C", lines="64–98", survival_pct=9,
                risk_level="CRITICAL", verdict="🔴 Rewrite",
                signals=[
                    DebtSignal(signal="Duplicate line block ratio", value=0.42, weight=0.15, score_contribution=6.3, detail="4 near-copies found in codebase"),
                    DebtSignal(signal="Cyclomatic complexity delta", value=14.6, weight=0.15, score_contribution=21.9, detail="Extreme nesting — 6 levels deep"),
                    DebtSignal(signal="DRY violation score", value=0.94, weight=0.15, score_contribution=14.1, detail="Near-identical to 4 existing implementations"),
                    DebtSignal(signal="Cross-module dependency", value=4.0, weight=0.10, score_contribution=4.0, detail="4 new cross-module imports from auth, billing, user, analytics"),
                    DebtSignal(signal="AI origin probability", value=0.96, weight=0.15, score_contribution=14.4, detail="AI-generated — confirmed code-gen fingerprint"),
                    DebtSignal(signal="File ownership age", value=280.0, weight=0.10, score_contribution=28.0, detail="Legacy file untouched for 280 days + AI modification"),
                    DebtSignal(signal="Commit-code alignment", value=0.18, weight=0.10, score_contribution=8.2, detail="Commit message completely unrelated to changes"),
                    DebtSignal(signal="Security pattern classifier", value=1.0, weight=0.10, score_contribution=10.0, detail="SQL injection pattern detected (OWASP A03)"),
                ],
                security_findings=[
                    SecurityFinding(
                        pattern="SQL Injection", owasp_id="A03", severity="CRITICAL",
                        line=78, cvss=9.8,
                        description="User input concatenated directly into SQL query without parameterization",
                    ),
                    SecurityFinding(
                        pattern="Hard-coded credential", owasp_id="A07", severity="HIGH",
                        line=82, cvss=7.5,
                        description="API key embedded as string literal — should use environment variable",
                    ),
                ],
                dry_violation="Near-identical to 4 existing implementations",
                duplicate_detail="4 near-copies in codebase — utils/helpers.py, lib/payments.py, services/billing.py, legacy/txn.py",
            ),
        ],
        debt_hours_if_committed=16.8,
        debt_hours_if_rewritten=3.4,
        debt_reduction_pct=80.0,
        security_gate="BLOCKED",
        security_gate_reason="Critical vulnerability: SQL injection (OWASP A03, CVSS 9.8) in Block C line 78",
    ),
    PreCommitScan(
        developer="Priya Sharma",
        branch="feature/notification-revamp",
        file="src/notifications/email_dispatcher.py",
        blocks=[
            PreCommitBlock(
                block_id="Block A", lines="1–22", survival_pct=87,
                risk_level="LOW", verdict="✅ Commit",
                signals=[
                    DebtSignal(signal="Duplicate line block ratio", value=0.04, weight=0.15, score_contribution=0.6, detail="Minor duplication"),
                    DebtSignal(signal="Cyclomatic complexity delta", value=2.1, weight=0.15, score_contribution=3.2, detail="Moderate branching"),
                    DebtSignal(signal="DRY violation score", value=0.12, weight=0.15, score_contribution=1.8, detail="Low similarity"),
                    DebtSignal(signal="Cross-module dependency", value=0.0, weight=0.10, score_contribution=0.0, detail="No new imports"),
                    DebtSignal(signal="AI origin probability", value=0.45, weight=0.15, score_contribution=6.8, detail="Mixed origin"),
                    DebtSignal(signal="File ownership age", value=28.0, weight=0.10, score_contribution=2.8, detail="Recently modified"),
                    DebtSignal(signal="Commit-code alignment", value=0.88, weight=0.10, score_contribution=1.2, detail="Good alignment"),
                    DebtSignal(signal="Security pattern classifier", value=0.0, weight=0.10, score_contribution=0.0, detail="Clean"),
                ],
                security_findings=[],
            ),
            PreCommitBlock(
                block_id="Block B", lines="25–68", survival_pct=44,
                risk_level="HIGH", verdict="⚠️ Review",
                signals=[
                    DebtSignal(signal="Duplicate line block ratio", value=0.22, weight=0.15, score_contribution=3.3, detail="2 duplicated blocks"),
                    DebtSignal(signal="Cyclomatic complexity delta", value=6.8, weight=0.15, score_contribution=10.2, detail="Complex error handling"),
                    DebtSignal(signal="DRY violation score", value=0.72, weight=0.15, score_contribution=10.8, detail="72% similarity to existing retry logic"),
                    DebtSignal(signal="Cross-module dependency", value=1.0, weight=0.10, score_contribution=1.0, detail="1 new import from auth module"),
                    DebtSignal(signal="AI origin probability", value=0.91, weight=0.15, score_contribution=13.7, detail="AI-generated — retry pattern is common LLM output"),
                    DebtSignal(signal="File ownership age", value=88.0, weight=0.10, score_contribution=8.8, detail="Moderate age file"),
                    DebtSignal(signal="Commit-code alignment", value=0.55, weight=0.10, score_contribution=4.5, detail="Partial description"),
                    DebtSignal(signal="Security pattern classifier", value=0.0, weight=0.10, score_contribution=0.0, detail="No OWASP patterns"),
                ],
                security_findings=[],
                dry_violation="72% similarity to services/retry_manager.py:retry_with_backoff",
            ),
        ],
        debt_hours_if_committed=8.2,
        debt_hours_if_rewritten=2.1,
        debt_reduction_pct=74.4,
        security_gate="PASS",
        security_gate_reason=None,
    ),
]


SPRINT_DEBT_PROJECTIONS: list[SprintDebtProjection] = [
    SprintDebtProjection(sprint="Sprint 6", projected_debt=1680, if_all_rewritten=920, savings=760),
    SprintDebtProjection(sprint="Sprint 7", projected_debt=2180, if_all_rewritten=1100, savings=1080),
    SprintDebtProjection(sprint="Sprint 8", projected_debt=2820, if_all_rewritten=1340, savings=1480),
    SprintDebtProjection(sprint="Sprint 9", projected_debt=3640, if_all_rewritten=1620, savings=2020),
]


# ═══════════════════════════════════════════════════════════════════
# ██  ARCHITECTURAL DRIFT MONITOR
# ═══════════════════════════════════════════════════════════════════

MODULE_COUPLING_DRIFT = ModuleCouplingDrift(
    sprint_range="Sprint 14 → Sprint 15",
    new_couplings_total=14,
    ai_attributed_couplings=11,
    ai_coupling_pct=79,
    drift_score=67,
    drift_level="WARNING",
    interpretation="AI tools are introducing cross-module dependencies that were not present in the intended architecture.",
    pairs=[
        CouplingPair(module_a="Auth", module_b="Billing", baseline_coupling=2, current_coupling=7, ai_attributed_pct=78, danger_note=None),
        CouplingPair(module_a="Payments", module_b="UserProfile", baseline_coupling=0, current_coupling=11, ai_attributed_pct=94, danger_note="Tight coupling — should use API boundary"),
        CouplingPair(module_a="Auth", module_b="Analytics", baseline_coupling=0, current_coupling=3, ai_attributed_pct=100, danger_note="Creates data exfiltration path if Analytics module is compromised"),
        CouplingPair(module_a="Notifications", module_b="Billing", baseline_coupling=1, current_coupling=5, ai_attributed_pct=64, danger_note=None),
        CouplingPair(module_a="Reporting", module_b="Auth", baseline_coupling=0, current_coupling=4, ai_attributed_pct=88, danger_note="Reporting accessing auth tokens directly"),
    ],
)


SERVICE_BOUNDARY_VIOLATIONS: list[ServiceBoundaryViolation] = [
    ServiceBoundaryViolation(
        violation_id="SBVT-001",
        developer="Arjun Kumar",
        commit_hash="abc123f",
        violation_type="Direct database access across service boundary",
        detected_in="payment-service/src/queries/user_lookup.py",
        violation_detail="payment-service directly queries user-service database (violates service ownership policy)",
        ai_origin_pct=94,
        severity="CRITICAL",
        debt_level="HIGH",
        recommendation="Replace with user-service API call",
        auto_fix_available=True,
        sprint_remediation_hrs=2.4,
        deferred_cost_hrs=18.0,
    ),
    ServiceBoundaryViolation(
        violation_id="SBVT-002",
        developer="Priya Sharma",
        commit_hash="def456a",
        violation_type="Shared mutable state across services",
        detected_in="notification-service/src/state/user_prefs.py",
        violation_detail="notification-service writes directly to user-service's preference cache (race condition risk)",
        ai_origin_pct=87,
        severity="HIGH",
        debt_level="HIGH",
        recommendation="Use event-driven pattern via message queue",
        auto_fix_available=False,
        sprint_remediation_hrs=4.8,
        deferred_cost_hrs=24.0,
    ),
    ServiceBoundaryViolation(
        violation_id="SBVT-003",
        developer="Raj Patel",
        commit_hash="ghi789b",
        violation_type="Secret scope leakage",
        detected_in="analytics-service/src/config/db_config.py",
        violation_detail="analytics-service imports payment-service database credentials from shared config (PCI compliance violation)",
        ai_origin_pct=100,
        severity="CRITICAL",
        debt_level="HIGH",
        recommendation="Isolate credentials per service using vault-per-service pattern",
        auto_fix_available=False,
        sprint_remediation_hrs=3.2,
        deferred_cost_hrs=32.0,
    ),
    ServiceBoundaryViolation(
        violation_id="SBVT-004",
        developer="Meena Iyer",
        commit_hash="jkl012c",
        violation_type="Data model ownership violation",
        detected_in="reporting-service/src/models/user_model.py",
        violation_detail="reporting-service defines its own User model that shadows user-service's canonical model",
        ai_origin_pct=91,
        severity="MEDIUM",
        debt_level="MEDIUM",
        recommendation="Import canonical model from user-service shared schema package",
        auto_fix_available=True,
        sprint_remediation_hrs=1.6,
        deferred_cost_hrs=12.0,
    ),
]


GENERATIVE_MONOCULTURES: list[GenerativeMonoculture] = [
    GenerativeMonoculture(
        pattern_id="GPM-0047",
        pattern_name="JWT validation without expiry check",
        first_detected="src/auth/token_handler.py (Day 1)",
        spread_rate="4 files / 12 days",
        risk_level="CRITICAL",
        consequence="If this pattern contains a vulnerability, all 4 implementations are simultaneously exploitable.",
        flaw_confirmed=True,
        flaw_description="Missing exp claim validation allows permanent token reuse",
        cvss=8.1,
        instances=[
            MonocultureInstance(file="src/auth/token_handler.py", day=1, ai_origin=False),
            MonocultureInstance(file="src/api/middleware/auth.py", day=4, ai_origin=True),
            MonocultureInstance(file="src/webhooks/validator.py", day=9, ai_origin=True),
            MonocultureInstance(file="src/admin/session.py", day=12, ai_origin=True),
        ],
        remediation_files=4,
        remediation_hrs=6.8,
        post_breach_cost="$4.4M avg. (IBM 2025 baseline)",
    ),
    GenerativeMonoculture(
        pattern_id="GPM-0052",
        pattern_name="Unvalidated redirect pattern",
        first_detected="src/auth/oauth_callback.py (Day 3)",
        spread_rate="3 files / 8 days",
        risk_level="HIGH",
        consequence="Open redirect vulnerability allows phishing attacks via trusted domain.",
        flaw_confirmed=True,
        flaw_description="redirect_uri parameter not validated against allowlist",
        cvss=6.1,
        instances=[
            MonocultureInstance(file="src/auth/oauth_callback.py", day=3, ai_origin=True),
            MonocultureInstance(file="src/api/sso/handler.py", day=7, ai_origin=True),
            MonocultureInstance(file="src/admin/login_redirect.py", day=11, ai_origin=True),
        ],
        remediation_files=3,
        remediation_hrs=4.2,
        post_breach_cost="$2.1M avg.",
    ),
    GenerativeMonoculture(
        pattern_id="GPM-0061",
        pattern_name="Error handler that leaks stack traces",
        first_detected="src/api/error_handler.py (Day 2)",
        spread_rate="5 files / 14 days",
        risk_level="HIGH",
        consequence="Stack traces expose internal architecture, file paths, and dependency versions to attackers.",
        flaw_confirmed=True,
        flaw_description="Exception details returned in HTTP response body in non-debug mode",
        cvss=5.3,
        instances=[
            MonocultureInstance(file="src/api/error_handler.py", day=2, ai_origin=False),
            MonocultureInstance(file="src/payments/error_middleware.py", day=5, ai_origin=True),
            MonocultureInstance(file="src/notifications/handler.py", day=8, ai_origin=True),
            MonocultureInstance(file="src/reporting/api_errors.py", day=11, ai_origin=True),
            MonocultureInstance(file="src/webhooks/error_response.py", day=14, ai_origin=True),
        ],
        remediation_files=5,
        remediation_hrs=3.5,
        post_breach_cost="$1.8M avg.",
    ),
]


ARCHITECTURAL_HEALTH_SCORE = ArchitecturalHealthScore(
    team="Platform Engineering",
    quarter="Q1 2026",
    components=[
        AHSComponent(component="Module coupling integrity", score=41, ai_attribution_pct=79, trend="↓ Declining"),
        AHSComponent(component="Service boundary compliance", score=58, ai_attribution_pct=94, trend="↓ Declining"),
        AHSComponent(component="Pattern monoculture risk", score=34, ai_attribution_pct=100, trend="↓ Declining"),
    ],
    overall_score=44,
    status="DETERIORATING",
    drift_velocity=-3.2,
    projected_ahs_8wk=18,
    critical_threshold=30,
    remediation_cost_now=280000,
    remediation_cost_projected=1400000,
    cost_multiplier=5.0,
)


# ── Accessor functions ──

def get_full_dashboard() -> dict:
    """Return the complete Debt Radar dashboard payload."""
    return {
        "modules": _modules,
        "sprint_debt": _sprint_debt,
        "refactor_queue": _refactor_queue,
        "staged_files": _staged_files,
        "survival_predictions": _survival_predictions,
        "budget_tracker": _budget_tracker,
        "pre_commit_scans": PRE_COMMIT_SCANS,
        "sprint_debt_projections": SPRINT_DEBT_PROJECTIONS,
        "module_coupling_drift": MODULE_COUPLING_DRIFT,
        "service_boundary_violations": SERVICE_BOUNDARY_VIOLATIONS,
        "generative_monocultures": GENERATIVE_MONOCULTURES,
        "architectural_health_score": ARCHITECTURAL_HEALTH_SCORE,
    }


def get_modules() -> list[DebtModule]:
    return list(_modules)

def get_sprint_debt() -> list[SprintDebt]:
    return list(_sprint_debt)

def get_refactor_queue() -> list[RefactorItem]:
    return list(_refactor_queue)

def get_staged_files() -> list[StagedFile]:
    return list(_staged_files)

def get_survival_predictions() -> list[SurvivalPrediction]:
    return list(_survival_predictions)

def get_budget_tracker() -> BudgetTracker:
    return _budget_tracker


def resolve_refactor_item(index: int) -> RefactorItem | None:
    """Mark a refactor item as resolved and decrease budget current by its debt_reduction."""
    if 0 <= index < len(_refactor_queue):
        item = _refactor_queue.pop(index)
        _budget_tracker.current = max(0, _budget_tracker.current - item.debt_reduction)
        _budget_tracker.sprint_resolved += item.debt_reduction
        return item
    return None


def update_budget_settings(ceiling: int | None, alert_threshold: int | None) -> BudgetTracker:
    """Update budget ceiling and/or alert threshold."""
    global _budget_tracker
    if ceiling is not None:
        _budget_tracker = _budget_tracker.model_copy(update={"ceiling": ceiling})
    if alert_threshold is not None:
        _budget_tracker = _budget_tracker.model_copy(update={"alert_threshold": alert_threshold})
    return _budget_tracker
