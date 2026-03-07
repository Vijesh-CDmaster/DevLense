const API_BASE = '/api'

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
    const token = localStorage.getItem('token')
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(`${API_BASE}${path}`, {
        headers,
        ...init,
    })
    if (res.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
        throw new Error('Session expired')
    }
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
    // Belief Audit Engine
    beliefAudits: () => fetchApi<TLDevBeliefAudit[]>('/truth-lens/belief-audits'),
    biasTypologies: () => fetchApi<TLBiasTypology[]>('/truth-lens/bias-typologies'),
    calibrationScores: () => fetchApi<TLCalibrationScore[]>('/truth-lens/calibration-scores'),
    beliefSummary: () => fetchApi<TLBeliefSummary>('/truth-lens/belief-summary'),
    // Decision Contamination Tracker
    decisionSignals: () => fetchApi<TLDecisionSignal[]>('/truth-lens/decision-signals'),
    contaminationAssessments: () => fetchApi<TLContaminationAssessment[]>('/truth-lens/contamination-assessments'),
    postDecisionOutcomes: () => fetchApi<TLPostDecisionOutcome[]>('/truth-lens/post-decision-outcomes'),
    orgContamination: () => fetchApi<TLOrgContaminationSummary>('/truth-lens/org-contamination'),
    contaminationSummary: () => fetchApi<TLContaminationSummary>('/truth-lens/contamination-summary'),
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
// Belief Audit Engine
export interface TLBeliefAuditDay {
    day: string; self_reported: number; telemetry: number; gap: number
}
export interface TLDevBeliefAudit {
    developer: string; week_label: string; daily: TLBeliefAuditDay[]
    avg_self_reported: number; avg_telemetry: number; avg_gap: number
    bias_pattern: string; bias_type: string
    alert_status: 'none' | 'monitoring' | 'notified' | 'escalated'
    streak_days: number
}
export interface TLBiasTypology {
    type: string; description: string; affected_developers: string[]
    severity: 'low' | 'moderate' | 'high' | 'critical'; prevalence_pct: number
}
export interface TLCalibrationScore {
    developer: string; score: number
    direction: 'over' | 'under' | 'calibrated'
    avg_divergence_pts: number; weeks_tracked: number
    trend: 'improving' | 'stable' | 'worsening'
}
export interface TLBeliefSummary {
    avg_org_gap_pts: number; miscalibrated_developers: number
    well_calibrated: number; active_bias_types: number
    worst_calibrated: string; developers_notified: number
}
// Decision Contamination Tracker
export interface TLDecisionSignal {
    id: string; event: string; team: string; detection_signal: string
    detected_at: string; status: 'detected' | 'assessed' | 'tracked' | 'closed'
}
export interface TLContaminationAssessment {
    decision_signal_id: string; event: string; team: string
    committed_value: number; baseline_value: number; spike_pct: number
    evidence_quality_score: number
    self_report_weeks: number; belief_calibration: number
    bias_direction: string; telemetry_divergence: number
    days_since_calibration: number
    contamination_risk: 'low' | 'moderate' | 'high' | 'critical'
    predicted_failure_pct: number; recommended_action: string
    send_to: string[]
}
export interface TLPostDecisionOutcome {
    decision_signal_id: string; event: string; team: string
    committed: number; actual: number; shortfall_pct: number
    overtime_hrs: number; overtime_cost: number; feature_delay_sprints: number
    sla_missed: boolean; total_contamination_cost: number
    eqs_at_decision: number; avoidable: 'HIGH' | 'MODERATE' | 'LOW'
}
export interface TLOrgContaminationEntry {
    team: string; decision: string; eqs: number
    eqs_level: 'red' | 'amber' | 'green'; outcome: string; cost: string
}
export interface TLOrgContaminationSummary {
    quarter: string; entries: TLOrgContaminationEntry[]
    decisions_below_40: number; total_decisions: number
    estimated_preventable_cost: string
}
export interface TLContaminationSummary {
    total_decisions_tracked: number; critical_contamination: number
    high_contamination: number; total_contamination_cost: number
    avg_evidence_quality_score: number; open_signals: number
    decisions_below_eqs_40: number; estimated_preventable_cost: string
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
    belief_audits: TLDevBeliefAudit[]
    bias_typologies: TLBiasTypology[]
    calibration_scores: TLCalibrationScore[]
    decision_signals: TLDecisionSignal[]
    contamination_assessments: TLContaminationAssessment[]
    post_decision_outcomes: TLPostDecisionOutcome[]
    org_contamination: TLOrgContaminationSummary
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
    preCommitScans: () => fetchApi<DRPreCommitScan[]>('/debt-radar/pre-commit-scans'),
    sprintDebtProjections: () => fetchApi<DRSprintDebtProjection[]>('/debt-radar/sprint-debt-projections'),
    couplingDrift: () => fetchApi<DRModuleCouplingDrift>('/debt-radar/coupling-drift'),
    boundaryViolations: () => fetchApi<DRServiceBoundaryViolation[]>('/debt-radar/boundary-violations'),
    monocultures: () => fetchApi<DRGenerativeMonoculture[]>('/debt-radar/monocultures'),
    architecturalHealth: () => fetchApi<DRArchitecturalHealthScore>('/debt-radar/architectural-health'),
    archDriftSummary: () => fetchApi<DRArchDriftSummary>('/debt-radar/arch-drift-summary'),
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
    pre_commit_scans: DRPreCommitScan[]
    sprint_debt_projections: DRSprintDebtProjection[]
    module_coupling_drift: DRModuleCouplingDrift
    service_boundary_violations: DRServiceBoundaryViolation[]
    generative_monocultures: DRGenerativeMonoculture[]
    architectural_health_score: DRArchitecturalHealthScore
}

// ── Enhanced Pre-Commit Debt Scorer types ──

export interface DRDebtSignal {
    signal: string; value: number; weight: number
    score_contribution: number; detail: string
}
export interface DRSecurityFinding {
    pattern: string; owasp_id: string; severity: string
    line: number; cvss: number; description: string
}
export interface DRPreCommitBlock {
    block_id: string; lines: string; survival_pct: number
    risk_level: string; verdict: string
    signals: DRDebtSignal[]; security_findings: DRSecurityFinding[]
    dry_violation: string | null; duplicate_detail: string | null
}
export interface DRPreCommitScan {
    developer: string; branch: string; file: string
    blocks: DRPreCommitBlock[]
    debt_hours_if_committed: number; debt_hours_if_rewritten: number
    debt_reduction_pct: number
    security_gate: string; security_gate_reason: string | null
}
export interface DRSprintDebtProjection {
    sprint: string; projected_debt: number
    if_all_rewritten: number; savings: number
}

// ── Architectural Drift Monitor types ──

export interface DRCouplingPair {
    module_a: string; module_b: string
    baseline_coupling: number; current_coupling: number
    ai_attributed_pct: number; danger_note: string | null
}
export interface DRModuleCouplingDrift {
    sprint_range: string; new_couplings_total: number
    ai_attributed_couplings: number; ai_coupling_pct: number
    drift_score: number; drift_level: string
    interpretation: string; pairs: DRCouplingPair[]
}
export interface DRServiceBoundaryViolation {
    violation_id: string; developer: string; commit_hash: string
    violation_type: string; detected_in: string; violation_detail: string
    ai_origin_pct: number; severity: string; debt_level: string
    recommendation: string; auto_fix_available: boolean
    sprint_remediation_hrs: number; deferred_cost_hrs: number
}
export interface DRMonocultureInstance {
    file: string; day: number; ai_origin: boolean
}
export interface DRGenerativeMonoculture {
    pattern_id: string; pattern_name: string
    first_detected: string; spread_rate: string
    risk_level: string; consequence: string
    flaw_confirmed: boolean; flaw_description: string | null
    cvss: number | null
    instances: DRMonocultureInstance[]
    remediation_files: number; remediation_hrs: number
    post_breach_cost: string
}
export interface DRAHSComponent {
    component: string; score: number
    ai_attribution_pct: number; trend: string
}
export interface DRArchitecturalHealthScore {
    team: string; quarter: string
    components: DRAHSComponent[]
    overall_score: number; status: string
    drift_velocity: number; projected_ahs_8wk: number
    critical_threshold: number
    remediation_cost_now: number; remediation_cost_projected: number
    cost_multiplier: number
}
export interface DRArchDriftSummary {
    overall_ahs: number; drift_velocity: number
    total_sbvt_violations: number; total_monoculture_alerts: number
    ai_coupling_pct: number
    remediation_cost_now: number; remediation_cost_projected: number
    worst_component: string; worst_score: number
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
    // Seniority Profiler + AI Impact Dashboard
    seniorityProfiles: () => fetchApi<DPSeniorityProfile[]>('/dev-profiles/seniority-profiles'),
    seniorityProfile: (devName: string) => fetchApi<DPSeniorityProfile>(`/dev-profiles/seniority-profiles/${encodeURIComponent(devName)}`),
    aiImpactDashboards: () => fetchApi<DPAIImpactDashboard[]>('/dev-profiles/ai-impact-dashboards'),
    aiImpactDashboard: (devName: string) => fetchApi<DPAIImpactDashboard>(`/dev-profiles/ai-impact-dashboards/${encodeURIComponent(devName)}`),
    senioritySummary: () => fetchApi<DPSenioritySummary>('/dev-profiles/seniority-summary'),
    // Talent Pipeline Debt Forecaster
    juniorDependencyIndices: () => fetchApi<DPJuniorDependencyIndex[]>('/dev-profiles/junior-dependency-indices'),
    seniorityVelocityDeficits: () => fetchApi<DPSeniorityVelocityDeficit[]>('/dev-profiles/seniority-velocity-deficits'),
    teamPipelineRisk: () => fetchApi<DPTeamPipelineRisk[]>('/dev-profiles/team-pipeline-risk'),
    orgPipelineDebt: () => fetchApi<DPOrgPipelineDebtReport>('/dev-profiles/org-pipeline-debt'),
    pipelineSummary: () => fetchApi<DPPipelineSummary>('/dev-profiles/pipeline-summary'),
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
    seniority_profiles: DPSeniorityProfile[]
    ai_impact_dashboards: DPAIImpactDashboard[]
    junior_dependency_indices: DPJuniorDependencyIndex[]
    seniority_velocity_deficits: DPSeniorityVelocityDeficit[]
    team_pipeline_risk: DPTeamPipelineRisk[]
    org_pipeline_debt: DPOrgPipelineDebtReport
}
// Seniority Profiler types
export interface DPSenioritySignal {
    signal: string; measurement: string; raw_value: number; score_contribution: number
}
export interface DPSeniorityProfile {
    developer: string; seniority_score: number; band: string
    signals: DPSenioritySignal[]; top_signal: string; years_active: number
}
export interface DPTaskTypeImpact {
    task_type: string; ai_on_avg_hrs: number; ai_off_avg_hrs: number
    delta_pct: number; signal: 'HARM' | 'BENEFIT' | 'MARGINAL'
}
export interface DPAIImpactDashboard {
    developer: string; seniority_score: number; band: string
    task_impacts: DPTaskTypeImpact[]; net_impact_hrs: number
    recommended_disable: string[]; benefit_zone: string[]
}
export interface DPSenioritySummary {
    total_developers: number; band_distribution: Record<string, number>
    avg_seniority_score: number; developers_harmed: number; developers_benefited: number
    total_harm_hrs: number; total_benefit_hrs: number; net_org_impact_hrs: number
    worst_affected: string; worst_impact_hrs: number
}
// Pipeline Debt Forecaster types
export interface DPJDIWeek {
    week_range: string; independent_pct: number
}
export interface DPJuniorDependencyIndex {
    developer: string; band: string; seniority_score: number
    weekly_jdi: DPJDIWeek[]; jdi_trend_pts: number
    atrophy_velocity: number; projected_jdi_week28: number
}
export interface DPSeniorityVelocityDeficit {
    developer: string; tenure_months: number
    expected_score_growth: number; actual_score_growth: number; gap_pct: number
    expected_complexity_growth: number; actual_complexity_growth: number; complexity_gap_pct: number
    expected_review_pct: number; actual_review_pct: number; review_gap_pct: number
    svr: number; projected_proficient_month: number; expected_proficient_month: number
    timeline_cost_months: number
}
export interface DPTeamPipelineRisk {
    team: string; juniors_tracked: number; avg_jdi_trend: number
    avg_svr: number; devs_on_atrophy: number; atrophy_pct: number
    risk_score: number; risk_level: string; external_hire_by: string
}
export interface DPInterventionOption {
    option: string; description: string; quarterly_cost: number; debt_reduction: number
}
export interface DPOrgPipelineDebtReport {
    quarter: string; severe_atrophy_count: number; total_juniors: number
    atrophy_pct: number; avg_svr: number; svr_gap_below_ok: number
    projected_senior_gap: number; gap_by_quarter: string
    cost_per_external_hire: number; ramp_premium_per_role: number
    knowledge_loss_per_role: number; total_pipeline_debt: number
    preventable_by: string; interventions: DPInterventionOption[]
}
export interface DPPipelineSummary {
    total_juniors_tracked: number; severe_atrophy: number; moderate_atrophy: number
    healthy: number; avg_svr: number; avg_jdi_trend: number
    critical_teams: number; total_teams: number; total_pipeline_debt: number
    projected_senior_gap: number; gap_by_quarter: string; preventable_by: string
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
    developerProfiles: () => fetchApi<TEDeveloperProfile[]>('/trust-engine/developer-profiles'),
    score: (taskType: string, complexity: string, filesAffected: number, contextMatch: number, developer?: string) =>
        fetchApi<TETrustScoreResult>(`/trust-engine/score?task_type=${encodeURIComponent(taskType)}&complexity=${encodeURIComponent(complexity)}&files_affected=${filesAffected}&context_match=${contextMatch}${developer ? `&developer=${encodeURIComponent(developer)}` : ''}`),
    shouldVerify: (trustScore: number, taskType: string) =>
        fetchApi<{ should_verify: boolean }>(`/trust-engine/should-verify?trust_score=${trustScore}&task_type=${encodeURIComponent(taskType)}`),
    perSuggestionScores: () => fetchApi<TEPerSuggestionTrustScore[]>('/trust-engine/per-suggestion-scores'),
    vteProtocols: () => fetchApi<TEVTEProtocol[]>('/trust-engine/vte-protocols'),
    vteChecklist: (suggestionId: string) => fetchApi<TEVTEChecklistItem[]>(`/trust-engine/vte-checklist/${encodeURIComponent(suggestionId)}`),
    vteSummary: () => fetchApi<TEVTESummary>('/trust-engine/vte-summary'),
    calibrationReport: () => fetchApi<TECalibrationReport>('/trust-engine/calibration-report'),
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
export interface TEDevTaskTypeAccuracy {
    type: string; accuracy: number; total: number; accepted: number; reverted: number
}
export interface TEDeveloperProfile {
    name: string; overall_trust_score: number; calibration_score: number
    calibration_label: string; total_suggestions: number; accepted: number
    reverted: number; overtrust_pct: number; undertrust_pct: number
    best_task_type: string; worst_task_type: string
    task_accuracies: TEDevTaskTypeAccuracy[]
    calibration_history: TECalibrationPoint[]
    trend: string
}
export interface TETrustScoreResult {
    trust: number; level: string; rec: string
    breakdown: { base_accuracy: number; complexity_penalty: number; file_penalty: number; context_bonus: number }
}
export interface TrustEngineDashboard {
    suggestions: TESuggestion[]
    task_types: TETaskType[]
    calibration: TECalibrationPoint[]
    confidence_meters: TEConfidenceMeter[]
    verify_alerts: TEVerifyAlert[]
    weekly_report: TEWeeklyReport
    developer_profiles: TEDeveloperProfile[]
    per_suggestion_scores: TEPerSuggestionTrustScore[]
    vte_protocols: TEVTEProtocol[]
    calibration_report: TECalibrationReport
}

// ── 9-Signal Trust Scorer types ──

export interface TETrustSignal {
    signal: string; value: string; weight: number
    score_contribution: number; detail: string
}
export interface TEExplainabilityItem {
    category: string; text: string; severity: string
}
export interface TEPerSuggestionTrustScore {
    suggestion_id: string; code_snippet: string; trust_score: number
    level: string; recommendation: string; signals: TETrustSignal[]
    why_low: TEExplainabilityItem[]; what_to_check: TEExplainabilityItem[]
    personal_accuracy: number; team_accuracy: number
    task_type: string; developer: string; timestamp: string
}

// ── VTE types ──

export interface TESymbolCheck {
    symbol: string; location: string; status: string
}
export interface TEBoundaryTest {
    input_desc: string; target_line: string; rationale: string
}
export interface TEArchProbe {
    check: string; target: string; risk: string
}
export interface TESecurityFastPath {
    owasp_id: string; risk_label: string; lines: string
    current_code: string; required_fix: string; severity: string
}
export interface TEVTEProtocol {
    suggestion_id: string; trust_score: number; estimated_seconds: number
    symbol_checks: TESymbolCheck[]; boundary_tests: TEBoundaryTest[]
    arch_probes: TEArchProbe[]; security_fast_paths: TESecurityFastPath[]
    sections_order: string[]
}
export interface TEVTEChecklistItem {
    section: string; priority: string; label: string; estimated_sec: number
}
export interface TEVTESummary {
    total_protocols_available: number; avg_vte_seconds: number
    avg_unstructured_minutes: number; savings_per_verification_minutes: number
    total_suggestions_scored: number; avg_trust_score: number
    pct_requiring_verification: number
}

// ── Calibration Report types ──

export interface TECalibrationBucket {
    label: string; pct: number; status: string; description: string
}
export interface TECalibrationGap {
    task_type: string; gap_type: string; rate: number; recommendation: string
}
export interface TECalibrationReport {
    team: string; week_label: string; suggestions_displayed: number
    protocols_run: number; protocol_run_pct: number
    avg_verification_sec: number; unstructured_avg_min: number
    verification_tax_saved_hrs: number
    buckets: TECalibrationBucket[]
    team_calibration_score: number; primary_gap: TECalibrationGap
    secondary_gaps: TECalibrationGap[]
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
    developerFrictions: () => fetchApi<LVDeveloperFriction[]>('/leadership/developer-frictions'),
    frictionTrends: () => fetchApi<LVFrictionTrendPoint[]>('/leadership/friction-trends'),
    impactSimulations: () => fetchApi<LVImpactSimulation[]>('/leadership/impact-simulations'),
    empathyDimensions: () => fetchApi<LVEmpathyDimension[]>('/leadership/empathy-dimensions'),
    briefing: () => fetchApi<LVLeadershipBriefing>('/leadership/briefing'),
    escalations: () => fetchApi<LVEscalationItem[]>('/leadership/escalations'),
    rtFrictionHeatmap: () => fetchApi<LVRTFrictionRow[]>('/leadership/rt-friction-heatmap'),
    netAiRoi: () => fetchApi<LVNetAIROI>('/leadership/net-ai-roi'),
    leadershipBrief: () => fetchApi<LVLeadershipBriefObj>('/leadership/leadership-brief'),
    decisionEvents: () => fetchApi<LVDecisionEvent[]>('/leadership/decision-events'),
    decisionImpactMeasurements: () => fetchApi<LVDecisionImpactMeasurement[]>('/leadership/decision-impact-measurements'),
    frictionDebtLedger: () => fetchApi<LVFrictionDebtLedger>('/leadership/friction-debt-ledger'),
    bidirectionalDashboard: () => fetchApi<LVBidirectionalDashboard>('/leadership/bidirectional-dashboard'),
    empathyRoiReport: () => fetchApi<LVEmpathyROIReport>('/leadership/empathy-roi-report'),
    frictionSummary: () => fetchApi<Record<string, unknown>>('/leadership/friction-summary'),
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
export interface LVDeveloperFriction {
    dev: string; area: string; hours_lost: number; trend: string; top_blocker: string
}
export interface LVFrictionTrendPoint {
    week: string; code_reviews: number; meetings: number; ci_cd: number
    context_switching: number; ai_friction: number
}
export interface LVImpactSimulation {
    issue: string; current_cost_monthly: number; fix_effort_hours: number
    projected_savings_monthly: number; roi_pct: number; payback_weeks: number; priority: string
}
export interface LVEmpathyDimension {
    category: string; leader_awareness: number; dev_severity: number
    gap: number; action_rate: number; color: string
}
export interface LVLeadershipBriefing {
    period: string; top_issues: string[]; actions_taken: number; actions_ignored: number
    total_hours_recovered: number; total_hours_lost: number; empathy_score_delta: number
    recommendations: string[]; dollar_impact: string
}
export interface LVEscalationItem {
    issue: string; ignored_since: string; days_ignored: number
    dev_cost_accumulated: number; escalation_level: string
    affected_devs: number; auto_escalation_date: string
}
export interface LeadershipDashboard {
    friction_heatmap: LVFrictionPoint[]
    empathy_gaps: LVEmpathyGap[]
    action_loop: LVActionLoopItem[]
    decision_impacts: LVDecisionImpact[]
    translations: LVTranslation[]
    pulse_results: LVPulseResult[]
    empathy_score: LVEmpathyScore
    developer_frictions: LVDeveloperFriction[]
    friction_trends: LVFrictionTrendPoint[]
    impact_simulations: LVImpactSimulation[]
    empathy_dimensions: LVEmpathyDimension[]
    leadership_briefing: LVLeadershipBriefing
    escalations: LVEscalationItem[]
    rt_friction_heatmap: LVRTFrictionRow[]
    net_ai_roi: LVNetAIROI
    leadership_brief: LVLeadershipBriefObj
    decision_events: LVDecisionEvent[]
    decision_impact_measurements: LVDecisionImpactMeasurement[]
    friction_debt_ledger: LVFrictionDebtLedger
    bidirectional_dashboard: LVBidirectionalDashboard
    empathy_roi_report: LVEmpathyROIReport
}

// ── Real-Time Friction Heatmap + Net AI ROI ──

export interface LVRTFrictionRow {
    source: string; hours_lost: number; team_cost: number
    trend: string; trend_direction: string
}
export interface LVNetAIROI {
    total_friction_hours: number; total_friction_cost: number
    ai_hours_saved: number; ai_cost_saved: number
    net_roi_dollars: number; net_status: string
    consecutive_weeks_negative: number
}
export interface LVLeadershipBriefObj {
    recipient_role: string; focus: string; period: string
    items: Record<string, unknown>[]; empathy_score: number
    alerts_sent: number; alerts_acted: number; alerts_acted_pct: number
}

// ── Friction Debt Ledger ──

export interface LVDecisionEvent {
    id: string; event_type: string; decision: string
    decision_maker: string; enacted_date: string
    scope: string; detection_signal: string
}
export interface LVDecisionImpactMeasurement {
    decision_id: string; decision: string; decision_maker: string
    enacted_date: string; scope: string
    pre_merge_time_hrs: number; post_merge_time_hrs: number
    pre_blocked_tickets: number; post_blocked_tickets: number
    pre_friction_hrs: number; post_friction_hrs: number
    pre_approval_loops: number; post_approval_loops: number
    causal_score: number; net_friction_hrs: number
    financial_impact_week: number; cumulative_cost: number
    weeks_since: number; mitigation_available: string
    mitigation_cost: number; mitigation_weekly_saving: number
    status: string
}
export interface LVFrictionDebtEntry {
    decision: string; maker: string; cumulative_cost: number
    duration_weeks: number; resolution: string; status_icon: string
}
export interface LVDecisionQualityScore {
    leader: string; score: number; label: string; status: string
}
export interface LVFrictionDebtLedger {
    quarter: string; org: string
    entries: LVFrictionDebtEntry[]
    total_friction_introduced: number; total_friction_saved: number
    net_friction_debt: number
    decision_quality_scores: LVDecisionQualityScore[]
}

// ── Bidirectional Accountability ──

export interface LVActionLoopDevView {
    friction_flagged: string; first_reported: string; weeks_ago: number
    alerts_sent: number; leader_response: string; response_status: string
    outcome_measured: string; personal_hours_affected: number
    personal_cost: number; team_hours_affected: number; team_cost: number
}
export interface LVBidirectionalDashboard {
    developer: string; team: string
    action_loops: LVActionLoopDevView[]
    empathy_score: number; alerts_this_quarter: number
    acted_within_2wk: number; acted_after_2wk: number; not_acted: number
}

// ── Empathy ROI Report ──

export interface LVEmpathyROIReport {
    quarter: string; total_alerts: number; actions_taken: number
    friction_cost_reduced: number; friction_cost_persisting: number
    estimated_additional_recovery: number; cost_of_interventions: number
    net_forgone_roi: number; empathy_roi_multiplier: number
    empathy_score_trend: number[]
    highest_roi_intervention: Record<string, unknown>
    lowest_roi_non_decision: Record<string, unknown>
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
    decayItems: () => fetchApi<KVDecayItem[]>('/knowledge-vault/decay'),
    interviewSessions: () => fetchApi<KVInterviewSession[]>('/knowledge-vault/interview-sessions'),
    transferMatrix: () => fetchApi<KVTransferEntry[]>('/knowledge-vault/transfer-matrix'),
    undocumented: () => fetchApi<KVUndocumentedRegion[]>('/knowledge-vault/undocumented'),
    onboardingInsights: () => fetchApi<KVOnboardingInsight[]>('/knowledge-vault/onboarding-insights'),
    decisionChains: () => fetchApi<KVDecisionChainLink[]>('/knowledge-vault/decision-chains'),
    extractionSession: () => fetchApi<KVExtractionSession>('/knowledge-vault/extraction-session'),
    decisionNodes: () => fetchApi<KVDecisionNodeObj[]>('/knowledge-vault/decision-nodes'),
    constraintAlerts: () => fetchApi<KVConstraintAlert[]>('/knowledge-vault/constraint-alerts'),
    knowledgeDecayScores: () => fetchApi<KVKnowledgeDecayEntry[]>('/knowledge-vault/knowledge-decay-scores'),
    assetValuations: () => fetchApi<KVAssetValuation[]>('/knowledge-vault/asset-valuations'),
    mortalityTimeline: () => fetchApi<KVMortalityTimeline>('/knowledge-vault/mortality-timeline'),
    departureExposure: () => fetchApi<KVDepartureExposure>('/knowledge-vault/departure-exposure'),
    mortalitySummary: () => fetchApi<Record<string, unknown>>('/knowledge-vault/mortality-summary'),
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
export interface KVDecayItem {
    module_id: string; module_label: string; last_validated: string
    days_since_validated: number; decay_score: number; code_changes_since: number
    owner: string; status: string
}
export interface KVInterviewSession {
    id: string; senior_dev: string; module: string; status: string
    scheduled_date: string; topics: string[]; decisions_captured: number
    coverage_before: number; coverage_after: number
}
export interface KVTransferEntry {
    from_dev: string; to_dev: string; module: string; progress: number
    sessions_completed: number; sessions_total: number; last_session: string
    status: string
}
export interface KVUndocumentedRegion {
    code_path: string; complexity_score: number; lines: number
    last_modified: string; modified_by: string; reason_suspected: string
    priority: string
}
export interface KVOnboardingInsight {
    question: string; ask_count: number; avg_confidence: number
    has_documented_answer: boolean; gap_module: string; last_asked: string
}
export interface KVDecisionChainLink {
    from_decision: string; to_decision: string; relationship: string
    impact_radius: number; description: string
}
export interface KVDashboard {
    nodes: KVNode[]
    interview_history: KVInterviewMessage[]
    decisions: KVDecision[]
    risk_score: KVRiskScore
    recent_extractions: KVExtraction[]
    onboarding_queries: KVOnboardingQuery[]
    archaeology_results: KVArchaeologyResult[]
    decay_items: KVDecayItem[]
    interview_sessions: KVInterviewSession[]
    transfer_matrix: KVTransferEntry[]
    undocumented_regions: KVUndocumentedRegion[]
    onboarding_insights: KVOnboardingInsight[]
    decision_chains: KVDecisionChainLink[]
    extraction_session: KVExtractionSession
    decision_nodes: KVDecisionNodeObj[]
    constraint_alerts: KVConstraintAlert[]
    knowledge_decay_scores: KVKnowledgeDecayEntry[]
    asset_valuations: KVAssetValuation[]
    mortality_timeline: KVMortalityTimeline
    departure_exposure: KVDepartureExposure
}

// ── Contextual Extraction Engine types ──

export interface KVExtractionMsg {
    role: string; text: string
    decision_logged: boolean; constraint_logged: boolean
}
export interface KVExtractionSession {
    id: string; target_dev: string; commits_analysed: number
    bus_factor_modules: number; trigger_file: string
    trigger_ownership_pct: number; status: string
    messages: KVExtractionMsg[]; decisions_captured: number
    constraints_captured: number
}
export interface KVDecisionNodeObj {
    id: string; decision: string; context: string
    alternatives_rejected: { name: string; reason: string }[]
    constraint_type: string; constraint_detail: string
    constraint_re_eval_trigger: string; captured_date: string
    source_dev: string; source_type: string
    code_regions: { file: string; lines: string }[]
    status: string
}
export interface KVConstraintAlert {
    id: string; decision_node_id: string; pr_number: number
    pr_author: string; file_modified: string; lines_modified: string
    constraint_violated: string; severity: string
    auto_comment_posted: boolean; date: string; resolution: string
}

// ── Knowledge Mortality Forecaster types ──

export interface KVKnowledgeDecayEntry {
    code_region: string; primary_holder: string; ownership_pct: number
    decision_complexity: string; months_since_decision: number
    months_since_last_touch: number
    kds_at_decision: number; kds_6mo: number; kds_12mo: number
    kds_18mo: number; kds_current: number; kds_projected_36mo: number
    critical_threshold_date: string; months_to_critical: number
}
export interface KVAssetValuation {
    code_region: string; module_label: string
    reconstruction_hours: number; hourly_rate: number
    reconstruction_cost: number; expected_incidents: number
    avg_incident_cost: number; sla_penalty_exposure: number
    total_kav: number; current_kds: number
    recoverable_value: number; already_irrecoverable: number
    extraction_cost: number; extraction_hours: number
    extraction_roi: number
}
export interface KVMortalityTimelineEntry {
    priority: string; code_region: string; module_label: string
    kds: number; kav: number; expiry_date: string; holder: string
}
export interface KVMortalityTimeline {
    org: string; quarter: string
    entries: KVMortalityTimelineEntry[]
    total_at_imminent_risk: number; recommended_sessions: number
    recommended_hours: number; preservation_roi: number
    extraction_cost: number
}
export interface KVDepartureExposure {
    dev: string; signal: string; signal_date: string
    modules_affected: number; combined_kav: number
    recoverable_with_extraction: number; extraction_sessions: number
    extraction_hours: number; irrecoverable_immediately: number
    already_documented: number; action_window_days: number
    first_critical_expiry: string; extraction_cost: number
    preservation_roi: number
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
    // Cross-Tool Friction Heatmap
    weeklyFriction: () => fetchApi<TCDevWeeklyFriction[]>('/toolchain-radar/weekly-friction'),
    recoveryTimes: () => fetchApi<TCRecoveryTimeEntry[]>('/toolchain-radar/recovery-times'),
    frictionTrends: () => fetchApi<TCFrictionTrendWeek[]>('/toolchain-radar/friction-trends'),
    frictionSummary: () => fetchApi<TCFrictionSummary>('/toolchain-radar/friction-summary'),
    // Cognitive Debt Accumulator
    cognitiveDebtScores: () => fetchApi<TCCognitiveDebtScore[]>('/toolchain-radar/cognitive-debt-scores'),
    teamDebtForecast: () => fetchApi<TCTeamDebtForecast[]>('/toolchain-radar/team-debt-forecast'),
    roiTriggers: () => fetchApi<TCToolchainROITrigger[]>('/toolchain-radar/roi-triggers'),
    cognitiveDebtSummary: () => fetchApi<TCCognitiveDebtSummary>('/toolchain-radar/cognitive-debt-summary'),
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

// ── Cross-Tool Friction Heatmap types ──

export interface TCWeeklyFrictionCell {
    day: string; transition: string; switches: number; hours_lost: number; intensity: number
}
export interface TCDevWeeklyFriction {
    developer: string; week_label: string; total_friction_hrs: number
    org_cost_estimate: number; cells: TCWeeklyFrictionCell[]
    top_transition: string; flow_pct: number
}
export interface TCRecoveryTimeEntry {
    transition: string; avg_recovery_min: number; p95_recovery_min: number
    sample_count: number; task_driven_pct: number
}
export interface TCFrictionTrendWeek {
    week: string; total_switches: number; total_hrs_lost: number
    avg_recovery_min: number; cost_estimate: number
}
export interface TCFrictionSummary {
    total_weekly_friction_hrs: number; total_weekly_cost: number; avg_flow_pct: number
    highest_friction_developer: string; highest_friction_hrs: number
    worst_recovery_transition: string; worst_recovery_min: number
    trend_direction: string; developers_tracked: number
}

// ── Cognitive Debt Accumulator types ──

export interface TCCognitiveDebtSignal {
    signal: string; weight: number; current_value: string; level: string
}
export interface TCCognitiveDebtScore {
    developer: string; score: number; zone: string
    signals: TCCognitiveDebtSignal[]; predicted_cliff_min: number
    recommended_action: string; last_deep_focus_min_ago: number; concurrent_prs: number
}
export interface TCTeamDebtForecast {
    developer: string; mon: number; tue: number; wed: number; thu: number; fri: number
    avg_score: number; chronic_warning_days: number; primary_cause: string
}
export interface TCToolchainROITrigger {
    combination: string; avg_cognitive_debt: number; comparison_debt: number
    comparison_label: string; weekly_cost_hrs: number; recommendation: string; severity: string
}
export interface TCCognitiveDebtSummary {
    avg_team_score: number; team_zone: string; developers_in_danger: number
    developers_in_warning: number; nearest_cliff_developer: string
    nearest_cliff_min: number; chronic_warning_developers: string[]
    critical_roi_triggers: number; total_weekly_roi_cost_hrs: number
}

export interface ToolchainRadarDashboard {
    developers: TCDeveloper[]
    transition_matrix: TCTransition[]
    hourly_timeline: TCHourlySlot[]
    friction_by_task: TCFrictionByTask[]
    tool_usage: TCToolUsage[]
    // Cross-Tool Friction Heatmap
    weekly_friction: TCDevWeeklyFriction[]
    recovery_times: TCRecoveryTimeEntry[]
    friction_trends: TCFrictionTrendWeek[]
    // Cognitive Debt Accumulator
    cognitive_debt_scores: TCCognitiveDebtScore[]
    team_debt_forecast: TCTeamDebtForecast[]
    roi_triggers: TCToolchainROITrigger[]
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
    // AI Waste Classifier
    wasteEntries: () => fetchApi<OCWasteEntry[]>('/org-cascade/waste-entries'),
    wasteTrends: () => fetchApi<OCWasteWeeklyTrend[]>('/org-cascade/waste-trends'),
    trueAiRoi: () => fetchApi<OCTrueAIROI>('/org-cascade/true-ai-roi'),
    teamWaste: () => fetchApi<OCTeamWasteBreakdown[]>('/org-cascade/team-waste'),
    // DORA-AI Cascade
    cascadeEfficiency: () => fetchApi<OCCascadeEfficiency>('/org-cascade/cascade-efficiency'),
    teamCascades: () => fetchApi<OCTeamCascadeView[]>('/org-cascade/team-cascades'),
    flowDetails: () => fetchApi<OCFlowStageDetail[]>('/org-cascade/flow-details'),
    storyPoints: () => fetchApi<OCStoryPointTracker[]>('/org-cascade/story-points'),
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

// ── AI Waste Classifier types ──

export interface OCWasteEntry {
    waste_type: string; label: string; hours_consumed: number
    detection_source: string; severity: string; detail: string; color: string
}
export interface OCWasteWeeklyTrend {
    week: string
    rework: number; review_overflow: number; context_switch: number
    quality_tax: number; coordination: number
    total_waste: number; gross_gain: number; net_gain: number
}
export interface OCTrueAIROI {
    period: string; ai_assisted_commits: number; gross_hours_saved: number
    waste_breakdown: { type: string; hours: number; pct: number }[]
    net_org_gain: number; waste_absorption_rate: number
}
export interface OCTeamWasteBreakdown {
    team: string; total_waste_hrs: number; dominant_waste: string
    rework: number; review_overflow: number; context_switch: number
    quality_tax: number; coordination: number; waste_absorption_rate: number
}

// ── DORA-AI Cascade types ──

export interface OCCascadeEfficiency {
    score: number; individual_gain_pct: number; team_throughput_pct: number
    org_delivery_pct: number; trend: string
    leak_stages: { stage: string; loss_pct: number; reason: string }[]
}
export interface OCTeamCascadeView {
    team: string; ai_usage_pct: number; pr_volume: number
    pr_review_latency_hrs: number; deploy_frequency: number
    lead_time_days: number; cascade_efficiency: number
    waste_absorption_rate: number; platform_maturity: string
}
export interface OCFlowStageDetail {
    stage: string; source: string; value_in: number; value_out: number
    loss: number; leak_reason: string; color: string
}
export interface OCStoryPointTracker {
    sprint: string; planned: number; completed: number
    ai_assisted_pct: number; delivery_rate: number
}

export interface OrgCascadeDashboard {
    summary: OrgGapSummary
    dora_metrics: OCDoraMetric[]
    bottlenecks: OCBottleneck[]
    amplifiers: OCAmplifier[]
    cascade_flow: OCCascadeStage[]
    roi_report: OCRoiReportEntry[]
    dora_correlations: OCDoraCorrelation[]
    // AI Waste Classifier
    waste_entries: OCWasteEntry[]
    waste_trends: OCWasteWeeklyTrend[]
    true_ai_roi: OCTrueAIROI
    team_waste: OCTeamWasteBreakdown[]
    // DORA-AI Cascade
    cascade_efficiency: OCCascadeEfficiency
    team_cascades: OCTeamCascadeView[]
    flow_details: OCFlowStageDetail[]
    story_points: OCStoryPointTracker[]
}
