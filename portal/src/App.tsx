import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
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
import Governance from './pages/Governance'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="playground" element={<Playground />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="models" element={<Models />} />
        <Route path="tools" element={<Tools />} />
        <Route path="mcp-servers" element={<MCPServers />} />
        <Route path="agents" element={<Agents />} />
        <Route path="namespaces" element={<Namespaces />} />
        <Route path="policies" element={<Policies />} />
        <Route path="governance" element={<Governance />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  )
}

export default App
