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
  Checkmark24Regular,
  Dismiss24Regular,
  Clock24Regular,
  CheckmarkCircle24Regular,
  DismissCircle24Regular,
  Warning24Regular,
  Info24Regular,
  ErrorCircle24Regular,
} from '@fluentui/react-icons';
import { governanceRules, pendingApprovals } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
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
  card: {
    padding: '0',
    marginBottom: '16px',
  },
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
});

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

const Governance: React.FC = () => {
  const styles = useStyles();
  const [tab, setTab] = useState('rules');

  const totalViolations = governanceRules.reduce((sum, r) => sum + r.violations24h, 0);
  const enabledRules = governanceRules.filter(r => r.enabled).length;
  const autoEnforced = governanceRules.filter(r => r.autoEnforce).length;
  const pendingCount = pendingApprovals.filter(a => a.status === 'pending').length;

  return (
    <div>
      {/* Stats */}
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#6366f1' }}>{governanceRules.length}</div>
          <div className={styles.statLabel}>Total Rules</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#10b981' }}>{enabledRules}</div>
          <div className={styles.statLabel}>Enabled</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#0ea5e9' }}>{autoEnforced}</div>
          <div className={styles.statLabel}>Auto-Enforced</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#f59e0b' }}>{pendingCount}</div>
          <div className={styles.statLabel}>Pending Approvals</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statValue} style={{ color: '#ef4444' }}>{totalViolations}</div>
          <div className={styles.statLabel}>Violations (24h)</div>
        </Card>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <TabList selectedValue={tab} onTabSelect={(_, data) => setTab(data.value as string)}>
          <Tab value="rules" icon={<Shield24Regular />}>
            Governance Rules ({governanceRules.length})
          </Tab>
          <Tab value="approvals" icon={<Clock24Regular />}>
            Pending Approvals ({pendingCount})
          </Tab>
        </TabList>
      </div>

      {tab === 'rules' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#666' }}>
              Design-time rules enforced when assets are registered, updated, or activated
            </Text>
            <Button appearance="primary" icon={<Add24Regular />}>Create Rule</Button>
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
                      <Text size={200} style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                        {rule.description}
                      </Text>

                      <div className={styles.ruleMeta}>
                        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                          <Text size={200} style={{ color: '#666' }}>Applies to:</Text>
                          {rule.appliesTo.map(t => (
                            <Badge key={t} appearance="tint" color={assetTypeColors[t]} size="small">{t}</Badge>
                          ))}
                        </div>
                        {rule.namespaces.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <Text size={200} style={{ color: '#666' }}>Namespaces:</Text>
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

      {tab === 'approvals' && (
        <div>
          <div className={styles.toolbar}>
            <Text size={300} style={{ color: '#666' }}>
              Review and approve asset changes that triggered governance rules
            </Text>
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
                      <Text size={200} style={{ color: '#666', display: 'block', marginTop: '2px' }}>
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
    </div>
  );
};

export default Governance;
