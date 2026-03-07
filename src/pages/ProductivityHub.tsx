import { useState, useEffect } from 'react'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
    LineChart, Line, AreaChart, Area, Legend,
} from 'recharts'
import { TrendingDown, TrendingUp, Clock, Download } from 'lucide-react'
import FeatureNav from '../components/FeatureNav'
import { productivityHubApi } from '../api/client'

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

export default function ProductivityHub() {
    const [selectedDev, setSelectedDev] = useState(0)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('dashboard')

    // API-driven state
    const [hpsData, setHpsData] = useState<{ dimension: string; value: number }[]>([])
    const [dimensions, setDimensions] = useState<{ label: string; value: number; color: string; weight: number }[]>([])
    const [hpsWeekly, setHpsWeekly] = useState<{ week: string; hps: number; speed: number; quality: number; wellbeing: number; collab: number; aiRatio: number }[]>([])
    const [devFlowScores, setDevFlowScores] = useState<{ name: string; deepWork: number; interrupted: number; meetings: number; flowScore: number; trend: string; delta: number }[]>([])
    const [flowTimeline, setFlowTimeline] = useState<{ hour: string; deep: number; interrupted: number; meeting: number }[]>([])
    const [contextSwitches, setContextSwitches] = useState<{ label: string; value: number; icon: string; threshold: number; unit: string }[]>([])
    const [cognitiveLoadHourly, setCognitiveLoadHourly] = useState<{ hour: string; load: number }[]>([])
    const [aiQualityByModule, setAiQualityByModule] = useState<{ module: string; accepted: number; reverted: number; modified: number; ratio: number; level: string }[]>([])
    const [aiQualityTrend, setAiQualityTrend] = useState<{ sprint: string; ratio: number }[]>([])
    const [reworkData, setReworkData] = useState<{ sprint: string; survived: number; reverted: number }[]>([])
    const [reworkPRs, setReworkPRs] = useState<{ pr: string; title: string; dev: string; aiPct: number; reworkHrs: number; reason: string; file: string; status: string }[]>([])

    useEffect(() => {
        productivityHubApi.dashboard().then((d) => {
            setHpsData(d.hps_radar)
            setDimensions(d.dimensions)
            setHpsWeekly(d.hps_weekly.map((w) => ({ ...w, aiRatio: w.ai_ratio })))
            setDevFlowScores(d.dev_flow_scores.map((f) => ({
                name: f.name, deepWork: f.deep_work, interrupted: f.interrupted,
                meetings: f.meetings, flowScore: f.flow_score, trend: f.trend, delta: f.delta,
            })))
            setFlowTimeline(d.flow_timeline)
            setContextSwitches(d.context_switches)
            setCognitiveLoadHourly(d.cognitive_load_hourly)
            setAiQualityByModule(d.ai_quality_by_module)
            setAiQualityTrend(d.ai_quality_trend)
            setReworkData(d.rework_data)
            setReworkPRs(d.rework_prs.map((p) => ({
                pr: p.pr, title: p.title, dev: p.dev, aiPct: p.ai_pct,
                reworkHrs: p.rework_hrs, reason: p.reason, file: p.file, status: p.status,
            })))
            setLoading(false)
        }).catch((err) => { console.error('ProductivityHub fetch error:', err); setLoading(false) })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Productivity Hub…</div>
            </div>
        )
    }

    if (devFlowScores.length === 0) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-2xl font-bold text-white">Productivity Hub</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Holistic Productivity Score — far beyond lines of code
                    </p>
                </div>
                <div className="glass-card p-12 text-center">
                    <div className="text-4xl mb-4">⚡</div>
                    <p className="text-sm font-medium text-white">No Productivity Data Available</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Unable to load productivity metrics. Please ensure the backend server is running on port 8000.</p>
                </div>
            </div>
        )
    }

    const dev = devFlowScores[selectedDev] || devFlowScores[0]

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

            <FeatureNav
                tabs={[
                    { key: 'dashboard', label: 'Dashboard' },
                    { key: 'ai-quality', label: 'AI Quality & Rework' },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
            />

            {activeTab === 'dashboard' && (<>
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

            </>)}

            {activeTab === 'ai-quality' && (<>
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
            </>)}
        </div>
    )
}
