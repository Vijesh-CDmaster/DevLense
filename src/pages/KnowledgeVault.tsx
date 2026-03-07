import { useState, useEffect } from 'react'
import { Search, MessageSquare, AlertTriangle, BookOpen, GitBranch, HelpCircle, Layers, Shield, Clock, Users, FileWarning, Link2, Calendar, TrendingDown, DollarSign, Activity, Skull, UserX, Target, Zap, FileText, CheckCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, LineChart, Line } from 'recharts'
import { knowledgeVaultApi, type KVDashboard, type KVNode, type KVInterviewMessage, type KVDecision, type KVRiskScore, type KVExtraction, type KVOnboardingQuery, type KVArchaeologyResult, type KVDecayItem, type KVInterviewSession, type KVTransferEntry, type KVUndocumentedRegion, type KVOnboardingInsight, type KVDecisionChainLink, type KVExtractionSession, type KVDecisionNodeObj, type KVConstraintAlert, type KVKnowledgeDecayEntry, type KVAssetValuation, type KVMortalityTimeline, type KVDepartureExposure } from '../api/client'

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
    const [decayItems, setDecayItems] = useState<KVDecayItem[]>([])
    const [interviewSessions, setInterviewSessions] = useState<KVInterviewSession[]>([])
    const [transferMatrix, setTransferMatrix] = useState<KVTransferEntry[]>([])
    const [undocumented, setUndocumented] = useState<KVUndocumentedRegion[]>([])
    const [onboardingInsights, setOnboardingInsights] = useState<KVOnboardingInsight[]>([])
    const [decisionChains, setDecisionChains] = useState<KVDecisionChainLink[]>([])
    const [extractionSession, setExtractionSession] = useState<KVExtractionSession | null>(null)
    const [decisionNodes, setDecisionNodes] = useState<KVDecisionNodeObj[]>([])
    const [constraintAlerts, setConstraintAlerts] = useState<KVConstraintAlert[]>([])
    const [knowledgeDecayScores, setKnowledgeDecayScores] = useState<KVKnowledgeDecayEntry[]>([])
    const [assetValuations, setAssetValuations] = useState<KVAssetValuation[]>([])
    const [mortalityTimeline, setMortalityTimeline] = useState<KVMortalityTimeline | null>(null)
    const [departureExposure, setDepartureExposure] = useState<KVDepartureExposure | null>(null)
    useEffect(() => {
        knowledgeVaultApi.dashboard().then((d) => {
            setNodes(d.nodes)
            setInterviews(d.interview_history)
            setDecisions(d.decisions)
            setRiskScore(d.risk_score)
            setExtractions(d.recent_extractions)
            setOnboarding(d.onboarding_queries)
            setArchaeology(d.archaeology_results)
            setDecayItems(d.decay_items)
            setInterviewSessions(d.interview_sessions)
            setTransferMatrix(d.transfer_matrix)
            setUndocumented(d.undocumented_regions)
            setOnboardingInsights(d.onboarding_insights)
            setDecisionChains(d.decision_chains)
            setExtractionSession(d.extraction_session)
            setDecisionNodes(d.decision_nodes)
            setConstraintAlerts(d.constraint_alerts)
            setKnowledgeDecayScores(d.knowledge_decay_scores)
            setAssetValuations(d.asset_valuations)
            setMortalityTimeline(d.mortality_timeline)
            setDepartureExposure(d.departure_exposure)
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

            {/* ── Knowledge Decay Tracker ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <TrendingDown size={14} className="inline mr-2" style={{ color: '#EF4444' }} />
                    Knowledge Decay Tracker — How Stale Is Your Reasoning?
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Knowledge decays as code changes without re-validating architectural decisions
                </p>
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                        { label: 'Critical', count: decayItems.filter(d => d.status === 'critical').length, color: '#EF4444' },
                        { label: 'Aging', count: decayItems.filter(d => d.status === 'aging').length, color: '#F59E0B' },
                        { label: 'Fresh', count: decayItems.filter(d => d.status === 'fresh').length, color: '#10B981' },
                        { label: 'Avg Decay', count: decayItems.length > 0 ? Math.round(decayItems.reduce((s, d) => s + d.decay_score, 0) / decayItems.length) : 0, color: '#00D4FF', suffix: '%' },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center p-3 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                            <p className="text-lg font-black" style={{ color: stat.color }}>{stat.count}{stat.suffix || ''}</p>
                            <p className="text-xs" style={{ color: '#94A3B8' }}>{stat.label}</p>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    {decayItems.sort((a, b) => b.decay_score - a.decay_score).map((item) => {
                        const decayColor = item.status === 'critical' ? '#EF4444' : item.status === 'aging' ? '#F59E0B' : '#10B981'
                        return (
                            <div key={item.module_id} className="flex items-center gap-3 p-3 rounded-xl"
                                style={{ background: `${decayColor}06`, border: `1px solid ${decayColor}18` }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ background: `${decayColor}15` }}>
                                    <span className="text-xs font-black" style={{ color: decayColor }}>{item.decay_score}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs font-semibold text-white">{item.module_label}</p>
                                        <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${decayColor}15`, color: decayColor }}>
                                            {item.status}
                                        </span>
                                    </div>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        Last validated: {item.last_validated} · {item.code_changes_since} code changes since · Owner: {item.owner}
                                    </p>
                                </div>
                                <div className="shrink-0 w-24">
                                    <div className="progress-bar h-1.5">
                                        <div className="progress-fill" style={{ width: `${item.decay_score}%`, background: decayColor }} />
                                    </div>
                                    <p className="text-xs text-right mt-0.5" style={{ color: '#64748B' }}>{item.days_since_validated}d ago</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Interview Session Planner + Knowledge Transfer Matrix ── */}
            <div className="grid grid-cols-2 gap-6">
                {/* Interview Session Planner */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <Calendar size={14} className="inline mr-2" style={{ color: '#7C3AED' }} />
                        Interview Session Planner
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Scheduled knowledge extraction sessions with senior developers
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { label: 'Completed', count: interviewSessions.filter(s => s.status === 'completed').length, color: '#10B981' },
                            { label: 'Scheduled', count: interviewSessions.filter(s => s.status === 'scheduled').length, color: '#00D4FF' },
                            { label: 'Overdue', count: interviewSessions.filter(s => s.status === 'overdue').length, color: '#EF4444' },
                        ].map((s) => (
                            <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-sm font-black" style={{ color: s.color }}>{s.count}</p>
                                <p style={{ color: '#94A3B8', fontSize: 10 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2" style={{ maxHeight: 320, overflowY: 'auto' }}>
                        {interviewSessions.map((sess) => {
                            const sColor = sess.status === 'completed' ? '#10B981' : sess.status === 'overdue' ? '#EF4444' : '#00D4FF'
                            return (
                                <div key={sess.id} className="p-3 rounded-xl" style={{ background: `${sColor}06`, border: `1px solid ${sColor}18` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs font-semibold text-white">{sess.module}</p>
                                            <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${sColor}15`, color: sColor }}>
                                                {sess.status === 'completed' ? '✅ Done' : sess.status === 'overdue' ? '⚠️ Overdue' : '📅 Scheduled'}
                                            </span>
                                        </div>
                                        <span className="text-xs" style={{ color: '#64748B' }}>{sess.scheduled_date}</span>
                                    </div>
                                    <p className="text-xs mb-2" style={{ color: '#94A3B8' }}>👤 {sess.senior_dev}</p>
                                    <div className="flex flex-wrap gap-1 mb-2">
                                        {sess.topics.map((t, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded text-xs"
                                                style={{ background: 'rgba(124,58,237,0.1)', color: '#A78BFA' }}>{t}</span>
                                        ))}
                                    </div>
                                    {sess.status === 'completed' && (
                                        <div className="flex items-center gap-3 text-xs">
                                            <span style={{ color: '#10B981' }}>{sess.decisions_captured} decisions captured</span>
                                            <span style={{ color: '#94A3B8' }}>Coverage: {sess.coverage_before}% → <span className="font-bold text-white">{sess.coverage_after}%</span></span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Knowledge Transfer Matrix */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <Users size={14} className="inline mr-2" style={{ color: '#00D4FF' }} />
                        Knowledge Transfer Matrix
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Who's learning from whom — and how far along is the transfer?
                    </p>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                            { label: 'Completed', count: transferMatrix.filter(t => t.status === 'completed').length, color: '#10B981' },
                            { label: 'In Progress', count: transferMatrix.filter(t => t.status === 'in-progress').length, color: '#F59E0B' },
                            { label: 'Not Started', count: transferMatrix.filter(t => t.status === 'not-started').length, color: '#EF4444' },
                        ].map((s) => (
                            <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(30,45,74,0.5)' }}>
                                <p className="text-sm font-black" style={{ color: s.color }}>{s.count}</p>
                                <p style={{ color: '#94A3B8', fontSize: 10 }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2" style={{ maxHeight: 320, overflowY: 'auto' }}>
                        {transferMatrix.map((entry, i) => {
                            const tColor = entry.status === 'completed' ? '#10B981' : entry.status === 'in-progress' ? '#F59E0B' : '#EF4444'
                            return (
                                <div key={i} className="p-3 rounded-xl" style={{ background: `${tColor}06`, border: `1px solid ${tColor}18` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-xs font-semibold text-white">{entry.module}</p>
                                        <span className="text-xs font-bold" style={{ color: tColor }}>{entry.progress}%</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2 text-xs" style={{ color: '#94A3B8' }}>
                                        <span style={{ color: '#7C3AED' }}>{entry.from_dev}</span>
                                        <span>→</span>
                                        <span style={{ color: '#00D4FF' }}>{entry.to_dev}</span>
                                        <span className="ml-auto">{entry.sessions_completed}/{entry.sessions_total} sessions</span>
                                    </div>
                                    <div className="progress-bar h-2">
                                        <div className="progress-fill" style={{ width: `${entry.progress}%`, background: `linear-gradient(90deg, ${tColor}88, ${tColor})` }} />
                                    </div>
                                    {entry.last_session !== '—' && (
                                        <p className="text-xs mt-1" style={{ color: '#64748B' }}>Last session: {entry.last_session}</p>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Undocumented Decision Detector + Onboarding Insights ── */}
            <div className="grid grid-cols-2 gap-6">
                {/* Undocumented Decision Detector */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <FileWarning size={14} className="inline mr-2" style={{ color: '#F59E0B' }} />
                        Undocumented Decision Detector
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Complex code regions with no captured architectural reasoning — interview these owners next
                    </p>
                    <div className="space-y-2">
                        {undocumented.map((region, i) => {
                            const pColor = region.priority === 'critical' ? '#EF4444' : region.priority === 'high' ? '#F59E0B' : '#00D4FF'
                            return (
                                <div key={i} className="p-3 rounded-xl" style={{ background: `${pColor}06`, border: `1px solid ${pColor}18` }}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="badge-cyan text-xs">{region.code_path}</span>
                                        <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ background: `${pColor}15`, color: pColor }}>
                                            {region.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs mb-2" style={{ color: '#CBD5E1', lineHeight: '1.5' }}>{region.reason_suspected}</p>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: '#94A3B8' }}>
                                        <span>Complexity: <span className="font-bold" style={{ color: region.complexity_score >= 80 ? '#EF4444' : '#F59E0B' }}>{region.complexity_score}</span>/100</span>
                                        <span>{region.lines} lines</span>
                                        <span>👤 {region.modified_by}</span>
                                        <span>📅 {region.last_modified}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Onboarding Insights — FAQ Leaderboard */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <HelpCircle size={14} className="inline mr-2" style={{ color: '#10B981' }} />
                        Onboarding Insights — Knowledge Gap Detection
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Most-asked questions by new devs — red = no documented answer (knowledge gap!)
                    </p>
                    <div className="space-y-2">
                        {onboardingInsights.sort((a, b) => b.ask_count - a.ask_count).map((insight, i) => {
                            const hasAnswer = insight.has_documented_answer
                            const iColor = hasAnswer ? '#10B981' : '#EF4444'
                            return (
                                <div key={i} className="p-3 rounded-xl" style={{ background: `${iColor}06`, border: `1px solid ${iColor}18` }}>
                                    <div className="flex items-start justify-between gap-2 mb-1">
                                        <p className="text-xs font-medium text-white flex-1">{insight.question}</p>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{ background: `${iColor}15`, color: iColor }}>
                                                {hasAnswer ? '✅ Documented' : '❌ GAP'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs" style={{ color: '#94A3B8' }}>
                                        <span>Asked <span className="font-bold text-white">{insight.ask_count}×</span></span>
                                        <span>Confidence: <span className="font-bold" style={{ color: insight.avg_confidence >= 80 ? '#10B981' : insight.avg_confidence >= 50 ? '#F59E0B' : '#EF4444' }}>{insight.avg_confidence}%</span></span>
                                        <span>Module: {insight.gap_module}</span>
                                        <span className="ml-auto">{insight.last_asked}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ── Decision Chain Graph ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <Link2 size={14} className="inline mr-2" style={{ color: '#818CF8' }} />
                    Decision Chain Graph — How Decisions Connect
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Architectural decisions don't exist in isolation — one choice cascades into others
                </p>
                <div className="space-y-3">
                    {decisionChains.map((chain, i) => {
                        const relColor = chain.relationship === 'led-to' ? '#7C3AED' : chain.relationship === 'depends-on' ? '#00D4FF' : chain.relationship === 'replaced' ? '#F59E0B' : '#EF4444'
                        const relIcon = chain.relationship === 'led-to' ? '→' : chain.relationship === 'depends-on' ? '⇅' : chain.relationship === 'replaced' ? '↻' : '⚡'
                        return (
                            <div key={i} className="p-4 rounded-xl" style={{ background: `${relColor}06`, border: `1px solid ${relColor}18` }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: 'rgba(129,140,248,0.12)', color: '#A5B4FC' }}>
                                        {chain.from_decision}
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: relColor }}>{relIcon}</span>
                                    <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ background: `${relColor}15`, color: relColor }}>
                                        {chain.relationship}
                                    </span>
                                    <span className="text-sm font-bold" style={{ color: relColor }}>{relIcon}</span>
                                    <span className="px-2 py-1 rounded text-xs font-bold" style={{ background: 'rgba(129,140,248,0.12)', color: '#A5B4FC' }}>
                                        {chain.to_decision}
                                    </span>
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00D4FF' }}>
                                        Impact: {chain.impact_radius} module{chain.impact_radius > 1 ? 's' : ''}
                                    </span>
                                </div>
                                <p className="text-xs" style={{ color: '#CBD5E1', lineHeight: '1.5' }}>{chain.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Contextual Knowledge Extraction Session ── */}
            {extractionSession && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <MessageSquare size={14} className="inline mr-2" style={{ color: '#00D4FF' }} />
                        Contextual Knowledge Extraction — Live Session
                    </h3>
                    <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
                        AI-guided interview analyzing {extractionSession.commits_analysed} commits before first question
                    </p>
                    <div className="grid grid-cols-5 gap-3 mb-4">
                        {[
                            { label: 'Target', value: extractionSession.target_dev, color: '#00D4FF' },
                            { label: 'Commits Scanned', value: extractionSession.commits_analysed.toLocaleString(), color: '#7C3AED' },
                            { label: 'Bus Factor Modules', value: extractionSession.bus_factor_modules, color: '#EF4444' },
                            { label: 'Decisions Captured', value: extractionSession.decisions_captured, color: '#10B981' },
                            { label: 'Constraints Captured', value: extractionSession.constraints_captured, color: '#F59E0B' },
                        ].map((s, i) => (
                            <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>{s.label}</div>
                                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="p-3 rounded-xl mb-4" style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)' }}>
                        <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Trigger File — {extractionSession.trigger_ownership_pct}% single-owner</div>
                        <code className="text-xs" style={{ color: '#00D4FF' }}>{extractionSession.trigger_file}</code>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {extractionSession.messages.map((msg, i) => (
                            <div key={i} className={`p-3 rounded-xl ${msg.role === 'ai' ? 'ml-0 mr-12' : 'ml-12 mr-0'}`}
                                style={{
                                    background: msg.role === 'ai' ? 'rgba(0,212,255,0.06)' : 'rgba(124,58,237,0.06)',
                                    border: `1px solid ${msg.role === 'ai' ? 'rgba(0,212,255,0.15)' : 'rgba(124,58,237,0.15)'}`,
                                }}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-semibold" style={{ color: msg.role === 'ai' ? '#00D4FF' : '#A78BFA' }}>
                                        {msg.role === 'ai' ? '🤖 DevLense AI' : `👤 ${extractionSession.target_dev}`}
                                    </span>
                                    {msg.decision_logged && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>📋 Decision Logged</span>}
                                    {msg.constraint_logged && <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>⚠️ Constraint Logged</span>}
                                </div>
                                <p className="text-xs" style={{ color: '#CBD5E1', lineHeight: '1.6' }}>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Living Architectural Decision Nodes ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <Target size={14} className="inline mr-2" style={{ color: '#7C3AED' }} />
                    Living Decision Nodes — Constraint-Aware Architecture
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Structured decisions permanently linked to code regions — with hard/soft constraint enforcement
                </p>
                <div className="space-y-3">
                    {decisionNodes.map((node) => {
                        const cColor = node.constraint_type === 'hard' ? '#EF4444' : node.constraint_type === 'soft' ? '#F59E0B' : '#94A3B8'
                        const statusColor = node.status === 'active' ? '#10B981' : node.status === 'superseded' ? '#94A3B8' : '#F59E0B'
                        return (
                            <div key={node.id} className="p-4 rounded-xl" style={{ background: `${cColor}05`, border: `1px solid ${cColor}15` }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: `${cColor}15`, color: cColor }}>
                                        {node.constraint_type === 'hard' ? '🔒 HARD' : node.constraint_type === 'soft' ? '🔓 SOFT' : '—'} CONSTRAINT
                                    </span>
                                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: `${statusColor}15`, color: statusColor }}>{node.status}</span>
                                    <span className="ml-auto text-xs" style={{ color: '#64748B' }}>{node.captured_date} · {node.source_type}</span>
                                </div>
                                <h4 className="text-sm font-semibold text-white mb-1">{node.decision}</h4>
                                <p className="text-xs mb-2" style={{ color: '#CBD5E1', lineHeight: 1.5 }}>{node.context}</p>
                                {node.constraint_detail && (
                                    <div className="p-2 rounded-lg mb-2" style={{ background: `${cColor}08`, border: `1px solid ${cColor}12` }}>
                                        <span className="text-xs font-medium" style={{ color: cColor }}>⚡ {node.constraint_detail}</span>
                                        {node.constraint_re_eval_trigger && (
                                            <span className="text-xs ml-3" style={{ color: '#94A3B8' }}>Re-evaluate: {node.constraint_re_eval_trigger}</span>
                                        )}
                                    </div>
                                )}
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {node.alternatives_rejected.map((alt, j) => (
                                        <div key={j} className="text-xs px-2 py-1 rounded" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>
                                            <span style={{ color: '#EF4444' }}>✗ {alt.name}</span>
                                            <span className="ml-1" style={{ color: '#94A3B8' }}>— {alt.reason}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    {node.code_regions.map((r, j) => (
                                        <code key={j} className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.08)', color: '#00D4FF' }}>
                                            {r.file} L{r.lines}
                                        </code>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Constraint Alert Panel ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <Zap size={14} className="inline mr-2" style={{ color: '#EF4444' }} />
                    Constraint Alert Panel — PR Guard Rails
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Auto-fires when PRs modify code governed by undocumented constraints
                </p>
                <div className="space-y-2">
                    {constraintAlerts.map((alert) => {
                        const sevColor = alert.severity === 'critical' ? '#EF4444' : '#F59E0B'
                        const resColor = alert.resolution === 'pending' ? '#EF4444' : alert.resolution === 'acknowledged' ? '#10B981' : '#94A3B8'
                        return (
                            <div key={alert.id} className="p-4 rounded-xl" style={{ background: `${sevColor}05`, border: `1px solid ${sevColor}15` }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: `${sevColor}20`, color: sevColor }}>
                                        {alert.severity === 'critical' ? '🚨' : '⚠️'} {alert.severity.toUpperCase()}
                                    </span>
                                    <span className="text-xs font-medium" style={{ color: '#00D4FF' }}>PR #{alert.pr_number}</span>
                                    <span className="text-xs" style={{ color: '#A78BFA' }}>{alert.pr_author}</span>
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ background: `${resColor}15`, color: resColor }}>{alert.resolution}</span>
                                </div>
                                <p className="text-xs mb-1" style={{ color: '#CBD5E1' }}>
                                    Modified <code style={{ color: '#00D4FF' }}>{alert.file_modified}</code> lines {alert.lines_modified}
                                </p>
                                <p className="text-xs" style={{ color: sevColor }}>
                                    ⚡ Constraint: {alert.constraint_violated}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                    {alert.auto_comment_posted && (
                                        <span className="text-xs" style={{ color: '#10B981' }}>✓ Auto-comment posted to PR</span>
                                    )}
                                    <span className="text-xs ml-auto" style={{ color: '#64748B' }}>{alert.date}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Knowledge Decay Score (KDS) Curves ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <TrendingDown size={14} className="inline mr-2" style={{ color: '#F59E0B' }} />
                    Knowledge Decay Score (KDS) — Decay Curves by Code Region
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    100 = fully retained knowledge → 0 = completely unrecoverable. Below 30 = critical threshold.
                </p>
                <div style={{ height: 260 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={knowledgeDecayScores.map(e => ({
                            name: e.code_region.split('/').pop()?.split('.')[0] ?? e.code_region,
                            'At Decision': e.kds_at_decision,
                            '6mo': e.kds_6mo,
                            '12mo': e.kds_12mo,
                            '18mo': e.kds_18mo,
                            'Current': e.kds_current,
                            'Proj 36mo': e.kds_projected_36mo,
                        }))}>
                            <XAxis dataKey="name" tick={{ fill: '#94A3B8', fontSize: 10 }} />
                            <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 10 }} />
                            <Tooltip {...chartTooltipStyle} />
                            <Line type="monotone" dataKey="At Decision" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="Current" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                            <Line type="monotone" dataKey="Proj 36mo" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                    {knowledgeDecayScores.map((entry, i) => {
                        const kdsColor = entry.kds_current >= 70 ? '#10B981' : entry.kds_current >= 30 ? '#F59E0B' : '#EF4444'
                        return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${kdsColor}05`, border: `1px solid ${kdsColor}12` }}>
                                <div className="flex-1">
                                    <code className="text-xs" style={{ color: '#00D4FF' }}>{entry.code_region}</code>
                                    <span className="text-xs ml-2" style={{ color: '#94A3B8' }}>Holder: {entry.primary_holder} ({entry.ownership_pct}%)</span>
                                </div>
                                <div className="text-center" style={{ minWidth: 60 }}>
                                    <div className="text-lg font-bold" style={{ color: kdsColor }}>{entry.kds_current}</div>
                                    <div className="text-xs" style={{ color: '#64748B' }}>KDS</div>
                                </div>
                                <div className="text-center" style={{ minWidth: 80 }}>
                                    <div className="text-xs" style={{ color: entry.months_to_critical <= 3 ? '#EF4444' : '#F59E0B' }}>
                                        {entry.months_to_critical > 0 ? `${entry.months_to_critical}mo to critical` : 'SAFE'}
                                    </div>
                                    <div className="text-xs" style={{ color: '#64748B' }}>{entry.critical_threshold_date}</div>
                                </div>
                                <div className="w-24 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${entry.kds_current}%`, background: kdsColor }} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ── Knowledge Asset Valuation (KAV) ── */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-1">
                    <DollarSign size={14} className="inline mr-2" style={{ color: '#10B981' }} />
                    Knowledge Asset Valuation (KAV) — Financial Impact
                </h3>
                <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                    Architectural knowledge modeled as a depreciating financial asset — reconstruction + incident + SLA cost
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                        <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                {['Module', 'Total KAV', 'KDS', 'Recoverable', 'Irrecoverable', 'Extract Cost', 'ROI'].map(h => (
                                    <th key={h} className="py-2 px-3 text-left font-medium" style={{ color: '#94A3B8' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {assetValuations.map((av, i) => {
                                const kdsColor = av.current_kds >= 70 ? '#10B981' : av.current_kds >= 30 ? '#F59E0B' : '#EF4444'
                                return (
                                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                        <td className="py-2 px-3 font-medium text-white">{av.module_label}</td>
                                        <td className="py-2 px-3 font-bold" style={{ color: '#00D4FF' }}>${av.total_kav.toLocaleString()}</td>
                                        <td className="py-2 px-3">
                                            <span className="px-1.5 py-0.5 rounded font-bold" style={{ background: `${kdsColor}15`, color: kdsColor }}>{av.current_kds}</span>
                                        </td>
                                        <td className="py-2 px-3" style={{ color: '#10B981' }}>${av.recoverable_value.toLocaleString()}</td>
                                        <td className="py-2 px-3" style={{ color: '#EF4444' }}>${av.already_irrecoverable.toLocaleString()}</td>
                                        <td className="py-2 px-3" style={{ color: '#94A3B8' }}>${av.extraction_cost.toLocaleString()}</td>
                                        <td className="py-2 px-3 font-bold" style={{ color: '#7C3AED' }}>{av.extraction_roi}x</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                    {[
                        { label: 'Total Knowledge Assets', value: `$${assetValuations.reduce((s, a) => s + a.total_kav, 0).toLocaleString()}`, color: '#00D4FF' },
                        { label: 'Total Recoverable', value: `$${assetValuations.reduce((s, a) => s + a.recoverable_value, 0).toLocaleString()}`, color: '#10B981' },
                        { label: 'Avg Extraction ROI', value: `${Math.round(assetValuations.reduce((s, a) => s + a.extraction_roi, 0) / (assetValuations.length || 1))}x`, color: '#7C3AED' },
                    ].map((s, i) => (
                        <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                            <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>{s.label}</div>
                            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Knowledge Mortality Timeline ── */}
            {mortalityTimeline && (
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <Skull size={14} className="inline mr-2" style={{ color: '#EF4444' }} />
                        Knowledge Mortality Timeline — {mortalityTimeline.quarter} {mortalityTimeline.org}
                    </h3>
                    <p className="text-xs mb-3" style={{ color: '#94A3B8' }}>
                        Prioritized extraction queue — knowledge that expires this quarter without intervention
                    </p>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                            { label: 'At Imminent Risk', value: `$${mortalityTimeline.total_at_imminent_risk.toLocaleString()}`, color: '#EF4444' },
                            { label: 'Sessions Needed', value: mortalityTimeline.recommended_sessions, color: '#F59E0B' },
                            { label: 'Extraction Cost', value: `$${mortalityTimeline.extraction_cost.toLocaleString()}`, color: '#94A3B8' },
                            { label: 'Preservation ROI', value: `${mortalityTimeline.preservation_roi}x`, color: '#10B981' },
                        ].map((s, i) => (
                            <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>{s.label}</div>
                                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {mortalityTimeline.entries.map((entry, i) => {
                            const prioColor = entry.priority === 'urgent' ? '#EF4444' : entry.priority === 'high' ? '#F59E0B' : '#10B981'
                            return (
                                <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: `${prioColor}05`, border: `1px solid ${prioColor}12` }}>
                                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: `${prioColor}20`, color: prioColor }}>
                                        {entry.priority.toUpperCase()}
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-sm text-white font-medium">{entry.module_label}</span>
                                        <span className="text-xs ml-2" style={{ color: '#94A3B8' }}>{entry.holder}</span>
                                    </div>
                                    <div className="text-center" style={{ minWidth: 50 }}>
                                        <div className="text-sm font-bold" style={{ color: entry.kds < 30 ? '#EF4444' : '#F59E0B' }}>{entry.kds}</div>
                                        <div className="text-xs" style={{ color: '#64748B' }}>KDS</div>
                                    </div>
                                    <div className="text-center" style={{ minWidth: 70 }}>
                                        <div className="text-sm font-bold" style={{ color: '#00D4FF' }}>${entry.kav.toLocaleString()}</div>
                                        <div className="text-xs" style={{ color: '#64748B' }}>KAV</div>
                                    </div>
                                    <div className="text-xs" style={{ color: '#94A3B8' }}>{entry.expiry_date}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* ── Departure Exposure Amplifier ── */}
            {departureExposure && (
                <div className="glass-card p-5" style={{ border: '1px solid rgba(239,68,68,0.25)', background: 'linear-gradient(135deg, rgba(239,68,68,0.04) 0%, rgba(124,58,237,0.04) 100%)' }}>
                    <h3 className="text-sm font-semibold text-white mb-1">
                        <UserX size={14} className="inline mr-2" style={{ color: '#EF4444' }} />
                        Departure Exposure Amplifier — Active Alert
                    </h3>
                    <p className="text-xs mb-4" style={{ color: '#94A3B8' }}>
                        Signal detected → automatic knowledge risk assessment with financial impact
                    </p>
                    <div className="p-4 rounded-xl mb-4" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-sm font-bold" style={{ color: '#EF4444' }}>🚨 {departureExposure.dev}</div>
                                <div className="text-xs mt-1" style={{ color: '#F59E0B' }}>
                                    Signal: {departureExposure.signal} · {departureExposure.signal_date}
                                </div>
                            </div>
                            <div className="ml-auto text-right">
                                <div className="text-2xl font-black" style={{ color: '#EF4444' }}>
                                    {departureExposure.action_window_days}-Day Window
                                </div>
                                <div className="text-xs" style={{ color: '#94A3B8' }}>First critical: {departureExposure.first_critical_expiry}</div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                            { label: 'Combined KAV', value: `$${departureExposure.combined_kav.toLocaleString()}`, color: '#EF4444' },
                            { label: 'Recoverable', value: `$${departureExposure.recoverable_with_extraction.toLocaleString()}`, color: '#10B981' },
                            { label: 'Irrecoverable', value: `$${departureExposure.irrecoverable_immediately.toLocaleString()}`, color: '#94A3B8' },
                            { label: 'Preservation ROI', value: `${departureExposure.preservation_roi}x`, color: '#7C3AED' },
                        ].map((s, i) => (
                            <div key={i} className="p-3 rounded-xl text-center" style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                                <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>{s.label}</div>
                                <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)' }}>
                            <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Modules Affected</div>
                            <div className="text-lg font-bold" style={{ color: '#00D4FF' }}>{departureExposure.modules_affected}</div>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.12)' }}>
                            <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Sessions to Extract</div>
                            <div className="text-lg font-bold" style={{ color: '#F59E0B' }}>{departureExposure.extraction_sessions} sessions · {departureExposure.extraction_hours}h</div>
                        </div>
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}>
                            <div className="text-xs mb-1" style={{ color: '#94A3B8' }}>Already Documented</div>
                            <div className="text-lg font-bold" style={{ color: '#10B981' }}>${departureExposure.already_documented.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Enterprise Knowledge Intelligence ── */}
            <div className="glass-card p-5" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(0,212,255,0.06) 50%, rgba(16,185,129,0.06) 100%)', border: '1px solid rgba(124,58,237,0.2)' }}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,58,237,0.15)' }}>
                        <BookOpen size={18} style={{ color: '#A78BFA' }} />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white">
                            Enterprise Knowledge Intelligence — The Knowledge Mortality Platform
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: '#CBD5E1' }}>
                            Every documentation tool captures <em>what</em> your code does. DevLense extracts <strong>why</strong> it was built that way — directly from the developers who made the decisions — before that reasoning decays below the point of recovery.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        {[
                            { label: 'Decisions Captured', value: decisionNodes.length, color: '#7C3AED' },
                            { label: 'Constraint Alerts', value: constraintAlerts.length, color: '#EF4444' },
                            { label: 'Knowledge Assets', value: `$${assetValuations.reduce((s, a) => s + a.total_kav, 0).toLocaleString()}`, color: '#00D4FF' },
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="text-lg font-bold" style={{ color: s.color }}>{s.value}</div>
                                <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
