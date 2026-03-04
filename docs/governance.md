# Governance and Access Model

## Core Governance Principle

The AI Gateway enforces governance primarily through **Namespaces**, which act as the primary policy boundary.

A namespace groups:

- AI assets
- users and service identities
- credentials
- runtime policies
- observability data

Namespaces allow platform admins to define:

- who can access assets
- what assets can be used
- how workloads run
- how requests are routed and secured

---

## Governance Hierarchy

Policies follow a hierarchical model:

```
Organization
   ↓
Domain / Business Unit
   ↓
Namespace (primary governance boundary)
   ↓
Assets (Models, Tools, Agents, Workflows)
```

**Example:**

```
Contoso

Domain: Retail AI
   Namespace: retail-support
   Namespace: retail-analytics

Domain: Finance AI
   Namespace: fraud-detection
```

Each namespace manages its own:

- models
- tools
- agents
- workflows
- credentials
- runtime rules
- usage policies

---

## Namespace Responsibilities

Namespaces aggregate three core governance layers:

1. Asset organization
2. Access governance
3. Runtime policies

### 1. Asset Organization

Namespaces group related AI assets.

Supported assets include:

- Models
- Tools
- Agents
- Skills
- Workflows
- Connectors
- Triggers

**Example namespace:**

```
Namespace: retail-support

Models
   GPT-4o
   Claude 3.5

Tools
   Salesforce CRM
   Order Lookup API

Agents
   Support Agent

Workflows
   Refund Workflow
```

This structure allows developers to discover assets relevant to their workload.

### 2. Access Governance

Admins grant users access to namespaces rather than individual assets.

**Example:**

```
Namespace: retail-support

Members
   jane@company.com → AI Developer
   ops-team → Viewer

Service identities
   retail-support-runtime → Runtime access
```

**Roles:**

| Role | Description |
|------|-------------|
| Namespace Admin | Full control over namespace configuration, members, and policies |
| AI Developer | Can use assets, create workloads, and register new assets within namespace |
| Viewer | Read-only access to namespace assets and observability data |
| Service Identity | Runtime access for applications and agents |

This dramatically simplifies governance compared to resource-level permissions.

### 3. Namespace Runtime Policies

Namespaces define runtime rules that apply to all workloads within the namespace.

These policies control:

- model usage
- tool invocation
- agent execution
- request routing
- authentication
- safety enforcement

---

## Core Policy Categories

Policies fall into six categories.

### 1. Authentication Policies

Control who can access the gateway and invoke assets.

**JWT Validation:** The gateway validates JWT tokens before allowing access.

Example checks: issuer, audience, expiration, required claims.

```yaml
validate_jwt:
   issuer: https://login.microsoftonline.com
   audience: ai-gateway
   required_claims:
      - roles
```

**Microsoft Entra Token Validation:**

```yaml
validate_entra_token:
   tenant: contoso
   required_roles:
      - ai-workload-user
```

**API Identity and Service Authentication:** Applications and agents authenticate using service identities, managed identity, or API keys.

### 2. Managed Identity and Credential Policies

Agents often need credentials to access tools. The gateway manages credentials securely.

```
Tool: Salesforce

Authentication
   Managed Identity
   Credential: retail-salesforce-prod
```

Capabilities:

- managed identity authentication
- credential scoping per namespace
- secure secret storage
- no direct credential exposure to agents

### 3. Rate Limiting and Quotas

**Model Interaction Limits:**

```
Requests per minute: 120
Requests per user per minute: 20
```

**Token Consumption Quotas:**

```
Monthly quota: 2M tokens
Per user quota: 200K tokens
Alert threshold: 80%
```

**Tool Invocation Limits:**

```
Tool: Salesforce
Calls per minute: 50
Calls per user per minute: 10
```

### 4. Content Safety Policies

Enforce safety checks on prompts, model responses, tool payloads, and agent outputs.

```yaml
content_safety:
   detect_pii: true
   redact_sensitive_data: true
   block_harmful_content: true
```

Scenarios: preventing data exfiltration, blocking malicious prompts, enforcing enterprise AI safety rules.

### 5. Routing and Request Transformation Policies

**Request Forwarding:**

```yaml
forward_request:
   target: openai-gpt4
```

**HTTP Header Policies:**

```yaml
set_headers:
   x-ai-namespace: retail-support
   x-workload-id: support-agent
```

**URL and Endpoint Routing:**

```yaml
routing_policy:
   primary:
      model: gpt-4o
      region: eastus
   fallback:
      model: claude-3.5
```

Supports: cross-region failover, multi-provider routing, PTU → PAYGO fallback.

### 6. Agent Execution Policies

Control how agents behave during runtime.

```yaml
execution_policy:
   max_tool_calls_per_run: 20
   max_runtime_seconds: 60
   max_iterations: 8
```

These limits prevent runaway agent loops.

---

## Environment Scoping

Namespaces support multiple environments:

- Sandbox
- Development
- Production

Policies may differ between environments:

- **Sandbox:** Any model allowed, token limits relaxed
- **Production:** Only approved models, strict token quotas

---

## Observability by Namespace

All telemetry is aggregated by namespace.

Example metrics:

```
Namespace: retail-support

Token usage:     1.8M tokens / month
Tool calls:      Salesforce: 22K
Agent runs:      12K executions
```

---

## Admin Access UX

```
Access
   ├ Users
   ├ Service Identities
   ├ Domains
   ├ Namespaces
   │      ├ Members
   │      ├ Assets
   │      ├ Policies
   │      ├ Credentials
   │      ├ Environments
   │      └ Observability
   ├ Resource Permissions
   ├ Access Requests
   └ Audit Logs
```

---

## MVP Governance Capabilities

| Category | Capability |
|----------|-----------|
| Authentication | JWT validation |
| Authentication | Entra token validation |
| Credentials | Managed identity for tools |
| Rate limits | Model request limits |
| Quotas | Token consumption quotas |
| Rate limits | Tool invocation limits |
| Safety | Content safety checks |
| Routing | Model routing + fallback |
| Transformation | HTTP header manipulation |
| Gateway | Request forwarding |
| Agent runtime | Execution limits |
