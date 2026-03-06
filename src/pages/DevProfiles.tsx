import { useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

const developers = [
    {
        name: 'Raj Kumar',
        seniority: 'EXPERT',
        level: 4,
        aiImpact: -22,
        mode: 'Architect',
        commits: 847,
        prComplexity: 'High',
        alert: true,
    },
    {
        name: 'Priya S.',
        seniority: 'SENIOR',
        level: 3,
        aiImpact: -8,
        mode: 'Architect',
        commits: 612,
        prComplexity: 'High',
        alert: false,
    },
    {
        name: 'Arjun M.',
        seniority: 'MID',
        level: 2,
        aiImpact: 12,
        mode: 'Standard',
        commits: 344,
        prComplexity: 'Medium',
        alert: false,
    },
    {
        name: 'Meena R.',
        seniority: 'JUNIOR',
        level: 1,
        aiImpact: 34,
        mode: 'Scaffold',
        commits: 87,
        prComplexity: 'Low',
        alert: false,
    },
    {
        name: 'Dev K.',
        seniority: 'EXPERT',
        level: 4,
        aiImpact: -31,
        mode: 'Architect',
        commits: 992,
        prComplexity: 'Very High',
        alert: true,
    },
]

const curveData = [
    { seniority: 'Intern', impact: 42 },
    { seniority: 'Junior', impact: 34 },
    { seniority: 'Mid', impact: 12 },
    { seniority: 'Senior', impact: -8 },
    { seniority: 'Expert', impact: -22 },
]

const timelineData = [
    { month: 'Jan', gain: -5 },
    { month: 'Feb', gain: -9 },
    { month: 'Mar', gain: -14 },
    { month: 'Apr', gain: -18 },
    { month: 'May', gain: -21 },
    { month: 'Jun', gain: -22 },
]

const modeColors: Record<string, string> = {
    Scaffold: '#10B981',
    Standard: '#00D4FF',
    Architect: '#7C3AED',
}

export default function DevProfiles() {
    const [selected, setSelected] = useState(0)
    const dev = developers[selected]
    const impactColor = dev.aiImpact >= 0 ? '#10B981' : '#EF4444'

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Dev Profiles</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Seniority-aware AI adaptation — different developers need different AI modes
                </p>
            </div>

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
                                <p className="text-xs" style={{ color: '#94A3B8' }}>{d.seniority}</p>
                            </div>
                            {d.alert && <span className="text-red-400 text-xs">⚠️</span>}
                        </button>
                    ))}
                </div>

                {/* Developer Detail */}
                <div className="col-span-2 space-y-4">
                    {/* Profile Card */}
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
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>Level {dev.level}</span>
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

                        <div className="grid grid-cols-3 gap-4 mb-5">
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
                        </div>

                        {/* Mode Switcher */}
                        <div>
                            <p className="section-title mb-2">AI Suggestion Mode</p>
                            <div className="flex gap-2">
                                {['Scaffold', 'Standard', 'Architect'].map((mode) => (
                                    <button
                                        key={mode}
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
                                {dev.mode === 'Architect' && '🧠 Architecture Mode: Minimal interruptions, high-level suggestions only — optimised for senior/expert developers.'}
                                {dev.mode === 'Standard' && '⚡ Standard Mode: Balanced AI suggestions for mid-level developers.'}
                                {dev.mode === 'Scaffold' && '🏗️ Scaffold Mode: Full AI guidance and code completion — designed for juniors.'}
                            </p>
                        </div>
                    </div>

                    {/* AI Benefit Curve */}
                    <div className="glass-card p-5">
                        <h3 className="text-sm font-semibold text-white mb-4">📉 AI Benefit Curve by Seniority</h3>
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart data={curveData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                                <XAxis dataKey="seniority" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }} />
                                <Bar
                                    dataKey="impact"
                                    name="AI Impact %"
                                    radius={[4, 4, 0, 0]}
                                    fill="#00D4FF"
                                    label={false}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
