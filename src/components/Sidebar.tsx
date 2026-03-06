import { NavLink } from 'react-router-dom'
import {
    LayoutDashboard,
    Eye,
    TrendingUp,
    Building2,
    Brain,
    Zap,
    AlertTriangle,
    Users,
    Megaphone,
    Unplug,
    Settings,
    HelpCircle,
} from 'lucide-react'

const navItems = [
    { to: '/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/truth-lens', icon: Eye, label: 'Truth Lens' },
    { to: '/productivity-hub', icon: TrendingUp, label: 'Productivity Hub' },
    { to: '/org-cascade', icon: Building2, label: 'Org Cascade' },
    { to: '/knowledge-vault', icon: Brain, label: 'Knowledge Vault' },
    { to: '/trust-engine', icon: Zap, label: 'Trust Engine' },
    { to: '/debt-radar', icon: AlertTriangle, label: 'Debt Radar' },
    { to: '/dev-profiles', icon: Users, label: 'Dev Profiles' },
    { to: '/leadership-view', icon: Megaphone, label: 'Leadership View' },
    { to: '/toolchain-radar', icon: Unplug, label: 'Toolchain Radar' },
]

export default function Sidebar() {
    return (
        <aside
            className="flex flex-col w-56 shrink-0 h-full overflow-y-auto py-4"
            style={{
                background: 'rgba(15, 22, 41, 0.95)',
                borderRight: '1px solid #1E2D4A',
            }}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 mb-8">
                <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black"
                    style={{
                        background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                        color: '#fff',
                    }}
                >
                    D
                </div>
                <div>
                    <div className="font-bold text-white text-sm tracking-wide">DevLens</div>
                    <div className="text-xs" style={{ color: '#94A3B8' }}>
                        Intelligence Platform
                    </div>
                </div>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 px-3 flex-1">
                <p className="section-title px-2 mb-3">Dashboards</p>
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={16} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 mt-4 flex flex-col gap-1 border-t pt-4" style={{ borderColor: '#1E2D4A' }}>
                <a href="#" className="nav-item">
                    <Settings size={16} />
                    <span>Settings</span>
                </a>
                <a href="#" className="nav-item">
                    <HelpCircle size={16} />
                    <span>Help</span>
                </a>
            </div>
        </aside>
    )
}
