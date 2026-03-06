import { useState } from 'react'
import { ShieldCheck, AlertCircle } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

const taskTypes = [
    { type: 'Simple bug fixes', accuracy: 91, color: '#10B981' },
    { type: 'Unit test generation', accuracy: 84, color: '#10B981' },
    { type: 'Refactoring', accuracy: 67, color: '#F59E0B' },
    { type: 'New feature code', accuracy: 54, color: '#F59E0B' },
    { type: 'API integration', accuracy: 48, color: '#EF4444' },
    { type: 'Architecture decisions', accuracy: 31, color: '#EF4444' },
]

const calibrationData = [
    { week: 'Wk 1', trusted: 90, correct: 78 },
    { week: 'Wk 2', trusted: 85, correct: 71 },
    { week: 'Wk 3', trusted: 88, correct: 69 },
    { week: 'Wk 4', trusted: 82, correct: 73 },
    { week: 'Wk 5', trusted: 79, correct: 72 },
]

const suggestions = [
    {
        code: 'async function getUserById(id: string) { ... }',
        trust: 87,
        taskType: 'Simple retrieval',
        complexity: 'Low',
        rec: 'Safe to accept',
        level: 'green',
    },
    {
        code: 'const authMiddleware = (req, res, next) => { ... }',
        trust: 52,
        taskType: 'Auth logic',
        complexity: 'High',
        rec: 'Verify carefully',
        level: 'amber',
    },
    {
        code: 'class PaymentGateway implements IPayment { ... }',
        trust: 31,
        taskType: 'Architecture',
        complexity: 'Very High',
        rec: 'Human review required',
        level: 'red',
    },
]

export default function TrustEngine() {
    const [activeIdx, setActiveIdx] = useState(1)
    const s = suggestions[activeIdx]
    const trustColor = s.level === 'green' ? '#10B981' : s.level === 'amber' ? '#F59E0B' : '#EF4444'

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Trust Engine</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Know exactly when to trust AI — per suggestion, per task type, per developer
                </p>
            </div>

            {/* Live Trust Score */}
            <div className="glass-card p-6">
                <div className="grid grid-cols-2 gap-8 items-center">
                    <div>
                        <p className="section-title mb-2">Select AI Suggestion to Analyse</p>
                        <div className="space-y-2 mb-4">
                            {suggestions.map((sg, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIdx(i)}
                                    className="w-full text-left p-3 rounded-lg transition-all"
                                    style={{
                                        background: activeIdx === i ? 'rgba(0,212,255,0.1)' : 'rgba(30,45,74,0.4)',
                                        border: `1px solid ${activeIdx === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                    }}
                                >
                                    <p className="text-xs font-mono" style={{ color: '#94A3B8' }}>
                                        {sg.code}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                        <p className="section-title">Current Suggestion Trust Score</p>
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
                            <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-left">
                                <div style={{ color: '#94A3B8' }}>Task Type: <span className="text-white">{s.taskType}</span></div>
                                <div style={{ color: '#94A3B8' }}>Complexity: <span className="text-white">{s.complexity}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Historical Accuracy by Task Type */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">📊 Historical Accuracy by Task Type</h3>
                    <div className="space-y-3">
                        {taskTypes.map((t) => (
                            <div key={t.type}>
                                <div className="flex justify-between text-xs mb-1.5">
                                    <span style={{ color: '#94A3B8' }}>{t.type}</span>
                                    <span className="font-bold" style={{ color: t.color }}>{t.accuracy}%</span>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${t.accuracy}%`,
                                            background: `linear-gradient(90deg, ${t.color}88, ${t.color})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Calibration Dashboard */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">🎯 Trust Calibration Dashboard</h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        When you trusted AI, were you right?
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
                    <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex items-center gap-2">
                            <AlertCircle size={13} style={{ color: '#F59E0B' }} />
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                You overtrust AI by <span className="text-yellow-400 font-semibold">~15%</span> on average. Your calibration score: 🟡 Moderate
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
