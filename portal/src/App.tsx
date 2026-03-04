import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import Tools from './pages/Tools'
import MCPServers from './pages/MCPServers'
import Agents from './pages/Agents'
import Policies from './pages/Policies'
import Logs from './pages/Logs'
import Playground from './pages/Playground'
import Catalog from './pages/Catalog'
import Namespaces from './pages/Namespaces'
import Analytics from './pages/Analytics'
import Consumers from './pages/Consumers'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  if (!isAuthenticated) {
    return (
      <LandingPage
        onLogin={() => setIsAuthenticated(true)}
        onSignup={() => setIsAuthenticated(true)}
      />
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout onSignOut={() => setIsAuthenticated(false)} />}>
        <Route index element={<Dashboard />} />
        <Route path="playground" element={<Playground />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="models" element={<Models />} />
        <Route path="tools" element={<Tools />} />
        <Route path="mcp-servers" element={<MCPServers />} />
        <Route path="agents" element={<Agents />} />
        <Route path="namespaces" element={<Namespaces />} />
        <Route path="consumers" element={<Consumers />} />
        <Route path="policies" element={<Policies />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  )
}

export default App
