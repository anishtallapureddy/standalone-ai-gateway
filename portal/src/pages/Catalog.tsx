import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Input,
  Dropdown,
  Option,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  Search24Regular,
  BrainCircuit24Regular,
  PlugConnected24Regular,
  Server24Regular,
  Bot24Regular,
  LightbulbFilament24Regular,
  Grid24Regular,
  ArrowRight16Regular,
} from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { catalogItems, namespaces } from '../data/mockData';

const useStyles = makeStyles({
  header: {
    marginBottom: '20px',
  },
  subtitle: {
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
  },
  tabs: {
    marginBottom: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  assetIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
  tags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  footerMeta: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  resultsInfo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
});

const assetTypeConfig: Record<string, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  model: { icon: <BrainCircuit24Regular />, color: '#6366f1', bg: '#eef2ff', label: 'Model' },
  tool: { icon: <PlugConnected24Regular />, color: '#0ea5e9', bg: '#e0f2fe', label: 'Tool' },
  'mcp-server': { icon: <Server24Regular />, color: '#8b5cf6', bg: '#f3e8ff', label: 'MCP Server' },
  agent: { icon: <Bot24Regular />, color: '#10b981', bg: '#d1fae5', label: 'Agent' },
  skill: { icon: <LightbulbFilament24Regular />, color: '#f59e0b', bg: '#fef3c7', label: 'Skill' },
};

const Catalog: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [nsFilter, setNsFilter] = useState<string>('all');
  const [visFilter, setVisFilter] = useState<string>('all');

  const filtered = catalogItems.filter((item) => {
    if (typeFilter !== 'all' && item.assetType !== typeFilter) return false;
    if (nsFilter !== 'all' && item.namespace !== nsFilter) return false;
    if (visFilter !== 'all' && item.visibility !== visFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.owner.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const typeCounts = {
    all: catalogItems.length,
    model: catalogItems.filter(i => i.assetType === 'model').length,
    tool: catalogItems.filter(i => i.assetType === 'tool').length,
    'mcp-server': catalogItems.filter(i => i.assetType === 'mcp-server').length,
    agent: catalogItems.filter(i => i.assetType === 'agent').length,
    skill: catalogItems.filter(i => i.assetType === 'skill').length,
  };

  return (
    <div>
      <div className={styles.header}>
        <Text size={200} className={styles.subtitle}>
          Discover and explore AI assets across your organization — models, tools, MCP servers, agents, and skills.
        </Text>
      </div>

      {/* Type tabs */}
      <div className={styles.tabs}>
        <TabList
          selectedValue={typeFilter}
          onTabSelect={(_, data) => setTypeFilter(data.value as string)}
        >
          <Tab value="all" icon={<Grid24Regular />}>All ({typeCounts.all})</Tab>
          <Tab value="model" icon={<BrainCircuit24Regular />}>Models ({typeCounts.model})</Tab>
          <Tab value="tool" icon={<PlugConnected24Regular />}>Tools ({typeCounts.tool})</Tab>
          <Tab value="mcp-server" icon={<Server24Regular />}>MCP Servers ({typeCounts['mcp-server']})</Tab>
          <Tab value="agent" icon={<Bot24Regular />}>Agents ({typeCounts.agent})</Tab>
          <Tab value="skill" icon={<LightbulbFilament24Regular />}>Skills ({typeCounts.skill})</Tab>
        </TabList>
      </div>

      {/* Search + filters */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <Input
            placeholder="Search by name, description, or tag..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ minWidth: '300px' }}
          />
          <Dropdown
            placeholder="All namespaces"
            value={nsFilter === 'all' ? 'All namespaces' : namespaces.find(n => n.name === nsFilter)?.displayName || nsFilter}
            onOptionSelect={(_, data) => setNsFilter(data.optionValue || 'all')}
            style={{ minWidth: '180px' }}
          >
            <Option value="all">All namespaces</Option>
            {namespaces.map(ns => (
              <Option key={ns.name} value={ns.name}>{ns.displayName}</Option>
            ))}
          </Dropdown>
          <Dropdown
            placeholder="All visibility"
            value={visFilter === 'all' ? 'All visibility' : visFilter}
            onOptionSelect={(_, data) => setVisFilter(data.optionValue || 'all')}
            style={{ minWidth: '140px' }}
          >
            <Option value="all">All visibility</Option>
            <Option value="public">Public</Option>
            <Option value="team">Team</Option>
            <Option value="private">Private</Option>
          </Dropdown>
        </div>
      </div>

      <div className={styles.resultsInfo}>
        <Text size={200} style={{ color: '#666' }}>
          Showing {filtered.length} of {catalogItems.length} assets
        </Text>
      </div>

      {/* Asset cards */}
      <div className={styles.grid}>
        {filtered.map((item) => {
          const config = assetTypeConfig[item.assetType] || assetTypeConfig.tool;
          return (
            <Card key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitleRow}>
                  <div className={styles.assetIcon} style={{ backgroundColor: config.bg, color: config.color }}>
                    {config.icon}
                  </div>
                  <div>
                    <Text weight="semibold" size={400}>{item.name}</Text>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <Badge appearance="filled" style={{ backgroundColor: config.color, color: '#fff' }} size="small">
                        {config.label}
                      </Badge>
                      <Badge
                        appearance="tint"
                        size="small"
                        color={item.visibility === 'public' ? 'success' : item.visibility === 'team' ? 'informative' : 'warning'}
                      >
                        {item.visibility}
                      </Badge>
                    </div>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className={styles.description}>{item.description}</div>

              <div className={styles.tags}>
                {item.tags.map(t => (
                  <Badge key={t} appearance="tint" size="small">{t}</Badge>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.footerMeta}>
                  <div className={styles.metaItem}>
                    <Text size={200} style={{ color: '#666' }}>Namespace</Text>
                    <Text size={200} weight="semibold">{item.namespace}</Text>
                  </div>
                  <div className={styles.metaItem}>
                    <Text size={200} style={{ color: '#666' }}>Owner</Text>
                    <Text size={200} weight="semibold">{item.owner}</Text>
                  </div>
                  <div className={styles.metaItem}>
                    <Text size={200} style={{ color: '#666' }}>Usage (24h)</Text>
                    <Text size={200} weight="semibold">{item.usageLast24h.toLocaleString()}</Text>
                  </div>
                </div>
                <ArrowRight16Regular style={{ color: '#666' }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Catalog;
