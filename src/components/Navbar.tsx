import { Bell, Search, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login', { replace: true })
    }

    return (
        <header
            className="flex items-center justify-between px-6 py-3"
            style={{
                background: 'rgba(15, 22, 41, 0.95)',
                borderBottom: '1px solid #1E2D4A',
                height: '60px',
            }}
        >
            {/* Search */}
            <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{
                    background: 'rgba(30, 45, 74, 0.5)',
                    border: '1px solid #1E2D4A',
                    width: '280px',
                }}
            >
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input
                    type="text"
                    placeholder='Ask anything... "Who is AI hurting most?"'
                    className="bg-transparent outline-none text-sm flex-1"
                    style={{ color: '#94A3B8', fontSize: '13px' }}
                />
                <kbd
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                        background: '#1E2D4A',
                        color: '#94A3B8',
                        fontSize: '10px',
                        border: '1px solid #2a3d5e',
                    }}
                >
                    ⌘K
                </kbd>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Alert bell */}
                <div className="relative cursor-pointer">
                    <Bell size={18} style={{ color: '#94A3B8' }} />
                    <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-center flex items-center justify-center"
                        style={{
                            background: '#EF4444',
                            fontSize: '9px',
                            fontWeight: '700',
                            color: '#fff',
                        }}
                    >
                        3
                    </span>
                </div>

                {/* User badge */}
                <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
                    style={{
                        background: 'rgba(30,45,74,0.5)',
                        border: '1px solid #1E2D4A',
                    }}
                >
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ background: 'linear-gradient(135deg, #00D4FF, #7C3AED)', color: '#fff' }}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'D'}
                    </div>
                    <span className="text-sm font-medium text-white">{user?.name || 'Developer'}</span>
                    <span className="text-xs" style={{ color: '#94A3B8' }}>
                        Developer
                    </span>
                    <ChevronDown size={14} style={{ color: '#94A3B8' }} />
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all"
                    style={{
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#EF4444',
                        fontSize: '13px',
                        fontWeight: 600,
                    }}
                >
                    <LogOut size={14} />
                    Logout
                </button>
            </div>
        </header>
    )
}
