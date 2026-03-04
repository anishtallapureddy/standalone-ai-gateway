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
  Bot24Regular,
  LightbulbFilament24Regular,
  Grid24Regular,
  ArrowRight16Regular,
  Flow24Regular,
} from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { catalogItems, namespaces } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles({
  scopeBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    padding: '12px 16px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '8px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
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
  'mcp-server': { icon: <PlugConnected24Regular />, color: '#8b5cf6', bg: '#f3e8ff', label: 'MCP Server' },
  agent: { icon: <Bot24Regular />, color: '#10b981', bg: '#d1fae5', label: 'Agent' },
  skill: { icon: <LightbulbFilament24Regular />, color: '#f59e0b', bg: '#fef3c7', label: 'Skill' },
  workflow: { icon: <Flow24Regular />, color: '#60a5fa', bg: '#dbeafe', label: 'Workflow' },
};

// Maps Browse tabs to sidebar routes for navigation
const tabRoutes: Record<string, string> = {
  model: '/models',
  tool: '/tools',
  agent: '/agents',
  skill: '/skills',
  workflow: '/workflows',
};

// Simulate current user's namespace access
// In production this comes from RBAC / identity
const myNamespaces = ['anishta-sandbox', 'engineering', 'ai-platform', 'customer-ops'];
const isAdmin = true; // Toggle to simulate admin vs developer view

const Catalog: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [scope, setScope] = useState<string>(isAdmin ? 'all' : 'my');
  const [visFilter, setVisFilter] = useState<string>('all');

  // Namespace scoping: "my" = only user's granted namespaces, "all" = admin view
  const accessibleNamespaces = scope === 'all'
    ? namespaces.map(n => n.name)
    : myNamespaces;

  const scopedItems = catalogItems.filter(item =>
    accessibleNamespaces.includes(item.namespace)
  );

  const filtered = scopedItems.filter((item) => {
    if (typeFilter !== 'all') {
      if (typeFilter === 'tool') {
        if (item.assetType !== 'tool' && item.assetType !== 'mcp-server') return false;
      } else {
        if (item.assetType !== typeFilter) return false;
      }
    }
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
    all: scopedItems.length,
    model: scopedItems.filter(i => i.assetType === 'model').length,
    tool: scopedItems.filter(i => i.assetType === 'tool' || i.assetType === 'mcp-server').length,
    agent: scopedItems.filter(i => i.assetType === 'agent').length,
    skill: scopedItems.filter(i => i.assetType === 'skill').length,
    workflow: scopedItems.filter(i => i.assetType === 'workflow').length,
  };

  const handleTabSelect = (_: unknown, data: { value: unknown }) => {
    const val = data.value as string;
    setTypeFilter(val);
  };

  const handleCardClick = (assetType: string) => {
    const route = tabRoutes[assetType];
    if (route) navigate(route);
  };

  return (
    <div>
      {/* Namespace scope selector */}
      <div className={styles.scopeBar}>
        <Text size={200} weight="semibold" style={{ color: '#999', marginRight: '4px' }}>Scope:</Text>
        <Dropdown
          value={scope === 'all' ? 'All namespaces (Admin)' : `My namespaces (${myNamespaces.length})`}
          onOptionSelect={(_, data) => setScope(data.optionValue || 'my')}
          style={{ minWidth: '220px' }}
        >
          <Option value="my" text={`My namespaces (${myNamespaces.length})`}>My namespaces ({myNamespaces.length})</Option>
          {isAdmin && <Option value="all" text="All namespaces (Admin)">All namespaces (Admin)</Option>}
        </Dropdown>
        {scope === 'my' && (
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginLeft: '8px' }}>
            {myNamespaces.map(ns => {
              const nsObj = namespaces.find(n => n.name === ns);
              return (
                <Badge key={ns} appearance="tint" size="small" color="informative">
                  {nsObj?.displayName || ns}
                </Badge>
              );
            })}
          </div>
        )}
        <Text size={200} style={{ color: '#999', marginLeft: 'auto' }}>
          {scopedItems.length} assets visible
        </Text>
      </div>

      {/* Type tabs */}
      <div className={styles.tabs}>
        <TabList
          selectedValue={typeFilter}
          onTabSelect={handleTabSelect}
        >
          <Tab value="all" icon={<Grid24Regular />}>All ({typeCounts.all})</Tab>
          <Tab value="model" icon={<BrainCircuit24Regular />}>Models ({typeCounts.model})</Tab>
          <Tab value="tool" icon={<PlugConnected24Regular />}>Tools ({typeCounts.tool})</Tab>
          <Tab value="agent" icon={<Bot24Regular />}>Agents ({typeCounts.agent})</Tab>
          <Tab value="skill" icon={<LightbulbFilament24Regular />}>Skills ({typeCounts.skill})</Tab>
          <Tab value="workflow" icon={<Flow24Regular />}>Workflows ({typeCounts.workflow})</Tab>
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
        <Text size={200} style={{ color: '#999' }}>
          Showing {filtered.length} of {scopedItems.length} assets
        </Text>
      </div>

      {/* Asset cards */}
      <div className={styles.grid}>
        {filtered.map((item) => {
          const config = assetTypeConfig[item.assetType] || assetTypeConfig.tool;
          return (
            <Card key={item.id} className={styles.card} onClick={() => handleCardClick(item.assetType === 'mcp-server' ? 'tool' : item.assetType)}>
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
                        color={item.visibility === 'public' ? 'success' : item.visibility === 'namespace' ? 'informative' : 'warning'}
                      >
                        {item.visibility}
                      </Badge>
                      <Badge
                        appearance="outline"
                        size="small"
                        style={{
                          borderColor: item.lifecycle === 'published' ? '#0E9349' : item.lifecycle === 'approved' ? '#0078D4' : item.lifecycle === 'registered' ? '#F7C948' : '#999',
                          color: item.lifecycle === 'published' ? '#4ade80' : item.lifecycle === 'approved' ? '#60cdff' : item.lifecycle === 'registered' ? '#fbbf24' : '#999',
                        }}
                      >
                        {item.lifecycle}
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
                    <Text size={200} style={{ color: '#999' }}>Namespace</Text>
                    <Text size={200} weight="semibold">{item.namespace}</Text>
                  </div>
                  <div className={styles.metaItem}>
                    <Text size={200} style={{ color: '#999' }}>Owner</Text>
                    <Text size={200} weight="semibold">{item.owner}</Text>
                  </div>
                  <div className={styles.metaItem}>
                    <Text size={200} style={{ color: '#999' }}>Usage (24h)</Text>
                    <Text size={200} weight="semibold">{item.usageLast24h.toLocaleString()}</Text>
                  </div>
                </div>
                <ArrowRight16Regular style={{ color: '#999' }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Catalog;
