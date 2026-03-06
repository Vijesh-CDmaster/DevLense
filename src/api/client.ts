const API_BASE = '/api'

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...init,
    })
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`)
    return res.json()
}

// ── Truth Lens endpoints ──
export const truthLensApi = {
    dashboard: (threshold = 20) =>
        fetchApi<TruthLensDashboard>(`/truth-lens/dashboard?threshold=${threshold}`),
    divergence: () => fetchApi<DivergencePoint[]>('/truth-lens/divergence'),
    developers: () => fetchApi<DevBreakdown[]>('/truth-lens/developers'),
    selfReport: () => fetchApi<SelfReportEntry[]>('/truth-lens/self-report'),
    drift: () => fetchApi<WeeklyDrift[]>('/truth-lens/drift'),
    illusionScore: () => fetchApi<IllusionScore>('/truth-lens/illusion-score'),
    gauges: () => fetchApi<GaugeData>('/truth-lens/gauges'),
    alerts: () => fetchApi<ManagerAlert[]>('/truth-lens/alerts'),
    setThreshold: (threshold_pct: number) =>
        fetchApi<AlertConfig>('/truth-lens/alerts/threshold', {
            method: 'PUT',
            body: JSON.stringify({ threshold_pct }),
        }),
    resolveAlert: (alertId: number) =>
        fetchApi<{ resolved: boolean }>(`/truth-lens/alerts/${alertId}/resolve`, { method: 'POST' }),
    evaluateAlerts: () =>
        fetchApi<{ alerts_fired: number; alerts: ManagerAlert[] }>('/truth-lens/alerts/evaluate', { method: 'POST' }),
    surveyQuestions: () => fetchApi<SurveyQuestion[]>('/truth-lens/surveys/questions'),
    surveyResponses: (limit = 20) =>
        fetchApi<SurveyResponse[]>(`/truth-lens/surveys/responses?limit=${limit}`),
    submitSurvey: (data: SurveySubmission) =>
        fetchApi<{ status: string }>('/truth-lens/surveys/submit', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    githubCommits: (sinceHours = 24) =>
        fetchApi<{ count: number; commits: GitHubCommit[] }>(`/truth-lens/github/commits?since_hours=${sinceHours}`),
}

// ── Types matching backend models ──
export interface DivergencePoint {
    month: string; belief: number; reality: number; gap: number
}
export interface DevBreakdown {
    name: string; belief: string; reality: string; gap: number; level: string
}
export interface SelfReportEntry {
    dev: string; task: string; self_report: string; actual_time: string
    self_gain: string; telemetry_gain: string; timestamp: string
}
export interface WeeklyDrift {
    week: string; belief: number; reality: number; gap: number; momentum: string
}
export interface IllusionDimension {
    dimension: string; belief: number; reality: number; icon: string
}
export interface IllusionScore {
    score: number; drift_rate: string; threshold: number
    dimensions: IllusionDimension[]
}
export interface GaugeData {
    team_belief: string; telemetry_reality: string
    belief_sub: string; reality_sub: string
}
export interface ManagerAlert {
    id: number; type: string; severity: string; msg: string
    action: string; time: string; resolved: boolean
}
export interface AlertConfig { threshold_pct: number }
export interface SurveyQuestion {
    id: string; question: string; options: string[]; context_file?: string
}
export interface SurveyResponse {
    dev: string; question: string; answer: string; real_delta: string; time: string
}
export interface SurveySubmission {
    dev: string; question: string; answer: string
    commit_sha?: string; file_path?: string
}
export interface GitHubCommit {
    sha: string; message: string; author: string; date: string
}
export interface TruthLensDashboard {
    illusion_score: IllusionScore
    gauges: GaugeData
    divergence_timeline: DivergencePoint[]
    dev_breakdown: DevBreakdown[]
    self_report_comparator: SelfReportEntry[]
    weekly_drift: WeeklyDrift[]
    alerts: ManagerAlert[]
    recent_surveys: SurveyResponse[]
    alert_config: AlertConfig
}

// ── Productivity Hub endpoints ──

export const productivityHubApi = {
    dashboard: () =>
        fetchApi<ProductivityDashboard>('/productivity-hub/dashboard'),
    hpsRadar: () => fetchApi<HPSRadarPoint[]>('/productivity-hub/hps/radar'),
    hpsDimensions: () => fetchApi<HPSDimension[]>('/productivity-hub/hps/dimensions'),
    hpsWeekly: () => fetchApi<HPSWeekly[]>('/productivity-hub/hps/weekly'),
    flowScores: () => fetchApi<DevFlowScore[]>('/productivity-hub/flow/scores'),
    flowTimeline: () => fetchApi<FlowTimelineSlot[]>('/productivity-hub/flow/timeline'),
    contextSwitches: () => fetchApi<ContextSwitchMetric[]>('/productivity-hub/cognitive/switches'),
    cognitiveLoadHourly: () => fetchApi<CognitiveLoadHourly[]>('/productivity-hub/cognitive/hourly'),
    aiQualityModules: () => fetchApi<AIQualityModule[]>('/productivity-hub/ai-quality/modules'),
    aiQualityTrend: () => fetchApi<AIQualityTrendPoint[]>('/productivity-hub/ai-quality/trend'),
    reworkSprints: () => fetchApi<ReworkSprint[]>('/productivity-hub/rework/sprints'),
    reworkPRs: () => fetchApi<ReworkPR[]>('/productivity-hub/rework/prs'),
    calendarToday: () => fetchApi<{ meeting_hours: number; meeting_count: number }>('/productivity-hub/calendar/today'),
}

// ── Productivity Hub types ──

export interface HPSRadarPoint { dimension: string; value: number }
export interface HPSDimension { label: string; value: number; color: string; weight: number }
export interface HPSWeekly {
    week: string; hps: number; speed: number; quality: number
    wellbeing: number; collab: number; ai_ratio: number
}
export interface DevFlowScore {
    name: string; deep_work: number; interrupted: number; meetings: number
    flow_score: number; trend: string; delta: number
}
export interface FlowTimelineSlot { hour: string; deep: number; interrupted: number; meeting: number }
export interface ContextSwitchMetric { label: string; value: number; icon: string; threshold: number; unit: string }
export interface CognitiveLoadHourly { hour: string; load: number }
export interface AIQualityModule {
    module: string; accepted: number; reverted: number; modified: number
    ratio: number; level: string
}
export interface AIQualityTrendPoint { sprint: string; ratio: number }
export interface ReworkSprint { sprint: string; survived: number; reverted: number }
export interface ReworkPR {
    pr: string; title: string; dev: string; ai_pct: number
    rework_hrs: number; reason: string; file: string; status: string
}
export interface ProductivityDashboard {
    hps_radar: HPSRadarPoint[]
    dimensions: HPSDimension[]
    hps_weekly: HPSWeekly[]
    dev_flow_scores: DevFlowScore[]
    flow_timeline: FlowTimelineSlot[]
    context_switches: ContextSwitchMetric[]
    cognitive_load_hourly: CognitiveLoadHourly[]
    ai_quality_by_module: AIQualityModule[]
    ai_quality_trend: AIQualityTrendPoint[]
    rework_data: ReworkSprint[]
    rework_prs: ReworkPR[]
}

// ── Debt Radar endpoints ──

export const debtRadarApi = {
    dashboard: () => fetchApi<DebtRadarDashboard>('/debt-radar/dashboard'),
    modules: () => fetchApi<DebtModule[]>('/debt-radar/modules'),
    sprintDebt: () => fetchApi<SprintDebtPoint[]>('/debt-radar/sprint-debt'),
    refactorQueue: () => fetchApi<RefactorItem[]>('/debt-radar/refactor-queue'),
    stagedFiles: () => fetchApi<StagedFile[]>('/debt-radar/staged-files'),
    survivalPredictions: () => fetchApi<SurvivalPrediction[]>('/debt-radar/survival-predictions'),
    budget: () => fetchApi<BudgetTracker>('/debt-radar/budget'),
    scoreFile: (data: { ai_pct: number; churn_history: number; pattern_issues: number }) =>
        fetchApi<ScoreFileResponse>('/debt-radar/score-file', {
            method: 'POST', body: JSON.stringify(data),
        }),
    resolveRefactor: (index: number) =>
        fetchApi<RefactorItem>(`/debt-radar/refactor-queue/${index}/resolve`, { method: 'POST' }),
    updateBudgetSettings: (data: { ceiling?: number; alert_threshold?: number }) =>
        fetchApi<BudgetTracker>('/debt-radar/budget/settings', {
            method: 'PUT', body: JSON.stringify(data),
        }),
    rescan: () =>
        fetchApi<StagedFile[]>('/debt-radar/rescan', { method: 'POST' }),
}

// ── Debt Radar types ──

export interface DebtModule { name: string; risk: number; level: string; label: string }
export interface SprintDebtPoint { sprint: string; debt: number; budget: number }
export interface RefactorItem {
    file: string; line: number; reason: string; urgency: string
    effort_hrs: number; debt_reduction: number; ai_pct: number
}
export interface StagedFile {
    file: string; ai_pct: number; churn_risk: number
    pattern_issues: number; debt_score: number; verdict: string
}
export interface SurvivalPrediction {
    file: string; block: string; lines: string; ai_pct: number
    survival_prob: number; risk_factors: string[]; predicted_lifespan_days: number
}
export interface BudgetTracker {
    ceiling: number; current: number; sprint_added: number; sprint_resolved: number
    trend: string; alert_threshold: number; weeks_to_breach: number
}
export interface ScoreFileResponse {
    debt_score: number; verdict: string
}
export interface DebtRadarDashboard {
    modules: DebtModule[]
    sprint_debt: SprintDebtPoint[]
    refactor_queue: RefactorItem[]
    staged_files: StagedFile[]
    survival_predictions: SurvivalPrediction[]
    budget_tracker: BudgetTracker
}

// ══════════════════════════════════════════════
// Dev Profiles (Problem 5 — Experience-Level Bias)
// ══════════════════════════════════════════════

export const devProfilesApi = {
    dashboard: () => fetchApi<DevProfilesDashboard>('/dev-profiles/dashboard'),
    developers: () => fetchApi<DevProfileDeveloper[]>('/dev-profiles/developers'),
    benefitCurve: () => fetchApi<BenefitCurvePoint[]>('/dev-profiles/benefit-curve'),
    impactTimeline: () => fetchApi<ImpactTimelinePoint[]>('/dev-profiles/impact-timeline'),
    benefitHarm: () => fetchApi<DevBenefitHarm[]>('/dev-profiles/benefit-harm'),
    productivityTimelines: () => fetchApi<DevProductivityTimeline[]>('/dev-profiles/productivity-timelines'),
    reverseAlerts: () => fetchApi<ReverseAlert[]>('/dev-profiles/reverse-alerts'),
    trustScores: () => fetchApi<DevTrustScore[]>('/dev-profiles/trust-scores'),
    detectSeniority: (commits: number, prComplexity: string, yearsExp: number) =>
        fetchApi<{ seniority: string }>(`/dev-profiles/detect-seniority?commits=${commits}&pr_complexity=${encodeURIComponent(prComplexity)}&years_exp=${yearsExp}`),
    aiImpact: (devName: string) =>
        fetchApi<{ net_impact: number; recommendation: string }>(`/dev-profiles/ai-impact/${encodeURIComponent(devName)}`),
    optimalMode: (devName: string) =>
        fetchApi<{ dev: string; recommended_mode: string }>(`/dev-profiles/optimal-mode/${encodeURIComponent(devName)}`),
    switchMode: (devName: string, mode: string) =>
        fetchApi<DevProfileDeveloper>(`/dev-profiles/developers/${encodeURIComponent(devName)}/mode`, {
            method: 'PUT', body: JSON.stringify({ mode }),
        }),
    acknowledgeAlert: (index: number) =>
        fetchApi<{ acknowledged: boolean }>(`/dev-profiles/reverse-alerts/${index}/acknowledge`, { method: 'POST' }),
    updateTrustThreshold: (devName: string, threshold: number) =>
        fetchApi<DevTrustScore>(`/dev-profiles/trust-scores/${encodeURIComponent(devName)}/threshold`, {
            method: 'PUT', body: JSON.stringify({ threshold }),
        }),
}

// ── Dev Profiles types ──

export interface DevProfileDeveloper {
    name: string; seniority: string; level: number; ai_impact: number
    mode: string; commits: number; pr_complexity: string; alert: boolean
    years_exp: number; code_patterns: string[]; trust_score: number; trust_threshold: number
}
export interface BenefitCurvePoint { seniority: string; impact: number }
export interface ImpactTimelinePoint { month: string; gain: number }
export interface DevBenefitHarm {
    dev: string; help_rate: number; harm_rate: number; neutral_rate: number
    net_impact: number; sessions_tracked: number; last_alert: string
}
export interface DevProductivityTimelinePoint {
    month: string; productivity: number; ai_usage: number; quality: number
}
export interface DevProductivityTimeline {
    dev: string; timeline: DevProductivityTimelinePoint[]
}
export interface ReverseAlert {
    dev: string; severity: string; msg: string; recommendation: string
    ai_time_lost: number; manual_estimate: number; triggered: string
}
export interface DevTrustScore {
    dev: string; seniority: string; trust_score: number; threshold: number
    auto_accept_rate: number; review_required: number; override_count: number
}
export interface DevProfilesDashboard {
    developers: DevProfileDeveloper[]
    benefit_curve: BenefitCurvePoint[]
    impact_timeline: ImpactTimelinePoint[]
    benefit_harm: DevBenefitHarm[]
    productivity_timelines: DevProductivityTimeline[]
    reverse_alerts: ReverseAlert[]
    trust_scores: DevTrustScore[]
}

// ══════════════════════════════════════════════
// Trust Engine (Problem 6 — Trust Crisis in AI Outputs)
// ══════════════════════════════════════════════

export const trustEngineApi = {
    dashboard: () => fetchApi<TrustEngineDashboard>('/trust-engine/dashboard'),
    suggestions: () => fetchApi<TESuggestion[]>('/trust-engine/suggestions'),
    taskTypes: () => fetchApi<TETaskType[]>('/trust-engine/task-types'),
    calibration: () => fetchApi<TECalibrationPoint[]>('/trust-engine/calibration'),
    confidenceMeters: () => fetchApi<TEConfidenceMeter[]>('/trust-engine/confidence-meters'),
    verifyAlerts: () => fetchApi<TEVerifyAlert[]>('/trust-engine/verify-alerts'),
    weeklyReport: () => fetchApi<TEWeeklyReport>('/trust-engine/weekly-report'),
}

// ── Trust Engine types ──

export interface TESuggestion {
    code: string; trust: number; task_type: string; complexity: string
    rec: string; level: string; files_affected: number; context_match: number
    historical_accuracy: number; risk_factors: string[]
}
export interface TETaskType { type: string; accuracy: number; total: number; accepted: number; reverted: number }
export interface TECalibrationPoint { week: string; trusted: number; correct: number; overtrust: number }
export interface TEConfidenceMeter {
    id: string; suggestion: string; context_score: number; complexity_penalty: number
    history_bonus: number; final_confidence: number; factors: string[]
}
export interface TEVerifyAlert {
    id: string; code: string; reason: string; severity: string
    false_positive_rate: number; task_type: string; suggested_action: string
}
export interface TEWeeklyTrendPoint { week: string; accuracy: number; acceptance: number }
export interface TEWeeklyReport {
    total_suggestions: number; accepted: number; rejected: number; reverted: number
    net_accuracy: number; best_task_type: string; worst_task_type: string
    calibration_score: number; calibration_label: string; trend: string
    weekly_trend: TEWeeklyTrendPoint[]
}
export interface TrustEngineDashboard {
    suggestions: TESuggestion[]
    task_types: TETaskType[]
    calibration: TECalibrationPoint[]
    confidence_meters: TEConfidenceMeter[]
    verify_alerts: TEVerifyAlert[]
    weekly_report: TEWeeklyReport
}

// ══════════════════════════════════════════════
// Leadership View (Problem 8 — Empathy Gap)
// ══════════════════════════════════════════════

export const leadershipApi = {
    dashboard: () => fetchApi<LeadershipDashboard>('/leadership/dashboard'),
    frictionHeatmap: () => fetchApi<LVFrictionPoint[]>('/leadership/friction-heatmap'),
    empathyGaps: () => fetchApi<LVEmpathyGap[]>('/leadership/empathy-gaps'),
    actionLoop: () => fetchApi<LVActionLoopItem[]>('/leadership/action-loop'),
    decisionImpacts: () => fetchApi<LVDecisionImpact[]>('/leadership/decision-impacts'),
    translations: () => fetchApi<LVTranslation[]>('/leadership/translations'),
    pulseResults: () => fetchApi<LVPulseResult[]>('/leadership/pulse-results'),
    empathyScore: () => fetchApi<LVEmpathyScore>('/leadership/empathy-score'),
}

// ── Leadership types ──

export interface LVFrictionPoint { area: string; dev_hours: number; leader_estimate: number; severity: string }
export interface LVEmpathyGap {
    dev_says: string; leader_thinks: string; gap: string; cost: string
    category: string; kpi_impact: string
}
export interface LVActionLoopItem {
    issue: string; action: string; status: string; date: string
    hours_recovered: number; dev_satisfaction: number
}
export interface LVDecisionImpact {
    decision: string; made_by: string; date: string
    dev_hours_lost: number; dollars_lost: number; affected_devs: number; category: string
}
export interface LVTranslation {
    dev_pain: string; exec_translation: string; kpi: string
    dollar_impact: string; priority: string
}
export interface LVPulseResult {
    week: string; productivity: number; blocker_count: number
    ai_sentiment: number; response_rate: number
}
export interface LVEmpathyScoreWeekPoint { week: string; score: number }
export interface LVEmpathyScore {
    score: number; label: string; trend: string; monthly_cost: string
    gap_areas: number; total_gaps: number; weekly_trend: LVEmpathyScoreWeekPoint[]
}
export interface LeadershipDashboard {
    friction_heatmap: LVFrictionPoint[]
    empathy_gaps: LVEmpathyGap[]
    action_loop: LVActionLoopItem[]
    decision_impacts: LVDecisionImpact[]
    translations: LVTranslation[]
    pulse_results: LVPulseResult[]
    empathy_score: LVEmpathyScore
}

// ── Knowledge Vault API ──

export const knowledgeVaultApi = {
    dashboard: () => fetchApi<KVDashboard>('/knowledge-vault/dashboard'),
    nodes: () => fetchApi<KVNode[]>('/knowledge-vault/nodes'),
    interviews: () => fetchApi<KVInterviewMessage[]>('/knowledge-vault/interviews'),
    decisions: () => fetchApi<KVDecision[]>('/knowledge-vault/decisions'),
    riskScore: () => fetchApi<KVRiskScore>('/knowledge-vault/risk-score'),
    extractions: () => fetchApi<KVExtraction[]>('/knowledge-vault/extractions'),
    onboarding: () => fetchApi<KVOnboardingQuery[]>('/knowledge-vault/onboarding'),
    archaeology: () => fetchApi<KVArchaeologyResult[]>('/knowledge-vault/archaeology'),
    busFactor: () => fetchApi<{ module: string; owners: number; risk: string }[]>('/knowledge-vault/bus-factor'),
}

// ── Knowledge Vault types ──

export interface KVNode {
    id: string; label: string; risk: string; owners: number
    decisions: number; code_regions: string[]; last_updated: string
}
export interface KVInterviewMessage {
    role: string; msg: string; timestamp: string; decision_extracted: boolean
}
export interface KVDecision {
    id: string; title: string; reasoning: string; alternatives_rejected: string[]
    author: string; date: string; code_region: string; tags: string[]
}
export interface KVArchaeologyResult {
    query: string; answer: string; author: string; date: string
    decision_id: string; confidence: number; code_path: string
}
export interface KVRiskScore {
    overall_score: number; high_risk_count: number; medium_risk_count: number
    safe_count: number; bus_factor_alerts: string[]
}
export interface KVExtraction {
    id: string; code_region: string; decision: string; why: string
    alternatives: string[]; trade_offs: string; author: string; date: string
}
export interface KVOnboardingQuery {
    question: string; answer: string; source_decisions: string[]
    confidence: number; asked_by: string; date: string
}
export interface KVDashboard {
    nodes: KVNode[]
    interview_history: KVInterviewMessage[]
    decisions: KVDecision[]
    risk_score: KVRiskScore
    recent_extractions: KVExtraction[]
    onboarding_queries: KVOnboardingQuery[]
    archaeology_results: KVArchaeologyResult[]
}

// ══════════════════════════════════════════════
// Toolchain Radar (Problem 7 — Fragmented Toolchains)
// ══════════════════════════════════════════════

export const toolchainRadarApi = {
    dashboard: () => fetchApi<ToolchainRadarDashboard>('/toolchain-radar/dashboard'),
    developers: () => fetchApi<TCDeveloper[]>('/toolchain-radar/developers'),
    transitions: () => fetchApi<TCTransition[]>('/toolchain-radar/transitions'),
    hourlyTimeline: () => fetchApi<TCHourlySlot[]>('/toolchain-radar/hourly-timeline'),
    frictionByTask: () => fetchApi<TCFrictionByTask[]>('/toolchain-radar/friction-by-task'),
    toolUsage: () => fetchApi<TCToolUsage[]>('/toolchain-radar/tool-usage'),
}

// ── Toolchain Radar types ──

export interface TCDeveloper {
    name: string; switches: number; time_lost: number
    primary: string; top_friction: string; alert: boolean
}
export interface TCTransition {
    from_tool: string; to_tool: string; switches: number; avg_min_lost: number
}
export interface TCHourlySlot {
    hour: string; copilot: number; cursor: number; claude: number
}
export interface TCFrictionByTask {
    task: string; minutes_lost: number; switches: number; worst_transition: string
}
export interface TCToolUsage {
    tool: string; pct: number; accepts: number; quality: number; color: string
}
export interface ToolchainRadarDashboard {
    developers: TCDeveloper[]
    transition_matrix: TCTransition[]
    hourly_timeline: TCHourlySlot[]
    friction_by_task: TCFrictionByTask[]
    tool_usage: TCToolUsage[]
}

// ══════════════════════════════════════════════
// Org Cascade (Problem 3 — AI Productivity Paradox)
// ══════════════════════════════════════════════

export const orgCascadeApi = {
    dashboard: () => fetchApi<OrgCascadeDashboard>('/org-cascade/dashboard'),
    summary: () => fetchApi<OrgGapSummary>('/org-cascade/summary'),
    doraMetrics: () => fetchApi<OCDoraMetric[]>('/org-cascade/dora-metrics'),
    bottlenecks: () => fetchApi<OCBottleneck[]>('/org-cascade/bottlenecks'),
    amplifiers: () => fetchApi<OCAmplifier[]>('/org-cascade/amplifiers'),
    cascadeFlow: () => fetchApi<OCCascadeStage[]>('/org-cascade/cascade-flow'),
    roiReport: () => fetchApi<OCRoiReportEntry[]>('/org-cascade/roi-report'),
    doraCorrelations: () => fetchApi<OCDoraCorrelation[]>('/org-cascade/dora-correlations'),
}

// ── Org Cascade types ──

export interface OrgGapSummary {
    org_gap: number; individual_gain: number; team_impact: number
}
export interface OCDoraMetric {
    metric: string; value: number; target: number; unit: string
}
export interface OCBottleneck {
    label: string; loss: number; color: string
}
export interface OCAmplifier {
    practice: string; impact: string; color: string
}
export interface OCCascadeStage {
    stage: string; pct: number; color: string
}
export interface OCRoiReportEntry {
    week: string; ai_investment: number; measured_gain: number
    org_throughput_delta: number; effective_roi: number
}
export interface OCDoraCorrelation {
    metric: string; ai_usage_pct: number; metric_change_pct: number
    correlation: number; trend: string
}
export interface OrgCascadeDashboard {
    summary: OrgGapSummary
    dora_metrics: OCDoraMetric[]
    bottlenecks: OCBottleneck[]
    amplifiers: OCAmplifier[]
    cascade_flow: OCCascadeStage[]
    roi_report: OCRoiReportEntry[]
    dora_correlations: OCDoraCorrelation[]
}
