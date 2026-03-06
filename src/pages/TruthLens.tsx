import { useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    BarChart, Bar, AreaChart, Area,
} from 'recharts'
import { Send, Bell, ArrowRight, TrendingUp, TrendingDown, Clock, MessageSquare } from 'lucide-react'

/* ─────── Data ─────── */

const divergenceData = [
    { month: 'Jan', belief: 15, reality: 12, gap: 3 },
    { month: 'Feb', belief: 18, reality: 10, gap: 8 },
    { month: 'Mar', belief: 22, reality: 5, gap: 17 },
    { month: 'Apr', belief: 25, reality: -8, gap: 33 },
    { month: 'May', belief: 20, reality: -12, gap: 32 },
    { month: 'Jun', belief: 20, reality: -19, gap: 39 },
]

const devBreakdown = [
    { name: 'Raj Kumar', belief: '+25%', reality: '-12%', gap: 37, level: 'red' },
    { name: 'Priya S.', belief: '+18%', reality: '+5%', gap: 13, level: 'amber' },
    { name: 'Arjun M.', belief: '+30%', reality: '+28%', gap: 2, level: 'green' },
    { name: 'Meena R.', belief: '+22%', reality: '+19%', gap: 3, level: 'green' },
    { name: 'Dev K.', belief: '+35%', reality: '-22%', gap: 57, level: 'red' },
]

/* ── Real-time Self-Report vs Telemetry data ── */
const selfReportComparator = [
    {
        dev: 'Raj Kumar',
        task: 'Auth token refresh refactor',
        selfReport: 'Saved ~2 hrs with AI',
        actualTime: '4.3h (3.1h avg for this task type)',
        selfGain: '+35%',
        telemetryGain: '-38%',
        timestamp: '2:14 PM today',
    },
    {
        dev: 'Priya S.',
        task: 'Unit tests for payment service',
        selfReport: 'AI generated 12 tests in 20min',
        actualTime: '48min (32min avg)',
        selfGain: '+60%',
        telemetryGain: '-50%',
        timestamp: '11:42 AM today',
    },
    {
        dev: 'Arjun M.',
        task: 'REST endpoint for user profile',
        selfReport: 'Copilot got it mostly right',
        actualTime: '22min (25min avg)',
        selfGain: '+12%',
        telemetryGain: '+12%',
        timestamp: '10:08 AM today',
    },
    {
        dev: 'Dev K.',
        task: 'Database migration script',
        selfReport: 'AI wrote the migration perfectly',
        actualTime: '1.8h (0.9h avg) + 2 reverts',
        selfGain: '+50%',
        telemetryGain: '-100%',
        timestamp: '9:31 AM today',
    },
]

/* ── Weekly Perception Drift ── */
const weeklyDrift = [
    { week: 'W1', belief: 22, reality: 18, gap: 4, momentum: 'stable' },
    { week: 'W2', belief: 24, reality: 14, gap: 10, momentum: 'widening' },
    { week: 'W3', belief: 23, reality: 8, gap: 15, momentum: 'widening' },
    { week: 'W4', belief: 26, reality: 2, gap: 24, momentum: 'widening' },
    { week: 'W5', belief: 25, reality: -4, gap: 29, momentum: 'widening' },
    { week: 'W6', belief: 22, reality: -9, gap: 31, momentum: 'widening' },
    { week: 'W7', belief: 21, reality: -14, gap: 35, momentum: 'accelerating' },
    { week: 'W8', belief: 20, reality: -19, gap: 39, momentum: 'accelerating' },
]

/* ── Manager Alert System ── */
const alertHistory = [
    {
        id: 1,
        type: 'threshold',
        severity: 'red',
        msg: 'Dev K. perception gap hit 57% — exceeds 20% threshold by 37pts',
        action: 'Auto-notified manager + scheduled 1:1',
        time: '35 min ago',
        resolved: false,
    },
    {
        id: 2,
        type: 'threshold',
        severity: 'red',
        msg: 'Raj Kumar gap reached 37% — 3rd consecutive week above threshold',
        action: 'Escalated to engineering lead',
        time: '2 hrs ago',
        resolved: false,
    },
    {
        id: 3,
        type: 'drift',
        severity: 'amber',
        msg: 'Team-wide perception drift rate accelerating — gap grew 4pts this week',
        action: 'Weekly reality report sent to team',
        time: '1 day ago',
        resolved: true,
    },
    {
        id: 4,
        type: 'threshold',
        severity: 'amber',
        msg: 'Priya S. gap crossed 13% — approaching 20% alert threshold',
        action: 'Added to monitoring watchlist',
        time: '2 days ago',
        resolved: true,
    },
    {
        id: 5,
        type: 'drift',
        severity: 'green',
        msg: 'Arjun M. perception gap stable at 2% for 4 consecutive weeks',
        action: 'Marked as well-calibrated developer',
        time: '3 days ago',
        resolved: true,
    },
]

/* ── Micro-survey responses ── */
const recentSurveys = [
    { dev: 'Raj K.', q: 'How much did AI speed up this task?', a: '~35% faster', realDelta: '-38%', time: '2:14 PM' },
    { dev: 'Priya S.', q: 'Rate AI helpfulness (1-10)', a: '8/10', realDelta: '-50%', time: '11:42 AM' },
    { dev: 'Arjun M.', q: 'Would you have been faster without AI?', a: 'No', realDelta: '+12%', time: '10:08 AM' },
    { dev: 'Dev K.', q: 'How much did AI speed up this task?', a: '~50% faster', realDelta: '-100%', time: '9:31 AM' },
    { dev: 'Meena R.', q: 'Rate AI helpfulness (1-10)', a: '7/10', realDelta: '+19%', time: 'Yesterday' },
]

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
                <div className="text-3xl font-black" style={{ color: '#EF4444' }}>🔴 64</div>
                <div className="flex-1">
                    <p className="text-sm font-bold text-white">Org Illusion Score</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        Your team overestimates AI impact by <span className="text-red-400 font-semibold">64 points</span> on average. Manager alert triggered — gap exceeds {alertThreshold}% threshold.
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs" style={{ color: '#94A3B8' }}>Drift:</span>
                    <TrendingUp size={14} style={{ color: '#EF4444' }} />
                    <span className="text-xs font-bold" style={{ color: '#EF4444' }}>+4pts/wk</span>
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
                <GaugeMeter value="+20%" label="Team Belief" color="#10B981" sub="Average self-reported AI productivity gain" />
                <GaugeMeter value="-19%" label="Telemetry Reality" color="#EF4444" sub="Actual measured impact on experienced developers" />
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
                    {[
                        { dim: 'Code Speed', belief: 78, reality: 42, icon: '⚡' },
                        { dim: 'Code Quality', belief: 72, reality: 38, icon: '🎯' },
                        { dim: 'Bug Resolution', belief: 65, reality: 55, icon: '🐛' },
                        { dim: 'Test Coverage', belief: 80, reality: 61, icon: '🧪' },
                        { dim: 'Review Throughput', belief: 60, reality: 58, icon: '👀' },
                    ].map((d) => {
                        const gap = d.belief - d.reality
                        const gapColor = gap > 25 ? '#EF4444' : gap > 10 ? '#F59E0B' : '#10B981'
                        return (
                            <div key={d.dim} className="mb-4">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span style={{ color: '#94A3B8' }}>{d.icon} {d.dim}</span>
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
