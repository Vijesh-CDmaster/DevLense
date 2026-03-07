import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface User {
    id: string
    name: string
    email: string
}

interface AuthContextValue {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
    return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })

    const login = (newToken: string, newUser: User) => {
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(newUser))
        setToken(newToken)
        setUser(newUser)
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setToken(null)
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    )
}

/** Redirect to /login if not authenticated */
export function RequireAuth({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) navigate('/login', { replace: true })
    }, [isAuthenticated, navigate])

    if (!isAuthenticated) return null
    return <>{children}</>
}
