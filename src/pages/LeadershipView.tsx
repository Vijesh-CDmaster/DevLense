import { useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { CheckCircle, XCircle } from 'lucide-react'

const frictionData = [
    { area: 'Code Reviews', hours: 4.2, color: '#EF4444' },
    { area: 'Meetings', hours: 2.8, color: '#F59E0B' },
    { area: 'CI/CD Waits', hours: 1.9, color: '#F59E0B' },
    { area: 'Context Switching', hours: 1.4, color: '#10B981' },
    { area: 'Doc & Planning', hours: 0.9, color: '#10B981' },
]

const empathyGaps = [
    {
        devSays: 'Code review waits are > 48hrs — blocking us daily',
        leaderThinks: 'Code review process is working fine',
        gap: 'red',
        cost: '4.2 hrs/dev/day',
    },
    {
        devSays: 'Too many meetings — losing 2.8hrs of deep work daily',
        leaderThinks: 'Meetings are necessary for alignment',
        gap: 'red',
        cost: '2.8 hrs/dev/day',
    },
    {
        devSays: 'CI/CD pipeline takes 45min — we deploy less often',
        leaderThinks: 'Unknown — no visibility',
        gap: 'amber',
        cost: '1.9 hrs/dev/day',
    },
    {
        devSays: 'AI tools create context switching — hurts flow',
        leaderThinks: 'AI tools are increasing productivity',
        gap: 'amber',
        cost: '1.4 hrs/dev/day',
    },
]

const actionLoop = [
    { issue: 'Slow code reviews (>48hrs)', action: 'Escalated to eng leads', status: 'pending', date: '3 days ago' },
    { issue: 'Broken CI/CD pipeline for feature branch', action: 'DevOps team patched pipeline', status: 'done', date: '1 week ago' },
    { issue: 'Too many mandatory meetings', action: 'No action taken', status: 'ignored', date: '2 weeks ago' },
]

export default function LeadershipView() {
    const [surveyOpen, setSurveyOpen] = useState(false)
    const empathyScore = 37

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Leadership View</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Translate developer pain into executive insight — built for both sides
                    </p>
                </div>
                <button className="btn-primary" onClick={() => setSurveyOpen(!surveyOpen)}>
                    📣 Pulse Survey
                </button>
            </div>

            {/* Empathy Score Hero */}
            <div
                className="flex items-center gap-6 px-6 py-5 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
            >
                <div className="text-center">
                    <p className="text-5xl font-black" style={{ color: '#EF4444' }}>{empathyScore}</p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>/ 100</p>
                </div>
                <div>
                    <p className="text-lg font-bold text-white">Empathy Score — 🔴 Critical Gap</p>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Leadership understands only <span className="text-red-400 font-semibold">37%</span> of developer pain points. This disconnect is costing an estimated{' '}
                        <span className="text-amber-400 font-semibold">$48,000/month</span> in lost engineering hours.
                    </p>
                </div>
                <div className="progress-bar ml-auto" style={{ width: 120 }}>
                    <div className="progress-fill" style={{ width: `${empathyScore}%`, background: 'linear-gradient(90deg, #EF4444, #F59E0B)' }} />
                </div>
            </div>

            {/* Pulse Survey Modal */}
            {surveyOpen && (
                <div
                    className="glass-card p-5 border"
                    style={{ borderColor: 'rgba(0,212,255,0.2)' }}
                >
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

            {/* Side-by-Side Truth Panel */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">🔍 Reality Gap — What Devs Say vs What Leaders Think</h3>
                <div className="space-y-3">
                    {empathyGaps.map((gap, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-5 gap-3 p-3 rounded-xl"
                            style={{ background: 'rgba(30,45,74,0.3)', border: '1px solid #1E2D4A' }}
                        >
                            <div className="col-span-2">
                                <p className="text-xs font-semibold mb-1" style={{ color: '#EF4444' }}>
                                    🔴 What Devs Say
                                </p>
                                <p className="text-xs" style={{ color: '#e2e8f0' }}>{gap.devSays}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs font-semibold mb-1" style={{ color: '#00D4FF' }}>
                                    💼 What Leaders Think
                                </p>
                                <p className="text-xs" style={{ color: '#e2e8f0' }}>{gap.leaderThinks}</p>
                            </div>
                            <div className="text-right">
                                <span className={`badge-${gap.gap}`}>{gap.gap === 'red' ? '🔴 Gap' : '🟠 Gap'}</span>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{gap.cost}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Friction Heatmap */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">⏱️ Developer Friction Heatmap</h3>
                    <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
                        Daily hours lost per developer per friction area
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={frictionData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis type="number" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis dataKey="area" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Bar dataKey="hours" name="Hours Lost" radius={[0, 4, 4, 0]} fill="#EF4444" opacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Action Loop Closer */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔄 Action Loop Closer</h3>
                    <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
                        Did leadership act on developer feedback?
                    </p>
                    <div className="space-y-3">
                        {actionLoop.map((item, i) => (
                            <div
                                key={i}
                                className="p-3 rounded-xl"
                                style={{
                                    background: item.status === 'done'
                                        ? 'rgba(16,185,129,0.06)'
                                        : item.status === 'pending'
                                            ? 'rgba(245,158,11,0.06)'
                                            : 'rgba(239,68,68,0.06)',
                                    border: `1px solid ${item.status === 'done' ? 'rgba(16,185,129,0.2)' : item.status === 'pending' ? 'rgba(245,158,11,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                }}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs font-medium text-white">{item.issue}</p>
                                        <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{item.action}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {item.status === 'done' ? (
                                            <CheckCircle size={14} style={{ color: '#10B981' }} />
                                        ) : (
                                            <XCircle size={14} style={{ color: item.status === 'pending' ? '#F59E0B' : '#EF4444' }} />
                                        )}
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>{item.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
