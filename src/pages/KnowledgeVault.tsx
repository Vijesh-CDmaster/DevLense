import { useState, useEffect } from 'react'
import { Search, MessageSquare, AlertTriangle, BookOpen, GitBranch, HelpCircle, Layers, Shield } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import { knowledgeVaultApi, type KVDashboard, type KVNode, type KVInterviewMessage, type KVDecision, type KVRiskScore, type KVExtraction, type KVOnboardingQuery, type KVArchaeologyResult } from '../api/client'

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

const chartTooltipStyle = {
    contentStyle: { background: '#0F1729', border: '1px solid #1E2D4A', borderRadius: 10, fontSize: 12 },
    labelStyle: { color: '#94A3B8' },
}

export default function KnowledgeVault() {
    const [query, setQuery] = useState('')
    const [chatInput, setChatInput] = useState('')

    const [nodes, setNodes] = useState<KVNode[]>([])
    const [interviews, setInterviews] = useState<KVInterviewMessage[]>([])
    const [decisions, setDecisions] = useState<KVDecision[]>([])
    const [riskScore, setRiskScore] = useState<KVRiskScore | null>(null)
    const [extractions, setExtractions] = useState<KVExtraction[]>([])
    const [onboarding, setOnboarding] = useState<KVOnboardingQuery[]>([])
    const [archaeology, setArchaeology] = useState<KVArchaeologyResult[]>([])
    const [selectedNode, setSelectedNode] = useState<string | null>(null)

    useEffect(() => {
        knowledgeVaultApi.dashboard().then((d) => {
            setNodes(d.nodes)
            setInterviews(d.interview_history)
            setDecisions(d.decisions)
            setRiskScore(d.risk_score)
            setExtractions(d.recent_extractions)
            setOnboarding(d.onboarding_queries)
            setArchaeology(d.archaeology_results)
        })
    }, [])

    const riskLabel = riskScore ? (riskScore.overall_score >= 70 ? '🔴 HIGH' : riskScore.overall_score >= 40 ? '🟠 MEDIUM' : '🟢 LOW') : '—'
    const riskBorderColor = riskScore ? (riskScore.overall_score >= 70 ? 'rgba(239,68,68,0.22)' : riskScore.overall_score >= 40 ? 'rgba(245,158,11,0.22)' : 'rgba(16,185,129,0.22)') : 'rgba(239,68,68,0.22)'
    const riskBg = riskScore ? (riskScore.overall_score >= 70 ? 'rgba(239,68,68,0.08)' : riskScore.overall_score >= 40 ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)') : 'rgba(239,68,68,0.08)'
    const riskPrimary = riskScore ? (riskScore.overall_score >= 70 ? '#EF4444' : riskScore.overall_score >= 40 ? '#F59E0B' : '#10B981') : '#EF4444'

    const busFactor = riskScore?.bus_factor_alerts ?? []
    const riskChartData = [
        { name: 'High Risk', value: riskScore?.high_risk_count ?? 0, color: '#EF4444' },
        { name: 'Medium', value: riskScore?.medium_risk_count ?? 0, color: '#F59E0B' },
        { name: 'Safe', value: riskScore?.safe_count ?? 0, color: '#10B981' },
    ]

    const selectedNodeObj = nodes.find((n) => n.id === selectedNode)

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Knowledge Vault</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Preserve the "why" — architectural reasoning that lives in developers' minds
                </p>
            </div>

            {/* ── Knowledge Risk Score (Feature 6) ── */}
            <div
                className="flex items-start gap-5 px-5 py-4 rounded-xl"
                style={{ background: riskBg, border: `1px solid ${riskBorderColor}` }}
            >
                <div className="relative flex-shrink-0" style={{ width: 72, height: 72 }}>
                    <svg viewBox="0 0 72 72" className="w-full h-full -rotate-90">
                        <circle cx="36" cy="36" r="30" fill="none" stroke="#1E2D4A" strokeWidth="6" />
                        <circle cx="36" cy="36" r="30" fill="none" stroke={riskPrimary} strokeWidth="6"
                            strokeDasharray={`${(riskScore?.overall_score ?? 0) / 100 * 188.5} 188.5`}
                            strokeLinecap="round" />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                        {riskScore?.overall_score ?? 0}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle size={16} style={{ color: riskPrimary }} />
                        <p className="text-sm font-bold text-white">Knowledge Risk Score: {riskLabel}</p>
                    </div>
                    <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
                        {riskScore?.high_risk_count ?? 0} critical modules understood by only 1 developer — immediate bus factor risk.
                    </p>
                    <div className="flex gap-3 flex-wrap">
                        {busFactor.map((bf, i) => (
                            <span key={i} className="px-2 py-1 rounded text-xs font-medium"
                                style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}>
                                🚨 {bf}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ width: 160, height: 80 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={riskChartData} barSize={20}>
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {riskChartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                            </Bar>
                            <Tooltip {...chartTooltipStyle} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ── Living Knowledge Graph (Feature 3) ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        <GitBranch size={14} className="inline mr-2" style={{ color: '#00D4FF' }} />
                        Living Knowledge Graph — Bus Factor Radar
                    </h3>
                    <div className="space-y-2" style={{ maxHeight: 340, overflowY: 'auto' }}>
                        {nodes.map((node) => (
                            <div
                                key={node.id}
                                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                                style={{
                                    border: `1px solid ${riskColors[node.risk]}${selectedNode === node.id ? '55' : '22'}`,
                                    background: selectedNode === node.id ? `${riskColors[node.risk]}08` : 'transparent',
                                }}
                            >
                                <div className="w-3 h-3 rounded-full shrink-0"
                                    style={{ background: riskColors[node.risk], boxShadow: `0 0 8px ${riskColors[node.risk]}66` }} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-white">{node.label}</p>
                                    <p className="text-xs truncate" style={{ color: '#94A3B8' }}>
                                        {node.decisions} decisions · {node.code_regions.length} code regions
                                    </p>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-xs font-bold" style={{ color: riskColors[node.risk] }}>
                                        {node.owners} owner{node.owners > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        {node.risk === 'red' ? '🔴 Danger' : node.risk === 'amber' ? '🟠 Watch' : '🟢 Safe'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {selectedNodeObj && (
                        <div className="mt-3 p-3 rounded-lg" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                            <p className="text-xs font-semibold text-white mb-2">{selectedNodeObj.label} — Code Regions</p>
                            <div className="flex flex-wrap gap-2">
                                {selectedNodeObj.code_regions.map((r, i) => (
                                    <span key={i} className="badge-cyan">{r}</span>
                                ))}
                            </div>
                            <p className="text-xs mt-2" style={{ color: '#64748B' }}>Last updated: {selectedNodeObj.last_updated}</p>
                        </div>
                    )}
                </div>

                {/* ── Senior Dev Interview Bot (Feature 1) ── */}
                <div className="glass-card p-5 flex flex-col">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        <MessageSquare size={14} className="inline mr-2" style={{ color: '#7C3AED' }} />
                        Senior Dev Interview Bot
                    </h3>
                    <div className="flex-1 space-y-3 mb-4 overflow-y-auto" style={{ maxHeight: 280 }}>
                        {interviews.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className="px-3 py-2 rounded-xl text-xs max-w-xs"
                                    style={{
                                        background: msg.role === 'bot' ? 'rgba(0,212,255,0.1)' : 'rgba(124,58,237,0.15)',
                                        border: `1px solid ${msg.role === 'bot' ? 'rgba(0,212,255,0.2)' : 'rgba(124,58,237,0.2)'}`,
                                        color: '#e2e8f0', lineHeight: '1.5',
                                    }}>
                                    <span className="text-xs font-semibold block mb-1"
                                        style={{ color: msg.role === 'bot' ? '#00D4FF' : '#7C3AED' }}>
                                        {msg.role === 'bot' ? '🤖 DevBot' : '👤 Raj K.'}
                                    </span>
                                    {msg.msg}
                                    {msg.decision_extracted && (
                                        <span className="block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                                            style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', display: 'inline-block' }}>
                                            ✅ Decision captured
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2" style={{ borderTop: '1px solid #1E2D4A', paddingTop: 12 }}>
                        <input value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Respond to the bot..."
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', borderRadius: 8, padding: '8px 12px', color: '#fff', fontSize: 13 }} />
                        <button className="btn-primary px-3 py-2">Send</button>
                    </div>
                </div>
            </div>

            {/* ── Architectural Reasoning Extractor (Feature 2) ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                    <Layers size={14} className="inline mr-2" style={{ color: '#F59E0B' }} />
                    Architectural Reasoning Extractor — The "Why" Behind Decisions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    {extractions.map((ex) => (
                        <div key={ex.id} className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-semibold text-white">{ex.decision}</p>
                                <span className="badge-cyan">{ex.code_region}</span>
                            </div>
                            <div className="space-y-2">
                                <div>
                                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#F59E0B' }}>💡 Why:</p>
                                    <p className="text-xs" style={{ color: '#CBD5E1', lineHeight: '1.5' }}>{ex.why}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#EF4444' }}>❌ Alternatives Rejected:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {ex.alternatives.map((a, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-xs"
                                                style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)' }}>
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#818CF8' }}>⚖️ Trade-offs:</p>
                                    <p className="text-xs" style={{ color: '#94A3B8', lineHeight: '1.5' }}>{ex.trade_offs}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3 pt-2" style={{ borderTop: '1px solid rgba(245,158,11,0.1)' }}>
                                <span className="text-xs" style={{ color: '#94A3B8' }}>👤 {ex.author}</span>
                                <span className="text-xs" style={{ color: '#64748B' }}>· {ex.date}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* ── Decision Archaeology (Feature 5) ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        <Search size={14} className="inline mr-2" style={{ color: '#00D4FF' }} />
                        Decision Archaeology — Trace Code to Its Origin
                    </h3>
                    <div className="flex gap-3 mb-4">
                        <input value={query} onChange={(e) => setQuery(e.target.value)}
                            placeholder='e.g. "Why is JWT used for auth?"'
                            className="flex-1 outline-none text-sm"
                            style={{ background: 'rgba(30,45,74,0.5)', border: '1px solid #1E2D4A', borderRadius: 8, padding: '10px 14px', color: '#fff', fontSize: 13 }} />
                        <button className="btn-primary">Search</button>
                    </div>
                    <div className="space-y-3">
                        {archaeology.map((r, i) => (
                            <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}>
                                <p className="text-xs font-bold text-white mb-2">🔍 "{r.query}"</p>
                                <p className="text-sm mb-2" style={{ color: '#e2e8f0', lineHeight: '1.6' }}>{r.answer}</p>
                                <div className="flex items-center gap-3 flex-wrap">
                                    <span className="badge-cyan">👤 {r.author}</span>
                                    <span className="badge-cyan">📅 {r.date}</span>
                                    <span className="badge-cyan">📂 {r.code_path}</span>
                                    <span className="px-2 py-0.5 rounded text-xs font-medium"
                                        style={{
                                            background: r.confidence >= 90 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                            color: r.confidence >= 90 ? '#10B981' : '#F59E0B',
                                        }}>
                                        {r.confidence}% confidence
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Onboarding Query Engine (Feature 4) ── */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        <HelpCircle size={14} className="inline mr-2" style={{ color: '#10B981' }} />
                        Onboarding Query Engine — "Why is this built this way?"
                    </h3>
                    <div className="space-y-3">
                        {onboarding.map((q, i) => (
                            <div key={i} className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)' }}>
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-xs font-bold shrink-0" style={{ color: '#10B981' }}>Q:</span>
                                    <p className="text-sm font-medium text-white">{q.question}</p>
                                </div>
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="text-xs font-bold shrink-0" style={{ color: '#818CF8' }}>A:</span>
                                    <p className="text-xs" style={{ color: '#CBD5E1', lineHeight: '1.5' }}>{q.answer}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="px-2 py-0.5 rounded text-xs"
                                        style={{
                                            background: q.confidence >= 90 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                                            color: q.confidence >= 90 ? '#10B981' : '#F59E0B',
                                        }}>
                                        {q.confidence}% match
                                    </span>
                                    <span className="text-xs" style={{ color: '#64748B' }}>Asked by {q.asked_by} · {q.date}</span>
                                </div>
                                {q.source_decisions.length > 0 && (
                                    <div className="flex gap-1 mt-2 flex-wrap">
                                        {q.source_decisions.map((sd, j) => (
                                            <span key={j} className="badge-cyan text-xs">{sd}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Architectural Decisions Timeline ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                    <BookOpen size={14} className="inline mr-2" style={{ color: '#818CF8' }} />
                    Architectural Decisions — Full Decision Log
                </h3>
                <div className="relative" style={{ paddingLeft: 20 }}>
                    <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: 'rgba(129,140,248,0.2)' }} />
                    <div className="space-y-4">
                        {decisions.map((d) => (
                            <div key={d.id} className="relative pl-6">
                                <div className="absolute left-[-6px] top-2 w-3 h-3 rounded-full"
                                    style={{ background: '#818CF8', boxShadow: '0 0 8px rgba(129,140,248,0.5)' }} />
                                <div className="p-3 rounded-xl" style={{ background: 'rgba(129,140,248,0.05)', border: '1px solid rgba(129,140,248,0.12)' }}>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-sm font-semibold text-white">{d.title}</p>
                                        <span className="text-xs" style={{ color: '#64748B' }}>{d.date}</span>
                                    </div>
                                    <p className="text-xs mb-2" style={{ color: '#CBD5E1', lineHeight: '1.5' }}>{d.reasoning}</p>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs" style={{ color: '#94A3B8' }}>👤 {d.author}</span>
                                        <span className="badge-cyan">{d.code_region}</span>
                                        {d.tags.map((t, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-xs"
                                                style={{ background: 'rgba(129,140,248,0.12)', color: '#A5B4FC' }}>
                                                {t}
                                            </span>
                                        ))}
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
