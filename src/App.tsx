import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, RequireAuth } from './auth/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Overview from './pages/Overview'
import TruthLens from './pages/TruthLens'
import ProductivityHub from './pages/ProductivityHub'
import OrgCascade from './pages/OrgCascade'
import KnowledgeVault from './pages/KnowledgeVault'
import TrustEngine from './pages/TrustEngine'
import DebtRadar from './pages/DebtRadar'
import DevProfiles from './pages/DevProfiles'
import LeadershipView from './pages/LeadershipView'
import ToolchainRadar from './pages/ToolchainRadar'

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected dashboard */}
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <Layout />
                            </RequireAuth>
                        }
                    >
                        <Route index element={<Navigate to="/overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="truth-lens" element={<TruthLens />} />
                        <Route path="productivity-hub" element={<ProductivityHub />} />
                        <Route path="org-cascade" element={<OrgCascade />} />
                        <Route path="knowledge-vault" element={<KnowledgeVault />} />
                        <Route path="trust-engine" element={<TrustEngine />} />
                        <Route path="debt-radar" element={<DebtRadar />} />
                        <Route path="dev-profiles" element={<DevProfiles />} />
                        <Route path="leadership-view" element={<LeadershipView />} />
                        <Route path="toolchain-radar" element={<ToolchainRadar />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}
