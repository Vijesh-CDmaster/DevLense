import { useState } from 'react'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, AreaChart, Area, Legend,
} from 'recharts'
import { TrendingDown, TrendingUp, Clock, Download } from 'lucide-react'

/* ─────── HPS ─────── */

const hpsData = [
    { dimension: 'Speed', value: 80 },
    { dimension: 'Quality', value: 60 },
    { dimension: 'Wellbeing', value: 55 },
    { dimension: 'Collab', value: 70 },
    { dimension: 'AI Ratio', value: 62 },
]

const dimensions = [
    { label: 'Speed', value: 80, color: '#00D4FF', weight: 25 },
    { label: 'Quality', value: 60, color: '#7C3AED', weight: 30 },
    { label: 'Wellbeing', value: 55, color: '#10B981', weight: 20 },
    { label: 'Collaboration', value: 70, color: '#F59E0B', weight: 15 },
    { label: 'AI Quality Ratio', value: 62, color: '#EF4444', weight: 10 },
]

const hpsWeekly = [
    { week: 'W1', hps: 78, speed: 82, quality: 72, wellbeing: 68, collab: 74, aiRatio: 75 },
    { week: 'W2', hps: 77, speed: 83, quality: 70, wellbeing: 65, collab: 73, aiRatio: 72 },
    { week: 'W3', hps: 75, speed: 81, quality: 66, wellbeing: 62, collab: 72, aiRatio: 68 },
    { week: 'W4', hps: 74, speed: 80, quality: 64, wellbeing: 60, collab: 71, aiRatio: 65 },
    { week: 'W5', hps: 73, speed: 82, quality: 62, wellbeing: 57, collab: 70, aiRatio: 63 },
    { week: 'W6', hps: 72, speed: 80, quality: 60, wellbeing: 55, collab: 70, aiRatio: 62 },
]

/* ─────── FLOW Score (per developer) ─────── */

const devFlowScores = [
    { name: 'Raj Kumar', deepWork: 2.1, interrupted: 2.8, meetings: 2.3, flowScore: 38, trend: 'down', delta: -8 },
    { name: 'Priya S.', deepWork: 3.4, interrupted: 1.6, meetings: 2.1, flowScore: 52, trend: 'down', delta: -3 },
    { name: 'Arjun M.', deepWork: 4.8, interrupted: 0.9, meetings: 1.4, flowScore: 74, trend: 'up', delta: 5 },
    { name: 'Meena R.', deepWork: 5.2, interrupted: 0.6, meetings: 1.3, flowScore: 81, trend: 'up', delta: 2 },
    { name: 'Dev K.', deepWork: 1.8, interrupted: 3.1, meetings: 2.6, flowScore: 31, trend: 'down', delta: -12 },
]

const flowTimeline = [
    { hour: '9 AM', deep: 0, interrupted: 1, meeting: 0 },
    { hour: '10 AM', deep: 1, interrupted: 0, meeting: 0 },
    { hour: '11 AM', deep: 1, interrupted: 0, meeting: 0 },
    { hour: '12 PM', deep: 0, interrupted: 0, meeting: 1 },
    { hour: '1 PM', deep: 0, interrupted: 1, meeting: 0 },
    { hour: '2 PM', deep: 1, interrupted: 0, meeting: 0 },
    { hour: '3 PM', deep: 0, interrupted: 0, meeting: 1 },
    { hour: '4 PM', deep: 0, interrupted: 1, meeting: 0 },
    { hour: '5 PM', deep: 1, interrupted: 0, meeting: 0 },
]

/* ─────── Cognitive Load ─────── */

const contextSwitches = [
    { label: 'Context Switches', value: 14, icon: '🔀', threshold: 10, unit: '/day' },
    { label: 'Tool Switches', value: 8, icon: '⚙️', threshold: 6, unit: '/day' },
    { label: 'Meetings Today', value: 4, icon: '📅', threshold: 3, unit: 'today' },
    { label: 'Interruptions', value: 11, icon: '🔔', threshold: 8, unit: '/day' },
]

const cognitiveLoadHourly = [
    { hour: '9 AM', load: 22 },
    { hour: '10 AM', load: 35 },
    { hour: '11 AM', load: 68 },
    { hour: '12 PM', load: 42 },
    { hour: '1 PM', load: 55 },
    { hour: '2 PM', load: 78 },
    { hour: '3 PM', load: 85 },
    { hour: '4 PM', load: 62 },
    { hour: '5 PM', load: 48 },
]

/* ─────── AI Quality Ratio ─────── */

const aiQualityByModule = [
    { module: 'auth/', accepted: 34, reverted: 18, modified: 12, ratio: 53, level: 'red' },
    { module: 'payments/', accepted: 28, reverted: 8, modified: 9, ratio: 62, level: 'amber' },
    { module: 'user/', accepted: 45, reverted: 4, modified: 6, ratio: 82, level: 'green' },
    { module: 'api/routes', accepted: 22, reverted: 7, modified: 5, ratio: 65, level: 'amber' },
    { module: 'notifications/', accepted: 19, reverted: 3, modified: 4, ratio: 73, level: 'green' },
    { module: 'reporting/', accepted: 15, reverted: 11, modified: 8, ratio: 44, level: 'red' },
]

const aiQualityTrend = [
    { sprint: 'Sprint 1', ratio: 78 },
    { sprint: 'Sprint 2', ratio: 72 },
    { sprint: 'Sprint 3', ratio: 65 },
    { sprint: 'Sprint 4', ratio: 58 },
    { sprint: 'Sprint 5', ratio: 53 },
]

/* ─────── Rework Attribution ─────── */

const reworkData = [
    { sprint: 'Sprint 1', survived: 88, reverted: 12 },
    { sprint: 'Sprint 2', survived: 79, reverted: 21 },
    { sprint: 'Sprint 3', survived: 72, reverted: 28 },
    { sprint: 'Sprint 4', survived: 62, reverted: 38 },
    { sprint: 'Sprint 5', survived: 58, reverted: 42 },
]

const reworkPRs = [
    {
        pr: '#487',
        title: 'Refactor auth token refresh flow',
        dev: 'Raj Kumar',
        aiPct: 78,
        reworkHrs: 6.2,
        reason: 'AI-generated logic conflicted with existing session management — full rewrite needed',
        file: 'auth/jwt.ts',
        status: 'reverted',
    },
    {
        pr: '#491',
        title: 'Add payment webhook validation',
        dev: 'Dev K.',
        aiPct: 92,
        reworkHrs: 4.8,
        reason: 'AI copy-pasted error handling pattern — missed idempotency key validation',
        file: 'payments/webhook.ts',
        status: 'reverted',
    },
    {
        pr: '#495',
        title: 'User profile PATCH endpoint',
        dev: 'Priya S.',
        aiPct: 65,
        reworkHrs: 1.4,
        reason: 'AI suggestion lacked input sanitisation for nested objects — security review flagged',
        file: 'api/users.ts',
        status: 'modified',
    },
    {
        pr: '#498',
        title: 'Notification retry logic',
        dev: 'Dev K.',
        aiPct: 88,
        reworkHrs: 3.1,
        reason: 'AI-generated exponential backoff had no jitter — would cause thundering herd in production',
        file: 'notifications/retry.ts',
        status: 'modified',
    },
    {
        pr: '#502',
        title: 'Report export CSV generation',
        dev: 'Raj Kumar',
        aiPct: 95,
        reworkHrs: 5.6,
        reason: 'Entire function AI-generated — failed on datasets >10K rows, memory leak in stream handling',
        file: 'reporting/export.ts',
        status: 'reverted',
    },
]

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

export default function ProductivityHub() {
    const [selectedDev, setSelectedDev] = useState(0)
    const dev = devFlowScores[selectedDev]

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Productivity Hub</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Holistic Productivity Score — far beyond lines of code
                    </p>
                </div>
                <button className="btn-primary">
                    <Download size={13} /> Export HPS Report
                </button>
            </div>

            {/* ══════ HPS Hero ══════ */}
            <div className="glass-card p-6">
                <div className="grid grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="section-title">Holistic Productivity Score</p>
                        <div className="flex items-end gap-3 my-3">
                            <span className="text-6xl font-black" style={{ color: '#F59E0B' }}>72</span>
                            <span className="text-2xl font-bold mb-1" style={{ color: '#94A3B8' }}>/100</span>
                            <span className="badge-amber mb-2">🟡 Moderate</span>
                        </div>
                        <p className="text-xs mb-5" style={{ color: '#94A3B8' }}>
                            Down 3 points from last week. Quality and wellbeing are dragging the score.
                        </p>
                        <div className="space-y-3">
                            {dimensions.map((d) => (
                                <div key={d.label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span style={{ color: '#94A3B8' }}>{d.label} <span className="font-normal" style={{ fontSize: 10 }}>({d.weight}% weight)</span></span>
                                        <span style={{ color: d.color }} className="font-semibold">{d.value}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${d.value}%`,
                                                background: `linear-gradient(90deg, ${d.color}88, ${d.color})`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <ResponsiveContainer width="100%" height={240}>
                            <RadarChart data={hpsData}>
                                <PolarGrid stroke="#1E2D4A" />
                                <PolarAngleAxis dataKey="dimension" tick={{ fill: '#94A3B8', fontSize: 12 }} />
                                <Radar name="HPS" dataKey="value" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.15} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ══════ HPS Weekly Trend ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-1">
                    <div>
                        <h3 className="text-sm font-semibold text-white">📉 HPS Weekly Trend</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            6-week trajectory — which dimensions are dragging the score down?
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingDown size={14} style={{ color: '#EF4444' }} />
                        <span className="text-xs font-bold" style={{ color: '#EF4444' }}>-6pts over 6 weeks</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={hpsWeekly}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[40, 90]} />
                        <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                        <Legend wrapperStyle={{ fontSize: 11 }} />
                        <Line type="monotone" dataKey="hps" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 4, fill: '#F59E0B' }} name="HPS" />
                        <Line type="monotone" dataKey="quality" stroke="#7C3AED" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Quality" />
                        <Line type="monotone" dataKey="wellbeing" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Wellbeing" />
                        <Line type="monotone" dataKey="aiRatio" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="AI Ratio" />
                    </LineChart>
                </ResponsiveContainer>
                <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        📊 <span className="font-semibold text-white">HPS formula:</span>{' '}
                        <span style={{ color: '#00D4FF' }}>Speed×25%</span> + <span style={{ color: '#7C3AED' }}>Quality×30%</span> + <span style={{ color: '#10B981' }}>Wellbeing×20%</span> + <span style={{ color: '#F59E0B' }}>Collaboration×15%</span> + <span style={{ color: '#EF4444' }}>AI Quality Ratio×10%</span> — industry's first unified metric combining output, quality, wellbeing and AI effectiveness.
                    </p>
                </div>
            </div>

            {/* ══════ FLOW Score ══════ */}
            <div className="grid grid-cols-2 gap-6">
                {/* Per-Developer FLOW */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">⚡ FLOW Score — Per Developer</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Uninterrupted deep work hours per day — the real productivity signal
                    </p>
                    <div className="space-y-2">
                        {devFlowScores.map((d, i) => {
                            const flowColor = d.flowScore >= 70 ? '#10B981' : d.flowScore >= 50 ? '#F59E0B' : '#EF4444'
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDev(i)}
                                    className="w-full text-left p-3 rounded-xl transition-all"
                                    style={{
                                        background: selectedDev === i ? 'rgba(0,212,255,0.1)' : 'rgba(30,45,74,0.3)',
                                        border: `1px solid ${selectedDev === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #00D4FF44, #7C3AED44)', color: '#00D4FF' }}>
                                                {d.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-white">{d.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-black" style={{ color: flowColor }}>{d.flowScore}</span>
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>/100</span>
                                            {d.trend === 'down' ? (
                                                <TrendingDown size={12} style={{ color: '#EF4444' }} />
                                            ) : (
                                                <TrendingUp size={12} style={{ color: '#10B981' }} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${d.flowScore}%`, background: `linear-gradient(90deg, ${flowColor}88, ${flowColor})` }} />
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span style={{ color: '#94A3B8' }}>Deep: {d.deepWork}h · Interrupted: {d.interrupted}h</span>
                                        <span style={{ color: d.delta > 0 ? '#10B981' : '#EF4444' }}>{d.delta > 0 ? '+' : ''}{d.delta}pts</span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Selected Dev Flow Detail */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-2">🔍 {dev.name} — Daily Flow Breakdown</h3>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                            <p className="text-xl font-black" style={{ color: '#10B981' }}>{dev.deepWork}h</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Deep Work</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                            <p className="text-xl font-black" style={{ color: '#EF4444' }}>{dev.interrupted}h</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Interrupted</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                            <p className="text-xl font-black" style={{ color: '#F59E0B' }}>{dev.meetings}h</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Meetings</p>
                        </div>
                    </div>

                    <p className="section-title mb-2">Hourly Flow Map (Today)</p>
                    <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={flowTimeline}>
                            <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 11 }} />
                            <Bar dataKey="deep" name="Deep Work" stackId="a" fill="#10B981" opacity={0.85} />
                            <Bar dataKey="interrupted" name="Interrupted" stackId="a" fill="#EF4444" opacity={0.7} />
                            <Bar dataKey="meeting" name="Meeting" stackId="a" fill="#F59E0B" opacity={0.7} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center justify-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded inline-block" style={{ background: '#10B981' }} /> Deep</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded inline-block" style={{ background: '#EF4444' }} /> Interrupted</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded inline-block" style={{ background: '#F59E0B' }} /> Meeting</span>
                    </div>

                    {dev.flowScore < 50 && (
                        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                🔴 <span className="text-red-400 font-semibold">{dev.name}</span> is below the 50-point FLOW threshold. Only {dev.deepWork}h of deep work vs 5h target — {dev.interrupted}h lost to interruptions.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════ Cognitive Load Index ══════ */}
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🧠 Cognitive Load Index</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {contextSwitches.map((c) => {
                            const over = c.value > c.threshold
                            return (
                                <div
                                    key={c.label}
                                    className="p-3 rounded-xl text-center"
                                    style={{
                                        background: over ? 'rgba(239,68,68,0.06)' : 'rgba(30,45,74,0.5)',
                                        border: `1px solid ${over ? 'rgba(239,68,68,0.2)' : '#1E2D4A'}`,
                                    }}
                                >
                                    <div className="text-2xl mb-1">{c.icon}</div>
                                    <div className="text-xl font-black" style={{ color: over ? '#EF4444' : '#fff' }}>{c.value}</div>
                                    <div className="text-xs" style={{ color: '#94A3B8' }}>{c.label}</div>
                                    <div className="text-xs mt-0.5" style={{ color: over ? '#EF4444' : '#10B981', fontSize: 10 }}>
                                        {over ? `⚠️ >${c.threshold}${c.unit}` : `✅ <${c.threshold}${c.unit}`}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div
                        className="mt-4 p-3 rounded-lg text-xs"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#94A3B8' }}
                    >
                        ⚠️ CLi = <span className="text-white font-semibold">73/100</span> (High). Context switches (14) + tool switches (8) + interruptions (11) = 33 daily friction events. Target: &lt;20.
                    </div>
                </div>

                {/* Cognitive Load Hourly Pattern */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">📊 Cognitive Load — Hourly Pattern</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        When is mental load peaking? Schedule deep work in green zones.
                    </p>
                    <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={cognitiveLoadHourly}>
                            <defs>
                                <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="hour" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 11 }} />
                            <Area type="monotone" dataKey="load" stroke="#EF4444" strokeWidth={2} fill="url(#loadGrad)" name="Cognitive Load %" dot={{ r: 3, fill: '#EF4444' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                        <span>🔴 Peak: <span className="text-red-400 font-semibold">3 PM (85%)</span></span>
                        <span>🟢 Best deep-work window: <span className="text-emerald-400 font-semibold">9–10 AM</span></span>
                    </div>
                </div>
            </div>

            {/* ══════ AI Quality Ratio ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">🎯 AI Quality Ratio — By Module</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            AI code accepted vs reverted vs modified within 14 days — per codebase area
                        </p>
                    </div>
                    <span className="badge-amber">Team avg: 62%</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                        {aiQualityByModule.map((m) => (
                            <div key={m.module}>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-mono" style={{ color: '#94A3B8' }}>{m.module}</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-bold text-xs px-1.5 py-0.5 rounded"
                                            style={{ background: `${riskColors[m.level]}12`, color: riskColors[m.level], border: `1px solid ${riskColors[m.level]}30` }}
                                        >
                                            {m.ratio}%
                                        </span>
                                    </div>
                                </div>
                                {/* Stacked bar for accepted/modified/reverted */}
                                <div className="flex h-2 rounded-full overflow-hidden" style={{ background: '#1E2D4A' }}>
                                    <div style={{ width: `${(m.accepted / (m.accepted + m.modified + m.reverted)) * 100}%`, background: '#10B981' }} />
                                    <div style={{ width: `${(m.modified / (m.accepted + m.modified + m.reverted)) * 100}%`, background: '#F59E0B' }} />
                                    <div style={{ width: `${(m.reverted / (m.accepted + m.modified + m.reverted)) * 100}%`, background: '#EF4444' }} />
                                </div>
                                <div className="flex justify-between text-xs mt-0.5" style={{ fontSize: 10, color: '#94A3B8' }}>
                                    <span style={{ color: '#10B981' }}>✅ {m.accepted} accepted</span>
                                    <span style={{ color: '#F59E0B' }}>✏️ {m.modified} modified</span>
                                    <span style={{ color: '#EF4444' }}>↩️ {m.reverted} reverted</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div>
                        <p className="section-title mb-2">AI Quality Ratio Trend</p>
                        <ResponsiveContainer width="100%" height={160}>
                            <LineChart data={aiQualityTrend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[30, 90]} />
                                <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 11 }} />
                                <Line type="monotone" dataKey="ratio" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 4, fill: '#EF4444' }} name="Quality Ratio %" />
                            </LineChart>
                        </ResponsiveContainer>
                        <p className="text-xs mt-2 text-center" style={{ color: '#EF4444' }}>
                            ⚠️ AI Quality Ratio declining: 78% → 53% over 5 sprints
                        </p>

                        <div className="mt-4 grid grid-cols-3 gap-2">
                            <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.18)' }}>
                                <p className="text-lg font-black" style={{ color: '#10B981' }}>163</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Accepted</p>
                            </div>
                            <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
                                <p className="text-lg font-black" style={{ color: '#F59E0B' }}>44</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Modified</p>
                            </div>
                            <div className="p-2.5 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                                <p className="text-lg font-black" style={{ color: '#EF4444' }}>51</p>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Reverted</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════ AI Rework Tracker ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">🔁 AI Rework Tracker — 14-Day Code Survival</h3>
                        <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                            How much AI-generated code survives 14 days without being reverted
                        </p>
                    </div>
                    <span className="badge-amber">62% survival rate</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={reworkData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                        <Bar dataKey="survived" name="Survived %" fill="#10B981" opacity={0.85} radius={[4, 4, 0, 0]} />
                        <Bar dataKey="reverted" name="Reverted %" fill="#EF4444" opacity={0.7} radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <p className="text-xs mt-3 text-center" style={{ color: '#EF4444' }}>
                    ⚠️ 38% of AI-generated code was discarded within 2 weeks — a growing trend
                </p>
            </div>

            {/* ══════ Rework Attribution — Per PR ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Clock size={16} style={{ color: '#F59E0B' }} />
                    <div>
                        <h3 className="text-sm font-semibold text-white">🔍 Rework Attribution — Which PRs Needed Rework Because of AI?</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Specific PRs traced back to AI-generated code — with developer, file, and root cause
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    {reworkPRs.map((pr, i) => (
                        <div
                            key={i}
                            className="p-4 rounded-xl"
                            style={{
                                background: pr.status === 'reverted' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                                border: `1px solid ${pr.status === 'reverted' ? 'rgba(239,68,68,0.18)' : 'rgba(245,158,11,0.18)'}`,
                            }}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-white">{pr.pr}</span>
                                        <span className="text-sm text-white">{pr.title}</span>
                                        <span
                                            className={`badge-${pr.status === 'reverted' ? 'red' : 'amber'}`}
                                        >
                                            {pr.status === 'reverted' ? '↩️ Reverted' : '✏️ Modified'}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        {pr.reason}
                                    </p>
                                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                                        <span>👤 {pr.dev}</span>
                                        <span className="font-mono">{pr.file}</span>
                                        <span>AI content: <span className="font-bold" style={{ color: pr.aiPct > 80 ? '#EF4444' : '#F59E0B' }}>{pr.aiPct}%</span></span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-lg font-black" style={{ color: '#EF4444' }}>{pr.reworkHrs}h</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>rework time</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        📊 Total rework cost: <span className="text-red-400 font-semibold">21.1 engineering hours</span> this sprint — {reworkPRs.filter(p => p.status === 'reverted').length} PRs fully reverted, {reworkPRs.filter(p => p.status === 'modified').length} required significant modification. PRs with &gt;80% AI content have a <span className="text-red-400 font-semibold">3.2× higher</span> revert rate.
                    </p>
                </div>
            </div>

            {/* Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(124,58,237,0.06))',
                    border: '1px solid rgba(245,158,11,0.18)',
                }}
            >
                <div className="text-2xl">💡</div>
                <div>
                    <p className="text-sm font-semibold text-white">HPS Insight</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        Traditional metrics (LOC, PR velocity) show the team is <span className="text-emerald-400 font-semibold">20% faster</span>. But the HPS reveals the real story: quality is down <span className="text-red-400 font-semibold">12pts</span>, wellbeing down <span className="text-red-400 font-semibold">13pts</span>, and 38% of AI code is being reverted. Speed without quality and wellbeing is an illusion — not productivity.
                    </p>
                </div>
            </div>
        </div>
    )
}
