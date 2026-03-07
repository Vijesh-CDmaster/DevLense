import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

export default function Layout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden" style={{ background: '#0A0E1A' }}>
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
                {/* Bottom status bar */}
                <div
                    className="flex items-center justify-between px-6 py-2 text-xs"
                    style={{
                        background: 'rgba(15,22,41,0.9)',
                        borderTop: '1px solid #1E2D4A',
                        color: '#94A3B8',
                    }}
                >
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live sync active</span>
                    </div>
                    <span>Last updated: just now</span>
                </div>
            </div>
        </div>
    )
}
