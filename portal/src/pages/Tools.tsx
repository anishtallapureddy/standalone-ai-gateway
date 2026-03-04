import React, { useState, useMemo } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Input,
  Dropdown,
  Option,
  TabList,
  Tab,
} from '@fluentui/react-components';
import { Add24Regular, Search24Regular, ArrowRight16Regular, Server24Regular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { tools, mcpServers } from '../data/mockData';
import type { Tool, MCPServer } from '../data/mockData';

type ToolSubType = 'api' | 'connector' | 'trigger';
type TabValue = 'all' | 'apis' | 'mcp' | 'connectors' | 'triggers';

const getToolSubType = (tool: Tool): ToolSubType => {
  const lowerTags = tool.tags.map(t => t.toLowerCase());
  const lowerTransport = tool.transport.toLowerCase();

  if (lowerTags.some(t => ['trigger', 'webhook', 'event'].includes(t))) return 'trigger';
  if (
    lowerTags.some(t => ['connector', 'saas', 'integration'].includes(t)) ||
    lowerTransport === 'saas connector'
  ) return 'connector';
  if (['rest', 'http', 'graphql', 'grpc'].some(k => lowerTransport.includes(k))) return 'api';
  return 'api';
};

const subTypeConfig: Record<ToolSubType, { label: string; color: string; icon: string }> = {
  api: { label: 'API', color: '#60a5fa', icon: '🔌' },
  connector: { label: 'Connector', color: '#a78bfa', icon: '🔗' },
  trigger: { label: 'Trigger', color: '#fb923c', icon: '⚡' },
};

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  tabBar: {
    marginBottom: '16px',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
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
    backgroundColor: tokens.colorNeutralBackground3,
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
    color: '#999',
    fontSize: '13px',
    marginBottom: '12px',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  endpoint: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#999',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
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
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  sourceApi: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '8px',
    padding: '6px 10px',
    backgroundColor: tokens.colorNeutralBackground3,
    borderRadius: '4px',
    fontSize: '12px',
  },
});

// ── Tool card ────────────────────────────────────────────────────────────────
const ToolCard: React.FC<{ tool: Tool; showTypeIcon?: boolean }> = ({ tool, showTypeIcon }) => {
  const styles = useStyles();
  const subType = getToolSubType(tool);
  const cfg = subTypeConfig[subType];

  return (
    <Card className={styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <Text weight="semibold" size={400}>{tool.name}</Text>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            <Badge
              appearance="filled"
              size="small"
              style={{ backgroundColor: cfg.color, color: '#fff' }}
            >
              {cfg.label}
            </Badge>
            <Badge appearance="outline" size="small">{tool.transport.toUpperCase()}</Badge>
            <StatusBadge status={tool.status} />
          </div>
        </div>
        {showTypeIcon && (
          <span style={{ fontSize: '16px' }} title={cfg.label}>{cfg.icon} {cfg.label}</span>
        )}
      </div>

      <div className={styles.description}>{tool.description}</div>
      <div className={styles.endpoint}>{tool.endpoint}</div>

      <div className={styles.tags}>
        {tool.tags.map(t => (
          <Badge key={t} appearance="tint" size="small">{t}</Badge>
        ))}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.footerStat}>
            <Text size={200} style={{ color: '#999' }}>Owner</Text>
            <Text size={200} weight="semibold">{tool.ownerTeam}</Text>
          </div>
          <div className={styles.footerStat}>
            <Text size={200} style={{ color: '#999' }}>Invocations</Text>
            <Text size={200} weight="semibold">{tool.invocationsToday.toLocaleString()}</Text>
          </div>
          <div className={styles.footerStat}>
            <Text size={200} style={{ color: '#999' }}>Visibility</Text>
            <Badge
              appearance="tint"
              size="small"
              color={tool.visibility === 'public' ? 'success' : tool.visibility === 'namespace' ? 'informative' : 'warning'}
            >
              {tool.visibility}
            </Badge>
          </div>
        </div>
        <ArrowRight16Regular style={{ color: '#999' }} />
      </div>
    </Card>
  );
};

// ── MCP Server card ──────────────────────────────────────────────────────────
const MCPCard: React.FC<{ server: MCPServer; showTypeIcon?: boolean }> = ({ server, showTypeIcon }) => {
  const styles = useStyles();

  return (
    <Card className={styles.card}>
      <div className={styles.cardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server24Regular style={{ color: '#8b5cf6' }} />
          <div>
            <Text weight="semibold" size={400}>{server.name}</Text>
            <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
              <Badge
                appearance="filled"
                size="small"
                style={{
                  backgroundColor: server.hostingType === 'managed' ? '#3b82f6' : '#8b5cf6',
                  color: '#fff',
                }}
              >
                {server.hostingType}
              </Badge>
              <Badge appearance="outline" size="small">{server.transport}</Badge>
              <StatusBadge status={server.status} />
            </div>
          </div>
        </div>
        {showTypeIcon && (
          <span style={{ fontSize: '16px' }} title="MCP Server">📡 MCP Server</span>
        )}
      </div>

      <div className={styles.description}>{server.description}</div>

      <Text size={200} style={{ color: '#999', display: 'block', marginBottom: '8px' }}>
        {server.toolCount} tools exposed
      </Text>

      {server.sourceApi && (
        <div className={styles.sourceApi}>
          <Text size={200}>Converted from:</Text>
          <ArrowRight16Regular />
          <Text size={200} weight="semibold">{server.sourceApi}</Text>
        </div>
      )}

      <div className={styles.endpoint}>{server.endpoint}</div>

      <div className={styles.cardFooter}>
        <div className={styles.footerLeft}>
          <div className={styles.footerStat}>
            <Text size={200} style={{ color: '#999' }}>Requests today</Text>
            <Text size={200} weight="semibold">{server.requestsToday.toLocaleString()}</Text>
          </div>
        </div>
        <ArrowRight16Regular style={{ color: '#999' }} />
      </div>
    </Card>
  );
};

// ── Main page ────────────────────────────────────────────────────────────────
const Tools: React.FC = () => {
  const styles = useStyles();
  const [activeTab, setActiveTab] = useState<TabValue>('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const matchesSearch = (name: string, description: string) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return name.toLowerCase().includes(q) || description.toLowerCase().includes(q);
  };

  const matchesStatus = (status: string) =>
    statusFilter === 'all' || status === statusFilter;

  // Filtered tools by sub-type
  const apiTools = useMemo(() => tools.filter(t => getToolSubType(t) === 'api'), []);
  const connectorTools = useMemo(() => tools.filter(t => getToolSubType(t) === 'connector'), []);
  const triggerTools = useMemo(() => tools.filter(t => getToolSubType(t) === 'trigger'), []);

  const applyFilters = <T extends { name: string; description: string; status: string }>(items: T[]) =>
    items.filter(i => matchesSearch(i.name, i.description) && matchesStatus(i.status));

  // Build items for each tab
  const tabItems = useMemo(() => {
    switch (activeTab) {
      case 'apis':
        return { tools: applyFilters(apiTools), servers: [] as MCPServer[] };
      case 'mcp':
        return { tools: [] as Tool[], servers: applyFilters(mcpServers) };
      case 'connectors':
        return { tools: applyFilters(connectorTools), servers: [] as MCPServer[] };
      case 'triggers':
        return { tools: applyFilters(triggerTools), servers: [] as MCPServer[] };
      default:
        return { tools: applyFilters(tools), servers: applyFilters(mcpServers) };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, search, statusFilter]);

  // For the "All" tab, merge & sort by name
  const allSorted = useMemo(() => {
    if (activeTab !== 'all') return null;
    const merged: Array<{ kind: 'tool'; data: Tool } | { kind: 'mcp'; data: MCPServer }> = [
      ...tabItems.tools.map(t => ({ kind: 'tool' as const, data: t })),
      ...tabItems.servers.map(s => ({ kind: 'mcp' as const, data: s })),
    ];
    return merged.sort((a, b) => a.data.name.localeCompare(b.data.name));
  }, [activeTab, tabItems]);

  const totalCount = tabItems.tools.length + tabItems.servers.length;

  return (
    <div>
      {/* Header */}
      <div className={styles.header}>
        <div />
        <Button appearance="primary" icon={<Add24Regular />}>Register Tool</Button>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <TabList
          selectedValue={activeTab}
          onTabSelect={(_, d) => setActiveTab(d.value as TabValue)}
        >
          <Tab value="all">All</Tab>
          <Tab value="apis">APIs</Tab>
          <Tab value="mcp">MCP Servers</Tab>
          <Tab value="connectors">Connectors</Tab>
          <Tab value="triggers">Triggers</Tab>
        </TabList>
      </div>

      {/* Search + status filter */}
      <div className={styles.filters}>
        <Input
          placeholder="Search by name or description…"
          contentBefore={<Search24Regular />}
          value={search}
          onChange={(_, data) => setSearch(data.value)}
          style={{ minWidth: '280px' }}
        />
        <Dropdown
          placeholder="All statuses"
          value={statusFilter === 'all' ? 'All statuses' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
          onOptionSelect={(_, data) => setStatusFilter(data.optionValue || 'all')}
          style={{ minWidth: '150px' }}
        >
          <Option value="all">All statuses</Option>
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Dropdown>
        <Text size={200} style={{ color: '#999' }}>{totalCount} results</Text>
      </div>

      {/* Card grid */}
      <div className={styles.grid}>
        {activeTab === 'all' && allSorted
          ? allSorted.map(item =>
              item.kind === 'tool' ? (
                <ToolCard key={item.data.id} tool={item.data} showTypeIcon />
              ) : (
                <MCPCard key={item.data.id} server={item.data} showTypeIcon />
              ),
            )
          : (
            <>
              {tabItems.tools.map(t => (
                <ToolCard key={t.id} tool={t} />
              ))}
              {tabItems.servers.map(s => (
                <MCPCard key={s.id} server={s} />
              ))}
            </>
          )}
      </div>
    </div>
  );
};

export default Tools;
