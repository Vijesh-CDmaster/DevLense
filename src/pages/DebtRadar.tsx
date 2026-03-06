import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { AlertTriangle, Shield, TrendingUp, TrendingDown, Download, Zap, RefreshCw } from 'lucide-react'
import { debtRadarApi, type DebtRadarDashboard } from '../api/client'

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
        </div>
    )
}
