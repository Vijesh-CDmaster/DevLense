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
    ChevronsLeft,
    ChevronsRight,
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

interface SidebarProps {
    collapsed: boolean
    onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
    return (
        <aside
            className={`flex flex-col shrink-0 h-full overflow-y-auto py-4 transition-all duration-300 ${collapsed ? 'w-[68px]' : 'w-56'}`}
            style={{
                background: 'rgba(15, 22, 41, 0.95)',
                borderRight: '1px solid #1E2D4A',
            }}
        >
            {/* Logo + Collapse toggle */}
            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 mb-8`}>
                <div className={`flex items-center gap-3 ${collapsed ? '' : 'px-1'}`}>
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base font-black shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                            color: '#fff',
                        }}
                    >
                        D
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="font-bold text-white text-sm tracking-wide">DevLens</div>
                            <div className="text-xs" style={{ color: '#94A3B8' }}>
                                Intelligence Platform
                            </div>
                        </div>
                    )}
                </div>
                {!collapsed && (
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                        style={{ color: '#94A3B8' }}
                        title="Collapse sidebar"
                    >
                        <ChevronsLeft size={16} />
                    </button>
                )}
            </div>

            {/* Expand button when collapsed */}
            {collapsed && (
                <div className="flex justify-center mb-4">
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-md transition-colors hover:bg-white/5"
                        style={{ color: '#94A3B8' }}
                        title="Expand sidebar"
                    >
                        <ChevronsRight size={16} />
                    </button>
                </div>
            )}

            {/* Nav items */}
            <nav className="flex flex-col gap-1 px-3 flex-1">
                {!collapsed && <p className="section-title px-2 mb-3">Dashboards</p>}
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''} ${collapsed ? 'justify-center !px-0' : ''}`}
                        title={collapsed ? label : undefined}
                    >
                        <Icon size={16} />
                        {!collapsed && <span>{label}</span>}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="px-3 mt-4 flex flex-col gap-1 border-t pt-4" style={{ borderColor: '#1E2D4A' }}>
                <a href="#" className={`nav-item ${collapsed ? 'justify-center !px-0' : ''}`} title={collapsed ? 'Settings' : undefined}>
                    <Settings size={16} />
                    {!collapsed && <span>Settings</span>}
                </a>
                <a href="#" className={`nav-item ${collapsed ? 'justify-center !px-0' : ''}`} title={collapsed ? 'Help' : undefined}>
                    <HelpCircle size={16} />
                    {!collapsed && <span>Help</span>}
                </a>
            </div>
        </aside>
    )
}
