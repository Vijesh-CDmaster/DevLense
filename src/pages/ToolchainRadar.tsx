import { useState } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { ArrowRight, Clock, Shuffle } from 'lucide-react'

/* ─── mock data ─── */

const toolColors: Record<string, string> = {
    Copilot: '#10B981',
    Cursor: '#7C3AED',
    'Claude Code': '#00D4FF',
}

const developers = [
    {
        name: 'Raj Kumar',
        switches: 47,
        timeLost: 2.4,
        primary: 'Cursor',
        topFriction: 'Cursor → Claude Code',
        alert: true,
    },
    {
        name: 'Priya S.',
        switches: 31,
        timeLost: 1.6,
        primary: 'Copilot',
        topFriction: 'Copilot → Cursor',
        alert: false,
    },
    {
        name: 'Arjun M.',
        switches: 22,
        timeLost: 0.9,
        primary: 'Copilot',
        topFriction: 'Copilot → Claude Code',
        alert: false,
    },
    {
        name: 'Meena R.',
        switches: 12,
        timeLost: 0.4,
        primary: 'Claude Code',
        topFriction: 'Claude Code → Copilot',
        alert: false,
    },
    {
        name: 'Dev K.',
        switches: 54,
        timeLost: 3.1,
        primary: 'Cursor',
        topFriction: 'Cursor → Copilot',
        alert: true,
    },
]

const transitionMatrix = [
    { from: 'Copilot', to: 'Cursor', switches: 38, avgMinLost: 4.2 },
    { from: 'Copilot', to: 'Claude Code', switches: 26, avgMinLost: 5.8 },
    { from: 'Cursor', to: 'Copilot', switches: 34, avgMinLost: 3.9 },
    { from: 'Cursor', to: 'Claude Code', switches: 52, avgMinLost: 6.1 },
    { from: 'Claude Code', to: 'Copilot', switches: 19, avgMinLost: 3.4 },
    { from: 'Claude Code', to: 'Cursor', switches: 21, avgMinLost: 4.7 },
]

const hourlyTimeline = [
    { hour: '9 AM', copilot: 12, cursor: 3, claude: 1 },
    { hour: '10 AM', copilot: 8, cursor: 9, claude: 4 },
    { hour: '11 AM', copilot: 4, cursor: 14, claude: 7 },
    { hour: '12 PM', copilot: 2, cursor: 6, claude: 2 },
    { hour: '1 PM', copilot: 6, cursor: 4, claude: 8 },
    { hour: '2 PM', copilot: 3, cursor: 11, claude: 12 },
    { hour: '3 PM', copilot: 7, cursor: 8, claude: 5 },
    { hour: '4 PM', copilot: 10, cursor: 5, claude: 3 },
    { hour: '5 PM', copilot: 5, cursor: 7, claude: 9 },
]

const frictionByTask = [
    { task: 'Debugging', minutesLost: 8.2, switches: 14, worstTransition: 'Cursor → Claude Code' },
    { task: 'Feature Code', minutesLost: 6.5, switches: 11, worstTransition: 'Copilot → Cursor' },
    { task: 'Code Review', minutesLost: 5.1, switches: 9, worstTransition: 'Claude Code → Copilot' },
    { task: 'Refactoring', minutesLost: 4.3, switches: 7, worstTransition: 'Cursor → Copilot' },
    { task: 'Tests', minutesLost: 2.8, switches: 4, worstTransition: 'Copilot → Claude Code' },
]

const toolUsage = [
    { tool: 'GitHub Copilot', pct: 42, accepts: 68, quality: 71, color: '#10B981' },
    { tool: 'Cursor', pct: 35, accepts: 74, quality: 63, color: '#7C3AED' },
    { tool: 'Claude Code', pct: 23, accepts: 81, quality: 79, color: '#00D4FF' },
]

const maxMinLost = Math.max(...transitionMatrix.map((t) => t.avgMinLost))

export default function ToolchainRadar() {
    const [selectedDev, setSelectedDev] = useState(0)
    const dev = developers[selectedDev]

    const totalSwitches = developers.reduce((s, d) => s + d.switches, 0)
    const totalTimeLost = developers.reduce((s, d) => s + d.timeLost, 0)

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Toolchain Radar</h1>
                    <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                        Unified AI-tool friction heatmap — Copilot · Cursor · Claude Code
                    </p>
                </div>
                <button className="btn-primary">
                    <Shuffle size={13} /> Optimise Workflows
                </button>
            </div>

            {/* Hero KPIs */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card p-5 text-center glow-danger">
                    <p className="section-title">Daily Time Lost</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#EF4444' }}>
                        {totalTimeLost.toFixed(1)}h
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                        Team-wide (5 devs)
                    </p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Context Switches</p>
                    <p className="text-4xl font-black mt-2" style={{ color: '#F59E0B' }}>
                        {totalSwitches}
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                        Cross-tool today
                    </p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Costliest Transition</p>
                    <p className="text-lg font-black mt-3" style={{ color: '#7C3AED' }}>
                        Cursor → Claude
                    </p>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                        6.1 min avg recovery
                    </p>
                </div>
                <div className="glass-card p-5 text-center">
                    <p className="section-title">Tools Tracked</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        {Object.entries(toolColors).map(([name, color]) => (
                            <span
                                key={name}
                                className="text-xs font-semibold px-2 py-1 rounded-full"
                                style={{
                                    background: `${color}18`,
                                    border: `1px solid ${color}40`,
                                    color,
                                }}
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs mt-2" style={{ color: '#94A3B8' }}>
                        Unified view
                    </p>
                </div>
            </div>

            {/* ── Friction Heatmap (transition matrix) ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    🔥 AI Tool Transition Friction Heatmap
                </h3>
                <p className="text-xs mb-5" style={{ color: '#94A3B8' }}>
                    Every tool switch costs cognitive recovery time — hotter = more friction
                </p>

                <div className="grid grid-cols-3 gap-3">
                    {transitionMatrix
                        .sort((a, b) => b.avgMinLost - a.avgMinLost)
                        .map((t) => {
                            const intensity = t.avgMinLost / maxMinLost
                            const bg =
                                intensity > 0.8
                                    ? 'rgba(239,68,68,0.18)'
                                    : intensity > 0.6
                                        ? 'rgba(245,158,11,0.14)'
                                        : 'rgba(16,185,129,0.10)'
                            const borderColor =
                                intensity > 0.8
                                    ? 'rgba(239,68,68,0.35)'
                                    : intensity > 0.6
                                        ? 'rgba(245,158,11,0.30)'
                                        : 'rgba(16,185,129,0.25)'
                            const valueColor =
                                intensity > 0.8
                                    ? '#EF4444'
                                    : intensity > 0.6
                                        ? '#F59E0B'
                                        : '#10B981'

                            return (
                                <div
                                    key={`${t.from}-${t.to}`}
                                    className="p-4 rounded-xl transition-all hover:scale-[1.02]"
                                    style={{ background: bg, border: `1px solid ${borderColor}` }}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                                            style={{
                                                background: `${toolColors[t.from]}22`,
                                                color: toolColors[t.from],
                                            }}
                                        >
                                            {t.from}
                                        </span>
                                        <ArrowRight size={12} style={{ color: '#94A3B8' }} />
                                        <span
                                            className="text-xs font-bold px-1.5 py-0.5 rounded"
                                            style={{
                                                background: `${toolColors[t.to]}22`,
                                                color: toolColors[t.to],
                                            }}
                                        >
                                            {t.to}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black" style={{ color: valueColor }}>
                                        {t.avgMinLost}m
                                    </p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        avg recovery · {t.switches} switches today
                                    </p>
                                    {/* heat bar */}
                                    <div className="progress-bar mt-2">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${intensity * 100}%`,
                                                background: `linear-gradient(90deg, ${valueColor}88, ${valueColor})`,
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ── Per-Developer Breakdown ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        👤 Per-Developer Friction
                    </h3>
                    <div className="space-y-2">
                        {developers.map((d, i) => {
                            const pct = Math.min((d.timeLost / 3.5) * 100, 100)
                            const barColor =
                                d.timeLost >= 2.0
                                    ? '#EF4444'
                                    : d.timeLost >= 1.0
                                        ? '#F59E0B'
                                        : '#10B981'
                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDev(i)}
                                    className="w-full text-left p-3 rounded-xl transition-all"
                                    style={{
                                        background:
                                            selectedDev === i
                                                ? 'rgba(0,212,255,0.1)'
                                                : 'rgba(30,45,74,0.3)',
                                        border: `1px solid ${selectedDev === i ? 'rgba(0,212,255,0.3)' : '#1E2D4A'}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0"
                                                style={{
                                                    background:
                                                        'linear-gradient(135deg, #00D4FF44, #7C3AED44)',
                                                    color: '#00D4FF',
                                                }}
                                            >
                                                {d.name[0]}
                                            </div>
                                            <span className="text-sm font-medium text-white">
                                                {d.name}
                                            </span>
                                            {d.alert && (
                                                <span className="text-red-400 text-xs">⚠️</span>
                                            )}
                                        </div>
                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: barColor }}
                                        >
                                            -{d.timeLost}h
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>
                                            {d.switches} switches · Primary:{' '}
                                            <span style={{ color: toolColors[d.primary] }}>
                                                {d.primary}
                                            </span>
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* ── Selected Dev Detail ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        🔍 {dev.name} — Friction Profile
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-5">
                        <div
                            className="p-3 rounded-xl text-center"
                            style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}
                        >
                            <Clock size={16} className="mx-auto mb-1" style={{ color: '#94A3B8' }} />
                            <p
                                className="text-xl font-black"
                                style={{
                                    color: dev.timeLost >= 2 ? '#EF4444' : '#F59E0B',
                                }}
                            >
                                {dev.timeLost}h
                            </p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                Daily time lost
                            </p>
                        </div>
                        <div
                            className="p-3 rounded-xl text-center"
                            style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A' }}
                        >
                            <Shuffle size={16} className="mx-auto mb-1" style={{ color: '#94A3B8' }} />
                            <p className="text-xl font-black text-white">{dev.switches}</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>
                                Tool switches
                            </p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <p className="section-title mb-2">Primary Tool</p>
                        <span
                            className="text-sm font-bold px-3 py-1.5 rounded-lg"
                            style={{
                                background: `${toolColors[dev.primary]}18`,
                                border: `1px solid ${toolColors[dev.primary]}40`,
                                color: toolColors[dev.primary],
                            }}
                        >
                            {dev.primary}
                        </span>
                    </div>

                    <div className="mb-5">
                        <p className="section-title mb-2">Costliest Transition</p>
                        <div
                            className="p-3 rounded-lg"
                            style={{
                                background: 'rgba(239,68,68,0.08)',
                                border: '1px solid rgba(239,68,68,0.2)',
                            }}
                        >
                            <p className="text-sm font-bold text-white">{dev.topFriction}</p>
                            <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                                Accounts for ~40% of this developer's switching overhead
                            </p>
                        </div>
                    </div>

                    {dev.alert && (
                        <div
                            className="p-3 rounded-lg"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.25)',
                            }}
                        >
                            <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
                                🔴 Alert: {dev.name} exceeds the 2h/day tool-fragmentation threshold.
                                Consider consolidating to fewer AI tools.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Hourly Tool-Switch Timeline ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    📊 Hourly AI Tool Usage — Context Switch Density
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Stacked switches per hour — peaks = heavy fragmentation windows
                </p>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={hourlyTimeline}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                        <XAxis
                            dataKey="hour"
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis
                            tick={{ fill: '#94A3B8', fontSize: 11 }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#0F1629',
                                border: '1px solid #1E2D4A',
                                borderRadius: 8,
                                fontSize: 12,
                            }}
                        />
                        <Bar
                            dataKey="copilot"
                            name="Copilot"
                            stackId="a"
                            fill="#10B981"
                            opacity={0.85}
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="cursor"
                            name="Cursor"
                            stackId="a"
                            fill="#7C3AED"
                            opacity={0.85}
                            radius={[0, 0, 0, 0]}
                        />
                        <Bar
                            dataKey="claude"
                            name="Claude Code"
                            stackId="a"
                            fill="#00D4FF"
                            opacity={0.85}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-6 mt-3">
                    {Object.entries(toolColors).map(([name, color]) => (
                        <span key={name} className="flex items-center gap-1.5 text-xs" style={{ color: '#94A3B8' }}>
                            <span
                                className="w-3 h-1 rounded inline-block"
                                style={{ background: color }}
                            />
                            {name}
                        </span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ── Friction by Task Type ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        ⚡ Friction by Task Type
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Which activities trigger the most cross-tool switching?
                    </p>
                    <div className="space-y-3">
                        {frictionByTask.map((f) => {
                            const pct = Math.min((f.minutesLost / 10) * 100, 100)
                            const barColor =
                                f.minutesLost > 6
                                    ? '#EF4444'
                                    : f.minutesLost > 4
                                        ? '#F59E0B'
                                        : '#10B981'
                            return (
                                <div key={f.task}>
                                    <div className="flex justify-between text-xs mb-1.5">
                                        <span style={{ color: '#94A3B8' }}>{f.task}</span>
                                        <span className="font-bold" style={{ color: barColor }}>
                                            {f.minutesLost}m lost · {f.switches} switches
                                        </span>
                                    </div>
                                    <div className="progress-bar">
                                        <div
                                            className="progress-fill"
                                            style={{
                                                width: `${pct}%`,
                                                background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
                                            }}
                                        />
                                    </div>
                                    <p
                                        className="text-xs mt-0.5"
                                        style={{ color: '#94A3B8', fontSize: 10 }}
                                    >
                                        Worst: {f.worstTransition}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Unified Tool Comparison ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        🛠️ Unified Tool Comparison
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Side-by-side metrics across all AI assistants
                    </p>
                    <div className="space-y-4">
                        {toolUsage.map((t) => (
                            <div
                                key={t.tool}
                                className="p-4 rounded-xl"
                                style={{
                                    background: `${t.color}08`,
                                    border: `1px solid ${t.color}25`,
                                }}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: t.color }}
                                    >
                                        {t.tool}
                                    </span>
                                    <span className="text-xs" style={{ color: '#94A3B8' }}>
                                        {t.pct}% of total usage
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                                            Accept Rate
                                        </p>
                                        <p
                                            className="text-lg font-black"
                                            style={{ color: t.color }}
                                        >
                                            {t.accepts}%
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                                            Quality Score
                                        </p>
                                        <p
                                            className="text-lg font-black"
                                            style={{ color: t.color }}
                                        >
                                            {t.quality}/100
                                        </p>
                                    </div>
                                </div>
                                <div className="progress-bar mt-2">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${t.pct}%`,
                                            background: `linear-gradient(90deg, ${t.color}66, ${t.color})`,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bottom insight ── */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(0,212,255,0.06))',
                    border: '1px solid rgba(124,58,237,0.2)',
                }}
            >
                <div className="text-2xl">💡</div>
                <div>
                    <p className="text-sm font-semibold text-white">
                        AI Tool Consolidation Opportunity
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#94A3B8' }}>
                        Reducing from 3 AI tools to 2 (dropping the lowest-quality tool per task type) would save an estimated{' '}
                        <span className="text-cyan-400 font-semibold">4.2 hours/day</span> in team-wide
                        context-switching overhead and improve code quality scores by{' '}
                        <span className="text-emerald-400 font-semibold">~11%</span>.
                    </p>
                </div>
            </div>
        </div>
    )
}
