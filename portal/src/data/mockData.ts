// Mock data for AI Gateway Portal

export interface Model {
  id: string;
  name: string;
  provider: string;
  endpoint: string;
  capabilities: string[];
  status: 'active' | 'inactive' | 'degraded';
  tokensUsedToday: number;
  tokenLimit: number;
  requestsToday: number;
  failoverTargets: string[];
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  transport: string;
  endpoint: string;
  ownerTeam: string;
  visibility: 'public' | 'private' | 'team';
  status: 'active' | 'inactive';
  invocationsToday: number;
  tags: string[];
  createdAt: string;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  hostingType: 'managed' | 'external';
  transport: string;
  endpoint: string;
  toolCount: number;
  sourceApi?: string;
  status: 'active' | 'inactive' | 'error';
  requestsToday: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  protocol: string;
  endpoint: string;
  modelIds: string[];
  toolIds: string[];
  status: 'active' | 'inactive' | 'degraded';
  requestsToday: number;
  createdAt: string;
}

export interface Policy {
  id: string;
  name: string;
  description: string;
  target: string;
  phase: 'design-time' | 'runtime';
  ruleCount: number;
  enabled: boolean;
  appliedTo: number;
  createdAt: string;
}

export interface DashboardStats {
  totalModels: number;
  totalTools: number;
  totalMCPServers: number;
  totalAgents: number;
  totalPolicies: number;
  totalRequests24h: number;
  totalTokens24h: number;
  activeAlerts: number;
}

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------
export const models: Model[] = [
  {
    id: 'model-gpt4o',
    name: 'GPT-4o',
    provider: 'Azure OpenAI',
    endpoint: 'https://contoso-aoai.openai.azure.com/openai/deployments/gpt-4o',
    capabilities: ['chat', 'vision', 'function-calling', 'json-mode'],
    status: 'active',
    tokensUsedToday: 8_740_000,
    tokenLimit: 15_000_000,
    requestsToday: 18_432,
    failoverTargets: ['model-gpt4o-mini', 'model-claude35'],
    createdAt: '2026-02-01T09:00:00Z',
  },
  {
    id: 'model-gpt4o-mini',
    name: 'GPT-4o-mini',
    provider: 'Azure OpenAI',
    endpoint: 'https://contoso-aoai.openai.azure.com/openai/deployments/gpt-4o-mini',
    capabilities: ['chat', 'function-calling', 'json-mode'],
    status: 'active',
    tokensUsedToday: 2_150_000,
    tokenLimit: 10_000_000,
    requestsToday: 12_870,
    failoverTargets: ['model-gpt4o'],
    createdAt: '2026-02-01T09:15:00Z',
  },
  {
    id: 'model-claude35',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    endpoint: 'https://api.anthropic.com/v1/messages',
    capabilities: ['chat', 'vision', 'function-calling'],
    status: 'active',
    tokensUsedToday: 1_020_000,
    tokenLimit: 8_000_000,
    requestsToday: 6_540,
    failoverTargets: ['model-gpt4o'],
    createdAt: '2026-02-10T14:30:00Z',
  },
  {
    id: 'model-gemini15',
    name: 'Gemini 1.5 Pro',
    provider: 'Google Vertex AI',
    endpoint: 'https://us-central1-aiplatform.googleapis.com/v1/projects/contoso/locations/us-central1/publishers/google/models/gemini-1.5-pro',
    capabilities: ['chat', 'vision', 'grounding', 'function-calling'],
    status: 'active',
    tokensUsedToday: 340_000,
    tokenLimit: 5_000_000,
    requestsToday: 4_210,
    failoverTargets: ['model-claude35'],
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'model-llama31',
    name: 'Llama 3.1 70B',
    provider: 'AWS Bedrock',
    endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com/model/meta.llama3-1-70b-instruct-v1',
    capabilities: ['chat', 'function-calling'],
    status: 'active',
    tokensUsedToday: 190_000,
    tokenLimit: 4_000_000,
    requestsToday: 3_820,
    failoverTargets: [],
    createdAt: '2026-02-20T16:45:00Z',
  },
  {
    id: 'model-mistral-large',
    name: 'Mistral Large',
    provider: 'Custom',
    endpoint: 'https://ml-models.internal.contoso.com/v1/mistral-large',
    capabilities: ['chat', 'function-calling'],
    status: 'inactive',
    tokensUsedToday: 0,
    tokenLimit: 3_000_000,
    requestsToday: 0,
    failoverTargets: [],
    createdAt: '2026-03-01T08:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------
export const tools: Tool[] = [
  {
    id: 'tool-crm',
    name: 'Customer CRM API',
    description: 'Provides customer profile lookup, account history, and relationship management operations.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/crm/v2',
    ownerTeam: 'Customer Platform',
    visibility: 'public',
    status: 'active',
    invocationsToday: 9_340,
    tags: ['crm', 'customer', 'accounts'],
    createdAt: '2026-02-01T10:00:00Z',
  },
  {
    id: 'tool-billing',
    name: 'Billing Service',
    description: 'Manages invoices, payment status, subscription tiers, and billing history queries.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/billing/v1',
    ownerTeam: 'Finance Engineering',
    visibility: 'public',
    status: 'active',
    invocationsToday: 5_120,
    tags: ['billing', 'payments', 'invoices'],
    createdAt: '2026-02-01T10:30:00Z',
  },
  {
    id: 'tool-slack',
    name: 'Slack Connector',
    description: 'Sends messages, creates channels, and retrieves conversation history from Slack workspaces.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/integrations/slack',
    ownerTeam: 'Platform Integrations',
    visibility: 'public',
    status: 'active',
    invocationsToday: 3_780,
    tags: ['messaging', 'slack', 'notifications'],
    createdAt: '2026-02-05T13:00:00Z',
  },
  {
    id: 'tool-github',
    name: 'GitHub Issues API',
    description: 'Creates, updates, and queries GitHub issues and pull requests across organisation repositories.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/integrations/github',
    ownerTeam: 'DevOps',
    visibility: 'public',
    status: 'active',
    invocationsToday: 2_650,
    tags: ['github', 'issues', 'devops'],
    createdAt: '2026-02-08T09:00:00Z',
  },
  {
    id: 'tool-jira',
    name: 'Jira Service Desk',
    description: 'Manages Jira tickets, transitions workflows, and queries project backlogs.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/integrations/jira',
    ownerTeam: 'DevOps',
    visibility: 'public',
    status: 'active',
    invocationsToday: 1_940,
    tags: ['jira', 'tickets', 'project-management'],
    createdAt: '2026-02-08T09:30:00Z',
  },
  {
    id: 'tool-kb',
    name: 'Internal Knowledge Base',
    description: 'Searches and retrieves articles from the internal knowledge base and documentation wiki.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/knowledge/v1',
    ownerTeam: 'Knowledge Management',
    visibility: 'public',
    status: 'active',
    invocationsToday: 4_510,
    tags: ['knowledge', 'search', 'documentation'],
    createdAt: '2026-02-12T11:00:00Z',
  },
  {
    id: 'tool-weather',
    name: 'Weather API',
    description: 'Provides current weather conditions and forecasts for any global location.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/integrations/weather',
    ownerTeam: 'Platform Integrations',
    visibility: 'public',
    status: 'active',
    invocationsToday: 820,
    tags: ['weather', 'external', 'utility'],
    createdAt: '2026-02-18T15:00:00Z',
  },
  {
    id: 'tool-payment',
    name: 'Payment Gateway',
    description: 'Processes payment transactions, refunds, and retrieves payment method details.',
    transport: 'REST',
    endpoint: 'https://api.internal.contoso.com/payments/v1',
    ownerTeam: 'Finance Engineering',
    visibility: 'private',
    status: 'active',
    invocationsToday: 1_360,
    tags: ['payments', 'transactions', 'sensitive'],
    createdAt: '2026-02-22T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// MCP Servers
// ---------------------------------------------------------------------------
export const mcpServers: MCPServer[] = [
  {
    id: 'mcp-crm',
    name: 'CRM MCP Server',
    description: 'MCP server auto-generated from the Customer CRM API, exposing customer operations as MCP tools.',
    hostingType: 'managed',
    transport: 'SSE',
    endpoint: 'https://apim.contoso.com/mcp/crm',
    toolCount: 5,
    sourceApi: 'tool-crm',
    status: 'active',
    requestsToday: 7_820,
    createdAt: '2026-02-25T09:00:00Z',
  },
  {
    id: 'mcp-devops',
    name: 'DevOps Tools MCP',
    description: 'Aggregates GitHub and Jira tools into a single MCP server for engineering workflows.',
    hostingType: 'managed',
    transport: 'SSE',
    endpoint: 'https://apim.contoso.com/mcp/devops',
    toolCount: 4,
    status: 'active',
    requestsToday: 3_410,
    createdAt: '2026-02-26T14:00:00Z',
  },
  {
    id: 'mcp-search',
    name: 'Enterprise Search MCP',
    description: 'External MCP server backed by Azure AI Search for semantic document retrieval.',
    hostingType: 'external',
    transport: 'SSE',
    endpoint: 'https://search-mcp.contoso.com/sse',
    toolCount: 3,
    status: 'active',
    requestsToday: 5_230,
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'mcp-billing',
    name: 'Billing MCP Server',
    description: 'MCP server auto-generated from the Billing Service API, exposing invoice and subscription tools.',
    hostingType: 'managed',
    transport: 'SSE',
    endpoint: 'https://apim.contoso.com/mcp/billing',
    toolCount: 3,
    sourceApi: 'tool-billing',
    status: 'active',
    requestsToday: 2_640,
    createdAt: '2026-03-03T11:00:00Z',
  },
  {
    id: 'mcp-comms',
    name: 'Communication MCP',
    description: 'Exposes Slack messaging and notification capabilities as MCP tools.',
    hostingType: 'managed',
    transport: 'SSE',
    endpoint: 'https://apim.contoso.com/mcp/comms',
    toolCount: 2,
    status: 'active',
    requestsToday: 1_980,
    createdAt: '2026-03-05T08:30:00Z',
  },
];

// ---------------------------------------------------------------------------
// Agents
// ---------------------------------------------------------------------------
export const agents: Agent[] = [
  {
    id: 'agent-support',
    name: 'Customer Support Agent',
    description: 'Handles customer enquiries by looking up account details, billing info, and resolving common issues autonomously.',
    protocol: 'RAPI',
    endpoint: 'https://apim.contoso.com/agents/customer-support',
    modelIds: ['model-gpt4o'],
    toolIds: ['tool-crm', 'tool-billing'],
    status: 'active',
    requestsToday: 8_920,
    createdAt: '2026-03-01T09:00:00Z',
  },
  {
    id: 'agent-devops',
    name: 'DevOps Assistant',
    description: 'Automates engineering workflows including issue triage, PR summaries, and deployment status checks.',
    protocol: 'A2A',
    endpoint: 'https://apim.contoso.com/agents/devops-assistant',
    modelIds: ['model-claude35'],
    toolIds: ['tool-github', 'tool-jira'],
    status: 'active',
    requestsToday: 3_150,
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'agent-sales',
    name: 'Sales Intelligence Agent',
    description: 'Provides sales teams with real-time customer insights, deal scoring, and account recommendations.',
    protocol: 'RAPI',
    endpoint: 'https://apim.contoso.com/agents/sales-intelligence',
    modelIds: ['model-gpt4o-mini'],
    toolIds: ['tool-crm'],
    status: 'active',
    requestsToday: 2_410,
    createdAt: '2026-03-04T14:00:00Z',
  },
  {
    id: 'agent-hr',
    name: 'HR Onboarding Agent',
    description: 'Guides new hires through onboarding steps, answers policy questions, and provisions initial access.',
    protocol: 'A2A',
    endpoint: 'https://apim.contoso.com/agents/hr-onboarding',
    modelIds: ['model-gemini15'],
    toolIds: ['tool-kb'],
    status: 'active',
    requestsToday: 780,
    createdAt: '2026-03-06T08:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Policies
// ---------------------------------------------------------------------------
export const policies: Policy[] = [
  {
    id: 'policy-token-limit',
    name: 'Token Rate Limit',
    description: 'Enforces per-consumer token-per-minute and daily token caps across all model endpoints.',
    target: 'models',
    phase: 'runtime',
    ruleCount: 3,
    enabled: true,
    appliedTo: 6,
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'policy-content-safety',
    name: 'Content Safety',
    description: 'Blocks requests and responses containing harmful, violent, or prohibited content categories.',
    target: 'models',
    phase: 'runtime',
    ruleCount: 2,
    enabled: true,
    appliedTo: 5,
    createdAt: '2026-02-05T10:30:00Z',
  },
  {
    id: 'policy-tool-acl',
    name: 'Tool Access Control',
    description: 'Restricts tool invocations based on caller identity, team membership, and scope claims.',
    target: 'tools',
    phase: 'runtime',
    ruleCount: 4,
    enabled: true,
    appliedTo: 8,
    createdAt: '2026-02-10T09:00:00Z',
  },
  {
    id: 'policy-ip-allowlist',
    name: 'IP Allowlist',
    description: 'Permits gateway access only from approved corporate IP ranges and VPN egress addresses.',
    target: 'global',
    phase: 'runtime',
    ruleCount: 1,
    enabled: true,
    appliedTo: 1,
    createdAt: '2026-02-12T08:00:00Z',
  },
  {
    id: 'policy-schema-validation',
    name: 'Schema Validation',
    description: 'Validates tool request and response payloads against registered OpenAPI schemas at design time.',
    target: 'tools',
    phase: 'design-time',
    ruleCount: 2,
    enabled: true,
    appliedTo: 8,
    createdAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'policy-agent-throttle',
    name: 'Agent Throttle',
    description: 'Limits agent request concurrency and per-minute invocation rates to prevent resource exhaustion.',
    target: 'agents',
    phase: 'runtime',
    ruleCount: 2,
    enabled: true,
    appliedTo: 4,
    createdAt: '2026-03-01T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Dashboard Stats
// ---------------------------------------------------------------------------
export const dashboardStats: DashboardStats = {
  totalModels: 6,
  totalTools: 8,
  totalMCPServers: 5,
  totalAgents: 4,
  totalPolicies: 6,
  totalRequests24h: 47_823,
  totalTokens24h: 12_450_000,
  activeAlerts: 2,
};

export interface LogEntry {
  id: string;
  timestamp: string;
  method: 'POST' | 'GET' | 'PUT' | 'DELETE';
  path: string;
  assetType: 'model' | 'tool' | 'mcp-server' | 'agent';
  assetName: string;
  statusCode: number;
  latencyMs: number;
  tokensIn?: number;
  tokensOut?: number;
  userId: string;
  ipAddress: string;
}

export const recentLogs: LogEntry[] = [
  { id: 'log-1', timestamp: '2026-03-03T23:01:12Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'GPT-4o', statusCode: 200, latencyMs: 1243, tokensIn: 512, tokensOut: 284, userId: 'dev-sarah@contoso.com', ipAddress: '10.0.1.42' },
  { id: 'log-2', timestamp: '2026-03-03T23:01:10Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'Claude 3.5 Sonnet', statusCode: 200, latencyMs: 987, tokensIn: 256, tokensOut: 198, userId: 'agent-customer-support', ipAddress: '10.0.2.15' },
  { id: 'log-3', timestamp: '2026-03-03T23:01:08Z', method: 'POST', path: '/mcp/crm-server/tools/lookup', assetType: 'mcp-server', assetName: 'CRM MCP Server', statusCode: 200, latencyMs: 342, userId: 'agent-customer-support', ipAddress: '10.0.2.15' },
  { id: 'log-4', timestamp: '2026-03-03T23:01:05Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'GPT-4o', statusCode: 429, latencyMs: 12, tokensIn: 0, tokensOut: 0, userId: 'dev-mike@contoso.com', ipAddress: '10.0.1.87' },
  { id: 'log-5', timestamp: '2026-03-03T23:01:03Z', method: 'POST', path: '/tools/billing-service/invoke', assetType: 'tool', assetName: 'Billing Service', statusCode: 200, latencyMs: 156, userId: 'agent-sales-intel', ipAddress: '10.0.3.22' },
  { id: 'log-6', timestamp: '2026-03-03T23:01:01Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'Gemini 1.5 Pro', statusCode: 200, latencyMs: 1567, tokensIn: 1024, tokensOut: 512, userId: 'agent-hr-onboarding', ipAddress: '10.0.4.11' },
  { id: 'log-7', timestamp: '2026-03-03T23:00:58Z', method: 'POST', path: '/mcp/devops-tools/tools/create-issue', assetType: 'mcp-server', assetName: 'DevOps Tools MCP', statusCode: 200, latencyMs: 445, userId: 'agent-devops-assist', ipAddress: '10.0.2.33' },
  { id: 'log-8', timestamp: '2026-03-03T23:00:55Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'GPT-4o-mini', statusCode: 200, latencyMs: 678, tokensIn: 384, tokensOut: 156, userId: 'dev-sarah@contoso.com', ipAddress: '10.0.1.42' },
  { id: 'log-9', timestamp: '2026-03-03T23:00:52Z', method: 'POST', path: '/agents/customer-support/invoke', assetType: 'agent', assetName: 'Customer Support Agent', statusCode: 200, latencyMs: 3421, userId: 'app-helpdesk', ipAddress: '10.0.5.100' },
  { id: 'log-10', timestamp: '2026-03-03T23:00:50Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'Claude 3.5 Sonnet', statusCode: 200, latencyMs: 1102, tokensIn: 768, tokensOut: 345, userId: 'dev-alex@contoso.com', ipAddress: '10.0.1.55' },
  { id: 'log-11', timestamp: '2026-03-03T23:00:47Z', method: 'POST', path: '/tools/slack-connector/send', assetType: 'tool', assetName: 'Slack Connector', statusCode: 200, latencyMs: 234, userId: 'agent-devops-assist', ipAddress: '10.0.2.33' },
  { id: 'log-12', timestamp: '2026-03-03T23:00:44Z', method: 'POST', path: '/v1/chat/completions', assetType: 'model', assetName: 'GPT-4o', statusCode: 200, latencyMs: 1389, tokensIn: 640, tokensOut: 312, userId: 'dev-mike@contoso.com', ipAddress: '10.0.1.87' },
  { id: 'log-13', timestamp: '2026-03-03T23:00:41Z', method: 'POST', path: '/mcp/enterprise-search/tools/query', assetType: 'mcp-server', assetName: 'Enterprise Search MCP', statusCode: 500, latencyMs: 5002, userId: 'agent-sales-intel', ipAddress: '10.0.3.22' },
  { id: 'log-14', timestamp: '2026-03-03T23:00:38Z', method: 'POST', path: '/v1/embeddings', assetType: 'model', assetName: 'GPT-4o-mini', statusCode: 200, latencyMs: 89, tokensIn: 128, tokensOut: 0, userId: 'app-knowledge-index', ipAddress: '10.0.6.10' },
  { id: 'log-15', timestamp: '2026-03-03T23:00:35Z', method: 'POST', path: '/tools/weather-api/forecast', assetType: 'tool', assetName: 'Weather API', statusCode: 200, latencyMs: 312, userId: 'agent-customer-support', ipAddress: '10.0.2.15' },
];
