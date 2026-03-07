import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Download, Zap, RefreshCw, Eye, GitBranch, Lock, Layers } from 'lucide-react'
import {
    debtRadarApi, type DebtRadarDashboard,
    type DRPreCommitScan, type DRSprintDebtProjection,
    type DRModuleCouplingDrift, type DRServiceBoundaryViolation,
    type DRGenerativeMonoculture, type DRArchitecturalHealthScore,
    type DRArchDriftSummary,
} from '../api/client'

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

export default function DebtRadar() {
    const [loading, setLoading] = useState(true)

    // API-driven state
    const [modules, setModules] = useState<{ name: string; risk: number; level: string; label: string }[]>([])
    const [sprintDebt, setSprintDebt] = useState<{ sprint: string; debt: number; budget: number }[]>([])
    const [refactorQueue, setRefactorQueue] = useState<{ file: string; line: number; reason: string; urgency: string; effort_hrs: number; debt_reduction: number; ai_pct: number }[]>([])
    const [stagedFiles, setStagedFiles] = useState<{ file: string; ai_pct: number; churn_risk: number; pattern_issues: number; debt_score: number; verdict: string }[]>([])
    const [survivalPredictions, setSurvivalPredictions] = useState<{ file: string; block: string; lines: string; ai_pct: number; survival_prob: number; risk_factors: string[]; predicted_lifespan_days: number }[]>([])
    const [budgetTracker, setBudgetTracker] = useState<{ ceiling: number; current: number; sprint_added: number; sprint_resolved: number; trend: string; alert_threshold: number; weeks_to_breach: number }>({ ceiling: 2000, current: 1240, sprint_added: 420, sprint_resolved: 70, trend: 'rising', alert_threshold: 80, weeks_to_breach: 3 })

    // New feature state
    const [preCommitScans, setPreCommitScans] = useState<DRPreCommitScan[]>([])
    const [sprintProjections, setSprintProjections] = useState<DRSprintDebtProjection[]>([])
    const [couplingDrift, setCouplingDrift] = useState<DRModuleCouplingDrift | null>(null)
    const [boundaryViolations, setBoundaryViolations] = useState<DRServiceBoundaryViolation[]>([])
    const [monocultures, setMonocultures] = useState<DRGenerativeMonoculture[]>([])
    const [archHealth, setArchHealth] = useState<DRArchitecturalHealthScore | null>(null)
    const [archDriftSummary, setArchDriftSummary] = useState<DRArchDriftSummary | null>(null)
    const [activeScanIdx, setActiveScanIdx] = useState(0)

    useEffect(() => {
        debtRadarApi.dashboard().then((d) => {
            setModules(d.modules)
            setSprintDebt(d.sprint_debt)
            setRefactorQueue(d.refactor_queue.map((r) => ({
                file: r.file, line: r.line, reason: r.reason, urgency: r.urgency,
                effort_hrs: r.effort_hrs, debt_reduction: r.debt_reduction, ai_pct: r.ai_pct,
            })))
            setStagedFiles(d.staged_files.map((s) => ({
                file: s.file, ai_pct: s.ai_pct, churn_risk: s.churn_risk,
                pattern_issues: s.pattern_issues, debt_score: s.debt_score, verdict: s.verdict,
            })))
            setSurvivalPredictions(d.survival_predictions.map((p) => ({
                file: p.file, block: p.block, lines: p.lines, ai_pct: p.ai_pct,
                survival_prob: p.survival_prob, risk_factors: p.risk_factors,
                predicted_lifespan_days: p.predicted_lifespan_days,
            })))
            setBudgetTracker(d.budget_tracker)
            // New features from dashboard
            if (d.pre_commit_scans) setPreCommitScans(d.pre_commit_scans)
            if (d.sprint_debt_projections) setSprintProjections(d.sprint_debt_projections)
            if (d.module_coupling_drift) setCouplingDrift(d.module_coupling_drift)
            if (d.service_boundary_violations) setBoundaryViolations(d.service_boundary_violations)
            if (d.generative_monocultures) setMonocultures(d.generative_monocultures)
            if (d.architectural_health_score) setArchHealth(d.architectural_health_score)
            // Fetch computed summary
            debtRadarApi.archDriftSummary().then(setArchDriftSummary).catch(() => {})
            setLoading(false)
        }).catch((err) => { console.error('DebtRadar fetch error:', err); setLoading(false) })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Debt Radar…</div>
            </div>
        )
    }

    const budgetPct = Math.round((budgetTracker.current / budgetTracker.ceiling) * 100)
    const budgetColor = budgetPct >= budgetTracker.alert_threshold ? '#EF4444' : budgetPct >= 60 ? '#F59E0B' : '#10B981'

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Debt Radar</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        AI-Induced Technical Debt — catch it before it reaches production
                    </p>
                </div>
                <button className="btn-primary" onClick={() => {
                    const blob = new Blob([JSON.stringify({ modules, sprintDebt, refactorQueue, stagedFiles, survivalPredictions, budgetTracker }, null, 2)], { type: 'application/json' })
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'debt-report.json'; a.click()
                }}>
                    <Download size={13} /> Export Debt Report
                </button>
            </div>

            {/* ══════ Status Cards ══════ */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-5 text-center glow-danger">
                    <p className="section-title">Total Debt Score</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#EF4444' }}>{budgetTracker.current.toLocaleString()}</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>of {budgetTracker.ceiling.toLocaleString()} budget</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Files at Risk</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>{modules.filter(m => m.level !== 'green').length + stagedFiles.filter(s => s.verdict !== 'pass').length}</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Needing attention</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">14-Day Survival</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>
                        {survivalPredictions.length > 0 ? Math.round(survivalPredictions.reduce((s, p) => s + p.survival_prob, 0) / survivalPredictions.length) : 0}%
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Avg survival probability</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Budget Remaining</p>
                    <p className="text-4xl font-black mt-2" style={{ color: budgetColor }}>{100 - budgetPct}%</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                        {budgetTracker.weeks_to_breach > 0 ? `~${budgetTracker.weeks_to_breach} weeks to breach` : 'Budget exceeded!'}
                    </p>
                </div>
            </div>

            {/* ══════ Pre-commit AI Debt Scorer ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Shield size={16} style={{ color: '#00D4FF' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🛡️ Pre-commit AI Debt Scorer</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Scores staged AI-generated code for churn risk BEFORE it's committed
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }} onClick={() => {
                            debtRadarApi.rescan().then(setStagedFiles).catch(() => {})
                        }}>
                            <RefreshCw size={11} /> Rescan
                        </button>
                        <span className="badge-amber">{stagedFiles.filter(s => s.verdict === 'block').length} blocked · {stagedFiles.filter(s => s.verdict === 'warn').length} warnings</span>
                    </div>
                </div>
                <div className="space-y-3">
                    {stagedFiles.map((s, i) => {
                        const verdictMap: Record<string, { emoji: string; color: string; label: string }> = {
                            block: { emoji: '🚫', color: '#EF4444', label: 'BLOCKED' },
                            warn: { emoji: '⚠️', color: '#F59E0B', label: 'WARNING' },
                            pass: { emoji: '✅', color: '#10B981', label: 'PASS' },
                        }
                        const v = verdictMap[s.verdict] || verdictMap.warn
                        return (
                            <div
                                key={i}
                                className="p-4 rounded-xl"
                                style={{
                                    background: `${v.color}08`,
                                    border: `1px solid ${v.color}25`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{v.emoji}</span>
                                        <span className="font-mono text-sm font-bold text-white">{s.file}</span>
                                        <span
                                            className="text-xs font-bold px-2 py-0.5 rounded"
                                            style={{ background: `${v.color}15`, color: v.color, border: `1px solid ${v.color}30` }}
                                        >
                                            {v.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-lg font-black" style={{ color: v.color }}>{s.debt_score}</span>
                                        <span className="text-xs ml-1" style={{ color: '#94A3B8' }}>pts</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-xs" style={{ color: '#94A3B8' }}>
                                    <span>AI content: <span className="font-bold" style={{ color: s.ai_pct > 80 ? '#EF4444' : '#F59E0B' }}>{s.ai_pct}%</span></span>
                                    <span>Churn risk: <span className="font-bold" style={{ color: s.churn_risk > 70 ? '#EF4444' : '#F59E0B' }}>{s.churn_risk}%</span></span>
                                    <span>Pattern issues: <span className="font-bold" style={{ color: s.pattern_issues > 3 ? '#EF4444' : '#F59E0B' }}>{s.pattern_issues}</span></span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ══════ 14-Day Survival Predictor ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Zap size={16} style={{ color: '#7C3AED' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🔮 14-Day Survival Predictor</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                ML model predicting whether AI-generated code blocks will survive 2 weeks
                            </p>
                        </div>
                    </div>
                    <span className="badge-red">{survivalPredictions.filter(p => p.survival_prob < 50).length} high-risk blocks</span>
                </div>
                <div className="space-y-3">
                    {survivalPredictions.map((p, i) => {
                        const survColor = p.survival_prob >= 70 ? '#10B981' : p.survival_prob >= 40 ? '#F59E0B' : '#EF4444'
                        return (
                            <div
                                key={i}
                                className="p-4 rounded-xl"
                                style={{
                                    background: `${survColor}06`,
                                    border: `1px solid ${survColor}20`,
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-sm font-bold text-white">{p.file}</span>
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>L{p.lines}</span>
                                        </div>
                                        <p className="text-xs font-medium mb-2" style={{ color: '#94A3B8' }}>
                                            <span className="text-white">{p.block}</span> — {p.ai_pct}% AI-generated
                                        </p>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {p.risk_factors.map((rf, j) => (
                                                <span
                                                    key={j}
                                                    className="text-xs px-2 py-0.5 rounded"
                                                    style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}
                                                >
                                                    {rf}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="flex items-center gap-1">
                                            <span className="text-2xl font-black" style={{ color: survColor }}>{p.survival_prob}%</span>
                                        </div>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>survival</p>
                                        <p className="text-xs mt-1" style={{ color: survColor }}>~{p.predicted_lifespan_days}d lifespan</p>
                                    </div>
                                </div>
                                <div className="mt-2 progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${p.survival_prob}%`, background: `linear-gradient(90deg, ${survColor}88, ${survColor})` }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ══════ Codebase Debt Heatmap ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔥 Codebase Debt Heatmap</h3>
                    <div className="space-y-3">
                        {modules.map((m) => (
                            <div key={m.name}>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-mono" style={{ color: '#94A3B8' }}>{m.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-bold text-xs px-2 py-0.5 rounded"
                                            style={{
                                                background: `${riskColors[m.level]}15`,
                                                color: riskColors[m.level],
                                                border: `1px solid ${riskColors[m.level]}30`,
                                            }}
                                        >
                                            {m.label}
                                        </span>
                                        <span className="font-bold" style={{ color: riskColors[m.level] }}>
                                            {m.risk}%
                                        </span>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${m.risk}%`,
                                            background: `linear-gradient(90deg, ${riskColors[m.level]}66, ${riskColors[m.level]})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ══════ AI Debt Accumulation Timeline ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">📈 AI Debt Accumulation Timeline</h3>
                    <p className="text-xs mb-4" style={{ color: '#EF4444' }}>
                        ⚠️ Exponential growth detected — AI debt is compounding beyond budget
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={sprintDebt}>
                            <defs>
                                <linearGradient id="debtGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Area type="monotone" dataKey="budget" stroke="#10B981" strokeWidth={1.5} strokeDasharray="6 4" fill="url(#budgetGrad)" name="Budget Ceiling" />
                            <Area type="monotone" dataKey="debt" stroke="#EF4444" strokeWidth={2.5} fill="url(#debtGrad)" name="Actual Debt" dot={{ r: 4, fill: '#EF4444' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <p className="text-xs mt-2 text-center" style={{ color: '#EF4444' }}>
                        ⚠️ Debt crossed budget line at Sprint 4 — currently {budgetPct}% of ceiling
                    </p>
                </div>
            </div>

            {/* ══════ Tech Debt Budget Tracker ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">💰 Tech Debt Budget Tracker</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Org-level debt ceiling — alerts when AI debt crosses threshold
                        </p>
                    </div>
                    <span className={budgetPct >= budgetTracker.alert_threshold ? 'badge-red' : 'badge-amber'}>
                        {budgetPct >= budgetTracker.alert_threshold ? '🚨 ALERT: Over threshold' : `${budgetPct}% of budget used`}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Budget gauge */}
                    <div>
                        <div className="flex items-end gap-2 mb-3">
                            <span className="text-5xl font-black" style={{ color: budgetColor }}>{budgetTracker.current.toLocaleString()}</span>
                            <span className="text-xl font-bold mb-1" style={{ color: '#94A3B8' }}>/ {budgetTracker.ceiling.toLocaleString()}</span>
                        </div>
                        <div className="progress-bar mb-4" style={{ height: 12 }}>
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(budgetPct, 100)}%`,
                                    background: `linear-gradient(90deg, ${budgetColor}88, ${budgetColor})`,
                                    height: '100%',
                                    borderRadius: 6,
                                }}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                                <p className="text-lg font-black" style={{ color: '#EF4444' }}>+{budgetTracker.sprint_added}</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Added this sprint</p>
                            </div>
                            <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                <p className="text-lg font-black" style={{ color: '#10B981' }}>-{budgetTracker.sprint_resolved}</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Resolved this sprint</p>
                            </div>
                        </div>
                    </div>

                    {/* Budget breakdown */}
                    <div>
                        <p className="section-title mb-3">Budget Health Indicators</p>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>Alert Threshold</span>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number" min={50} max={100}
                                        className="w-14 text-sm font-bold text-right bg-transparent border-b border-slate-600 focus:border-cyan-400 outline-none"
                                        style={{ color: budgetPct >= budgetTracker.alert_threshold ? '#EF4444' : '#F59E0B' }}
                                        value={budgetTracker.alert_threshold}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value)
                                            if (!isNaN(val)) setBudgetTracker(prev => ({ ...prev, alert_threshold: val }))
                                        }}
                                        onBlur={() => debtRadarApi.updateBudgetSettings({ alert_threshold: budgetTracker.alert_threshold }).catch(() => {})}
                                    />
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>Current Usage</span>
                                <span className="text-sm font-bold" style={{ color: budgetColor }}>{budgetPct}%</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>Net Debt / Sprint</span>
                                <span className="text-sm font-bold" style={{ color: '#EF4444' }}>+{budgetTracker.sprint_added - budgetTracker.sprint_resolved}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: budgetTracker.weeks_to_breach <= 4 ? 'rgba(239,68,68,0.08)' : 'rgba(30,45,74,0.5)', border: `1px solid ${budgetTracker.weeks_to_breach <= 4 ? 'rgba(239,68,68,0.2)' : '#1E2D4A'}` }}>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>Weeks to Breach</span>
                                <span className="text-sm font-bold" style={{ color: budgetTracker.weeks_to_breach <= 4 ? '#EF4444' : '#F59E0B' }}>
                                    {budgetTracker.trend === 'rising' ? <TrendingUp size={12} className="inline mr-1" /> : <TrendingDown size={12} className="inline mr-1" />}
                                    ~{budgetTracker.weeks_to_breach} weeks
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════ Refactor Recommendation Engine ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🔧 Refactor Recommendation Engine</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                AI-prioritised blocks that need rewriting now — ranked by debt reduction impact
                            </p>
                        </div>
                    </div>
                    <span className="badge-red">{refactorQueue.filter(r => r.urgency === 'red').length} critical</span>
                </div>
                <div className="space-y-3">
                    {refactorQueue.map((item, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl"
                            style={{
                                background: item.urgency === 'red' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                                border: `1px solid ${item.urgency === 'red' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg shrink-0">{item.urgency === 'red' ? '🔴' : '🟠'}</span>
                                        <span className="text-sm font-mono font-bold text-white">{item.file}:{item.line}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>
                                            {item.ai_pct}% AI
                                        </span>
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{item.reason}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                                        <span>⏱️ Est. effort: <span className="font-bold text-white">{item.effort_hrs}h</span></span>
                                        <span>📉 Debt reduction: <span className="font-bold" style={{ color: '#10B981' }}>-{item.debt_reduction}pts</span></span>
                                    </div>
                                </div>
                                <button className="btn-primary shrink-0" onClick={() => {
                                    debtRadarApi.resolveRefactor(i).then((resolved) => {
                                        setRefactorQueue(prev => prev.filter((_, idx) => idx !== i))
                                        setBudgetTracker(prev => ({
                                            ...prev,
                                            current: Math.max(0, prev.current - resolved.debt_reduction),
                                            sprint_resolved: prev.sprint_resolved + resolved.debt_reduction,
                                        }))
                                    }).catch(() => {})
                                }}>Fix This</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        📊 Fixing all critical items would reduce debt by <span className="text-emerald-400 font-semibold">{refactorQueue.filter(r => r.urgency === 'red').reduce((s, r) => s + r.debt_reduction, 0)} points</span> ({Math.round(refactorQueue.filter(r => r.urgency === 'red').reduce((s, r) => s + r.effort_hrs, 0))} engineering hours).
                    </p>
                </div>
            </div>

            {/* Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(124,58,237,0.06))',
                    border: '1px solid rgba(239,68,68,0.18)',
                }}
            >
                <div className="text-2xl">🛡️</div>
                <div>
                    <p className="text-sm font-semibold text-white">Debt Radar Insight</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        AI-generated code is accumulating debt <span className="text-red-400 font-semibold">10× faster</span> than manual code. The pre-commit scorer blocked <span className="text-emerald-400 font-semibold">{stagedFiles.filter(s => s.verdict === 'block').length} risky commits</span> this sprint. The 14-day survival predictor shows <span className="text-red-400 font-semibold">{survivalPredictions.filter(p => p.survival_prob < 50).length} code blocks</span> likely to be reverted. Budget will breach ceiling in ~{budgetTracker.weeks_to_breach} weeks at current pace.
                    </p>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════════
                ██  ENHANCED PRE-COMMIT DEBT SCORER (8-Signal per-block)
            ═══════════════════════════════════════════════════════════════════ */}
            {preCommitScans.length > 0 && (
                <>
                    <div className="glass-card p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Eye size={16} style={{ color: '#00D4FF' }} />
                                <div>
                                    <h3 className="text-sm font-semibold text-white">🔬 8-Signal Pre-Commit Debt Scanner</h3>
                                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                        Per-block survival probability × debt risk — at the git hook layer, before any push
                                    </p>
                                </div>
                            </div>
                            {/* Scan selector tabs */}
                            <div className="flex items-center gap-2">
                                {preCommitScans.map((scan, i) => (
                                    <button key={i}
                                        className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                                        style={{
                                            background: activeScanIdx === i ? 'rgba(0,212,255,0.15)' : 'rgba(30,45,74,0.5)',
                                            color: activeScanIdx === i ? '#00D4FF' : '#94A3B8',
                                            border: `1px solid ${activeScanIdx === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                        }}
                                        onClick={() => setActiveScanIdx(i)}
                                    >
                                        {scan.developer.split(' ')[0]}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(() => {
                            const scan = preCommitScans[activeScanIdx]
                            if (!scan) return null
                            const gateColor = scan.security_gate === 'BLOCKED' ? '#EF4444' : '#10B981'
                            return (
                                <div>
                                    {/* Scan header */}
                                    <div className="flex items-center justify-between p-3 rounded-lg mb-4" style={{ background: 'rgba(30,45,74,0.4)', border: '1px solid #1E2D4A' }}>
                                        <div className="flex items-center gap-3 text-xs">
                                            <GitBranch size={12} style={{ color: '#94A3B8' }} />
                                            <span style={{ color: '#94A3B8' }}>@{scan.developer}</span>
                                            <span className="font-mono text-white">{scan.branch}</span>
                                            <span className="font-mono" style={{ color: '#00D4FF' }}>{scan.file}</span>
                                        </div>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                            style={{ background: `${gateColor}15`, color: gateColor }}>
                                            {scan.security_gate === 'BLOCKED' ? '🔴 SECURITY BLOCKED' : '✅ SECURITY PASS'}
                                        </span>
                                    </div>

                                    {/* Per-block analysis */}
                                    <div className="space-y-4">
                                        {scan.blocks.map((block) => {
                                            const riskColors: Record<string, string> = { LOW: '#10B981', MEDIUM: '#F59E0B', HIGH: '#F59E0B', CRITICAL: '#EF4444' }
                                            const bc = riskColors[block.risk_level] || '#94A3B8'
                                            return (
                                                <div key={block.block_id} className="p-4 rounded-xl" style={{ background: `${bc}06`, border: `1px solid ${bc}20` }}>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm font-bold text-white">{block.block_id}</span>
                                                            <span className="text-xs font-mono" style={{ color: '#94A3B8' }}>lines {block.lines}</span>
                                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${bc}15`, color: bc }}>
                                                                {block.risk_level}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <div className="text-right">
                                                                <span className="text-2xl font-black" style={{ color: bc }}>{block.survival_pct}%</span>
                                                                <p className="text-xs" style={{ color: '#94A3B8' }}>survival</p>
                                                            </div>
                                                            <span className="text-sm font-bold" style={{ color: bc }}>{block.verdict}</span>
                                                        </div>
                                                    </div>

                                                    {/* 8 signal bars */}
                                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                                        {block.signals.map((sig) => (
                                                            <div key={sig.signal} className="flex items-center gap-2 p-1.5 rounded" style={{ background: 'rgba(30,45,74,0.3)' }}>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-xs font-medium text-white truncate">{sig.signal}</p>
                                                                    <p className="text-xs truncate" style={{ color: '#94A3B8', fontSize: 10 }}>{sig.detail}</p>
                                                                </div>
                                                                <div className="w-16">
                                                                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1E2D4A' }}>
                                                                        <div className="h-full rounded-full" style={{ width: `${Math.min((sig.score_contribution / 30) * 100, 100)}%`, background: sig.score_contribution > 10 ? '#EF4444' : sig.score_contribution > 5 ? '#F59E0B' : '#10B981' }} />
                                                                    </div>
                                                                </div>
                                                                <span className="text-xs font-bold w-8 text-right" style={{ color: sig.score_contribution > 10 ? '#EF4444' : sig.score_contribution > 5 ? '#F59E0B' : '#10B981' }}>
                                                                    {sig.score_contribution.toFixed(1)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Security findings */}
                                                    {block.security_findings.length > 0 && (
                                                        <div className="space-y-2 mb-2">
                                                            {block.security_findings.map((sf, j) => (
                                                                <div key={j} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                                                                    <Lock size={12} style={{ color: '#EF4444' }} />
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xs font-bold text-red-400">{sf.pattern}</span>
                                                                            <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{sf.owasp_id}</span>
                                                                            <span className="text-xs font-bold" style={{ color: sf.cvss >= 9 ? '#EF4444' : '#F59E0B' }}>CVSS {sf.cvss}</span>
                                                                        </div>
                                                                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>L{sf.line}: {sf.description}</p>
                                                                    </div>
                                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{sf.severity}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* DRY / Duplicate notes */}
                                                    {(block.dry_violation || block.duplicate_detail) && (
                                                        <div className="flex items-center gap-4 text-xs" style={{ color: '#F59E0B' }}>
                                                            {block.dry_violation && <span>🔁 DRY: {block.dry_violation}</span>}
                                                            {block.duplicate_detail && <span>📋 {block.duplicate_detail}</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Sprint debt projection */}
                                    <div className="grid grid-cols-3 gap-3 mt-4">
                                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>If committed as-is</p>
                                            <p className="text-lg font-black" style={{ color: '#EF4444' }}>+{scan.debt_hours_if_committed}h</p>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>debt-hours added</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>If rewritten</p>
                                            <p className="text-lg font-black" style={{ color: '#10B981' }}>-{(scan.debt_hours_if_committed - scan.debt_hours_if_rewritten).toFixed(1)}h</p>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>{scan.debt_reduction_pct}% debt reduction</p>
                                        </div>
                                        <div className="text-center p-3 rounded-lg" style={{ background: `${gateColor}06`, border: `1px solid ${gateColor}15` }}>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>Security Gate</p>
                                            <p className="text-lg font-black" style={{ color: gateColor }}>{scan.security_gate}</p>
                                            {scan.security_gate_reason && <p className="text-xs mt-0.5" style={{ color: '#EF4444' }}>{scan.security_gate_reason.slice(0, 60)}…</p>}
                                        </div>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>

                    {/* Sprint Debt Projections Chart */}
                    {sprintProjections.length > 0 && (
                        <div className="glass-card p-5">
                            <h3 className="text-sm font-semibold text-white mb-1">📊 Sprint Debt Projection — Commit vs. Rewrite</h3>
                            <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>If all flagged blocks are committed as-is vs. rewritten before commit</p>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={sprintProjections}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                    <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                                    <Bar dataKey="projected_debt" name="If Committed" fill="#EF4444" opacity={0.8} radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="if_all_rewritten" name="If Rewritten" fill="#10B981" opacity={0.8} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                    💡 Pre-commit rewrites could save <span className="text-emerald-400 font-semibold">{sprintProjections.reduce((s, p) => s + p.savings, 0).toLocaleString()} debt points</span> over the next {sprintProjections.length} sprints — a {Math.round((sprintProjections.reduce((s, p) => s + p.savings, 0) / sprintProjections.reduce((s, p) => s + p.projected_debt, 0)) * 100)}% reduction.
                                </p>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                ██  ARCHITECTURAL DRIFT MONITOR
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Layers size={18} style={{ color: '#7C3AED' }} />
                        <div>
                            <h3 className="text-base font-bold text-white">🏗️ Architectural Drift Monitor</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Detect when AI is silently reshaping your system's architecture without human approval
                            </p>
                        </div>
                    </div>
                    {archDriftSummary && (
                        <span className={archDriftSummary.overall_ahs < 30 ? 'badge-red' : archDriftSummary.overall_ahs < 50 ? 'badge-amber' : 'badge-green'}>
                            AHS: {archDriftSummary.overall_ahs}/100
                        </span>
                    )}
                </div>
            </div>

            {/* Arch Drift Summary KPIs */}
            {archDriftSummary && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Layers size={16} style={{ color: '#7C3AED' }} />
                        <h3 className="text-sm font-semibold text-white">📊 Architectural Drift Summary</h3>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-5 gap-3">
                        {[
                            { label: 'Overall AHS', value: `${archDriftSummary.overall_ahs}/100`, color: archDriftSummary.overall_ahs < 30 ? '#EF4444' : archDriftSummary.overall_ahs < 50 ? '#F59E0B' : '#10B981' },
                            { label: 'Drift Velocity', value: `${archDriftSummary.drift_velocity} pts/wk`, color: '#EF4444' },
                            { label: 'SBVT Violations', value: archDriftSummary.total_sbvt_violations, color: '#EF4444' },
                            { label: 'Monoculture Alerts', value: archDriftSummary.total_monoculture_alerts, color: '#F59E0B' },
                            { label: 'AI Coupling', value: `${archDriftSummary.ai_coupling_pct}%`, color: '#F59E0B' },
                        ].map((kpi) => (
                            <div key={kpi.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{kpi.label}</p>
                                <p className="text-lg font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Fix Now</p>
                            <p className="text-xl font-black" style={{ color: '#10B981' }}>${(archDriftSummary.remediation_cost_now / 1000).toFixed(0)}K</p>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Fix Later (8wk)</p>
                            <p className="text-xl font-black" style={{ color: '#EF4444' }}>${(archDriftSummary.remediation_cost_projected / 1000).toFixed(0)}K</p>
                            <p className="text-xs" style={{ color: '#EF4444' }}>5× multiplier</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Module Coupling Drift */}
            {couplingDrift && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <GitBranch size={16} style={{ color: '#F59E0B' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🔗 Module Coupling Drift — {couplingDrift.sprint_range}</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    {couplingDrift.interpretation}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black"
                                style={{ background: `${couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B'}10`, color: couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B', border: `2px solid ${couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B'}33` }}>
                                {couplingDrift.drift_score}
                            </div>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B'}15`, color: couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B' }}>
                                {couplingDrift.drift_level}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                    {['Module Pair', 'Baseline', 'Current', 'AI %', 'Danger'].map((h) => (
                                        <th key={h} className="text-left pb-2 pr-3 section-title font-semibold" style={{ fontSize: 11 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {couplingDrift.pairs.map((pair) => {
                                    const aiColor = pair.ai_attributed_pct >= 90 ? '#EF4444' : pair.ai_attributed_pct >= 70 ? '#F59E0B' : '#94A3B8'
                                    return (
                                        <tr key={`${pair.module_a}-${pair.module_b}`} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                            <td className="py-2 pr-3 text-white font-medium">{pair.module_a} ↔ {pair.module_b}</td>
                                            <td className="py-2 pr-3 text-xs" style={{ color: '#94A3B8' }}>{pair.baseline_coupling === 0 ? 'None' : `Low (${pair.baseline_coupling})`}</td>
                                            <td className="py-2 pr-3 text-xs font-bold" style={{ color: pair.current_coupling >= 7 ? '#EF4444' : '#F59E0B' }}>
                                                {pair.current_coupling >= 7 ? 'High' : pair.current_coupling >= 3 ? 'Medium' : 'Low'} ({pair.current_coupling})
                                            </td>
                                            <td className="py-2 pr-3">
                                                <span className="text-xs font-bold" style={{ color: aiColor }}>{pair.ai_attributed_pct}%</span>
                                            </td>
                                            <td className="py-2 text-xs" style={{ color: pair.danger_note ? '#EF4444' : '#94A3B8' }}>
                                                {pair.danger_note || '—'}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>New Couplings</p>
                            <p className="text-lg font-bold text-white">{couplingDrift.new_couplings_total}</p>
                        </div>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>AI-Attributed</p>
                            <p className="text-lg font-bold" style={{ color: '#EF4444' }}>{couplingDrift.ai_attributed_couplings} ({couplingDrift.ai_coupling_pct}%)</p>
                        </div>
                        <div className="p-2 rounded-lg" style={{ background: `${couplingDrift.drift_score >= 70 ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)'}` }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Drift Score</p>
                            <p className="text-lg font-bold" style={{ color: couplingDrift.drift_score >= 70 ? '#EF4444' : '#F59E0B' }}>{couplingDrift.drift_score}/100</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Boundary Violations */}
            {boundaryViolations.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Lock size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🚧 Service Boundary Violations (SBVT)</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    AI-generated commits violating architectural service contracts
                                </p>
                            </div>
                        </div>
                        <span className="badge-red">{boundaryViolations.filter(v => v.severity === 'CRITICAL').length} critical</span>
                    </div>
                    <div className="space-y-3">
                        {boundaryViolations.map((v) => {
                            const sevColors: Record<string, string> = { CRITICAL: '#EF4444', HIGH: '#F59E0B', MEDIUM: '#00D4FF' }
                            const sc = sevColors[v.severity] || '#94A3B8'
                            return (
                                <div key={v.violation_id} className="p-4 rounded-xl" style={{ background: `${sc}06`, border: `1px solid ${sc}20` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold" style={{ color: sc }}>{v.violation_id}</span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${sc}15`, color: sc }}>{v.severity}</span>
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>@{v.developer} · {v.commit_hash}</span>
                                        </div>
                                        <span className="text-xs font-bold" style={{ color: v.ai_origin_pct >= 90 ? '#EF4444' : '#F59E0B' }}>{v.ai_origin_pct}% AI-origin</span>
                                    </div>
                                    <p className="text-xs font-bold text-white mb-1">{v.violation_type}</p>
                                    <p className="text-xs mb-1 font-mono" style={{ color: '#94A3B8' }}>{v.detected_in}</p>
                                    <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>{v.violation_detail}</p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs" style={{ color: '#10B981' }}>💡 {v.recommendation}</p>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span style={{ color: '#10B981' }}>Now: <span className="font-bold">{v.sprint_remediation_hrs}h</span></span>
                                            <span style={{ color: '#EF4444' }}>Later: <span className="font-bold">{v.deferred_cost_hrs}h</span></span>
                                            {v.auto_fix_available && (
                                                <span className="px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>Auto-fix available</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Generative Monoculture Detector */}
            {monocultures.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🧬 Generative Monoculture Detector</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    AI models converge on the same flawed pattern — if it's vulnerable, all instances are simultaneously exploitable
                                </p>
                            </div>
                        </div>
                        <span className="badge-red">{monocultures.filter(m => m.flaw_confirmed).length} confirmed flaws</span>
                    </div>
                    <div className="space-y-4">
                        {monocultures.map((mc) => {
                            const riskColors: Record<string, string> = { CRITICAL: '#EF4444', HIGH: '#F59E0B', MEDIUM: '#00D4FF', LOW: '#10B981' }
                            const rc = riskColors[mc.risk_level] || '#94A3B8'
                            return (
                                <div key={mc.pattern_id} className="p-4 rounded-xl" style={{ background: `${rc}06`, border: `1px solid ${rc}20` }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono font-bold" style={{ color: rc }}>{mc.pattern_id}</span>
                                            <span className="text-sm font-bold text-white">{mc.pattern_name}</span>
                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${rc}15`, color: rc }}>{mc.risk_level}</span>
                                        </div>
                                        {mc.cvss && <span className="text-xs font-bold" style={{ color: mc.cvss >= 8 ? '#EF4444' : '#F59E0B' }}>CVSS {mc.cvss}</span>}
                                    </div>

                                    {/* Instance spread timeline */}
                                    <div className="flex items-center gap-2 mb-3 overflow-x-auto">
                                        {mc.instances.map((inst, j) => (
                                            <div key={j} className="flex items-center gap-1">
                                                {j > 0 && <div className="w-6 h-0.5" style={{ background: `${rc}44` }} />}
                                                <div className="p-2 rounded-lg shrink-0" style={{ background: 'rgba(30,45,74,0.4)', border: `1px solid ${inst.ai_origin ? `${rc}33` : '#1E2D4A'}` }}>
                                                    <p className="text-xs font-mono text-white">{inst.file.split('/').pop()}</p>
                                                    <p className="text-xs" style={{ color: '#94A3B8' }}>Day {inst.day} {inst.ai_origin ? <span style={{ color: rc }}>· AI</span> : ''}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>
                                        Spread rate: <span className="font-bold text-white">{mc.spread_rate}</span> · {mc.consequence}
                                    </p>

                                    {mc.flaw_confirmed && mc.flaw_description && (
                                        <div className="p-2 rounded-lg mb-2" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <p className="text-xs" style={{ color: '#EF4444' }}>
                                                ⚠️ Flaw confirmed: <span className="font-bold">{mc.flaw_description}</span>
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-xs" style={{ color: '#94A3B8' }}>
                                        <span>Files to fix: <span className="font-bold text-white">{mc.remediation_files}</span> · Est: <span className="font-bold text-white">{mc.remediation_hrs}h</span></span>
                                        <span>Post-breach cost: <span className="font-bold" style={{ color: '#EF4444' }}>{mc.post_breach_cost}</span></span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Architectural Health Score */}
            {archHealth && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={16} style={{ color: archHealth.overall_score < 30 ? '#EF4444' : archHealth.overall_score < 50 ? '#F59E0B' : '#10B981' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🏛️ Architectural Health Score — {archHealth.quarter} | {archHealth.team}</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                0–100 index: how far the live codebase has drifted from intended architecture
                            </p>
                        </div>
                    </div>

                    {/* AHS component rows */}
                    <div className="space-y-3 mb-4">
                        {archHealth.components.map((c) => {
                            const compColor = c.score < 40 ? '#EF4444' : c.score < 60 ? '#F59E0B' : '#10B981'
                            return (
                                <div key={c.component} className="flex items-center gap-4 p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{c.component}</p>
                                    </div>
                                    <div className="w-32">
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${c.score}%`, background: `linear-gradient(90deg, ${compColor}88, ${compColor})` }} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-black w-16 text-right" style={{ color: compColor }}>{c.score}/100</span>
                                    <span className="text-xs w-20 text-right" style={{ color: '#F59E0B' }}>{c.ai_attribution_pct}% AI</span>
                                    <span className="text-xs w-20 text-right" style={{ color: '#EF4444' }}>{c.trend}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Overall AHS */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { label: 'Overall AHS', value: `${archHealth.overall_score}/100`, color: archHealth.overall_score < 30 ? '#EF4444' : archHealth.overall_score < 50 ? '#F59E0B' : '#10B981' },
                            { label: 'Status', value: archHealth.status, color: archHealth.status === 'DETERIORATING' || archHealth.status === 'CRITICAL' ? '#EF4444' : '#F59E0B' },
                            { label: 'Drift Velocity', value: `${archHealth.drift_velocity} pts/wk`, color: '#EF4444' },
                            { label: 'Projected (8wk)', value: `${archHealth.projected_ahs_8wk}/100`, color: archHealth.projected_ahs_8wk < archHealth.critical_threshold ? '#EF4444' : '#F59E0B' },
                        ].map((m) => (
                            <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: `${m.color}06`, border: `1px solid ${m.color}22` }}>
                                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{m.label}</p>
                                <p className="text-lg font-black" style={{ color: m.color }}>{m.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Cost comparison */}
                    <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-bold text-white">💰 Remediation Cost Analysis</p>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}>{archHealth.cost_multiplier}× multiplier if delayed</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Fix now</p>
                                <p className="text-2xl font-black" style={{ color: '#10B981' }}>${(archHealth.remediation_cost_now / 1000).toFixed(0)}K</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Fix at AHS = {archHealth.projected_ahs_8wk}</p>
                                <p className="text-2xl font-black" style={{ color: '#EF4444' }}>${(archHealth.remediation_cost_projected / 1000000).toFixed(1)}M</p>
                            </div>
                        </div>
                        {archHealth.projected_ahs_8wk < archHealth.critical_threshold && (
                            <p className="text-xs text-center mt-2" style={{ color: '#EF4444' }}>
                                ⚠️ Projected AHS ({archHealth.projected_ahs_8wk}) will breach critical threshold ({archHealth.critical_threshold}) in 8 weeks
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Architecture Drift Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(239,68,68,0.06))',
                    border: '1px solid rgba(124,58,237,0.18)',
                }}
            >
                <div className="text-2xl">💎</div>
                <div>
                    <p className="text-sm font-semibold text-white">Enterprise Architecture Intelligence</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        Every code quality tool tells you your AI-generated code has problems. We are the <span className="text-cyan-400 font-semibold">only platform</span> that stops the problem before the commit lands, tracks how AI is <span className="text-red-400 font-semibold">silently reshaping your architecture</span> without anyone approving it, and tells your CTO exactly what that drift costs to fix <span className="text-emerald-400 font-semibold">today</span> versus what it will cost in six months.
                        {archDriftSummary && <> Current AHS: <span className="text-amber-400 font-bold">{archDriftSummary.overall_ahs}/100</span>. Fix now: <span className="text-emerald-400 font-bold">${(archDriftSummary.remediation_cost_now / 1000).toFixed(0)}K</span>. Fix later: <span className="text-red-400 font-bold">${(archDriftSummary.remediation_cost_projected / 1000000).toFixed(1)}M</span>.</>}
                    </p>
                </div>
            </div>
        </div>
    )
}
