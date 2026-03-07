import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, LineChart, Line, Cell, RadarChart, PolarGrid, PolarAngleAxis,
    PolarRadiusAxis, Radar, Legend, PieChart, Pie,
} from 'recharts'
import { CheckCircle, XCircle, Download, ArrowRight, AlertTriangle, Clock, TrendingUp, Zap, Shield, DollarSign, Users, Eye } from 'lucide-react'
import FeatureNav from '../components/FeatureNav'
import {
    leadershipApi, LVDeveloperFriction, LVFrictionTrendPoint, LVImpactSimulation,
    LVEmpathyDimension, LVLeadershipBriefing, LVEscalationItem,
    LVRTFrictionRow, LVNetAIROI, LVLeadershipBriefObj,
    LVDecisionEvent, LVDecisionImpactMeasurement, LVFrictionDebtLedger,
    LVBidirectionalDashboard, LVEmpathyROIReport,
} from '../api/client'

export default function LeadershipView() {
    const [surveyOpen, setSurveyOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('dashboard')

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
    const [rtFriction, setRtFriction] = useState<LVRTFrictionRow[]>([])
    const [netAiRoi, setNetAiRoi] = useState<LVNetAIROI | null>(null)
    const [leaderBrief, setLeaderBrief] = useState<LVLeadershipBriefObj | null>(null)
    const [decisionEvents, setDecisionEvents] = useState<LVDecisionEvent[]>([])
    const [decisionMeasurements, setDecisionMeasurements] = useState<LVDecisionImpactMeasurement[]>([])
    const [debtLedger, setDebtLedger] = useState<LVFrictionDebtLedger | null>(null)
    const [biDashboard, setBiDashboard] = useState<LVBidirectionalDashboard | null>(null)
    const [empathyRoi, setEmpathyRoi] = useState<LVEmpathyROIReport | null>(null)
    const [activeDecisionIdx, setActiveDecisionIdx] = useState(0)

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
            setRtFriction(d.rt_friction_heatmap || [])
            setNetAiRoi(d.net_ai_roi || null)
            setLeaderBrief(d.leadership_brief || null)
            setDecisionEvents(d.decision_events || [])
            setDecisionMeasurements(d.decision_impact_measurements || [])
            setDebtLedger(d.friction_debt_ledger || null)
            setBiDashboard(d.bidirectional_dashboard || null)
            setEmpathyRoi(d.empathy_roi_report || null)
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
            <div className="flex items-center justify-between">
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

            <FeatureNav
                tabs={[
                    { key: 'dashboard', label: 'Dashboard' },
                    { key: 'friction', label: 'Friction & ROI' },
                    { key: 'decisions', label: 'Decision Impact' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'dashboard' && (<>
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

            </>)}

            {activeTab === 'friction' && (<>
            {/* ═══════════════════════════════════════════════════════════════════
                ██  REAL-TIME DEVELOPER FRICTION HEATMAP + NET AI ROI
            ═══════════════════════════════════════════════════════════════════ */}
            {rtFriction.length > 0 && netAiRoi && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(239,68,68,0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🔥 Real-Time Developer Friction Heatmap</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    Passive telemetry — no surveys, no fatigue. Every friction source time-attributed with dollar cost.
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-lg" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                            Platform Engineering · Week Mar 3
                        </span>
                    </div>

                    {/* Friction source rows */}
                    <div className="space-y-2 mb-4">
                        {rtFriction.map((row) => {
                            const dirColor = row.trend_direction === 'up' || row.trend_direction === 'new' ? '#EF4444' : row.trend_direction === 'down' ? '#10B981' : '#F59E0B'
                            return (
                                <div key={row.source} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-white">{row.source}</p>
                                    </div>
                                    <div className="w-32 shrink-0">
                                        <div className="progress-bar h-2">
                                            <div className="progress-fill" style={{ width: `${(row.hours_lost / 50) * 100}%`, background: `linear-gradient(90deg, ${dirColor}88, ${dirColor})` }} />
                                        </div>
                                    </div>
                                    <span className="text-sm font-black w-16 text-right shrink-0" style={{ color: '#EF4444' }}>{row.hours_lost}h</span>
                                    <span className="text-xs font-bold w-20 text-right shrink-0" style={{ color: '#F59E0B' }}>${row.team_cost.toLocaleString()}</span>
                                    <span className="text-xs w-28 text-right shrink-0 font-medium" style={{ color: dirColor }}>{row.trend}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Net AI ROI row */}
                    <div className="p-4 rounded-xl" style={{ background: netAiRoi.net_status === 'negative' ? 'rgba(239,68,68,0.06)' : 'rgba(16,185,129,0.06)', border: `1px solid ${netAiRoi.net_status === 'negative' ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}` }}>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Total Friction Cost</p>
                                <p className="text-lg font-black" style={{ color: '#EF4444' }}>${netAiRoi.total_friction_cost.toLocaleString()}</p>
                                <p className="text-xs" style={{ color: '#64748B' }}>{netAiRoi.total_friction_hours}h lost</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>AI Savings</p>
                                <p className="text-lg font-black" style={{ color: '#10B981' }}>${netAiRoi.ai_cost_saved.toLocaleString()}</p>
                                <p className="text-xs" style={{ color: '#64748B' }}>{netAiRoi.ai_hours_saved}h saved</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold" style={{ color: netAiRoi.net_status === 'negative' ? '#EF4444' : '#10B981' }}>NET AI ROI</p>
                                <p className="text-2xl font-black" style={{ color: netAiRoi.net_status === 'negative' ? '#EF4444' : '#10B981' }}>
                                    {netAiRoi.net_roi_dollars > 0 ? '+' : ''}${netAiRoi.net_roi_dollars.toLocaleString()}
                                </p>
                                <p className="text-xs font-bold" style={{ color: netAiRoi.net_status === 'negative' ? '#EF4444' : '#10B981' }}>
                                    {netAiRoi.net_status === 'negative' ? '🔴 NEGATIVE' : '🟢 POSITIVE'}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Consecutive Wks Negative</p>
                                <p className="text-lg font-black" style={{ color: netAiRoi.consecutive_weeks_negative > 0 ? '#EF4444' : '#10B981' }}>
                                    {netAiRoi.consecutive_weeks_negative}
                                </p>
                                <p className="text-xs" style={{ color: '#64748B' }}>weeks</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                ██  LEADERSHIP TRANSLATION BRIEF (Auto-Generated)
            ═══════════════════════════════════════════════════════════════════ */}
            {leaderBrief && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Eye size={16} style={{ color: '#7C3AED' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">📋 Auto-Generated Leadership Brief — {leaderBrief.recipient_role}</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    {leaderBrief.period} · Focus: {leaderBrief.focus} · Friction data → executive KPI language
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
                                Empathy: {leaderBrief.empathy_score}/100
                            </span>
                            <span className="text-xs" style={{ color: '#94A3B8' }}>
                                Acted: {leaderBrief.alerts_acted}/{leaderBrief.alerts_sent} ({leaderBrief.alerts_acted_pct}%)
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {leaderBrief.items.map((item, i) => {
                            const title = String(item.title ?? '')
                            const hrsBlocked = item.hours_blocked != null ? String(item.hours_blocked) : ''
                            const cost = item.cost != null ? Number(item.cost) : 0
                            const estSaving = item.estimated_weekly_saving != null ? Number(item.estimated_weekly_saving) : 0
                            const trend = item.trend ? String(item.trend) : ''
                            const rootCause = item.root_cause ? String(item.root_cause) : ''
                            const fix = item.fix ? String(item.fix) : ''
                            const netStatus = item.net_status ? String(item.net_status) : ''
                            return (
                            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid rgba(124,58,237,0.12)' }}>
                                <p className="text-xs font-bold text-white mb-2">→ {title}</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {hrsBlocked && (
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-sm font-black" style={{ color: '#EF4444' }}>{hrsBlocked}h</p>
                                            <p style={{ color: '#94A3B8', fontSize: 10 }}>Hours blocked</p>
                                        </div>
                                    )}
                                    {cost > 0 && (
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-sm font-black" style={{ color: '#F59E0B' }}>${cost.toLocaleString()}</p>
                                            <p style={{ color: '#94A3B8', fontSize: 10 }}>Weekly cost</p>
                                        </div>
                                    )}
                                    {estSaving > 0 && (
                                        <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                            <p className="text-sm font-black" style={{ color: '#10B981' }}>${estSaving.toLocaleString()}</p>
                                            <p style={{ color: '#94A3B8', fontSize: 10 }}>Potential saving</p>
                                        </div>
                                    )}
                                </div>
                                {trend && <p className="text-xs mt-2" style={{ color: '#F59E0B' }}>📈 {trend}</p>}
                                {rootCause && <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>🔍 Root cause: {rootCause}</p>}
                                {fix && <p className="text-xs mt-1" style={{ color: '#10B981' }}>💡 Fix: {fix}</p>}
                                {netStatus && <p className="text-xs mt-1 font-bold" style={{ color: '#EF4444' }}>⚠️ {netStatus}</p>}
                            </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {(rtFriction.length === 0 || !netAiRoi) && !leaderBrief && (
                <div className="glass-card p-8 text-center">
                    <div className="text-4xl mb-3">🔥</div>
                    <p className="text-sm font-medium text-white">Friction & ROI Analysis</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>No real-time friction data available yet. Heatmaps will appear once the system captures developer friction telemetry.</p>
                </div>
            )}

            </>)}

            {activeTab === 'decisions' && (<>
            {/* ═══════════════════════════════════════════════════════════════════
                ██  DECISION IMPACT MEASUREMENT (Pre/Post Windows)
            ═══════════════════════════════════════════════════════════════════ */}
            {decisionMeasurements.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Zap size={16} style={{ color: '#F59E0B' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">⚡ Decision Impact Measurement — Pre/Post Windows</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    Every leadership decision measured with 2-week baseline, 4-week impact, and causal attribution
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {decisionMeasurements.map((dm, i) => {
                                const dmColor = dm.status === 'mitigated' ? '#10B981' : dm.status === 'partial' ? '#F59E0B' : '#EF4444'
                                return (
                                    <button key={dm.decision_id}
                                        className="text-xs px-2 py-1 rounded-lg font-medium transition-all"
                                        style={{
                                            background: activeDecisionIdx === i ? `${dmColor}15` : 'rgba(30,45,74,0.5)',
                                            color: activeDecisionIdx === i ? dmColor : '#94A3B8',
                                            border: `1px solid ${activeDecisionIdx === i ? `${dmColor}33` : '#1E2D4A'}`,
                                        }}
                                        onClick={() => setActiveDecisionIdx(i)}
                                    >
                                        {dm.decision_id}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {(() => {
                        const dm = decisionMeasurements[activeDecisionIdx]
                        if (!dm) return null
                        const stColor = dm.status === 'mitigated' ? '#10B981' : dm.status === 'partial' ? '#F59E0B' : '#EF4444'
                        const mergeChange = dm.post_merge_time_hrs > dm.pre_merge_time_hrs
                            ? `+${Math.round((dm.post_merge_time_hrs - dm.pre_merge_time_hrs) / dm.pre_merge_time_hrs * 100)}%`
                            : `${Math.round((dm.post_merge_time_hrs - dm.pre_merge_time_hrs) / dm.pre_merge_time_hrs * 100)}%`
                        const blockedChange = dm.post_blocked_tickets > dm.pre_blocked_tickets
                            ? `+${Math.round((dm.post_blocked_tickets - dm.pre_blocked_tickets) / dm.pre_blocked_tickets * 100)}%`
                            : `${Math.round((dm.post_blocked_tickets - dm.pre_blocked_tickets) / dm.pre_blocked_tickets * 100)}%`
                        return (
                            <div>
                                {/* Decision header */}
                                <div className="p-3 rounded-xl mb-4" style={{ background: `${stColor}06`, border: `1px solid ${stColor}20` }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-xs font-bold text-white">{dm.decision}</p>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${stColor}15`, color: stColor }}>
                                            {dm.status === 'mitigated' ? '🟢 Mitigated' : dm.status === 'partial' ? '🟠 Partial' : '🔴 Not Mitigated'}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        By {dm.decision_maker} · {dm.enacted_date} · Scope: {dm.scope} · {dm.weeks_since} weeks since
                                    </p>
                                </div>

                                {/* Pre/Post comparison grid */}
                                <div className="grid grid-cols-4 gap-3 mb-4">
                                    {[
                                        { label: 'Merge Time', pre: `${dm.pre_merge_time_hrs}h`, post: `${dm.post_merge_time_hrs}h`, change: mergeChange, worse: dm.post_merge_time_hrs > dm.pre_merge_time_hrs },
                                        { label: 'Blocked Tickets/wk', pre: String(dm.pre_blocked_tickets), post: String(dm.post_blocked_tickets), change: blockedChange, worse: dm.post_blocked_tickets > dm.pre_blocked_tickets },
                                        { label: 'Friction hrs/wk', pre: `${dm.pre_friction_hrs}`, post: `${dm.post_friction_hrs}`, change: `${dm.net_friction_hrs > 0 ? '+' : ''}${dm.net_friction_hrs}h`, worse: dm.net_friction_hrs > 0 },
                                        { label: 'Approval Loops/wk', pre: String(dm.pre_approval_loops), post: String(dm.post_approval_loops), change: `${dm.post_approval_loops > dm.pre_approval_loops ? '+' : ''}${Math.round((dm.post_approval_loops - dm.pre_approval_loops) / dm.pre_approval_loops * 100)}%`, worse: dm.post_approval_loops > dm.pre_approval_loops },
                                    ].map((m) => (
                                        <div key={m.label} className="p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                            <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>{m.label}</p>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs" style={{ color: '#64748B' }}>Pre</p>
                                                    <p className="text-sm font-bold text-white">{m.pre}</p>
                                                </div>
                                                <ArrowRight size={12} style={{ color: '#64748B' }} />
                                                <div>
                                                    <p className="text-xs" style={{ color: '#64748B' }}>Post</p>
                                                    <p className="text-sm font-bold" style={{ color: m.worse ? '#EF4444' : '#10B981' }}>{m.post}</p>
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-center mt-1" style={{ color: m.worse ? '#EF4444' : '#10B981' }}>{m.change}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Attribution + Financial impact */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                        <p className="text-xs font-bold text-white mb-2">📊 Causal Attribution</p>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>Confidence:</span>
                                            <div className="flex-1">
                                                <div className="progress-bar h-2">
                                                    <div className="progress-fill" style={{ width: `${dm.causal_score * 100}%`, background: dm.causal_score > 0.7 ? '#10B981' : '#F59E0B' }} />
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold" style={{ color: dm.causal_score > 0.7 ? '#10B981' : '#F59E0B' }}>{dm.causal_score.toFixed(2)}</span>
                                        </div>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                                            Net friction: <span className="font-bold" style={{ color: dm.net_friction_hrs > 0 ? '#EF4444' : '#10B981' }}>{dm.net_friction_hrs > 0 ? '+' : ''}{dm.net_friction_hrs}h/wk</span>
                                        </p>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                                            Financial: <span className="font-bold" style={{ color: dm.financial_impact_week > 0 ? '#EF4444' : '#10B981' }}>${Math.abs(dm.financial_impact_week).toLocaleString()}/wk</span> ({dm.financial_impact_week > 0 ? 'cost' : 'saving'})
                                        </p>
                                        <p className="text-xs mt-1" style={{ color: '#F59E0B' }}>
                                            Cumulative: <span className="font-bold">${Math.abs(dm.cumulative_cost).toLocaleString()}</span> over {dm.weeks_since}wk
                                        </p>
                                    </div>
                                    <div className="p-3 rounded-xl" style={{ background: dm.status !== 'mitigated' ? 'rgba(245,158,11,0.04)' : 'rgba(16,185,129,0.04)', border: `1px solid ${dm.status !== 'mitigated' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.15)'}` }}>
                                        <p className="text-xs font-bold text-white mb-2">💡 Mitigation</p>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>{dm.mitigation_available}</p>
                                        {dm.mitigation_cost > 0 && (
                                            <div className="grid grid-cols-2 gap-2 mt-2">
                                                <div className="text-center p-1.5 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                                    <p className="text-xs font-black" style={{ color: '#F59E0B' }}>${dm.mitigation_cost.toLocaleString()}</p>
                                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>One-time cost</p>
                                                </div>
                                                <div className="text-center p-1.5 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                                    <p className="text-xs font-black" style={{ color: '#10B981' }}>${dm.mitigation_weekly_saving.toLocaleString()}/wk</p>
                                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>Weekly saving</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })()}
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                ██  FRICTION DEBT LEDGER
            ═══════════════════════════════════════════════════════════════════ */}
            {debtLedger && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <DollarSign size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">📒 Friction Debt Ledger — {debtLedger.quarter}</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    {debtLedger.org} — Every leadership decision financially attributed with running accountability trail
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{
                            background: debtLedger.net_friction_debt > 50000 ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                            color: debtLedger.net_friction_debt > 50000 ? '#EF4444' : '#F59E0B',
                        }}>
                            Net Debt: ${debtLedger.net_friction_debt.toLocaleString()}
                        </span>
                    </div>

                    {/* Ledger entries */}
                    <div className="space-y-2 mb-4">
                        {debtLedger.entries.map((entry, i) => {
                            const entryColor = entry.resolution === 'roi_positive' ? '#10B981' : entry.resolution === 'resolved' ? '#10B981' : entry.resolution === 'partial' ? '#F59E0B' : '#EF4444'
                            return (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${entryColor}04`, border: `1px solid ${entryColor}18` }}>
                                    <span className="text-sm shrink-0">{entry.status_icon}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-white">{entry.decision}</p>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>{entry.maker} · {entry.duration_weeks}wk</p>
                                    </div>
                                    <span className="text-sm font-black w-24 text-right shrink-0" style={{ color: entry.cumulative_cost < 0 ? '#10B981' : '#EF4444' }}>
                                        {entry.cumulative_cost < 0 ? '-' : ''}${Math.abs(entry.cumulative_cost).toLocaleString()}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold shrink-0" style={{ background: `${entryColor}15`, color: entryColor }}>
                                        {entry.resolution === 'roi_positive' ? 'ROI+' : entry.resolution === 'resolved' ? 'Fixed' : entry.resolution === 'partial' ? 'Partial' : 'Unresolved'}
                                    </span>
                                </div>
                            )
                        })}
                    </div>

                    {/* Ledger totals */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Friction Introduced</p>
                            <p className="text-lg font-black" style={{ color: '#EF4444' }}>+${debtLedger.total_friction_introduced.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Friction Saved</p>
                            <p className="text-lg font-black" style={{ color: '#10B981' }}>-${debtLedger.total_friction_saved.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <p className="text-xs font-bold" style={{ color: '#EF4444' }}>NET FRICTION DEBT</p>
                            <p className="text-lg font-black" style={{ color: '#EF4444' }}>${debtLedger.net_friction_debt.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Decision Quality Scores per leader */}
                    <div>
                        <p className="text-xs font-semibold text-white mb-2">📊 Decision Quality Score — Per Leader</p>
                        <div className="grid grid-cols-4 gap-3">
                            {debtLedger.decision_quality_scores.map((dqs, i) => {
                                const dqColor = dqs.status === 'green' ? '#10B981' : dqs.status === 'amber' ? '#F59E0B' : '#EF4444'
                                return (
                                    <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${dqColor}06`, border: `1px solid ${dqColor}20` }}>
                                        <p className="text-xs font-mono font-medium" style={{ color: '#94A3B8' }}>{dqs.leader}</p>
                                        <div className="w-14 h-14 rounded-full mx-auto mt-2 flex flex-col items-center justify-center"
                                            style={{ background: `conic-gradient(${dqColor} 0% ${dqs.score}%, #1E2D4A ${dqs.score}% 100%)`, padding: 3 }}>
                                            <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: '#0F1629' }}>
                                                <span className="text-sm font-black" style={{ color: dqColor }}>{dqs.score}</span>
                                            </div>
                                        </div>
                                        <p className="text-xs font-bold mt-1" style={{ color: dqColor }}>{dqs.label}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                ██  BIDIRECTIONAL ACCOUNTABILITY DASHBOARD
            ═══════════════════════════════════════════════════════════════════ */}
            {biDashboard && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(0,212,255,0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users size={16} style={{ color: '#00D4FF' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">👁️ Developer Action Loop — Bidirectional Accountability</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    {biDashboard.developer} · {biDashboard.team} — Did leadership act on your reported friction?
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${biDashboard.empathy_score < 45 ? '#EF4444' : '#F59E0B'}15`, color: biDashboard.empathy_score < 45 ? '#EF4444' : '#F59E0B' }}>
                                Empathy: {biDashboard.empathy_score}/100
                            </span>
                        </div>
                    </div>

                    {/* Action loop items */}
                    <div className="space-y-3 mb-4">
                        {biDashboard.action_loops.map((al, i) => {
                            const alColor = al.response_status === 'acted' ? '#10B981' : '#EF4444'
                            return (
                                <div key={i} className="p-4 rounded-xl" style={{ background: `${alColor}04`, border: `1px solid ${alColor}18` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            {al.response_status === 'acted'
                                                ? <CheckCircle size={14} style={{ color: '#10B981' }} />
                                                : <XCircle size={14} style={{ color: '#EF4444' }} />}
                                            <p className="text-xs font-bold text-white">{al.friction_flagged}</p>
                                        </div>
                                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${alColor}15`, color: alColor }}>
                                            {al.response_status === 'acted' ? '✅ Acted' : '❌ No Action'}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-xs">
                                        <div>
                                            <p style={{ color: '#94A3B8' }}>First reported: <span className="text-white">{al.first_reported}</span> · Alerts sent: <span className="text-white">{al.alerts_sent}</span></p>
                                            <p className="mt-1" style={{ color: '#94A3B8' }}>Leader response: <span style={{ color: al.response_status === 'acted' ? '#10B981' : '#EF4444' }}>{al.leader_response}</span></p>
                                            {al.response_status === 'acted' && <p className="mt-1" style={{ color: '#10B981' }}>Outcome: {al.outcome_measured}</p>}
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                                <p className="text-xs font-black" style={{ color: '#EF4444' }}>{al.personal_hours_affected}h</p>
                                                <p style={{ color: '#94A3B8', fontSize: 9 }}>Your hours (${al.personal_cost.toLocaleString()})</p>
                                            </div>
                                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                                <p className="text-xs font-black" style={{ color: '#F59E0B' }}>{al.team_hours_affected}h</p>
                                                <p style={{ color: '#94A3B8', fontSize: 9 }}>Team (${al.team_cost.toLocaleString()})</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Quarterly summary */}
                    <div className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                        <p className="text-xs font-bold text-white mb-2">📊 Quarterly Action Summary</p>
                        <div className="grid grid-cols-4 gap-3">
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Alerts This Q</p>
                                <p className="text-lg font-black text-white">{biDashboard.alerts_this_quarter}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Acted {'<'}2wk</p>
                                <p className="text-lg font-black" style={{ color: '#10B981' }}>{biDashboard.acted_within_2wk} ({Math.round(biDashboard.acted_within_2wk / biDashboard.alerts_this_quarter * 100)}%)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Acted {'>'}2wk</p>
                                <p className="text-lg font-black" style={{ color: '#F59E0B' }}>{biDashboard.acted_after_2wk} ({Math.round(biDashboard.acted_after_2wk / biDashboard.alerts_this_quarter * 100)}%)</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs" style={{ color: '#94A3B8' }}>Not Acted</p>
                                <p className="text-lg font-black" style={{ color: '#EF4444' }}>{biDashboard.not_acted} ({Math.round(biDashboard.not_acted / biDashboard.alerts_this_quarter * 100)}%)</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════════
                ██  QUARTERLY EMPATHY ROI REPORT
            ═══════════════════════════════════════════════════════════════════ */}
            {empathyRoi && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(124,58,237,0.2)' }}>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Shield size={16} style={{ color: '#7C3AED' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">📈 Empathy ROI Report — {empathyRoi.quarter}</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    The financial return on leadership responsiveness — translating empathy into capital allocation
                                </p>
                            </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(124,58,237,0.12)', color: '#A78BFA' }}>
                            ROI: {empathyRoi.empathy_roi_multiplier}x
                        </span>
                    </div>

                    {/* Top-line KPIs */}
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {[
                            { label: 'Actions Taken', value: `${empathyRoi.actions_taken}/${empathyRoi.total_alerts}`, color: empathyRoi.actions_taken < empathyRoi.total_alerts / 2 ? '#EF4444' : '#10B981' },
                            { label: 'Cost Reduced', value: `$${(empathyRoi.friction_cost_reduced / 1000).toFixed(1)}K`, color: '#10B981' },
                            { label: 'Cost Persisting', value: `$${(empathyRoi.friction_cost_persisting / 1000).toFixed(1)}K`, color: '#EF4444' },
                            { label: 'Forgone ROI', value: `$${(empathyRoi.net_forgone_roi / 1000).toFixed(1)}K`, color: '#F59E0B' },
                            { label: 'Empathy ROI', value: `${empathyRoi.empathy_roi_multiplier}x`, color: '#7C3AED' },
                        ].map((m) => (
                            <div key={m.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>{m.label}</p>
                                <p className="text-lg font-black" style={{ color: m.color }}>{m.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* If leadership had acted */}
                    <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
                        <p className="text-xs font-bold mb-2" style={{ color: '#F59E0B' }}>💡 If leadership had acted on all {empathyRoi.total_alerts} alerts within 2 weeks:</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xs font-black" style={{ color: '#10B981' }}>${empathyRoi.estimated_additional_recovery.toLocaleString()}</p>
                                <p style={{ color: '#94A3B8', fontSize: 10 }}>Additional recovery</p>
                            </div>
                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xs font-black" style={{ color: '#F59E0B' }}>${empathyRoi.cost_of_interventions.toLocaleString()}</p>
                                <p style={{ color: '#94A3B8', fontSize: 10 }}>Cost of interventions</p>
                            </div>
                            <div className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-xs font-black" style={{ color: '#EF4444' }}>${empathyRoi.net_forgone_roi.toLocaleString()}</p>
                                <p style={{ color: '#94A3B8', fontSize: 10 }}>Net forgone ROI from inaction</p>
                            </div>
                        </div>
                    </div>

                    {/* Empathy score trend */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                            <p className="text-xs font-bold text-white mb-2">Empathy Score Trend</p>
                            <div className="flex items-end gap-3 h-12">
                                {empathyRoi.empathy_score_trend.map((s, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <div className="w-full rounded-t" style={{ height: `${s}%`, background: s < 35 ? '#EF4444' : s < 50 ? '#F59E0B' : '#10B981', minHeight: 8 }} />
                                        <span className="text-xs mt-1" style={{ color: '#94A3B8', fontSize: 9 }}>{s}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-center mt-2" style={{ color: empathyRoi.empathy_score_trend[empathyRoi.empathy_score_trend.length - 1] < empathyRoi.empathy_score_trend[0] ? '#EF4444' : '#10B981' }}>
                                {empathyRoi.empathy_score_trend[empathyRoi.empathy_score_trend.length - 1] < empathyRoi.empathy_score_trend[0] ? '↓ Declining' : '↑ Improving'}
                            </p>
                        </div>
                        <div className="space-y-3">
                            {/* Highest ROI intervention */}
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <p className="text-xs font-bold mb-1" style={{ color: '#10B981' }}>🏆 Highest ROI Intervention</p>
                                <p className="text-xs text-white">{String(empathyRoi.highest_roi_intervention.intervention || '')}</p>
                                <p className="text-xs" style={{ color: '#10B981' }}>
                                    ${Number(empathyRoi.highest_roi_intervention.savings || 0).toLocaleString()} saved · {String(empathyRoi.highest_roi_intervention.roi_multiplier || '')}x ROI
                                </p>
                            </div>
                            {/* Lowest ROI non-decision */}
                            <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                <p className="text-xs font-bold mb-1" style={{ color: '#EF4444' }}>⚠️ Costliest Non-Decision</p>
                                <p className="text-xs text-white">{String(empathyRoi.lowest_roi_non_decision.issue || '')}</p>
                                <p className="text-xs" style={{ color: '#EF4444' }}>
                                    ${Number(empathyRoi.lowest_roi_non_decision.cost || 0).toLocaleString()} cost · {String(empathyRoi.lowest_roi_non_decision.interventions || 0)} interventions
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Enterprise Empathy Intelligence */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.06))',
                    border: '1px solid rgba(124,58,237,0.18)',
                }}
            >
                <div className="text-2xl">💎</div>
                <div>
                    <p className="text-sm font-semibold text-white">Enterprise Decision Intelligence</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        Every survey tells your leaders developers are frustrated. We are the <span className="text-cyan-400 font-semibold">only platform</span> that tells them which specific decision they made is costing <span className="text-red-400 font-semibold">{debtLedger ? `$${(debtLedger.net_friction_debt / 1000).toFixed(0)}K` : '$85K'}</span> in absorbed developer capacity, shows developers in real time whether their leaders actually responded, and gives your CTO a quarterly financial score of every leader's <span className="text-purple-400 font-semibold">empathy ROI</span>.
                        {netAiRoi && <> AI saves <span className="text-emerald-400 font-bold">{netAiRoi.ai_hours_saved}h/wk</span> · Friction consumes <span className="text-red-400 font-bold">{netAiRoi.total_friction_hours}h/wk</span> · <span className="font-bold" style={{ color: netAiRoi.net_status === 'negative' ? '#EF4444' : '#10B981' }}>Net ROI: ${netAiRoi.net_roi_dollars.toLocaleString()}</span></>}
                    </p>
                </div>
            </div>
            {decisionMeasurements.length === 0 && !debtLedger && !biDashboard && (
                <div className="glass-card p-8 text-center">
                    <div className="text-4xl mb-3">⚡</div>
                    <p className="text-sm font-medium text-white">Decision Impact</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>No decision measurement data available yet. Impact analysis will appear once the system tracks leadership decisions with pre/post windows.</p>
                </div>
            )}
            </>)}
        </div>
    )
}
