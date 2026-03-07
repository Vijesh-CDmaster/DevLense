import { useState, useEffect } from 'react'
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    RadialBarChart, RadialBar, Legend,
} from 'recharts'
import { Download, Trash2, AlertTriangle, Gauge, Users, TrendingDown, Zap } from 'lucide-react'
import {
    orgCascadeApi,
    type OrgGapSummary, type OCDoraMetric, type OCBottleneck,
    type OCAmplifier, type OCCascadeStage, type OCRoiReportEntry, type OCDoraCorrelation,
    type OCWasteEntry, type OCWasteWeeklyTrend, type OCTrueAIROI,
    type OCTeamWasteBreakdown, type OCCascadeEfficiency, type OCTeamCascadeView,
    type OCFlowStageDetail, type OCStoryPointTracker,
} from '../api/client'

const fallbackSummary: OrgGapSummary = { org_gap: -31.8, individual_gain: 21, team_impact: 0 }

const fallbackDora: OCDoraMetric[] = [
    { metric: 'Lead Time', value: 4.2, target: 2, unit: 'd' },
    { metric: 'Deploy Freq', value: 2, target: 5, unit: '/wk' },
    { metric: 'MTTR', value: 3.1, target: 1, unit: 'h' },
    { metric: 'Fail Rate', value: 12, target: 5, unit: '%' },
]

const fallbackBottlenecks: OCBottleneck[] = [
    { label: 'Code Review Delays', loss: 18, color: '#EF4444' },
    { label: 'Deploy Pipeline Waits', loss: 8, color: '#F59E0B' },
    { label: 'Meeting Overhead', loss: 5, color: '#F59E0B' },
    { label: 'Context Switching', loss: 3, color: '#10B981' },
]

const fallbackAmplifiers: OCAmplifier[] = [
    { practice: 'Daily standups < 15min', impact: 'Amplifier ✅', color: '#10B981' },
    { practice: 'PR size < 200 lines', impact: 'Amplifier ✅', color: '#10B981' },
    { practice: 'Manual code review > 48h', impact: 'Killer ❌', color: '#EF4444' },
    { practice: 'Multi-stage CI/CD pipeline', impact: 'Killer ❌', color: '#EF4444' },
    { practice: 'Pair programming sessions', impact: 'Amplifier ✅', color: '#10B981' },
]

const fallbackCascade: OCCascadeStage[] = [
    { stage: 'Individual AI Gains', pct: 100, color: '#00D4FF' },
    { stage: 'After Code Review', pct: 82, color: '#7C3AED' },
    { stage: 'After Deploy Pipeline', pct: 74, color: '#F59E0B' },
    { stage: 'After Team Meetings', pct: 69, color: '#F59E0B' },
    { stage: 'Org Delivery Impact', pct: 66, color: '#EF4444' },
]

const fallbackRoi: OCRoiReportEntry[] = [
    { week: 'Week 1', ai_investment: 12000, measured_gain: 8400, org_throughput_delta: -2.1, effective_roi: -0.30 },
    { week: 'Week 2', ai_investment: 12000, measured_gain: 9100, org_throughput_delta: -1.5, effective_roi: -0.24 },
    { week: 'Week 3', ai_investment: 12000, measured_gain: 9800, org_throughput_delta: 0.3, effective_roi: -0.18 },
    { week: 'Week 4', ai_investment: 12000, measured_gain: 10200, org_throughput_delta: 1.1, effective_roi: -0.15 },
]

const fallbackCorrelations: OCDoraCorrelation[] = [
    { metric: 'Lead Time', ai_usage_pct: 78, metric_change_pct: -2.1, correlation: 0.12, trend: 'flat' },
    { metric: 'Deploy Freq', ai_usage_pct: 78, metric_change_pct: 0.5, correlation: 0.08, trend: 'flat' },
    { metric: 'MTTR', ai_usage_pct: 78, metric_change_pct: -5.3, correlation: 0.31, trend: 'improving' },
    { metric: 'Fail Rate', ai_usage_pct: 78, metric_change_pct: 3.2, correlation: -0.22, trend: 'worsening' },
]

export default function OrgCascade() {
    const [summary, setSummary] = useState<OrgGapSummary>(fallbackSummary)
    const [doraData, setDoraData] = useState<OCDoraMetric[]>(fallbackDora)
    const [bottlenecks, setBottlenecks] = useState<OCBottleneck[]>(fallbackBottlenecks)
    const [amplifiers, setAmplifiers] = useState<OCAmplifier[]>(fallbackAmplifiers)
    const [cascadeFlow, setCascadeFlow] = useState<OCCascadeStage[]>(fallbackCascade)
    const [roiReport, setRoiReport] = useState<OCRoiReportEntry[]>(fallbackRoi)
    const [correlations, setCorrelations] = useState<OCDoraCorrelation[]>(fallbackCorrelations)

    // AI Waste Classifier state
    const [wasteEntries, setWasteEntries] = useState<OCWasteEntry[]>([])
    const [wasteTrends, setWasteTrends] = useState<OCWasteWeeklyTrend[]>([])
    const [trueRoi, setTrueRoi] = useState<OCTrueAIROI | null>(null)
    const [teamWaste, setTeamWaste] = useState<OCTeamWasteBreakdown[]>([])

    // DORA-AI Cascade state
    const [cascadeEfficiency, setCascadeEfficiency] = useState<OCCascadeEfficiency | null>(null)
    const [teamCascades, setTeamCascades] = useState<OCTeamCascadeView[]>([])
    const [flowDetails, setFlowDetails] = useState<OCFlowStageDetail[]>([])
    const [storyPoints, setStoryPoints] = useState<OCStoryPointTracker[]>([])

    useEffect(() => {
        orgCascadeApi.dashboard().then((d) => {
            setSummary(d.summary)
            setDoraData(d.dora_metrics)
            setBottlenecks(d.bottlenecks)
            setAmplifiers(d.amplifiers)
            setCascadeFlow(d.cascade_flow)
            setRoiReport(d.roi_report)
            setCorrelations(d.dora_correlations)
            // AI Waste Classifier
            if (d.waste_entries) setWasteEntries(d.waste_entries)
            if (d.waste_trends) setWasteTrends(d.waste_trends)
            if (d.true_ai_roi) setTrueRoi(d.true_ai_roi)
            if (d.team_waste) setTeamWaste(d.team_waste)
            // DORA-AI Cascade
            if (d.cascade_efficiency) setCascadeEfficiency(d.cascade_efficiency)
            if (d.team_cascades) setTeamCascades(d.team_cascades)
            if (d.flow_details) setFlowDetails(d.flow_details)
            if (d.story_points) setStoryPoints(d.story_points)
        }).catch(() => {})
    }, [])

    const trendColor = (t: string) =>
        t === 'improving' ? '#10B981' : t === 'worsening' ? '#EF4444' : '#94A3B8'

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Org Cascade</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Why individual AI gains don't reach org-level delivery
                    </p>
                </div>
                <button className="btn-primary">
                    <Download size={13} /> Export ROI Report
                </button>
            </div>

            {/* Org Gap Hero */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center glow-danger">
                    <p className="section-title">Org Productivity Gap</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#EF4444' }}>{summary.org_gap}%</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Gains lost at org level</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Individual AI Gain</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#00D4FF' }}>+{summary.individual_gain}%</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Avg developer productivity</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Team Delivery Impact</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>{summary.team_impact}%</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>DORA metrics unchanged</p>
                </div>
            </div>

            {/* Cascade Flow */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">📉 Productivity Cascade Flow</h3>
                <div className="space-y-3">
                    {cascadeFlow.map((stage, i) => (
                        <div key={i}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                                <span style={{ color: '#94A3B8' }}>{stage.stage}</span>
                                <span className="font-bold" style={{ color: stage.color }}>
                                    {stage.pct}%
                                </span>
                            </div>
                            <div className="progress-bar h-3" style={{ height: 10 }}>
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${stage.pct}%`,
                                        background: `linear-gradient(90deg, ${stage.color}88, ${stage.color})`,
                                    }}
                                />
                            </div>
                            {i < cascadeFlow.length - 1 && (
                                <div className="text-center my-1">
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>
                                        ↓ -{(cascadeFlow[i].pct - cascadeFlow[i + 1].pct).toFixed(0)}% lost
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Bottleneck Heatmap */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔥 Bottleneck Heatmap</h3>
                    <div className="space-y-3">
                        {bottlenecks.map((b) => (
                            <div key={b.label}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span style={{ color: '#94A3B8' }}>{b.label}</span>
                                    <span className="font-bold" style={{ color: b.color }}>
                                        -{b.loss}%
                                    </span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(b.loss / 20) * 100}%`,
                                            background: `linear-gradient(90deg, ${b.color}66, ${b.color})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DORA Metrics */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">📊 Live DORA Metrics</h3>
                    <div className="space-y-4">
                        {doraData.map((d) => (
                            <div key={d.metric} className="flex items-center justify-between">
                                <span className="text-xs" style={{ color: '#94A3B8' }}>{d.metric}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">
                                        {d.value}{d.unit}
                                    </span>
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>
                                        (target: {d.target}{d.unit})
                                    </span>
                                    <span
                                        className="text-xs font-bold"
                                        style={{ color: d.value > d.target ? '#EF4444' : '#10B981' }}
                                    >
                                        {d.value > d.target ? '▲' : '▼'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="mt-4 p-3 rounded-lg"
                        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
                    >
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            🔴 All DORA metrics remain unchanged despite +{summary.individual_gain}% individual AI gains
                        </p>
                    </div>
                </div>
            </div>

            {/* DORA-AI Correlation Engine */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">🔗 DORA-AI Correlation Engine</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                {['DORA Metric', 'AI Usage', 'Metric Δ', 'Correlation', 'Trend'].map((h) => (
                                    <th key={h} className="text-left pb-3 pr-4 section-title" style={{ fontSize: 11 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {correlations.map((c, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                    <td className="py-3 text-white text-sm">{c.metric}</td>
                                    <td className="py-3 text-sm" style={{ color: '#94A3B8' }}>{c.ai_usage_pct}%</td>
                                    <td className="py-3 text-sm font-semibold" style={{ color: c.metric_change_pct < 0 ? '#10B981' : '#EF4444' }}>
                                        {c.metric_change_pct > 0 ? '+' : ''}{c.metric_change_pct}%
                                    </td>
                                    <td className="py-3 text-sm text-white">{c.correlation.toFixed(2)}</td>
                                    <td className="py-3">
                                        <span className="text-xs font-semibold px-2 py-1 rounded-full"
                                            style={{ color: trendColor(c.trend), background: `${trendColor(c.trend)}15` }}>
                                            {c.trend}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* AI ROI Reality Report */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">💰 AI ROI Reality Report</h3>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={roiReport}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                        <Tooltip
                            contentStyle={{ background: '#0B1120', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }}
                        />
                        <Bar dataKey="ai_investment" name="AI Investment ($)" fill="#7C3AED" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="measured_gain" name="Measured Gain ($)" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-4 gap-3 mt-4">
                    {roiReport.map((r) => (
                        <div key={r.week} className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.3)' }}>
                            <p className="text-xs font-semibold text-white">{r.week}</p>
                            <p className="text-xs mt-1" style={{ color: r.effective_roi < 0 ? '#EF4444' : '#10B981' }}>
                                ROI: {(r.effective_roi * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                Δ Throughput: {r.org_throughput_delta > 0 ? '+' : ''}{r.org_throughput_delta}%
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Team Amplifier Detector */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">⚡ Team Amplifier Detector</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                {['Team Practice', 'Effect on AI Productivity'].map((h) => (
                                    <th key={h} className="text-left pb-3 pr-4 section-title" style={{ fontSize: 11 }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {amplifiers.map((a, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                    <td className="py-3 text-white text-sm">{a.practice}</td>
                                    <td className="py-3">
                                        <span className="font-semibold text-sm" style={{ color: a.color }}>
                                            {a.impact}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ══════════════════════════════════════════════ */}
            {/* TRUE AI ROI CARD — The Hero of Waste Classifier */}
            {/* ══════════════════════════════════════════════ */}
            {trueRoi && (
                <div className="glass-card p-6 glow-danger">
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-2">
                            <Trash2 size={18} style={{ color: '#EF4444' }} />
                            <h3 className="text-lg font-bold text-white">True AI ROI — This Week</h3>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-full font-semibold"
                            style={{ color: '#EF4444', background: 'rgba(239,68,68,0.12)' }}>
                            {trueRoi.ai_assisted_commits} AI-assisted commits
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-5">
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Gross Time Saved</p>
                            <p className="text-3xl font-black mt-1" style={{ color: '#00D4FF' }}>~{trueRoi.gross_hours_saved}h</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Waste Consumed</p>
                            <p className="text-3xl font-black mt-1" style={{ color: '#EF4444' }}>-{(trueRoi.gross_hours_saved - trueRoi.net_org_gain).toFixed(1)}h</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Net Org Gain</p>
                            <p className="text-3xl font-black mt-1" style={{ color: '#10B981' }}>{trueRoi.net_org_gain}h</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Waste Absorption Rate</p>
                            <p className="text-3xl font-black mt-1" style={{ color: '#EF4444' }}>{trueRoi.waste_absorption_rate}%</p>
                        </div>
                    </div>

                    {/* Waste breakdown bars */}
                    <div className="space-y-3">
                        <p className="section-title">Waste Breakdown</p>
                        {trueRoi.waste_breakdown.map((w) => (
                            <div key={w.type}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span style={{ color: '#94A3B8' }}>{w.type}</span>
                                    <span className="font-bold" style={{ color: '#EF4444' }}>-{w.hours}h ({w.pct}%)</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="progress-fill" style={{
                                        width: `${w.pct}%`,
                                        background: 'linear-gradient(90deg, #EF444466, #EF4444)',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            💡 <strong style={{ color: '#EF4444' }}>{Math.round(trueRoi.waste_absorption_rate)}%</strong> of individual AI productivity gains are absorbed by downstream waste before reaching organizational outcomes. Only <strong style={{ color: '#10B981' }}>{Math.round(100 - trueRoi.waste_absorption_rate)}%</strong> of AI value survives to the org level.
                        </p>
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* AI WASTE CLASSIFIER — 5 Waste Types */}
            {/* ══════════════════════════════════════════════ */}
            {wasteEntries.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                        <h3 className="text-sm font-semibold text-white">AI Waste Classifier — 5 Waste Taxonomy</h3>
                    </div>
                    <div className="space-y-4">
                        {wasteEntries.sort((a, b) => b.hours_consumed - a.hours_consumed).map((w) => (
                            <div key={w.waste_type} className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: `1px solid ${w.color}33` }}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ background: w.color }} />
                                        <span className="text-sm font-semibold text-white">{w.label}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                            style={{
                                                color: w.severity === 'critical' ? '#DC2626' : w.severity === 'high' ? '#EF4444' : '#F59E0B',
                                                background: w.severity === 'critical' ? 'rgba(220,38,38,0.12)' : w.severity === 'high' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)',
                                            }}>
                                            {w.severity}
                                        </span>
                                        <span className="text-sm font-bold" style={{ color: w.color }}>-{w.hours_consumed}h</span>
                                    </div>
                                </div>
                                <p className="text-xs mb-1.5" style={{ color: '#94A3B8' }}>
                                    <strong>Detection:</strong> {w.detection_source}
                                </p>
                                <p className="text-xs" style={{ color: '#CBD5E1' }}>{w.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Waste Weekly Trends + Team Waste Breakdown */}
            <div className="grid grid-cols-2 gap-6">
                {/* Waste Trend Chart */}
                {wasteTrends.length > 0 && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingDown size={16} style={{ color: '#F59E0B' }} />
                            <h3 className="text-sm font-semibold text-white">Waste vs. Net Gain Trend</h3>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={wasteTrends}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                                <Area type="monotone" dataKey="gross_gain" name="Gross Gain (hrs)" stroke="#00D4FF" fill="#00D4FF22" strokeWidth={2} />
                                <Area type="monotone" dataKey="total_waste" name="Total Waste (hrs)" stroke="#EF4444" fill="#EF444422" strokeWidth={2} />
                                <Area type="monotone" dataKey="net_gain" name="Net Gain (hrs)" stroke="#10B981" fill="#10B98122" strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                        <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#00D4FF' }} />Gross</span>
                            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#EF4444' }} />Waste</span>
                            <span><span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: '#10B981' }} />Net</span>
                        </div>
                    </div>
                )}

                {/* Team Waste Breakdown */}
                {teamWaste.length > 0 && (
                    <div className="glass-card p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Users size={16} style={{ color: '#7C3AED' }} />
                            <h3 className="text-sm font-semibold text-white">Team Waste Breakdown</h3>
                        </div>
                        <div className="space-y-4">
                            {teamWaste.sort((a, b) => b.total_waste_hrs - a.total_waste_hrs).map((tw) => (
                                <div key={tw.team}>
                                    <div className="flex items-center justify-between text-xs mb-1.5">
                                        <span className="text-white font-semibold">{tw.team}</span>
                                        <span style={{ color: tw.waste_absorption_rate > 60 ? '#EF4444' : tw.waste_absorption_rate > 40 ? '#F59E0B' : '#10B981' }}>
                                            {tw.total_waste_hrs}h waste · {tw.waste_absorption_rate}% absorbed
                                        </span>
                                    </div>
                                    {/* Stacked mini bars */}
                                    <div className="flex h-3 rounded-full overflow-hidden" style={{ background: 'rgba(30,45,74,0.4)' }}>
                                        {[
                                            { val: tw.review_overflow, color: '#DC2626', label: 'Review' },
                                            { val: tw.rework, color: '#EF4444', label: 'Rework' },
                                            { val: tw.context_switch, color: '#F59E0B', label: 'Ctx Switch' },
                                            { val: tw.coordination, color: '#8B5CF6', label: 'Coord' },
                                            { val: tw.quality_tax, color: '#F97316', label: 'Quality' },
                                        ].map((seg) => (
                                            <div key={seg.label} title={`${seg.label}: ${seg.val}h`}
                                                style={{ width: `${(seg.val / tw.total_waste_hrs) * 100}%`, background: seg.color }} />
                                        ))}
                                    </div>
                                    <div className="flex gap-2 mt-1">
                                        {[{ l: 'Rev', c: '#DC2626' }, { l: 'Rew', c: '#EF4444' }, { l: 'Ctx', c: '#F59E0B' }, { l: 'Crd', c: '#8B5CF6' }, { l: 'Qlt', c: '#F97316' }].map((x) => (
                                            <span key={x.l} className="text-xs flex items-center gap-0.5" style={{ color: '#94A3B8' }}>
                                                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: x.c }} />{x.l}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ══════════════════════════════════════════════ */}
            {/* CASCADE EFFICIENCY SCORE — Single Number Hero */}
            {/* ══════════════════════════════════════════════ */}
            {cascadeEfficiency && (
                <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Gauge size={18} style={{ color: '#7C3AED' }} />
                        <h3 className="text-lg font-bold text-white">Cascade Efficiency Score</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full ml-2" style={{
                            color: cascadeEfficiency.score < 30 ? '#EF4444' : cascadeEfficiency.score < 50 ? '#F59E0B' : '#10B981',
                            background: cascadeEfficiency.score < 30 ? 'rgba(239,68,68,0.12)' : cascadeEfficiency.score < 50 ? 'rgba(245,158,11,0.12)' : 'rgba(16,185,129,0.12)',
                        }}>
                            {cascadeEfficiency.trend.replace('_', ' ')}
                        </span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-5">
                        <div className="p-5 rounded-xl text-center" style={{
                            background: `rgba(${cascadeEfficiency.score < 30 ? '239,68,68' : cascadeEfficiency.score < 50 ? '245,158,11' : '16,185,129'},0.08)`,
                            border: `2px solid ${cascadeEfficiency.score < 30 ? '#EF4444' : cascadeEfficiency.score < 50 ? '#F59E0B' : '#10B981'}33`,
                        }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Cascade Score</p>
                            <p className="text-5xl font-black mt-1" style={{
                                color: cascadeEfficiency.score < 30 ? '#EF4444' : cascadeEfficiency.score < 50 ? '#F59E0B' : '#10B981',
                            }}>{cascadeEfficiency.score}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>out of 100</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(0,212,255,0.06)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Individual Gain</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: '#00D4FF' }}>+{cascadeEfficiency.individual_gain_pct}%</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(124,58,237,0.06)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Team Throughput</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: '#7C3AED' }}>+{cascadeEfficiency.team_throughput_pct}%</p>
                        </div>
                        <div className="p-4 rounded-xl text-center" style={{ background: 'rgba(16,185,129,0.06)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>Org Delivery</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: '#10B981' }}>+{cascadeEfficiency.org_delivery_pct}%</p>
                        </div>
                    </div>

                    {/* Leak stages */}
                    <p className="section-title mb-3">Where Value Leaks</p>
                    <div className="space-y-3">
                        {cascadeEfficiency.leak_stages.map((leak, i) => (
                            <div key={i} className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-semibold text-white">{leak.stage}</span>
                                    <span className="text-sm font-bold" style={{ color: '#EF4444' }}>-{leak.loss_pct}%</span>
                                </div>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>{leak.reason}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ══════════════════════════════════════════════ */}
            {/* REAL-TIME FLOW DIAGRAM — Value Cascade with Sources */}
            {/* ══════════════════════════════════════════════ */}
            {flowDetails.length > 0 && (
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap size={16} style={{ color: '#00D4FF' }} />
                        <h3 className="text-sm font-semibold text-white">Real-Time Value Flow — Individual → Team → Org</h3>
                    </div>
                    <div className="space-y-0">
                        {flowDetails.map((fd, i) => (
                            <div key={i}>
                                <div className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: `1px solid ${fd.color}33` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ background: fd.color }} />
                                            <span className="text-sm font-semibold text-white">{fd.stage}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs">
                                            <span style={{ color: '#94A3B8' }}>In: <strong className="text-white">{fd.value_in}%</strong></span>
                                            <span style={{ color: '#94A3B8' }}>Out: <strong style={{ color: fd.color }}>{fd.value_out}%</strong></span>
                                            {fd.loss > 0 && <span className="font-bold" style={{ color: '#EF4444' }}>-{fd.loss}%</span>}
                                        </div>
                                    </div>
                                    <div className="progress-bar h-3" style={{ height: 10 }}>
                                        <div className="h-full rounded-full" style={{
                                            width: `${fd.value_out}%`,
                                            background: `linear-gradient(90deg, ${fd.color}88, ${fd.color})`,
                                        }} />
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                                            <strong>Source:</strong> {fd.source}
                                        </p>
                                        {fd.leak_reason !== '—' && (
                                            <p className="text-xs" style={{ color: '#EF4444' }}>{fd.leak_reason}</p>
                                        )}
                                    </div>
                                </div>
                                {i < flowDetails.length - 1 && (
                                    <div className="flex justify-center py-1">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>↓</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Team Cascade Views + Story Point Paradox */}
            <div className="grid grid-cols-2 gap-6">
                {/* Team Cascade Comparison */}
                {teamCascades.length > 0 && (
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">🏢 Team Cascade Comparison</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                        {['Team', 'AI %', 'PRs', 'Review Lag', 'Deploy/wk', 'Efficiency', 'Platform'].map((h) => (
                                            <th key={h} className="text-left pb-2 pr-3 section-title" style={{ fontSize: 10 }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {teamCascades.map((tc) => (
                                        <tr key={tc.team} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                            <td className="py-2 text-white text-xs font-semibold">{tc.team}</td>
                                            <td className="py-2 text-xs" style={{ color: '#00D4FF' }}>{tc.ai_usage_pct}%</td>
                                            <td className="py-2 text-xs" style={{ color: '#94A3B8' }}>{tc.pr_volume}</td>
                                            <td className="py-2 text-xs" style={{
                                                color: tc.pr_review_latency_hrs > 4 ? '#EF4444' : tc.pr_review_latency_hrs > 2 ? '#F59E0B' : '#10B981',
                                            }}>{tc.pr_review_latency_hrs}h</td>
                                            <td className="py-2 text-xs" style={{ color: '#94A3B8' }}>{tc.deploy_frequency}</td>
                                            <td className="py-2">
                                                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{
                                                    color: tc.cascade_efficiency > 50 ? '#10B981' : tc.cascade_efficiency > 35 ? '#F59E0B' : '#EF4444',
                                                    background: tc.cascade_efficiency > 50 ? 'rgba(16,185,129,0.12)' : tc.cascade_efficiency > 35 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                                                }}>{tc.cascade_efficiency}%</span>
                                            </td>
                                            <td className="py-2">
                                                <span className="text-xs px-2 py-0.5 rounded-full" style={{
                                                    color: tc.platform_maturity === 'high' ? '#10B981' : tc.platform_maturity === 'medium' ? '#F59E0B' : '#EF4444',
                                                    background: tc.platform_maturity === 'high' ? 'rgba(16,185,129,0.12)' : tc.platform_maturity === 'medium' ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)',
                                                }}>{tc.platform_maturity}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                🔍 Teams with <strong style={{ color: '#10B981' }}>high platform maturity</strong> convert 2x more AI gains into org delivery. Highest AI usage ≠ highest efficiency.
                            </p>
                        </div>
                    </div>
                )}

                {/* Story Point Paradox */}
                {storyPoints.length > 0 && (
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">📊 Story Point Paradox Tracker</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={storyPoints}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} />
                                <Tooltip contentStyle={{ background: '#0B1120', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                                <Bar dataKey="planned" name="Planned" fill="#7C3AED44" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="completed" name="Completed" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="grid grid-cols-5 gap-2 mt-3">
                            {storyPoints.map((sp) => (
                                <div key={sp.sprint} className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.3)' }}>
                                    <p className="text-xs font-semibold text-white">{sp.sprint.replace('Sprint ', 'S')}</p>
                                    <p className="text-xs mt-0.5" style={{ color: '#00D4FF' }}>AI: {sp.ai_assisted_pct}%</p>
                                    <p className="text-xs" style={{
                                        color: sp.delivery_rate > 83 ? '#10B981' : sp.delivery_rate > 80 ? '#F59E0B' : '#EF4444',
                                    }}>Del: {sp.delivery_rate}%</p>
                                </div>
                            ))}
                        </div>
                        {storyPoints.length >= 2 && (() => {
                            const first = storyPoints[0]
                            const last = storyPoints[storyPoints.length - 1]
                            const aiUp = last.ai_assisted_pct > first.ai_assisted_pct
                            const delDown = last.delivery_rate < first.delivery_rate
                            return aiUp && delDown ? (
                                <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        🚨 <strong style={{ color: '#EF4444' }}>Paradox Detected:</strong> AI-assisted work rose from {first.ai_assisted_pct}% → {last.ai_assisted_pct}% but delivery rate dropped from {first.delivery_rate}% → {last.delivery_rate}%. More AI coding ≠ more delivery.
                                    </p>
                                </div>
                            ) : null
                        })()}
                    </div>
                )}
            </div>
        </div>
    )
}
