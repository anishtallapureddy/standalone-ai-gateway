import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Switch,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Shield24Regular,
  ShieldCheckmark24Regular,
  HeartPulse24Regular,
  Clock24Regular,
  Checkmark24Regular,
  Dismiss24Regular,
  CheckmarkCircle24Regular,
  DismissCircle24Regular,
  Warning24Regular,
  Info24Regular,
  ErrorCircle24Regular,
  ArrowSync24Regular,
  Eye24Regular,
  ShieldLock24Regular,
  Key24Regular,
  LockClosed24Regular,
  ArrowRouting24Regular,
  Bot24Regular,
} from '@fluentui/react-icons';
import {
  policies,
  governanceRules,
  pendingApprovals,
  raiGuardrails,
} from '../data/mockData';
import type { PolicyCategory } from '../data/mockData';

const useStyles = makeStyles({
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    padding: '16px 24px',
    textAlign: 'center' as const,
    flex: 1,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  tabs: {
    marginBottom: '20px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  card: {
    padding: '0',
  },
  // Design-time rules
  ruleCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  ruleHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  ruleLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  ruleIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ruleMeta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginTop: '8px',
    flexWrap: 'wrap',
  },
  // Approvals
  approvalRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  approvalInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  approvalActions: {
    display: 'flex',
    gap: '8px',
  },
  // RAI guardrails
  guardrailCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  guardrailHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  guardrailLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flex: 1,
  },
  guardrailIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  guardrailStats: {
    display: 'flex',
    gap: '20px',
    marginTop: '10px',
    alignItems: 'center',
  },
  guardrailStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
});

const targetColors: Record<string, 'brand' | 'success' | 'informative' | 'warning' | 'danger'> = {
  models: 'brand',
  tools: 'informative',
  agents: 'success',
  global: 'warning',
  'mcp-servers': 'danger',
};

const policyCategoryConfig: Record<PolicyCategory, { icon: React.ReactElement; label: string; color: string; bg: string }> = {
  authentication: { icon: <Key24Regular />, label: 'Authentication', color: '#60cdff', bg: '#1a2d4d' },
  credentials: { icon: <LockClosed24Regular />, label: 'Credentials', color: '#c084fc', bg: '#2d1a4d' },
  'rate-limits': { icon: <Clock24Regular />, label: 'Rate Limits & Quotas', color: '#fbbf24', bg: '#3d2800' },
  'content-safety': { icon: <Shield24Regular />, label: 'Content Safety', color: '#f87171', bg: '#3d1a1a' },
  routing: { icon: <ArrowRouting24Regular />, label: 'Routing & Transformation', color: '#4ade80', bg: '#1a3a2a' },
  'agent-execution': { icon: <Bot24Regular />, label: 'Agent Execution', color: '#38bdf8', bg: '#1a2d3d' },
};

const severityConfig: Record<string, { icon: React.ReactElement; color: string; bg: string }> = {
  error: { icon: <ErrorCircle24Regular />, color: '#f87171', bg: '#3d1a1a' },
  warning: { icon: <Warning24Regular />, color: '#fbbf24', bg: '#3d2800' },
  info: { icon: <Info24Regular />, color: '#60cdff', bg: '#1a2d4d' },
};

const categoryLabels: Record<string, string> = {
  registration: 'Registration',
  schema: 'Schema Validation',
  approval: 'Approval Workflow',
  naming: 'Naming Convention',
  security: 'Security',
  compliance: 'Compliance',
};

const assetTypeColors: Record<string, 'brand' | 'success' | 'informative' | 'warning' | 'danger'> = {
  model: 'brand',
  tool: 'informative',
  'mcp-server': 'success',
  agent: 'warning',
  skill: 'danger',
};

const approvalStatusConfig: Record<string, { icon: React.ReactElement; color: string }> = {
  pending: { icon: <Clock24Regular />, color: '#f59e0b' },
  approved: { icon: <CheckmarkCircle24Regular />, color: '#10b981' },
  rejected: { icon: <DismissCircle24Regular />, color: '#ef4444' },
};

const raiCategoryConfig: Record<string, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  'content-safety': { icon: <Shield24Regular />, color: '#f87171', bg: '#3d1a1a', label: 'Content Safety' },
  'pii-protection': { icon: <ShieldLock24Regular />, color: '#c084fc', bg: '#2d1a4d', label: 'PII Protection' },
  jailbreak: { icon: <ErrorCircle24Regular />, color: '#fb923c', bg: '#3d2200', label: 'Jailbreak Defense' },
  hallucination: { icon: <Eye24Regular />, color: '#38bdf8', bg: '#1a2d3d', label: 'Groundedness' },
  fairness: { icon: <ArrowSync24Regular />, color: '#4ade80', bg: '#1a3a2a', label: 'Fairness & Bias' },
  transparency: { icon: <Info24Regular />, color: '#a78bfa', bg: '#1e1a3d', label: 'Transparency' },
};

const severityActionConfig: Record<string, { color: string; bg: string; label: string }> = {
  block: { color: '#f87171', bg: '#3d1a1a', label: '🛑 Block' },
  warn: { color: '#fbbf24', bg: '#3d2800', label: '⚠️ Warn' },
  log: { color: '#a78bfa', bg: '#1e1a3d', label: '📝 Log' },
};

const Policies: React.FC = () => {
  const styles = useStyles();
  const [tab, setTab] = useState('runtime');

  const runtimePolicies = policies.filter(p => p.phase === 'runtime');
  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;
  const totalViolations = governanceRules.reduce((sum, r) => sum + r.violations24h, 0);
  const raiBlockedToday = raiGuardrails.reduce((sum, g) => sum + g.blockedToday, 0);
  const raiTriggersToday = raiGuardrails.reduce((sum, g) => sum + g.triggersToday, 0);

  return (
    <div>
      {/* Stats */}
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#0ea5e9' }}>{runtimePolicies.length}</div>
          <div className={styles.statLabel}>Runtime Rules</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#6366f1' }}>{governanceRules.length}</div>
          <div className={styles.statLabel}>Design-Time Rules</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{raiGuardrails.length}</div>
          <div className={styles.statLabel}>RAI Guardrails</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{pendingCount}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{totalViolations + raiBlockedToday}</div>
          <div className={styles.statLabel}>Violations (24h)</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <TabList selectedValue={tab} onTabSelect={(_, data) => setTab(data.value as string)}>
          <Tab value="runtime" icon={<Shield24Regular />}>
            Runtime Rules ({runtimePolicies.length})
          </Tab>
          <Tab value="design-time" icon={<ShieldCheckmark24Regular />}>
            Asset Governance ({governanceRules.length})
          </Tab>
          <Tab value="rai" icon={<HeartPulse24Regular />}>
            RAI Guardrails ({raiGuardrails.length})
          </Tab>
        </TabList>
      </div>

      {/* =================== RUNTIME RULES TAB =================== */}
      {tab === 'runtime' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#999' }}>
              {runtimePolicies.length} runtime policies across 6 categories · {runtimePolicies.filter(p => p.enabled).length} enabled
            </Text>
            <Button appearance="primary" icon={<Add24Regular />}>Create Runtime Policy</Button>
          </div>

          {(['authentication', 'credentials', 'rate-limits', 'content-safety', 'routing', 'agent-execution'] as PolicyCategory[]).map(cat => {
            const catPolicies = runtimePolicies.filter(p => p.category === cat);
            if (catPolicies.length === 0) return null;
            const catConfig = policyCategoryConfig[cat];

            return (
              <div key={cat} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    backgroundColor: catConfig.bg, color: catConfig.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {catConfig.icon}
                  </div>
                  <Text weight="semibold" size={400}>{catConfig.label}</Text>
                  <Badge appearance="outline" size="small">{catPolicies.length}</Badge>
                </div>

                {catPolicies.map(policy => (
                  <Card key={policy.id} className={styles.ruleCard}>
                    <div className={styles.ruleHeader}>
                      <div className={styles.ruleLeft}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Text weight="semibold" size={300}>{policy.name}</Text>
                            <Badge appearance="tint" color={targetColors[policy.target] || 'informative'} size="small">
                              {policy.target}
                            </Badge>
                            {policy.namespace !== 'global' && (
                              <Badge appearance="outline" size="small" style={{ fontFamily: 'monospace' }}>
                                {policy.namespace}
                              </Badge>
                            )}
                          </div>
                          <Text size={200} style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                            {policy.description}
                          </Text>
                          <div className={styles.ruleMeta}>
                            <Text size={200} style={{ color: '#999' }}>
                              {policy.ruleCount} rule{policy.ruleCount !== 1 ? 's' : ''} · applied to {policy.appliedTo} asset{policy.appliedTo !== 1 ? 's' : ''}
                            </Text>
                            <Badge appearance="tint" size="small" color={policy.namespace === 'global' ? 'warning' : 'informative'}>
                              {policy.namespace === 'global' ? 'All namespaces' : policy.namespace}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Switch checked={policy.enabled} />
                    </div>
                  </Card>
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* =================== DESIGN-TIME RULES TAB =================== */}
      {tab === 'design-time' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#999' }}>
              Asset lifecycle rules enforced when assets are registered, updated, published, or deprecated
            </Text>
            <div style={{ display: 'flex', gap: '8px' }}>
              {pendingCount > 0 && (
                <Button
                  appearance="outline"
                  icon={<Clock24Regular />}
                  onClick={() => setTab('design-time-approvals')}
                >
                  {pendingCount} Pending Approvals
                </Button>
              )}
              <Button appearance="primary" icon={<Add24Regular />}>Create Rule</Button>
            </div>
          </div>

          {governanceRules.map((rule) => {
            const sev = severityConfig[rule.severity] || severityConfig.info;
            return (
              <Card key={rule.id} className={styles.ruleCard}>
                <div className={styles.ruleHeader}>
                  <div className={styles.ruleLeft}>
                    <div className={styles.ruleIcon} style={{ backgroundColor: sev.bg, color: sev.color }}>
                      {sev.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text weight="semibold" size={300}>{rule.name}</Text>
                        <Badge appearance="outline" size="small">{categoryLabels[rule.category]}</Badge>
                        <Badge appearance="filled" size="small" style={{ backgroundColor: sev.color, color: '#fff' }}>
                          {rule.severity}
                        </Badge>
                        {rule.autoEnforce && (
                          <Badge appearance="tint" color="brand" size="small">auto-enforce</Badge>
                        )}
                      </div>
                      <Text size={200} style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                        {rule.description}
                      </Text>
                      <div className={styles.ruleMeta}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <Text size={200} style={{ color: '#999' }}>Applies to:</Text>
                          {rule.appliesTo.map(t => (
                            <Badge key={t} appearance="tint" color={assetTypeColors[t]} size="small">{t}</Badge>
                          ))}
                        </div>
                        {rule.namespaces.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <Text size={200} style={{ color: '#999' }}>Namespaces:</Text>
                            {rule.namespaces.map(ns => (
                              <Badge key={ns} appearance="outline" size="small">{ns}</Badge>
                            ))}
                          </div>
                        )}
                        {rule.namespaces.length === 0 && (
                          <Text size={200} style={{ color: '#999' }}>All namespaces</Text>
                        )}
                        {rule.violations24h > 0 && (
                          <Badge appearance="filled" color="danger" size="small">
                            {rule.violations24h} violation{rule.violations24h > 1 ? 's' : ''} (24h)
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch checked={rule.enabled} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* =================== DESIGN-TIME APPROVALS SUB-TAB =================== */}
      {tab === 'design-time-approvals' && (
        <div>
          <div className={styles.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                appearance="subtle"
                size="small"
                onClick={() => setTab('design-time')}
              >
                ← Back to Rules
              </Button>
              <Text size={300} style={{ color: '#999' }}>
                Review and approve asset changes that triggered governance rules
              </Text>
            </div>
          </div>
          <Card style={{ padding: 0 }}>
            {pendingApprovals.map((approval) => {
              const statusConf = approvalStatusConfig[approval.status] || approvalStatusConfig.pending;
              return (
                <div key={approval.id} className={styles.approvalRow}>
                  <div className={styles.approvalInfo}>
                    <div style={{ color: statusConf.color }}>{statusConf.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text weight="semibold">{approval.assetName}</Text>
                        <Badge appearance="tint" color={assetTypeColors[approval.assetType]} size="small">
                          {approval.assetType}
                        </Badge>
                        <Badge appearance="outline" size="small">{approval.action}</Badge>
                      </div>
                      <Text size={200} style={{ color: '#999', display: 'block', marginTop: '2px' }}>
                        in <b>{approval.namespace}</b> · requested by {approval.requestedBy} · rule: {approval.ruleTriggered}
                      </Text>
                    </div>
                    <Text size={200} style={{ color: '#999', whiteSpace: 'nowrap' }}>
                      {new Date(approval.requestedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </div>
                  {approval.status === 'pending' && (
                    <div className={styles.approvalActions}>
                      <Button appearance="primary" icon={<Checkmark24Regular />} size="small">Approve</Button>
                      <Button appearance="secondary" icon={<Dismiss24Regular />} size="small">Reject</Button>
                    </div>
                  )}
                  {approval.status !== 'pending' && (
                    <Badge
                      appearance="filled"
                      color={approval.status === 'approved' ? 'success' : 'danger'}
                    >
                      {approval.status}
                    </Badge>
                  )}
                </div>
              );
            })}
          </Card>
        </div>
      )}

      {/* =================== RAI GUARDRAILS TAB =================== */}
      {tab === 'rai' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#999' }}>
              {raiGuardrails.length} guardrails · {raiTriggersToday.toLocaleString()} triggers today · {raiBlockedToday} blocked
            </Text>
            <Button appearance="primary" icon={<Add24Regular />}>Create Guardrail</Button>
          </div>

          {raiGuardrails.map((guardrail) => {
            const cat = raiCategoryConfig[guardrail.category] || raiCategoryConfig['content-safety'];
            const sevAction = severityActionConfig[guardrail.severity] || severityActionConfig.log;
            return (
              <Card key={guardrail.id} className={styles.guardrailCard}>
                <div className={styles.guardrailHeader}>
                  <div className={styles.guardrailLeft}>
                    <div className={styles.guardrailIcon} style={{ backgroundColor: cat.bg, color: cat.color }}>
                      {cat.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text weight="semibold" size={300}>{guardrail.name}</Text>
                        <Badge appearance="outline" size="small">{cat.label}</Badge>
                        <Badge
                          appearance="filled"
                          size="small"
                          style={{ backgroundColor: sevAction.bg, color: sevAction.color, border: `1px solid ${sevAction.color}` }}
                        >
                          {sevAction.label}
                        </Badge>
                        <Badge appearance="tint" color="informative" size="small">
                          {guardrail.target === 'both' ? 'input + output' : guardrail.target}
                        </Badge>
                        <Badge appearance="outline" size="small" style={{ fontFamily: 'monospace' }}>
                          {guardrail.namespace === 'global' ? 'all namespaces' : guardrail.namespace}
                        </Badge>
                      </div>
                      <Text size={200} style={{ color: '#999', marginTop: '4px', display: 'block' }}>
                        {guardrail.description}
                      </Text>
                      <div className={styles.guardrailStats}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <Text size={200} style={{ color: '#999' }}>Applies to:</Text>
                          {guardrail.appliesTo.map(t => (
                            <Badge key={t} appearance="tint" color={targetColors[t] || 'informative'} size="small">{t}</Badge>
                          ))}
                        </div>
                        <div className={styles.guardrailStat}>
                          <Text size={200} style={{ color: '#999' }}>Triggers today:</Text>
                          <Text size={200} weight="semibold">{guardrail.triggersToday.toLocaleString()}</Text>
                        </div>
                        {guardrail.blockedToday > 0 && (
                          <Badge appearance="filled" color="danger" size="small">
                            {guardrail.blockedToday} blocked
                          </Badge>
                        )}
                        {guardrail.lastTriggered && (
                          <Text size={200} style={{ color: '#999' }}>
                            Last: {new Date(guardrail.lastTriggered).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        )}
                      </div>
                    </div>
                  </div>
                  <Switch checked={guardrail.enabled} />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Policies;
