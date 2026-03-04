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
  Switch,
  Divider,
} from '@fluentui/react-components';
import {
  Send24Regular,
  Play24Regular,
  BrainCircuit24Regular,
  ArrowReset24Regular,
  ArrowRouting24Regular,
  DataUsageRegular,
  Shield24Regular,
  ArrowRepeatAll24Regular,
  Code24Regular,
  Timer24Regular,
  Money24Regular,
  PlugConnected20Regular,
  CheckmarkCircle20Regular,
  Copy24Regular,
  ChevronDown20Regular,
  ChevronRight20Regular,
  Clock20Regular,
} from '@fluentui/react-icons';
import { models, agents } from '../data/mockData';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type StepType = 'gateway' | 'auth' | 'model' | 'tool' | 'agent' | 'response';
type RunStatus = 'idle' | 'running' | 'succeeded' | 'failed';

interface TraceStep {
  icon: string;
  label: string;
  type: StepType;
  duration: number;       // ms, filled after done
  color: string;
  done: boolean;
  summary: string;
  requestJson: string;
  responseJson: string;
  headers: Record<string, string>;
  policies: string[];
}

interface RoutingDecision {
  primary: string;
  primaryProvider: string;
  fallback: string;
  fallbackProvider: string;
  reason: string;
}

interface ObsMetrics {
  cost: string;
  tokens: string;
  latency: string;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const useStyles = makeStyles({
  page: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 110px)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    paddingBottom: '12px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  sandboxPill: {
    backgroundColor: '#1a3a2a',
    color: '#34d399',
    borderRadius: '12px',
    padding: '2px 10px',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px',
    border: '1px solid #10b981',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '280px 1fr 280px',
    flex: 1,
    minHeight: 0,
    gap: '0',
  },
  leftPanel: {
    backgroundColor: '#1a1a1a',
    borderRight: '1px solid #2a2a2a',
    padding: '14px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  centerPanel: {
    backgroundColor: '#111',
    padding: '0',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  runHeader: {
    padding: '10px 14px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #2a2a2a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  runHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  runHeaderRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  runMeta: {
    fontSize: '11px',
    color: '#666',
    fontFamily: '"Cascadia Code", monospace',
  },
  runMetricPill: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    backgroundColor: '#252525',
    borderRadius: '4px',
    fontSize: '11px',
    color: '#ccc',
  },
  tracePane: {
    display: 'grid',
    gridTemplateColumns: '220px 1fr',
    flex: 1,
    minHeight: 0,
  },
  traceList: {
    borderRight: '1px solid #2a2a2a',
    overflowY: 'auto',
    padding: '6px 0',
  },
  traceListItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    cursor: 'pointer',
    borderLeft: '3px solid transparent',
    transition: 'all 0.1s',
    ':hover': {
      backgroundColor: '#1a1a2e',
    },
  },
  traceListItemSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    cursor: 'pointer',
    backgroundColor: '#1a1a2e',
    borderLeft: '3px solid #6366f1',
  },
  traceListItemDisabled: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '7px 12px',
    opacity: 0.3,
    borderLeft: '3px solid transparent',
  },
  stepIconSmall: {
    fontSize: '14px',
    flexShrink: 0,
    width: '18px',
    textAlign: 'center' as const,
  },
  stepInfo: {
    flex: 1,
    minWidth: 0,
  },
  stepName: {
    fontSize: '12px',
    color: '#e0e0e0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  stepDuration: {
    fontSize: '10px',
    color: '#555',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '1px',
  },
  traceDetail: {
    overflowY: 'auto',
    padding: '12px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  collapsible: {
    borderRadius: '6px',
    border: '1px solid #2a2a2a',
    overflow: 'hidden',
  },
  collapsibleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 10px',
    backgroundColor: '#1a1a1a',
    cursor: 'pointer',
    fontSize: '12px',
    color: '#aaa',
    fontWeight: 500,
    ':hover': {
      backgroundColor: '#222',
    },
  },
  collapsibleBody: {
    padding: '8px 10px',
    backgroundColor: '#0d1117',
    fontFamily: '"Cascadia Code", monospace',
    fontSize: '11px',
    color: '#8b949e',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
    maxHeight: '180px',
    overflowY: 'auto',
  },
  policyChips: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '4px',
    padding: '8px 10px',
    backgroundColor: '#141414',
  },
  finalResponseCard: {
    margin: '0 14px 12px',
    padding: '12px',
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
    flexShrink: 0,
  },
  rightPanel: {
    backgroundColor: '#1a1a1a',
    borderLeft: '1px solid #2a2a2a',
    padding: '14px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  panelLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '2px',
  },
  card: {
    padding: '12px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #2a2a2a',
    borderRadius: '8px',
  },
  cardGlow: {
    padding: '12px',
    backgroundColor: '#1e1e1e',
    border: '1px solid #333',
    borderRadius: '8px',
    boxShadow: '0 0 12px rgba(99, 102, 241, 0.06)',
  },
  fieldLabel: {
    fontSize: '11px',
    color: '#888',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    marginBottom: '4px',
    display: 'block',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },
  toolList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  toolRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '4px 8px',
    backgroundColor: '#252525',
    borderRadius: '6px',
    fontSize: '12px',
  },
  toolName: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#ccc',
  },
  promptArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
    minHeight: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: '10px',
    color: '#555',
  },
  routingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '6px 0',
  },
  routingLabel: {
    fontSize: '11px',
    color: '#888',
  },
  routingValue: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#e0e0e0',
    textAlign: 'right' as const,
  },
  routingProvider: {
    fontSize: '10px',
    color: '#666',
  },
  metricGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '8px',
  },
  metricItem: {
    textAlign: 'center' as const,
    padding: '8px 4px',
    backgroundColor: '#252525',
    borderRadius: '6px',
  },
  metricValue: {
    fontSize: '16px',
    fontWeight: 700,
    display: 'block',
  },
  metricLabel: {
    fontSize: '10px',
    color: '#888',
    marginTop: '2px',
  },
  policyRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '4px 0',
    fontSize: '12px',
  },
  policyLabel: {
    color: '#888',
  },
  policyValue: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
});

// ---------------------------------------------------------------------------
// Mock data for tools in spec
// ---------------------------------------------------------------------------
const PLAYGROUND_TOOLS = [
  { id: 'salesforce', name: 'Salesforce', enabled: true },
  { id: 'zendesk', name: 'Zendesk', enabled: false },
  { id: 'servicenow', name: 'ServiceNow', enabled: false },
  { id: 'sql-db', name: 'SQL Database', enabled: false },
];

// ---------------------------------------------------------------------------
// Quick prompts
// ---------------------------------------------------------------------------
const QUICK_PROMPTS = [
  { label: 'Create support ticket', prompt: 'Create a new customer support ticket for customer #12345 who is reporting a billing discrepancy on their March invoice.' },
  { label: 'Triage incident', prompt: 'Triage incident INC-789: determine the severity, identify impacted services, and suggest a mitigation plan.' },
  { label: 'Generate report', prompt: 'Generate a quarterly performance report for Q1 2026 covering API usage trends, top consumers, and cost breakdown by model.' },
  { label: 'Look up customer', prompt: 'Look up customer #12345 in the CRM, retrieve their billing history for the past 6 months, and highlight any overdue invoices.' },
];

const MOCK_RESPONSES: Record<string, string> = {
  'Create support ticket': `Customer support ticket created successfully.

Case ID: 120384
Owner: Tier 1 Support
Status: Open
Priority: Medium
Customer: #12345 — Contoso Industries

Description: Billing discrepancy reported on March invoice.
Next action: Review invoice line items and respond within 24h SLA.`,
  'Triage incident': `## Incident INC-789 — Triage Complete

**Severity:** P1 (Critical)
**Duration:** 43 minutes
**Impacted Services:** API Gateway routing, Support Agent, Billing queries

**Root Cause:** Regression in deploy-gw-v2.14.3 token bucket algorithm.

**Mitigation:**
1. Rollback to v2.14.2 immediately
2. Disable adaptive rate limiting
3. Monitor error rates for 15 min post-rollback`,
  'Generate report': `## Q1 2026 Performance Report

**Total Requests:** 1.43M (+22% QoQ)
**Avg Latency:** 187ms (P95: 342ms)
**Error Rate:** 0.8%

**Cost by Model:**
- GPT-4o: $8,420 (58%)
- Claude 3.5: $2,040 (14%)
- Others: $4,040 (28%)

**Total Spend:** $14,500`,
  'Look up customer': `## Customer #12345 — Contoso Industries

**Status:** Active (Enterprise Tier)
**Contact:** Sarah Chen (sarah.chen@contoso-ind.com)

**Billing (Last 6 months):**
Mar 2026 — $12,450 ✅ Paid
Feb 2026 — $11,800 ✅ Paid
Jan 2026 — $13,200 ⚠️ Overdue (47 days)

**Alert:** January invoice overdue. Escalate to Finance.`,
};

const DEFAULT_RESPONSE = 'Request processed successfully. The model analyzed the prompt and generated a response based on the configured gateway policies and available tools.';

// ---------------------------------------------------------------------------
// Routing logic per model
// ---------------------------------------------------------------------------
function getRoutingDecision(modelName: string): RoutingDecision {
  if (modelName.includes('GPT-4o') || modelName.includes('gpt-4o')) {
    return {
      primary: 'GPT-4o',
      primaryProvider: 'OpenAI',
      fallback: 'Claude 3.5',
      fallbackProvider: 'Anthropic',
      reason: 'Cost-aware routing optimized for latency.',
    };
  }
  if (modelName.includes('Claude')) {
    return {
      primary: 'Claude 3.5',
      primaryProvider: 'Anthropic',
      fallback: 'GPT-4o-mini',
      fallbackProvider: 'OpenAI',
      reason: 'Quality-first routing with cost-effective fallback.',
    };
  }
  if (modelName.includes('Gemini')) {
    return {
      primary: 'Gemini 1.5',
      primaryProvider: 'Google',
      fallback: 'GPT-4o',
      fallbackProvider: 'OpenAI',
      reason: 'Multi-modal routing with high-capacity fallback.',
    };
  }
  return {
    primary: modelName,
    primaryProvider: '',
    fallback: 'GPT-4o-mini',
    fallbackProvider: 'OpenAI',
    reason: 'Default routing with cost-optimized fallback.',
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const activeModels = models.filter((m) => m.status === 'active');
const activeAgents = agents.filter((a) => a.status === 'active');

function findPromptKey(prompt: string): string | undefined {
  for (const qp of QUICK_PROMPTS) {
    if (prompt.includes(qp.prompt) || prompt.includes(qp.label)) return qp.label;
  }
  return undefined;
}

function randBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
const Playground: React.FC = () => {
  const styles = useStyles();

  // Config
  const [selectedModelId, setSelectedModelId] = useState<string>(activeModels[0]?.id || '');
  const [selectedAgentId, setSelectedAgentId] = useState<string>('');
  const [enabledTools, setEnabledTools] = useState<Record<string, boolean>>(
    Object.fromEntries(PLAYGROUND_TOOLS.map((t) => [t.id, t.enabled]))
  );
  const [prompt, setPrompt] = useState('');

  // Execution
  const [isRunning, setIsRunning] = useState(false);
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [runId, setRunId] = useState('');
  const [runTimestamp, setRunTimestamp] = useState('');
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [selectedStepIdx, setSelectedStepIdx] = useState<number>(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ summary: true });
  const [response, setResponse] = useState<string | null>(null);
  const [routing, setRouting] = useState<RoutingDecision | null>(null);
  const [obsMetrics, setObsMetrics] = useState<ObsMetrics | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [logJson, setLogJson] = useState('');
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const toggleTool = (id: string) => {
    setEnabledTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const reset = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setSelectedModelId(activeModels[0]?.id || '');
    setSelectedAgentId('');
    setEnabledTools(Object.fromEntries(PLAYGROUND_TOOLS.map((t) => [t.id, t.enabled])));
    setPrompt('');
    setIsRunning(false);
    setRunStatus('idle');
    setRunId('');
    setRunTimestamp('');
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setSelectedStepIdx(0);
    setExpandedSections({ summary: true });
    setResponse(null);
    setRouting(null);
    setObsMetrics(null);
    setHasRun(false);
    setLogJson('');
  }, []);

  const runExecution = useCallback(() => {
    if (!selectedModel || !prompt.trim()) return;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setSelectedStepIdx(0);
    setExpandedSections({ summary: true });
    setResponse(null);
    setObsMetrics(null);
    setIsRunning(true);
    setRunStatus('running');
    setHasRun(true);

    const rid = `run-${Date.now().toString(36).slice(-6)}`;
    setRunId(rid);
    setRunTimestamp(new Date().toLocaleTimeString('en-US', { hour12: false }));

    const modelName = selectedModel.name;
    const rd = getRoutingDecision(modelName);
    setRouting(rd);

    const activeToolNames = PLAYGROUND_TOOLS.filter((t) => enabledTools[t.id]).map((t) => t.name);
    const promptKey = findPromptKey(prompt);
    const namespace = selectedAgent ? 'retail-support' : 'default';

    const makeStep = (
      icon: string, label: string, type: StepType, color: string,
      summary: string, reqJson: string, resJson: string,
      headers: Record<string, string>, policies: string[]
    ): TraceStep => ({
      icon, label, type, color, done: false, duration: 0, summary,
      requestJson: reqJson, responseJson: resJson, headers, policies,
    });

    const steps: TraceStep[] = [
      makeStep('🔒', 'Gateway received', 'gateway', '#60cdff',
        `Request received by gateway. Namespace: ${namespace}. Route resolved.`,
        JSON.stringify({ method: 'POST', path: '/v1/chat/completions', namespace, model: rd.primary }, null, 2),
        JSON.stringify({ status: 'accepted', route: rd.primary }, null, 2),
        { 'x-request-id': rid, 'x-namespace': namespace, 'content-type': 'application/json', 'authorization': 'Bearer ey...redacted' },
        ['jwt-validation', 'rate-limit-check']
      ),
      makeStep('✅', 'Auth validated', 'auth', '#10b981',
        'JWT token validated. Identity resolved. Namespace membership confirmed.',
        JSON.stringify({ token_issuer: 'https://login.microsoftonline.com', audience: 'ai-gateway' }, null, 2),
        JSON.stringify({ authenticated: true, identity: 'jane@contoso.com', role: 'ai-developer' }, null, 2),
        { 'x-identity': 'jane@contoso.com', 'x-roles': 'ai-developer' },
        ['entra-token-validation', 'namespace-membership']
      ),
    ];

    if (selectedAgent) {
      steps.push(makeStep('🤖', `Agent: ${selectedAgent.name}`, 'agent', '#10b981',
        `Agent ${selectedAgent.name} started. Protocol: ${selectedAgent.protocol}. Orchestrating model + tools.`,
        JSON.stringify({ agent: selectedAgent.name, protocol: selectedAgent.protocol, models: selectedAgent.modelIds.length, tools: selectedAgent.toolIds.length }, null, 2),
        JSON.stringify({ status: 'orchestrating', plan: 'decompose → execute → synthesize' }, null, 2),
        { 'x-agent-id': selectedAgent.id, 'x-protocol': selectedAgent.protocol },
        ['agent-execution-limits']
      ));
    }

    steps.push(makeStep('🧠', `Model: ${rd.primary}`, 'model', '#6366f1',
      `Inference request sent to ${rd.primary} (${rd.primaryProvider}). Fallback: ${rd.fallback}.`,
      JSON.stringify({ model: rd.primary, temperature: 0.7, max_tokens: 4096, messages: [{ role: 'user', content: prompt.slice(0, 80) + '...' }] }, null, 2),
      JSON.stringify({ id: `chatcmpl-${rid}`, model: rd.primary, usage: { prompt_tokens: randBetween(200, 600), completion_tokens: randBetween(400, 1200) } }, null, 2),
      { 'x-model-region': 'eastus', 'x-model-deployment': rd.primary.toLowerCase().replace(/\s/g, '-') },
      ['token-quota', 'content-safety', 'model-routing']
    ));

    activeToolNames.forEach((name) => {
      steps.push(makeStep('🔧', `Tool: ${name}`, 'tool', '#0ea5e9',
        `Invoked ${name} API. Credential: managed identity. Latency within threshold.`,
        JSON.stringify({ tool: name, method: 'POST', endpoint: `/api/v1/${name.toLowerCase().replace(/\s/g, '-')}/invoke`, payload: { query: 'contextual data' } }, null, 2),
        JSON.stringify({ status: 200, result: { records: randBetween(1, 5), cached: false } }, null, 2),
        { 'x-tool-name': name, 'x-credential': 'managed-identity' },
        ['tool-rate-limit', 'credential-scope']
      ));
    });

    if (activeToolNames.length > 0) {
      steps.push(makeStep('🧠', 'Synthesizing results', 'model', '#6366f1',
        `Model synthesizing tool results into final response.`,
        JSON.stringify({ model: rd.primary, tool_results: activeToolNames.length, synthesis: true }, null, 2),
        JSON.stringify({ status: 'complete', tokens: randBetween(300, 800) }, null, 2),
        { 'x-synthesis': 'true' },
        ['content-safety']
      ));
    }

    steps.push(makeStep('✅', 'Response returned', 'response', '#10b981',
      `Request completed successfully. All policies passed.`,
      JSON.stringify({ status: 200, total_steps: steps.length + 1 }, null, 2),
      JSON.stringify({ status: 'succeeded', policies_applied: 6, violations: 0 }, null, 2),
      { 'x-total-latency-ms': String(randBetween(600, 1400)) },
      ['audit-log']
    ));

    // Assign mock durations
    steps.forEach((s, i) => {
      s.duration = i === 0 ? randBetween(5, 20) : (s.type === 'model' ? randBetween(200, 800) : (s.type === 'tool' ? randBetween(80, 300) : randBetween(10, 50)));
    });

    // Animate
    steps.forEach((_, i) => {
      const t1 = setTimeout(() => {
        setActiveStepIdx(i);
        setSelectedStepIdx(i);
        setTraceSteps((prev) => {
          const next = [...prev];
          if (i > 0 && next[i - 1]) next[i - 1] = { ...next[i - 1], done: true };
          if (!next[i]) next.push(steps[i]);
          return next;
        });
      }, i * 400);
      timeouts.current.push(t1);
    });

    const totalTime = steps.length * 400 + 250;
    const tf = setTimeout(() => {
      setTraceSteps((prev) => prev.map((s) => ({ ...s, done: true })));
      setActiveStepIdx(-1);
      setRunStatus('succeeded');
      setResponse(promptKey && MOCK_RESPONSES[promptKey] ? MOCK_RESPONSES[promptKey] : DEFAULT_RESPONSE);

      const cost = (Math.random() * 0.08 + 0.02).toFixed(2);
      const tokens = (Math.random() * 2 + 0.8).toFixed(2);
      const latency = randBetween(600, 1400);
      setObsMetrics({ cost: `$${cost}`, tokens: `${tokens}k`, latency: `${latency} ms` });

      setLogJson(JSON.stringify({
        request_id: rid,
        timestamp: new Date().toISOString(),
        model: rd.primary,
        namespace,
        status: 200,
        tokens_used: Math.round(parseFloat(tokens) * 1000),
        latency_ms: latency,
        tools_invoked: activeToolNames,
        steps: steps.map((s) => ({ label: s.label, type: s.type, duration_ms: s.duration })),
        policies: { rate_limit: 'pass', content_safety: 'pass', auth: 'pass', token_quota: 'pass' },
      }, null, 2));

      setIsRunning(false);
    }, totalTime);
    timeouts.current.push(tf);
  }, [selectedModel, prompt, enabledTools, selectedAgent]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div>
            <Text size={600} weight="bold" style={{ color: '#fff', display: 'block' }}>
              Azure AI Gateway Playground
            </Text>
            <Text size={200} style={{ color: '#888', display: 'block', marginTop: '2px' }}>
              Test AI models, tools, and agents through the gateway. Inspect routing, execution traces, and policies applied to each request.
            </Text>
          </div>
          <span className={styles.sandboxPill}>SANDBOX</span>
        </div>
        <Button icon={<ArrowReset24Regular />} appearance="subtle" size="small" onClick={reset}>Reset</Button>
      </div>

      {/* 3-Column Layout */}
      <div className={styles.columns}>
        {/* ===== LEFT: Prompt Panel ===== */}
        <div className={styles.leftPanel}>
          <div className={styles.panelLabel}>
            <Send24Regular style={{ fontSize: '16px', color: '#60cdff' }} />
            <Text size={300} weight="semibold" style={{ color: '#fff' }}>Prompt</Text>
          </div>

          {/* Model */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Model</span>
            <Dropdown
              placeholder="Select model..."
              value={selectedModel?.name ? `${selectedModel.provider} • ${selectedModel.name}` : ''}
              selectedOptions={selectedModelId ? [selectedModelId] : []}
              onOptionSelect={(_, data) => setSelectedModelId(data.optionValue as string)}
              style={{ width: '100%' }}
              size="small"
            >
              {activeModels.map((m) => (
                <Option key={m.id} value={m.id} text={`${m.provider} • ${m.name}`}>
                  {m.provider} • {m.name}
                </Option>
              ))}
            </Dropdown>
          </div>

          {/* Agent */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Agent</span>
            <Dropdown
              placeholder="None (direct model call)"
              value={selectedAgent?.name || ''}
              selectedOptions={selectedAgentId ? [selectedAgentId] : []}
              onOptionSelect={(_, data) => {
                const id = data.optionValue as string;
                setSelectedAgentId(id === selectedAgentId ? '' : id);
              }}
              style={{ width: '100%' }}
              size="small"
            >
              {activeAgents.map((a) => (
                <Option key={a.id} value={a.id} text={a.name}>{a.name}</Option>
              ))}
            </Dropdown>
          </div>

          {/* Tools */}
          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Tools</span>
            <div className={styles.toolList}>
              {PLAYGROUND_TOOLS.map((t) => (
                <div key={t.id} className={styles.toolRow}>
                  <span className={styles.toolName}>
                    <PlugConnected20Regular style={{ color: '#0ea5e9', fontSize: '14px' }} />
                    {t.name}
                  </span>
                  <Switch
                    checked={enabledTools[t.id] || false}
                    onChange={() => toggleTool(t.id)}
                    style={{ transform: 'scale(0.75)' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          {/* Prompt Input */}
          <div className={styles.promptArea}>
            <span className={styles.fieldLabel}>Prompt</span>
            <Textarea
              placeholder="Describe what you want to test..."
              value={prompt}
              onChange={(_, d) => setPrompt(d.value)}
              resize="vertical"
              style={{ width: '100%', minHeight: '80px', fontSize: '13px' }}
              size="small"
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {QUICK_PROMPTS.map((qp) => (
                <Badge
                  key={qp.label}
                  appearance="tint"
                  color="informative"
                  size="small"
                  style={{ cursor: 'pointer', fontSize: '10px' }}
                  onClick={() => setPrompt(qp.prompt)}
                >
                  {qp.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Send */}
          <Button
            appearance="primary"
            icon={<Play24Regular />}
            disabled={!selectedModel || !prompt.trim() || isRunning}
            onClick={runExecution}
            style={{ width: '100%' }}
          >
            {isRunning ? 'Running...' : 'Send Request'}
          </Button>
        </div>

        {/* ===== CENTER: Execution Tracker ===== */}
        <div className={styles.centerPanel}>
          {!hasRun && !isRunning ? (
            <div className={styles.emptyState}>
              <BrainCircuit24Regular style={{ fontSize: '40px' }} />
              <Text size={200} style={{ color: '#555' }}>Send a request to see the execution trace</Text>
            </div>
          ) : (
            <>
              {/* Run Header */}
              <div className={styles.runHeader}>
                <div className={styles.runHeaderLeft}>
                  <Badge
                    appearance="filled"
                    color={runStatus === 'running' ? 'warning' : runStatus === 'succeeded' ? 'success' : 'danger'}
                    size="small"
                  >
                    {runStatus === 'running' ? '● Running' : runStatus === 'succeeded' ? '✓ Succeeded' : '✕ Failed'}
                  </Badge>
                  <span className={styles.runMeta}>{runId}</span>
                  <span className={styles.runMeta}>{runTimestamp}</span>
                  <Badge appearance="outline" size="small" color="informative">
                    {selectedAgent ? selectedAgent.name : selectedModel?.name || 'model'}
                  </Badge>
                  <Badge appearance="outline" size="small">
                    ns:{selectedAgent ? 'retail-support' : 'default'}
                  </Badge>
                </div>
                <div className={styles.runHeaderRight}>
                  {obsMetrics && (
                    <>
                      <span className={styles.runMetricPill}>
                        <Timer24Regular style={{ fontSize: '12px' }} /> {obsMetrics.latency}
                      </span>
                      <span className={styles.runMetricPill}>
                        <DataUsageRegular style={{ fontSize: '12px' }} /> {obsMetrics.tokens}
                      </span>
                      <span className={styles.runMetricPill}>
                        <Money24Regular style={{ fontSize: '12px' }} /> {obsMetrics.cost}
                      </span>
                    </>
                  )}
                  {isRunning && <Spinner size="tiny" />}
                </div>
              </div>

              {/* 2-Pane Trace */}
              <div className={styles.tracePane}>
                {/* Left: Step list */}
                <div className={styles.traceList}>
                  {traceSteps.map((step, i) => {
                    const isActive = i === activeStepIdx;
                    const isFuture = !step.done && !isActive;
                    const isSelected = i === selectedStepIdx;
                    return (
                      <div
                        key={i}
                        className={
                          isFuture ? styles.traceListItemDisabled
                          : isSelected ? styles.traceListItemSelected
                          : styles.traceListItem
                        }
                        onClick={() => !isFuture && setSelectedStepIdx(i)}
                      >
                        <span className={styles.stepIconSmall}>
                          {isActive ? <Spinner size="extra-tiny" /> : step.done ? <CheckmarkCircle20Regular style={{ color: '#10b981', fontSize: '14px' }} /> : '○'}
                        </span>
                        <div className={styles.stepInfo}>
                          <div className={styles.stepName}>{step.label}</div>
                          <div className={styles.stepDuration}>
                            <Badge appearance="tint" size="small" color={
                              step.type === 'model' ? 'brand' : step.type === 'tool' ? 'informative' : step.type === 'agent' ? 'warning' : 'success'
                            }>{step.type}</Badge>
                            {step.done && <><Clock20Regular style={{ fontSize: '10px' }} /> {step.duration}ms</>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Right: Step detail */}
                <div className={styles.traceDetail}>
                  {traceSteps[selectedStepIdx] ? (() => {
                    const step = traceSteps[selectedStepIdx];
                    return (
                      <>
                        <div className={styles.detailHeader}>
                          <span style={{ fontSize: '16px' }}>{step.icon}</span>
                          <Text size={400} weight="semibold" style={{ color: '#fff' }}>{step.label}</Text>
                          <Badge appearance="tint" size="small" color={
                            step.type === 'model' ? 'brand' : step.type === 'tool' ? 'informative' : step.type === 'agent' ? 'warning' : 'success'
                          }>{step.type}</Badge>
                          {step.done && <Text size={200} style={{ color: '#666', marginLeft: 'auto' }}>{step.duration}ms</Text>}
                        </div>

                        {/* Summary — always open */}
                        <div className={styles.collapsible}>
                          <div className={styles.collapsibleHeader} onClick={() => toggleSection('summary')}>
                            {expandedSections.summary ? <ChevronDown20Regular style={{ fontSize: '14px' }} /> : <ChevronRight20Regular style={{ fontSize: '14px' }} />}
                            Summary
                          </div>
                          {expandedSections.summary && (
                            <div style={{ padding: '8px 10px', fontSize: '12px', color: '#bbb', lineHeight: '1.5' }}>
                              {step.summary}
                            </div>
                          )}
                        </div>

                        {/* Request */}
                        <div className={styles.collapsible}>
                          <div className={styles.collapsibleHeader} onClick={() => toggleSection('request')}>
                            {expandedSections.request ? <ChevronDown20Regular style={{ fontSize: '14px' }} /> : <ChevronRight20Regular style={{ fontSize: '14px' }} />}
                            Request
                          </div>
                          {expandedSections.request && (
                            <div className={styles.collapsibleBody}>{step.requestJson}</div>
                          )}
                        </div>

                        {/* Response */}
                        <div className={styles.collapsible}>
                          <div className={styles.collapsibleHeader} onClick={() => toggleSection('response')}>
                            {expandedSections.response ? <ChevronDown20Regular style={{ fontSize: '14px' }} /> : <ChevronRight20Regular style={{ fontSize: '14px' }} />}
                            Response
                          </div>
                          {expandedSections.response && (
                            <div className={styles.collapsibleBody}>{step.responseJson}</div>
                          )}
                        </div>

                        {/* Headers */}
                        <div className={styles.collapsible}>
                          <div className={styles.collapsibleHeader} onClick={() => toggleSection('headers')}>
                            {expandedSections.headers ? <ChevronDown20Regular style={{ fontSize: '14px' }} /> : <ChevronRight20Regular style={{ fontSize: '14px' }} />}
                            Headers
                          </div>
                          {expandedSections.headers && (
                            <div className={styles.collapsibleBody}>
                              {Object.entries(step.headers).map(([k, v]) => `${k}: ${v}`).join('\n')}
                            </div>
                          )}
                        </div>

                        {/* Policies */}
                        <div className={styles.collapsible}>
                          <div className={styles.collapsibleHeader} onClick={() => toggleSection('policies')}>
                            {expandedSections.policies ? <ChevronDown20Regular style={{ fontSize: '14px' }} /> : <ChevronRight20Regular style={{ fontSize: '14px' }} />}
                            Policies Applied ({step.policies.length})
                          </div>
                          {expandedSections.policies && (
                            <div className={styles.policyChips}>
                              {step.policies.map((p) => (
                                <Badge key={p} appearance="tint" color="success" size="small">{p}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })() : (
                    <Text size={200} style={{ color: '#555' }}>Select a step to view details</Text>
                  )}
                </div>
              </div>

              {/* Final Response */}
              {response && (
                <div className={styles.finalResponseCard}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <Send24Regular style={{ fontSize: '16px', color: '#10b981' }} />
                    <Text size={300} weight="semibold" style={{ color: '#fff' }}>Final Response</Text>
                  </div>
                  <div style={{
                    fontFamily: '"Cascadia Code", monospace', fontSize: '12px', lineHeight: '1.6',
                    color: '#e6edf3', whiteSpace: 'pre-wrap', maxHeight: '160px', overflowY: 'auto',
                  }}>
                    {response}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                    <Button appearance="subtle" size="small" icon={<ArrowRepeatAll24Regular />} onClick={runExecution}>
                      Replay
                    </Button>
                    <Button appearance="subtle" size="small" icon={<Copy24Regular />}
                      onClick={() => navigator.clipboard.writeText(logJson)}>
                      Copy Trace JSON
                    </Button>
                    <Button appearance="subtle" size="small" icon={<Code24Regular />}
                      onClick={() => { setExpandedSections((p) => ({ ...p, rawLogs: !p.rawLogs })); }}>
                      {expandedSections.rawLogs ? 'Hide Raw Logs' : 'View Raw Logs'}
                    </Button>
                  </div>
                  {expandedSections.rawLogs && logJson && (
                    <div style={{
                      marginTop: '8px', padding: '8px', backgroundColor: '#0a0e14', border: '1px solid #252525',
                      borderRadius: '6px', fontFamily: '"Cascadia Code", monospace', fontSize: '11px',
                      color: '#8b949e', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto', lineHeight: '1.4',
                    }}>
                      {logJson}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* ===== RIGHT: Routing + Observability + Policies ===== */}
        <div className={styles.rightPanel}>
          {/* Routing Decisions */}
          <div className={styles.panelLabel}>
            <ArrowRouting24Regular style={{ fontSize: '16px', color: '#f59e0b' }} />
            <Text size={300} weight="semibold" style={{ color: '#fff' }}>Model Routing Decisions</Text>
          </div>
          <div className={styles.card}>
            {routing ? (
              <>
                <div className={styles.routingRow}>
                  <span className={styles.routingLabel}>Primary Model</span>
                  <div>
                    <span className={styles.routingValue}>{routing.primary}</span>
                    <div className={styles.routingProvider}>{routing.primaryProvider}</div>
                  </div>
                </div>
                <Divider style={{ margin: '4px 0' }} />
                <div className={styles.routingRow}>
                  <span className={styles.routingLabel}>Fallback Model</span>
                  <div>
                    <span className={styles.routingValue}>{routing.fallback}</span>
                    <div className={styles.routingProvider}>{routing.fallbackProvider}</div>
                  </div>
                </div>
                <Divider style={{ margin: '4px 0' }} />
                <div style={{ padding: '4px 0' }}>
                  <span className={styles.routingLabel}>Reason</span>
                  <Text size={200} style={{ color: '#aaa', display: 'block', marginTop: '2px' }}>{routing.reason}</Text>
                </div>
              </>
            ) : (
              <Text size={200} style={{ color: '#555' }}>Send a request to see routing decisions</Text>
            )}
          </div>

          {/* Observability */}
          <div className={styles.panelLabel} style={{ marginTop: '4px' }}>
            <DataUsageRegular style={{ fontSize: '16px', color: '#7c3aed' }} />
            <Text size={300} weight="semibold" style={{ color: '#fff' }}>Observability</Text>
          </div>
          <div className={styles.card}>
            {obsMetrics ? (
              <div className={styles.metricGrid}>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue} style={{ color: '#10b981' }}>
                    <Money24Regular style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '2px' }} />
                    {obsMetrics.cost}
                  </span>
                  <div className={styles.metricLabel}>Cost</div>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue} style={{ color: '#6366f1' }}>
                    <DataUsageRegular style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '2px' }} />
                    {obsMetrics.tokens}
                  </span>
                  <div className={styles.metricLabel}>Tokens</div>
                </div>
                <div className={styles.metricItem}>
                  <span className={styles.metricValue} style={{ color: '#f59e0b' }}>
                    <Timer24Regular style={{ fontSize: '14px', verticalAlign: 'middle', marginRight: '2px' }} />
                    {obsMetrics.latency}
                  </span>
                  <div className={styles.metricLabel}>Latency</div>
                </div>
              </div>
            ) : (
              <Text size={200} style={{ color: '#555' }}>Metrics appear after each request</Text>
            )}
          </div>

          {/* Policies Applied */}
          <div className={styles.panelLabel} style={{ marginTop: '4px' }}>
            <Shield24Regular style={{ fontSize: '16px', color: '#0ea5e9' }} />
            <Text size={300} weight="semibold" style={{ color: '#fff' }}>Policies Applied</Text>
          </div>
          <div className={styles.card}>
            <div className={styles.policyRow}>
              <span className={styles.policyLabel}>Rate Limit</span>
              <span className={styles.policyValue}>100 req/min</span>
            </div>
            <Divider style={{ margin: '2px 0' }} />
            <div className={styles.policyRow}>
              <span className={styles.policyLabel}>Content Safety</span>
              <Badge appearance="tint" color="success" size="small">Enabled</Badge>
            </div>
            <Divider style={{ margin: '2px 0' }} />
            <div className={styles.policyRow}>
              <span className={styles.policyLabel}>Token Quota</span>
              <span className={styles.policyValue}>2M / month</span>
            </div>
            <Divider style={{ margin: '2px 0' }} />
            <div className={styles.policyRow}>
              <span className={styles.policyLabel}>Auth</span>
              <Badge appearance="tint" color="success" size="small">JWT Validated</Badge>
            </div>
            <Divider style={{ margin: '2px 0' }} />
            <div className={styles.policyRow}>
              <span className={styles.policyLabel}>Namespace</span>
              <span className={styles.policyValue}>{selectedAgent ? 'retail-support' : 'default'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;
