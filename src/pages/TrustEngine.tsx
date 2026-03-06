import { useState, useEffect } from 'react'
import { ShieldCheck, AlertCircle, Download, Eye, FileWarning, TrendingUp, TrendingDown, Users, Calculator, BarChart3 } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts'
import { trustEngineApi } from '../api/client'
import type { TEDeveloperProfile } from '../api/client'

export default function TrustEngine() {
    const [activeIdx, setActiveIdx] = useState(1)
    const [loading, setLoading] = useState(true)

    const [suggestions, setSuggestions] = useState<{
        code: string; trust: number; taskType: string; complexity: string
        rec: string; level: string; filesAffected: number; contextMatch: number
        historicalAccuracy: number; riskFactors: string[]
    }[]>([])
    const [taskTypes, setTaskTypes] = useState<{ type: string; accuracy: number; total: number; accepted: number; reverted: number }[]>([])
    const [calibrationData, setCalibrationData] = useState<{ week: string; trusted: number; correct: number; overtrust: number }[]>([])
    const [confidenceMeters, setConfidenceMeters] = useState<{
        id: string; suggestion: string; contextScore: number; complexityPenalty: number
        historyBonus: number; finalConfidence: number; factors: string[]
    }[]>([])
    const [verifyAlerts, setVerifyAlerts] = useState<{
        id: string; code: string; reason: string; severity: string
        falsePositiveRate: number; taskType: string; suggestedAction: string
    }[]>([])
    const [weeklyReport, setWeeklyReport] = useState<{
        totalSuggestions: number; accepted: number; rejected: number; reverted: number
        netAccuracy: number; bestTaskType: string; worstTaskType: string
        calibrationScore: number; calibrationLabel: string; trend: string
        weeklyTrend: { week: string; accuracy: number; acceptance: number }[]
    } | null>(null)
    const [devProfiles, setDevProfiles] = useState<TEDeveloperProfile[]>([])
    const [selectedDev, setSelectedDev] = useState<string>('')
    const [calcTaskType, setCalcTaskType] = useState('Refactoring')
    const [calcComplexity, setCalcComplexity] = useState('Medium')
    const [calcFiles, setCalcFiles] = useState(1)
    const [calcContext, setCalcContext] = useState(70)
    const [calcResult, setCalcResult] = useState<{
        trust: number; level: string; rec: string
        breakdown: { base_accuracy: number; complexity_penalty: number; file_penalty: number; context_bonus: number }
    } | null>(null)
    const [calcLoading, setCalcLoading] = useState(false)

    useEffect(() => {
        trustEngineApi.dashboard().then((d) => {
            setSuggestions(d.suggestions.map((s) => ({
                code: s.code, trust: s.trust, taskType: s.task_type,
                complexity: s.complexity, rec: s.rec, level: s.level,
                filesAffected: s.files_affected, contextMatch: s.context_match,
                historicalAccuracy: s.historical_accuracy, riskFactors: s.risk_factors,
            })))
            setTaskTypes(d.task_types)
            setCalibrationData(d.calibration)
            setConfidenceMeters(d.confidence_meters.map((c) => ({
                id: c.id, suggestion: c.suggestion, contextScore: c.context_score,
                complexityPenalty: c.complexity_penalty, historyBonus: c.history_bonus,
                finalConfidence: c.final_confidence, factors: c.factors,
            })))
            setVerifyAlerts(d.verify_alerts.map((v) => ({
                id: v.id, code: v.code, reason: v.reason, severity: v.severity,
                falsePositiveRate: v.false_positive_rate, taskType: v.task_type,
                suggestedAction: v.suggested_action,
            })))
            setWeeklyReport({
                totalSuggestions: d.weekly_report.total_suggestions,
                accepted: d.weekly_report.accepted,
                rejected: d.weekly_report.rejected,
                reverted: d.weekly_report.reverted,
                netAccuracy: d.weekly_report.net_accuracy,
                bestTaskType: d.weekly_report.best_task_type,
                worstTaskType: d.weekly_report.worst_task_type,
                calibrationScore: d.weekly_report.calibration_score,
                calibrationLabel: d.weekly_report.calibration_label,
                trend: d.weekly_report.trend,
                weeklyTrend: d.weekly_report.weekly_trend,
            })
            setDevProfiles(d.developer_profiles)
            if (d.developer_profiles.length > 0) setSelectedDev(d.developer_profiles[0].name)
            setLoading(false)
        }).catch((err) => { console.error('TrustEngine fetch error:', err); setLoading(false) })
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-sm" style={{ color: '#94A3B8' }}>Loading Trust Engine…</div>
            </div>
        )
    }

    const s = suggestions[activeIdx] || suggestions[0]
    const trustColor = s.level === 'green' ? '#10B981' : s.level === 'amber' ? '#F59E0B' : '#EF4444'

    const activeDev = devProfiles.find((p) => p.name === selectedDev)

    const runCalculator = () => {
        setCalcLoading(true)
        trustEngineApi.score(calcTaskType, calcComplexity, calcFiles, calcContext, selectedDev || undefined)
            .then(setCalcResult)
            .catch(console.error)
            .finally(() => setCalcLoading(false))
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Trust Engine</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Know exactly when to trust AI — per suggestion, per task type, per developer
                    </p>
                </div>
                <button className="btn-primary">
                    <Download size={13} /> Export Trust Report
                </button>
            </div>

            {/* ══════ Real-time Trust Score per Suggestion ══════ */}
            <div className="glass-card p-6">
                <div className="grid grid-cols-2 gap-8 items-start">
                    <div>
                        <p className="section-title mb-2">🔍 Select AI Suggestion to Analyse</p>
                        <div className="space-y-2 mb-4">
                            {suggestions.map((sg, i) => {
                                const sgColor = sg.level === 'green' ? '#10B981' : sg.level === 'amber' ? '#F59E0B' : '#EF4444'
                                return (
                                    <button
                                        key={i}
                                        onClick={() => setActiveIdx(i)}
                                        className="w-full text-left p-3 rounded-lg transition-all"
                                        style={{
                                            background: activeIdx === i ? 'rgba(0,212,255,0.1)' : 'rgba(30,45,74,0.4)',
                                            border: `1px solid ${activeIdx === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-mono flex-1 truncate" style={{ color: '#94A3B8' }}>
                                                {sg.code}
                                            </p>
                                            <span className="text-xs font-bold ml-2 shrink-0" style={{ color: sgColor }}>{sg.trust}%</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <p className="section-title">Real-time Trust Score</p>
                        <div
                            className="w-36 h-36 rounded-full flex flex-col items-center justify-center"
                            style={{
                                background: `conic-gradient(${trustColor} 0% ${s.trust}%, #1E2D4A ${s.trust}% 100%)`,
                                padding: 5,
                                boxShadow: `0 0 30px ${trustColor}44`,
                            }}
                        >
                            <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: '#0F1629' }}>
                                <span className="text-3xl font-black" style={{ color: trustColor }}>{s.trust}%</span>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>trust</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <span className={`badge-${s.level} text-sm`}>
                                {s.level === 'green' ? '✅' : s.level === 'amber' ? '⚠️' : '🔴'} {s.rec}
                            </span>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-3 text-xs text-left">
                                <div style={{ color: '#94A3B8' }}>Task Type: <span className="text-white">{s.taskType}</span></div>
                                <div style={{ color: '#94A3B8' }}>Complexity: <span className="text-white">{s.complexity}</span></div>
                                <div style={{ color: '#94A3B8' }}>Files: <span className="text-white">{s.filesAffected}</span></div>
                                <div style={{ color: '#94A3B8' }}>Context Match: <span className="text-white">{s.contextMatch}%</span></div>
                            </div>
                        </div>
                        {/* Risk factors */}
                        {s.riskFactors.length > 0 && (
                            <div className="w-full mt-1">
                                <p className="text-xs font-semibold mb-1.5" style={{ color: '#94A3B8' }}>⚠️ Risk Factors</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {s.riskFactors.map((rf, j) => (
                                        <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(239,68,68,0.08)', color: '#F87171', border: '1px solid rgba(239,68,68,0.18)' }}>
                                            {rf}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══════ Context-Aware Confidence Meters ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <Eye size={16} style={{ color: '#7C3AED' }} />
                    <div>
                        <h3 className="text-sm font-semibold text-white">🧠 Context-Aware Confidence Meter</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Confidence breakdown: how context, complexity, and history affect each suggestion's trust
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {confidenceMeters.map((cm) => {
                        const confColor = cm.finalConfidence >= 70 ? '#10B981' : cm.finalConfidence >= 45 ? '#F59E0B' : '#EF4444'
                        return (
                            <div key={cm.id} className="p-4 rounded-xl" style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}>
                                <p className="text-xs font-mono mb-3 truncate" style={{ color: '#94A3B8' }}>{cm.suggestion}</p>
                                {/* Score breakdown */}
                                <div className="space-y-2 mb-3">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: '#94A3B8' }}>Context Score</span>
                                            <span className="font-bold" style={{ color: '#00D4FF' }}>+{cm.contextScore}</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${cm.contextScore}%`, background: '#00D4FF' }} /></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: '#94A3B8' }}>Complexity Penalty</span>
                                            <span className="font-bold" style={{ color: '#EF4444' }}>-{cm.complexityPenalty}</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${cm.complexityPenalty}%`, background: '#EF4444' }} /></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span style={{ color: '#94A3B8' }}>History Bonus</span>
                                            <span className="font-bold" style={{ color: '#10B981' }}>+{cm.historyBonus}</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-fill" style={{ width: `${cm.historyBonus}%`, background: '#10B981' }} /></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #1E2D4A' }}>
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>Final Confidence</span>
                                    <span className="text-lg font-black" style={{ color: confColor }}>{cm.finalConfidence}%</span>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {cm.factors.map((f, k) => (
                                        <span key={k} className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(124,58,237,0.08)', color: '#A78BFA', fontSize: 10 }}>{f}</span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ══════ Historical Accuracy by Task Type ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">📊 Historical Accuracy by Task Type</h3>
                    <div className="space-y-3">
                        {taskTypes.map((t) => {
                            const tColor = t.accuracy >= 75 ? '#10B981' : t.accuracy >= 50 ? '#F59E0B' : '#EF4444'
                            return (
                                <div key={t.type}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span style={{ color: '#94A3B8' }}>{t.type}</span>
                                        <div className="flex items-center gap-3">
                                            <span style={{ color: '#64748B', fontSize: 10 }}>{t.accepted}/{t.total} accepted · {t.reverted} reverted</span>
                                            <span className="font-bold" style={{ color: tColor }}>{t.accuracy}%</span>
                                        </div>
                                    </div>
                                    <div className="progress-bar">
                                        <div className="progress-fill" style={{ width: `${t.accuracy}%`, background: `linear-gradient(90deg, ${tColor}88, ${tColor})` }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            🎯 AI is <span className="text-emerald-400 font-semibold">91% accurate</span> for bug fixes but only <span className="text-red-400 font-semibold">31% accurate</span> for architecture decisions. Use this to calibrate your trust per task type.
                        </p>
                    </div>
                </div>

                {/* ══════ Trust Calibration Dashboard ══════ */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">🎯 Trust Calibration Dashboard</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        When you trusted AI, were you right? Weekly calibration report.
                    </p>
                    <ResponsiveContainer width="100%" height={160}>
                        <BarChart data={calibrationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="trusted" name="Trusted AI %" fill="#00D4FF" opacity={0.7} radius={[3, 3, 0, 0]} />
                            <Bar dataKey="correct" name="Was Correct %" fill="#10B981" opacity={0.85} radius={[3, 3, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                        {calibrationData.map((cd) => (
                            <div key={cd.week} className="p-1.5 rounded" style={{ background: 'rgba(30,45,74,0.4)' }}>
                                <p className="text-xs font-bold" style={{ color: cd.overtrust > 15 ? '#EF4444' : '#F59E0B' }}>{cd.overtrust}%</p>
                                <p style={{ color: '#94A3B8', fontSize: 9 }}>overtrust</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex items-center gap-2">
                            <AlertCircle size={13} style={{ color: '#F59E0B' }} />
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                You overtrust AI by <span className="text-yellow-400 font-semibold">~{weeklyReport ? Math.round(calibrationData.reduce((s, c) => s + c.overtrust, 0) / calibrationData.length) : 15}%</span> on average. Calibration score: <span className="font-semibold" style={{ color: weeklyReport?.calibrationScore && weeklyReport.calibrationScore >= 80 ? '#10B981' : '#F59E0B' }}>🟡 {weeklyReport?.calibrationLabel || 'Moderate'}</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ══════ "Verify This" Smart Alerts ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FileWarning size={16} style={{ color: '#EF4444' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🔴 "Verify This" Smart Alerts</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Suggestions that statistically need human review — flagged before you accept
                            </p>
                        </div>
                    </div>
                    <span className="badge-red">{verifyAlerts.length} flagged</span>
                </div>
                <div className="space-y-3">
                    {verifyAlerts.map((va) => {
                        const sevColor = va.severity === 'critical' ? '#EF4444' : va.severity === 'high' ? '#F59E0B' : '#00D4FF'
                        return (
                            <div key={va.id} className="p-4 rounded-xl" style={{ background: `rgba(${va.severity === 'critical' ? '239,68,68' : va.severity === 'high' ? '245,158,11' : '0,212,255'},0.04)`, border: `1px solid ${sevColor}22` }}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: `${sevColor}18`, color: sevColor, border: `1px solid ${sevColor}33` }}>
                                                {va.severity === 'critical' ? '🔴' : va.severity === 'high' ? '🟠' : '🔵'} {va.severity.toUpperCase()}
                                            </span>
                                            <span className="text-xs" style={{ color: '#94A3B8' }}>{va.taskType}</span>
                                        </div>
                                        <p className="text-xs font-mono mb-1" style={{ color: '#E2E8F0' }}>{va.code}</p>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>{va.reason}</p>
                                    </div>
                                    <div className="text-right ml-4 shrink-0">
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>False positive rate</p>
                                        <p className="text-sm font-bold" style={{ color: va.falsePositiveRate <= 15 ? '#10B981' : '#F59E0B' }}>{va.falsePositiveRate}%</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2 pt-2" style={{ borderTop: '1px solid #1E2D4A' }}>
                                    <span className="text-xs font-medium" style={{ color: '#10B981' }}>💡 {va.suggestedAction}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ══════ Weekly Trust Report Summary ══════ */}
            {weeklyReport && (
                <div className="glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-sm font-semibold text-white">📋 Weekly Trust Report</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Your AI trust performance this week — acceptance, accuracy, and calibration
                            </p>
                        </div>
                        <div className="flex items-center gap-1">
                            {weeklyReport.trend === 'improving' ? <TrendingUp size={14} style={{ color: '#10B981' }} /> : <TrendingDown size={14} style={{ color: '#EF4444' }} />}
                            <span className="text-xs font-semibold" style={{ color: weeklyReport.trend === 'improving' ? '#10B981' : '#EF4444' }}>
                                {weeklyReport.trend === 'improving' ? 'Improving' : 'Declining'}
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-5 gap-3 mb-5">
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-xl font-black text-white">{weeklyReport.totalSuggestions}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Total Suggestions</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-xl font-black" style={{ color: '#10B981' }}>{weeklyReport.accepted}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Accepted</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-xl font-black" style={{ color: '#F59E0B' }}>{weeklyReport.rejected}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Rejected</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-xl font-black" style={{ color: '#EF4444' }}>{weeklyReport.reverted}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Reverted</p>
                        </div>
                        <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-xl font-black" style={{ color: weeklyReport.netAccuracy >= 75 ? '#10B981' : '#F59E0B' }}>{weeklyReport.netAccuracy}%</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>Net Accuracy</p>
                        </div>
                    </div>

                    {/* Weekly trend mini chart */}
                    <ResponsiveContainer width="100%" height={140}>
                        <AreaChart data={weeklyReport.weeklyTrend}>
                            <defs>
                                <linearGradient id="trustTrendGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Area type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} fill="url(#trustTrendGrad)" name="Accuracy %" dot={{ r: 3, fill: '#10B981' }} />
                            <Line type="monotone" dataKey="acceptance" stroke="#00D4FF" strokeWidth={1.5} strokeDasharray="4 4" name="Acceptance %" dot={false} />
                        </AreaChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                ✅ Best task type: <span className="text-emerald-400 font-semibold">{weeklyReport.bestTaskType}</span>
                            </p>
                        </div>
                        <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                🔴 Worst task type: <span className="text-red-400 font-semibold">{weeklyReport.worstTaskType}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ══════ Personalised Developer Trust Profiles ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users size={16} style={{ color: '#7C3AED' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">👤 Personalised Trust Calibration per Developer</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Per-developer trust profiles — see each developer's AI accuracy by task type
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {devProfiles.map((dp) => {
                            const isActive = dp.name === selectedDev
                            const dpColor = dp.calibration_score >= 75 ? '#10B981' : dp.calibration_score >= 50 ? '#F59E0B' : '#EF4444'
                            return (
                                <button
                                    key={dp.name}
                                    onClick={() => setSelectedDev(dp.name)}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                                    style={{
                                        background: isActive ? 'rgba(0,212,255,0.12)' : 'rgba(30,45,74,0.4)',
                                        border: `1px solid ${isActive ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                        color: isActive ? '#00D4FF' : '#94A3B8',
                                    }}
                                >
                                    {dp.name.split(' ')[0]}
                                    <span className="ml-1.5 font-bold" style={{ color: dpColor }}>{dp.calibration_score}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {activeDev && (
                    <div className="grid grid-cols-3 gap-6">
                        {/* Left: Profile summary */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-16 h-16 rounded-full flex flex-col items-center justify-center"
                                    style={{
                                        background: `conic-gradient(${activeDev.overall_trust_score >= 70 ? '#10B981' : activeDev.overall_trust_score >= 45 ? '#F59E0B' : '#EF4444'} 0% ${activeDev.overall_trust_score}%, #1E2D4A ${activeDev.overall_trust_score}% 100%)`,
                                        padding: 3,
                                    }}
                                >
                                    <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: '#0F1629' }}>
                                        <span className="text-lg font-black" style={{ color: activeDev.overall_trust_score >= 70 ? '#10B981' : activeDev.overall_trust_score >= 45 ? '#F59E0B' : '#EF4444' }}>{activeDev.overall_trust_score}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">{activeDev.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        {activeDev.trend === 'improving' ? <TrendingUp size={11} style={{ color: '#10B981' }} /> : activeDev.trend === 'declining' ? <TrendingDown size={11} style={{ color: '#EF4444' }} /> : <span className="text-xs" style={{ color: '#94A3B8' }}>—</span>}
                                        <span className="text-xs" style={{ color: activeDev.trend === 'improving' ? '#10B981' : activeDev.trend === 'declining' ? '#EF4444' : '#94A3B8' }}>{activeDev.trend}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                    <p className="text-sm font-bold text-white">{activeDev.total_suggestions}</p>
                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>Total</p>
                                </div>
                                <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                    <p className="text-sm font-bold" style={{ color: '#10B981' }}>{activeDev.accepted}</p>
                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>Accepted</p>
                                </div>
                                <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                    <p className="text-sm font-bold" style={{ color: '#EF4444' }}>{activeDev.reverted}</p>
                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>Reverted</p>
                                </div>
                                <div className="p-2 rounded-lg text-center" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                    <p className="text-sm font-bold" style={{ color: activeDev.calibration_score >= 75 ? '#10B981' : '#F59E0B' }}>{activeDev.calibration_label}</p>
                                    <p style={{ color: '#94A3B8', fontSize: 9 }}>Calibration</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span style={{ color: '#94A3B8' }}>Overtrust Rate</span>
                                    <span className="font-bold" style={{ color: activeDev.overtrust_pct > 15 ? '#EF4444' : '#F59E0B' }}>{activeDev.overtrust_pct}%</span>
                                </div>
                                <div className="progress-bar"><div className="progress-fill" style={{ width: `${activeDev.overtrust_pct}%`, background: activeDev.overtrust_pct > 15 ? '#EF4444' : '#F59E0B' }} /></div>
                                <div className="flex items-center justify-between text-xs mt-2 mb-1">
                                    <span style={{ color: '#94A3B8' }}>Undertrust Rate</span>
                                    <span className="font-bold" style={{ color: '#00D4FF' }}>{activeDev.undertrust_pct}%</span>
                                </div>
                                <div className="progress-bar"><div className="progress-fill" style={{ width: `${activeDev.undertrust_pct}%`, background: '#00D4FF' }} /></div>
                            </div>
                        </div>

                        {/* Center: Per-developer task type accuracy */}
                        <div>
                            <p className="text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>📊 {activeDev.name.split(' ')[0]}'s Accuracy by Task Type</p>
                            <div className="space-y-2">
                                {activeDev.task_accuracies.map((ta) => {
                                    const taColor = ta.accuracy >= 75 ? '#10B981' : ta.accuracy >= 50 ? '#F59E0B' : '#EF4444'
                                    return (
                                        <div key={ta.type}>
                                            <div className="flex justify-between text-xs mb-1">
                                                <span style={{ color: '#94A3B8', fontSize: 10 }}>{ta.type}</span>
                                                <span className="font-bold" style={{ color: taColor }}>{ta.accuracy}%</span>
                                            </div>
                                            <div className="progress-bar"><div className="progress-fill" style={{ width: `${ta.accuracy}%`, background: `linear-gradient(90deg, ${taColor}88, ${taColor})` }} /></div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-3">
                                <div className="p-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>✅ Best: <span className="text-emerald-400 font-semibold" style={{ fontSize: 10 }}>{activeDev.best_task_type}</span></p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>🔴 Worst: <span className="text-red-400 font-semibold" style={{ fontSize: 10 }}>{activeDev.worst_task_type}</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Personal calibration chart */}
                        <div>
                            <p className="text-xs font-semibold mb-3" style={{ color: '#94A3B8' }}>🎯 {activeDev.name.split(' ')[0]}'s Weekly Calibration</p>
                            <ResponsiveContainer width="100%" height={150}>
                                <BarChart data={activeDev.calibration_history}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                    <XAxis dataKey="week" tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: '#94A3B8', fontSize: 10 }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 11 }} />
                                    <Bar dataKey="trusted" name="Trusted %" fill="#00D4FF" opacity={0.7} radius={[3, 3, 0, 0]} />
                                    <Bar dataKey="correct" name="Correct %" fill="#10B981" opacity={0.85} radius={[3, 3, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                            <div className="grid grid-cols-5 gap-1 mt-2 text-center">
                                {activeDev.calibration_history.map((ch) => (
                                    <div key={ch.week} className="p-1 rounded" style={{ background: 'rgba(30,45,74,0.4)' }}>
                                        <p className="font-bold" style={{ color: ch.overtrust > 15 ? '#EF4444' : ch.overtrust > 8 ? '#F59E0B' : '#10B981', fontSize: 10 }}>{ch.overtrust}%</p>
                                        <p style={{ color: '#64748B', fontSize: 8 }}>overtrust</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ══════ Live Trust Score Calculator ══════ */}
            <div className="grid grid-cols-2 gap-6">
                <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Calculator size={16} style={{ color: '#00D4FF' }} />
                        <div>
                            <h3 className="text-sm font-semibold text-white">🧮 Live Trust Score Calculator</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Simulate trust scores for any task type, complexity, and developer
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Task Type</label>
                            <select
                                value={calcTaskType}
                                onChange={(e) => setCalcTaskType(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-xs text-white"
                                style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', outline: 'none' }}
                            >
                                {taskTypes.map((t) => <option key={t.type} value={t.type}>{t.type}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Complexity</label>
                                <select
                                    value={calcComplexity}
                                    onChange={(e) => setCalcComplexity(e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg text-xs text-white"
                                    style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', outline: 'none' }}
                                >
                                    {['Low', 'Medium', 'High', 'Very High'].map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Files Affected</label>
                                <input
                                    type="number"
                                    min={1}
                                    max={20}
                                    value={calcFiles}
                                    onChange={(e) => setCalcFiles(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full px-3 py-2 rounded-lg text-xs text-white"
                                    style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', outline: 'none' }}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-1">
                                <label style={{ color: '#94A3B8' }}>Context Match</label>
                                <span className="font-bold" style={{ color: '#00D4FF' }}>{calcContext}%</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={calcContext}
                                onChange={(e) => setCalcContext(parseInt(e.target.value))}
                                className="w-full"
                                style={{ accentColor: '#00D4FF' }}
                            />
                        </div>
                        <div>
                            <label className="text-xs mb-1 block" style={{ color: '#94A3B8' }}>Developer (optional — for personalized score)</label>
                            <select
                                value={selectedDev}
                                onChange={(e) => setSelectedDev(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg text-xs text-white"
                                style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', outline: 'none' }}
                            >
                                <option value="">Team average</option>
                                {devProfiles.map((dp) => <option key={dp.name} value={dp.name}>{dp.name}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={runCalculator}
                            disabled={calcLoading}
                            className="w-full py-2 rounded-lg text-xs font-semibold transition-all"
                            style={{ background: 'rgba(0,212,255,0.15)', color: '#00D4FF', border: '1px solid rgba(0,212,255,0.3)' }}
                        >
                            {calcLoading ? 'Computing…' : '⚡ Calculate Trust Score'}
                        </button>
                    </div>
                </div>

                {/* Calculator Result */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">📊 Score Result</h3>
                    {calcResult ? (
                        <div className="flex flex-col items-center gap-4">
                            <div
                                className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
                                style={{
                                    background: `conic-gradient(${calcResult.level === 'green' ? '#10B981' : calcResult.level === 'amber' ? '#F59E0B' : '#EF4444'} 0% ${calcResult.trust}%, #1E2D4A ${calcResult.trust}% 100%)`,
                                    padding: 4,
                                    boxShadow: `0 0 25px ${calcResult.level === 'green' ? '#10B98133' : calcResult.level === 'amber' ? '#F59E0B33' : '#EF444433'}`,
                                }}
                            >
                                <div className="w-full h-full rounded-full flex flex-col items-center justify-center" style={{ background: '#0F1629' }}>
                                    <span className="text-2xl font-black" style={{ color: calcResult.level === 'green' ? '#10B981' : calcResult.level === 'amber' ? '#F59E0B' : '#EF4444' }}>
                                        {calcResult.trust}%
                                    </span>
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>trust</span>
                                </div>
                            </div>
                            <span className={`badge-${calcResult.level} text-sm`}>
                                {calcResult.level === 'green' ? '✅' : calcResult.level === 'amber' ? '⚠️' : '🔴'} {calcResult.rec}
                            </span>
                            <div className="w-full space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: '#94A3B8' }}>Base Accuracy (task type)</span>
                                    <span className="font-bold" style={{ color: '#00D4FF' }}>{calcResult.breakdown.base_accuracy}%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: '#94A3B8' }}>Complexity Penalty</span>
                                    <span className="font-bold" style={{ color: '#EF4444' }}>-{calcResult.breakdown.complexity_penalty}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: '#94A3B8' }}>Multi-file Penalty</span>
                                    <span className="font-bold" style={{ color: '#EF4444' }}>-{calcResult.breakdown.file_penalty}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span style={{ color: '#94A3B8' }}>Context Bonus</span>
                                    <span className="font-bold" style={{ color: '#10B981' }}>+{calcResult.breakdown.context_bonus}</span>
                                </div>
                            </div>
                            {selectedDev && (
                                <div className="w-full p-2 rounded-lg text-center" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
                                    <p className="text-xs" style={{ color: '#A78BFA' }}>
                                        Personalized for <span className="font-semibold text-white">{selectedDev}</span>'s historical accuracy
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-center">
                            <Calculator size={32} style={{ color: '#1E2D4A' }} />
                            <p className="text-xs mt-3" style={{ color: '#64748B' }}>
                                Configure parameters and click "Calculate Trust Score" to see a personalized result
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ══════ Developer Trust Comparison ══════ */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 size={16} style={{ color: '#F59E0B' }} />
                    <div>
                        <h3 className="text-sm font-semibold text-white">📈 Developer Trust Comparison</h3>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            Compare calibration quality across developers — who trusts AI the right amount?
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {devProfiles.map((dp) => {
                        const scoreColor = dp.calibration_score >= 75 ? '#10B981' : dp.calibration_score >= 50 ? '#F59E0B' : '#EF4444'
                        const trendIcon = dp.trend === 'improving' ? '📈' : dp.trend === 'declining' ? '📉' : '➡️'
                        return (
                            <div
                                key={dp.name}
                                className="p-4 rounded-xl transition-all cursor-pointer"
                                onClick={() => setSelectedDev(dp.name)}
                                style={{
                                    background: dp.name === selectedDev ? 'rgba(0,212,255,0.06)' : 'rgba(30,45,74,0.3)',
                                    border: `1px solid ${dp.name === selectedDev ? 'rgba(0,212,255,0.2)' : '#1E2D4A'}`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold text-white">{dp.name}</p>
                                    <span style={{ fontSize: 12 }}>{trendIcon}</span>
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center"
                                        style={{
                                            background: `conic-gradient(${scoreColor} 0% ${dp.calibration_score}%, #1E2D4A ${dp.calibration_score}% 100%)`,
                                            padding: 2,
                                        }}
                                    >
                                        <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: '#0F1629' }}>
                                            <span className="text-xs font-black" style={{ color: scoreColor }}>{dp.calibration_score}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold" style={{ color: scoreColor }}>{dp.calibration_label}</p>
                                        <p style={{ color: '#64748B', fontSize: 9 }}>calibration</p>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: '#94A3B8' }}>Overtrust</span>
                                        <span className="font-bold" style={{ color: dp.overtrust_pct > 15 ? '#EF4444' : '#F59E0B' }}>{dp.overtrust_pct}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: '#94A3B8' }}>Undertrust</span>
                                        <span className="font-bold" style={{ color: '#00D4FF' }}>{dp.undertrust_pct}%</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span style={{ color: '#94A3B8' }}>Reverted</span>
                                        <span className="font-bold" style={{ color: '#EF4444' }}>{dp.reverted}/{dp.accepted}</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-2" style={{ borderTop: '1px solid #1E2D4A' }}>
                                    <p style={{ color: '#64748B', fontSize: 9 }}>
                                        ✅ {dp.best_task_type}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)' }}>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        💡 <span className="text-purple-400 font-semibold">Priya</span> has the best calibration (88) — she rejects most AI suggestions and only accepts what she verifies.
                        <span className="text-red-400 font-semibold"> Jake</span> overtrusts AI by 28% — 34 of his accepted suggestions were reverted.
                        Personalised trust thresholds help each developer make better accept/reject decisions.
                    </p>
                </div>
            </div>

            {/* Bottom Insight */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))',
                    border: '1px solid rgba(0,212,255,0.15)',
                }}
            >
                <div className="text-2xl">🛡️</div>
                <div>
                    <p className="text-sm font-semibold text-white">Trust Crisis Insight</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        Developers accept <span className="text-cyan-400 font-semibold">21–24%</span> of AI suggestions, but no tool tells them <em>why</em> to trust or distrust each one.
                        Per-suggestion trust scoring with <span className="text-purple-400 font-semibold">context-aware confidence</span> and <span className="text-emerald-400 font-semibold">historical accuracy by task type</span> closes this gap — turning blind acceptance into informed decisions.
                    </p>
                </div>
            </div>
        </div>
    )
}
