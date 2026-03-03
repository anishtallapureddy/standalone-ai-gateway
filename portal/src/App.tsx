import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Models from './pages/Models'
import Tools from './pages/Tools'
import MCPServers from './pages/MCPServers'
import Agents from './pages/Agents'
import Policies from './pages/Policies'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="models" element={<Models />} />
        <Route path="tools" element={<Tools />} />
        <Route path="mcp-servers" element={<MCPServers />} />
        <Route path="agents" element={<Agents />} />
        <Route path="policies" element={<Policies />} />
      </Route>
    </Routes>
  )
}

export default App
