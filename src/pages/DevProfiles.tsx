import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Download, Shield, AlertTriangle, Zap } from 'lucide-react'
import { devProfilesApi } from '../api/client'

const modeColors: Record<string, string> = {
    Scaffold: '#10B981',
    Standard: '#00D4FF',
    Architect: '#7C3AED',
}

export default function DevProfiles() {
    const [selected, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)

    // API-driven state
    const [developers, setDevelopers] = useState<{
        name: string; seniority: string; level: number; aiImpact: number; mode: string
        commits: number; prComplexity: string; alert: boolean; yearsExp: number
        codePatterns: string[]; trustScore: number; trustThreshold: number
    }[]>([])
    const [curveData, setCurveData] = useState<{ seniority: string; impact: number }[]>([])
    const [timelineData, setTimelineData] = useState<{ month: string; gain: number }[]>([])
    const [benefitHarmData, setBenefitHarmData] = useState<{
        dev: string; helpRate: number; harmRate: number; neutralRate: number
        netImpact: number; sessionsTracked: number; lastAlert: string
    }[]>([])
    const [productivityTimeline, setProductivityTimeline] = useState<{
        dev: string; timeline: { month: string; productivity: number; aiUsage: number; quality: number }[]
    }[]>([])
    const [reverseAlerts, setReverseAlerts] = useState<{
        dev: string; severity: string; msg: string; recommendation: string
        aiTimeLost: number; manualEstimate: number; triggered: string
    }[]>([])
    const [trustScores, setTrustScores] = useState<{
        dev: string; seniority: string; trustScore: number; threshold: number
        autoAcceptRate: number; reviewRequired: number; overrideCount: number
    }[]>([])

    useEffect(() => {
        devProfilesApi.dashboard().then((d) => {
            setDevelopers(d.developers.map((dev) => ({
                name: dev.name, seniority: dev.seniority, level: dev.level,
                aiImpact: dev.ai_impact, mode: dev.mode, commits: dev.commits,
                prComplexity: dev.pr_complexity, alert: dev.alert,
                yearsExp: dev.years_exp, codePatterns: dev.code_patterns,
                trustScore: dev.trust_score, trustThreshold: dev.trust_threshold,
            })))
            setCurveData(d.benefit_curve)
            setTimelineData(d.impact_timeline)
            setBenefitHarmData(d.benefit_harm.map((b) => ({
                dev: b.dev, helpRate: b.help_rate, harmRate: b.harm_rate,
                neutralRate: b.neutral_rate, netImpact: b.net_impact,
                sessionsTracked: b.sessions_tracked, lastAlert: b.last_alert,
            })))
            setProductivityTimeline(d.productivity_timelines.map((pt) => ({
                dev: pt.dev,
                timeline: pt.timeline.map((t) => ({
                    month: t.month, productivity: t.productivity,
                    aiUsage: t.ai_usage, quality: t.quality,
                })),
            })))
            setReverseAlerts(d.reverse_alerts.map((a) => ({
                dev: a.dev, severity: a.severity, msg: a.msg,
                recommendation: a.recommendation, aiTimeLost: a.ai_time_lost,
                manualEstimate: a.manual_estimate, triggered: a.triggered,
            })))
            setTrustScores(d.trust_scores.map((ts) => ({
                dev: ts.dev, seniority: ts.seniority, trustScore: ts.trust_score,
                threshold: ts.threshold, autoAcceptRate: ts.auto_accept_rate,
                reviewRequired: ts.review_required, overrideCount: ts.override_count,
            })))
            setLoading(false)
        }).catch((err) => { console.error('DevProfiles fetch error:', err); setLoading(false) })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Dev Profiles…</div>
            </div>
        )
    }

    const dev = developers[selected] || developers[0]
    const impactColor = dev.aiImpact >= 0 ? '#10B981' : '#EF4444'
    const devTimeline = productivityTimeline.find(pt => pt.dev === dev.name)?.timeline || []
    const devBenefitHarm = benefitHarmData.find(b => b.dev === dev.name)
    const devTrust = trustScores.find(ts => ts.dev === dev.name)
    const devAlerts = reverseAlerts.filter(a => a.dev === dev.name)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dev Profiles</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Seniority-aware AI adaptation — different developers need different AI modes
                    </p>
                </div>
                <button className="btn-primary" onClick={() => {
                    const blob = new Blob([JSON.stringify({ developers, curveData, timelineData, benefitHarmData, productivityTimeline, reverseAlerts, trustScores }, null, 2)], { type: 'application/json' })
                    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'dev-profile-report.json'; a.click()
                }}>
                    <Download size={13} /> Export Profile Report
                </button>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Developer List */}
                <div className="glass-card p-4 space-y-2">
                    <p className="section-title">Team Members</p>
                    {developers.map((d, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className="w-full text-left p-3 rounded-xl transition-all flex items-center gap-3"
                            style={{
                                background: selected === i ? 'rgba(0,212,255,0.1)' : 'rgba(30,45,74,0.3)',
                                border: `1px solid ${selected === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                            }}
                        >
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                                style={{ background: 'linear-gradient(135deg, #00D4FF44, #7C3AED44)', color: '#00D4FF' }}
                            >
                                {d.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white">{d.name}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>{d.seniority}</p>
                                    <span className="text-xs" style={{ color: d.aiImpact >= 0 ? '#10B981' : '#EF4444' }}>
                                        {d.aiImpact > 0 ? '+' : ''}{d.aiImpact}%
                                    </span>
                                </div>
                            </div>
                            {d.alert && <span className="text-red-400 text-xs">⚠️</span>}
                        </button>
                    ))}
                </div>

                {/* Developer Detail */}
                <div className="col-span-2 space-y-4">
                    {/* ══════ Seniority Profiler Card ══════ */}
                    <div className="glass-card p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg"
                                    style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', color: '#fff' }}
                                >
                                    {dev.name[0]}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{dev.name}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="badge-cyan">{dev.seniority}</span>
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>Level {dev.level} · {dev.yearsExp} years</span>
                                    </div>
                                </div>
                            </div>
                            {dev.alert && (
                                <div
                                    className="px-3 py-2 rounded-lg text-xs font-semibold"
                                    style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444' }}
                                >
                                    🔴 Reverse Mentoring Alert — AI is slowing this developer
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-4 gap-3 mb-5">
                            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xl font-black" style={{ color: impactColor }}>
                                    {dev.aiImpact > 0 ? '+' : ''}{dev.aiImpact}%
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>AI Impact</p>
                            </div>
                            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xl font-black text-white">{dev.commits}</p>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Total Commits</p>
                            </div>
                            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xl font-black text-white">{dev.prComplexity}</p>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>PR Complexity</p>
                            </div>
                            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xl font-black" style={{ color: dev.trustScore >= dev.trustThreshold ? '#10B981' : '#F59E0B' }}>{dev.trustScore}%</p>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Trust Score</p>
                            </div>
                        </div>

                        {/* Code Patterns */}
                        <div className="mb-4">
                            <p className="text-xs font-semibold mb-2" style={{ color: '#94A3B8' }}>Detected Code Patterns</p>
                            <div className="flex items-center gap-2 flex-wrap">
                                {dev.codePatterns.map((p, j) => (
                                    <span key={j} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Adaptive AI Mode Switcher */}
                        <div>
                            <p className="section-title mb-2">🧠 Adaptive AI Suggestion Mode</p>
                            <div className="flex gap-2">
                                {['Scaffold', 'Standard', 'Architect'].map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => {
                                            devProfilesApi.switchMode(dev.name, mode).then((updated) => {
                                                setDevelopers(prev => prev.map((d, idx) =>
                                                    idx === selected ? { ...d, mode: updated.mode } : d
                                                ))
                                            }).catch(() => {})
                                        }}
                                        className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                                        style={{
                                            background: dev.mode === mode ? `${modeColors[mode]}22` : 'rgba(30,45,74,0.5)',
                                            border: `1px solid ${dev.mode === mode ? modeColors[mode] : '#1E2D4A'}`,
                                            color: dev.mode === mode ? modeColors[mode] : '#94A3B8',
                                        }}
                                    >
                                        {mode}
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                                {dev.mode === 'Architect' && '🧠 Architecture Mode: Minimal interruptions, high-level suggestions only — optimised for senior/expert developers who think faster than AI.'}
                                {dev.mode === 'Standard' && '⚡ Standard Mode: Balanced AI suggestions for mid-level developers — meaningful completions without overload.'}
                                {dev.mode === 'Scaffold' && '🏗️ Scaffold Mode: Full AI guidance, code completion, and explanations — designed for juniors learning the codebase.'}
                            </p>
                        </div>
                    </div>

                    {/* ══════ AI Benefit/Harm Detector ══════ */}
                    {devBenefitHarm && (
                        <div className="glass-card p-5">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <Zap size={16} style={{ color: devBenefitHarm.netImpact >= 0 ? '#10B981' : '#EF4444' }} />
                                    <div>
                                        <h3 className="text-sm font-semibold text-white">⚡ AI Benefit/Harm Detector — {dev.name}</h3>
                                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                            Real-time measurement: is AI helping or slowing this developer?
                                        </p>
                                    </div>
                                </div>
                                <span className={devBenefitHarm.netImpact >= 0 ? 'badge-green' : 'badge-red'}>
                                    {devBenefitHarm.netImpact >= 0 ? '✅ Net Positive' : '🔴 Net Negative'}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 gap-3">
                                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                    <p className="text-xl font-black" style={{ color: '#10B981' }}>{devBenefitHarm.helpRate}%</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>Helps</p>
                                </div>
                                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                                    <p className="text-xl font-black" style={{ color: '#EF4444' }}>{devBenefitHarm.harmRate}%</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>Harms</p>
                                </div>
                                <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.18)' }}>
                                    <p className="text-xl font-black text-white">{devBenefitHarm.neutralRate}%</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>Neutral</p>
                                </div>
                                <div className="p-3 rounded-xl text-center" style={{ background: devBenefitHarm.netImpact >= 0 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${devBenefitHarm.netImpact >= 0 ? 'rgba(16,185,129,0.18)' : 'rgba(239,68,68,0.18)'}` }}>
                                    <p className="text-xl font-black" style={{ color: devBenefitHarm.netImpact >= 0 ? '#10B981' : '#EF4444' }}>{devBenefitHarm.netImpact > 0 ? '+' : ''}{devBenefitHarm.netImpact}%</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>Net Impact</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 text-xs" style={{ color: '#94A3B8' }}>
                                <span>📊 {devBenefitHarm.sessionsTracked} sessions tracked</span>
                                <span>·</span>
                                <span>Last alert: {devBenefitHarm.lastAlert}</span>
                            </div>

                            {/* Stacked bar showing help/harm/neutral */}
                            <div className="mt-3">
                                <div className="flex h-3 rounded-full overflow-hidden" style={{ background: '#1E2D4A' }}>
                                    <div style={{ width: `${devBenefitHarm.helpRate}%`, background: '#10B981' }} />
                                    <div style={{ width: `${devBenefitHarm.neutralRate}%`, background: '#64748B' }} />
                                    <div style={{ width: `${devBenefitHarm.harmRate}%`, background: '#EF4444' }} />
                                </div>
                                <div className="flex justify-between text-xs mt-1" style={{ fontSize: 10, color: '#94A3B8' }}>
                                    <span style={{ color: '#10B981' }}>✅ Helping</span>
                                    <span>⚪ Neutral</span>
                                    <span style={{ color: '#EF4444' }}>🔴 Harming</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════ Productivity Impact Timeline ══════ */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-1">📈 Productivity Impact Timeline — {dev.name}</h3>
                        <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                            Personal AI productivity curve over time — productivity vs AI usage vs code quality
                        </p>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={devTimeline}>
                                <defs>
                                    <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                                <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="productivity" stroke="#00D4FF" strokeWidth={2.5} fill="url(#prodGrad)" name="Productivity" dot={{ r: 3, fill: '#00D4FF' }} />
                                <Line type="monotone" dataKey="aiUsage" stroke="#7C3AED" strokeWidth={1.5} strokeDasharray="4 4" name="AI Usage %" dot={false} />
                                <Line type="monotone" dataKey="quality" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" name="Code Quality" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                        {dev.aiImpact < 0 && (
                            <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                    📉 As AI usage increased, <span className="text-red-400 font-semibold">{dev.name}'s</span> productivity dropped <span className="text-red-400 font-semibold">{Math.abs(dev.aiImpact)}%</span>. For expert developers, AI interruptions often break deep thinking flow.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════ Seniority-Aware Trust Scores ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Shield size={16} style={{ color: '#00D4FF' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🛡️ Seniority-Aware Trust Scores</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Different trust thresholds for AI output based on developer experience level
                            </p>
                        </div>
                    </div>
                </div>
                <div className="space-y-3">
                    {trustScores.map((ts, i) => {
                        const tsColor = ts.trustScore >= ts.threshold ? '#10B981' : ts.trustScore >= ts.threshold * 0.7 ? '#F59E0B' : '#EF4444'
                        return (
                            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs" style={{ background: 'linear-gradient(135deg, #00D4FF44, #7C3AED44)', color: '#00D4FF' }}>
                                            {ts.dev[0]}
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-white">{ts.dev}</span>
                                            <span className="text-xs ml-2 px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.2)' }}>{ts.seniority}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                                        <span>Auto-accept: <span className="font-bold text-white">{ts.autoAcceptRate}%</span></span>
                                        <span>Review req: <span className="font-bold text-white">{ts.reviewRequired}</span></span>
                                        <span>Overrides: <span className="font-bold" style={{ color: '#F59E0B' }}>{ts.overrideCount}</span></span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 progress-bar">
                                        <div className="progress-fill" style={{ width: `${ts.trustScore}%`, background: `linear-gradient(90deg, ${tsColor}88, ${tsColor})` }} />
                                    </div>
                                    <span className="text-sm font-black" style={{ color: tsColor }}>{ts.trustScore}%</span>
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>/ </span>
                                    <input
                                        type="number" min={30} max={100}
                                        className="w-12 text-xs font-bold text-right bg-transparent border-b border-slate-600 focus:border-cyan-400 outline-none"
                                        style={{ color: '#94A3B8' }}
                                        value={ts.threshold}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value)
                                            if (!isNaN(val)) setTrustScores(prev => prev.map((s, j) => j === i ? { ...s, threshold: val } : s))
                                        }}
                                        onBlur={() => devProfilesApi.updateTrustThreshold(ts.dev, ts.threshold).catch(() => {})}
                                    />
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>% threshold</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ══════ AI Benefit Curve by Seniority ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">📉 AI Benefit Curve by Seniority</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={curveData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="seniority" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="impact" name="AI Impact %" radius={[4, 4, 0, 0]}>
                                {curveData.map((entry, idx) => (
                                    <Cell key={idx} fill={entry.impact >= 0 ? '#10B981' : '#EF4444'} opacity={0.85} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            📊 AI tools boost junior developers by <span className="text-emerald-400 font-semibold">+34%</span> but slow expert developers by <span className="text-red-400 font-semibold">-22%</span>. The inflection point occurs at the Senior level.
                        </p>
                    </div>
                </div>

                {/* ══════ Reverse Mentoring Alerts ══════ */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🔴 Reverse Mentoring Alerts</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    AI detected slowing senior devs — suggests switching modes
                                </p>
                            </div>
                        </div>
                        <span className="badge-red">{reverseAlerts.length} active</span>
                    </div>
                    <div className="space-y-3">
                        {reverseAlerts.map((alert, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-xl"
                                style={{
                                    background: alert.severity === 'critical' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                                    border: `1px solid ${alert.severity === 'critical' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                                }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-bold text-white">{alert.dev}</span>
                                    <span className={`badge-${alert.severity === 'critical' ? 'red' : 'amber'}`}>
                                        {alert.severity === 'critical' ? '🔴 Critical' : '🟠 Warning'}
                                    </span>
                                </div>
                                <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>{alert.msg}</p>
                                <p className="text-xs font-medium" style={{ color: '#10B981' }}>💡 {alert.recommendation}</p>
                                <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                                    <span>AI time lost: <span className="font-bold text-red-400">{alert.aiTimeLost}h</span></span>
                                    <span>Manual estimate: <span className="font-bold text-emerald-400">{alert.manualEstimate}h</span></span>
                                    <span>{alert.triggered}</span>
                                    <button
                                        className="ml-auto text-xs px-2 py-1 rounded font-semibold"
                                        style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}
                                        onClick={() => {
                                            devProfilesApi.acknowledgeAlert(i).then(() => {
                                                setReverseAlerts(prev => prev.filter((_, idx) => idx !== i))
                                            }).catch(() => {})
                                        }}
                                    >
                                        Acknowledge
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.06))',
                    border: '1px solid rgba(124,58,237,0.18)',
                }}
            >
                <div className="text-2xl">🧪</div>
                <div>
                    <p className="text-sm font-semibold text-white">Experience-Level Insight</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        {reverseAlerts.length > 0 && <>AI is actively <span className="text-red-400 font-semibold">harming {reverseAlerts.length} senior developer{reverseAlerts.length > 1 ? 's' : ''}</span>. </>}
                        One-size-fits-all AI tooling ignores the <span className="text-cyan-400 font-semibold">Dreyfus model of expertise</span> — experts think in patterns, not step-by-step like AI does. Adaptive suggestion modes and seniority-aware trust thresholds are the fix.
                    </p>
                </div>
            </div>
        </div>
    )
}
