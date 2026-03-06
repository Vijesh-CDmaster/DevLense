import { useState, useEffect } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, AreaChart, Area,
} from 'recharts'
import { Send, Bell, ArrowRight, TrendingUp, TrendingDown, Clock, MessageSquare } from 'lucide-react'
import { truthLensApi, type TruthLensDashboard } from '../api/client'

/* ─────── Local types for UI (camelCase mapping) ─────── */

interface SelfReportItem {
    dev: string; task: string; selfReport: string; actualTime: string
    selfGain: string; telemetryGain: string; timestamp: string
}
interface SurveyItem {
    dev: string; q: string; a: string; realDelta: string; time: string
}

function GaugeMeter({ value, label, color, sub }: { value: string; label: string; color: string; sub: string }) {
    return (
        <div className="glass-card p-6 text-center flex flex-col items-center gap-3">
            <p className="section-title">{label}</p>
            <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(${color} 0% 60%, #1E2D4A 60% 100%)`,
                    padding: '4px',
                }}
            >
                <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center"
                    style={{ background: '#0F1629' }}
                >
                    <p className="text-2xl font-black" style={{ color }}>
                        {value}
                    </p>
                </div>
            </div>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{sub}</p>
        </div>
    )
}

export default function TruthLens() {
    const [alertThreshold, setAlertThreshold] = useState(20)
    const [surveyOpen, setSurveyOpen] = useState(false)
    const [surveyAnswer, setSurveyAnswer] = useState('')
    const [loading, setLoading] = useState(true)

    // API-driven state
    const [divergenceData, setDivergenceData] = useState<{ month: string; belief: number; reality: number; gap: number }[]>([])
    const [devBreakdown, setDevBreakdown] = useState<{ name: string; belief: string; reality: string; gap: number; level: string }[]>([])
    const [selfReportComparator, setSelfReportComparator] = useState<SelfReportItem[]>([])
    const [weeklyDrift, setWeeklyDrift] = useState<{ week: string; belief: number; reality: number; gap: number; momentum: string }[]>([])
    const [alertHistory, setAlertHistory] = useState<{ id: number; type: string; severity: string; msg: string; action: string; time: string; resolved: boolean }[]>([])
    const [recentSurveys, setRecentSurveys] = useState<SurveyItem[]>([])
    const [illusionScore, setIllusionScore] = useState({ score: 0, drift_rate: '', threshold: 20, dimensions: [] as { dimension: string; belief: number; reality: number; icon: string }[] })
    const [gauges, setGauges] = useState({ team_belief: '', telemetry_reality: '', belief_sub: '', reality_sub: '' })

    useEffect(() => {
        truthLensApi.dashboard(alertThreshold).then((data) => {
            setDivergenceData(data.divergence_timeline)
            setDevBreakdown(data.dev_breakdown)
            setSelfReportComparator(data.self_report_comparator.map((s) => ({
                dev: s.dev, task: s.task, selfReport: s.self_report, actualTime: s.actual_time,
                selfGain: s.self_gain, telemetryGain: s.telemetry_gain, timestamp: s.timestamp,
            })))
            setWeeklyDrift(data.weekly_drift)
            setAlertHistory(data.alerts)
            setRecentSurveys(data.recent_surveys.map((s) => ({
                dev: s.dev, q: s.question, a: s.answer, realDelta: s.real_delta, time: s.time,
            })))
            setIllusionScore(data.illusion_score)
            setGauges(data.gauges)
            setAlertThreshold(data.alert_config.threshold_pct)
            setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Truth Lens data…</div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Truth Lens</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        What your team believes vs what the data shows
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-primary" onClick={() => setSurveyOpen(!surveyOpen)}>
                        <MessageSquare size={13} /> Micro-Survey
                    </button>
                    <button className="btn-primary">
                        <Send size={13} /> Send Reality Report
                    </button>
                </div>
            </div>

            {/* Illusion Score Banner */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.06))',
                    border: '1px solid rgba(239,68,68,0.22)',
                }}
            >
                <div className="text-3xl font-black" style={{ color: '#EF4444' }}>🔴 {illusionScore.score}</div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">Org Illusion Score</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        Your team overestimates AI impact by <span className="text-red-400 font-semibold">{illusionScore.score} points</span> on average. Manager alert triggered — gap exceeds {alertThreshold}% threshold.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Drift:</span>
                    <TrendingUp size={14} style={{ color: '#EF4444' }} />
                    <span className="text-xs font-bold" style={{ color: '#EF4444' }}>{illusionScore.drift_rate}</span>
                </div>
            </div>

            {/* ── Micro-Survey Panel ── */}
            {surveyOpen && (
                <div className="glass-card p-5" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
                    <h3 className="text-sm font-bold text-white mb-1">📋 Post-Task Micro-Survey</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Captured after every AI-assisted commit — compared to actual telemetry in real-time
                    </p>
                    <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                        <p className="text-xs font-semibold text-white mb-2">
                            You just committed <span style={{ color: '#00D4FF' }}>auth/jwt.ts</span> using Copilot. Quick question:
                        </p>
                        <p className="text-sm font-medium text-white mb-3">
                            "How much faster did AI make you on this task?"
                        </p>
                        <div className="flex gap-2 mb-3">
                            {['Much faster', 'Slightly faster', 'No difference', 'Slower'].map((opt) => (
                                <button
                                    key={opt}
                                    onClick={() => setSurveyAnswer(opt)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={{
                                        background: surveyAnswer === opt ? 'rgba(0,212,255,0.15)' : 'rgba(30,45,74,0.5)',
                                        border: `1px solid ${surveyAnswer === opt ? 'rgba(0,212,255,0.4)' : '#1E2D4A'}`,
                                        color: surveyAnswer === opt ? '#00D4FF' : '#94A3B8',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            ⏱️ Your answer will be compared to commit timestamps & code churn automatically
                        </p>
                    </div>

                    {/* Recent survey responses */}
                    <h4 className="text-xs font-semibold text-white mb-2">Recent Responses</h4>
                    <div className="space-y-2">
                        {recentSurveys.map((s, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 p-2.5 rounded-lg"
                                style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}
                            >
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #00D4FF44, #7C3AED44)', color: '#00D4FF' }}>
                                    {s.dev[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white font-medium">{s.dev}: "{s.a}"</p>
                                    <p className="text-xs truncate" style={{ color: '#94A3B8' }}>{s.q}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold" style={{ color: s.realDelta.startsWith('-') ? '#EF4444' : '#10B981' }}>
                                        Reality: {s.realDelta}
                                    </p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>{s.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Dual Gauges */}
            <div className="grid grid-cols-2 gap-6">
                <GaugeMeter value={gauges.team_belief} label="Team Belief" color="#10B981" sub={gauges.belief_sub} />
                <GaugeMeter value={gauges.telemetry_reality} label="Telemetry Reality" color="#EF4444" sub={gauges.reality_sub} />
            </div>

            {/* ══════ NEW: Real-time Self-Report vs Telemetry Comparator ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-base font-bold text-white">⚡ Real-time Self-Report vs Telemetry</h2>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Side-by-side: "What you believed" vs "What actually happened" — per task, per commit
                        </p>
                    </div>
                    <span className="badge-red">Live</span>
                </div>
                <div className="space-y-3">
                    {selfReportComparator.map((item, i) => {
                        const selfNum = parseFloat(item.selfGain)
                        const realNum = parseFloat(item.telemetryGain)
                        const gapVal = Math.abs(selfNum - realNum)
                        const gapLevel = gapVal > 50 ? 'red' : gapVal > 20 ? 'amber' : 'green'
                        return (
                            <div
                                key={i}
                                className="grid grid-cols-7 gap-3 p-4 rounded-xl items-center"
                                style={{
                                    background: gapLevel === 'red' ? 'rgba(239,68,68,0.06)' : gapLevel === 'amber' ? 'rgba(245,158,11,0.05)' : 'rgba(16,185,129,0.05)',
                                    border: `1px solid ${gapLevel === 'red' ? 'rgba(239,68,68,0.18)' : gapLevel === 'amber' ? 'rgba(245,158,11,0.18)' : 'rgba(16,185,129,0.18)'}`,
                                }}
                            >
                                {/* Dev + Task */}
                                <div className="col-span-2">
                                    <p className="text-sm font-medium text-white">{item.dev}</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>{item.task}</p>
                                    <p className="text-xs mt-0.5" style={{ color: '#94A3B8', fontSize: 10 }}>
                                        <Clock size={9} className="inline mr-1" />{item.timestamp}
                                    </p>
                                </div>
                                {/* Self Report */}
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold mb-1" style={{ color: '#10B981' }}>💭 Self-Report</p>
                                    <p className="text-xs text-white">"{item.selfReport}"</p>
                                    <p className="text-lg font-black mt-1" style={{ color: '#10B981' }}>{item.selfGain}</p>
                                </div>
                                {/* Telemetry */}
                                <div className="col-span-2">
                                    <p className="text-xs font-semibold mb-1" style={{ color: '#EF4444' }}>📊 Telemetry</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>{item.actualTime}</p>
                                    <p className="text-lg font-black mt-1" style={{ color: realNum >= 0 ? '#10B981' : '#EF4444' }}>{item.telemetryGain}</p>
                                </div>
                                {/* Gap */}
                                <div className="text-center">
                                    <span className={`badge-${gapLevel} text-sm`}>{gapVal}%</span>
                                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>gap</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Divergence Timeline (existing — enhanced) */}
            <div className="glass-card p-5">
                <h2 className="text-base font-bold text-white mb-1">Divergence Timeline</h2>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    How team belief has drifted from reality over 6 months
                </p>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={divergenceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
                        <Line type="monotone" dataKey="belief" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} name="Team Belief %" strokeDasharray="0" />
                        <Line type="monotone" dataKey="reality" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#EF4444' }} name="Reality %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* ══════ NEW: Perception Drift Tracker ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h2 className="text-base font-bold text-white">📈 Perception Drift Tracker</h2>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Weekly gap momentum — is the illusion growing or shrinking?
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: '#94A3B8' }}>Momentum:</span>
                        <span className="badge-red flex items-center gap-1">
                            <TrendingUp size={11} /> Accelerating
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 my-4">
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                        <p className="text-2xl font-black" style={{ color: '#EF4444' }}>39%</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Current Gap</p>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                        <p className="text-2xl font-black" style={{ color: '#F59E0B' }}>+4pts</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Weekly Growth</p>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.18)' }}>
                        <p className="text-2xl font-black" style={{ color: '#7C3AED' }}>~6 wks</p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>Time to 50% if unchecked</p>
                    </div>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={weeklyDrift}>
                        <defs>
                            <linearGradient id="gapGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                        <Area type="monotone" dataKey="gap" stroke="#EF4444" strokeWidth={2.5} fill="url(#gapGrad)" name="Perception Gap %" dot={{ r: 4, fill: '#EF4444' }} />
                        <Line type="monotone" dataKey="belief" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" name="Belief %" dot={false} />
                        <Line type="monotone" dataKey="reality" stroke="#94A3B8" strokeWidth={1.5} strokeDasharray="4 4" name="Reality %" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-1 rounded inline-block" style={{ background: '#EF4444' }} />
                        Perception Gap
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#10B981', borderTop: '1px dashed #10B981' }} />
                        Belief
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#94A3B8', borderTop: '1px dashed #94A3B8' }} />
                        Reality
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ══════ NEW: Manager Alert System ══════ */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                            <Bell size={14} style={{ color: '#F59E0B' }} />
                            Manager Alert System
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="text-xs" style={{ color: '#94A3B8' }}>Threshold:</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setAlertThreshold(Math.max(5, alertThreshold - 5))}
                                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(30,45,74,0.8)', border: '1px solid #1E2D4A', color: '#94A3B8' }}
                                >
                                    −
                                </button>
                                <span className="text-sm font-bold px-1.5" style={{ color: '#F59E0B' }}>{alertThreshold}%</span>
                                <button
                                    onClick={() => setAlertThreshold(Math.min(80, alertThreshold + 5))}
                                    className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                                    style={{ background: 'rgba(30,45,74,0.8)', border: '1px solid #1E2D4A', color: '#94A3B8' }}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        {alertHistory.map((alert) => {
                            const colors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }
                            const c = colors[alert.severity]
                            return (
                                <div
                                    key={alert.id}
                                    className="p-3 rounded-xl"
                                    style={{
                                        background: `${c}08`,
                                        border: `1px solid ${c}20`,
                                        opacity: alert.resolved ? 0.6 : 1,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs">
                                                    {alert.severity === 'red' ? '🔴' : alert.severity === 'amber' ? '🟡' : '🟢'}
                                                </span>
                                                <span className="text-xs font-bold" style={{ color: c }}>
                                                    {alert.type === 'threshold' ? 'THRESHOLD' : 'DRIFT'}
                                                </span>
                                                {alert.resolved && (
                                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: 9 }}>
                                                        RESOLVED
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-white">{alert.msg}</p>
                                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                                                → {alert.action}
                                            </p>
                                        </div>
                                        <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>{alert.time}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            ⚙️ Alerts auto-fire when any developer's gap exceeds <span className="font-bold" style={{ color: '#F59E0B' }}>{alertThreshold}%</span> or team drift accelerates for 3+ consecutive weeks.
                        </p>
                    </div>
                </div>

                {/* ══════ NEW: Team Illusion Score Breakdown ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🎯 Team Illusion Score Breakdown</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Aggregated self-reports vs actual delivery metrics by dimension
                    </p>
                    {illusionScore.dimensions.map((d) => {
                        const dim = d.dimension
                        const gap = d.belief - d.reality
                        const gapColor = gap > 25 ? '#EF4444' : gap > 10 ? '#F59E0B' : '#10B981'
                        return (
                            <div key={dim} className="mb-4">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span style={{ color: '#94A3B8' }}>{d.icon} {dim}</span>
                                    <span className="font-bold" style={{ color: gapColor }}>gap: {gap}pts</span>
                                </div>
                                <div className="flex gap-1" style={{ height: 8 }}>
                                    <div className="rounded-l-full" style={{ width: `${d.belief}%`, background: `linear-gradient(90deg, #10B98166, #10B981)`, height: '100%' }} />
                                    <div className="rounded-r-full" style={{ width: `${100 - d.belief}%`, background: '#1E2D4A', height: '100%' }} />
                                </div>
                                <div className="flex gap-1 mt-0.5" style={{ height: 8 }}>
                                    <div className="rounded-l-full" style={{ width: `${d.reality}%`, background: `linear-gradient(90deg, #EF444466, #EF4444)`, height: '100%' }} />
                                    <div className="rounded-r-full" style={{ width: `${100 - d.reality}%`, background: '#1E2D4A', height: '100%' }} />
                                </div>
                                <div className="flex justify-between text-xs mt-0.5">
                                    <span style={{ color: '#10B981', fontSize: 10 }}>Belief: {d.belief}%</span>
                                    <span style={{ color: '#EF4444', fontSize: 10 }}>Reality: {d.reality}%</span>
                                </div>
                            </div>
                        )
                    })}
                    <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            🔴 Largest illusion: <span className="text-red-400 font-semibold">Code Speed</span> — team believes +78% AI gain, reality is only +42%.
                        </p>
                    </div>
                </div>
            </div>

            {/* Developer Breakdown (existing — kept) */}
            <div className="glass-card p-5">
                <h2 className="text-base font-bold text-white mb-4">Developer Breakdown</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                {['Developer', 'What They Believe', 'What Data Shows', 'Gap', 'Status'].map((h) => (
                                    <th key={h} className="text-left pb-3 pr-4 section-title font-semibold" style={{ fontSize: 11 }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {devBreakdown.map((dev, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                    <td className="py-3 pr-4 font-medium text-white">{dev.name}</td>
                                    <td className="py-3 pr-4 text-emerald-400 font-semibold">{dev.belief}</td>
                                    <td
                                        className="py-3 pr-4 font-semibold"
                                        style={{ color: dev.reality.startsWith('-') ? '#EF4444' : '#10B981' }}
                                    >
                                        {dev.reality}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span className={`badge-${dev.level}`}>
                                            {dev.gap}%
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                                            {dev.level === 'red' ? '🔴 Alert sent' : dev.level === 'amber' ? '🟡 Monitoring' : '🟢 Healthy'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                <div className="text-2xl">💡</div>
                <div>
                    <p className="text-sm font-semibold text-white">Billion-Dollar Decision Risk</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        If leadership acts on self-reported data alone, AI ROI projections are overstated by{' '}
                        <span className="text-red-400 font-semibold">~$2.4M/year</span> for this team.
                        The perception drift is <span className="text-amber-400 font-semibold">accelerating</span> — without intervention,
                        the gap will exceed 50% within 6 weeks.
                    </p>
                </div>
            </div>
        </div>
    )
}
