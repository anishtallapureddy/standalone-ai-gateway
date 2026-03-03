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
import {
  Add24Regular,
  Search24Regular,
  BrainCircuit20Regular,
  PlugConnected20Regular,
  Server20Regular,
  Bot20Regular,
  LightbulbFilament20Regular,
  Shield20Regular,
  Folder24Regular,
} from '@fluentui/react-icons';
import { namespaces } from '../data/mockData';

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
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  nsIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6366f1',
    flexShrink: 0,
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '16px',
  },
  assetCounts: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  assetCount: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 8px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '6px',
    fontSize: '12px',
  },
  policies: {
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: '12px',
  },
});

const Namespaces: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');

  const filtered = namespaces.filter(ns => {
    if (!search) return true;
    const q = search.toLowerCase();
    return ns.name.includes(q) || ns.displayName.toLowerCase().includes(q) || ns.description.toLowerCase().includes(q);
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Input
            placeholder="Search namespaces..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ minWidth: '280px' }}
          />
          <Text size={200} style={{ color: '#666' }}>{filtered.length} namespaces</Text>
        </div>
        <Button appearance="primary" icon={<Add24Regular />}>Create Namespace</Button>
      </div>

      <div className={styles.grid}>
        {filtered.map((ns) => (
          <Card key={ns.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.titleRow}>
                <div className={styles.nsIcon}>
                  <Folder24Regular />
                </div>
                <div>
                  <Text weight="semibold" size={400}>{ns.displayName}</Text>
                  <div>
                    <Text size={200} style={{ fontFamily: 'monospace', color: '#666' }}>{ns.name}</Text>
                  </div>
                </div>
              </div>
              <Badge appearance="tint" color="success" size="small">{ns.totalAssets} assets</Badge>
            </div>

            <div className={styles.description}>{ns.description}</div>

            <div className={styles.assetCounts}>
              {ns.assetCount.models > 0 && (
                <div className={styles.assetCount}>
                  <BrainCircuit20Regular style={{ color: '#6366f1' }} />
                  <Text size={200} weight="semibold">{ns.assetCount.models}</Text>
                  <Text size={200} style={{ color: '#666' }}>models</Text>
                </div>
              )}
              {ns.assetCount.tools > 0 && (
                <div className={styles.assetCount}>
                  <PlugConnected20Regular style={{ color: '#0ea5e9' }} />
                  <Text size={200} weight="semibold">{ns.assetCount.tools}</Text>
                  <Text size={200} style={{ color: '#666' }}>tools</Text>
                </div>
              )}
              {ns.assetCount.mcpServers > 0 && (
                <div className={styles.assetCount}>
                  <Server20Regular style={{ color: '#8b5cf6' }} />
                  <Text size={200} weight="semibold">{ns.assetCount.mcpServers}</Text>
                  <Text size={200} style={{ color: '#666' }}>MCP</Text>
                </div>
              )}
              {ns.assetCount.agents > 0 && (
                <div className={styles.assetCount}>
                  <Bot20Regular style={{ color: '#10b981' }} />
                  <Text size={200} weight="semibold">{ns.assetCount.agents}</Text>
                  <Text size={200} style={{ color: '#666' }}>agents</Text>
                </div>
              )}
              {ns.assetCount.skills > 0 && (
                <div className={styles.assetCount}>
                  <LightbulbFilament20Regular style={{ color: '#f59e0b' }} />
                  <Text size={200} weight="semibold">{ns.assetCount.skills}</Text>
                  <Text size={200} style={{ color: '#666' }}>skills</Text>
                </div>
              )}
            </div>

            {ns.policies.length > 0 && (
              <div className={styles.policies}>
                <Shield20Regular style={{ color: '#666' }} />
                {ns.policies.map(p => (
                  <Badge key={p} appearance="outline" size="small">{p}</Badge>
                ))}
              </div>
            )}

            <div className={styles.footer}>
              <Text size={200} style={{ color: '#666' }}>Owner: <b>{ns.owner}</b></Text>
              <Text size={200} style={{ color: '#999' }}>
                Created {new Date(ns.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Text>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Namespaces;
