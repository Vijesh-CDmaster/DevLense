import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'

const hpsData = [
    { dimension: 'Speed', value: 80 },
    { dimension: 'Quality', value: 60 },
    { dimension: 'Wellbeing', value: 55 },
    { dimension: 'Collab', value: 70 },
    { dimension: 'AI Ratio', value: 62 },
]

const reworkData = [
    { sprint: 'Sprint 1', survived: 88, reverted: 12 },
    { sprint: 'Sprint 2', survived: 79, reverted: 21 },
    { sprint: 'Sprint 3', survived: 72, reverted: 28 },
    { sprint: 'Sprint 4', survived: 62, reverted: 38 },
    { sprint: 'Sprint 5', survived: 58, reverted: 42 },
]

const dimensions = [
    { label: 'Speed', value: 80, color: '#00D4FF' },
    { label: 'Quality', value: 60, color: '#7C3AED' },
    { label: 'Wellbeing', value: 55, color: '#10B981' },
    { label: 'Collaboration', value: 70, color: '#F59E0B' },
    { label: 'AI Quality Ratio', value: 62, color: '#EF4444' },
]

const contextSwitches = [
    { label: 'Context Switches', value: 14, icon: '🔀' },
    { label: 'Tool Switches', value: 8, icon: '⚙️' },
    { label: 'Meetings Today', value: 4, icon: '📅' },
    { label: 'Interruptions', value: 11, icon: '🔔' },
]

export default function ProductivityHub() {
    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Productivity Hub</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Holistic Productivity Score — far beyond lines of code
                </p>
            </div>

            {/* HPS Hero */}
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
                                        <span style={{ color: '#94A3B8' }}>{d.label}</span>
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

            <div className="grid grid-cols-2 gap-6">
                {/* FLOW Time */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">⚡ FLOW Time Tracker</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span style={{ color: '#94A3B8' }}>Deep Work Time</span>
                                <span className="text-emerald-400 font-bold">3.2 hrs</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '64%', background: 'linear-gradient(90deg, #10B98188, #10B981)' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span style={{ color: '#94A3B8' }}>Interrupted Time</span>
                                <span className="text-red-400 font-bold">1.8 hrs</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '36%', background: 'linear-gradient(90deg, #EF444488, #EF4444)' }} />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-xs mb-2">
                                <span style={{ color: '#94A3B8' }}>Meeting Time</span>
                                <span className="text-yellow-400 font-bold">2.1 hrs</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: '42%', background: 'linear-gradient(90deg, #F59E0B88, #F59E0B)' }} />
                            </div>
                        </div>
                    </div>
                    <div
                        className="mt-4 p-3 rounded-lg text-xs"
                        style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#94A3B8' }}
                    >
                        💡 Target: 5+ hours of deep work for optimal productivity
                    </div>
                </div>

                {/* Cognitive Load */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🧠 Cognitive Load Index</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {contextSwitches.map((c) => (
                            <div
                                key={c.label}
                                className="p-3 rounded-xl text-center"
                                style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}
                            >
                                <div className="text-2xl mb-1">{c.icon}</div>
                                <div className="text-xl font-black text-white">{c.value}</div>
                                <div className="text-xs" style={{ color: '#94A3B8' }}>{c.label}</div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="mt-4 p-3 rounded-lg text-xs"
                        style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#94A3B8' }}
                    >
                        ⚠️ High cognitive load detected — 14 context switches is above the 10-per-day threshold
                    </div>
                </div>
            </div>

            {/* AI Rework Tracker */}
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
        </div>
    )
}
