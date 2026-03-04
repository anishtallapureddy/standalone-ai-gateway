import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Input,
} from '@fluentui/react-components';
import { Add24Regular, Bot24Regular, BrainCircuitRegular, PlugConnectedRegular, Search24Regular, ArrowRight16Regular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { agents, models, tools } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '12px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '16px',
  },
  card: {
    padding: '20px',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  connections: {
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  connectionSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '8px',
  },
  connectionChips: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
  },
  stats: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  stat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
});

const Agents: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');

  const getModelName = (id: string): string => models.find(m => m.id === id)?.name || id;
  const getToolName = (id: string): string => tools.find(t => t.id === id)?.name || id;

  const filtered = agents.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.name.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.namespace.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Input
            placeholder="Search agents..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ minWidth: '260px' }}
          />
          <Text size={200} style={{ color: '#999' }}>
            {filtered.length} agents · {agents.filter(a => a.status === 'active').length} active
          </Text>
        </div>
        <Button appearance="primary" icon={<Add24Regular />}>Register Agent</Button>
      </div>
      <div className={styles.grid}>
        {filtered.map((agent) => (
          <Card key={agent.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Bot24Regular style={{ color: '#10b981' }} />
                <div>
                  <Text weight="semibold" size={400}>{agent.name}</Text>
                  <br />
                  <Text size={200} style={{ color: '#999' }}>{agent.description}</Text>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge appearance="outline">{agent.protocol.toUpperCase()}</Badge>
              <Badge
                appearance="outline"
                size="small"
                style={{
                  borderColor: agent.lifecycle === 'published' ? '#0E9349' : agent.lifecycle === 'approved' ? '#0078D4' : '#F7C948',
                  color: agent.lifecycle === 'published' ? '#4ade80' : agent.lifecycle === 'approved' ? '#60cdff' : '#fbbf24',
                }}
              >
                {agent.lifecycle}
              </Badge>
              <Badge appearance="tint" size="small" color={agent.visibility === 'organization' ? 'success' : 'informative'}>
                {agent.visibility}
              </Badge>
              <Text size={200} style={{ color: '#999', fontFamily: 'monospace' }}>{agent.namespace}</Text>
            </div>

            <div className={styles.connections}>
              <div className={styles.connectionSection}>
                <BrainCircuitRegular style={{ color: '#6366f1' }} />
                <Text size={200} weight="semibold">Models:</Text>
                <div className={styles.connectionChips}>
                  {agent.modelIds.map(id => (
                    <Badge key={id} appearance="tint" size="small">{getModelName(id)}</Badge>
                  ))}
                </div>
              </div>
              <div className={styles.connectionSection}>
                <PlugConnectedRegular style={{ color: '#0ea5e9' }} />
                <Text size={200} weight="semibold">Tools:</Text>
                <div className={styles.connectionChips}>
                  {agent.toolIds.map(id => (
                    <Badge key={id} appearance="tint" size="small">{getToolName(id)}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <Text size={200} style={{ color: '#999' }}>Requests (24h)</Text>
                <Text weight="semibold">{agent.requestsToday.toLocaleString()}</Text>
              </div>
              <div className={styles.stat}>
                <Text size={200} style={{ color: '#999' }}>Namespace</Text>
                <Text size={200} weight="semibold" style={{ fontFamily: 'monospace' }}>{agent.namespace}</Text>
              </div>
              <div className={styles.stat}>
                <Text size={200} style={{ color: '#999' }}>Visibility</Text>
                <Badge
                  appearance="tint"
                  size="small"
                  color={agent.visibility === 'organization' ? 'success' : 'informative'}
                >
                  {agent.visibility}
                </Badge>
              </div>
              <ArrowRight16Regular style={{ color: '#999', marginLeft: 'auto' }} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agents;
