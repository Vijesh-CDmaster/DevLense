import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
    AreaChart, Area, Cell,
} from 'recharts'
import { TrendingUp, TrendingDown, Download, Shield, AlertTriangle, Zap, Eye, Target, Users, DollarSign, Activity, BarChart3 } from 'lucide-react'
import FeatureNav from '../components/FeatureNav'
import { devProfilesApi, type DPSeniorityProfile, type DPAIImpactDashboard, type DPSenioritySummary, type DPJuniorDependencyIndex, type DPSeniorityVelocityDeficit, type DPTeamPipelineRisk, type DPOrgPipelineDebtReport, type DPPipelineSummary } from '../api/client'

const modeColors: Record<string, string> = {
    Scaffold: '#10B981',
    Standard: '#00D4FF',
    Architect: '#7C3AED',
}

export default function DevProfiles() {
    const [selected, setSelected] = useState(0)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('dashboard')

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

    // Seniority Profiler + AI Impact state
    const [seniorityProfiles, setSeniorityProfiles] = useState<DPSeniorityProfile[]>([])
    const [aiImpactDashboards, setAiImpactDashboards] = useState<DPAIImpactDashboard[]>([])
    const [senioritySummary, setSenioritySummary] = useState<DPSenioritySummary | null>(null)

    // Pipeline Debt Forecaster state
    const [jdiData, setJdiData] = useState<DPJuniorDependencyIndex[]>([])
    const [svdData, setSvdData] = useState<DPSeniorityVelocityDeficit[]>([])
    const [teamRisk, setTeamRisk] = useState<DPTeamPipelineRisk[]>([])
    const [orgDebt, setOrgDebt] = useState<DPOrgPipelineDebtReport | null>(null)
    const [pipelineSummary, setPipelineSummary] = useState<DPPipelineSummary | null>(null)

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
            // Seniority Profiler + AI Impact
            if (d.seniority_profiles) setSeniorityProfiles(d.seniority_profiles)
            if (d.ai_impact_dashboards) setAiImpactDashboards(d.ai_impact_dashboards)
            // Pipeline Debt Forecaster
            if (d.junior_dependency_indices) setJdiData(d.junior_dependency_indices)
            if (d.seniority_velocity_deficits) setSvdData(d.seniority_velocity_deficits)
            if (d.team_pipeline_risk) setTeamRisk(d.team_pipeline_risk)
            if (d.org_pipeline_debt) setOrgDebt(d.org_pipeline_debt)
            // Fetch computed summaries
            Promise.all([
                devProfilesApi.senioritySummary(),
                devProfilesApi.pipelineSummary(),
            ]).then(([ss, ps]) => {
                setSenioritySummary(ss)
                setPipelineSummary(ps)
            })
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

    if (developers.length === 0) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dev Profiles</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Seniority-aware AI adaptation — different developers need different AI modes
                    </p>
                </div>
                <div className="glass-card p-12 text-center">
                    <div className="text-4xl mb-4">👥</div>
                    <p className="text-sm font-medium text-white">No Developer Data Available</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Unable to load developer profiles. Please ensure the backend server is running on port 8000.</p>
                </div>
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

            <FeatureNav
                tabs={[
                    { key: 'dashboard', label: 'Dashboard' },
                    { key: 'seniority', label: 'Seniority Analysis' },
                    { key: 'pipeline', label: 'Pipeline Forecaster' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'dashboard' && (<>
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

                    {/* ══════ 7-Signal Seniority Profile ══════ */}
                    {(() => {
                        const sp = seniorityProfiles.find(s => s.developer === dev.name)
                        if (!sp) return null
                        const bandColors: Record<string, string> = { Expert: '#7C3AED', Proficient: '#00D4FF', Developing: '#F59E0B', Emerging: '#10B981' }
                        const bc = bandColors[sp.band] || '#94A3B8'
                        return (
                            <div className="glass-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Eye size={16} style={{ color: bc }} />
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">🔬 7-Signal Seniority Profile — {dev.name}</h3>
                                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                                Behavioral classifier: {sp.years_active} yrs active · Top signal: {sp.top_signal}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black"
                                            style={{ background: `${bc}15`, color: bc, border: `2px solid ${bc}44` }}>
                                            {sp.seniority_score}
                                        </div>
                                        <span className="text-xs font-bold px-2 py-1 rounded-full"
                                            style={{ background: `${bc}15`, color: bc }}>{sp.band}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {sp.signals.map((sig) => (
                                        <div key={sig.signal} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-white">{sig.signal}</p>
                                                <p className="text-xs" style={{ color: '#94A3B8', fontSize: 10 }}>{sig.measurement}</p>
                                            </div>
                                            <div className="w-24">
                                                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1E2D4A' }}>
                                                    <div className="h-full rounded-full" style={{ width: `${(sig.score_contribution / 20) * 100}%`, background: bc }} />
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold w-8 text-right" style={{ color: bc }}>+{sig.score_contribution}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })()}

                    {/* ══════ AI Impact per Task Type ══════ */}
                    {(() => {
                        const aid = aiImpactDashboards.find(a => a.developer === dev.name)
                        if (!aid) return null
                        const signalColors: Record<string, string> = { HARM: '#EF4444', BENEFIT: '#10B981', MARGINAL: '#F59E0B' }
                        return (
                            <div className="glass-card p-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Target size={16} style={{ color: aid.net_impact_hrs >= 0 ? '#10B981' : '#EF4444' }} />
                                        <div>
                                            <h3 className="text-sm font-semibold text-white">🎯 AI Impact by Task Type — {dev.name}</h3>
                                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                                Per-task-type, per-developer — same tool, opposite outcomes
                                            </p>
                                        </div>
                                    </div>
                                    <span className={aid.net_impact_hrs >= 0 ? 'badge-green' : 'badge-red'}>
                                        Net: {aid.net_impact_hrs > 0 ? '+' : ''}{aid.net_impact_hrs}h/sprint
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                                {['Task Type', 'AI ON avg', 'AI OFF avg', 'Delta', 'Signal'].map((h) => (
                                                    <th key={h} className="text-left pb-2 pr-3 section-title font-semibold" style={{ fontSize: 11 }}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {aid.task_impacts.map((ti) => {
                                                const sc = signalColors[ti.signal] || '#94A3B8'
                                                return (
                                                    <tr key={ti.task_type} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                                        <td className="py-2 pr-3 text-white font-medium">{ti.task_type}</td>
                                                        <td className="py-2 pr-3 text-xs" style={{ color: '#94A3B8' }}>{ti.ai_on_avg_hrs} hrs</td>
                                                        <td className="py-2 pr-3 text-xs" style={{ color: '#94A3B8' }}>{ti.ai_off_avg_hrs} hrs</td>
                                                        <td className="py-2 pr-3 text-xs font-bold" style={{ color: sc }}>
                                                            {ti.delta_pct > 0 ? '+' : ''}{ti.delta_pct}%
                                                        </td>
                                                        <td className="py-2">
                                                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                                                style={{ background: `${sc}15`, color: sc }}>
                                                                {ti.signal === 'HARM' ? '🔴' : ti.signal === 'BENEFIT' ? '🟢' : '🟠'} {ti.signal}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Recommendations */}
                                <div className="grid grid-cols-2 gap-3 mt-4">
                                    {aid.recommended_disable.length > 0 && (
                                        <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                            <p className="text-xs font-bold mb-1" style={{ color: '#EF4444' }}>🔴 Disable AI for:</p>
                                            {aid.recommended_disable.map((t) => (
                                                <p key={t} className="text-xs" style={{ color: '#94A3B8' }}>• {t}</p>
                                            ))}
                                        </div>
                                    )}
                                    {aid.benefit_zone.length > 0 && (
                                        <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                            <p className="text-xs font-bold mb-1" style={{ color: '#10B981' }}>🟢 AI benefit zone:</p>
                                            {aid.benefit_zone.map((t) => (
                                                <p key={t} className="text-xs" style={{ color: '#94A3B8' }}>• {t}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })()}
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

            </>)}

            {activeTab === 'seniority' && (<>
            {/* ═══════════════════════════════════════════════════════════════════
                ██  SENIORITY SUMMARY — Org-Level AI Impact KPIs
            ═══════════════════════════════════════════════════════════════════ */}
            {senioritySummary && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} style={{ color: '#7C3AED' }} />
                        <h3 className="text-sm font-semibold text-white">📊 Org-Wide Seniority & AI Impact Summary</h3>
                    </div>
                    <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                        {[
                            { label: 'Total Developers', value: senioritySummary.total_developers, color: '#00D4FF' },
                            { label: 'Avg Seniority', value: senioritySummary.avg_seniority_score.toFixed(1), color: '#7C3AED' },
                            { label: 'Devs Harmed by AI', value: senioritySummary.developers_harmed, color: '#EF4444' },
                            { label: 'Devs Benefited', value: senioritySummary.developers_benefited, color: '#10B981' },
                            { label: 'Total Harm hrs', value: `${senioritySummary.total_harm_hrs.toFixed(1)}h`, color: '#EF4444' },
                            { label: 'Net Org Impact', value: `${senioritySummary.net_org_impact_hrs > 0 ? '+' : ''}${senioritySummary.net_org_impact_hrs.toFixed(1)}h`, color: senioritySummary.net_org_impact_hrs >= 0 ? '#10B981' : '#EF4444' },
                        ].map((kpi) => (
                            <div key={kpi.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{kpi.label}</p>
                                <p className="text-lg font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                            </div>
                        ))}
                    </div>
                    {senioritySummary.worst_affected && (
                        <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                ⚠️ Worst affected: <span className="font-bold text-red-400">{senioritySummary.worst_affected}</span> — AI costs them <span className="font-bold text-red-400">{Math.abs(senioritySummary.worst_impact_hrs).toFixed(1)}h</span> per sprint
                            </p>
                        </div>
                    )}
                </div>
            )}
            {!senioritySummary && (
                <div className="glass-card p-8 text-center">
                    <div className="text-4xl mb-3">📊</div>
                    <p className="text-sm font-medium text-white">Seniority Analysis</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>No seniority summary data available yet. Analysis will appear once the system profiles developer experience levels.</p>
                </div>
            )}

            </>)}

            {activeTab === 'pipeline' && (<>
            {/* ═══════════════════════════════════════════════════════════════════
                ██  TALENT PIPELINE DEBT FORECASTER
            ═══════════════════════════════════════════════════════════════════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Shield size={18} style={{ color: '#F59E0B' }} />
                        <div>
                            <h3 className="text-base font-bold text-white">🛡️ Talent Pipeline Debt Forecaster</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Dollar-denominated talent atrophy from AI over-reliance — when the cost becomes a hiring crisis you can no longer prevent
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Summary KPIs */}
            {pipelineSummary && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 size={16} style={{ color: '#F59E0B' }} />
                        <h3 className="text-sm font-semibold text-white">📈 Pipeline Health Summary</h3>
                    </div>
                    <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
                        {[
                            { label: 'Juniors Tracked', value: pipelineSummary.total_juniors_tracked, color: '#00D4FF' },
                            { label: 'Severe Atrophy', value: pipelineSummary.severe_atrophy, color: '#EF4444' },
                            { label: 'Moderate Atrophy', value: pipelineSummary.moderate_atrophy, color: '#F59E0B' },
                            { label: 'Healthy', value: pipelineSummary.healthy, color: '#10B981' },
                            { label: 'Avg SVR', value: pipelineSummary.avg_svr.toFixed(2), color: pipelineSummary.avg_svr < 0.7 ? '#EF4444' : '#10B981' },
                            { label: 'Critical Teams', value: `${pipelineSummary.critical_teams}/${pipelineSummary.total_teams}`, color: '#EF4444' },
                            { label: 'Pipeline Debt', value: `$${(pipelineSummary.total_pipeline_debt / 1000).toFixed(0)}K`, color: '#EF4444' },
                        ].map((kpi) => (
                            <div key={kpi.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{kpi.label}</p>
                                <p className="text-lg font-black" style={{ color: kpi.color }}>{kpi.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Junior Dependency Index Cards */}
            {jdiData.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users size={16} style={{ color: '#F59E0B' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">📉 Junior Dependency Index (JDI)</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    Independent problem-solving rate — rolling 8-week windows. Declining JDI = AI over-reliance
                                </p>
                            </div>
                        </div>
                        <span className="badge-amber">{jdiData.filter(j => j.atrophy_velocity < -2).length} severe</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {jdiData.map((jdi) => {
                            const velColor = jdi.atrophy_velocity < -2 ? '#EF4444' : jdi.atrophy_velocity < -1 ? '#F59E0B' : '#10B981'
                            const bandColor = jdi.band === 'Expert' ? '#7C3AED' : jdi.band === 'Proficient' ? '#00D4FF' : jdi.band === 'Developing' ? '#F59E0B' : '#10B981'
                            return (
                                <div key={jdi.developer} className="p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-white">{jdi.developer}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: `${bandColor}15`, color: bandColor }}>{jdi.band}</span>
                                    </div>
                                    {/* Mini bar chart for JDI windows */}
                                    <div className="flex items-end gap-1 h-10 mb-2">
                                        {jdi.weekly_jdi.map((w, i) => {
                                            const barColor = w.independent_pct >= 70 ? '#10B981' : w.independent_pct >= 50 ? '#F59E0B' : '#EF4444'
                                            return (
                                                <div key={i} className="flex-1 rounded-t" title={`${w.week_range}: ${w.independent_pct}%`}
                                                    style={{ height: `${w.independent_pct}%`, background: barColor, opacity: 0.7 + (i * 0.1), minHeight: 4 }} />
                                            )
                                        })}
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span style={{ color: '#94A3B8' }}>Velocity: <span className="font-bold" style={{ color: velColor }}>{jdi.atrophy_velocity} pts/wk</span></span>
                                        <span style={{ color: '#94A3B8' }}>Proj w28: <span className="font-bold" style={{ color: jdi.projected_jdi_week28 < 40 ? '#EF4444' : '#94A3B8' }}>{jdi.projected_jdi_week28}%</span></span>
                                    </div>
                                    <div className="mt-1 text-xs" style={{ color: '#94A3B8' }}>
                                        JDI Trend: <span className="font-bold" style={{ color: jdi.jdi_trend_pts < -5 ? '#EF4444' : '#F59E0B' }}>{jdi.jdi_trend_pts > 0 ? '+' : ''}{jdi.jdi_trend_pts} pts</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Seniority Velocity Deficit Table */}
            {svdData.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity size={16} style={{ color: '#EF4444' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">⏱️ Seniority Velocity Deficit (SVD)</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Actual vs expected growth rate per tenure band — SVR {'<'} 0.7 = stalling
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                    {['Developer', 'Tenure', 'Score Growth (E/A)', 'SVR', 'Prof. Month (E/A)', 'Timeline Cost'].map((h) => (
                                        <th key={h} className="text-left pb-2 pr-3 section-title font-semibold" style={{ fontSize: 11 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {svdData.map((sv) => {
                                    const svrColor = sv.svr < 0.4 ? '#EF4444' : sv.svr < 0.7 ? '#F59E0B' : '#10B981'
                                    return (
                                        <tr key={sv.developer} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                            <td className="py-2 pr-3 text-white font-medium">{sv.developer}</td>
                                            <td className="py-2 pr-3 text-xs" style={{ color: '#94A3B8' }}>{sv.tenure_months}mo</td>
                                            <td className="py-2 pr-3 text-xs">
                                                <span style={{ color: '#10B981' }}>{sv.expected_score_growth.toFixed(1)}</span>
                                                {' / '}
                                                <span style={{ color: sv.gap_pct < -30 ? '#EF4444' : '#F59E0B' }}>{sv.actual_score_growth.toFixed(1)}</span>
                                                <span className="ml-1 text-xs font-bold" style={{ color: '#EF4444' }}>({sv.gap_pct}%)</span>
                                            </td>
                                            <td className="py-2 pr-3">
                                                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                                                    style={{ background: `${svrColor}15`, color: svrColor }}>
                                                    {sv.svr.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="py-2 pr-3 text-xs">
                                                <span style={{ color: '#10B981' }}>{sv.expected_proficient_month}mo</span>
                                                {' / '}
                                                <span style={{ color: '#EF4444' }}>{sv.projected_proficient_month}mo</span>
                                            </td>
                                            <td className="py-2 pr-3">
                                                <span className="text-xs font-bold" style={{ color: sv.timeline_cost_months > 24 ? '#EF4444' : '#F59E0B' }}>
                                                    +{sv.timeline_cost_months} months
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Team Pipeline Risk Scores */}
            {teamRisk.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle size={16} style={{ color: '#EF4444' }} />
                            <div>
                                <h3 className="text-sm font-semibold text-white">🏢 Team Pipeline Risk Scores</h3>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                    Per-team talent pipeline health — CRITICAL means external hiring is required
                                </p>
                            </div>
                        </div>
                        <span className="badge-red">{teamRisk.filter(t => t.risk_level === 'CRITICAL').length} critical</span>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {teamRisk.map((tr) => {
                            const riskColors: Record<string, string> = { CRITICAL: '#EF4444', HIGH: '#F59E0B', MODERATE: '#00D4FF', LOW: '#10B981' }
                            const rc = riskColors[tr.risk_level] || '#94A3B8'
                            return (
                                <div key={tr.team} className="p-4 rounded-xl" style={{ background: `${rc}06`, border: `1px solid ${rc}22` }}>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-bold text-white">{tr.team}</span>
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${rc}15`, color: rc }}>
                                            {tr.risk_level}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-black"
                                            style={{ background: `${rc}10`, color: rc, border: `2px solid ${rc}33` }}>
                                            {tr.risk_score}
                                        </div>
                                        <div className="text-xs space-y-1">
                                            <p style={{ color: '#94A3B8' }}>Juniors: <span className="font-bold text-white">{tr.juniors_tracked}</span></p>
                                            <p style={{ color: '#94A3B8' }}>Atrophy: <span className="font-bold" style={{ color: rc }}>{tr.atrophy_pct}%</span></p>
                                            <p style={{ color: '#94A3B8' }}>Avg SVR: <span className="font-bold" style={{ color: tr.avg_svr < 0.5 ? '#EF4444' : '#F59E0B' }}>{tr.avg_svr.toFixed(2)}</span></p>
                                        </div>
                                    </div>
                                    <div className="progress-bar mb-2">
                                        <div className="progress-fill" style={{ width: `${tr.risk_score}%`, background: `linear-gradient(90deg, ${rc}88, ${rc})` }} />
                                    </div>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        Hire externally by: <span className="font-bold" style={{ color: rc }}>{tr.external_hire_by}</span>
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Organizational Pipeline Debt Report */}
            {orgDebt && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <DollarSign size={18} style={{ color: '#EF4444' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">💰 Organizational Pipeline Debt Report — {orgDebt.quarter}</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Dollar-denominated talent atrophy cost — the executive-facing financial output
                            </p>
                        </div>
                    </div>

                    {/* Top-Level Debt Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        {[
                            { label: 'Severe Atrophy', value: `${orgDebt.severe_atrophy_count}/${orgDebt.total_juniors}`, sub: `${orgDebt.atrophy_pct}%`, color: '#EF4444' },
                            { label: 'Total Pipeline Debt', value: `$${(orgDebt.total_pipeline_debt / 1000).toFixed(0)}K`, sub: 'hiring cost equivalent', color: '#EF4444' },
                            { label: 'Senior Gap by', value: `${orgDebt.projected_senior_gap} devs`, sub: orgDebt.gap_by_quarter, color: '#F59E0B' },
                            { label: 'Preventable By', value: orgDebt.preventable_by, sub: 'intervention deadline', color: '#10B981' },
                        ].map((m) => (
                            <div key={m.label} className="text-center p-4 rounded-xl" style={{ background: `${m.color}06`, border: `1px solid ${m.color}22` }}>
                                <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>{m.label}</p>
                                <p className="text-xl font-black" style={{ color: m.color }}>{m.value}</p>
                                <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>{m.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        {[
                            { label: 'Cost/External Hire', value: `$${(orgDebt.cost_per_external_hire / 1000).toFixed(0)}K`, color: '#F59E0B' },
                            { label: 'Ramp Premium/Role', value: `$${(orgDebt.ramp_premium_per_role / 1000).toFixed(0)}K`, color: '#F59E0B' },
                            { label: 'Avg SVR (Org)', value: orgDebt.avg_svr.toFixed(2), color: orgDebt.avg_svr < 0.5 ? '#EF4444' : '#F59E0B' },
                        ].map((c) => (
                            <div key={c.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.25)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>{c.label}</p>
                                <p className="text-lg font-bold" style={{ color: c.color }}>{c.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Intervention Options */}
                    {orgDebt.interventions.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-white mb-2">💊 Intervention Options</p>
                            <div className="grid grid-cols-2 gap-3">
                                {orgDebt.interventions.map((iv) => (
                                    <div key={iv.option} className="p-4 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                        <p className="text-sm font-bold text-white mb-1">{iv.option}</p>
                                        <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>{iv.description}</p>
                                        <div className="flex items-center justify-between text-xs">
                                            <span style={{ color: '#F59E0B' }}>Cost: <span className="font-bold">${(iv.quarterly_cost / 1000).toFixed(1)}K/qtr</span></span>
                                            <span style={{ color: '#10B981' }}>Saves: <span className="font-bold">${(iv.debt_reduction / 1000).toFixed(0)}K</span></span>
                                        </div>
                                        <div className="mt-2 progress-bar">
                                            <div className="progress-fill" style={{ width: `${Math.min((iv.debt_reduction / orgDebt.total_pipeline_debt) * 100, 100)}%`, background: 'linear-gradient(90deg, #10B98188, #10B981)' }} />
                                        </div>
                                        <p className="text-xs mt-1" style={{ color: '#10B981' }}>
                                            ROI: {((iv.debt_reduction / iv.quarterly_cost) * 100).toFixed(0)}% return per quarter
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Pipeline Debt Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(245,158,11,0.06))',
                    border: '1px solid rgba(239,68,68,0.18)',
                }}
            >
                <div className="text-2xl">💎</div>
                <div>
                    <p className="text-sm font-semibold text-white">Enterprise Talent Intelligence</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        You know how many AI licenses you're paying for. We're the <span className="text-cyan-400 font-semibold">only platform</span> that tells you what those licenses are quietly costing you in future senior talent — and <span className="text-red-400 font-semibold">exactly when</span> that cost becomes a hiring crisis you can no longer prevent.
                        {pipelineSummary && <> Current debt: <span className="text-red-400 font-bold">${(pipelineSummary.total_pipeline_debt / 1000).toFixed(0)}K</span>. Gap: <span className="text-amber-400 font-bold">{pipelineSummary.projected_senior_gap} seniors</span> by {pipelineSummary.gap_by_quarter}.</>}
                    </p>
                </div>
            </div>
            {!pipelineSummary && jdiData.length === 0 && (
                <div className="glass-card p-8 text-center">
                    <div className="text-4xl mb-3">🛡️</div>
                    <p className="text-sm font-medium text-white">Pipeline Forecaster</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>No talent pipeline data available yet. Forecasts will appear once the system analyzes developer growth patterns.</p>
                </div>
            )}
            </>)}
        </div>
    )
}
