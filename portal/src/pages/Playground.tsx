import React, { useState, useRef, useCallback } from 'react';
import {
  makeStyles,
  Text,
  Button,
  Textarea,
  Dropdown,
  Option,
  Badge,
  Spinner,
  Slider,
  Switch,
} from '@fluentui/react-components';
import {
  Send24Regular,
  Add24Regular,
  Play24Regular,
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Bot24Regular,
  Settings24Regular,
  ArrowReset24Regular,
} from '@fluentui/react-icons';
import { models, tools, agents } from '../data/mockData';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TraceStep {
  icon: string;
  label: string;
  detail?: string;
  color: string;
  done: boolean;
}

interface ExecResult {
  steps: TraceStep[];
  response: string;
  stats: {
    latency: string;
    modelCalls: number;
    toolInvocations: number;
    tokens: number;
  };
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 140px)',
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexShrink: 0,
    paddingBottom: '16px',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    flex: 1,
    minHeight: 0,
  },
  leftPanel: {
    backgroundColor: '#1e1e1e',
    borderRight: '1px solid #333',
    padding: '24px',
    overflowY: 'auto',
  },
  rightPanel: {
    backgroundColor: '#141414',
    padding: '24px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    marginTop: '20px',
  },
  modelInfo: {
    backgroundColor: '#2d2d3d',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  capBadge: {
    display: 'inline-flex',
    backgroundColor: '#3b3b5c',
    color: '#c4b5fd',
    borderRadius: '4px',
    padding: '2px 8px',
    fontSize: '11px',
    marginRight: '4px',
    marginBottom: '4px',
  },
  toolChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  },
  toolChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#2d2d3d',
    color: '#e0e0e0',
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    border: '1px solid transparent',
    ':hover': {
      backgroundColor: '#3b3b5c',
    },
  },
  toolChipSelected: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#1e3a5f',
    color: '#7dd3fc',
    borderRadius: '16px',
    padding: '4px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    border: '1px solid #0ea5e9',
    ':hover': {
      backgroundColor: '#1e4a7f',
    },
  },
  selectedToolList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginTop: '8px',
  },
  selectedToolItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1a2a3a',
    borderRadius: '6px',
    padding: '6px 12px',
    fontSize: '13px',
    color: '#7dd3fc',
  },
  agentInfo: {
    backgroundColor: '#1a2e2a',
    borderRadius: '8px',
    padding: '12px',
    marginTop: '8px',
    borderLeft: '3px solid #10b981',
  },
  promptArea: {
    marginTop: '8px',
  },
  quickPrompts: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    marginTop: '8px',
  },
  quickBadge: {
    backgroundColor: '#2d2d3d',
    color: '#ccc',
    borderRadius: '16px',
    padding: '6px 14px',
    fontSize: '12px',
    cursor: 'pointer',
    border: 'none',
    ':hover': {
      backgroundColor: '#3b3b5c',
      color: '#fff',
    },
  },
  runBtn: {
    marginTop: '20px',
    width: '100%',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '16px',
    color: '#999',
  },
  traceContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0px',
    flex: 1,
  },
  stepCard: {
    padding: '12px 16px',
    marginLeft: '12px',
    marginBottom: '2px',
    backgroundColor: '#1a1a2e',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  },
  stepDetail: {
    fontSize: '12px',
    color: '#999',
    marginTop: '2px',
  },
  '@keyframes pulse': {
    '0%': { opacity: 1 },
    '50%': { opacity: 0.5 },
    '100%': { opacity: 1 },
  },
  activeStep: {
    boxShadow: '0 0 8px rgba(99, 102, 241, 0.3)',
    animationName: {
      '0%': { opacity: 1 },
      '50%': { opacity: 0.7 },
      '100%': { opacity: 1 },
    },
    animationDuration: '1.5s',
    animationIterationCount: 'infinite',
  },
  responseBox: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    padding: '16px',
    fontFamily: '"Cascadia Code", "Fira Code", "Consolas", monospace',
    fontSize: '13px',
    lineHeight: '1.6',
    color: '#e6edf3',
    whiteSpace: 'pre-wrap',
    marginTop: '12px',
  },
  statsBar: {
    backgroundColor: '#1e1e1e',
    borderTop: '1px solid #333',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap',
    marginTop: '16px',
    borderRadius: '8px',
    fontSize: '13px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#ccc',
  },
  statValue: {
    fontWeight: 600,
    color: '#fff',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
  panelTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  toolSelectorArea: {
    marginTop: '8px',
  },
  switchRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '8px',
  },
});

// ---------------------------------------------------------------------------
// Quick prompts with contextual responses
// ---------------------------------------------------------------------------
const QUICK_PROMPTS: { label: string; prompt: string }[] = [
  {
    label: 'Summarize a document',
    prompt:
      'Summarize the key findings from the Q4 2025 product strategy document, including the main priorities, risks, and recommended next steps.',
  },
  {
    label: 'Look up customer #12345',
    prompt:
      'Look up customer #12345 in the CRM, retrieve their billing history for the past 6 months, and highlight any overdue invoices.',
  },
  {
    label: 'Triage incident INC-789',
    prompt:
      'Triage incident INC-789: determine the severity, identify impacted services, pull recent deployment logs, and suggest a mitigation plan.',
  },
  {
    label: 'Generate quarterly report',
    prompt:
      'Generate a quarterly performance report for Q1 2026 covering API usage trends, top consumers, error rates, and cost breakdown by model.',
  },
];

const MOCK_RESPONSES: Record<string, { modelOnly: string; withTools: string; agent: string }> = {
  'Summarize a document': {
    modelOnly:
      '## Q4 2025 Strategy Summary\n\n**Priorities:**\n1. Expand AI Gateway to support multi-region failover\n2. Launch self-service MCP server provisioning\n3. Reduce P95 latency to < 200ms\n\n**Risks:** Vendor lock-in with single LLM provider; token cost overruns projected at 115% of budget.\n\n**Next Steps:** Finalize multi-model routing policy by Jan 15; begin load testing with synthetic traffic.',
    withTools:
      '## Q4 2025 Strategy Summary\n\n*Retrieved document from Knowledge Base (doc-id: strategy-q4-2025)*\n\n**Priorities:**\n1. Expand AI Gateway to support multi-region failover\n2. Launch self-service MCP server provisioning\n3. Reduce P95 latency to < 200ms\n\n**Risks:** Vendor lock-in with single LLM provider; token cost overruns projected at 115% of budget.\n\n**Next Steps:** Finalize multi-model routing policy by Jan 15; begin load testing with synthetic traffic.',
    agent:
      '## Q4 2025 Strategy Summary\n\n*Agent retrieved document from Knowledge Base, cross-referenced with Jira roadmap items, and validated priorities against current sprint goals.*\n\n**Priorities:**\n1. Expand AI Gateway to support multi-region failover (JIRA: GW-1042 — In Progress)\n2. Launch self-service MCP server provisioning (JIRA: GW-1087 — Planning)\n3. Reduce P95 latency to < 200ms (JIRA: GW-998 — Done ✅)\n\n**Risks:** Vendor lock-in with single LLM provider; token cost overruns projected at 115% of budget.\n\n**Recommendation:** Escalate budget risk to VP Engineering; priority #3 is already achieved — reallocate resources to #2.',
  },
  'Look up customer #12345': {
    modelOnly:
      'I can help you look up customer #12345, but I don\'t currently have access to the CRM system. Please attach the Customer CRM API tool to enable direct lookups.',
    withTools:
      '## Customer #12345 — Contoso Industries\n\n**Account Status:** Active (Enterprise Tier)\n**Primary Contact:** Sarah Chen (sarah.chen@contoso-ind.com)\n**Account Manager:** James Rodriguez\n\n**Billing Summary (Last 6 months):**\n| Month | Amount | Status |\n|-------|--------|--------|\n| Mar 2026 | $12,450 | ✅ Paid |\n| Feb 2026 | $11,800 | ✅ Paid |\n| Jan 2026 | $13,200 | ⚠️ Overdue |\n| Dec 2025 | $10,950 | ✅ Paid |\n| Nov 2025 | $11,400 | ✅ Paid |\n| Oct 2025 | $12,100 | ✅ Paid |\n\n**⚠️ Alert:** January invoice ($13,200) is 47 days overdue. Recommended action: escalate to Finance.',
    agent:
      '## Customer #12345 — Full Account Analysis\n\n*Agent orchestrated 3 tool calls: CRM lookup → Billing history → Slack notification*\n\n**Account:** Contoso Industries (Enterprise Tier, Active)\n**Contact:** Sarah Chen | **AM:** James Rodriguez\n\n**Billing Alert:** January invoice ($13,200) is 47 days overdue.\n\n**Actions Taken:**\n1. ✅ Retrieved full account profile from CRM\n2. ✅ Pulled 6-month billing history\n3. ✅ Sent overdue notification to #finance-escalations Slack channel\n\n**Recommendation:** Schedule a call with Sarah Chen to discuss the overdue payment and review contract renewal (due in 60 days).',
  },
  'Triage incident INC-789': {
    modelOnly:
      '## Incident INC-789 — Preliminary Analysis\n\nBased on the incident description, this appears to be a **P2 (High)** severity issue affecting the API Gateway\'s token routing layer.\n\n**Likely Impact:** Intermittent 503 errors for 15-20% of model routing requests.\n**Suggested Mitigation:** Enable failover routing to secondary model endpoints.\n\n*Note: For a complete triage, attach the GitHub Issues API and Jira Service Desk tools for deployment log correlation.*',
    withTools:
      '## Incident INC-789 — Full Triage Report\n\n**Severity:** P1 (Critical) ← upgraded from initial P2\n**Status:** Active | **Duration:** 43 minutes\n\n**Impacted Services:**\n- API Gateway model routing (primary)\n- Customer Support Agent (dependent)\n- Billing Service queries (intermittent)\n\n**Root Cause (probable):** Deployment `deploy-gw-v2.14.3` at 14:23 UTC introduced a regression in the token bucket algorithm, causing rate limit miscalculation.\n\n**Recent Deployments (from GitHub):**\n- `deploy-gw-v2.14.3` — 14:23 UTC (⚠️ suspect)\n- `deploy-gw-v2.14.2` — 09:15 UTC (stable)\n\n**Mitigation Plan:**\n1. Rollback to `v2.14.2` immediately\n2. Disable adaptive rate limiting policy\n3. Monitor error rates for 15 minutes post-rollback',
    agent:
      '## Incident INC-789 — Agent Triage Complete\n\n*Agent executed full triage workflow: Jira ticket analysis → GitHub deployment correlation → Model impact assessment → Slack escalation*\n\n**Severity:** P1 (Critical) — auto-escalated\n**Root Cause:** Regression in `deploy-gw-v2.14.3` token bucket algorithm\n\n**Actions Completed:**\n1. ✅ Analyzed Jira ticket INC-789 (reported by: monitoring-bot)\n2. ✅ Correlated with GitHub deployment history (suspect: v2.14.3)\n3. ✅ Identified 3 impacted services via dependency graph\n4. ✅ Posted triage summary to #incident-response Slack channel\n5. ✅ Created rollback PR #4521 on GitHub\n\n**Auto-Mitigation:**\n- Rollback PR created and assigned to on-call engineer\n- Rate limiting policy temporarily disabled\n- Estimated recovery: 8 minutes post-rollback',
  },
  'Generate quarterly report': {
    modelOnly:
      '## Q1 2026 Performance Report\n\n**API Usage:**\n- Total requests: 1.43M (+22% QoQ)\n- Avg latency: 187ms (P95: 342ms)\n- Error rate: 0.8%\n\n**Top Consumers:**\n1. Customer Support Agent — 267K requests\n2. DevOps Assistant — 94K requests\n3. Sales Intelligence — 72K requests\n\n**Cost by Model:**\n- GPT-4o: $8,420 (58%)\n- GPT-4o-mini: $2,150 (15%)\n- Claude 3.5: $2,040 (14%)\n- Others: $1,890 (13%)\n\n**Total Token Spend:** $14,500',
    withTools:
      '## Q1 2026 Performance Report\n\n*Data sourced from: CRM API, Billing Service, Knowledge Base*\n\n**API Usage:**\n- Total requests: 1.43M (+22% QoQ)\n- Avg latency: 187ms (P95: 342ms)\n- Error rate: 0.8% (down from 1.2% in Q4)\n\n**Top Consumers:**\n1. Customer Support Agent — 267K requests ($4,890)\n2. DevOps Assistant — 94K requests ($1,720)\n3. Sales Intelligence — 72K requests ($1,310)\n\n**Cost Breakdown by Model:**\n| Model | Requests | Tokens | Cost |\n|-------|----------|--------|------|\n| GPT-4o | 542K | 8.7M | $8,420 |\n| GPT-4o-mini | 389K | 2.2M | $2,150 |\n| Claude 3.5 | 198K | 1.0M | $2,040 |\n| Gemini 1.5 | 126K | 340K | $890 |\n| Llama 3.1 | 175K | 190K | $1,000 |\n\n**Total Q1 Spend:** $14,500',
    agent:
      '## Q1 2026 Performance Report — Executive Summary\n\n*Agent compiled report from 4 data sources with automated analysis*\n\n**Headline:** API usage grew 22% QoQ with costs held flat (+3%) through model optimization.\n\n**Key Metrics:**\n- 1.43M total requests | 0.8% error rate | 187ms avg latency\n- $14,500 total spend (+$420 vs Q4 despite 22% more traffic)\n\n**Cost Savings Achieved:**\n- Model downtier routing saved $3,200 (auto-routing simple queries to GPT-4o-mini)\n- Semantic caching saved $1,800 (14% cache hit rate)\n\n**Recommendations:**\n1. Increase cache TTL for knowledge base queries (potential $800/mo saving)\n2. Migrate Sales Agent to GPT-4o-mini (no quality degradation in A/B test)\n3. Add Llama 3.1 as fallback for non-critical workloads\n\n*Full report exported to Knowledge Base (doc-id: report-q1-2026)*',
  },
};

const DEFAULT_RESPONSE = {
  modelOnly: 'The request has been processed successfully. Here is a summary of the analysis based on the provided prompt.',
  withTools: 'The request has been processed using the attached tools. Tool results have been synthesized into the response below.',
  agent: 'The agent has completed the orchestrated task. Multiple tools were invoked and results have been compiled.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const activeModels = models.filter((m) => m.status === 'active');
const activeTools = tools.filter((t) => t.status === 'active');
const activeAgents = agents.filter((a) => a.status === 'active');

function findPromptKey(prompt: string): string | undefined {
  for (const qp of QUICK_PROMPTS) {
    if (prompt.includes(qp.prompt) || prompt.includes(qp.label)) return qp.label;
  }
  return undefined;
}

function getResponse(key: string | undefined, mode: 'modelOnly' | 'withTools' | 'agent'): string {
  if (key && MOCK_RESPONSES[key]) return MOCK_RESPONSES[key][mode];
  return DEFAULT_RESPONSE[mode];
}

function toolMockResult(toolName: string): string {
  const snippets: Record<string, string> = {
    'Customer CRM API': '{ "customerId": "12345", "name": "Contoso Industries", "tier": "Enterprise", "status": "active" }',
    'Billing Service': '{ "invoices": [{ "month": "Jan 2026", "amount": 13200, "status": "overdue" }], "total": 6 }',
    'Slack Connector': '{ "ok": true, "channel": "#finance-escalations", "message": "Notification sent" }',
    'GitHub Issues API': '{ "deployments": [{ "tag": "v2.14.3", "time": "14:23 UTC", "status": "suspect" }] }',
    'Jira Service Desk': '{ "ticket": "INC-789", "severity": "P1", "status": "active", "duration": "43min" }',
    'Internal Knowledge Base': '{ "docId": "strategy-q4-2025", "title": "Q4 Product Strategy", "sections": 5 }',
    'Weather API': '{ "location": "Seattle", "temp": "52°F", "condition": "Partly cloudy" }',
    'Payment Gateway': '{ "transactionId": "txn-9821", "status": "completed", "amount": "$1,250.00" }',
  };
  return snippets[toolName] || '{ "status": "ok", "result": "..." }';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Playground: React.FC = () => {
  const styles = useStyles();

  // Config state
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  const [temperature, setTemperature] = useState(0.7);
  const [showToolSelector, setShowToolSelector] = useState(false);
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [agentMode, setAgentMode] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [prompt, setPrompt] = useState('');

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [response, setResponse] = useState<string | null>(null);
  const [stats, setStats] = useState<ExecResult['stats'] | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  // Agent mode: override model + tools
  const effectiveModelId = agentMode && selectedAgent ? selectedAgent.modelIds[0] : selectedModelId;
  const effectiveModel = models.find((m) => m.id === effectiveModelId);
  const effectiveToolIds = agentMode && selectedAgent ? selectedAgent.toolIds : selectedToolIds;

  const toggleTool = useCallback((id: string) => {
    setSelectedToolIds((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }, []);

  const reset = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setSelectedModelId('');
    setTemperature(0.7);
    setShowToolSelector(false);
    setSelectedToolIds([]);
    setAgentMode(false);
    setSelectedAgentId('');
    setPrompt('');
    setIsRunning(false);
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setResponse(null);
    setStats(null);
    setHasRun(false);
  }, []);

  const runExecution = useCallback(() => {
    if (!effectiveModel || !prompt.trim()) return;

    // Clear previous
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setResponse(null);
    setStats(null);
    setIsRunning(true);
    setHasRun(true);

    const promptKey = findPromptKey(prompt);
    const resolvedTools = effectiveToolIds
      .map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) as typeof tools;

    let steps: TraceStep[] = [];
    let mode: 'modelOnly' | 'withTools' | 'agent' = 'modelOnly';
    let modelCalls = 1;
    let toolInvocations = 0;

    if (agentMode && selectedAgent) {
      mode = 'agent';
      modelCalls = 2;
      toolInvocations = resolvedTools.length;
      steps = [
        { icon: '🤖', label: `Agent ${selectedAgent.name} starting task...`, color: '#10b981', done: false },
        { icon: '🧠', label: 'Planning: analyzing task and determining approach...', color: '#10b981', done: false },
        { icon: '🧠', label: `Calling ${effectiveModel.name} for task decomposition...`, color: '#6366f1', done: false },
        ...resolvedTools.map((t) => ({
          icon: '🔧',
          label: `Executing tool: ${t.name}...`,
          detail: toolMockResult(t.name),
          color: '#0ea5e9',
          done: false,
        })),
        { icon: '🧠', label: `Calling ${effectiveModel.name} for response synthesis...`, color: '#6366f1', done: false },
        { icon: '✅', label: 'Task complete', color: '#10b981', done: false },
      ];
    } else if (resolvedTools.length > 0) {
      mode = 'withTools';
      modelCalls = 2;
      toolInvocations = resolvedTools.length;
      steps = [
        { icon: '📤', label: `Sending prompt to ${effectiveModel.name}...`, color: '#6366f1', done: false },
        { icon: '🧠', label: 'Model analyzing prompt and selecting tools...', color: '#6366f1', done: false },
        ...resolvedTools.map((t) => ({
          icon: '🔧',
          label: `Invoking ${t.name}...`,
          detail: toolMockResult(t.name),
          color: '#0ea5e9',
          done: false,
        })),
        { icon: '🧠', label: 'Model synthesizing results...', color: '#6366f1', done: false },
        { icon: '📥', label: 'Response ready', color: '#6366f1', done: false },
      ];
    } else {
      steps = [
        { icon: '📤', label: `Sending prompt to ${effectiveModel.name}...`, color: '#6366f1', done: false },
        { icon: '🧠', label: 'Model processing...', detail: `~${(Math.random() * 800 + 400).toFixed(0)}ms · ${(Math.random() * 1200 + 300).toFixed(0)} tokens`, color: '#6366f1', done: false },
        { icon: '📥', label: 'Response received', color: '#6366f1', done: false },
      ];
    }

    // Animate steps
    steps.forEach((_, i) => {
      const t1 = setTimeout(() => {
        setActiveStepIdx(i);
        setTraceSteps((prev) => {
          const next = [...prev];
          if (i > 0 && next[i - 1]) next[i - 1] = { ...next[i - 1], done: true };
          if (!next[i]) next.push(steps[i]);
          return next;
        });
      }, i * 500);
      timeouts.current.push(t1);
    });

    // Final
    const totalTime = steps.length * 500 + 300;
    const tf = setTimeout(() => {
      setTraceSteps((prev) => prev.map((s) => ({ ...s, done: true })));
      setActiveStepIdx(-1);
      setResponse(getResponse(promptKey, mode));
      const totalLatency = (steps.length * 0.4 + Math.random() * 0.5).toFixed(1);
      const tokens = Math.floor(Math.random() * 1500 + 500);
      setStats({
        latency: `${totalLatency}s`,
        modelCalls,
        toolInvocations,
        tokens,
      });
      setIsRunning(false);
    }, totalTime);
    timeouts.current.push(tf);
  }, [effectiveModel, effectiveToolIds, prompt, agentMode, selectedAgent]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Text size={800} weight="bold" style={{ display: 'block', color: '#fff' }}>
            Playground
          </Text>
          <Text size={300} style={{ color: '#999', marginTop: '4px', display: 'block' }}>
            Compose and test AI experiences end-to-end — models, tools, and agents through the gateway
          </Text>
        </div>
        <Button
          icon={<ArrowReset24Regular />}
          appearance="subtle"
          onClick={reset}
        >
          Reset
        </Button>
      </div>

      {/* Two-column layout */}
      <div className={styles.columns}>
        {/* ---- LEFT PANEL ---- */}
        <div className={styles.leftPanel}>
          <div className={styles.panelTitle}>
            <Settings24Regular style={{ color: '#999' }} />
            <Text size={500} weight="semibold" style={{ color: '#fff' }}>Configuration</Text>
          </div>

          {/* Step 1: Model */}
          <div className={styles.sectionTitle}>
            <BrainCircuit24Regular style={{ color: '#6366f1' }} />
            <Text size={400} weight="semibold" style={{ color: '#e0e0e0' }}>Step 1: Select a Model</Text>
            <Badge appearance="filled" color="important" size="small">required</Badge>
          </div>
          <Dropdown
            placeholder="Choose a model..."
            value={selectedModel?.name || ''}
            selectedOptions={selectedModelId ? [selectedModelId] : []}
            onOptionSelect={(_, data) => setSelectedModelId(data.optionValue as string)}
            style={{ width: '100%' }}
          >
            {activeModels.map((m) => (
              <Option key={m.id} value={m.id} text={m.name}>
                {m.name} — {m.provider}
              </Option>
            ))}
          </Dropdown>
          {selectedModel && (
            <div className={styles.modelInfo}>
              <div>
                <Badge appearance="outline" color="informative" size="small">{selectedModel.provider}</Badge>
              </div>
              <div>
                {selectedModel.capabilities.map((c) => (
                  <span key={c} className={styles.capBadge}>{c}</span>
                ))}
              </div>
              <Text size={200} style={{ color: '#999' }}>
                Token limit: {(selectedModel.tokenLimit / 1_000_000).toFixed(0)}M · Used today: {(selectedModel.tokensUsedToday / 1_000_000).toFixed(1)}M
              </Text>
            </div>
          )}
          <div className={styles.sliderRow}>
            <Text size={200} style={{ color: '#999' }}>Temperature</Text>
            <Slider
              min={0}
              max={1}
              step={0.1}
              value={temperature}
              onChange={(_, d) => setTemperature(d.value)}
              style={{ flex: 1 }}
            />
            <Text size={200} style={{ color: '#ccc', minWidth: '28px' }}>{temperature.toFixed(1)}</Text>
          </div>

          {/* Step 2: Tools */}
          <div className={styles.sectionTitle}>
            <PlugConnected24Regular style={{ color: '#0ea5e9' }} />
            <Text size={400} weight="semibold" style={{ color: '#e0e0e0' }}>Step 2: Attach Tools</Text>
            <Text size={200} style={{ color: '#999' }}>optional</Text>
          </div>
          {!agentMode && (
            <>
              <Button
                icon={<Add24Regular />}
                appearance="subtle"
                size="small"
                onClick={() => setShowToolSelector((p) => !p)}
              >
                {showToolSelector ? 'Hide tool selector' : 'Add Tool'}
              </Button>
              {showToolSelector && (
                <div className={styles.toolChips}>
                  {activeTools.map((t) => (
                    <span
                      key={t.id}
                      className={selectedToolIds.includes(t.id) ? styles.toolChipSelected : styles.toolChip}
                      onClick={() => toggleTool(t.id)}
                    >
                      {selectedToolIds.includes(t.id) ? '✓ ' : ''}{t.name}
                    </span>
                  ))}
                </div>
              )}
              {selectedToolIds.length > 0 && (
                <>
                  <Text size={200} style={{ color: '#0ea5e9', marginTop: '8px', display: 'block' }}>
                    {selectedToolIds.length} tool{selectedToolIds.length > 1 ? 's' : ''} attached
                  </Text>
                  <div className={styles.selectedToolList}>
                    {selectedToolIds.map((id) => {
                      const t = tools.find((x) => x.id === id);
                      if (!t) return null;
                      return (
                        <div key={id} className={styles.selectedToolItem}>
                          <span>✓ {t.name}</span>
                          <button
                            onClick={() => toggleTool(id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#f87171',
                              cursor: 'pointer',
                              fontSize: '14px',
                              padding: '0 4px',
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
          {agentMode && (
            <Text size={200} style={{ color: '#999', fontStyle: 'italic' }}>
              Tools are managed by the selected agent.
            </Text>
          )}

          {/* Step 3: Agent Mode */}
          <div className={styles.sectionTitle}>
            <Bot24Regular style={{ color: '#10b981' }} />
            <Text size={400} weight="semibold" style={{ color: '#e0e0e0' }}>Step 3: Agent Mode</Text>
            <Text size={200} style={{ color: '#999' }}>optional</Text>
          </div>
          <div className={styles.switchRow}>
            <Switch
              checked={agentMode}
              onChange={(_, d) => {
                setAgentMode(d.checked);
                if (!d.checked) setSelectedAgentId('');
              }}
              label="Enable Agent Mode"
            />
          </div>
          {agentMode && (
            <>
              <Dropdown
                placeholder="Choose an agent..."
                value={selectedAgent?.name || ''}
                selectedOptions={selectedAgentId ? [selectedAgentId] : []}
                onOptionSelect={(_, data) => {
                  const aid = data.optionValue as string;
                  setSelectedAgentId(aid);
                  const ag = agents.find((a) => a.id === aid);
                  if (ag) {
                    setSelectedModelId(ag.modelIds[0]);
                    setSelectedToolIds(ag.toolIds);
                  }
                }}
                style={{ width: '100%', marginTop: '8px' }}
              >
                {activeAgents.map((a) => (
                  <Option key={a.id} value={a.id} text={a.name}>
                    {a.name}
                  </Option>
                ))}
              </Dropdown>
              {selectedAgent && (
                <div className={styles.agentInfo}>
                  <Badge appearance="outline" color="success" size="small">{selectedAgent.protocol}</Badge>
                  <Text size={200} style={{ color: '#a7f3d0', display: 'block', marginTop: '6px' }}>
                    {selectedAgent.description}
                  </Text>
                  <Text size={200} style={{ color: '#6ee7b7', display: 'block', marginTop: '8px', fontStyle: 'italic' }}>
                    Agent will orchestrate model + tools automatically
                  </Text>
                </div>
              )}
            </>
          )}

          {/* Step 4: Prompt */}
          <div className={styles.sectionTitle}>
            <Send24Regular style={{ color: '#f59e0b' }} />
            <Text size={400} weight="semibold" style={{ color: '#e0e0e0' }}>Step 4: Prompt</Text>
          </div>
          <div className={styles.promptArea}>
            <Textarea
              placeholder="Describe what you want to do..."
              value={prompt}
              onChange={(_, d) => setPrompt(d.value)}
              resize="vertical"
              style={{ width: '100%', minHeight: '100px' }}
            />
          </div>
          <div className={styles.quickPrompts}>
            {QUICK_PROMPTS.map((qp) => (
              <button
                key={qp.label}
                className={styles.quickBadge}
                onClick={() => setPrompt(qp.prompt)}
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Run button */}
          <Button
            className={styles.runBtn}
            appearance="primary"
            size="large"
            icon={<Play24Regular />}
            disabled={!effectiveModel || !prompt.trim() || isRunning}
            onClick={runExecution}
          >
            {isRunning ? 'Running...' : 'Run'}
          </Button>
        </div>

        {/* ---- RIGHT PANEL ---- */}
        <div className={styles.rightPanel}>
          <div className={styles.panelTitle}>
            <Play24Regular style={{ color: '#999' }} />
            <Text size={500} weight="semibold" style={{ color: '#fff' }}>Execution &amp; Results</Text>
          </div>

          {!hasRun && !isRunning ? (
            <div className={styles.emptyState}>
              <BrainCircuit24Regular style={{ fontSize: '48px', color: '#555' }} />
              <Text size={300} style={{ color: '#999', textAlign: 'center' }}>
                Configure your experience and click Run to see results here
              </Text>
            </div>
          ) : (
            <div className={styles.traceContainer}>
              {traceSteps.map((step, i) => (
                <div
                  key={i}
                  className={`${styles.stepCard} ${i === activeStepIdx ? styles.activeStep : ''}`}
                  style={{ borderLeft: `3px solid ${step.color}`, opacity: step.done || i === activeStepIdx ? 1 : 0.5 }}
                >
                  <span style={{ fontSize: '16px' }}>{step.icon}</span>
                  <div style={{ flex: 1 }}>
                    <Text size={300} style={{ color: '#e0e0e0' }}>{step.label}</Text>
                    {step.detail && (
                      <div className={styles.stepDetail}>
                        <code style={{ fontSize: '11px', color: '#8b949e' }}>{step.detail}</code>
                      </div>
                    )}
                  </div>
                  {i === activeStepIdx && <Spinner size="tiny" />}
                  {step.done && <span style={{ color: '#10b981', fontSize: '14px' }}>✓</span>}
                </div>
              ))}

              {response && (
                <div className={styles.responseBox}>{response}</div>
              )}

              {stats && (
                <div className={styles.statsBar}>
                  <div className={styles.statItem}>
                    ⏱ <span className={styles.statValue}>{stats.latency}</span>
                  </div>
                  <div className={styles.statItem}>
                    🧠 <span className={styles.statValue}>{stats.modelCalls} call{stats.modelCalls > 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.statItem}>
                    🔧 <span className={styles.statValue}>{stats.toolInvocations} invocation{stats.toolInvocations !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={styles.statItem}>
                    📊 <span className={styles.statValue}>{stats.tokens.toLocaleString()} tokens</span>
                  </div>
                  <div className={styles.statItem} style={{ color: '#10b981' }}>
                    ✅ Auth · ✅ Rate limit · ✅ Content safety
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Playground;
