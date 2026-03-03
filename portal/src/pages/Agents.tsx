import React from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
} from '@fluentui/react-components';
import { Add24Regular, Bot24Regular, BrainCircuitRegular, PlugConnectedRegular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { agents, models, tools } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
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

  const getModelName = (id: string): string => models.find(m => m.id === id)?.name || id;
  const getToolName = (id: string): string => tools.find(t => t.id === id)?.name || id;

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {agents.length} agents registered · {agents.filter(a => a.status === 'active').length} active
        </Text>
        <Button appearance="primary" icon={<Add24Regular />}>Register Agent</Button>
      </div>
      <div className={styles.grid}>
        {agents.map((agent) => (
          <Card key={agent.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Bot24Regular style={{ color: '#10b981' }} />
                <div>
                  <Text weight="semibold" size={400}>{agent.name}</Text>
                  <br />
                  <Text size={200} style={{ color: '#666' }}>{agent.description}</Text>
                </div>
              </div>
              <StatusBadge status={agent.status} />
            </div>

            <Badge appearance="outline">{agent.protocol.toUpperCase()}</Badge>

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
                <Text size={200} style={{ color: '#666' }}>Requests (24h)</Text>
                <Text weight="semibold">{agent.requestsToday.toLocaleString()}</Text>
              </div>
              <div className={styles.stat}>
                <Text size={200} style={{ color: '#666' }}>Endpoint</Text>
                <Text size={200} style={{ fontFamily: 'monospace' }}>{agent.endpoint}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Agents;
