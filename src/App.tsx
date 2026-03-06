import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
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
            <Routes>
                <Route path="/" element={<Layout />}>
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
        </BrowserRouter>
    )
}
