import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Code2, ArrowRight } from 'lucide-react'
import { useAuth } from '../auth/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            if (!res.ok) {
                const data = await res.json().catch(() => null)
                throw new Error(data?.detail || 'Invalid email or password')
            }
            const data = await res.json()
            login(data.token, data.user)
            navigate('/overview', { replace: true })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ background: '#0A0E1A' }}
        >
            {/* Ambient glow */}
            <div
                className="fixed inset-0 pointer-events-none"
                style={{
                    background:
                        'radial-gradient(ellipse 600px 400px at 50% 40%, rgba(0,212,255,0.06), transparent)',
                }}
            />

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center"
                        style={{
                            background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                        }}
                    >
                        <Code2 size={22} color="#fff" />
                    </div>
                    <span
                        className="text-2xl font-bold tracking-tight"
                        style={{
                            background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        DevLense
                    </span>
                </div>

                {/* Card */}
                <div
                    className="glass-card p-8"
                    style={{ border: '1px solid rgba(0,212,255,0.15)' }}
                >
                    <h1 className="text-xl font-bold text-white text-center mb-1">
                        Welcome back, Developer
                    </h1>
                    <p className="text-center text-sm mb-6" style={{ color: '#94A3B8' }}>
                        Sign in to your developer dashboard
                    </p>

                    {error && (
                        <div
                            className="mb-4 px-4 py-3 rounded-lg text-sm"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.3)',
                                color: '#EF4444',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: '#94A3B8' }}
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                                style={{
                                    background: 'rgba(30,45,74,0.5)',
                                    border: '1px solid #1E2D4A',
                                    color: '#fff',
                                }}
                                onFocus={(e) =>
                                    (e.currentTarget.style.borderColor = '#00D4FF')
                                }
                                onBlur={(e) =>
                                    (e.currentTarget.style.borderColor = '#1E2D4A')
                                }
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                className="block text-xs font-semibold mb-2"
                                style={{ color: '#94A3B8' }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all pr-11"
                                    style={{
                                        background: 'rgba(30,45,74,0.5)',
                                        border: '1px solid #1E2D4A',
                                        color: '#fff',
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.borderColor = '#00D4FF')
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.borderColor = '#1E2D4A')
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    style={{ color: '#94A3B8' }}
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all"
                            style={{
                                background: 'linear-gradient(135deg, #00D4FF, #7C3AED)',
                                color: '#fff',
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                            {!loading && <ArrowRight size={16} />}
                        </button>
                    </form>

                    <p className="text-center text-sm mt-6" style={{ color: '#94A3B8' }}>
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-semibold hover:underline"
                            style={{ color: '#00D4FF' }}
                        >
                            Create one
                        </Link>
                    </p>
                </div>

                <p className="text-center text-xs mt-6" style={{ color: '#475569' }}>
                    Developer Intelligence Platform
                </p>
            </div>
        </div>
    )
}
