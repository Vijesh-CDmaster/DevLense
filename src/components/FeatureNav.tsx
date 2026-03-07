interface Tab {
    key: string
    label: string
}

interface FeatureNavProps {
    tabs: Tab[]
    activeTab: string
    onChange: (key: string) => void
}

export default function FeatureNav({ tabs, activeTab, onChange }: FeatureNavProps) {
    return (
        <div
            className="flex items-center gap-1 p-1 rounded-xl mb-6"
            style={{
                background: 'rgba(15, 22, 41, 0.7)',
                border: '1px solid #1E2D4A',
            }}
        >
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onChange(tab.key)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
                    style={{
                        background:
                            activeTab === tab.key
                                ? 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))'
                                : 'transparent',
                        border:
                            activeTab === tab.key
                                ? '1px solid rgba(0,212,255,0.3)'
                                : '1px solid transparent',
                        color: activeTab === tab.key ? '#00D4FF' : '#94A3B8',
                    }}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
