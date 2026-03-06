import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Send } from 'lucide-react'

const divergenceData = [
    { month: 'Jan', belief: 15, reality: 12 },
    { month: 'Feb', belief: 18, reality: 10 },
    { month: 'Mar', belief: 22, reality: 5 },
    { month: 'Apr', belief: 25, reality: -8 },
    { month: 'May', belief: 20, reality: -12 },
    { month: 'Jun', belief: 20, reality: -19 },
]

const devBreakdown = [
    { name: 'Raj Kumar', belief: '+25%', reality: '-12%', gap: 37, level: 'red' },
    { name: 'Priya S.', belief: '+18%', reality: '+5%', gap: 13, level: 'amber' },
    { name: 'Arjun M.', belief: '+30%', reality: '+28%', gap: 2, level: 'green' },
    { name: 'Meena R.', belief: '+22%', reality: '+19%', gap: 3, level: 'green' },
    { name: 'Dev K.', belief: '+35%', reality: '-22%', gap: 57, level: 'red' },
]

function GaugeMeter({ value, label, color, sub }: { value: string; label: string; color: string; sub: string }) {
    return (
        <div className="glass-card p-6 text-center flex flex-col items-center gap-3">
            <p className="section-title">{label}</p>
            <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                    background: `conic-gradient(${color} 0% 60%, #1E2D4A 60% 100%)`,
                    padding: '4px',
                }}
            >
                <div
                    className="w-full h-full rounded-full flex flex-col items-center justify-center"
                    style={{ background: '#0F1629' }}
                >
                    <p className="text-2xl font-black" style={{ color }}>
                        {value}
                    </p>
                </div>
            </div>
            <p className="text-xs" style={{ color: '#94A3B8' }}>{sub}</p>
        </div>
    )
}

export default function TruthLens() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Truth Lens</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        What your team believes vs what the data shows
                    </p>
                </div>
                <button className="btn-primary">
                    <Send size={13} /> Send Reality Report
                </button>
            </div>

            {/* Illusion Score Banner */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(245,158,11,0.06))',
                    border: '1px solid rgba(239,68,68,0.22)',
                }}
            >
                <div className="text-3xl font-black" style={{ color: '#EF4444' }}>🔴 64</div>
                <div>
                    <p className="text-sm font-bold text-white">Org Illusion Score</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        Your team overestimates AI impact by <span className="text-red-400 font-semibold">64 points</span> on average. Manager alert triggered — gap exceeds 20% threshold.
                    </p>
                </div>
            </div>

            {/* Dual Gauges */}
            <div className="grid grid-cols-2 gap-6">
                <GaugeMeter value="+20%" label="Team Belief" color="#10B981" sub="Average self-reported AI productivity gain" />
                <GaugeMeter value="-19%" label="Telemetry Reality" color="#EF4444" sub="Actual measured impact on experienced developers" />
            </div>

            {/* Divergence Timeline */}
            <div className="glass-card p-5">
                <h2 className="text-base font-bold text-white mb-1">Divergence Timeline</h2>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    How team belief has drifted from reality over 6 months
                </p>
                <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={divergenceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }}
                        />
                        <Legend wrapperStyle={{ fontSize: 12, color: '#94A3B8' }} />
                        <Line type="monotone" dataKey="belief" stroke="#10B981" strokeWidth={2} dot={{ r: 4, fill: '#10B981' }} name="Team Belief %" strokeDasharray="0" />
                        <Line type="monotone" dataKey="reality" stroke="#EF4444" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: '#EF4444' }} name="Reality %" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Developer Breakdown */}
            <div className="glass-card p-5">
                <h2 className="text-base font-bold text-white mb-4">Developer Breakdown</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr style={{ borderBottom: '1px solid #1E2D4A' }}>
                                {['Developer', 'What They Believe', 'What Data Shows', 'Gap', 'Status'].map((h) => (
                                    <th key={h} className="text-left pb-3 pr-4 section-title font-semibold" style={{ fontSize: 11 }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {devBreakdown.map((dev, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,74,0.5)' }}>
                                    <td className="py-3 pr-4 font-medium text-white">{dev.name}</td>
                                    <td className="py-3 pr-4 text-emerald-400 font-semibold">{dev.belief}</td>
                                    <td
                                        className="py-3 pr-4 font-semibold"
                                        style={{ color: dev.reality.startsWith('-') ? '#EF4444' : '#10B981' }}
                                    >
                                        {dev.reality}
                                    </td>
                                    <td className="py-3 pr-4">
                                        <span
                                            className={`badge-${dev.level}`}
                                        >
                                            {dev.gap}%
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                                            {dev.level === 'red' ? '🔴 Alert sent' : dev.level === 'amber' ? '🟡 Monitoring' : '🟢 Healthy'}
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
