import React from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
} from '@fluentui/react-components';
import { Add24Regular, Server24Regular, ArrowRight16Regular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { mcpServers } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
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
    gap: '8px',
  },
  cardMeta: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  sourceApi: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '8px',
    padding: '6px 10px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
    fontSize: '12px',
  },
});

const MCPServers: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {mcpServers.length} MCP servers · {mcpServers.filter(s => s.hostingType === 'managed').length} managed · {mcpServers.filter(s => s.hostingType === 'external').length} external
        </Text>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button appearance="secondary">Convert API → MCP</Button>
          <Button appearance="primary" icon={<Add24Regular />}>Register MCP Server</Button>
        </div>
      </div>
      <div className={styles.grid}>
        {mcpServers.map((server) => (
          <Card key={server.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.cardTitle}>
                <Server24Regular style={{ color: '#8b5cf6' }} />
                <div>
                  <Text weight="semibold" size={400}>{server.name}</Text>
                  <br />
                  <Text size={200} style={{ color: '#666' }}>{server.description}</Text>
                </div>
              </div>
              <StatusBadge status={server.status} />
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <Badge appearance="outline" color={server.hostingType === 'managed' ? 'brand' : 'informative'}>
                {server.hostingType}
              </Badge>
              <Badge appearance="tint">{server.transport}</Badge>
            </div>

            {server.sourceApi && (
              <div className={styles.sourceApi}>
                <Text size={200}>Converted from:</Text>
                <ArrowRight16Regular />
                <Text size={200} weight="semibold">{server.sourceApi}</Text>
              </div>
            )}

            <div className={styles.cardMeta}>
              <div className={styles.metaItem}>
                <Text size={200} style={{ color: '#666' }}>Tools</Text>
                <Text weight="semibold">{server.toolCount}</Text>
              </div>
              <div className={styles.metaItem}>
                <Text size={200} style={{ color: '#666' }}>Requests (24h)</Text>
                <Text weight="semibold">{server.requestsToday.toLocaleString()}</Text>
              </div>
              <div className={styles.metaItem}>
                <Text size={200} style={{ color: '#666' }}>Endpoint</Text>
                <Text size={200} style={{ fontFamily: 'monospace' }}>{server.endpoint}</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MCPServers;
