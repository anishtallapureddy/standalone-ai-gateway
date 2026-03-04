import React, { useState } from 'react';
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
} from '@fluentui/react-components';
import { Send24Regular, BrainCircuit24Regular } from '@fluentui/react-icons';
import { models } from '../data/mockData';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    height: 'calc(100vh - 140px)',
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  card: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
});

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

const Playground: React.FC = () => {
  const styles = useStyles();
  const [selectedModel, setSelectedModel] = useState<string>('model-1');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [lastStats, setLastStats] = useState<{ latency: number; tokensIn: number; tokensOut: number } | null>(null);

  const activeModels = models.filter(m => m.status === 'active');
  const selectedModelData = models.find(m => m.id === selectedModel);

  const handleSend = (): void => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setResponse('');
    setLastStats(null);

    // Simulate API call
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

  return (
    <div className={styles.container}>
      {/* Left: Input */}
      <div className={styles.panel}>
        <Card className={styles.card}>
          <Text weight="semibold" size={300} style={{ marginBottom: '8px' }}>Configuration</Text>
          <div className={styles.configRow}>
            <div className={styles.configItem}>
              <span className={styles.label}>Model</span>
              <Dropdown
                value={selectedModelData?.name || ''}
                onOptionSelect={(_, data) => setSelectedModel(data.optionValue || 'model-1')}
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
                <Badge
                  key={sp.label}
                  appearance="tint"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setPrompt(sp.prompt)}
                >
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
            <Button
              appearance="primary"
              icon={<Send24Regular />}
              onClick={handleSend}
              disabled={isLoading || !prompt.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Request'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Right: Response */}
      <div className={styles.panel}>
        <Card className={styles.card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <Text weight="semibold" size={300}>Response</Text>
            {selectedModelData && (
              <Badge appearance="outline">{selectedModelData.provider}</Badge>
            )}
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
  );
};

export default Playground;
