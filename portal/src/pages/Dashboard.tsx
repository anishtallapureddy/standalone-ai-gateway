import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Text, makeStyles, tokens, Badge, Button, Divider } from '@fluentui/react-components';
import {
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Server24Regular,
  Bot24Regular,
  Shield24Regular,
  ArrowTrendingLines24Regular,
  DataUsageRegular,
  Warning24Regular,
  Rocket24Regular,
  ArrowRight16Regular,
} from '@fluentui/react-icons';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { dashboardStats, models, agents, recentLogs } from '../data/mockData';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
    marginBottom: '24px',
  },
  quickActionsCard: {
    padding: '24px',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    color: '#fff',
    marginBottom: '24px',
  },
  quickActionsTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
  },
  quickAction: {
    padding: '16px',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    ':hover': {
      backgroundColor: 'rgba(255,255,255,0.15)',
      border: '1px solid rgba(255,255,255,0.2)',
    },
  },
  quickActionIcon: {
    fontSize: '20px',
    color: '#60cdff',
  },
  quickActionLabel: {
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
  },
  quickActionDesc: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: '11px',
  },
  activityCard: {
    padding: '16px',
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
    ':last-child': {
      borderBottom: 'none',
    },
  },
  activityLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  modelRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  usageBar: {
    width: '120px',
    height: '6px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '3px',
    overflow: 'hidden',
  },
  usageFill: {
    height: '100%',
    borderRadius: '3px',
  },
  costCard: {
    padding: '20px',
  },
  costGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '12px',
  },
  costItem: {
    textAlign: 'center' as const,
    padding: '12px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
  },
  costValue: {
    fontSize: '24px',
    fontWeight: 700,
  },
  costLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  logRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  logLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
  },
});

const Dashboard: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const getStatusColor = (code: number): string => {
    if (code >= 200 && code < 300) return '#10b981';
    if (code >= 400 && code < 500) return '#f59e0b';
    return '#ef4444';
  };

  const formatTime = (ts: string): string => {
    const d = new Date(ts);
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div>
      {/* Quick Actions Banner */}
      <Card className={styles.quickActionsCard}>
        <div className={styles.quickActionsTitle}>
          <Rocket24Regular style={{ color: '#60cdff' }} />
          <Text style={{ color: '#fff', fontSize: '16px', fontWeight: 600 }}>Quick Actions</Text>
        </div>
        <div className={styles.quickActionsGrid}>
          <div className={styles.quickAction} onClick={() => navigate('/models')}>
            <BrainCircuit24Regular className={styles.quickActionIcon} />
            <span className={styles.quickActionLabel}>Register Model</span>
            <span className={styles.quickActionDesc}>Connect Azure OpenAI, Anthropic, Gemini, or any model</span>
          </div>
          <div className={styles.quickAction} onClick={() => navigate('/tools')}>
            <PlugConnected24Regular className={styles.quickActionIcon} />
            <span className={styles.quickActionLabel}>Add Tool</span>
            <span className={styles.quickActionDesc}>Register an API or convert to MCP endpoint</span>
          </div>
          <div className={styles.quickAction} onClick={() => navigate('/agents')}>
            <Bot24Regular className={styles.quickActionIcon} />
            <span className={styles.quickActionLabel}>Deploy Agent</span>
            <span className={styles.quickActionDesc}>Register a RAPI or A2A agent with governance</span>
          </div>
          <div className={styles.quickAction} onClick={() => navigate('/playground')}>
            <ArrowTrendingLines24Regular className={styles.quickActionIcon} />
            <span className={styles.quickActionLabel}>Test in Playground</span>
            <span className={styles.quickActionDesc}>Try models with full gateway policies applied</span>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className={styles.grid}>
        <StatCard value={dashboardStats.totalModels} label="Models" icon={<BrainCircuit24Regular />} color="#6366f1" />
        <StatCard value={dashboardStats.totalTools} label="Tools" icon={<PlugConnected24Regular />} color="#0ea5e9" />
        <StatCard value={dashboardStats.totalMCPServers} label="MCP Servers" icon={<Server24Regular />} color="#8b5cf6" />
        <StatCard value={dashboardStats.totalAgents} label="Agents" icon={<Bot24Regular />} color="#10b981" />
        <StatCard value={dashboardStats.totalPolicies} label="Policies" icon={<Shield24Regular />} color="#f59e0b" />
        <StatCard value={`${(dashboardStats.totalRequests24h / 1000).toFixed(1)}K`} label="Requests (24h)" icon={<ArrowTrendingLines24Regular />} color="#0284c7" />
        <StatCard value={`${(dashboardStats.totalTokens24h / 1000000).toFixed(1)}M`} label="Tokens (24h)" icon={<DataUsageRegular />} color="#7c3aed" />
        <StatCard value={dashboardStats.activeAlerts} label="Active Alerts" icon={<Warning24Regular />} color={dashboardStats.activeAlerts > 0 ? '#ef4444' : '#10b981'} />
      </div>

      {/* Two Column: Cost Analytics + Recent Activity */}
      <div className={styles.twoCol}>
        {/* Cost Analytics */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleLeft}>
              <DataUsageRegular />
              <Text size={400} weight="semibold">Cost Analytics (24h)</Text>
            </div>
          </div>
          <Card className={styles.costCard}>
            <div className={styles.costGrid}>
              <div className={styles.costItem}>
                <div className={styles.costValue} style={{ color: '#6366f1' }}>$127.40</div>
                <div className={styles.costLabel}>Total Spend</div>
              </div>
              <div className={styles.costItem}>
                <div className={styles.costValue} style={{ color: '#10b981' }}>$34.20</div>
                <div className={styles.costLabel}>Saved (Cache)</div>
              </div>
              <div className={styles.costItem}>
                <div className={styles.costValue} style={{ color: '#f59e0b' }}>$0.26</div>
                <div className={styles.costLabel}>Avg Cost / 1K Tokens</div>
              </div>
            </div>
            <Divider style={{ margin: '16px 0' }} />
            <div>
              <Text size={200} weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>Spend by Provider</Text>
              {[
                { name: 'Azure OpenAI', amount: '$68.50', pct: 53.8, color: '#0078d4' },
                { name: 'Anthropic', amount: '$32.10', pct: 25.2, color: '#d97706' },
                { name: 'Google Vertex AI', amount: '$18.90', pct: 14.8, color: '#4285f4' },
                { name: 'AWS Bedrock', amount: '$7.90', pct: 6.2, color: '#ff9900' },
              ].map(p => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.color }} />
                  <Text size={200} style={{ flex: 1 }}>{p.name}</Text>
                  <Text size={200} weight="semibold">{p.amount}</Text>
                  <Text size={200} style={{ color: '#666', width: '45px', textAlign: 'right' }}>{p.pct}%</Text>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleLeft}>
              <div className={styles.liveDot} />
              <Text size={400} weight="semibold">Recent Activity</Text>
            </div>
            <Button appearance="subtle" size="small" onClick={() => navigate('/logs')}>
              View all <ArrowRight16Regular />
            </Button>
          </div>
          <Card className={styles.activityCard}>
            {recentLogs.slice(0, 8).map((log) => (
              <div key={log.id} className={styles.logRow}>
                <div className={styles.logLeft}>
                  <span className={styles.statusDot} style={{ backgroundColor: getStatusColor(log.statusCode) }} />
                  <Badge appearance="tint" size="small" color={
                    log.assetType === 'model' ? 'brand' :
                    log.assetType === 'tool' ? 'informative' :
                    log.assetType === 'agent' ? 'warning' : 'success'
                  }>
                    {log.assetType}
                  </Badge>
                  <Text size={200}>{log.assetName}</Text>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Text size={200} style={{
                    color: log.latencyMs < 500 ? '#10b981' : log.latencyMs < 2000 ? '#f59e0b' : '#ef4444',
                    fontWeight: 600,
                  }}>{log.latencyMs}ms</Text>
                  <Text size={200} style={{ color: '#999', fontFamily: 'monospace', fontSize: '11px' }}>
                    {formatTime(log.timestamp)}
                  </Text>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Two Column: Model Usage + Active Agents */}
      <div className={styles.twoCol}>
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleLeft}>
              <BrainCircuit24Regular />
              <Text size={400} weight="semibold">Model Usage</Text>
            </div>
          </div>
          <Card className={styles.activityCard}>
            {models.filter(m => m.status === 'active').map((model) => {
              const usagePct = Math.min((model.tokensUsedToday / model.tokenLimit) * 100, 100);
              const barColor = usagePct > 80 ? '#ef4444' : usagePct > 60 ? '#f59e0b' : '#10b981';
              return (
                <div key={model.id} className={styles.modelRow}>
                  <div>
                    <Text weight="semibold" size={300}>{model.name}</Text>
                    <br />
                    <Text size={200} style={{ color: '#666' }}>{model.provider}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Text size={200}>{(model.tokensUsedToday / 1000).toFixed(0)}K / {(model.tokenLimit / 1000).toFixed(0)}K</Text>
                    <div className={styles.usageBar}>
                      <div className={styles.usageFill} style={{ width: `${usagePct}%`, backgroundColor: barColor }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleLeft}>
              <Bot24Regular />
              <Text size={400} weight="semibold">Active Agents</Text>
            </div>
          </div>
          <Card className={styles.activityCard}>
            {agents.map((agent) => (
              <div key={agent.id} className={styles.activityItem}>
                <div className={styles.activityLeft}>
                  <StatusBadge status={agent.status} />
                  <div>
                    <Text weight="semibold" size={300}>{agent.name}</Text>
                    <br />
                    <Text size={200} style={{ color: '#666' }}>{agent.protocol.toUpperCase()} · {agent.modelIds.length} models · {agent.toolIds.length} tools</Text>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Text size={300} weight="semibold">{agent.requestsToday.toLocaleString()}</Text>
                  <br />
                  <Text size={200} style={{ color: '#666' }}>requests</Text>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
