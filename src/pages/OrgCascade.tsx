import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Download } from 'lucide-react'
import {
    orgCascadeApi,
    type OrgGapSummary, type OCDoraMetric, type OCBottleneck,
    type OCAmplifier, type OCCascadeStage, type OCRoiReportEntry, type OCDoraCorrelation,
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

    useEffect(() => {
        orgCascadeApi.dashboard().then((d) => {
            setSummary(d.summary)
            setDoraData(d.dora_metrics)
            setBottlenecks(d.bottlenecks)
            setAmplifiers(d.amplifiers)
            setCascadeFlow(d.cascade_flow)
            setRoiReport(d.roi_report)
            setCorrelations(d.dora_correlations)
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
        </div>
    )
}
