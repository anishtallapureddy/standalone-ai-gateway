# Standalone AI Gateway

## Overview

A multi-tenant, cloud-agnostic AI Gateway platform that enables organizations to discover, manage, and govern AI assets across distributed ecosystems. The gateway acts as the unified control and runtime layer for models, tools, MCP servers, skills, and agents — regardless of provider or platform.

**Key differentiators:**

- **Cloud-agnostic** — works with Azure OpenAI, OpenAI, Anthropic, Google Vertex AI, AWS Bedrock, and any custom model
- **AI-native** — models, tools, MCP servers, skills, and agents are first-class entities, not just APIs
- **Serverless-first** — start in minutes, scale to dedicated enterprise gateway when needed
- **Unified experience** — one portal for discovery, governance, and operations (no fragmented tooling)
- **Multi-tenant** — built for teams, organizations, and shared AI asset collaboration

## Architecture

```mermaid
graph TB
    subgraph Clients
        DEV[Developers]
        AGENT[AI Agents]
        APP[Applications]
    end

    subgraph "Standalone AI Gateway"
        subgraph "Control Plane"
            CAT[Catalog & Discovery]
            GOV_DT[Design-Time Governance]
            AUTH[Auth & Tenancy]
        end

        subgraph "Data Plane / Runtime"
            GW[Gateway Runtime]
            GOV_RT[Runtime Governance]
            OBS[Observability]
        end
    end

    subgraph "AI Ecosystem"
        AOAI[Azure OpenAI]
        OAI[OpenAI]
        ANT[Anthropic]
        GEM[Google Vertex AI]
        BED[AWS Bedrock]
        MCP[MCP Servers]
        API[REST APIs]
        A2A[A2A Agents]
    end

    DEV --> CAT
    DEV --> GW
    AGENT --> GW
    APP --> GW

    CAT --> AUTH
    GOV_DT --> CAT

    GW --> GOV_RT
    GW --> OBS
    GW --> AOAI
    GW --> OAI
    GW --> ANT
    GW --> GEM
    GW --> BED
    GW --> MCP
    GW --> API
    GW --> A2A
```

## First-Class Asset Types

| Asset | Description | Examples |
|-------|-------------|---------|
| **Models** | AI models from any provider | Azure OpenAI, OpenAI, Anthropic, Gemini, custom |
| **Tools** | APIs and services exposed to agents | REST APIs, SaaS connectors, internal services |
| **MCP Servers** | Model Context Protocol endpoints | Hosted or external MCP servers, API→MCP conversions |
| **Skills** | Higher-level constructs built on tools | Travel planning, finance analysis, HR workflows |
| **Agents** | AI agents consuming models + tools + skills | RAPI agents, A2A agents, custom agents |
| **Products** | Bundled collections for agent consumption | Curated packages of tools + models + skills |

## Core Capabilities

### For Platform Engineers / Admins

- **Register** models, tools, MCP servers, skills, and agents from any provider
- **Convert** OpenAPI APIs to MCP endpoints with zero code
- **Govern** with token quotas, rate limits, content safety, access control, IP filtering
- **Route** across model deployments with automatic failover (even cross-provider)
- **Observe** with logs, traces, metrics (including per-user token tracking)
- **Manage** multi-tenant catalogs with team-based visibility and RBAC

### For Developers / Agent Builders

- **Discover** approved AI assets through governed catalogs
- **Connect** through standardized endpoints with built-in auth and governance
- **Compose** by combining multiple tools and MCP servers behind unified endpoints
- **Test** with A/B traffic splitting across models without code changes

## Project Structure

```
src/
  gateway/          # Core gateway runtime — proxy, routing, mediation
    routing/        # Model routing, fallback, load balancing
    proxy/          # Request proxying and mediation
    policies/       # Runtime policy enforcement
  catalog/          # Discovery engine & asset registry
    models/         # Model registry
    tools/          # Tool registry
    mcp-servers/    # MCP server registry
    skills/         # Skill registry
    agents/         # Agent registry
  governance/       # Design-time & runtime governance
    design-time/    # Registration validation, schema checks
    runtime/        # Rate limiting, content safety, token mgmt
    audit/          # Audit logging
  auth/             # Auth & multi-tenant management
    tenants/        # Tenant provisioning & management
    identity/       # Identity, RBAC, API keys
  common/           # Shared types, utils, config
    types/          # Core entity types
    config/         # Configuration management
    utils/          # Shared utilities
tests/
  unit/
  integration/
docs/               # Product & architecture documentation
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Setup

```bash
git clone https://github.com/anishta_microsoft/standalone-ai-gateway.git
cd standalone-ai-gateway
npm install
npm run build
```

### Development

```bash
npm run dev          # Start development server
npm run lint         # Run linter
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

## Phased Build Plan

### Phase 1 — MVP

- Multi-provider model gateway with unified API
- Tool & MCP server catalog with governance
- Agent registration and runtime protection
- Single unified portal experience
- Serverless-first deployment

### Phase 2 — Fast Follow

- Content safety, semantic caching, A/B testing
- Skills as first-class entities, product bundles
- Approval workflows, delegated access (OBO)
- Enhanced MCP observability, intent-based discovery

### Phase 3 — Ecosystem

- GitHub Copilot CLI integration
- Advanced analytics (tool-agent-prompt correlation)
- Bundled capability discovery

## Documentation

| Document | Description |
|----------|-------------|
| [Product Vision](docs/product-vision.md) | Strategic context, target customers, guiding principles |
| [Architecture](docs/architecture.md) | System architecture, components, data flow |
| [Scenarios](docs/scenarios.md) | Full scenario matrix with priorities |
| [Competitive Analysis](docs/competitive-analysis.md) | Market landscape and differentiation |
| [MVP Scope](docs/mvp-scope.md) | Phase 1 deliverables and success criteria |
| [Entity Model](docs/entity-model.md) | First-class asset types and relationships |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT
