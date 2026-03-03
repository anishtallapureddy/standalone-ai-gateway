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

export type AssetType = 'model' | 'tool' | 'mcp-server' | 'skill' | 'agent';

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
];

// --- Namespaces ---

export interface Namespace {
  id: string;
  name: string;
  displayName: string;
  description: string;
  owner: string;
  assetCount: { models: number; tools: number; mcpServers: number; agents: number; skills: number };
  totalAssets: number;
  policies: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export const namespaces: Namespace[] = [
  { id: 'ns-1', name: 'ai-platform', displayName: 'AI Platform', description: 'Core AI models and infrastructure shared across the organization', owner: 'Platform Team', assetCount: { models: 4, tools: 0, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 4, policies: ['Token Rate Limit', 'Content Safety'], status: 'active', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'ns-2', name: 'customer-ops', displayName: 'Customer Operations', description: 'Customer-facing tools, agents, and workflows for support and success teams', owner: 'Support Team', assetCount: { models: 0, tools: 1, mcpServers: 1, agents: 1, skills: 1 }, totalAssets: 4, policies: ['Tool Access Control', 'Content Safety', 'Agent Throttle'], status: 'active', createdAt: '2026-01-15T10:00:00Z' },
  { id: 'ns-3', name: 'engineering', displayName: 'Engineering', description: 'Developer tools, DevOps automation, and CI/CD integrations', owner: 'DevOps', assetCount: { models: 0, tools: 2, mcpServers: 1, agents: 1, skills: 1 }, totalAssets: 5, policies: ['Tool Access Control', 'IP Allowlist'], status: 'active', createdAt: '2026-01-20T10:00:00Z' },
  { id: 'ns-4', name: 'finance', displayName: 'Finance', description: 'Billing, payments, and financial reporting tools', owner: 'Finance Engineering', assetCount: { models: 0, tools: 2, mcpServers: 0, agents: 0, skills: 1 }, totalAssets: 3, policies: ['Tool Access Control', 'Schema Validation', 'IP Allowlist'], status: 'active', createdAt: '2026-01-25T10:00:00Z' },
  { id: 'ns-5', name: 'ai-research', displayName: 'AI Research', description: 'Experimental models and research workloads', owner: 'Research Team', assetCount: { models: 2, tools: 0, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 2, policies: ['Token Rate Limit'], status: 'active', createdAt: '2026-02-01T10:00:00Z' },
  { id: 'ns-6', name: 'sales', displayName: 'Sales', description: 'Sales intelligence, lead scoring, and CRM analytics', owner: 'Sales Ops', assetCount: { models: 0, tools: 0, mcpServers: 0, agents: 1, skills: 0 }, totalAssets: 1, policies: ['Agent Throttle'], status: 'active', createdAt: '2026-02-05T10:00:00Z' },
  { id: 'ns-7', name: 'hr', displayName: 'Human Resources', description: 'Employee onboarding, self-service, and HR workflows', owner: 'HR Team', assetCount: { models: 0, tools: 0, mcpServers: 0, agents: 1, skills: 0 }, totalAssets: 1, policies: ['Content Safety'], status: 'active', createdAt: '2026-02-10T10:00:00Z' },
  { id: 'ns-8', name: 'communications', displayName: 'Communications', description: 'Messaging and notification integrations', owner: 'DevOps', assetCount: { models: 0, tools: 1, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 1, policies: [], status: 'active', createdAt: '2026-02-15T10:00:00Z' },
  { id: 'ns-9', name: 'external-data', displayName: 'External Data', description: 'Third-party data sources and external API integrations', owner: 'Data Team', assetCount: { models: 0, tools: 1, mcpServers: 0, agents: 0, skills: 0 }, totalAssets: 1, policies: ['Schema Validation'], status: 'active', createdAt: '2026-02-18T10:00:00Z' },
  { id: 'ns-10', name: 'knowledge', displayName: 'Knowledge', description: 'Enterprise knowledge management and search services', owner: 'IT Team', assetCount: { models: 0, tools: 1, mcpServers: 1, agents: 0, skills: 0 }, totalAssets: 2, policies: [], status: 'active', createdAt: '2026-02-20T10:00:00Z' },
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
