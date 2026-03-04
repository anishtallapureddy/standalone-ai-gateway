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

// --- Catalog: unified view across all asset types ---

export type AssetType = 'model' | 'tool' | 'mcp-server' | 'skill' | 'workflow' | 'agent' | 'workload';

export interface CatalogItem {
  id: string;
  name: string;
  description: string;
  assetType: AssetType;
  namespace: string;
  tags: string[];
  status: 'active' | 'inactive' | 'pending-approval' | 'deprecated';
  owner: string;
  visibility: 'public' | 'private' | 'team';
  createdAt: string;
  updatedAt: string;
  usageLast24h: number;
}

export const catalogItems: CatalogItem[] = [
  // Models
  { id: 'model-1', name: 'GPT-4o', description: 'Latest OpenAI flagship model with vision capabilities', assetType: 'model', namespace: 'ai-platform', tags: ['chat', 'vision', 'production'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 15420 },
  { id: 'model-2', name: 'GPT-4o-mini', description: 'Cost-efficient OpenAI model for simpler tasks', assetType: 'model', namespace: 'ai-platform', tags: ['chat', 'embedding', 'cost-efficient'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 8930 },
  { id: 'model-3', name: 'Claude 3.5 Sonnet', description: 'Anthropic reasoning model for complex analysis', assetType: 'model', namespace: 'ai-platform', tags: ['chat', 'reasoning', 'analysis'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 6210 },
  { id: 'model-4', name: 'Gemini 1.5 Pro', description: 'Google multimodal model with long context window', assetType: 'model', namespace: 'ai-platform', tags: ['chat', 'multimodal', 'long-context'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 3450 },
  { id: 'model-5', name: 'Llama 3.1 70B', description: 'Meta open-weight model hosted on AWS Bedrock', assetType: 'model', namespace: 'ai-research', tags: ['chat', 'open-weight', 'research'], status: 'active', owner: 'Research Team', visibility: 'team', createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1200 },
  { id: 'model-6', name: 'Mistral Large', description: 'Custom-hosted Mistral model for internal experiments', assetType: 'model', namespace: 'ai-research', tags: ['chat', 'experimental'], status: 'inactive', owner: 'Research Team', visibility: 'team', createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 0 },
  // Tools
  { id: 'tool-1', name: 'Customer CRM API', description: 'Salesforce CRM integration for customer data lookup and updates', assetType: 'tool', namespace: 'customer-ops', tags: ['crm', 'customer-data', 'salesforce'], status: 'active', owner: 'CRM Team', visibility: 'public', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 4530 },
  { id: 'tool-2', name: 'Billing Service', description: 'Internal billing and invoice management API', assetType: 'tool', namespace: 'finance', tags: ['billing', 'invoicing', 'finance'], status: 'active', owner: 'Finance Engineering', visibility: 'team', createdAt: '2026-01-20T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 2180 },
  { id: 'tool-3', name: 'Slack Connector', description: 'Send messages, create channels, and manage Slack workspace', assetType: 'tool', namespace: 'communications', tags: ['messaging', 'slack', 'notifications'], status: 'active', owner: 'DevOps', visibility: 'public', createdAt: '2026-02-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1890 },
  { id: 'tool-4', name: 'GitHub Issues API', description: 'Create, update, and query GitHub issues and PRs', assetType: 'tool', namespace: 'engineering', tags: ['github', 'issues', 'development'], status: 'active', owner: 'DevOps', visibility: 'public', createdAt: '2026-02-05T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 3210 },
  { id: 'tool-5', name: 'Payment Gateway', description: 'Stripe payment processing for subscription management', assetType: 'tool', namespace: 'finance', tags: ['payments', 'stripe', 'sensitive'], status: 'active', owner: 'Finance Engineering', visibility: 'private', createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 890 },
  { id: 'tool-6', name: 'Weather API', description: 'Real-time weather data from OpenWeatherMap', assetType: 'tool', namespace: 'external-data', tags: ['weather', 'external', 'data'], status: 'active', owner: 'Data Team', visibility: 'public', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 560 },
  { id: 'tool-7', name: 'Internal Knowledge Base', description: 'Enterprise knowledge search across Confluence and SharePoint', assetType: 'tool', namespace: 'knowledge', tags: ['search', 'knowledge', 'enterprise'], status: 'active', owner: 'IT Team', visibility: 'public', createdAt: '2026-02-18T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 2340 },
  { id: 'tool-8', name: 'Jira Service Desk', description: 'Atlassian Jira ticket creation and management', assetType: 'tool', namespace: 'engineering', tags: ['jira', 'tickets', 'project-mgmt'], status: 'active', owner: 'DevOps', visibility: 'public', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1670 },
  // MCP Servers
  { id: 'mcp-1', name: 'CRM MCP Server', description: 'MCP endpoint for CRM operations — converted from Customer CRM API', assetType: 'mcp-server', namespace: 'customer-ops', tags: ['crm', 'mcp', 'auto-converted'], status: 'active', owner: 'CRM Team', visibility: 'public', createdAt: '2026-02-10T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 3400 },
  { id: 'mcp-2', name: 'DevOps Tools MCP', description: 'Unified MCP server for GitHub, Jira, and CI/CD tools', assetType: 'mcp-server', namespace: 'engineering', tags: ['devops', 'mcp', 'multi-tool'], status: 'active', owner: 'DevOps', visibility: 'public', createdAt: '2026-02-12T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 2800 },
  { id: 'mcp-3', name: 'Enterprise Search MCP', description: 'Search across knowledge bases, wikis, and docs via MCP', assetType: 'mcp-server', namespace: 'knowledge', tags: ['search', 'mcp', 'enterprise'], status: 'active', owner: 'IT Team', visibility: 'public', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1560 },
  // Agents
  { id: 'agent-1', name: 'Customer Support Agent', description: 'AI agent for tier-1 customer support with CRM and billing access', assetType: 'agent', namespace: 'customer-ops', tags: ['support', 'customer-facing', 'production'], status: 'active', owner: 'Support Team', visibility: 'public', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 5630 },
  { id: 'agent-2', name: 'DevOps Assistant', description: 'A2A agent for automated incident triage and resolution', assetType: 'agent', namespace: 'engineering', tags: ['devops', 'incident', 'automation'], status: 'active', owner: 'DevOps', visibility: 'team', createdAt: '2026-02-22T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1230 },
  { id: 'agent-3', name: 'Sales Intelligence Agent', description: 'Lead scoring and competitive intel for sales team', assetType: 'agent', namespace: 'sales', tags: ['sales', 'intelligence', 'analytics'], status: 'active', owner: 'Sales Ops', visibility: 'team', createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 890 },
  { id: 'agent-4', name: 'HR Onboarding Agent', description: 'Automated employee onboarding workflow with knowledge base', assetType: 'agent', namespace: 'hr', tags: ['hr', 'onboarding', 'workflow'], status: 'active', owner: 'HR Team', visibility: 'team', createdAt: '2026-02-27T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 340 },
  // Skills (new!)
  { id: 'skill-1', name: 'Customer 360 Lookup', description: 'Combines CRM, billing, and support history into a complete customer profile', assetType: 'skill', namespace: 'customer-ops', tags: ['customer', 'composite', 'production'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-28T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 2100 },
  { id: 'skill-2', name: 'Incident Triage', description: 'Analyzes alerts, correlates logs, and suggests remediation steps', assetType: 'skill', namespace: 'engineering', tags: ['incident', 'triage', 'automation'], status: 'active', owner: 'DevOps', visibility: 'team', createdAt: '2026-03-01T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 450 },
  { id: 'skill-3', name: 'Expense Report Processor', description: 'Extracts line items from receipts and creates expense reports', assetType: 'skill', namespace: 'finance', tags: ['finance', 'ocr', 'workflow'], status: 'pending-approval', owner: 'Finance Engineering', visibility: 'team', createdAt: '2026-03-02T10:00:00Z', updatedAt: '2026-03-02T10:00:00Z', usageLast24h: 0 },
  // Skills (additional)
  { id: 'skill-4', name: 'Customer Intent Analysis', description: 'Prompt-chain skill that analyzes customer messages, extracts entities, and classifies intent', assetType: 'skill', namespace: 'customer-ops', tags: ['prompt-chain', 'intent', 'nlp'], status: 'active', owner: 'Support Team', visibility: 'public', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 3420 },
  { id: 'skill-5', name: 'Code Review Assistant', description: 'Automated code review skill that fetches diffs, analyzes patterns, and posts review comments', assetType: 'skill', namespace: 'engineering', tags: ['code-review', 'automation', 'github'], status: 'active', owner: 'DevOps', visibility: 'team', createdAt: '2026-02-25T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 1890 },
  { id: 'skill-6', name: 'Document Summarization', description: 'Multi-step prompt chain that chunks, summarizes, and merges long documents', assetType: 'skill', namespace: 'knowledge', tags: ['summarization', 'prompt-chain', 'documents'], status: 'active', owner: 'Platform Team', visibility: 'public', createdAt: '2026-02-22T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 2750 },
  // Workloads
  { id: 'workload-1', name: 'Customer Support Platform', description: 'Production workload for customer support agents with CRM and billing integrations', assetType: 'workload', namespace: 'customer-ops', tags: ['production', 'customer-support', 'platform'], status: 'active', owner: 'Support Team', visibility: 'public', createdAt: '2026-02-15T10:00:00Z', updatedAt: '2026-03-03T10:00:00Z', usageLast24h: 12450 },
  { id: 'workload-2', name: 'DevOps Automation Suite', description: 'Production workload for DevOps automation including incident triage and code review', assetType: 'workload', namespace: 'engineering', tags: ['production', 'devops', 'automation'], status: 'active', owner: 'DevOps', visibility: 'team', createdAt: '2026-02-20T10:00:00Z', updatedAt: '2026-03-03T10:00:00Z', usageLast24h: 5630 },

  // Workflows
  { id: 'wf-1', name: 'Incident Triage', description: 'Parses alerts, checks incident history, assesses severity, creates tickets, and notifies teams', assetType: 'workflow', namespace: 'engineering', tags: ['incident', 'triage', 'automation'], status: 'active', owner: 'DevOps', visibility: 'team', createdAt: '2026-02-18T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 890 },
  { id: 'wf-2', name: 'Travel Planning', description: 'End-to-end travel workflow — searches flights, checks weather, generates itineraries', assetType: 'workflow', namespace: 'operations', tags: ['travel', 'planning', 'multi-step'], status: 'active', owner: 'Travel Team', visibility: 'public', createdAt: '2026-02-22T10:00:00Z', updatedAt: '2026-03-01T10:00:00Z', usageLast24h: 560 },
];

// --- Namespaces ---

export interface Namespace {
  id: string;
  name: string;
  displayName: string;
  description: string;
  owner: string;
  type: 'managed' | 'personal';
  assetCount: { models: number; tools: number; mcpServers: number; agents: number; skills: number };
  totalAssets: number;
  policies: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export const namespaces: Namespace[] = [
  { id: 'ns-1', name: 'ai-platform', displayName: 'AI Platform', description: 'Core AI models and infrastructure shared across the organization', owner: 'Platform Team', type: 'managed', assetCount: { models: 4, tools: 0, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 4, policies: ['Token Rate Limit', 'Content Safety'], status: 'active', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'ns-2', name: 'customer-ops', displayName: 'Customer Operations', description: 'Customer-facing tools, agents, and workflows for support and success teams', owner: 'Support Team', type: 'managed', assetCount: { models: 0, tools: 1, mcpServers: 1, agents: 1, skills: 1 }, totalAssets: 4, policies: ['Tool Access Control', 'Content Safety', 'Agent Throttle'], status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'ns-3', name: 'engineering', displayName: 'Engineering', description: 'Developer tools, DevOps automation, and CI/CD integrations', owner: 'DevOps', type: 'managed', assetCount: { models: 0, tools: 2, mcpServers: 1, agents: 1, skills: 1 }, totalAssets: 5, policies: ['Tool Access Control', 'IP Allowlist'], status: 'active', createdAt: '2026-01-20T10:00:00Z' },
  { id: 'ns-4', name: 'finance', displayName: 'Finance', description: 'Billing, payments, and financial reporting tools', owner: 'Finance Engineering', type: 'managed', assetCount: { models: 0, tools: 2, mcpServers: 0, agents: 0, skills: 1 }, totalAssets: 3, policies: ['Tool Access Control', 'Schema Validation', 'IP Allowlist'], status: 'active', createdAt: '2026-01-25T10:00:00Z' },
  { id: 'ns-5', name: 'ai-research', displayName: 'AI Research', description: 'Experimental models and research workloads', owner: 'Research Team', type: 'managed', assetCount: { models: 2, tools: 0, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 2, policies: ['Token Rate Limit'], status: 'active', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'ns-6', name: 'sales', displayName: 'Sales', description: 'Sales intelligence, lead scoring, and CRM analytics', owner: 'Sales Ops', type: 'managed', assetCount: { models: 0, tools: 0, mcpServers: 0, agents: 1, skills: 0 }, totalAssets: 1, policies: ['Agent Throttle'], status: 'active', createdAt: '2026-02-05T10:00:00Z' },
  { id: 'ns-7', name: 'hr', displayName: 'Human Resources', description: 'Employee onboarding, self-service, and HR workflows', owner: 'HR Team', type: 'managed', assetCount: { models: 0, tools: 0, mcpServers: 0, agents: 1, skills: 0 }, totalAssets: 1, policies: ['Content Safety'], status: 'active', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'ns-8', name: 'communications', displayName: 'Communications', description: 'Messaging and notification integrations', owner: 'DevOps', type: 'managed', assetCount: { models: 0, tools: 1, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 1, policies: [], status: 'active', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'ns-9', name: 'external-data', displayName: 'External Data', description: 'Third-party data sources and external API integrations', owner: 'Data Team', type: 'managed', assetCount: { models: 0, tools: 1, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 1, policies: ['Schema Validation'], status: 'active', createdAt: '2026-02-18T10:00:00Z' },
  { id: 'ns-10', name: 'knowledge', displayName: 'Knowledge', description: 'Enterprise knowledge management and search services', owner: 'IT Team', type: 'managed', assetCount: { models: 0, tools: 1, mcpServers: 1, agents: 0, skills: 0 }, totalAssets: 2, policies: [], status: 'active', createdAt: '2026-02-20T10:00:00Z' },
  { id: 'ns-11', name: 'anishta-sandbox', displayName: 'Anish — Sandbox', description: 'Personal sandbox for experimenting with models and tools', owner: 'Anish T.', type: 'personal', assetCount: { models: 1, tools: 2, mcpServers: 0, agents: 1, skills: 0 }, totalAssets: 4, policies: [], status: 'active', createdAt: '2026-02-25T10:00:00Z' },
  { id: 'ns-12', name: 'jane-experiments', displayName: 'Jane — Experiments', description: 'Prototyping new agent workflows for customer support', owner: 'Jane D.', type: 'personal', assetCount: { models: 0, tools: 1, mcpServers: 0, agents: 1, skills: 1 }, totalAssets: 3, policies: [], status: 'active', createdAt: '2026-03-01T10:00:00Z' },
];

// --- Design-Time Governance Rules ---

export interface GovernanceRule {
  id: string;
  name: string;
  description: string;
  category: 'registration' | 'schema' | 'approval' | 'naming' | 'security' | 'compliance';
  appliesTo: AssetType[];
  severity: 'error' | 'warning' | 'info';
  enabled: boolean;
  autoEnforce: boolean;
  namespaces: string[];  // empty = all namespaces
  lastTriggered?: string;
  violations24h: number;
}

export const governanceRules: GovernanceRule[] = [
  { id: 'gov-1', name: 'Require description', description: 'All registered assets must have a description of at least 20 characters', category: 'registration', appliesTo: ['model', 'tool', 'mcp-server', 'agent', 'skill'], severity: 'error', enabled: true, autoEnforce: true, namespaces: [], lastTriggered: '2026-03-03T18:30:00Z', violations24h: 3 },
  { id: 'gov-2', name: 'OpenAPI schema required', description: 'Tools must provide a valid OpenAPI specification or JSON Schema', category: 'schema', appliesTo: ['tool'], severity: 'error', enabled: true, autoEnforce: true, namespaces: [], lastTriggered: '2026-03-03T16:45:00Z', violations24h: 1 },
  { id: 'gov-3', name: 'MCP tool input schema', description: 'MCP servers must define input schemas for all exposed tools', category: 'schema', appliesTo: ['mcp-server'], severity: 'error', enabled: true, autoEnforce: true, namespaces: [], lastTriggered: '2026-03-02T10:00:00Z', violations24h: 0 },
  { id: 'gov-4', name: 'Production approval required', description: 'Assets in production namespaces require approval from namespace owner before activation', category: 'approval', appliesTo: ['model', 'tool', 'mcp-server', 'agent', 'skill'], severity: 'error', enabled: true, autoEnforce: true, namespaces: ['ai-platform', 'customer-ops', 'finance'], lastTriggered: '2026-03-03T20:15:00Z', violations24h: 2 },
  { id: 'gov-5', name: 'Naming convention', description: 'Asset names must follow kebab-case pattern and include the namespace prefix', category: 'naming', appliesTo: ['model', 'tool', 'mcp-server', 'agent', 'skill'], severity: 'warning', enabled: true, autoEnforce: false, namespaces: [], lastTriggered: '2026-03-03T14:20:00Z', violations24h: 5 },
  { id: 'gov-6', name: 'Auth required for tools', description: 'All tools must configure an authentication method (no "none" allowed)', category: 'security', appliesTo: ['tool', 'mcp-server'], severity: 'error', enabled: true, autoEnforce: true, namespaces: [], lastTriggered: '2026-03-03T12:00:00Z', violations24h: 0 },
  { id: 'gov-7', name: 'Failover required for models', description: 'Production models must have at least one failover target configured', category: 'security', appliesTo: ['model'], severity: 'warning', enabled: true, autoEnforce: false, namespaces: ['ai-platform'], lastTriggered: '2026-03-01T08:00:00Z', violations24h: 0 },
  { id: 'gov-8', name: 'PII handling declaration', description: 'Assets handling customer data must declare PII handling in their metadata', category: 'compliance', appliesTo: ['tool', 'mcp-server', 'agent'], severity: 'warning', enabled: true, autoEnforce: false, namespaces: ['customer-ops', 'hr', 'finance'], lastTriggered: '2026-03-03T09:00:00Z', violations24h: 1 },
  { id: 'gov-9', name: 'Deprecation notice period', description: 'Assets must provide 30 days notice before deprecation', category: 'compliance', appliesTo: ['model', 'tool', 'mcp-server', 'agent', 'skill'], severity: 'info', enabled: true, autoEnforce: false, namespaces: [], violations24h: 0 },
  { id: 'gov-10', name: 'Agent model binding review', description: 'New model bindings on production agents require review by platform team', category: 'approval', appliesTo: ['agent'], severity: 'error', enabled: true, autoEnforce: true, namespaces: ['customer-ops', 'sales'], lastTriggered: '2026-03-03T17:00:00Z', violations24h: 1 },
];

// --- Pending Approvals ---

export interface PendingApproval {
  id: string;
  assetName: string;
  assetType: AssetType;
  namespace: string;
  requestedBy: string;
  requestedAt: string;
  action: 'register' | 'update' | 'activate' | 'deprecate';
  ruleTriggered: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const pendingApprovals: PendingApproval[] = [
  { id: 'appr-1', assetName: 'Expense Report Processor', assetType: 'skill', namespace: 'finance', requestedBy: 'dev-jane@contoso.com', requestedAt: '2026-03-03T14:30:00Z', action: 'register', ruleTriggered: 'Production approval required', status: 'pending' },
  { id: 'appr-2', assetName: 'GPT-4o', assetType: 'model', namespace: 'ai-platform', requestedBy: 'dev-mike@contoso.com', requestedAt: '2026-03-03T16:00:00Z', action: 'update', ruleTriggered: 'Production approval required', status: 'pending' },
  { id: 'appr-3', assetName: 'Customer Support Agent', assetType: 'agent', namespace: 'customer-ops', requestedBy: 'dev-sarah@contoso.com', requestedAt: '2026-03-03T17:00:00Z', action: 'update', ruleTriggered: 'Agent model binding review', status: 'pending' },
  { id: 'appr-4', assetName: 'Billing Service', assetType: 'tool', namespace: 'finance', requestedBy: 'dev-alex@contoso.com', requestedAt: '2026-03-02T10:00:00Z', action: 'update', ruleTriggered: 'Production approval required', status: 'approved' },
  { id: 'appr-5', assetName: 'Test Model v2', assetType: 'model', namespace: 'ai-research', requestedBy: 'dev-mike@contoso.com', requestedAt: '2026-03-01T09:00:00Z', action: 'register', ruleTriggered: 'Require description', status: 'rejected' },
];

// --- RAI Guardrails ---

export interface RAIGuardrail {
  id: string;
  name: string;
  description: string;
  category: 'content-safety' | 'pii-protection' | 'jailbreak' | 'hallucination' | 'fairness' | 'transparency';
  target: 'input' | 'output' | 'both';
  severity: 'block' | 'warn' | 'log';
  enabled: boolean;
  appliesTo: string[];
  triggersToday: number;
  blockedToday: number;
  lastTriggered?: string;
}

export const raiGuardrails: RAIGuardrail[] = [
  { id: 'rai-1', name: 'Hate & Violence Filter', description: 'Blocks prompts and responses containing hate speech, violent content, or threats. Uses Azure Content Safety categories.', category: 'content-safety', target: 'both', severity: 'block', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 12, blockedToday: 12, lastTriggered: '2026-03-03T22:45:00Z' },
  { id: 'rai-2', name: 'Self-Harm Prevention', description: 'Detects and blocks content related to self-harm or suicide, redirecting to support resources when appropriate.', category: 'content-safety', target: 'both', severity: 'block', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 2, blockedToday: 2, lastTriggered: '2026-03-03T19:10:00Z' },
  { id: 'rai-3', name: 'PII Redaction — Input', description: 'Scans inbound prompts for PII (SSN, credit cards, emails, phone numbers) and redacts before forwarding to model.', category: 'pii-protection', target: 'input', severity: 'warn', enabled: true, appliesTo: ['models', 'agents', 'tools'], triggersToday: 34, blockedToday: 0, lastTriggered: '2026-03-03T23:01:00Z' },
  { id: 'rai-4', name: 'PII Redaction — Output', description: 'Scans model responses for inadvertently generated PII and masks it before returning to the caller.', category: 'pii-protection', target: 'output', severity: 'warn', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 8, blockedToday: 0, lastTriggered: '2026-03-03T22:30:00Z' },
  { id: 'rai-5', name: 'Jailbreak Detection', description: 'Detects prompt injection and jailbreak attempts using pattern matching and classifier model. Blocks suspicious requests.', category: 'jailbreak', target: 'input', severity: 'block', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 7, blockedToday: 7, lastTriggered: '2026-03-03T21:55:00Z' },
  { id: 'rai-6', name: 'Indirect Prompt Injection Guard', description: 'Scans tool outputs and grounding data for embedded instructions that could manipulate agent behavior.', category: 'jailbreak', target: 'input', severity: 'block', enabled: true, appliesTo: ['agents'], triggersToday: 3, blockedToday: 3, lastTriggered: '2026-03-03T20:40:00Z' },
  { id: 'rai-7', name: 'Groundedness Check', description: 'Validates that model responses are grounded in provided context and flags potential hallucinations.', category: 'hallucination', target: 'output', severity: 'warn', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 15, blockedToday: 0, lastTriggered: '2026-03-03T23:12:00Z' },
  { id: 'rai-8', name: 'Sexual Content Filter', description: 'Blocks generation and passthrough of sexually explicit content across all model interactions.', category: 'content-safety', target: 'both', severity: 'block', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 4, blockedToday: 4, lastTriggered: '2026-03-03T18:30:00Z' },
  { id: 'rai-9', name: 'Bias & Fairness Monitor', description: 'Logs outputs that exhibit demographic bias patterns. Sends alerts but does not block responses.', category: 'fairness', target: 'output', severity: 'log', enabled: true, appliesTo: ['models', 'agents'], triggersToday: 6, blockedToday: 0, lastTriggered: '2026-03-03T17:15:00Z' },
  { id: 'rai-10', name: 'AI Disclosure Watermark', description: 'Appends AI-generated disclosure metadata to all model outputs for transparency compliance.', category: 'transparency', target: 'output', severity: 'log', enabled: true, appliesTo: ['models', 'agents', 'tools'], triggersToday: 1240, blockedToday: 0, lastTriggered: '2026-03-03T23:50:00Z' },
];

// ---------------------------------------------------------------------------
// Consumers (Users & Apps)
// ---------------------------------------------------------------------------

export interface Consumer {
  id: string;
  name: string;
  displayName: string;
  type: 'user' | 'application' | 'service-principal';
  authMethod: 'api-key' | 'entra-id' | 'oauth2' | 'managed-identity';
  email?: string;
  team: string;
  namespace: string;
  apiKeyPrefix?: string;
  apiKeyCreatedAt?: string;
  apiKeyExpiresAt?: string;
  quotas: {
    tokensPerMinute: number;
    tokensPerDay: number;
    requestsPerMinute: number;
  };
  usage24h: {
    totalTokens: number;
    totalRequests: number;
    totalCost: number;
    modelsUsed: string[];
  };
  status: 'active' | 'suspended' | 'pending';
  lastActive: string;
  createdAt: string;
}

export const consumers: Consumer[] = [
  {
    id: 'consumer-sarah',
    name: 'dev-sarah@contoso.com',
    displayName: 'Sarah Chen',
    type: 'user',
    authMethod: 'entra-id',
    email: 'dev-sarah@contoso.com',
    team: 'Customer Operations',
    namespace: 'customer-ops',
    quotas: { tokensPerMinute: 80_000, tokensPerDay: 5_000_000, requestsPerMinute: 60 },
    usage24h: { totalTokens: 2_100_000, totalRequests: 4_320, totalCost: 4.20, modelsUsed: ['GPT-4o', 'GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T23:42:00Z',
    createdAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'consumer-mike',
    name: 'dev-mike@contoso.com',
    displayName: 'Mike Johnson',
    type: 'user',
    authMethod: 'entra-id',
    email: 'dev-mike@contoso.com',
    team: 'AI Research',
    namespace: 'ai-research',
    quotas: { tokensPerMinute: 100_000, tokensPerDay: 8_000_000, requestsPerMinute: 80 },
    usage24h: { totalTokens: 1_500_000, totalRequests: 3_150, totalCost: 3.10, modelsUsed: ['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro'] },
    status: 'active',
    lastActive: '2026-03-03T22:58:00Z',
    createdAt: '2026-01-18T10:30:00Z',
  },
  {
    id: 'consumer-alex',
    name: 'dev-alex@contoso.com',
    displayName: 'Alex Rivera',
    type: 'user',
    authMethod: 'api-key',
    email: 'dev-alex@contoso.com',
    team: 'Engineering',
    namespace: 'engineering',
    apiKeyPrefix: 'sk-...xR7q',
    apiKeyCreatedAt: '2026-02-10T08:00:00Z',
    apiKeyExpiresAt: '2026-05-10T08:00:00Z',
    quotas: { tokensPerMinute: 40_000, tokensPerDay: 2_000_000, requestsPerMinute: 30 },
    usage24h: { totalTokens: 620_000, totalRequests: 1_280, totalCost: 1.05, modelsUsed: ['GPT-4o-mini', 'Llama 3.1 70B'] },
    status: 'active',
    lastActive: '2026-03-03T21:15:00Z',
    createdAt: '2026-02-01T14:00:00Z',
  },
  {
    id: 'consumer-jane',
    name: 'dev-jane@contoso.com',
    displayName: 'Jane Park',
    type: 'user',
    authMethod: 'entra-id',
    email: 'dev-jane@contoso.com',
    team: 'Finance Engineering',
    namespace: 'finance',
    quotas: { tokensPerMinute: 30_000, tokensPerDay: 1_500_000, requestsPerMinute: 20 },
    usage24h: { totalTokens: 180_000, totalRequests: 410, totalCost: 0.32, modelsUsed: ['GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T18:45:00Z',
    createdAt: '2026-02-05T11:00:00Z',
  },
  {
    id: 'consumer-customer-support',
    name: 'agent-customer-support',
    displayName: 'Customer Support Agent',
    type: 'application',
    authMethod: 'managed-identity',
    team: 'Customer Operations',
    namespace: 'customer-ops',
    quotas: { tokensPerMinute: 200_000, tokensPerDay: 20_000_000, requestsPerMinute: 200 },
    usage24h: { totalTokens: 5_200_000, totalRequests: 11_400, totalCost: 12.80, modelsUsed: ['GPT-4o', 'GPT-4o-mini', 'Claude 3.5 Sonnet'] },
    status: 'active',
    lastActive: '2026-03-03T23:59:00Z',
    createdAt: '2026-01-20T08:00:00Z',
  },
  {
    id: 'consumer-devops-assist',
    name: 'agent-devops-assist',
    displayName: 'DevOps Assistant',
    type: 'application',
    authMethod: 'managed-identity',
    team: 'DevOps',
    namespace: 'engineering',
    quotas: { tokensPerMinute: 120_000, tokensPerDay: 10_000_000, requestsPerMinute: 100 },
    usage24h: { totalTokens: 1_800_000, totalRequests: 3_920, totalCost: 3.60, modelsUsed: ['GPT-4o', 'GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T23:55:00Z',
    createdAt: '2026-01-25T09:00:00Z',
  },
  {
    id: 'consumer-sales-intel',
    name: 'agent-sales-intel',
    displayName: 'Sales Intelligence Agent',
    type: 'application',
    authMethod: 'managed-identity',
    team: 'Sales Ops',
    namespace: 'sales',
    quotas: { tokensPerMinute: 80_000, tokensPerDay: 5_000_000, requestsPerMinute: 60 },
    usage24h: { totalTokens: 900_000, totalRequests: 1_950, totalCost: 1.85, modelsUsed: ['GPT-4o', 'Gemini 1.5 Pro'] },
    status: 'active',
    lastActive: '2026-03-03T23:30:00Z',
    createdAt: '2026-02-05T10:00:00Z',
  },
  {
    id: 'consumer-hr-onboarding',
    name: 'agent-hr-onboarding',
    displayName: 'HR Onboarding Agent',
    type: 'application',
    authMethod: 'managed-identity',
    team: 'HR Team',
    namespace: 'hr',
    quotas: { tokensPerMinute: 40_000, tokensPerDay: 2_000_000, requestsPerMinute: 30 },
    usage24h: { totalTokens: 400_000, totalRequests: 870, totalCost: 0.72, modelsUsed: ['GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T19:20:00Z',
    createdAt: '2026-02-10T08:30:00Z',
  },
  {
    id: 'consumer-helpdesk',
    name: 'app-helpdesk',
    displayName: 'IT Helpdesk App',
    type: 'application',
    authMethod: 'api-key',
    team: 'IT Team',
    namespace: 'knowledge',
    apiKeyPrefix: 'sk-...hD4m',
    apiKeyCreatedAt: '2026-02-15T10:00:00Z',
    apiKeyExpiresAt: '2026-08-15T10:00:00Z',
    quotas: { tokensPerMinute: 60_000, tokensPerDay: 3_000_000, requestsPerMinute: 50 },
    usage24h: { totalTokens: 800_000, totalRequests: 1_740, totalCost: 1.45, modelsUsed: ['GPT-4o-mini', 'Claude 3.5 Sonnet'] },
    status: 'active',
    lastActive: '2026-03-03T23:10:00Z',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'consumer-knowledge-index',
    name: 'app-knowledge-index',
    displayName: 'Knowledge Indexer',
    type: 'application',
    authMethod: 'api-key',
    team: 'Data Team',
    namespace: 'knowledge',
    apiKeyPrefix: 'sk-...kI9z',
    apiKeyCreatedAt: '2026-02-20T14:00:00Z',
    apiKeyExpiresAt: '2026-06-20T14:00:00Z',
    quotas: { tokensPerMinute: 50_000, tokensPerDay: 2_500_000, requestsPerMinute: 40 },
    usage24h: { totalTokens: 600_000, totalRequests: 1_320, totalCost: 0.90, modelsUsed: ['GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T22:00:00Z',
    createdAt: '2026-02-20T14:00:00Z',
  },
  {
    id: 'consumer-batch-processor',
    name: 'svc-batch-processor',
    displayName: 'Batch Processing Service',
    type: 'service-principal',
    authMethod: 'managed-identity',
    team: 'Platform Team',
    namespace: 'ai-platform',
    quotas: { tokensPerMinute: 300_000, tokensPerDay: 30_000_000, requestsPerMinute: 250 },
    usage24h: { totalTokens: 3_100_000, totalRequests: 6_800, totalCost: 7.50, modelsUsed: ['GPT-4o', 'GPT-4o-mini', 'Llama 3.1 70B'] },
    status: 'active',
    lastActive: '2026-03-03T23:58:00Z',
    createdAt: '2026-01-12T07:00:00Z',
  },
  {
    id: 'consumer-monitoring',
    name: 'svc-monitoring',
    displayName: 'Monitoring Service',
    type: 'service-principal',
    authMethod: 'api-key',
    team: 'Platform Team',
    namespace: 'ai-platform',
    apiKeyPrefix: 'sk-...mN2p',
    apiKeyCreatedAt: '2026-01-10T08:00:00Z',
    apiKeyExpiresAt: '2026-07-10T08:00:00Z',
    quotas: { tokensPerMinute: 10_000, tokensPerDay: 500_000, requestsPerMinute: 20 },
    usage24h: { totalTokens: 50_000, totalRequests: 120, totalCost: 0.08, modelsUsed: ['GPT-4o-mini'] },
    status: 'active',
    lastActive: '2026-03-03T23:50:00Z',
    createdAt: '2026-01-10T08:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Token Analytics
// ---------------------------------------------------------------------------

export interface TokenUsageByModel {
  modelId: string;
  modelName: string;
  provider: string;
  tokensIn: number;
  tokensOut: number;
  totalTokens: number;
  requests: number;
  cost: number;
  avgLatencyMs: number;
}

export interface TokenUsageTimeSeries {
  timestamp: string;
  tokensIn: number;
  tokensOut: number;
  requests: number;
  cost: number;
}

export interface ConsumerUsageDetail {
  consumerId: string;
  consumerName: string;
  byModel: TokenUsageByModel[];
  timeSeries24h: TokenUsageTimeSeries[];
}

export const tokenUsageByModel: TokenUsageByModel[] = [
  { modelId: 'model-gpt4o', modelName: 'GPT-4o', provider: 'Azure OpenAI', tokensIn: 5_800_000, tokensOut: 2_940_000, totalTokens: 8_740_000, requests: 18_432, cost: 21.85, avgLatencyMs: 320 },
  { modelId: 'model-gpt4o-mini', modelName: 'GPT-4o-mini', provider: 'Azure OpenAI', tokensIn: 1_420_000, tokensOut: 730_000, totalTokens: 2_150_000, requests: 12_870, cost: 3.22, avgLatencyMs: 180 },
  { modelId: 'model-claude35', modelName: 'Claude 3.5 Sonnet', provider: 'Anthropic', tokensIn: 680_000, tokensOut: 340_000, totalTokens: 1_020_000, requests: 6_540, cost: 4.59, avgLatencyMs: 410 },
  { modelId: 'model-gemini15', modelName: 'Gemini 1.5 Pro', provider: 'Google Vertex AI', tokensIn: 220_000, tokensOut: 120_000, totalTokens: 340_000, requests: 4_210, cost: 1.19, avgLatencyMs: 290 },
  { modelId: 'model-llama31', modelName: 'Llama 3.1 70B', provider: 'AWS Bedrock', tokensIn: 130_000, tokensOut: 60_000, totalTokens: 190_000, requests: 3_820, cost: 0.57, avgLatencyMs: 250 },
];

export const enterpriseTimeSeries24h: TokenUsageTimeSeries[] = [
  { timestamp: '2026-03-03T00:00:00Z', tokensIn: 42_000, tokensOut: 18_000, requests: 140, cost: 0.15 },
  { timestamp: '2026-03-03T01:00:00Z', tokensIn: 35_000, tokensOut: 15_000, requests: 110, cost: 0.12 },
  { timestamp: '2026-03-03T02:00:00Z', tokensIn: 28_000, tokensOut: 12_000, requests: 85, cost: 0.10 },
  { timestamp: '2026-03-03T03:00:00Z', tokensIn: 22_000, tokensOut: 10_000, requests: 70, cost: 0.08 },
  { timestamp: '2026-03-03T04:00:00Z', tokensIn: 25_000, tokensOut: 11_000, requests: 75, cost: 0.09 },
  { timestamp: '2026-03-03T05:00:00Z', tokensIn: 38_000, tokensOut: 16_000, requests: 120, cost: 0.13 },
  { timestamp: '2026-03-03T06:00:00Z', tokensIn: 85_000, tokensOut: 38_000, requests: 290, cost: 0.30 },
  { timestamp: '2026-03-03T07:00:00Z', tokensIn: 180_000, tokensOut: 82_000, requests: 620, cost: 0.65 },
  { timestamp: '2026-03-03T08:00:00Z', tokensIn: 320_000, tokensOut: 148_000, requests: 1_100, cost: 1.15 },
  { timestamp: '2026-03-03T09:00:00Z', tokensIn: 520_000, tokensOut: 240_000, requests: 1_800, cost: 1.88 },
  { timestamp: '2026-03-03T10:00:00Z', tokensIn: 610_000, tokensOut: 285_000, requests: 2_100, cost: 2.21 },
  { timestamp: '2026-03-03T11:00:00Z', tokensIn: 680_000, tokensOut: 310_000, requests: 2_350, cost: 2.45 },
  { timestamp: '2026-03-03T12:00:00Z', tokensIn: 550_000, tokensOut: 250_000, requests: 1_900, cost: 1.98 },
  { timestamp: '2026-03-03T13:00:00Z', tokensIn: 640_000, tokensOut: 295_000, requests: 2_200, cost: 2.31 },
  { timestamp: '2026-03-03T14:00:00Z', tokensIn: 700_000, tokensOut: 320_000, requests: 2_420, cost: 2.52 },
  { timestamp: '2026-03-03T15:00:00Z', tokensIn: 670_000, tokensOut: 305_000, requests: 2_310, cost: 2.41 },
  { timestamp: '2026-03-03T16:00:00Z', tokensIn: 580_000, tokensOut: 265_000, requests: 2_000, cost: 2.09 },
  { timestamp: '2026-03-03T17:00:00Z', tokensIn: 450_000, tokensOut: 205_000, requests: 1_550, cost: 1.62 },
  { timestamp: '2026-03-03T18:00:00Z', tokensIn: 280_000, tokensOut: 128_000, requests: 960, cost: 1.01 },
  { timestamp: '2026-03-03T19:00:00Z', tokensIn: 190_000, tokensOut: 86_000, requests: 650, cost: 0.68 },
  { timestamp: '2026-03-03T20:00:00Z', tokensIn: 140_000, tokensOut: 64_000, requests: 480, cost: 0.50 },
  { timestamp: '2026-03-03T21:00:00Z', tokensIn: 105_000, tokensOut: 48_000, requests: 360, cost: 0.38 },
  { timestamp: '2026-03-03T22:00:00Z', tokensIn: 78_000, tokensOut: 35_000, requests: 265, cost: 0.28 },
  { timestamp: '2026-03-03T23:00:00Z', tokensIn: 58_000, tokensOut: 26_000, requests: 195, cost: 0.21 },
];

export const consumerUsageDetails: ConsumerUsageDetail[] = [
  {
    consumerId: 'consumer-sarah',
    consumerName: 'dev-sarah@contoso.com',
    byModel: [
      { modelId: 'model-gpt4o', modelName: 'GPT-4o', provider: 'Azure OpenAI', tokensIn: 1_120_000, tokensOut: 560_000, totalTokens: 1_680_000, requests: 3_450, cost: 3.36, avgLatencyMs: 315 },
      { modelId: 'model-gpt4o-mini', modelName: 'GPT-4o-mini', provider: 'Azure OpenAI', tokensIn: 280_000, tokensOut: 140_000, totalTokens: 420_000, requests: 870, cost: 0.84, avgLatencyMs: 175 },
    ],
    timeSeries24h: [
      { timestamp: '2026-03-03T00:00:00Z', tokensIn: 5_000, tokensOut: 2_500, requests: 12, cost: 0.02 },
      { timestamp: '2026-03-03T01:00:00Z', tokensIn: 3_000, tokensOut: 1_500, requests: 7, cost: 0.01 },
      { timestamp: '2026-03-03T02:00:00Z', tokensIn: 1_000, tokensOut: 500, requests: 3, cost: 0.00 },
      { timestamp: '2026-03-03T03:00:00Z', tokensIn: 0, tokensOut: 0, requests: 0, cost: 0.00 },
      { timestamp: '2026-03-03T04:00:00Z', tokensIn: 0, tokensOut: 0, requests: 0, cost: 0.00 },
      { timestamp: '2026-03-03T05:00:00Z', tokensIn: 0, tokensOut: 0, requests: 0, cost: 0.00 },
      { timestamp: '2026-03-03T06:00:00Z', tokensIn: 2_000, tokensOut: 1_000, requests: 5, cost: 0.01 },
      { timestamp: '2026-03-03T07:00:00Z', tokensIn: 15_000, tokensOut: 7_500, requests: 35, cost: 0.04 },
      { timestamp: '2026-03-03T08:00:00Z', tokensIn: 45_000, tokensOut: 22_000, requests: 95, cost: 0.13 },
      { timestamp: '2026-03-03T09:00:00Z', tokensIn: 95_000, tokensOut: 47_000, requests: 200, cost: 0.28 },
      { timestamp: '2026-03-03T10:00:00Z', tokensIn: 120_000, tokensOut: 60_000, requests: 250, cost: 0.36 },
      { timestamp: '2026-03-03T11:00:00Z', tokensIn: 130_000, tokensOut: 65_000, requests: 270, cost: 0.39 },
      { timestamp: '2026-03-03T12:00:00Z', tokensIn: 85_000, tokensOut: 42_000, requests: 178, cost: 0.25 },
      { timestamp: '2026-03-03T13:00:00Z', tokensIn: 110_000, tokensOut: 55_000, requests: 230, cost: 0.33 },
      { timestamp: '2026-03-03T14:00:00Z', tokensIn: 125_000, tokensOut: 62_000, requests: 260, cost: 0.37 },
      { timestamp: '2026-03-03T15:00:00Z', tokensIn: 115_000, tokensOut: 57_000, requests: 240, cost: 0.34 },
      { timestamp: '2026-03-03T16:00:00Z', tokensIn: 100_000, tokensOut: 50_000, requests: 210, cost: 0.30 },
      { timestamp: '2026-03-03T17:00:00Z', tokensIn: 70_000, tokensOut: 35_000, requests: 148, cost: 0.21 },
      { timestamp: '2026-03-03T18:00:00Z', tokensIn: 40_000, tokensOut: 20_000, requests: 85, cost: 0.12 },
      { timestamp: '2026-03-03T19:00:00Z', tokensIn: 25_000, tokensOut: 12_000, requests: 52, cost: 0.07 },
      { timestamp: '2026-03-03T20:00:00Z', tokensIn: 18_000, tokensOut: 9_000, requests: 38, cost: 0.05 },
      { timestamp: '2026-03-03T21:00:00Z', tokensIn: 12_000, tokensOut: 6_000, requests: 25, cost: 0.04 },
      { timestamp: '2026-03-03T22:00:00Z', tokensIn: 8_000, tokensOut: 4_000, requests: 17, cost: 0.02 },
      { timestamp: '2026-03-03T23:00:00Z', tokensIn: 6_000, tokensOut: 3_000, requests: 12, cost: 0.02 },
    ],
  },
  {
    consumerId: 'consumer-customer-support',
    consumerName: 'agent-customer-support',
    byModel: [
      { modelId: 'model-gpt4o', modelName: 'GPT-4o', provider: 'Azure OpenAI', tokensIn: 2_080_000, tokensOut: 1_040_000, totalTokens: 3_120_000, requests: 6_840, cost: 7.80, avgLatencyMs: 330 },
      { modelId: 'model-gpt4o-mini', modelName: 'GPT-4o-mini', provider: 'Azure OpenAI', tokensIn: 720_000, tokensOut: 360_000, totalTokens: 1_080_000, requests: 2_280, cost: 2.16, avgLatencyMs: 185 },
      { modelId: 'model-claude35', modelName: 'Claude 3.5 Sonnet', provider: 'Anthropic', tokensIn: 660_000, tokensOut: 340_000, totalTokens: 1_000_000, requests: 2_280, cost: 2.84, avgLatencyMs: 420 },
    ],
    timeSeries24h: [
      { timestamp: '2026-03-03T00:00:00Z', tokensIn: 28_000, tokensOut: 14_000, requests: 62, cost: 0.10 },
      { timestamp: '2026-03-03T01:00:00Z', tokensIn: 22_000, tokensOut: 11_000, requests: 48, cost: 0.08 },
      { timestamp: '2026-03-03T02:00:00Z', tokensIn: 18_000, tokensOut: 9_000, requests: 40, cost: 0.07 },
      { timestamp: '2026-03-03T03:00:00Z', tokensIn: 15_000, tokensOut: 7_500, requests: 33, cost: 0.06 },
      { timestamp: '2026-03-03T04:00:00Z', tokensIn: 16_000, tokensOut: 8_000, requests: 35, cost: 0.06 },
      { timestamp: '2026-03-03T05:00:00Z', tokensIn: 22_000, tokensOut: 11_000, requests: 48, cost: 0.08 },
      { timestamp: '2026-03-03T06:00:00Z', tokensIn: 50_000, tokensOut: 25_000, requests: 110, cost: 0.19 },
      { timestamp: '2026-03-03T07:00:00Z', tokensIn: 110_000, tokensOut: 55_000, requests: 240, cost: 0.41 },
      { timestamp: '2026-03-03T08:00:00Z', tokensIn: 195_000, tokensOut: 97_000, requests: 428, cost: 0.72 },
      { timestamp: '2026-03-03T09:00:00Z', tokensIn: 280_000, tokensOut: 140_000, requests: 615, cost: 1.04 },
      { timestamp: '2026-03-03T10:00:00Z', tokensIn: 320_000, tokensOut: 160_000, requests: 702, cost: 1.19 },
      { timestamp: '2026-03-03T11:00:00Z', tokensIn: 340_000, tokensOut: 170_000, requests: 746, cost: 1.26 },
      { timestamp: '2026-03-03T12:00:00Z', tokensIn: 260_000, tokensOut: 130_000, requests: 572, cost: 0.96 },
      { timestamp: '2026-03-03T13:00:00Z', tokensIn: 310_000, tokensOut: 155_000, requests: 680, cost: 1.15 },
      { timestamp: '2026-03-03T14:00:00Z', tokensIn: 350_000, tokensOut: 175_000, requests: 768, cost: 1.30 },
      { timestamp: '2026-03-03T15:00:00Z', tokensIn: 330_000, tokensOut: 165_000, requests: 724, cost: 1.22 },
      { timestamp: '2026-03-03T16:00:00Z', tokensIn: 290_000, tokensOut: 145_000, requests: 636, cost: 1.08 },
      { timestamp: '2026-03-03T17:00:00Z', tokensIn: 220_000, tokensOut: 110_000, requests: 484, cost: 0.82 },
      { timestamp: '2026-03-03T18:00:00Z', tokensIn: 140_000, tokensOut: 70_000, requests: 308, cost: 0.52 },
      { timestamp: '2026-03-03T19:00:00Z', tokensIn: 95_000, tokensOut: 47_000, requests: 208, cost: 0.35 },
      { timestamp: '2026-03-03T20:00:00Z', tokensIn: 70_000, tokensOut: 35_000, requests: 154, cost: 0.26 },
      { timestamp: '2026-03-03T21:00:00Z', tokensIn: 52_000, tokensOut: 26_000, requests: 114, cost: 0.19 },
      { timestamp: '2026-03-03T22:00:00Z', tokensIn: 40_000, tokensOut: 20_000, requests: 88, cost: 0.15 },
      { timestamp: '2026-03-03T23:00:00Z', tokensIn: 32_000, tokensOut: 16_000, requests: 70, cost: 0.12 },
    ],
  },
  {
    consumerId: 'consumer-devops-assist',
    consumerName: 'agent-devops-assist',
    byModel: [
      { modelId: 'model-gpt4o', modelName: 'GPT-4o', provider: 'Azure OpenAI', tokensIn: 840_000, tokensOut: 420_000, totalTokens: 1_260_000, requests: 2_744, cost: 2.52, avgLatencyMs: 310 },
      { modelId: 'model-gpt4o-mini', modelName: 'GPT-4o-mini', provider: 'Azure OpenAI', tokensIn: 360_000, tokensOut: 180_000, totalTokens: 540_000, requests: 1_176, cost: 1.08, avgLatencyMs: 170 },
    ],
    timeSeries24h: [
      { timestamp: '2026-03-03T00:00:00Z', tokensIn: 8_000, tokensOut: 4_000, requests: 18, cost: 0.03 },
      { timestamp: '2026-03-03T01:00:00Z', tokensIn: 6_000, tokensOut: 3_000, requests: 13, cost: 0.02 },
      { timestamp: '2026-03-03T02:00:00Z', tokensIn: 5_000, tokensOut: 2_500, requests: 11, cost: 0.02 },
      { timestamp: '2026-03-03T03:00:00Z', tokensIn: 4_000, tokensOut: 2_000, requests: 9, cost: 0.01 },
      { timestamp: '2026-03-03T04:00:00Z', tokensIn: 5_000, tokensOut: 2_500, requests: 11, cost: 0.02 },
      { timestamp: '2026-03-03T05:00:00Z', tokensIn: 8_000, tokensOut: 4_000, requests: 18, cost: 0.03 },
      { timestamp: '2026-03-03T06:00:00Z', tokensIn: 18_000, tokensOut: 9_000, requests: 40, cost: 0.07 },
      { timestamp: '2026-03-03T07:00:00Z', tokensIn: 42_000, tokensOut: 21_000, requests: 92, cost: 0.16 },
      { timestamp: '2026-03-03T08:00:00Z', tokensIn: 75_000, tokensOut: 37_000, requests: 163, cost: 0.28 },
      { timestamp: '2026-03-03T09:00:00Z', tokensIn: 110_000, tokensOut: 55_000, requests: 240, cost: 0.41 },
      { timestamp: '2026-03-03T10:00:00Z', tokensIn: 125_000, tokensOut: 62_000, requests: 272, cost: 0.46 },
      { timestamp: '2026-03-03T11:00:00Z', tokensIn: 130_000, tokensOut: 65_000, requests: 284, cost: 0.48 },
      { timestamp: '2026-03-03T12:00:00Z', tokensIn: 95_000, tokensOut: 47_000, requests: 207, cost: 0.35 },
      { timestamp: '2026-03-03T13:00:00Z', tokensIn: 120_000, tokensOut: 60_000, requests: 262, cost: 0.44 },
      { timestamp: '2026-03-03T14:00:00Z', tokensIn: 128_000, tokensOut: 64_000, requests: 280, cost: 0.47 },
      { timestamp: '2026-03-03T15:00:00Z', tokensIn: 118_000, tokensOut: 59_000, requests: 258, cost: 0.44 },
      { timestamp: '2026-03-03T16:00:00Z', tokensIn: 100_000, tokensOut: 50_000, requests: 218, cost: 0.37 },
      { timestamp: '2026-03-03T17:00:00Z', tokensIn: 68_000, tokensOut: 34_000, requests: 148, cost: 0.25 },
      { timestamp: '2026-03-03T18:00:00Z', tokensIn: 35_000, tokensOut: 17_000, requests: 76, cost: 0.13 },
      { timestamp: '2026-03-03T19:00:00Z', tokensIn: 22_000, tokensOut: 11_000, requests: 48, cost: 0.08 },
      { timestamp: '2026-03-03T20:00:00Z', tokensIn: 16_000, tokensOut: 8_000, requests: 35, cost: 0.06 },
      { timestamp: '2026-03-03T21:00:00Z', tokensIn: 12_000, tokensOut: 6_000, requests: 26, cost: 0.04 },
      { timestamp: '2026-03-03T22:00:00Z', tokensIn: 9_000, tokensOut: 4_500, requests: 20, cost: 0.03 },
      { timestamp: '2026-03-03T23:00:00Z', tokensIn: 7_000, tokensOut: 3_500, requests: 15, cost: 0.03 },
    ],
  },
  {
    consumerId: 'consumer-batch-processor',
    consumerName: 'svc-batch-processor',
    byModel: [
      { modelId: 'model-gpt4o', modelName: 'GPT-4o', provider: 'Azure OpenAI', tokensIn: 1_200_000, tokensOut: 600_000, totalTokens: 1_800_000, requests: 3_940, cost: 4.50, avgLatencyMs: 340 },
      { modelId: 'model-gpt4o-mini', modelName: 'GPT-4o-mini', provider: 'Azure OpenAI', tokensIn: 520_000, tokensOut: 260_000, totalTokens: 780_000, requests: 1_700, cost: 1.56, avgLatencyMs: 190 },
      { modelId: 'model-llama31', modelName: 'Llama 3.1 70B', provider: 'AWS Bedrock', tokensIn: 350_000, tokensOut: 170_000, totalTokens: 520_000, requests: 1_160, cost: 1.44, avgLatencyMs: 260 },
    ],
    timeSeries24h: [
      { timestamp: '2026-03-03T00:00:00Z', tokensIn: 65_000, tokensOut: 32_000, requests: 142, cost: 0.24 },
      { timestamp: '2026-03-03T01:00:00Z', tokensIn: 70_000, tokensOut: 35_000, requests: 153, cost: 0.26 },
      { timestamp: '2026-03-03T02:00:00Z', tokensIn: 75_000, tokensOut: 37_000, requests: 164, cost: 0.28 },
      { timestamp: '2026-03-03T03:00:00Z', tokensIn: 80_000, tokensOut: 40_000, requests: 175, cost: 0.30 },
      { timestamp: '2026-03-03T04:00:00Z', tokensIn: 78_000, tokensOut: 39_000, requests: 170, cost: 0.29 },
      { timestamp: '2026-03-03T05:00:00Z', tokensIn: 72_000, tokensOut: 36_000, requests: 157, cost: 0.27 },
      { timestamp: '2026-03-03T06:00:00Z', tokensIn: 55_000, tokensOut: 27_000, requests: 120, cost: 0.20 },
      { timestamp: '2026-03-03T07:00:00Z', tokensIn: 48_000, tokensOut: 24_000, requests: 105, cost: 0.18 },
      { timestamp: '2026-03-03T08:00:00Z', tokensIn: 85_000, tokensOut: 42_000, requests: 186, cost: 0.31 },
      { timestamp: '2026-03-03T09:00:00Z', tokensIn: 120_000, tokensOut: 60_000, requests: 262, cost: 0.44 },
      { timestamp: '2026-03-03T10:00:00Z', tokensIn: 135_000, tokensOut: 67_000, requests: 295, cost: 0.50 },
      { timestamp: '2026-03-03T11:00:00Z', tokensIn: 140_000, tokensOut: 70_000, requests: 306, cost: 0.52 },
      { timestamp: '2026-03-03T12:00:00Z', tokensIn: 110_000, tokensOut: 55_000, requests: 240, cost: 0.41 },
      { timestamp: '2026-03-03T13:00:00Z', tokensIn: 130_000, tokensOut: 65_000, requests: 284, cost: 0.48 },
      { timestamp: '2026-03-03T14:00:00Z', tokensIn: 145_000, tokensOut: 72_000, requests: 317, cost: 0.54 },
      { timestamp: '2026-03-03T15:00:00Z', tokensIn: 138_000, tokensOut: 69_000, requests: 302, cost: 0.51 },
      { timestamp: '2026-03-03T16:00:00Z', tokensIn: 115_000, tokensOut: 57_000, requests: 251, cost: 0.43 },
      { timestamp: '2026-03-03T17:00:00Z', tokensIn: 90_000, tokensOut: 45_000, requests: 197, cost: 0.33 },
      { timestamp: '2026-03-03T18:00:00Z', tokensIn: 60_000, tokensOut: 30_000, requests: 131, cost: 0.22 },
      { timestamp: '2026-03-03T19:00:00Z', tokensIn: 50_000, tokensOut: 25_000, requests: 109, cost: 0.19 },
      { timestamp: '2026-03-03T20:00:00Z', tokensIn: 55_000, tokensOut: 27_000, requests: 120, cost: 0.20 },
      { timestamp: '2026-03-03T21:00:00Z', tokensIn: 62_000, tokensOut: 31_000, requests: 136, cost: 0.23 },
      { timestamp: '2026-03-03T22:00:00Z', tokensIn: 68_000, tokensOut: 34_000, requests: 148, cost: 0.25 },
      { timestamp: '2026-03-03T23:00:00Z', tokensIn: 60_000, tokensOut: 30_000, requests: 131, cost: 0.22 },
    ],
  },
];

// ---------------------------------------------------------------------------
// Model Routing Configurations
// ---------------------------------------------------------------------------

export interface ModelDeployment {
  id: string;
  region: string;
  endpoint: string;
  deploymentType: 'ptu' | 'paygo' | 'standard';
  ptuCapacity?: number;
  status: 'healthy' | 'degraded' | 'down';
  currentRPS: number;
  maxRPS: number;
  avgLatencyMs: number;
  requestsLast1h: number;
}

export interface RoutingConfig {
  modelId: string;
  modelName: string;
  strategy: 'round-robin' | 'weighted' | 'latency-based' | 'priority';
  deployments: ModelDeployment[];
  failoverChain: string[];
  ptuSpillover: boolean;
  healthCheckIntervalSec: number;
  healthCheckThreshold: number;
}

export interface FailoverEvent {
  id: string;
  timestamp: string;
  modelName: string;
  fromDeployment: string;
  toDeployment: string;
  reason: 'health-check-failure' | 'capacity-exceeded' | 'latency-threshold' | 'manual';
  recoveryTimeSec: number;
  status: 'recovered' | 'active' | 'investigating';
}

export const routingConfigs: RoutingConfig[] = [
  {
    modelId: 'model-gpt4o',
    modelName: 'GPT-4o',
    strategy: 'priority',
    deployments: [
      { id: 'deploy-gpt4o-eastus-ptu', region: 'East US', endpoint: 'https://contoso-aoai-eastus.openai.azure.com/openai/deployments/gpt-4o', deploymentType: 'ptu', ptuCapacity: 300, status: 'healthy', currentRPS: 142, maxRPS: 200, avgLatencyMs: 280, requestsLast1h: 8_520 },
      { id: 'deploy-gpt4o-westus-paygo', region: 'West US', endpoint: 'https://contoso-aoai-westus.openai.azure.com/openai/deployments/gpt-4o', deploymentType: 'paygo', status: 'healthy', currentRPS: 38, maxRPS: 100, avgLatencyMs: 350, requestsLast1h: 2_280 },
      { id: 'deploy-gpt4o-sweden-paygo', region: 'Sweden Central', endpoint: 'https://contoso-aoai-sweden.openai.azure.com/openai/deployments/gpt-4o', deploymentType: 'paygo', status: 'healthy', currentRPS: 12, maxRPS: 80, avgLatencyMs: 420, requestsLast1h: 720 },
    ],
    failoverChain: ['deploy-gpt4o-eastus-ptu', 'deploy-gpt4o-westus-paygo', 'deploy-gpt4o-sweden-paygo'],
    ptuSpillover: true,
    healthCheckIntervalSec: 30,
    healthCheckThreshold: 3,
  },
  {
    modelId: 'model-claude35',
    modelName: 'Claude 3.5 Sonnet',
    strategy: 'latency-based',
    deployments: [
      { id: 'deploy-claude35-us', region: 'US (Primary)', endpoint: 'https://api.anthropic.com/v1/messages', deploymentType: 'paygo', status: 'healthy', currentRPS: 52, maxRPS: 120, avgLatencyMs: 390, requestsLast1h: 3_120 },
      { id: 'deploy-claude35-eu', region: 'EU (Secondary)', endpoint: 'https://api-eu.anthropic.com/v1/messages', deploymentType: 'paygo', status: 'degraded', currentRPS: 18, maxRPS: 80, avgLatencyMs: 620, requestsLast1h: 1_080 },
    ],
    failoverChain: ['deploy-claude35-us', 'deploy-claude35-eu'],
    ptuSpillover: false,
    healthCheckIntervalSec: 30,
    healthCheckThreshold: 3,
  },
];

export const failoverEvents: FailoverEvent[] = [
  { id: 'fo-1', timestamp: '2026-03-03T09:12:00Z', modelName: 'GPT-4o', fromDeployment: 'deploy-gpt4o-eastus-ptu', toDeployment: 'deploy-gpt4o-westus-paygo', reason: 'capacity-exceeded', recoveryTimeSec: 0, status: 'recovered' },
  { id: 'fo-2', timestamp: '2026-03-03T11:45:00Z', modelName: 'Claude 3.5 Sonnet', fromDeployment: 'deploy-claude35-eu', toDeployment: 'deploy-claude35-us', reason: 'latency-threshold', recoveryTimeSec: 0, status: 'active' },
  { id: 'fo-3', timestamp: '2026-03-03T14:22:00Z', modelName: 'GPT-4o', fromDeployment: 'deploy-gpt4o-eastus-ptu', toDeployment: 'deploy-gpt4o-westus-paygo', reason: 'capacity-exceeded', recoveryTimeSec: 185, status: 'recovered' },
  { id: 'fo-4', timestamp: '2026-03-02T22:08:00Z', modelName: 'GPT-4o', fromDeployment: 'deploy-gpt4o-sweden-paygo', toDeployment: 'deploy-gpt4o-westus-paygo', reason: 'health-check-failure', recoveryTimeSec: 420, status: 'recovered' },
  { id: 'fo-5', timestamp: '2026-03-02T16:30:00Z', modelName: 'Claude 3.5 Sonnet', fromDeployment: 'deploy-claude35-us', toDeployment: 'deploy-claude35-eu', reason: 'health-check-failure', recoveryTimeSec: 95, status: 'recovered' },
  { id: 'fo-6', timestamp: '2026-03-01T08:00:00Z', modelName: 'GPT-4o', fromDeployment: 'deploy-gpt4o-westus-paygo', toDeployment: 'deploy-gpt4o-sweden-paygo', reason: 'manual', recoveryTimeSec: 0, status: 'recovered' },
];

// ---------------------------------------------------------------------------
// Enforcement Log
// ---------------------------------------------------------------------------

export interface EnforcementEvent {
  id: string;
  timestamp: string;
  consumerId: string;
  consumerName: string;
  action: 'throttled' | 'blocked' | 'warned' | 'quota-exceeded';
  reason: string;
  policyName: string;
  assetName: string;
  details: string;
}

export const enforcementEvents: EnforcementEvent[] = [
  { id: 'enf-1', timestamp: '2026-03-03T23:42:00Z', consumerId: 'consumer-customer-support', consumerName: 'agent-customer-support', action: 'throttled', reason: 'Token rate limit exceeded (200K TPM)', policyName: 'Token Rate Limit', assetName: 'GPT-4o', details: 'Consumer reached 200,000 tokens/min limit. 14 requests queued for 3.2s before processing resumed.' },
  { id: 'enf-2', timestamp: '2026-03-03T22:15:00Z', consumerId: 'consumer-alex', consumerName: 'dev-alex@contoso.com', action: 'blocked', reason: 'IP address not in allowlist', policyName: 'IP Allowlist', assetName: 'GPT-4o', details: 'Request from IP 203.0.113.42 blocked. Consumer authenticated but source IP not in corporate allowlist.' },
  { id: 'enf-3', timestamp: '2026-03-03T21:30:00Z', consumerId: 'consumer-batch-processor', consumerName: 'svc-batch-processor', action: 'quota-exceeded', reason: 'Daily token quota reached (30M tokens)', policyName: 'Token Rate Limit', assetName: 'GPT-4o-mini', details: 'Service principal consumed 30,000,000 tokens today. Remaining requests rejected until quota resets at midnight UTC.' },
  { id: 'enf-4', timestamp: '2026-03-03T19:55:00Z', consumerId: 'consumer-sales-intel', consumerName: 'agent-sales-intel', action: 'blocked', reason: 'Content safety violation — PII detected in prompt', policyName: 'Content Safety', assetName: 'GPT-4o', details: 'Inbound prompt contained SSN pattern (XXX-XX-XXXX). Request blocked and PII redaction warning returned to caller.' },
  { id: 'enf-5', timestamp: '2026-03-03T18:20:00Z', consumerId: 'consumer-sarah', consumerName: 'dev-sarah@contoso.com', action: 'warned', reason: 'Approaching daily token quota (80% consumed)', policyName: 'Token Rate Limit', assetName: 'GPT-4o', details: 'Consumer has used 4,000,000 of 5,000,000 daily token allowance. Warning header added to response.' },
  { id: 'enf-6', timestamp: '2026-03-03T16:10:00Z', consumerId: 'consumer-helpdesk', consumerName: 'app-helpdesk', action: 'blocked', reason: 'Jailbreak attempt detected', policyName: 'Content Safety', assetName: 'Claude 3.5 Sonnet', details: 'Prompt injection pattern detected in user input relayed through helpdesk app. Request blocked by jailbreak classifier (confidence: 0.94).' },
  { id: 'enf-7', timestamp: '2026-03-03T14:45:00Z', consumerId: 'consumer-devops-assist', consumerName: 'agent-devops-assist', action: 'throttled', reason: 'Request rate limit exceeded (100 RPM)', policyName: 'Agent Throttle', assetName: 'GPT-4o', details: 'Agent exceeded 100 requests/min concurrency limit. 8 requests returned 429 status before backoff.' },
  { id: 'enf-8', timestamp: '2026-03-03T12:30:00Z', consumerId: 'consumer-hr-onboarding', consumerName: 'agent-hr-onboarding', action: 'warned', reason: 'Groundedness check flagged low-confidence response', policyName: 'Content Safety', assetName: 'GPT-4o-mini', details: 'Model response flagged by groundedness check with confidence score 0.42. Warning metadata attached; response delivered with disclaimer.' },
  { id: 'enf-9', timestamp: '2026-03-03T10:05:00Z', consumerId: 'consumer-knowledge-index', consumerName: 'app-knowledge-index', action: 'throttled', reason: 'Token rate limit exceeded (50K TPM)', policyName: 'Token Rate Limit', assetName: 'GPT-4o-mini', details: 'Indexing batch exceeded 50,000 tokens/min quota. 22 embedding requests delayed by average 4.8s.' },
  { id: 'enf-10', timestamp: '2026-03-03T08:50:00Z', consumerId: 'consumer-mike', consumerName: 'dev-mike@contoso.com', action: 'blocked', reason: 'Unauthorized model access', policyName: 'Tool Access Control', assetName: 'Llama 3.1 70B', details: 'Consumer attempted to access Llama 3.1 70B but is not authorized for ai-research/llama models. Access denied.' },
];

// ---------------------------------------------------------------------------
// Access Requests
// ---------------------------------------------------------------------------

export interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  type: 'namespace-access' | 'model-access' | 'tool-access' | 'role-change';
  targetName: string;
  targetNamespace: string;
  requestedRole: 'AI Developer' | 'Viewer' | 'Namespace Admin';
  justification: string;
  status: 'pending' | 'approved' | 'denied';
  createdAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const accessRequests: AccessRequest[] = [
  {
    id: 'ar-1',
    requesterId: 'consumer-sarah',
    requesterName: 'Sarah Chen',
    requesterEmail: 'dev-sarah@contoso.com',
    type: 'namespace-access',
    targetName: 'fraud-detection',
    targetNamespace: 'fraud-detection',
    requestedRole: 'AI Developer',
    justification: 'Need access to fraud detection models for the new real-time scoring pipeline in the payments team.',
    status: 'pending',
    createdAt: '2026-03-03T14:30:00Z',
  },
  {
    id: 'ar-2',
    requesterId: 'consumer-alex',
    requesterName: 'Alex Rivera',
    requesterEmail: 'dev-alex@contoso.com',
    type: 'model-access',
    targetName: 'Llama 3.1 70B',
    targetNamespace: 'ai-research',
    requestedRole: 'AI Developer',
    justification: 'Evaluating open-source models for cost optimization on summarization tasks.',
    status: 'pending',
    createdAt: '2026-03-03T11:15:00Z',
  },
  {
    id: 'ar-3',
    requesterId: 'consumer-mike',
    requesterName: 'Mike Thompson',
    requesterEmail: 'dev-mike@contoso.com',
    type: 'tool-access',
    targetName: 'Salesforce CRM API',
    targetNamespace: 'customer-ops',
    requestedRole: 'AI Developer',
    justification: 'Building a lead scoring agent that needs CRM data access.',
    status: 'pending',
    createdAt: '2026-03-02T16:45:00Z',
  },
  {
    id: 'ar-4',
    requesterId: 'consumer-helpdesk',
    requesterName: 'Helpdesk App',
    requesterEmail: 'svc-helpdesk@contoso.com',
    type: 'namespace-access',
    targetName: 'customer-ops',
    targetNamespace: 'customer-ops',
    requestedRole: 'Viewer',
    justification: 'Service needs read access to customer-ops namespace for ticket classification.',
    status: 'approved',
    createdAt: '2026-03-01T09:00:00Z',
    reviewedBy: 'admin@contoso.com',
    reviewedAt: '2026-03-01T11:30:00Z',
  },
  {
    id: 'ar-5',
    requesterId: 'consumer-batch-processor',
    requesterName: 'Batch Processor',
    requesterEmail: 'svc-batch@contoso.com',
    type: 'role-change',
    targetName: 'ai-research',
    targetNamespace: 'ai-research',
    requestedRole: 'Namespace Admin',
    justification: 'Need admin role to manage model deployments in the research namespace.',
    status: 'denied',
    createdAt: '2026-02-28T13:20:00Z',
    reviewedBy: 'admin@contoso.com',
    reviewedAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 'ar-6',
    requesterId: 'consumer-sarah',
    requesterName: 'Sarah Chen',
    requesterEmail: 'dev-sarah@contoso.com',
    type: 'model-access',
    targetName: 'GPT-4o (PTU)',
    targetNamespace: 'customer-ops',
    requestedRole: 'AI Developer',
    justification: 'Need PTU deployment access for production support agent with guaranteed latency.',
    status: 'approved',
    createdAt: '2026-02-27T10:00:00Z',
    reviewedBy: 'admin@contoso.com',
    reviewedAt: '2026-02-27T14:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Audit Log
// ---------------------------------------------------------------------------

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorType: 'user' | 'service' | 'system';
  action: string;
  resource: string;
  resourceType: 'namespace' | 'model' | 'tool' | 'agent' | 'policy' | 'user' | 'credential';
  namespace: string;
  details: string;
  outcome: 'success' | 'failure' | 'denied';
}

export const auditLog: AuditEntry[] = [
  { id: 'audit-1', timestamp: '2026-03-03T23:55:00Z', actor: 'admin@contoso.com', actorType: 'user', action: 'Updated policy', resource: 'Token Rate Limit', resourceType: 'policy', namespace: 'customer-ops', details: 'Increased TPM limit from 150K to 200K for customer-ops namespace.', outcome: 'success' },
  { id: 'audit-2', timestamp: '2026-03-03T22:30:00Z', actor: 'svc-batch@contoso.com', actorType: 'service', action: 'Registered model', resource: 'Mistral Large 2', resourceType: 'model', namespace: 'ai-research', details: 'New model deployment registered via API. Provider: Mistral, Region: westeurope.', outcome: 'success' },
  { id: 'audit-3', timestamp: '2026-03-03T21:00:00Z', actor: 'dev-alex@contoso.com', actorType: 'user', action: 'Access denied', resource: 'fraud-detection', resourceType: 'namespace', namespace: 'fraud-detection', details: 'User attempted to list assets in fraud-detection namespace without membership.', outcome: 'denied' },
  { id: 'audit-4', timestamp: '2026-03-03T19:15:00Z', actor: 'system', actorType: 'system', action: 'Credential rotated', resource: 'retail-salesforce-prod', resourceType: 'credential', namespace: 'customer-ops', details: 'Managed identity credential automatically rotated. Previous credential revoked.', outcome: 'success' },
  { id: 'audit-5', timestamp: '2026-03-03T17:40:00Z', actor: 'admin@contoso.com', actorType: 'user', action: 'Created namespace', resource: 'payments-ai', resourceType: 'namespace', namespace: 'payments-ai', details: 'New managed namespace created for payments team. Inherited org-level safety policies.', outcome: 'success' },
  { id: 'audit-6', timestamp: '2026-03-03T16:20:00Z', actor: 'admin@contoso.com', actorType: 'user', action: 'Approved access', resource: 'dev-sarah@contoso.com', resourceType: 'user', namespace: 'customer-ops', details: 'Approved Sarah Chen\'s request for AI Developer role in customer-ops namespace.', outcome: 'success' },
  { id: 'audit-7', timestamp: '2026-03-03T14:00:00Z', actor: 'dev-mike@contoso.com', actorType: 'user', action: 'Deployed agent', resource: 'support-agent-v2', resourceType: 'agent', namespace: 'customer-ops', details: 'Agent deployed to production environment. 3 tools attached, content safety enabled.', outcome: 'success' },
  { id: 'audit-8', timestamp: '2026-03-03T11:30:00Z', actor: 'system', actorType: 'system', action: 'Quota enforced', resource: 'svc-batch-processor', resourceType: 'user', namespace: 'ai-research', details: 'Daily token quota exceeded (30M). All requests blocked until midnight UTC reset.', outcome: 'success' },
  { id: 'audit-9', timestamp: '2026-03-03T09:00:00Z', actor: 'dev-sarah@contoso.com', actorType: 'user', action: 'Registered tool', resource: 'Stripe Payments API', resourceType: 'tool', namespace: 'customer-ops', details: 'New API tool registered. Authentication: OAuth 2.0, Rate limit: 100 RPM.', outcome: 'success' },
  { id: 'audit-10', timestamp: '2026-03-03T07:30:00Z', actor: 'admin@contoso.com', actorType: 'user', action: 'Enabled guardrail', resource: 'PII Detection', resourceType: 'policy', namespace: 'global', details: 'PII detection guardrail enabled at org level. Applies to all namespaces.', outcome: 'success' },
];

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------

export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'prompt-chain' | 'workflow' | 'automation' | 'analysis';
  toolIds: string[];
  modelIds: string[];
  tags: string[];
  ownerTeam: string;
  visibility: 'public' | 'private' | 'team';
  status: 'active' | 'draft' | 'deprecated';
  invocationsToday: number;
  steps: { order: number; type: 'model' | 'tool' | 'logic'; label: string }[];
  createdAt: string;
}

export const skills: Skill[] = [
  {
    id: 'skill-intent-analysis',
    name: 'Customer Intent Analysis',
    description: 'Analyzes customer messages to extract entities and classify intent for routing and response generation.',
    type: 'prompt-chain',
    toolIds: ['tool-crm'],
    modelIds: ['model-gpt4o'],
    tags: ['nlp', 'intent', 'customer-support'],
    ownerTeam: 'Support Team',
    visibility: 'public',
    status: 'active',
    invocationsToday: 3_420,
    steps: [
      { order: 1, type: 'model', label: 'Analyze prompt' },
      { order: 2, type: 'model', label: 'Extract entities' },
      { order: 3, type: 'logic', label: 'Classify intent' },
      { order: 4, type: 'model', label: 'Generate response' },
    ],
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'skill-doc-summarization',
    name: 'Document Summarization',
    description: 'Multi-step prompt chain that chunks long documents, summarizes each chunk, and merges into a final summary.',
    type: 'prompt-chain',
    toolIds: [],
    modelIds: ['model-gpt4o'],
    tags: ['summarization', 'documents', 'nlp'],
    ownerTeam: 'Platform Team',
    visibility: 'public',
    status: 'active',
    invocationsToday: 2_750,
    steps: [
      { order: 1, type: 'logic', label: 'Chunk document' },
      { order: 2, type: 'model', label: 'Summarize chunks' },
      { order: 3, type: 'model', label: 'Merge summaries' },
    ],
    createdAt: '2026-02-22T10:00:00Z',
  },
  {
    id: 'skill-incident-triage',
    name: 'Incident Triage',
    description: 'Parses incoming alerts, checks historical incident data, assesses severity, and creates tickets with team notifications.',
    type: 'workflow',
    toolIds: ['tool-jira', 'tool-slack'],
    modelIds: ['model-gpt4o'],
    tags: ['incident', 'triage', 'devops'],
    ownerTeam: 'DevOps',
    visibility: 'team',
    status: 'active',
    invocationsToday: 450,
    steps: [
      { order: 1, type: 'model', label: 'Parse alert' },
      { order: 2, type: 'tool', label: 'Check history' },
      { order: 3, type: 'model', label: 'Assess severity' },
      { order: 4, type: 'tool', label: 'Create ticket' },
      { order: 5, type: 'tool', label: 'Notify team' },
    ],
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'skill-travel-planning',
    name: 'Travel Planning',
    description: 'End-to-end travel planning workflow that searches flights, checks weather, and generates detailed itineraries.',
    type: 'workflow',
    toolIds: ['tool-weather'],
    modelIds: ['model-gpt4o'],
    tags: ['travel', 'planning', 'workflow'],
    ownerTeam: 'Platform Integrations',
    visibility: 'public',
    status: 'active',
    invocationsToday: 680,
    steps: [
      { order: 1, type: 'model', label: 'Parse request' },
      { order: 2, type: 'tool', label: 'Search flights' },
      { order: 3, type: 'tool', label: 'Check weather' },
      { order: 4, type: 'model', label: 'Generate itinerary' },
    ],
    createdAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'skill-code-review',
    name: 'Code Review Assistant',
    description: 'Fetches pull request diffs, analyzes code patterns, generates review feedback, and posts comments to GitHub.',
    type: 'prompt-chain',
    toolIds: ['tool-github'],
    modelIds: ['model-gpt4o'],
    tags: ['code-review', 'github', 'engineering'],
    ownerTeam: 'DevOps',
    visibility: 'team',
    status: 'active',
    invocationsToday: 1_890,
    steps: [
      { order: 1, type: 'tool', label: 'Fetch diff' },
      { order: 2, type: 'model', label: 'Analyze patterns' },
      { order: 3, type: 'model', label: 'Generate review' },
      { order: 4, type: 'tool', label: 'Post comments' },
    ],
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'skill-financial-report',
    name: 'Financial Report Generator',
    description: 'Fetches financial data from SAP and billing systems, aggregates metrics, and generates formatted analysis reports.',
    type: 'analysis',
    toolIds: ['tool-billing'],
    modelIds: ['model-gpt4o'],
    tags: ['finance', 'reporting', 'analysis'],
    ownerTeam: 'Finance Engineering',
    visibility: 'team',
    status: 'active',
    invocationsToday: 320,
    steps: [
      { order: 1, type: 'tool', label: 'Fetch data' },
      { order: 2, type: 'logic', label: 'Aggregate metrics' },
      { order: 3, type: 'model', label: 'Generate analysis' },
      { order: 4, type: 'logic', label: 'Format report' },
    ],
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'skill-hr-onboarding',
    name: 'HR Onboarding Automation',
    description: 'Automates new hire onboarding by creating accounts, sending welcome emails, scheduling training, and assigning buddies.',
    type: 'automation',
    toolIds: ['tool-kb', 'tool-slack'],
    modelIds: ['model-gpt4o'],
    tags: ['hr', 'onboarding', 'automation'],
    ownerTeam: 'HR Team',
    visibility: 'team',
    status: 'active',
    invocationsToday: 140,
    steps: [
      { order: 1, type: 'tool', label: 'Create accounts' },
      { order: 2, type: 'tool', label: 'Send welcome' },
      { order: 3, type: 'tool', label: 'Schedule training' },
      { order: 4, type: 'logic', label: 'Assign buddy' },
    ],
    createdAt: '2026-03-02T10:00:00Z',
  },
  {
    id: 'skill-lead-scoring',
    name: 'Sales Lead Scoring',
    description: 'Fetches lead data from CRM, analyzes engagement patterns, scores leads, and updates CRM records.',
    type: 'analysis',
    toolIds: ['tool-crm'],
    modelIds: ['model-gpt4o'],
    tags: ['sales', 'lead-scoring', 'analytics'],
    ownerTeam: 'Sales Ops',
    visibility: 'team',
    status: 'active',
    invocationsToday: 560,
    steps: [
      { order: 1, type: 'tool', label: 'Fetch lead data' },
      { order: 2, type: 'model', label: 'Analyze engagement' },
      { order: 3, type: 'model', label: 'Score lead' },
      { order: 4, type: 'tool', label: 'Update CRM' },
    ],
    createdAt: '2026-03-01T10:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// Workloads
// ---------------------------------------------------------------------------

export interface Workload {
  id: string;
  name: string;
  description: string;
  namespace: string;
  environment: 'sandbox' | 'staging' | 'production';
  status: 'running' | 'stopped' | 'deploying' | 'error';
  agentIds: string[];
  toolIds: string[];
  skillIds: string[];
  policyIds: string[];
  routingConfig?: string;
  tokensBudgetDaily: number;
  tokensUsedToday: number;
  requestsToday: number;
  lastDeployed: string;
  createdAt: string;
}

export const workloads: Workload[] = [
  {
    id: 'workload-customer-support',
    name: 'Customer Support Platform',
    description: 'Production workload powering customer support agents with CRM, billing integrations, and intent analysis.',
    namespace: 'customer-ops',
    environment: 'production',
    status: 'running',
    agentIds: ['agent-support'],
    toolIds: ['tool-crm', 'tool-billing'],
    skillIds: ['skill-intent-analysis'],
    policyIds: ['policy-token-limit', 'policy-content-safety'],
    routingConfig: 'round-robin',
    tokensBudgetDaily: 500_000,
    tokensUsedToday: 347_200,
    requestsToday: 8_920,
    lastDeployed: '2026-03-02T14:30:00Z',
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'workload-devops',
    name: 'DevOps Automation Suite',
    description: 'Production workload for engineering automation including incident triage, code review, and deployment workflows.',
    namespace: 'engineering',
    environment: 'production',
    status: 'running',
    agentIds: ['agent-devops'],
    toolIds: ['tool-github', 'tool-jira'],
    skillIds: ['skill-incident-triage', 'skill-code-review'],
    policyIds: ['policy-tool-acl', 'policy-ip-allowlist'],
    routingConfig: 'priority',
    tokensBudgetDaily: 200_000,
    tokensUsedToday: 124_800,
    requestsToday: 3_150,
    lastDeployed: '2026-03-01T09:00:00Z',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'workload-sales-intel',
    name: 'Sales Intelligence',
    description: 'Staging workload for sales lead scoring and competitive intelligence with CRM integration.',
    namespace: 'sales',
    environment: 'staging',
    status: 'running',
    agentIds: ['agent-sales'],
    toolIds: ['tool-crm'],
    skillIds: ['skill-lead-scoring'],
    policyIds: ['policy-agent-throttle'],
    tokensBudgetDaily: 100_000,
    tokensUsedToday: 62_400,
    requestsToday: 2_410,
    lastDeployed: '2026-03-03T11:00:00Z',
    createdAt: '2026-02-25T10:00:00Z',
  },
  {
    id: 'workload-hr-ops',
    name: 'HR Operations',
    description: 'Production workload for HR onboarding automation with knowledge base and communication integrations.',
    namespace: 'hr',
    environment: 'production',
    status: 'running',
    agentIds: ['agent-hr'],
    toolIds: ['tool-kb', 'tool-slack'],
    skillIds: ['skill-hr-onboarding'],
    policyIds: ['policy-content-safety'],
    tokensBudgetDaily: 50_000,
    tokensUsedToday: 18_600,
    requestsToday: 780,
    lastDeployed: '2026-03-01T16:00:00Z',
    createdAt: '2026-02-28T10:00:00Z',
  },
  {
    id: 'workload-financial-analytics',
    name: 'Financial Analytics',
    description: 'Sandbox workload for financial report generation and data analysis, currently being deployed.',
    namespace: 'finance',
    environment: 'sandbox',
    status: 'deploying',
    agentIds: [],
    toolIds: ['tool-billing'],
    skillIds: ['skill-financial-report'],
    policyIds: ['policy-schema-validation'],
    tokensBudgetDaily: 150_000,
    tokensUsedToday: 0,
    requestsToday: 0,
    lastDeployed: '2026-03-03T15:00:00Z',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'workload-knowledge-bot',
    name: 'Internal Knowledge Bot',
    description: 'Sandbox workload for an internal knowledge assistant, currently stopped for maintenance.',
    namespace: 'knowledge',
    environment: 'sandbox',
    status: 'stopped',
    agentIds: [],
    toolIds: ['tool-kb'],
    skillIds: [],
    policyIds: [],
    tokensBudgetDaily: 75_000,
    tokensUsedToday: 0,
    requestsToday: 0,
    lastDeployed: '2026-02-28T12:00:00Z',
    createdAt: '2026-02-25T10:00:00Z',
  },
];
