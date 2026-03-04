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
} from '@fluentui/react-icons';
import { models, agents } from '../data/mockData';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface TraceStep {
  icon: string;
  label: string;
  detail?: string;
  meta?: string;
  color: string;
  done: boolean;
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
    padding: '14px 16px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
  traceTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  stepRow: {
    display: 'flex',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '6px',
    backgroundColor: '#1a1a2e',
    alignItems: 'flex-start',
    transition: 'all 0.15s',
  },
  stepRowActive: {
    display: 'flex',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '6px',
    backgroundColor: '#1a1a3e',
    alignItems: 'flex-start',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.15)',
  },
  stepIcon: {
    fontSize: '14px',
    lineHeight: '20px',
    flexShrink: 0,
  },
  stepContent: {
    flex: 1,
    minWidth: 0,
  },
  stepLabel: {
    fontSize: '12px',
    color: '#e0e0e0',
    lineHeight: '18px',
  },
  stepMeta: {
    fontSize: '11px',
    color: '#666',
    marginTop: '1px',
  },
  stepDetail: {
    fontSize: '11px',
    color: '#6b7280',
    fontFamily: '"Cascadia Code", monospace',
    marginTop: '2px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  responseCard: {
    padding: '14px',
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '8px',
  },
  responseBody: {
    fontFamily: '"Cascadia Code", "Fira Code", monospace',
    fontSize: '12px',
    lineHeight: '1.6',
    color: '#e6edf3',
    whiteSpace: 'pre-wrap',
    maxHeight: '200px',
    overflowY: 'auto',
  },
  responseActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
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
  logPanel: {
    backgroundColor: '#0d1117',
    border: '1px solid #30363d',
    borderRadius: '6px',
    padding: '10px',
    fontFamily: '"Cascadia Code", monospace',
    fontSize: '11px',
    color: '#8b949e',
    maxHeight: '140px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.5',
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
  const [traceSteps, setTraceSteps] = useState<TraceStep[]>([]);
  const [activeStepIdx, setActiveStepIdx] = useState(-1);
  const [response, setResponse] = useState<string | null>(null);
  const [routing, setRouting] = useState<RoutingDecision | null>(null);
  const [obsMetrics, setObsMetrics] = useState<ObsMetrics | null>(null);
  const [hasRun, setHasRun] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logJson, setLogJson] = useState('');
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedModel = models.find((m) => m.id === selectedModelId);
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  const toggleTool = (id: string) => {
    setEnabledTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reset = useCallback(() => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setSelectedModelId(activeModels[0]?.id || '');
    setSelectedAgentId('');
    setEnabledTools(Object.fromEntries(PLAYGROUND_TOOLS.map((t) => [t.id, t.enabled])));
    setPrompt('');
    setIsRunning(false);
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setResponse(null);
    setRouting(null);
    setObsMetrics(null);
    setHasRun(false);
    setShowLogs(false);
    setLogJson('');
  }, []);

  const runExecution = useCallback(() => {
    if (!selectedModel || !prompt.trim()) return;

    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
    setTraceSteps([]);
    setActiveStepIdx(-1);
    setResponse(null);
    setObsMetrics(null);
    setShowLogs(false);
    setIsRunning(true);
    setHasRun(true);

    const modelName = selectedModel.name;
    const rd = getRoutingDecision(modelName);
    setRouting(rd);

    const activeToolNames = PLAYGROUND_TOOLS.filter((t) => enabledTools[t.id]).map((t) => t.name);
    const promptKey = findPromptKey(prompt);
    const namespace = selectedAgent ? 'retail-support' : 'default';

    const steps: TraceStep[] = [
      { icon: '🔒', label: 'Gateway received request', meta: `Namespace: ${namespace}`, color: '#60cdff', done: false },
      { icon: '✅', label: 'Authentication validated', meta: 'JWT token verified', color: '#10b981', done: false },
      { icon: '🧠', label: 'Model execution', meta: `Model: ${rd.primary}`, color: '#6366f1', done: false },
    ];

    if (activeToolNames.length > 0) {
      activeToolNames.forEach((name) => {
        steps.push({
          icon: '🔧',
          label: 'Tool invocation',
          meta: `Tool: ${name} API`,
          detail: `POST /services/data/v${randBetween(50, 60)}/invoke`,
          color: '#0ea5e9',
          done: false,
        });
      });
      steps.push({ icon: '🧠', label: 'Model synthesizing results', color: '#6366f1', done: false });
    }

    if (selectedAgent) {
      steps.splice(2, 0, { icon: '🤖', label: `Agent: ${selectedAgent.name}`, meta: 'Orchestrating model + tools', color: '#10b981', done: false });
    }

    steps.push({ icon: '✅', label: 'Response returned', meta: `${steps.length * randBetween(80, 160)}ms total`, color: '#10b981', done: false });

    // Animate
    steps.forEach((_, i) => {
      const t1 = setTimeout(() => {
        setActiveStepIdx(i);
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
      setResponse(promptKey && MOCK_RESPONSES[promptKey] ? MOCK_RESPONSES[promptKey] : DEFAULT_RESPONSE);

      const cost = (Math.random() * 0.08 + 0.02).toFixed(2);
      const tokens = (Math.random() * 2 + 0.8).toFixed(2);
      const latency = randBetween(600, 1400);
      setObsMetrics({ cost: `$${cost}`, tokens: `${tokens}k`, latency: `${latency} ms` });

      setLogJson(JSON.stringify({
        request_id: `req-${Date.now().toString(36)}`,
        timestamp: new Date().toISOString(),
        model: rd.primary,
        namespace,
        status: 200,
        tokens_used: Math.round(parseFloat(tokens) * 1000),
        latency_ms: latency,
        tools_invoked: activeToolNames,
        policies: { rate_limit: 'pass', content_safety: 'pass', auth: 'pass' },
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

        {/* ===== CENTER: Execution Trace + Response ===== */}
        <div className={styles.centerPanel}>
          <div className={styles.panelLabel}>
            <BrainCircuit24Regular style={{ fontSize: '16px', color: '#6366f1' }} />
            <Text size={300} weight="semibold" style={{ color: '#fff' }}>Execution Trace</Text>
            {isRunning && <Spinner size="tiny" style={{ marginLeft: '4px' }} />}
          </div>

          {!hasRun && !isRunning ? (
            <div className={styles.emptyState}>
              <BrainCircuit24Regular style={{ fontSize: '40px' }} />
              <Text size={200} style={{ color: '#555' }}>Send a request to see the execution trace</Text>
            </div>
          ) : (
            <>
              {/* Trace Steps */}
              <div className={styles.traceTimeline}>
                {traceSteps.map((step, i) => (
                  <div
                    key={i}
                    className={i === activeStepIdx ? styles.stepRowActive : styles.stepRow}
                    style={{ borderLeft: `3px solid ${step.color}`, opacity: step.done || i === activeStepIdx ? 1 : 0.4 }}
                  >
                    <span className={styles.stepIcon}>{step.icon}</span>
                    <div className={styles.stepContent}>
                      <div className={styles.stepLabel}>{step.label}</div>
                      {step.meta && <div className={styles.stepMeta}>{step.meta}</div>}
                      {step.detail && <div className={styles.stepDetail}>{step.detail}</div>}
                    </div>
                    {i === activeStepIdx && <Spinner size="tiny" />}
                    {step.done && <CheckmarkCircle20Regular style={{ color: '#10b981', fontSize: '16px', flexShrink: 0 }} />}
                  </div>
                ))}
              </div>

              {/* View Logs */}
              {hasRun && !isRunning && (
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<Code24Regular />}
                  onClick={() => setShowLogs((p) => !p)}
                  style={{ alignSelf: 'flex-start', padding: '2px 8px' }}
                >
                  {showLogs ? 'Hide Logs' : 'View Logs'}
                </Button>
              )}
              {showLogs && logJson && (
                <div className={styles.logPanel}>{logJson}</div>
              )}

              {/* Response */}
              {response && (
                <>
                  <div className={styles.panelLabel} style={{ marginTop: '4px' }}>
                    <Send24Regular style={{ fontSize: '16px', color: '#10b981' }} />
                    <Text size={300} weight="semibold" style={{ color: '#fff' }}>Response</Text>
                  </div>
                  <div className={styles.responseCard}>
                    <div className={styles.responseBody}>{response}</div>
                    <div className={styles.responseActions}>
                      <Button
                        appearance="subtle"
                        size="small"
                        icon={<ArrowRepeatAll24Regular />}
                        onClick={runExecution}
                      >
                        Replay Request
                      </Button>
                    </div>
                  </div>
                </>
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
