import {
    AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { AlertOctagon, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const cascadeData = [
    { month: 'Jan', individual: 18, org: 2 },
    { month: 'Feb', individual: 20, org: 3 },
    { month: 'Mar', individual: 22, org: 1 },
    { month: 'Apr', individual: 21, org: 0 },
    { month: 'May', individual: 24, org: -2 },
    { month: 'Jun', individual: 21, org: -1 },
]

const alerts = [
    { level: 'red', msg: '3 senior devs experiencing AI slowdown (-19% avg)' },
    { level: 'amber', msg: 'Technical debt spike detected in auth/ module' },
    { level: 'amber', msg: 'Perception gap crossed 20% threshold for Raj K.' },
]

const activity = [
    { user: 'Raj K.', action: 'committed 47 AI-assisted lines', time: '2m ago', impact: 'neg' },
    { user: 'Priya S.', action: 'AI suggestion rejected (low trust score)', time: '5m ago', impact: 'neu' },
    { user: 'Arjun M.', action: 'Knowledge session recorded', time: '12m ago', impact: 'pos' },
    { user: 'Meena R.', action: 'Flow time: 4.1 hrs deep work today', time: '1h ago', impact: 'pos' },
]

const kpis = [
    {
        label: 'HPS Score',
        value: '72',
        sub: 'Holistic Productivity',
        trend: 'down',
        delta: '-3',
        color: '#F59E0B',
        glow: '0 0 20px rgba(245,158,11,0.15)',
    },
    {
        label: 'Trust Score',
        value: '61%',
        sub: 'AI Suggestion Accuracy',
        trend: 'down',
        delta: '-4%',
        color: '#EF4444',
        glow: '0 0 20px rgba(239,68,68,0.12)',
    },
    {
        label: 'Debt Level',
        value: 'MED',
        sub: 'AI-Induced Tech Debt',
        trend: 'up',
        delta: '+12%',
        color: '#F59E0B',
        glow: '0 0 20px rgba(245,158,11,0.12)',
    },
    {
        label: 'Knowledge Risk',
        value: 'HIGH',
        sub: '3 single-owner modules',
        trend: 'up',
        delta: '',
        color: '#EF4444',
        glow: '0 0 20px rgba(239,68,68,0.15)',
    },
    {
        label: 'Org Gap Score',
        value: '-31.8%',
        sub: 'Individual → Org loss',
        trend: 'down',
        delta: '-5%',
        color: '#00D4FF',
        glow: '0 0 20px rgba(0,212,255,0.12)',
    },
]

export default function Overview() {
    return (
        <div className="space-y-6 animate-fade-in">
            {/* AI Insight Banner */}
            <div
                className="flex items-center justify-between px-5 py-4 rounded-xl"
                style={{
                    background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(245,158,11,0.08))',
                    border: '1px solid rgba(239,68,68,0.25)',
                }}
            >
                <div className="flex items-center gap-3">
                    <AlertOctagon size={20} style={{ color: '#EF4444' }} />
                    <div>
                        <p className="text-sm font-semibold text-white">
                            👋 Good morning, Viju — Backend Squad
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                            AI is making <span className="text-red-400 font-semibold">3 of your developers slower</span> today. Individual AI gains are not reaching org-level delivery.
                        </p>
                    </div>
                </div>
                <button className="btn-primary">
                    View Details <ArrowRight size={13} />
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-5 gap-4">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="glass-card p-4 space-y-2"
                        style={{ boxShadow: kpi.glow }}
                    >
                        <p className="section-title mb-0">{kpi.label}</p>
                        <p className="text-2xl font-black" style={{ color: kpi.color }}>
                            {kpi.value}
                        </p>
                        <p className="text-xs" style={{ color: '#94A3B8' }}>
                            {kpi.sub}
                        </p>
                        {kpi.delta && (
                            <div className="flex items-center gap-1">
                                {kpi.trend === 'up' ? (
                                    <TrendingUp size={11} style={{ color: '#EF4444' }} />
                                ) : kpi.trend === 'down' ? (
                                    <TrendingDown size={11} style={{ color: '#EF4444' }} />
                                ) : (
                                    <Minus size={11} style={{ color: '#94A3B8' }} />
                                )}
                                <span className="text-xs" style={{ color: '#EF4444' }}>
                                    {kpi.delta} this week
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Cascade Chart + Bottom panels */}
            <div className="grid grid-cols-3 gap-6">
                {/* Cascade */}
                <div className="col-span-3 glass-card p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-white">Productivity Cascade</h2>
                            <p className="text-xs mt-0.5" style={{ color: '#94A3B8' }}>
                                Individual AI gains vs Org-level delivery outcomes
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs" style={{ color: '#94A3B8' }}>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#00D4FF' }} />
                                Individual AI Gain
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="w-3 h-0.5 rounded inline-block" style={{ background: '#7C3AED' }} />
                                Org Delivery Impact
                            </span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={cascadeData}>
                            <defs>
                                <linearGradient id="cyan" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="violet" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D4A" />
                            <XAxis dataKey="month" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ background: '#0F1629', border: '1px solid #1E2D4A', borderRadius: 8, fontSize: 12 }}
                                labelStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="individual" stroke="#00D4FF" strokeWidth={2} fill="url(#cyan)" name="Individual Gain %" />
                            <Area type="monotone" dataKey="org" stroke="#7C3AED" strokeWidth={2} fill="url(#violet)" name="Org Impact %" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Alerts */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">⚡ Today's Alerts</h3>
                    <div className="space-y-3">
                        {alerts.map((a, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-lg"
                                style={{
                                    background: a.level === 'red'
                                        ? 'rgba(239,68,68,0.08)'
                                        : 'rgba(245,158,11,0.08)',
                                    border: `1px solid ${a.level === 'red' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`,
                                }}
                            >
                                <span className="text-base">{a.level === 'red' ? '🔴' : '🟠'}</span>
                                <p className="text-xs" style={{ color: '#94A3B8' }}>
                                    {a.msg}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🔄 Team Activity Feed</h3>
                    <div className="space-y-3">
                        {activity.map((a, i) => (
                            <div key={i} className="flex items-start gap-3">
                                <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #00D4FF44, #7C3AED44)', color: '#00D4FF' }}
                                >
                                    {a.user[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-white font-medium">{a.user}</p>
                                    <p className="text-xs truncate" style={{ color: '#94A3B8' }}>
                                        {a.action}
                                    </p>
                                </div>
                                <span className="text-xs shrink-0" style={{ color: '#94A3B8' }}>
                                    {a.time}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
