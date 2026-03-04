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
  Input,
  Select,
} from '@fluentui/react-components';
import {
  Person24Regular,
  Apps24Regular,
  Key24Regular,
  Add24Regular,
  Search24Regular,
  ArrowSync24Regular,
  Dismiss24Regular,
  Clock24Regular,
  Warning24Regular,
  LockClosed24Regular,
} from '@fluentui/react-icons';
import { consumers, enforcementEvents } from '../data/mockData';

const useStyles = makeStyles({
  stats: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    alignItems: 'center',
  },
  statCard: {
    padding: '16px 24px',
    textAlign: 'center' as const,
    flex: 1,
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 700,
  },
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  tabs: {
    marginBottom: '20px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    minWidth: '260px',
  },
  consumerCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  consumerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  consumerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: '220px',
  },
  consumerIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  consumerMiddle: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  middleRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  consumerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    minWidth: '380px',
    justifyContent: 'flex-end',
  },
  usageStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '2px',
  },
  quotaBarContainer: {
    width: '100px',
    height: '8px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '4px',
    overflow: 'hidden',
  },
  quotaBar: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
  },
  statusGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end',
    gap: '4px',
    minWidth: '90px',
  },
  // API Keys tab
  keyCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  keyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  keyInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flex: 1,
  },
  keyPrefix: {
    fontFamily: 'monospace',
    fontSize: '13px',
    backgroundColor: tokens.colorNeutralBackground3,
    padding: '4px 10px',
    borderRadius: '4px',
  },
  keyActions: {
    display: 'flex',
    gap: '8px',
  },
  // Enforcement log
  eventCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    borderLeft: '4px solid transparent',
  },
  eventHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
  },
  eventLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  eventDetails: {
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    marginTop: '8px',
  },
  eventMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
    marginTop: '4px',
  },
  metaLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
});

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function relativeTime(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatTimestamp(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const typeIcons: Record<string, React.ReactElement> = {
  user: <Person24Regular />,
  application: <Apps24Regular />,
  'service-principal': <Key24Regular />,
};

const typeIconColors: Record<string, string> = {
  user: '#0078D4',
  application: '#8764B8',
  'service-principal': '#CA5010',
};

const authMethodColors: Record<string, { bg: string; fg: string; label: string }> = {
  'api-key': { bg: '#FFF4CE', fg: '#9D5D00', label: 'API Key' },
  'entra-id': { bg: '#D0E7FF', fg: '#0050A0', label: 'Entra ID' },
  oauth2: { bg: '#D4EDDA', fg: '#155724', label: 'OAuth 2.0' },
  'managed-identity': { bg: '#E8D4F0', fg: '#5B2D8E', label: 'Managed Identity' },
};

const statusAppearance: Record<string, { color: 'success' | 'danger' | 'warning'; label: string }> = {
  active: { color: 'success', label: 'Active' },
  suspended: { color: 'danger', label: 'Suspended' },
  pending: { color: 'warning', label: 'Pending' },
};

const actionBorderColors: Record<string, string> = {
  blocked: '#D13438',
  throttled: '#F7C948',
  warned: '#F7C948',
  'quota-exceeded': '#CA5010',
};

const actionAppearance: Record<string, { color: 'danger' | 'warning' | 'important'; label: string }> = {
  blocked: { color: 'danger', label: 'Blocked' },
  throttled: { color: 'warning', label: 'Throttled' },
  warned: { color: 'warning', label: 'Warned' },
  'quota-exceeded': { color: 'important', label: 'Quota Exceeded' },
};

const actionIcons: Record<string, React.ReactElement> = {
  blocked: <Dismiss24Regular style={{ color: '#D13438' }} />,
  throttled: <Clock24Regular style={{ color: '#9D5D00' }} />,
  warned: <Warning24Regular style={{ color: '#9D5D00' }} />,
  'quota-exceeded': <LockClosed24Regular style={{ color: '#CA5010' }} />,
};

const Consumers: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const activeCount = consumers.filter((c) => c.status === 'active').length;
  const userCount = consumers.filter((c) => c.type === 'user').length;
  const appCount = consumers.filter((c) => c.type === 'application' || c.type === 'service-principal').length;

  const filtered = consumers.filter((c) => {
    const matchSearch =
      !search ||
      c.displayName.toLowerCase().includes(search.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
    const matchType =
      typeFilter === 'all' ||
      (typeFilter === 'user' && c.type === 'user') ||
      (typeFilter === 'application' && (c.type === 'application' || c.type === 'service-principal'));
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const apiKeyConsumers = consumers.filter((c) => c.authMethod === 'api-key');

  function getQuotaPct(c: (typeof consumers)[0]): number {
    if (!c.quotas.tokensPerDay) return 0;
    return Math.min((c.usage24h.totalTokens / c.quotas.tokensPerDay) * 100, 100);
  }

  function getQuotaColor(pct: number): string {
    if (pct > 80) return '#D13438';
    if (pct > 60) return '#F7C948';
    return '#0E9349';
  }

  return (
    <div>
      {/* Header stats */}
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{consumers.length}</Text>
          <Text className={styles.statLabel}>Total Consumers</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{activeCount}</Text>
          <Text className={styles.statLabel}>Active</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{userCount}</Text>
          <Text className={styles.statLabel}>Users</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{appCount}</Text>
          <Text className={styles.statLabel}>Applications</Text>
        </Card>
        <Button appearance="primary" icon={<Add24Regular />}>
          Create Consumer
        </Button>
      </div>

      {/* Tabs */}
      <TabList
        className={styles.tabs}
        selectedValue={selectedTab}
        onTabSelect={(_, d) => setSelectedTab(d.value as string)}
      >
        <Tab value="all">All Consumers</Tab>
        <Tab value="keys">API Keys</Tab>
        <Tab value="enforcement">Enforcement Log</Tab>
      </TabList>

      {/* Tab: All Consumers */}
      {selectedTab === 'all' && (
        <div>
          <div className={styles.filters}>
            <Input
              className={styles.searchInput}
              contentBefore={<Search24Regular />}
              placeholder="Search by name or email..."
              value={search}
              onChange={(_, d) => setSearch(d.value)}
            />
            <Select value={typeFilter} onChange={(_, d) => setTypeFilter(d.value)}>
              <option value="all">All Types</option>
              <option value="user">Users</option>
              <option value="application">Applications</option>
            </Select>
            <Select value={statusFilter} onChange={(_, d) => setStatusFilter(d.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </Select>
          </div>

          {filtered.map((c) => {
            const quotaPct = getQuotaPct(c);
            const quotaColor = getQuotaColor(quotaPct);
            const authInfo = authMethodColors[c.authMethod] || authMethodColors['api-key'];
            const statusInfo = statusAppearance[c.status] || statusAppearance.active;

            return (
              <Card key={c.id} className={styles.consumerCard}>
                <div className={styles.consumerRow}>
                  {/* Left: icon + name + type */}
                  <div className={styles.consumerLeft}>
                    <div
                      className={styles.consumerIcon}
                      style={{ backgroundColor: `${typeIconColors[c.type]}18`, color: typeIconColors[c.type] }}
                    >
                      {typeIcons[c.type]}
                    </div>
                    <div>
                      <Text weight="semibold" style={{ display: 'block' }}>
                        {c.displayName}
                      </Text>
                      <Badge appearance="outline" size="small" style={{ marginTop: '4px' }}>
                        {c.type}
                      </Badge>
                    </div>
                  </div>

                  {/* Middle: auth, team, namespace, key info */}
                  <div className={styles.consumerMiddle}>
                    <div className={styles.middleRow}>
                      <span
                        style={{
                          backgroundColor: authInfo.bg,
                          color: authInfo.fg,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {authInfo.label}
                      </span>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        Team: {c.team}
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        Namespace: {c.namespace}
                      </Text>
                    </div>
                    {c.apiKeyPrefix && (
                      <div className={styles.middleRow}>
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3, fontFamily: 'monospace' }}>
                          Key: {c.apiKeyPrefix}...
                        </Text>
                        {c.apiKeyCreatedAt && (
                          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                            Created: {formatDate(c.apiKeyCreatedAt)}
                          </Text>
                        )}
                        {c.apiKeyExpiresAt && (
                          <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                            Expires: {formatDate(c.apiKeyExpiresAt)}
                          </Text>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right: usage, quota bar, status */}
                  <div className={styles.consumerRight}>
                    <div className={styles.usageStats}>
                      <Text size={200}>
                        <strong>{formatTokens(c.usage24h.totalTokens)}</strong> tokens
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        ${c.usage24h.totalCost.toFixed(2)} · {c.usage24h.totalRequests.toLocaleString()} req
                      </Text>
                    </div>
                    <div>
                      <div className={styles.quotaBarContainer}>
                        <div
                          className={styles.quotaBar}
                          style={{ width: `${quotaPct}%`, backgroundColor: quotaColor }}
                        />
                      </div>
                      <Text
                        size={100}
                        style={{ color: tokens.colorNeutralForeground3, display: 'block', textAlign: 'center' }}
                      >
                        {quotaPct.toFixed(0)}%
                      </Text>
                    </div>
                    <div className={styles.statusGroup}>
                      <Badge color={statusInfo.color} size="small">
                        {statusInfo.label}
                      </Badge>
                      <Text size={100} style={{ color: tokens.colorNeutralForeground3 }}>
                        {relativeTime(c.lastActive)}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filtered.length === 0 && (
            <Card className={styles.consumerCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                No consumers match the current filters.
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Tab: API Keys */}
      {selectedTab === 'keys' && (
        <div>
          {apiKeyConsumers.map((c) => {
            const statusInfo = statusAppearance[c.status] || statusAppearance.active;
            return (
              <Card key={c.id} className={styles.keyCard}>
                <div className={styles.keyRow}>
                  <div className={styles.keyInfo}>
                    <Key24Regular style={{ color: '#CA5010', flexShrink: 0 }} />
                    <span className={styles.keyPrefix}>{c.apiKeyPrefix || '—'}...</span>
                    <div>
                      <Text weight="semibold" style={{ display: 'block' }}>
                        {c.displayName}
                      </Text>
                      <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                        {c.apiKeyCreatedAt ? `Created: ${formatDate(c.apiKeyCreatedAt)}` : ''}
                        {c.apiKeyExpiresAt ? ` · Expires: ${formatDate(c.apiKeyExpiresAt)}` : ''}
                      </Text>
                    </div>
                    <Badge color={statusInfo.color} size="small">
                      {statusInfo.label}
                    </Badge>
                  </div>
                  <div className={styles.keyActions}>
                    <Button appearance="outline" size="small">
                      Copy Endpoint
                    </Button>
                    <Button appearance="outline" size="small" icon={<ArrowSync24Regular />}>
                      Rotate Key
                    </Button>
                    <Button appearance="outline" size="small" icon={<Dismiss24Regular />}>
                      Revoke
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}

          {apiKeyConsumers.length === 0 && (
            <Card className={styles.keyCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                No API key consumers found.
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Enforcement Log */}
      {selectedTab === 'enforcement' && (
        <div>
          {enforcementEvents.map((e) => {
            const borderColor = actionBorderColors[e.action] || tokens.colorNeutralStroke2;
            const actionInfo = actionAppearance[e.action] || actionAppearance.warned;
            return (
              <Card
                key={e.id}
                className={styles.eventCard}
                style={{ borderLeftColor: borderColor }}
              >
                <div className={styles.eventHeader}>
                  <div className={styles.eventLeft}>
                    {actionIcons[e.action] || <Warning24Regular />}
                    <div>
                      <Text weight="semibold">{e.consumerName}</Text>
                      <Badge
                        color={actionInfo.color}
                        size="small"
                        style={{ marginLeft: '8px' }}
                      >
                        {actionInfo.label}
                      </Badge>
                    </div>
                  </div>
                  <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                    {formatTimestamp(e.timestamp)}
                  </Text>
                </div>
                <div className={styles.eventMeta}>
                  <Text size={200}>
                    <span className={styles.metaLabel}>Policy:</span>{' '}
                    <strong>{e.policyName}</strong>
                  </Text>
                  <Text size={200}>
                    <span className={styles.metaLabel}>Asset:</span>{' '}
                    <strong>{e.assetName}</strong>
                  </Text>
                  <Text size={200}>
                    <span className={styles.metaLabel}>Reason:</span> {e.reason}
                  </Text>
                </div>
                {e.details && (
                  <Text className={styles.eventDetails}>{e.details}</Text>
                )}
              </Card>
            );
          })}

          {enforcementEvents.length === 0 && (
            <Card className={styles.eventCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: tokens.colorNeutralForeground3 }}>
                No enforcement events recorded.
              </Text>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default Consumers;
