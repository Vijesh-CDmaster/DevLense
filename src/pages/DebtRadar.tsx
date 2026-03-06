import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { AlertTriangle } from 'lucide-react'

const modules = [
    { name: 'auth/', risk: 100, level: 'red', label: 'CRITICAL' },
    { name: 'payments/', risk: 68, level: 'amber', label: 'ELEVATED' },
    { name: 'api/routes', risk: 55, level: 'amber', label: 'MODERATE' },
    { name: 'user/', risk: 28, level: 'green', label: 'LOW' },
    { name: 'notifications/', risk: 45, level: 'amber', label: 'MODERATE' },
    { name: 'reporting/', risk: 85, level: 'red', label: 'HIGH' },
]

const sprintDebt = [
    { sprint: 'Sprint 1', debt: 120 },
    { sprint: 'Sprint 2', debt: 340 },
    { sprint: 'Sprint 3', debt: 570 },
    { sprint: 'Sprint 4', debt: 890 },
    { sprint: 'Sprint 5', debt: 1240 },
]

const refactorQueue = [
    { file: 'auth/jwt.js', line: 234, reason: 'Repeated patterns, 82% revert probability', urgency: 'red' },
    { file: 'auth/session.ts', line: 89, reason: 'AI-generated logic not integrated with existing auth flow', urgency: 'red' },
    { file: 'api/routes.js', line: 156, reason: 'Copy-pasted error handling, high churn risk', urgency: 'amber' },
    { file: 'payments/gateway.ts', line: 67, reason: 'AI suggestions for business logic — needs expert review', urgency: 'amber' },
]

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

export default function DebtRadar() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Debt Radar</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Catch AI-induced technical debt before it reaches production
                </p>
            </div>

            {/* Debt Status Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center glow-danger">
                    <p className="section-title">Total Debt Score</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#EF4444' }}>1,240</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Points this sprint</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Files at Risk</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>18</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Needing attention</p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">AI Code Revert Risk</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>38%</p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>Within 14 days</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Heatmap */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔥 Codebase Debt Heatmap</h3>
                    <div className="space-y-3">
                        {modules.map((m) => (
                            <div key={m.name}>
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="font-mono" style={{ color: '#94A3B8' }}>{m.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="font-bold text-xs px-2 py-0.5 rounded"
                                            style={{
                                                background: `${riskColors[m.level]}15`,
                                                color: riskColors[m.level],
                                                border: `1px solid ${riskColors[m.level]}30`,
                                            }}
                                        >
                                            {m.label}
                                        </span>
                                        <span className="font-bold" style={{ color: riskColors[m.level] }}>
                                            {m.risk}%
                                        </span>
                                    </div>
                                </div>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${m.risk}%`,
                                            background: `linear-gradient(90deg, ${riskColors[m.level]}66, ${riskColors[m.level]})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sprint Accumulator */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">📈 Sprint Debt Accumulator</h3>
                    <p className="text-xs mb-4" style={{ color: '#EF4444' }}>
                        ⚠️ Exponential growth detected — AI debt is compounding
                    </p>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={sprintDebt}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="sprint" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                            <Line
                                type="monotone"
                                dataKey="debt"
                                stroke="#EF4444"
                                strokeWidth={2.5}
                                dot={{ r: 5, fill: '#EF4444' }}
                                name="Debt Score"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Refactor Queue */}
            <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} style={{ color: '#F59E0B' }} />
                    <h3 className="text-sm font-semibold text-white">Refactor Queue — AI-Prioritised Fixes</h3>
                </div>
                <div className="space-y-3">
                    {refactorQueue.map((item, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-4 p-4 rounded-xl"
                            style={{
                                background: item.urgency === 'red' ? 'rgba(239,68,68,0.06)' : 'rgba(245,158,11,0.06)',
                                border: `1px solid ${item.urgency === 'red' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                            }}
                        >
                            <span className="text-lg shrink-0">{item.urgency === 'red' ? '🔴' : '🟠'}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-mono font-bold text-white">
                                    {item.file}:{item.line}
                                </p>
                                <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>{item.reason}</p>
                            </div>
                            <button className="btn-primary shrink-0">Fix This</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
