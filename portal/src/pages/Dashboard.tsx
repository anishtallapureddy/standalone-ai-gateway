import React from 'react';
import { Card, Text, makeStyles, tokens } from '@fluentui/react-components';
import {
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Server24Regular,
  Bot24Regular,
  Shield24Regular,
  ArrowTrendingLines24Regular,
  DataUsageRegular,
  Warning24Regular,
} from '@fluentui/react-icons';
import StatCard from '../components/StatCard';
import { dashboardStats, models, agents } from '../data/mockData';

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
    gap: '8px',
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
    '&:last-child': {
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
  providerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
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
});

const Dashboard: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.grid}>
        <StatCard
          value={dashboardStats.totalModels}
          label="Models"
          icon={<BrainCircuit24Regular />}
          color="#6366f1"
        />
        <StatCard
          value={dashboardStats.totalTools}
          label="Tools"
          icon={<PlugConnected24Regular />}
          color="#0ea5e9"
        />
        <StatCard
          value={dashboardStats.totalMCPServers}
          label="MCP Servers"
          icon={<Server24Regular />}
          color="#8b5cf6"
        />
        <StatCard
          value={dashboardStats.totalAgents}
          label="Agents"
          icon={<Bot24Regular />}
          color="#10b981"
        />
        <StatCard
          value={dashboardStats.totalPolicies}
          label="Policies"
          icon={<Shield24Regular />}
          color="#f59e0b"
        />
        <StatCard
          value={`${(dashboardStats.totalRequests24h / 1000).toFixed(1)}K`}
          label="Requests (24h)"
          icon={<ArrowTrendingLines24Regular />}
          color="#0284c7"
        />
        <StatCard
          value={`${(dashboardStats.totalTokens24h / 1000000).toFixed(1)}M`}
          label="Tokens (24h)"
          icon={<DataUsageRegular />}
          color="#7c3aed"
        />
        <StatCard
          value={dashboardStats.activeAlerts}
          label="Active Alerts"
          icon={<Warning24Regular />}
          color={dashboardStats.activeAlerts > 0 ? '#ef4444' : '#10b981'}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <BrainCircuit24Regular />
          <Text size={400} weight="semibold">Model Usage</Text>
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
                  <Text size={200}>{(model.tokensUsedToday / 1000).toFixed(0)}K / {(model.tokenLimit / 1000).toFixed(0)}K tokens</Text>
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
          <Bot24Regular />
          <Text size={400} weight="semibold">Active Agents</Text>
        </div>
        <Card className={styles.activityCard}>
          {agents.map((agent) => (
            <div key={agent.id} className={styles.activityItem}>
              <div className={styles.activityLeft}>
                <Bot24Regular />
                <div>
                  <Text weight="semibold" size={300}>{agent.name}</Text>
                  <br />
                  <Text size={200} style={{ color: '#666' }}>{agent.protocol.toUpperCase()} · {agent.modelIds.length} models · {agent.toolIds.length} tools</Text>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Text size={300} weight="semibold">{agent.requestsToday.toLocaleString()}</Text>
                <br />
                <Text size={200} style={{ color: '#666' }}>requests today</Text>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
