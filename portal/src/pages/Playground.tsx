import React, { useState, useRef, useCallback } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Button,
  Textarea,
  Dropdown,
  Option,
  Badge,
  Spinner,
  Slider,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  Send24Regular,
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Bot24Regular,
  Play24Regular,
} from '@fluentui/react-icons';
import { models, tools, agents } from '../data/mockData';

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    height: 'calc(100vh - 140px)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    flex: 1,
    minHeight: 0,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    minHeight: 0,
  },
  card: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
  },
  configRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-end',
  },
  configItem: {
    flex: 1,
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontSize: '12px',
    fontWeight: 600,
    color: tokens.colorNeutralForeground3,
  },
  responseArea: {
    flex: 1,
    padding: '16px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    lineHeight: 1.6,
    overflow: 'auto',
    whiteSpace: 'pre-wrap',
    minHeight: '200px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: tokens.colorNeutralForeground3,
    gap: '8px',
  },
  statsRow: {
    display: 'flex',
    gap: '16px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  promptTemplates: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  infoBlock: {
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  policyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  traceStep: {
    display: 'flex',
    gap: '10px',
    padding: '8px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    alignItems: 'flex-start',
  },
});

// ---------------------------------------------------------------------------
// Model tab data
// ---------------------------------------------------------------------------
const samplePrompts = [
  { label: 'Summarize', prompt: 'Summarize the key benefits of using an AI Gateway for enterprise applications in 3 bullet points.' },
  { label: 'Code Gen', prompt: 'Write a TypeScript function that validates an MCP tool schema against a JSON Schema definition.' },
  { label: 'Analysis', prompt: 'Analyze the trade-offs between semantic caching and real-time model responses for a customer support chatbot.' },
  { label: 'Translation', prompt: 'Translate the following to Spanish: "The AI Gateway provides unified access to models, tools, and agents across all providers."' },
];

const mockResponses: Record<string, string> = {
  'Summarize': '**Key Benefits of an AI Gateway:**\n\n• **Unified Access** — Single API endpoint for 1000+ models across Azure OpenAI, Anthropic, Google Vertex AI, and AWS Bedrock, eliminating provider-specific integrations.\n\n• **Enterprise Governance** — Centralized policy enforcement including token quotas, rate limiting, content safety guardrails, and role-based access control across all AI assets.\n\n• **Operational Resilience** — Automatic cross-provider failover, semantic caching, and real-time observability (logs, traces, metrics) ensuring high availability and cost optimization.',
  'Code Gen': '```typescript\nimport Ajv from \'ajv\';\n\ninterface MCPToolSchema {\n  name: string;\n  description: string;\n  inputSchema: Record<string, unknown>;\n}\n\nfunction validateMCPToolSchema(tool: MCPToolSchema): {\n  valid: boolean;\n  errors: string[];\n} {\n  const ajv = new Ajv({ allErrors: true });\n  \n  // Validate the input schema is a valid JSON Schema\n  const isValid = ajv.validateSchema(tool.inputSchema);\n  \n  const errors: string[] = [];\n  if (!tool.name || tool.name.trim() === \'\') {\n    errors.push(\'Tool name is required\');\n  }\n  if (!tool.description || tool.description.length < 10) {\n    errors.push(\'Description must be at least 10 characters\');\n  }\n  if (!isValid) {\n    errors.push(...(ajv.errors?.map(e => e.message || \'Schema error\') || []));\n  }\n  \n  return { valid: errors.length === 0, errors };\n}\n```',
  'Analysis': '## Semantic Caching vs Real-Time Responses\n\n**Semantic Caching Pros:**\n- 60-80% cost reduction on repetitive queries\n- Sub-100ms response times for cached prompts\n- Reduced load on model endpoints\n\n**Semantic Caching Cons:**\n- May return slightly stale responses\n- Similarity threshold tuning required\n- Not suitable for context-dependent conversations\n\n**Recommendation for Customer Support:**\nUse a hybrid approach — cache FAQ-style queries and common troubleshooting steps, but route novel or sensitive customer interactions directly to the model. Configure cache TTL of 1-4 hours with a similarity threshold of 0.92+.',
  'Translation': '\"El AI Gateway proporciona acceso unificado a modelos, herramientas y agentes en todos los proveedores.\"',
};

// ---------------------------------------------------------------------------
// Tool tab data
// ---------------------------------------------------------------------------
const toolOperations: Record<string, string[]> = {
  'Customer CRM API': ['lookupCustomer', 'getAccountHistory', 'updateContact', 'searchAccounts'],
  'Billing Service': ['getInvoice', 'getSubscription', 'listPayments', 'checkBalance'],
  'Slack Connector': ['sendMessage', 'getChannels', 'getConversationHistory', 'createChannel'],
  'GitHub Issues API': ['createIssue', 'listIssues', 'getPullRequest', 'addComment'],
  'Jira Service Desk': ['createTicket', 'transitionIssue', 'getBacklog', 'assignTicket'],
  'Internal Knowledge Base': ['searchArticles', 'getArticle', 'listCategories', 'getSuggestions'],
  'Weather API': ['getCurrentWeather', 'getForecast', 'getAlerts'],
  'Payment Gateway': ['processPayment', 'issueRefund', 'getTransaction', 'listMethods'],
};

const toolMockResponses: Record<string, Record<string, unknown>> = {
  'Customer CRM API': {
    status: 'success',
    data: {
      customerId: 'CUST-12345',
      name: 'Acme Corporation',
      tier: 'Enterprise',
      accountManager: 'Sarah Chen',
      contractExpiry: '2027-03-15',
      totalSpend: 284500,
      openTickets: 3,
      healthScore: 92,
    },
  },
  'Billing Service': {
    status: 'success',
    data: {
      invoiceId: 'INV-2026-0847',
      customerId: 'CUST-12345',
      amount: 12750.00,
      currency: 'USD',
      status: 'paid',
      dueDate: '2026-04-01',
      lineItems: [
        { description: 'Enterprise AI Gateway — Monthly', amount: 9500.00 },
        { description: 'Additional token usage (2.1M)', amount: 3250.00 },
      ],
    },
  },
  'Slack Connector': {
    status: 'success',
    data: {
      messageId: 'msg-9f8e7d6c',
      channel: '#platform-alerts',
      text: 'Deployment v2.4.1 completed successfully',
      timestamp: '2026-04-08T14:32:00Z',
      delivered: true,
    },
  },
  'GitHub Issues API': {
    status: 'success',
    data: {
      issueNumber: 1842,
      title: 'Fix token rate limiter edge case on burst traffic',
      state: 'open',
      labels: ['bug', 'priority:high'],
      assignee: 'devops-bot',
      createdAt: '2026-04-07T09:15:00Z',
      commentsCount: 5,
    },
  },
  'Jira Service Desk': {
    status: 'success',
    data: {
      ticketKey: 'PLAT-3291',
      summary: 'Investigate elevated p99 latency on CRM endpoint',
      status: 'In Progress',
      priority: 'High',
      assignee: 'Mike Torres',
      sprint: 'Sprint 24',
    },
  },
  'Internal Knowledge Base': {
    status: 'success',
    data: {
      results: [
        { id: 'KB-1024', title: 'AI Gateway — Getting Started Guide', relevance: 0.97 },
        { id: 'KB-1031', title: 'Configuring Token Rate Limits', relevance: 0.89 },
        { id: 'KB-1048', title: 'MCP Server Troubleshooting', relevance: 0.84 },
      ],
      totalResults: 3,
      queryTime: '42ms',
    },
  },
  'Weather API': {
    status: 'success',
    data: {
      location: 'Seattle, WA',
      temperature: 58,
      unit: 'F',
      condition: 'Partly Cloudy',
      humidity: 72,
      windSpeed: '8 mph',
    },
  },
  'Payment Gateway': {
    status: 'success',
    data: {
      transactionId: 'TXN-20260408-7721',
      amount: 12750.00,
      currency: 'USD',
      status: 'completed',
      method: 'ACH Transfer',
      processedAt: '2026-04-08T10:00:12Z',
    },
  },
};

// ---------------------------------------------------------------------------
// Agent tab data
// ---------------------------------------------------------------------------
interface TraceStep {
  icon: string;
  label: string;
  detail: string;
  color: string;
}

const agentTraces: Record<string, { steps: TraceStep[]; finalResponse: string }> = {
  'agent-support': {
    steps: [
      { icon: '🔄', label: 'Analyzing task...', detail: 'Parsing customer request', color: '#999' },
      { icon: '🧠', label: 'Calling GPT-4o for task planning...', detail: 'Determining required tools', color: '#6366f1' },
      { icon: '🔧', label: 'Invoking CRM API — lookupCustomer...', detail: 'Fetching account details for CUST-12345', color: '#0ea5e9' },
      { icon: '🔧', label: 'Invoking Billing Service — getInvoice...', detail: 'Retrieving latest invoice INV-2026-0847', color: '#0ea5e9' },
      { icon: '🧠', label: 'Calling GPT-4o for response synthesis...', detail: 'Composing customer-friendly summary', color: '#6366f1' },
      { icon: '✅', label: 'Task complete', detail: 'Response ready', color: '#10b981' },
    ],
    finalResponse: 'Customer CUST-12345 (Acme Corporation) is an Enterprise-tier account managed by Sarah Chen. Their health score is 92/100 with 3 open tickets. The latest invoice INV-2026-0847 for $12,750.00 (paid) covers the monthly AI Gateway subscription ($9,500) and additional token usage ($3,250). No outstanding issues detected.',
  },
  'agent-devops': {
    steps: [
      { icon: '🔄', label: 'Analyzing task...', detail: 'Parsing engineering request', color: '#999' },
      { icon: '🧠', label: 'Calling Claude 3.5 Sonnet for task planning...', detail: 'Planning triage workflow', color: '#6366f1' },
      { icon: '🔧', label: 'Invoking GitHub Issues API — listIssues...', detail: 'Fetching open issues with priority:high', color: '#0ea5e9' },
      { icon: '🔧', label: 'Invoking Jira Service Desk — getBacklog...', detail: 'Querying Sprint 24 backlog', color: '#0ea5e9' },
      { icon: '🧠', label: 'Calling Claude 3.5 Sonnet for analysis...', detail: 'Correlating issues across systems', color: '#6366f1' },
      { icon: '✅', label: 'Task complete', detail: 'Triage report ready', color: '#10b981' },
    ],
    finalResponse: 'Triage Summary:\n• GitHub: 4 open high-priority issues, including #1842 (token rate limiter edge case) needing immediate attention.\n• Jira: PLAT-3291 is in progress — elevated p99 latency on CRM endpoint correlates with GitHub #1842.\n• Recommendation: Link PLAT-3291 to GitHub #1842 and escalate to on-call engineer. Sprint 24 has 6 remaining story points of capacity.',
  },
  'agent-sales': {
    steps: [
      { icon: '🔄', label: 'Analyzing task...', detail: 'Parsing sales request', color: '#999' },
      { icon: '🧠', label: 'Calling GPT-4o-mini for task planning...', detail: 'Identifying data requirements', color: '#6366f1' },
      { icon: '🔧', label: 'Invoking CRM API — lookupCustomer...', detail: 'Pulling account insights', color: '#0ea5e9' },
      { icon: '🔧', label: 'Invoking CRM API — getAccountHistory...', detail: 'Fetching engagement timeline', color: '#0ea5e9' },
      { icon: '🧠', label: 'Calling GPT-4o-mini for scoring...', detail: 'Computing deal score and recommendations', color: '#6366f1' },
      { icon: '✅', label: 'Task complete', detail: 'Report generated', color: '#10b981' },
    ],
    finalResponse: 'Account Intelligence — Acme Corporation:\n• Deal Score: 87/100 (High potential)\n• Contract renewal in 11 months — recommend starting renewal conversation in Q3.\n• Usage trend: +34% token consumption MoM, suggesting expansion opportunity.\n• Suggested upsell: Premium SLA add-on ($2,400/mo) based on their uptime requirements.',
  },
  'agent-hr': {
    steps: [
      { icon: '🔄', label: 'Analyzing task...', detail: 'Parsing HR request', color: '#999' },
      { icon: '🧠', label: 'Calling Gemini 1.5 Pro for task planning...', detail: 'Mapping onboarding steps', color: '#6366f1' },
      { icon: '🔧', label: 'Invoking Knowledge Base — searchArticles...', detail: 'Finding onboarding guides and policies', color: '#0ea5e9' },
      { icon: '🔧', label: 'Invoking Knowledge Base — getArticle...', detail: 'Retrieving KB-1024: Getting Started Guide', color: '#0ea5e9' },
      { icon: '🧠', label: 'Calling Gemini 1.5 Pro for personalization...', detail: 'Tailoring onboarding checklist', color: '#6366f1' },
      { icon: '✅', label: 'Task complete', detail: 'Onboarding plan ready', color: '#10b981' },
    ],
    finalResponse: 'New Hire Onboarding Checklist:\n1. ✅ Complete IT access request (KB-1024) — submit via ServiceNow portal\n2. ✅ Review company policies handbook (KB-1031)\n3. ✅ Set up development environment — follow AI Gateway Getting Started Guide\n4. ✅ Schedule 1:1 with team lead within first 3 days\n5. ✅ Complete security awareness training by end of Week 1\n\nAll relevant knowledge base articles have been compiled and shared via email.',
  },
};

const agentQuickTasks = [
  { label: 'Lookup customer', task: 'Look up customer CUST-12345 and provide a summary of their account status, recent billing, and any open support tickets.' },
  { label: 'Triage issue', task: 'Triage the current high-priority issues across GitHub and Jira and provide a summary with recommendations.' },
  { label: 'Generate report', task: 'Generate a sales intelligence report for our top enterprise account with deal scoring and upsell recommendations.' },
  { label: 'Onboard employee', task: 'Create a personalized onboarding checklist for a new engineer joining the platform team.' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Playground: React.FC = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<string>('models');

  // --- Model state ---
  const [selectedModel, setSelectedModel] = useState<string>('model-gpt4o');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [lastStats, setLastStats] = useState<{ latency: number; tokensIn: number; tokensOut: number } | null>(null);

  // --- Tool state ---
  const [selectedTool, setSelectedTool] = useState<string>('tool-crm');
  const [selectedOp, setSelectedOp] = useState<string>('');
  const [toolInput, setToolInput] = useState<string>('{\n  "customerId": "CUST-12345",\n  "includeHistory": true\n}');
  const [toolResponse, setToolResponse] = useState<string>('');
  const [toolLoading, setToolLoading] = useState(false);
  const [toolStats, setToolStats] = useState<{ latency: number; statusCode: number; size: number } | null>(null);

  // --- Agent state ---
  const [selectedAgent, setSelectedAgent] = useState<string>('agent-support');
  const [agentTask, setAgentTask] = useState<string>('');
  const [agentSteps, setAgentSteps] = useState<TraceStep[]>([]);
  const [agentFinal, setAgentFinal] = useState<string>('');
  const [agentLoading, setAgentLoading] = useState(false);
  const [agentStats, setAgentStats] = useState<{ latency: number; modelCalls: number; toolCalls: number; tokens: number } | null>(null);
  const agentAbort = useRef(false);

  const activeModels = models.filter(m => m.status === 'active');
  const selectedModelData = models.find(m => m.id === selectedModel);
  const activeTools = tools.filter(t => t.status === 'active');
  const selectedToolData = tools.find(t => t.id === selectedTool);
  const activeAgents = agents.filter(a => a.status === 'active');
  const selectedAgentData = agents.find(a => a.id === selectedAgent);

  // Resolve names
  const resolveModelNames = (ids: string[]) => ids.map(id => models.find(m => m.id === id)?.name || id);
  const resolveToolNames = (ids: string[]) => ids.map(id => tools.find(t => t.id === id)?.name || id);

  // ---- Handlers ----
  const handleSend = (): void => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse('');
    setLastStats(null);

    const matchedTemplate = samplePrompts.find(sp => prompt.includes(sp.prompt));
    const delay = 800 + Math.random() * 2000;

    setTimeout(() => {
      const mockResp = matchedTemplate
        ? mockResponses[matchedTemplate.label]
        : `I understand your request. Here's my analysis:\n\n${prompt.split(' ').slice(0, 5).join(' ')}...\n\nThis is a simulated response from ${selectedModelData?.name || 'the model'}. In production, this would be routed through the AI Gateway to your selected model provider with full governance, observability, and failover capabilities applied.\n\n**Gateway Features Applied:**\n- ✅ Token quota check (within limits)\n- ✅ Rate limit check (passed)\n- ✅ Content safety scan (clean)\n- ✅ Request logged with OpenTelemetry`;

      setResponse(mockResp || 'Response generated.');
      setLastStats({
        latency: Math.round(delay),
        tokensIn: prompt.split(' ').length * 3,
        tokensOut: (mockResp || '').split(' ').length * 2,
      });
      setIsLoading(false);
    }, delay);
  };

  const handleInvokeTool = (): void => {
    setToolLoading(true);
    setToolResponse('');
    setToolStats(null);

    const delay = 300 + Math.random() * 500;
    setTimeout(() => {
      const name = selectedToolData?.name || '';
      const resp = toolMockResponses[name] || { status: 'success', data: {} };
      const json = JSON.stringify(resp, null, 2);
      setToolResponse(json);
      setToolStats({
        latency: Math.round(delay),
        statusCode: 200,
        size: new Blob([json]).size,
      });
      setToolLoading(false);
    }, delay);
  };

  const handleRunAgent = useCallback((): void => {
    if (!agentTask.trim()) return;
    agentAbort.current = false;
    setAgentLoading(true);
    setAgentSteps([]);
    setAgentFinal('');
    setAgentStats(null);

    const trace = agentTraces[selectedAgent] || agentTraces['agent-support'];
    const startTime = Date.now();
    let modelCalls = 0;
    let toolCalls = 0;

    trace.steps.forEach((step, i) => {
      setTimeout(() => {
        if (agentAbort.current) return;
        setAgentSteps(prev => [...prev, step]);
        if (step.icon === '🧠') modelCalls++;
        if (step.icon === '🔧') toolCalls++;

        // Last step
        if (i === trace.steps.length - 1) {
          setTimeout(() => {
            if (agentAbort.current) return;
            setAgentFinal(trace.finalResponse);
            setAgentStats({
              latency: Date.now() - startTime,
              modelCalls,
              toolCalls,
              tokens: 1800 + Math.floor(Math.random() * 1200),
            });
            setAgentLoading(false);
          }, 400);
        }
      }, (i + 1) * 600);
    });
  }, [agentTask, selectedAgent]);

  // Update tool operation when tool changes
  const handleToolChange = (toolId: string) => {
    setSelectedTool(toolId);
    setToolResponse('');
    setToolStats(null);
    const t = tools.find(t2 => t2.id === toolId);
    const ops = t ? toolOperations[t.name] || [] : [];
    setSelectedOp(ops[0] || '');
  };

  const currentToolOps = selectedToolData ? toolOperations[selectedToolData.name] || [] : [];

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Text size={500} weight="semibold">Playground</Text>
          <br />
          <Text size={200} style={{ color: '#999' }}>Experiment with models, tools, and agents through the gateway</Text>
        </div>
        <TabList selectedValue={activeTab} onTabSelect={(_, d) => setActiveTab(d.value as string)}>
          <Tab value="models" icon={<BrainCircuit24Regular />}>Models</Tab>
          <Tab value="tools" icon={<PlugConnected24Regular />}>Tools</Tab>
          <Tab value="agents" icon={<Bot24Regular />}>Agents</Tab>
        </TabList>
      </div>

      {/* ================================================================ */}
      {/* TAB 1 — Models                                                   */}
      {/* ================================================================ */}
      {activeTab === 'models' && (
        <div className={styles.container}>
          <div className={styles.panel}>
            <Card className={styles.card}>
              <Text weight="semibold" size={300} style={{ marginBottom: '8px' }}>Configuration</Text>
              <div className={styles.configRow}>
                <div className={styles.configItem}>
                  <span className={styles.label}>Model</span>
                  <Dropdown
                    value={selectedModelData?.name || ''}
                    onOptionSelect={(_, data) => setSelectedModel(data.optionValue || 'model-gpt4o')}
                    style={{ width: '100%' }}
                  >
                    {activeModels.map(m => (
                      <Option key={m.id} value={m.id} text={m.name}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Text>{m.name}</Text>
                          <Text size={200} style={{ color: '#999' }}>{m.provider}</Text>
                        </div>
                      </Option>
                    ))}
                  </Dropdown>
                </div>
                <div style={{ width: '120px' }}>
                  <span className={styles.label}>Temperature: {temperature}</span>
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    value={temperature}
                    onChange={(_, data) => setTemperature(data.value)}
                  />
                </div>
              </div>

              <div style={{ marginTop: '12px' }}>
                <span className={styles.label}>Quick prompts</span>
                <div className={styles.promptTemplates}>
                  {samplePrompts.map(sp => (
                    <Badge key={sp.label} appearance="tint" style={{ cursor: 'pointer' }} onClick={() => setPrompt(sp.prompt)}>
                      {sp.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                <span className={styles.label}>Prompt</span>
                <Textarea
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(_, data) => setPrompt(data.value)}
                  style={{ flex: 1, minHeight: '200px' }}
                  resize="vertical"
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button appearance="primary" icon={<Send24Regular />} onClick={handleSend} disabled={isLoading || !prompt.trim()}>
                  {isLoading ? 'Sending...' : 'Send Request'}
                </Button>
              </div>
            </Card>
          </div>

          <div className={styles.panel}>
            <Card className={styles.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <Text weight="semibold" size={300}>Response</Text>
                {selectedModelData && <Badge appearance="outline">{selectedModelData.provider}</Badge>}
              </div>

              <div className={styles.responseArea}>
                {isLoading ? (
                  <div className={styles.emptyState}>
                    <Spinner size="medium" />
                    <Text size={200}>Routing through AI Gateway...</Text>
                  </div>
                ) : response ? (
                  response
                ) : (
                  <div className={styles.emptyState}>
                    <BrainCircuit24Regular style={{ fontSize: '32px' }} />
                    <Text size={300}>Send a prompt to see the response</Text>
                    <Text size={200}>Your request will be routed through the AI Gateway with full governance applied</Text>
                  </div>
                )}
              </div>

              {lastStats && (
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Latency</Text>
                    <Text weight="semibold" size={200}>{lastStats.latency}ms</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Tokens In</Text>
                    <Text weight="semibold" size={200}>{lastStats.tokensIn}</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Tokens Out</Text>
                    <Text weight="semibold" size={200}>{lastStats.tokensOut}</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Model</Text>
                    <Text weight="semibold" size={200}>{selectedModelData?.name}</Text>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 2 — Tools                                                    */}
      {/* ================================================================ */}
      {activeTab === 'tools' && (
        <div className={styles.container}>
          {/* Left – Tool Configuration */}
          <div className={styles.panel}>
            <Card className={styles.card}>
              <Text weight="semibold" size={300} style={{ marginBottom: '8px' }}>Tool Configuration</Text>

              <span className={styles.label}>Tool</span>
              <Dropdown
                value={selectedToolData?.name || ''}
                onOptionSelect={(_, data) => handleToolChange(data.optionValue || 'tool-crm')}
                style={{ width: '100%' }}
              >
                {activeTools.map(t => (
                  <Option key={t.id} value={t.id} text={t.name}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text>{t.name}</Text>
                      <Text size={200} style={{ color: '#999' }}>{t.transport}</Text>
                    </div>
                  </Option>
                ))}
              </Dropdown>

              {selectedToolData && (
                <div className={styles.infoBlock} style={{ marginTop: '12px' }}>
                  <Text size={200} style={{ color: '#999' }}>{selectedToolData.description}</Text>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                    <Badge appearance="tint" color="informative">{selectedToolData.transport}</Badge>
                    <Text size={200} style={{ color: '#999' }}>•</Text>
                    <Text size={200} style={{ color: '#999' }}>{selectedToolData.endpoint}</Text>
                  </div>
                  <Text size={200} style={{ color: '#999' }}>Owner: {selectedToolData.ownerTeam}</Text>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selectedToolData.tags.map(tag => (
                      <Badge key={tag} appearance="outline" size="small">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginTop: '12px' }}>
                <span className={styles.label}>Operation</span>
                <Dropdown
                  value={selectedOp || currentToolOps[0] || ''}
                  onOptionSelect={(_, data) => setSelectedOp(data.optionValue || '')}
                  style={{ width: '100%' }}
                >
                  {currentToolOps.map(op => (
                    <Option key={op} value={op} text={op}>{op}</Option>
                  ))}
                </Dropdown>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                <span className={styles.label}>Request Body (JSON)</span>
                <Textarea
                  placeholder={'{\n  "customerId": "CUST-12345",\n  "includeHistory": true\n}'}
                  value={toolInput}
                  onChange={(_, data) => setToolInput(data.value)}
                  style={{ flex: 1, minHeight: '120px', fontFamily: 'monospace', fontSize: '13px' }}
                  resize="vertical"
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button appearance="primary" icon={<Play24Regular />} onClick={handleInvokeTool} disabled={toolLoading}>
                  {toolLoading ? 'Invoking...' : 'Invoke Tool'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right – Tool Response */}
          <div className={styles.panel}>
            <Card className={styles.card}>
              <Text weight="semibold" size={300} style={{ marginBottom: '12px' }}>Response</Text>

              <div className={styles.responseArea}>
                {toolLoading ? (
                  <div className={styles.emptyState}>
                    <Spinner size="medium" />
                    <Text size={200}>Invoking tool through AI Gateway...</Text>
                  </div>
                ) : toolResponse ? (
                  toolResponse
                ) : (
                  <div className={styles.emptyState}>
                    <PlugConnected24Regular style={{ fontSize: '32px' }} />
                    <Text size={300}>Invoke a tool to see the response</Text>
                    <Text size={200}>Requests are routed through the gateway with auth, rate limiting, and schema validation</Text>
                  </div>
                )}
              </div>

              {toolStats && (
                <>
                  <div className={styles.statsRow}>
                    <div className={styles.stat}>
                      <Text size={200} style={{ color: '#999' }}>Latency</Text>
                      <Text weight="semibold" size={200}>{toolStats.latency}ms</Text>
                    </div>
                    <div className={styles.stat}>
                      <Text size={200} style={{ color: '#999' }}>Status</Text>
                      <Text weight="semibold" size={200} style={{ color: '#10b981' }}>{toolStats.statusCode} OK</Text>
                    </div>
                    <div className={styles.stat}>
                      <Text size={200} style={{ color: '#999' }}>Response Size</Text>
                      <Text weight="semibold" size={200}>{toolStats.size} bytes</Text>
                    </div>
                  </div>
                  <div style={{ marginTop: '12px' }}>
                    <Text size={200} weight="semibold" style={{ marginBottom: '6px', display: 'block' }}>Gateway policies applied</Text>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div className={styles.policyRow}>
                        <Text size={200} style={{ color: '#10b981' }}>✅</Text>
                        <Text size={200}>Auth verified</Text>
                      </div>
                      <div className={styles.policyRow}>
                        <Text size={200} style={{ color: '#10b981' }}>✅</Text>
                        <Text size={200}>Rate limit check</Text>
                      </div>
                      <div className={styles.policyRow}>
                        <Text size={200} style={{ color: '#10b981' }}>✅</Text>
                        <Text size={200}>Schema validated</Text>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ================================================================ */}
      {/* TAB 3 — Agents                                                   */}
      {/* ================================================================ */}
      {activeTab === 'agents' && (
        <div className={styles.container}>
          {/* Left – Agent Configuration */}
          <div className={styles.panel}>
            <Card className={styles.card}>
              <Text weight="semibold" size={300} style={{ marginBottom: '8px' }}>Agent Configuration</Text>

              <span className={styles.label}>Agent</span>
              <Dropdown
                value={selectedAgentData?.name || ''}
                onOptionSelect={(_, data) => {
                  setSelectedAgent(data.optionValue || 'agent-support');
                  setAgentSteps([]);
                  setAgentFinal('');
                  setAgentStats(null);
                }}
                style={{ width: '100%' }}
              >
                {activeAgents.map(a => (
                  <Option key={a.id} value={a.id} text={a.name}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text>{a.name}</Text>
                      <Text size={200} style={{ color: '#999' }}>{a.protocol}</Text>
                    </div>
                  </Option>
                ))}
              </Dropdown>

              {selectedAgentData && (
                <div className={styles.infoBlock} style={{ marginTop: '12px' }}>
                  <Text size={200} style={{ color: '#999' }}>{selectedAgentData.description}</Text>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
                    <Badge appearance="tint" color="informative">{selectedAgentData.protocol}</Badge>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <Text size={200} style={{ color: '#999' }}>Models: </Text>
                    <Text size={200}>{resolveModelNames(selectedAgentData.modelIds).join(', ')}</Text>
                  </div>
                  <div>
                    <Text size={200} style={{ color: '#999' }}>Tools: </Text>
                    <Text size={200}>{resolveToolNames(selectedAgentData.toolIds).join(', ')}</Text>
                  </div>
                </div>
              )}

              <div style={{ marginTop: '12px' }}>
                <span className={styles.label}>Quick tasks</span>
                <div className={styles.promptTemplates}>
                  {agentQuickTasks.map(qt => (
                    <Badge key={qt.label} appearance="tint" style={{ cursor: 'pointer' }} onClick={() => setAgentTask(qt.task)}>
                      {qt.label}
                    </Badge>
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginTop: '8px' }}>
                <span className={styles.label}>Task</span>
                <Textarea
                  placeholder="Describe what you want the agent to do..."
                  value={agentTask}
                  onChange={(_, data) => setAgentTask(data.value)}
                  style={{ flex: 1, minHeight: '120px' }}
                  resize="vertical"
                />
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
                <Button appearance="primary" icon={<Play24Regular />} onClick={handleRunAgent} disabled={agentLoading || !agentTask.trim()}>
                  {agentLoading ? 'Running...' : 'Run Agent'}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right – Agent Execution */}
          <div className={styles.panel}>
            <Card className={styles.card}>
              <Text weight="semibold" size={300} style={{ marginBottom: '12px' }}>Agent Execution</Text>

              <div className={styles.responseArea}>
                {agentSteps.length === 0 && !agentLoading ? (
                  <div className={styles.emptyState}>
                    <Bot24Regular style={{ fontSize: '32px' }} />
                    <Text size={300}>Run an agent to see the execution trace</Text>
                    <Text size={200}>The agent will orchestrate model calls and tool invocations to complete your task</Text>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {agentSteps.map((step, i) => (
                      <div key={i} className={styles.traceStep}>
                        <span>{step.icon}</span>
                        <div style={{ flex: 1 }}>
                          <Text size={200} weight="semibold" style={{ color: step.color }}>{step.label}</Text>
                          <br />
                          <Text size={200} style={{ color: '#999' }}>{step.detail}</Text>
                        </div>
                      </div>
                    ))}
                    {agentLoading && !agentFinal && (
                      <div style={{ padding: '12px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Spinner size="tiny" />
                        <Text size={200} style={{ color: '#999' }}>Processing...</Text>
                      </div>
                    )}
                    {agentFinal && (
                      <div style={{ marginTop: '16px', padding: '12px', backgroundColor: tokens.colorNeutralBackground3, borderRadius: '8px', border: `1px solid ${tokens.colorNeutralStroke2}` }}>
                        <Text size={200} weight="semibold" style={{ color: '#10b981', marginBottom: '8px', display: 'block' }}>Final Response</Text>
                        <Text size={200} style={{ whiteSpace: 'pre-wrap' }}>{agentFinal}</Text>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {agentStats && (
                <div className={styles.statsRow}>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Total Latency</Text>
                    <Text weight="semibold" size={200}>{agentStats.latency}ms</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Model Calls</Text>
                    <Text weight="semibold" size={200} style={{ color: '#6366f1' }}>{agentStats.modelCalls}</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Tool Calls</Text>
                    <Text weight="semibold" size={200} style={{ color: '#0ea5e9' }}>{agentStats.toolCalls}</Text>
                  </div>
                  <div className={styles.stat}>
                    <Text size={200} style={{ color: '#999' }}>Tokens Used</Text>
                    <Text weight="semibold" size={200}>{agentStats.tokens}</Text>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Playground;
