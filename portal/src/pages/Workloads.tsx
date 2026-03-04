import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Dismiss24Regular,
} from '@fluentui/react-icons';
import { workloads, agents, tools, skills } from '../data/mockData';
import type { Workload } from '../data/mockData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const envColor: Record<string, string> = {
  production: '#10b981',
  staging: '#f59e0b',
  sandbox: '#3b82f6',
};

const statusColor: Record<string, string> = {
  running: '#10b981',
  stopped: '#6b7280',
  deploying: '#f59e0b',
  error: '#ef4444',
};

function tokenBarColor(pct: number): string {
  if (pct > 90) return '#ef4444';
  if (pct >= 70) return '#f59e0b';
  return '#10b981';
}

// Helpers removed – detail panel resolves names inline

// ---------------------------------------------------------------------------
// Mock deployment history
// ---------------------------------------------------------------------------

const mockDeployments = [
  { timestamp: '2026-03-02T14:30:00Z', version: 'v1.4', status: 'success', deployedBy: 'ci-pipeline', duration: '2m 14s' },
  { timestamp: '2026-03-01T09:15:00Z', version: 'v1.3', status: 'success', deployedBy: 'ops-team', duration: '1m 52s' },
  { timestamp: '2026-02-28T16:45:00Z', version: 'v1.2', status: 'rollback', deployedBy: 'ci-pipeline', duration: '3m 08s' },
  { timestamp: '2026-02-27T11:00:00Z', version: 'v1.1', status: 'failed', deployedBy: 'dev-team', duration: '4m 31s' },
  { timestamp: '2026-02-25T08:30:00Z', version: 'v1.0', status: 'success', deployedBy: 'ops-team', duration: '2m 45s' },
];

const deployStatusColor: Record<string, string> = {
  success: '#10b981',
  failed: '#ef4444',
  rollback: '#f59e0b',
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    padding: '20px',
    backgroundColor: tokens.colorNeutralBackground3,
  },
  filterBar: {
    display: 'flex',
    gap: '24px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  pill: {
    cursor: 'pointer',
    padding: '4px 12px',
    borderRadius: '999px',
    border: '1px solid #444',
    fontSize: '13px',
    color: '#ccc',
    backgroundColor: 'transparent',
    transition: 'all 0.15s',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
    gap: '16px',
  },
  card: {
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    ':hover': {
      boxShadow: tokens.shadow4,
    },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '12px',
    minHeight: '36px',
    overflow: 'hidden',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
  },
  composition: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  tokenBar: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    marginTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  // Detail panel
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '620px',
    height: '100vh',
    backgroundColor: '#1a1a1a',
    overflowY: 'auto' as const,
    padding: '24px',
    boxShadow: tokens.shadow64,
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  panelSection: {
    marginBottom: '20px',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #333',
  },
  compositionList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginTop: '8px',
    marginBottom: '16px',
  },
  deployRow: {
    display: 'grid',
    gridTemplateColumns: '1.4fr 0.6fr 0.8fr 1fr 0.7fr',
    gap: '8px',
    padding: '8px 0',
    borderBottom: '1px solid #333',
    alignItems: 'center',
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Workloads: React.FC = () => {
  const styles = useStyles();
  const [envFilter, setEnvFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Workload | null>(null);
  const [detailTab, setDetailTab] = useState<string>('overview');

  // Filtering
  const filtered = workloads.filter(w => {
    if (envFilter !== 'all' && w.environment !== envFilter) return false;
    if (statusFilter !== 'all' && w.status !== statusFilter) return false;
    return true;
  });

  // Stats
  const totalBudget = workloads.reduce((s, w) => s + w.tokensBudgetDaily, 0);
  const totalRequests = workloads.reduce((s, w) => s + w.requestsToday, 0);
  const runningCount = workloads.filter(w => w.status === 'running').length;

  // Pill helper
  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: '4px 12px',
    borderRadius: '999px',
    border: active ? '1px solid #888' : '1px solid #444',
    fontSize: '13px',
    color: active ? '#fff' : '#999',
    backgroundColor: active ? '#333' : 'transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
  });

  // Token percentage bar renderer
  const renderTokenBar = (used: number, budget: number, height = 8) => {
    const pct = budget > 0 ? (used / budget) * 100 : 0;
    const color = tokenBarColor(pct);
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <Text size={200} style={{ color: '#999' }}>
            {formatTokens(used)} / {formatTokens(budget)}
          </Text>
          <Text size={200} style={{ color }}>{pct.toFixed(1)}%</Text>
        </div>
        <div style={{ backgroundColor: '#333', borderRadius: '4px', height: `${height}px`, overflow: 'hidden' }}>
          <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', backgroundColor: color, borderRadius: '4px', transition: 'width 0.3s' }} />
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <Text size={600} weight="semibold">Workloads</Text>
          <br />
          <Text size={200} style={{ color: '#999' }}>
            Deployable AI units combining agents, tools, skills, and governance policies
          </Text>
        </div>
        <Button appearance="primary" icon={<Add24Regular />}>Deploy Workload</Button>
      </div>

      {/* Stats bar */}
      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }}>Total Workloads</Text>
          <br />
          <Text size={600} weight="semibold">{workloads.length}</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }}>Running</Text>
          <br />
          <Text size={600} weight="semibold" style={{ color: '#10b981' }}>{runningCount}</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }}>Token Budget</Text>
          <br />
          <Text size={600} weight="semibold">{formatTokens(totalBudget)}</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }}>Requests Today</Text>
          <br />
          <Text size={600} weight="semibold">{totalRequests.toLocaleString()}</Text>
        </Card>
      </div>

      {/* Filter bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <Text size={200} style={{ color: '#999', marginRight: '4px' }}>Environment:</Text>
          {['all', 'production', 'staging', 'sandbox'].map(v => (
            <span key={v} style={pillStyle(envFilter === v)} onClick={() => setEnvFilter(v)}>
              {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
            </span>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <Text size={200} style={{ color: '#999', marginRight: '4px' }}>Status:</Text>
          {['all', 'running', 'stopped', 'deploying', 'error'].map(v => (
            <span key={v} style={pillStyle(statusFilter === v)} onClick={() => setStatusFilter(v)}>
              {v === 'all' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className={styles.grid}>
        {filtered.map(w => {
          return (
            <Card key={w.id} className={styles.card} onClick={() => { setSelected(w); setDetailTab('overview'); }}>
              <div className={styles.cardHeader}>
                <div>
                  <Text weight="semibold" size={400}>{w.name}</Text>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <Badge appearance="filled" style={{ backgroundColor: envColor[w.environment], color: '#fff' }}>
                      {w.environment}
                    </Badge>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '13px' }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: statusColor[w.status],
                        display: 'inline-block',
                        animation: w.status === 'deploying' ? 'pulse 1.5s infinite' : undefined,
                      }} />
                      <Text size={200} style={{ color: statusColor[w.status] }}>
                        {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                      </Text>
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.description}>{w.description}</div>

              {/* Composition */}
              <div className={styles.composition}>
                <Text size={200}>🤖 Agents: {w.agentIds.length}</Text>
                <Text size={200}>🔧 Tools: {w.toolIds.length}</Text>
                <Text size={200}>⚡ Skills: {w.skillIds.length}</Text>
                <Text size={200}>🛡️ Policies: {w.policyIds.length}</Text>
              </div>

              {/* Token usage bar */}
              <div className={styles.tokenBar}>
                {renderTokenBar(w.tokensUsedToday, w.tokensBudgetDaily)}
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <Badge appearance="outline" size="small">{w.namespace}</Badge>
                <Text size={200} style={{ color: '#999' }}>
                  {w.requestsToday.toLocaleString()} requests · deployed {relativeTime(w.lastDeployed)}
                </Text>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.panel} onClick={e => e.stopPropagation()}>
            {/* Panel header */}
            <div className={styles.panelHeader}>
              <div>
                <Text size={500} weight="semibold">{selected.name}</Text>
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Badge appearance="filled" style={{ backgroundColor: envColor[selected.environment], color: '#fff' }}>
                    {selected.environment}
                  </Badge>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      backgroundColor: statusColor[selected.status], display: 'inline-block',
                    }} />
                    <Text size={200} style={{ color: statusColor[selected.status] }}>
                      {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                    </Text>
                  </span>
                </div>
              </div>
              <Button appearance="subtle" icon={<Dismiss24Regular />} onClick={() => setSelected(null)} />
            </div>

            {/* Tabs */}
            <TabList
              selectedValue={detailTab}
              onTabSelect={(_, data) => setDetailTab(data.value as string)}
              style={{ marginBottom: '20px' }}
            >
              <Tab value="overview">Overview</Tab>
              <Tab value="composition">Composition</Tab>
              <Tab value="deployments">Deployment History</Tab>
            </TabList>

            {/* Tab: Overview */}
            {detailTab === 'overview' && (
              <div>
                <div className={styles.panelSection}>
                  <Text size={200} style={{ color: '#999' }}>Description</Text>
                  <br />
                  <Text size={300}>{selected.description}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text size={200} style={{ color: '#999' }}>Environment</Text>
                  <Badge appearance="filled" style={{ backgroundColor: envColor[selected.environment], color: '#fff' }}>
                    {selected.environment}
                  </Badge>
                </div>
                <div className={styles.detailRow}>
                  <Text size={200} style={{ color: '#999' }}>Status</Text>
                  <Text size={200} style={{ color: statusColor[selected.status] }}>
                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                  </Text>
                </div>
                <div className={styles.detailRow}>
                  <Text size={200} style={{ color: '#999' }}>Namespace</Text>
                  <Badge appearance="outline">{selected.namespace}</Badge>
                </div>
                <div className={styles.detailRow}>
                  <Text size={200} style={{ color: '#999' }}>Created</Text>
                  <Text size={200}>{new Date(selected.createdAt).toLocaleDateString()}</Text>
                </div>
                <div className={styles.detailRow}>
                  <Text size={200} style={{ color: '#999' }}>Last Deployed</Text>
                  <Text size={200}>{relativeTime(selected.lastDeployed)}</Text>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <Text size={200} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>Token Usage</Text>
                  {renderTokenBar(selected.tokensUsedToday, selected.tokensBudgetDaily, 10)}
                </div>
              </div>
            )}

            {/* Tab: Composition */}
            {detailTab === 'composition' && (
              <div>
                {/* Agents */}
                <Text size={300} weight="semibold">🤖 Agents ({selected.agentIds.length})</Text>
                <div className={styles.compositionList}>
                  {selected.agentIds.map(id => {
                    const agent = agents.find(a => a.id === id);
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={200}>{agent?.name || id}</Text>
                        {agent && <Badge appearance="outline" size="small">{agent.protocol}</Badge>}
                      </div>
                    );
                  })}
                </div>

                {/* Tools */}
                <Text size={300} weight="semibold">🔧 Tools ({selected.toolIds.length})</Text>
                <div className={styles.compositionList}>
                  {selected.toolIds.map(id => {
                    const tool = tools.find(t => t.id === id);
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={200}>{tool?.name || id}</Text>
                        {tool && <Badge appearance="outline" size="small">{tool.transport}</Badge>}
                      </div>
                    );
                  })}
                </div>

                {/* Skills */}
                <Text size={300} weight="semibold">⚡ Skills ({selected.skillIds.length})</Text>
                <div className={styles.compositionList}>
                  {selected.skillIds.map(id => {
                    const skill = skills.find(s => s.id === id);
                    return (
                      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text size={200}>{skill?.name || id}</Text>
                        {skill && <Badge appearance="outline" size="small">{skill.type}</Badge>}
                      </div>
                    );
                  })}
                </div>

                {/* Policies */}
                <Text size={300} weight="semibold">🛡️ Policies ({selected.policyIds.length})</Text>
                <div className={styles.compositionList}>
                  {selected.policyIds.map(id => (
                    <Text key={id} size={200}>{id}</Text>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Deployment History */}
            {detailTab === 'deployments' && (
              <div>
                <div className={styles.deployRow} style={{ borderBottom: '1px solid #555' }}>
                  <Text size={200} weight="semibold" style={{ color: '#999' }}>Timestamp</Text>
                  <Text size={200} weight="semibold" style={{ color: '#999' }}>Version</Text>
                  <Text size={200} weight="semibold" style={{ color: '#999' }}>Status</Text>
                  <Text size={200} weight="semibold" style={{ color: '#999' }}>Deployed By</Text>
                  <Text size={200} weight="semibold" style={{ color: '#999' }}>Duration</Text>
                </div>
                {mockDeployments.map((d, i) => (
                  <div key={i} className={styles.deployRow}>
                    <Text size={200}>{relativeTime(d.timestamp)}</Text>
                    <Text size={200} weight="semibold">{d.version}</Text>
                    <Text size={200} style={{ color: deployStatusColor[d.status] || '#999' }}>
                      {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
                    </Text>
                    <Text size={200}>{d.deployedBy}</Text>
                    <Text size={200} style={{ color: '#999' }}>{d.duration}</Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Deploying pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Workloads;
