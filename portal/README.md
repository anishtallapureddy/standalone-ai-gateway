# Azure AI Gateway — Portal

The Azure AI Gateway portal is a React single-page application that provides a unified experience for managing AI workloads. It serves as the primary interface for platform administrators and AI developers to discover, govern, and observe AI assets.

## Tech Stack

- **React 18** with TypeScript
- **Fluent UI v9** (Microsoft's design system)
- **Vite** for build tooling
- **React Router** for client-side routing

## Features

### Dashboard
Overview of gateway health, active models, tools, agents, token usage, cost analytics, and recent activity.

### AI Asset Catalog
Browse and manage AI assets organized by type:
- **Models** — Multi-provider AI models (Azure OpenAI, Anthropic, Gemini, Bedrock)
- **Tools** — APIs, databases, MCP servers, SaaS connectors
- **Agents** — AI agents that orchestrate models and tools
- **Skills** — Reusable automation patterns
- **Workflows** — Multi-step orchestrations

### Governance
- **Namespaces** — Primary governance boundaries for grouping assets, policies, and credentials
- **Access** — Role-based access control with users, service identities, and domains
- **Policies** — Runtime policies, asset access rules, and safety guardrails

### Observability
- **Analytics** — Token usage, cost attribution, latency metrics by namespace
- **Logs** — Request/response logs, execution traces, audit trail

### Playground
Three-column developer console for testing AI workloads:
- **Request Builder** — Configure model, agent, tools, parameters, and prompt
- **Execution Tracker** — Step-by-step trace with collapsible request/response details
- **Gateway Inspector** — Routing decisions, performance metrics, applied policies

## Getting Started

### Prerequisites
- Node.js 20+
- npm 9+

### Development

```bash
cd portal
npm install
npm run dev          # Start at http://localhost:5173
```

### Build

```bash
npm run build        # Production build to dist/
npm run preview      # Preview production build
```

## Project Structure

```
portal/
  src/
    components/       # Shared components (Layout, StatCard, etc.)
    pages/            # Page components (Dashboard, Playground, etc.)
    App.tsx           # Root component with routing
    main.tsx          # Entry point
  public/             # Static assets
  index.html          # HTML template
```

## Design

- **Dark theme** using Fluent UI `webDarkTheme`
- Custom color palette: backgrounds (#141414, #1e1e1e, #1b1a19), accent blue (#0078d4), cyan (#00d4ff)
- Glass-morphism cards, subtle gradients, developer console aesthetic
- Responsive layout with collapsible sidebar navigation
