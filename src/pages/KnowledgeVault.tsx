import { useState } from 'react'
import { Search, MessageSquare, AlertTriangle } from 'lucide-react'

const knowledgeNodes = [
    { id: 'auth', label: 'Auth Module', risk: 'red', owners: 1, decisions: 4 },
    { id: 'payment', label: 'Payment API', risk: 'amber', owners: 2, decisions: 7 },
    { id: 'user', label: 'User Service', risk: 'green', owners: 4, decisions: 12 },
    { id: 'notification', label: 'Notifications', risk: 'amber', owners: 2, decisions: 5 },
    { id: 'reporting', label: 'Reporting Engine', risk: 'red', owners: 1, decisions: 9 },
    { id: 'ci', label: 'CI/CD Pipeline', risk: 'green', owners: 3, decisions: 6 },
]

const chatHistory = [
    {
        role: 'bot',
        msg: 'Hi Raj! I want to capture your architectural reasoning. Why did you choose Redis over Memcached for session storage?',
    },
    {
        role: 'user',
        msg: 'We needed persistence across server restarts. Memcached loses all data on restart, but Redis supports AOF persistence. Also, our session data is complex — nested objects — and Redis handles that natively.',
    },
    {
        role: 'bot',
        msg: "Great insight! Saving that as an architectural decision. One follow-up: were there any alternatives you considered and rejected?",
    },
]

const archaeologyResults = [
    {
        query: 'Why is JWT used for auth?',
        answer: 'Decision by Raj Kumar — Mar 2023. Reason: Stateless auth needed for horizontal scaling. Cookie-based sessions would require shared session store across 4 servers.',
        author: 'Raj K.',
        date: 'Mar 14, 2023',
    },
]

const riskColors: Record<string, string> = { red: '#EF4444', amber: '#F59E0B', green: '#10B981' }

export default function KnowledgeVault() {
    const [query, setQuery] = useState('')
    const [searched, setSearched] = useState(false)
    const [chatInput, setChatInput] = useState('')

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl font-bold text-white">Knowledge Vault</h1>
                <p className="text-sm mt-1" style={{ color: '#94A3B8' }}>
                    Preserve the "why" — architectural reasoning that lives in developers' minds
                </p>
            </div>

            {/* Knowledge Risk Score */}
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-xl"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)' }}
            >
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
                <div>
                    <p className="text-sm font-bold text-white">Knowledge Risk Score: 🔴 HIGH</p>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                        3 critical modules are understood by only 1 developer — immediate bus factor risk.
                    </p>
                </div>
                <span className="badge-red ml-auto">Bus Factor: 1</span>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Knowledge Graph (Manual SVG-style visual) */}
                <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-white mb-4">🗺️ Knowledge Graph — Bus Factor Radar</h3>
                    <div className="space-y-3">
                        {knowledgeNodes.map((node) => (
                            <div
                                key={node.id}
                                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/5 transition-colors"
                                style={{ border: `1px solid ${riskColors[node.risk]}22` }}
                            >
                                <div
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ background: riskColors[node.risk], boxShadow: `0 0 8px ${riskColors[node.risk]}66` }}
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{node.label}</p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        {node.decisions} decisions logged
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className="text-xs font-bold"
                                        style={{ color: riskColors[node.risk] }}
                                    >
                                        {node.owners} owner{node.owners > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs" style={{ color: '#94A3B8' }}>
                                        {node.risk === 'red' ? '🔴 Danger' : node.risk === 'amber' ? '🟠 Watch' : '🟢 Safe'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* AI Interview Bot */}
                <div className="glass-card p-5 flex flex-col">
                    <h3 className="text-sm font-semibold text-white mb-4">
                        <MessageSquare size={14} className="inline mr-2" />
                        Senior Dev Interview Bot
                    </h3>
                    <div className="flex-1 space-y-3 mb-4 overflow-y-auto" style={{ maxHeight: 260 }}>
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className="px-3 py-2 rounded-xl text-xs max-w-xs"
                                    style={{
                                        background: msg.role === 'bot'
                                            ? 'rgba(0,212,255,0.1)'
                                            : 'rgba(124,58,237,0.15)',
                                        border: `1px solid ${msg.role === 'bot' ? 'rgba(0,212,255,0.2)' : 'rgba(124,58,237,0.2)'}`,
                                        color: '#e2e8f0',
                                        lineHeight: '1.5',
                                    }}
                                >
                                    <span className="text-xs font-semibold block mb-1" style={{ color: msg.role === 'bot' ? '#00D4FF' : '#7C3AED' }}>
                                        {msg.role === 'bot' ? '🤖 DevBot' : '👤 Raj K.'}
                                    </span>
                                    {msg.msg}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div
                        className="flex items-center gap-2"
                        style={{ borderTop: '1px solid #1E2D4A', paddingTop: 12 }}
                    >
                        <input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Respond to the bot..."
                            className="flex-1 bg-transparent outline-none text-sm"
                            style={{
                                background: 'rgba(30,45,74,0.5)',
                                border: '1px solid #1E2D4A',
                                borderRadius: 8,
                                padding: '8px 12px',
                                color: '#fff',
                                fontSize: 13,
                            }}
                        />
                        <button className="btn-primary px-3 py-2">Send</button>
                    </div>
                </div>
            </div>

            {/* Decision Archaeology */}
            <div className="glass-card p-5">
                <h3 className="text-sm font-semibold text-white mb-4">
                    <Search size={14} className="inline mr-2" />
                    Decision Archaeology — Trace any code to its origin
                </h3>
                <div className="flex gap-3 mb-4">
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='e.g. "Why is JWT used for authentication?"'
                        className="flex-1 outline-none text-sm"
                        style={{
                            background: 'rgba(30,45,74,0.5)',
                            border: '1px solid #1E2D4A',
                            borderRadius: 8,
                            padding: '10px 14px',
                            color: '#fff',
                            fontSize: 13,
                        }}
                    />
                    <button className="btn-primary" onClick={() => setSearched(true)}>Search</button>
                </div>
                {(searched || true) && (
                    <div
                        className="p-4 rounded-xl"
                        style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
                    >
                        {archaeologyResults.map((r, i) => (
                            <div key={i}>
                                <p className="text-xs font-bold text-white mb-2">
                                    🔍 "{r.query}"
                                </p>
                                <p className="text-sm" style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
                                    {r.answer}
                                </p>
                                <div className="flex gap-3 mt-2">
                                    <span className="badge-cyan">👤 {r.author}</span>
                                    <span className="badge-cyan">📅 {r.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
