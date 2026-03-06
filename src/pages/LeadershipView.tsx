import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, LineChart, Line, Cell, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Radar, Legend,
} from 'recharts'
import { CheckCircle, XCircle, Download, ArrowRight, AlertTriangle, Clock, TrendingUp, Zap, Shield } from 'lucide-react'
import { leadershipApi, LVDeveloperFriction, LVFrictionTrendPoint, LVImpactSimulation, LVEmpathyDimension, LVLeadershipBriefing, LVEscalationItem } from '../api/client'

export default function LeadershipView() {
    const [surveyOpen, setSurveyOpen] = useState(false)
    const [loading, setLoading] = useState(true)

    // API state
    const [frictionData, setFrictionData] = useState<{ area: string; devHours: number; leaderEstimate: number; severity: string }[]>([])
    const [empathyGaps, setEmpathyGaps] = useState<{ devSays: string; leaderThinks: string; gap: string; cost: string; category: string; kpiImpact: string }[]>([])
    const [actionLoop, setActionLoop] = useState<{ issue: string; action: string; status: string; date: string; hoursRecovered: number; devSatisfaction: number }[]>([])
    const [decisionImpacts, setDecisionImpacts] = useState<{ decision: string; madeBy: string; date: string; devHoursLost: number; dollarsLost: number; affectedDevs: number; category: string }[]>([])
    const [translations, setTranslations] = useState<{ devPain: string; execTranslation: string; kpi: string; dollarImpact: string; priority: string }[]>([])
    const [pulseResults, setPulseResults] = useState<{ week: string; productivity: number; blockerCount: number; aiSentiment: number; responseRate: number }[]>([])
    const [empathyScore, setEmpathyScore] = useState({ score: 0, label: '', trend: '', monthlyCost: '', gapAreas: 0, totalGaps: 0, weeklyTrend: [] as { week: string; score: number }[] })
    const [developerFrictions, setDeveloperFrictions] = useState<LVDeveloperFriction[]>([])
    const [frictionTrends, setFrictionTrends] = useState<LVFrictionTrendPoint[]>([])
    const [impactSimulations, setImpactSimulations] = useState<LVImpactSimulation[]>([])
    const [empathyDimensions, setEmpathyDimensions] = useState<LVEmpathyDimension[]>([])
    const [briefing, setBriefing] = useState<LVLeadershipBriefing | null>(null)
    const [escalations, setEscalations] = useState<LVEscalationItem[]>([])

    useEffect(() => {
        leadershipApi.dashboard().then((d) => {
            setFrictionData(d.friction_heatmap.map((f) => ({
                area: f.area, devHours: f.dev_hours, leaderEstimate: f.leader_estimate, severity: f.severity,
            })))
            setEmpathyGaps(d.empathy_gaps.map((g) => ({
                devSays: g.dev_says, leaderThinks: g.leader_thinks, gap: g.gap, cost: g.cost,
                category: g.category, kpiImpact: g.kpi_impact,
            })))
            setActionLoop(d.action_loop.map((a) => ({
                issue: a.issue, action: a.action, status: a.status, date: a.date,
                hoursRecovered: a.hours_recovered, devSatisfaction: a.dev_satisfaction,
            })))
            setDecisionImpacts(d.decision_impacts.map((di) => ({
                decision: di.decision, madeBy: di.made_by, date: di.date,
                devHoursLost: di.dev_hours_lost, dollarsLost: di.dollars_lost,
                affectedDevs: di.affected_devs, category: di.category,
            })))
            setTranslations(d.translations.map((t) => ({
                devPain: t.dev_pain, execTranslation: t.exec_translation,
                kpi: t.kpi, dollarImpact: t.dollar_impact, priority: t.priority,
            })))
            setPulseResults(d.pulse_results.map((p) => ({
                week: p.week, productivity: p.productivity, blockerCount: p.blocker_count,
                aiSentiment: p.ai_sentiment, responseRate: p.response_rate,
            })))
            setEmpathyScore({
                score: d.empathy_score.score, label: d.empathy_score.label,
                trend: d.empathy_score.trend, monthlyCost: d.empathy_score.monthly_cost,
                gapAreas: d.empathy_score.gap_areas, totalGaps: d.empathy_score.total_gaps,
                weeklyTrend: d.empathy_score.weekly_trend,
            })
            setDeveloperFrictions(d.developer_frictions)
            setFrictionTrends(d.friction_trends)
            setImpactSimulations(d.impact_simulations)
            setEmpathyDimensions(d.empathy_dimensions)
            setBriefing(d.leadership_briefing)
            setEscalations(d.escalations)
            setLoading(false)
        }).catch((err) => { console.error('Leadership fetch error:', err); setLoading(false) })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Leadership View…</div>
            </div>
        )
    }

    const empathyScoreColor = empathyScore.score >= 70 ? '#10B981' : empathyScore.score >= 45 ? '#F59E0B' : '#EF4444'
    const compledActions = actionLoop.filter(a => a.status === 'done').length
    const totalDevHoursLost = decisionImpacts.reduce((s, d) => s + d.devHoursLost, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leadership View</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Translate developer pain into executive insight — built for both sides
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn-primary" onClick={() => setSurveyOpen(!surveyOpen)}>
                        📣 Pulse Survey
                    </button>
                    <button className="btn-primary">
                        <Download size={13} /> Export Briefing
                    </button>
                </div>
            </div>

            {/* ══════ Empathy Score Hero ══════ */}
            <div
                className="flex items-center gap-6 px-6 py-5 rounded-xl"
                style={{ background: `${empathyScoreColor}0C`, border: `1px solid ${empathyScoreColor}38` }}
            >
                <div className="text-center shrink-0">
                    <p className="text-5xl font-black" style={{ color: empathyScoreColor }}>{empathyScore.score}</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>/ 100</p>
                </div>
                <div className="flex-1">
                    <p className="text-lg font-bold text-white">
                        Empathy Score — {empathyScore.score < 45 ? '🔴' : empathyScore.score < 70 ? '🟡' : '🟢'} {empathyScore.label}
                    </p>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Leadership understands only <span className="font-semibold" style={{ color: empathyScoreColor }}>{empathyScore.score}%</span> of developer pain points. This disconnect is costing an estimated{' '}
                        <span className="text-amber-400 font-semibold">{empathyScore.monthlyCost}</span> in lost engineering hours.
                        {' '}<span style={{ color: '#64748B' }}>({empathyScore.gapAreas} gap areas across {empathyScore.totalGaps} issues)</span>
                    </p>
                </div>
                <div className="shrink-0 text-right">
                    <div className="progress-bar" style={{ width: 120 }}>
                        <div className="progress-fill" style={{ width: `${empathyScore.score}%`, background: `linear-gradient(90deg, ${empathyScoreColor}88, ${empathyScoreColor})` }} />
                    </div>
                    <p className="text-xs mt-1" style={{ color: empathyScore.trend === 'improving' ? '#10B981' : '#EF4444' }}>
                        {empathyScore.trend === 'improving' ? '📈 Improving' : '📉 Declining'}
                    </p>
                </div>
            </div>

            {/* ══════ Pulse Survey Modal ══════ */}
            {surveyOpen && (
                <div className="glass-card p-5 border" style={{ borderColor: 'rgba(0,212,255,0.2)' }}>
                    <h3 className="text-sm font-bold text-white mb-3">📣 Daily 30-Second Pulse Survey</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        3 questions · anonymous · AI-aggregated into weekly leadership briefing
                    </p>
                    <div className="space-y-3">
                        {[
                            'How productive did you feel today? (1–10)',
                            'What was your biggest blocker today?',
                            'Did AI help or hinder your work today?',
                        ].map((q, i) => (
                            <div key={i}>
                                <p className="text-xs font-medium text-white mb-1">{q}</p>
                                <input
                                    className="w-full text-sm outline-none"
                                    placeholder="Your answer..."
                                    style={{
                                        background: 'rgba(30,45,74,0.5)',
                                        border: '1px solid #1E2D4A',
                                        borderRadius: 8,
                                        padding: '8px 12px',
                                        color: '#fff',
                                        fontSize: 13,
                                    }}
                                />
                            </div>
                        ))}
                        <button className="btn-primary w-full justify-center">Submit (30 sec) ✅</button>
                    </div>
                </div>
            )}

            {/* ══════ Pain Point Pulse — Weekly Trend ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">📊 Pain Point Pulse — Weekly Aggregation</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            AI-aggregated micro-survey results — developer productivity, blockers, and AI sentiment
                        </p>
                    </div>
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#94A3B8' }}>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#00D4FF' }} /> Productivity</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#EF4444' }} /> Blockers</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#10B981' }} /> AI Sentiment</span>
                    </div>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={pulseResults}>
                        <defs>
                            <linearGradient id="pulseGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                        <Area type="monotone" dataKey="productivity" stroke="#00D4FF" strokeWidth={2} fill="url(#pulseGrad)" name="Productivity" dot={{ r: 3, fill: '#00D4FF' }} />
                        <Line type="monotone" dataKey="aiSentiment" stroke="#10B981" strokeWidth={1.5} strokeDasharray="4 4" name="AI Sentiment" dot={false} />
                        <Line type="monotone" dataKey="blockerCount" stroke="#EF4444" strokeWidth={1.5} strokeDasharray="4 4" name="Blocker Count" dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-3 mt-3">
                    {pulseResults.slice(-4).map((p) => (
                        <div key={p.week} className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.4)' }}>
                            <p className="text-xs font-bold text-white">{p.week}</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>{p.responseRate}% response</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══════ Leadership Translation Engine ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-white">🔄 Leadership Translation Engine</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Developer pain points automatically converted into executive KPI language
                        </p>
                    </div>
                </div>
                <div className="space-y-3">
                    {translations.map((t, i) => {
                        const prioColor = t.priority === 'critical' ? '#EF4444' : t.priority === 'high' ? '#F59E0B' : '#00D4FF'
                        return (
                            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                <div className="grid grid-cols-11 gap-3 items-center">
                                    <div className="col-span-4">
                                        <p className="text-xs font-semibold mb-1" style={{ color: '#EF4444' }}>🔧 Developer Pain</p>
                                        <p className="text-xs" style={{ color: '#E2E8F0' }}>{t.devPain}</p>
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <ArrowRight size={16} style={{ color: '#7C3AED' }} />
                                    </div>
                                    <div className="col-span-4">
                                        <p className="text-xs font-semibold mb-1" style={{ color: '#00D4FF' }}>💼 Executive Translation</p>
                                        <p className="text-xs" style={{ color: '#E2E8F0' }}>{t.execTranslation}</p>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${prioColor}15`, color: prioColor, border: `1px solid ${prioColor}33` }}>
                                            {t.priority}
                                        </span>
                                        <p className="text-xs mt-1 font-bold" style={{ color: '#F59E0B' }}>{t.dollarImpact}</p>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>{t.kpi}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ══════ Reality Gap + Decision Impact ══════ */}
            <div className="grid grid-cols-2 gap-6">
                {/* Empathy Reality Gap */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔍 Reality Gap — What Devs Say vs What Leaders Think</h3>
                    <div className="space-y-3">
                        {empathyGaps.map((gap, i) => (
                            <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA' }}>{gap.category}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge-${gap.gap}`}>{gap.gap === 'red' ? '🔴 Gap' : '🟠 Gap'}</span>
                                        <span className="text-xs font-bold" style={{ color: '#F59E0B' }}>{gap.cost}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs font-semibold mb-0.5" style={{ color: '#EF4444' }}>🔴 Devs Say</p>
                                        <p className="text-xs" style={{ color: '#E2E8F0' }}>{gap.devSays}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold mb-0.5" style={{ color: '#00D4FF' }}>💼 Leaders Think</p>
                                        <p className="text-xs" style={{ color: '#E2E8F0' }}>{gap.leaderThinks}</p>
                                    </div>
                                </div>
                                <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>📊 KPI: {gap.kpiImpact}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decision Impact Tracker */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">⚡ Decision Impact Tracker</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                "This policy cost {totalDevHoursLost} dev-hours last week"
                            </p>
                        </div>
                        <span className="badge-red">${decisionImpacts.reduce((s, d) => s + d.dollarsLost, 0).toLocaleString()} total</span>
                    </div>
                    <div className="space-y-3">
                        {decisionImpacts.map((di, i) => (
                            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-xs font-semibold text-white">{di.decision}</p>
                                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>by {di.madeBy} · {di.date}</p>
                                    </div>
                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA' }}>{di.category}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                        <p className="text-sm font-black" style={{ color: '#EF4444' }}>{di.devHoursLost}h</p>
                                        <p style={{ color: '#94A3B8', fontSize: 10 }}>Dev hours lost</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                        <p className="text-sm font-black" style={{ color: '#F59E0B' }}>${di.dollarsLost.toLocaleString()}</p>
                                        <p style={{ color: '#94A3B8', fontSize: 10 }}>Dollar impact</p>
                                    </div>
                                    <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                        <p className="text-sm font-black text-white">{di.affectedDevs}</p>
                                        <p style={{ color: '#94A3B8', fontSize: 10 }}>Devs affected</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ══════ Developer Friction Heatmap ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">⏱️ Developer Friction Heatmap</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Real dev hours lost vs what leaders estimate — the red bars are reality
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={frictionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
                            <YAxis dataKey="area" type="category" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} width={100} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="devHours" name="Actual (Dev)" radius={[0, 4, 4, 0]} fill="#EF4444" opacity={0.85} />
                            <Bar dataKey="leaderEstimate" name="Leader Estimate" radius={[0, 4, 4, 0]} fill="#00D4FF" opacity={0.4} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded inline-block" style={{ background: '#EF4444' }} /> Actual dev time lost</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded inline-block" style={{ background: '#00D4FF', opacity: 0.4 }} /> What leaders estimated</span>
                    </div>
                </div>

                {/* ══════ Action Loop Closer ══════ */}
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">🔄 Action Loop Closer</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Did leadership act on developer feedback? Devs can see.
                            </p>
                        </div>
                        <span className="text-xs font-bold" style={{ color: '#10B981' }}>{compledActions}/{actionLoop.length} resolved</span>
                    </div>
                    <div className="space-y-3">
                        {actionLoop.map((item, i) => {
                            const stColor = item.status === 'done' ? '#10B981' : item.status === 'pending' ? '#F59E0B' : '#EF4444'
                            return (
                                <div
                                    key={i}
                                    className="p-3 rounded-xl"
                                    style={{
                                        background: `${stColor}08`,
                                        border: `1px solid ${stColor}28`,
                                    }}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className="text-xs font-medium text-white">{item.issue}</p>
                                                <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${stColor}15`, color: stColor }}>
                                                    {item.status === 'done' ? '✅ Resolved' : item.status === 'pending' ? '⏳ Pending' : '❌ Ignored'}
                                                </span>
                                            </div>
                                            <p className="text-xs" style={{ color: '#94A3B8' }}>{item.action}</p>
                                            {item.status === 'done' && (
                                                <div className="flex items-center gap-3 mt-1.5 text-xs">
                                                    <span style={{ color: '#10B981' }}>+{item.hoursRecovered}h recovered</span>
                                                    <span style={{ color: '#94A3B8' }}>Dev satisfaction: <span className="font-bold text-white">{item.devSatisfaction}%</span></span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            {item.status === 'done' ? (
                                                <CheckCircle size={14} style={{ color: '#10B981' }} />
                                            ) : (
                                                <XCircle size={14} style={{ color: stColor }} />
                                            )}
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>{item.date}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ══════ Empathy Score Trend ══════ */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">📈 Empathy Score Weekly Trend</h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Is the leadership–developer understanding improving over time?
                </p>
                <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={empathyScore.weeklyTrend}>
                        <defs>
                            <linearGradient id="empathyGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={empathyScoreColor} stopOpacity={0.15} />
                                <stop offset="95%" stopColor={empathyScoreColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                        <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                        <Area type="monotone" dataKey="score" stroke={empathyScoreColor} strokeWidth={2.5} fill="url(#empathyGrad)" name="Empathy Score" dot={{ r: 3, fill: empathyScoreColor }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* ══════ AI Leadership Briefing ══════ */}
            {briefing && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(124,58,237,0.25)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">🧠 AI-Generated Leadership Briefing</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{briefing.period}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                                ✅ {briefing.actions_taken} acted
                            </span>
                            <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                                ❌ {briefing.actions_ignored} ignored
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-lg font-black" style={{ color: '#10B981' }}>+{briefing.total_hours_recovered}h</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Hours Recovered</p>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-lg font-black" style={{ color: '#EF4444' }}>{briefing.total_hours_lost}h</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Hours Still Lost</p>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-lg font-black" style={{ color: briefing.empathy_score_delta >= 0 ? '#10B981' : '#EF4444' }}>
                                {briefing.empathy_score_delta > 0 ? '+' : ''}{briefing.empathy_score_delta}
                            </p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Empathy Δ</p>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-sm font-black" style={{ color: '#F59E0B' }}>{briefing.dollar_impact}</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Monthly Cost</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-xs font-semibold text-white mb-2">🔥 Top Issues This Week</p>
                        <div className="space-y-1.5">
                            {briefing.top_issues.map((issue, i) => (
                                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.3)' }}>
                                    <span className="text-xs shrink-0 mt-0.5" style={{ color: '#EF4444' }}>⚠️</span>
                                    <p className="text-xs" style={{ color: '#E2E8F0' }}>{issue}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-white mb-2">💡 AI Recommendations</p>
                        <div className="space-y-1.5">
                            {briefing.recommendations.map((rec, i) => (
                                <div key={i} className="flex items-start gap-2 p-2 rounded-lg" style={{ background: i === 0 ? 'rgba(239,68,68,0.06)' : 'rgba(30,45,74,0.3)', border: i === 0 ? '1px solid rgba(239,68,68,0.15)' : 'none' }}>
                                    <span className="text-xs shrink-0 mt-0.5" style={{ color: i === 0 ? '#EF4444' : '#00D4FF' }}>{i === 0 ? '🚨' : '→'}</span>
                                    <p className="text-xs" style={{ color: '#E2E8F0' }}>{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ══════ Per-Developer Friction + Friction Trends ══════ */}
            <div className="grid grid-cols-2 gap-6">
                {/* Per-Developer Friction Breakdown */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">👤 Per-Developer Friction Breakdown</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Which developers are losing the most time — and where?
                    </p>
                    <div className="space-y-2">
                        {(() => {
                            const devMap: Record<string, { total: number; areas: typeof developerFrictions; worstTrend: string }> = {}
                            developerFrictions.forEach(f => {
                                if (!devMap[f.dev]) devMap[f.dev] = { total: 0, areas: [], worstTrend: 'stable' }
                                devMap[f.dev].total += f.hours_lost
                                devMap[f.dev].areas.push(f)
                                if (f.trend === 'increasing') devMap[f.dev].worstTrend = 'increasing'
                            })
                            return Object.entries(devMap)
                                .sort(([, a], [, b]) => b.total - a.total)
                                .map(([dev, info]) => {
                                    const trendColor = info.worstTrend === 'increasing' ? '#EF4444' : info.worstTrend === 'decreasing' ? '#10B981' : '#F59E0B'
                                    return (
                                        <div key={dev} className="p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-white">{dev}</span>
                                                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${trendColor}15`, color: trendColor }}>
                                                        {info.worstTrend === 'increasing' ? '📈 Worsening' : info.worstTrend === 'decreasing' ? '📉 Improving' : '→ Stable'}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-black" style={{ color: '#EF4444' }}>{info.total.toFixed(1)}h/wk</span>
                                            </div>
                                            <div className="space-y-1">
                                                {info.areas.map((a, j) => (
                                                    <div key={j} className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <div className="progress-bar h-1.5">
                                                                <div className="progress-fill" style={{ width: `${(a.hours_lost / 6) * 100}%`, background: a.trend === 'increasing' ? '#EF4444' : a.trend === 'decreasing' ? '#10B981' : '#F59E0B' }} />
                                                            </div>
                                                        </div>
                                                        <span className="text-xs shrink-0" style={{ color: '#94A3B8', width: 90 }}>{a.area}</span>
                                                        <span className="text-xs font-bold shrink-0" style={{ color: '#E2E8F0', width: 35 }}>{a.hours_lost}h</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })
                        })()}
                    </div>
                </div>

                {/* Friction Trends Over Time */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">📉 Friction Trends Over Time</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Team-wide friction by category over past 6 weeks
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={frictionTrends}>
                            <defs>
                                <linearGradient id="frTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.12} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} unit="h" />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Area type="monotone" dataKey="code_reviews" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.2} name="Code Reviews" />
                            <Area type="monotone" dataKey="meetings" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Meetings" />
                            <Area type="monotone" dataKey="ci_cd" stackId="1" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.2} name="CI/CD" />
                            <Area type="monotone" dataKey="context_switching" stackId="1" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.2} name="Context Switching" />
                            <Area type="monotone" dataKey="ai_friction" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.2} name="AI Friction" />
                        </AreaChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs" style={{ color: '#94A3B8' }}>
                        {[{ label: 'Code Reviews', color: '#EF4444' }, { label: 'Meetings', color: '#F59E0B' }, { label: 'CI/CD', color: '#00D4FF' }, { label: 'Context Switch', color: '#7C3AED' }, { label: 'AI Friction', color: '#EC4899' }].map(l => (
                            <span key={l.label} className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded inline-block" style={{ background: l.color }} />{l.label}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ══════ Impact Simulation + Empathy Dimensions ══════ */}
            <div className="grid grid-cols-2 gap-6">
                {/* Impact Simulation — ROI Calculator */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">💰 Impact Simulation — Fix ROI</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        "If we fix X, here's the projected improvement" — automated business case builder
                    </p>
                    <div className="space-y-3">
                        {impactSimulations.map((sim, i) => {
                            const prioColor = sim.priority === 'critical' ? '#EF4444' : sim.priority === 'high' ? '#F59E0B' : '#00D4FF'
                            return (
                                <div key={i} className="p-4 rounded-xl" style={{ background: `${prioColor}06`, border: `1px solid ${prioColor}20` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-white">{sim.issue}</p>
                                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${prioColor}15`, color: prioColor }}>
                                            {sim.priority}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#EF4444' }}>${(sim.current_cost_monthly / 1000).toFixed(0)}K</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Monthly cost</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#10B981' }}>${(sim.projected_savings_monthly / 1000).toFixed(1)}K</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Savings/mo</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#7C3AED' }}>{sim.roi_pct}%</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>ROI</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#F59E0B' }}>{sim.payback_weeks}w</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Payback</p>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div className="progress-bar h-1.5">
                                            <div className="progress-fill" style={{ width: `${Math.min(sim.roi_pct / 10, 100)}%`, background: `linear-gradient(90deg, ${prioColor}88, ${prioColor})` }} />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Empathy Dimensions — Gap Breakdown */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">🎯 Empathy Gap Dimensions</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Per-category leader awareness vs developer severity — where are the blind spots?
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                        <RadarChart data={empathyDimensions}>
                            <PolarGrid stroke="#1E2D4A" />
                            <PolarAngleAxis dataKey="category" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                            <PolarRadiusAxis tick={{ fill: '#94A3B8', fontSize: 9 }} domain={[0, 100]} axisLine={false} />
                            <Radar name="Dev Severity" dataKey="dev_severity" stroke="#EF4444" fill="#EF4444" fillOpacity={0.15} strokeWidth={2} />
                            <Radar name="Leader Awareness" dataKey="leader_awareness" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.1} strokeWidth={2} />
                        </RadarChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-3">
                        {empathyDimensions.map((dim, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dim.color }} />
                                <span className="text-xs text-white flex-1">{dim.category}</span>
                                <div className="flex items-center gap-3 text-xs">
                                    <span style={{ color: '#EF4444' }}>Dev: {dim.dev_severity}%</span>
                                    <span style={{ color: '#00D4FF' }}>Lead: {dim.leader_awareness}%</span>
                                    <span className="font-bold" style={{ color: dim.gap > 40 ? '#EF4444' : dim.gap > 20 ? '#F59E0B' : '#10B981' }}>
                                        Gap: {dim.gap}
                                    </span>
                                    <span style={{ color: dim.action_rate > 0 ? '#10B981' : '#EF4444' }}>
                                        {dim.action_rate > 0 ? `${dim.action_rate}% acted` : 'No action'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#94A3B8' }}>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded inline-block" style={{ background: '#EF4444' }} /> Developer Pain</span>
                        <span className="flex items-center gap-1"><span className="w-2.5 h-1.5 rounded inline-block" style={{ background: '#00D4FF' }} /> Leader Awareness</span>
                    </div>
                </div>
            </div>

            {/* ══════ Escalation Tracker ══════ */}
            {escalations.length > 0 && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">🚨 Auto-Escalation Tracker</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Issues ignored too long — automatically escalated to next management level
                            </p>
                        </div>
                        <span className="badge-red">{escalations.length} escalating</span>
                    </div>
                    <div className="space-y-3">
                        {escalations.map((esc, i) => {
                            const levelColor = esc.escalation_level === 'vp' ? '#EF4444' : esc.escalation_level === 'director' ? '#F59E0B' : '#00D4FF'
                            return (
                                <div key={i} className="p-4 rounded-xl" style={{ background: `${levelColor}06`, border: `1px solid ${levelColor}20` }}>
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-xs font-semibold text-white">{esc.issue}</p>
                                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                                Ignored since {esc.ignored_since} · {esc.affected_devs} devs affected
                                            </p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded font-bold uppercase" style={{ background: `${levelColor}15`, color: levelColor }}>
                                            {esc.escalation_level}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#EF4444' }}>{esc.days_ignored}d</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Days Ignored</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: '#F59E0B' }}>${esc.dev_cost_accumulated.toLocaleString()}</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Cost Accumulated</p>
                                        </div>
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-xs font-black" style={{ color: levelColor }}>{esc.auto_escalation_date}</p>
                                            <p style={{ color: '#94A3B8', fontSize: 9 }}>Auto-Escalation</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.06), rgba(245,158,11,0.06))',
                    border: '1px solid rgba(239,68,68,0.15)',
                }}
            >
                <div className="text-2xl">🤝</div>
                <div>
                    <p className="text-sm font-semibold text-white">Empathy Gap Insight</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        {actionLoop.filter(a => a.status === 'ignored').length > 0 && (
                            <><span className="text-red-400 font-semibold">{actionLoop.filter(a => a.status === 'ignored').length} developer issue{actionLoop.filter(a => a.status === 'ignored').length > 1 ? 's' : ''}</span> ignored by leadership. </>
                        )}
                        Annual surveys miss the real story. <span className="text-cyan-400 font-semibold">Daily micro-pulses</span> + <span className="text-purple-400 font-semibold">automatic executive translation</span> + <span className="text-amber-400 font-semibold">decision impact tracking</span> close the empathy gap — showing leaders exactly what their decisions cost in developer hours and dollars.
                    </p>
                </div>
            </div>
        </div>
    )
}
