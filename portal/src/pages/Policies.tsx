import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
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
} from '@fluentui/react-icons';
import {
  policies,
  governanceRules,
  pendingApprovals,
  raiGuardrails,
} from '../data/mockData';

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

const severityConfig: Record<string, { icon: React.ReactElement; color: string; bg: string }> = {
  error: { icon: <ErrorCircle24Regular />, color: '#ef4444', bg: '#fef2f2' },
  warning: { icon: <Warning24Regular />, color: '#f59e0b', bg: '#fffbeb' },
  info: { icon: <Info24Regular />, color: '#3b82f6', bg: '#eff6ff' },
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
  'content-safety': { icon: <Shield24Regular />, color: '#ef4444', bg: '#fef2f2', label: 'Content Safety' },
  'pii-protection': { icon: <ShieldLock24Regular />, color: '#8b5cf6', bg: '#f5f3ff', label: 'PII Protection' },
  jailbreak: { icon: <ErrorCircle24Regular />, color: '#f97316', bg: '#fff7ed', label: 'Jailbreak Defense' },
  hallucination: { icon: <Eye24Regular />, color: '#0ea5e9', bg: '#f0f9ff', label: 'Hallucination' },
  fairness: { icon: <ArrowSync24Regular />, color: '#10b981', bg: '#ecfdf5', label: 'Fairness' },
  transparency: { icon: <Info24Regular />, color: '#6366f1', bg: '#eef2ff', label: 'Transparency' },
};

const severityActionConfig: Record<string, { color: string; bg: string; label: string }> = {
  block: { color: '#ef4444', bg: '#fef2f2', label: '🛑 Block' },
  warn: { color: '#f59e0b', bg: '#fffbeb', label: '⚠️ Warn' },
  log: { color: '#6366f1', bg: '#eef2ff', label: '📝 Log' },
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
            Design-Time Rules ({governanceRules.length})
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
              {runtimePolicies.length} runtime policies · {runtimePolicies.filter(p => p.enabled).length} enabled · applied to {runtimePolicies.reduce((s, p) => s + p.appliedTo, 0)} assets
            </Text>
            <Button appearance="primary" icon={<Add24Regular />}>Create Runtime Rule</Button>
          </div>
          <Card className={styles.card}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell>Policy</TableHeaderCell>
                  <TableHeaderCell>Target</TableHeaderCell>
                  <TableHeaderCell>Rules</TableHeaderCell>
                  <TableHeaderCell>Applied To</TableHeaderCell>
                  <TableHeaderCell>Enabled</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {runtimePolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <Text weight="semibold">{policy.name}</Text>
                      <br />
                      <Text size={200} style={{ color: '#999' }}>{policy.description}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge appearance="tint" color={targetColors[policy.target] || 'informative'}>
                        {policy.target}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text>{policy.ruleCount} rule{policy.ruleCount !== 1 ? 's' : ''}</Text>
                    </TableCell>
                    <TableCell>
                      <Text>{policy.appliedTo} asset{policy.appliedTo !== 1 ? 's' : ''}</Text>
                    </TableCell>
                    <TableCell>
                      <Switch checked={policy.enabled} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* =================== DESIGN-TIME RULES TAB =================== */}
      {tab === 'design-time' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#999' }}>
              Design-time rules enforced when assets are registered, updated, or activated
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
