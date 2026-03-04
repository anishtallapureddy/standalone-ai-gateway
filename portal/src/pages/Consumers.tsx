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
  Checkmark24Regular,
  DocumentBulletList24Regular,
  ShieldCheckmark24Regular,
} from '@fluentui/react-icons';
import { consumers, enforcementEvents, accessRequests, auditLog } from '../data/mockData';

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
  // Enforcement / Audit
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
  // Access Requests
  requestCard: {
    padding: '16px 20px',
    marginBottom: '12px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  requestRow: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '16px',
  },
  requestInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  requestActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
    alignItems: 'center',
  },
  // Audit log
  auditCard: {
    padding: '14px 20px',
    marginBottom: '10px',
    borderLeft: '4px solid transparent',
  },
  auditRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },
  auditInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  auditMeta: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
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
  'api-key': { bg: '#3d3200', fg: '#F7C948', label: 'API Key' },
  'entra-id': { bg: '#1a2d4d', fg: '#60cdff', label: 'Entra ID' },
  oauth2: { bg: '#1a3a2a', fg: '#4ade80', label: 'OAuth 2.0' },
  'managed-identity': { bg: '#2d1a4d', fg: '#c084fc', label: 'Managed Identity' },
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

const requestTypeLabels: Record<string, { label: string; bg: string; fg: string }> = {
  'namespace-access': { label: 'Namespace Access', bg: '#1e293b', fg: '#93c5fd' },
  'model-access': { label: 'Model Access', bg: '#1a2d1a', fg: '#86efac' },
  'tool-access': { label: 'Tool Access', bg: '#2d1a4d', fg: '#c084fc' },
  'role-change': { label: 'Role Change', bg: '#3d2800', fg: '#fbbf24' },
};

const auditOutcomeColors: Record<string, string> = {
  success: '#0E9349',
  failure: '#D13438',
  denied: '#CA5010',
};

const Consumers: React.FC = () => {
  const styles = useStyles();
  const [selectedTab, setSelectedTab] = useState<string>('users');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [requestFilter, setRequestFilter] = useState('all');

  const users = consumers.filter(c => c.type === 'user');
  const serviceIdentities = consumers.filter(c => c.type === 'application' || c.type === 'service-principal');
  const pendingRequests = accessRequests.filter(r => r.status === 'pending');

  // Filter identities based on current tab and filters
  const getFilteredIdentities = (list: typeof consumers) => {
    return list.filter(c => {
      const matchSearch = !search ||
        c.displayName.toLowerCase().includes(search.toLowerCase()) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  };

  const apiKeyConsumers = consumers.filter((c) => c.authMethod === 'api-key');

  const filteredRequests = accessRequests.filter(r => {
    if (requestFilter !== 'all' && r.status !== requestFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return r.requesterName.toLowerCase().includes(q) || r.targetName.toLowerCase().includes(q);
  });

  const filteredAudit = auditLog.filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return a.actor.toLowerCase().includes(q) || a.resource.toLowerCase().includes(q) || a.action.toLowerCase().includes(q);
  });

  function getQuotaPct(c: (typeof consumers)[0]): number {
    if (!c.quotas.tokensPerDay) return 0;
    return Math.min((c.usage24h.totalTokens / c.quotas.tokensPerDay) * 100, 100);
  }

  function getQuotaColor(pct: number): string {
    if (pct > 80) return '#D13438';
    if (pct > 60) return '#F7C948';
    return '#0E9349';
  }

  const renderIdentityCard = (c: (typeof consumers)[0]) => {
    const quotaPct = getQuotaPct(c);
    const quotaColor = getQuotaColor(quotaPct);
    const authInfo = authMethodColors[c.authMethod] || authMethodColors['api-key'];
    const statusInfo = statusAppearance[c.status] || statusAppearance.active;

    return (
      <Card key={c.id} className={styles.consumerCard}>
        <div className={styles.consumerRow}>
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
              {c.email && (
                <Text size={200} style={{ color: '#999', fontFamily: 'monospace' }}>{c.email}</Text>
              )}
            </div>
          </div>

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
              <Text size={200} style={{ color: '#999' }}>
                Namespace: <strong>{c.namespace}</strong>
              </Text>
              <Text size={200} style={{ color: '#999' }}>
                Team: {c.team}
              </Text>
            </div>
            {c.apiKeyPrefix && (
              <div className={styles.middleRow}>
                <Text size={200} style={{ color: '#999', fontFamily: 'monospace' }}>
                  Key: {c.apiKeyPrefix}...
                </Text>
                {c.apiKeyExpiresAt && (
                  <Text size={200} style={{ color: '#999' }}>
                    Expires: {formatDate(c.apiKeyExpiresAt)}
                  </Text>
                )}
              </div>
            )}
          </div>

          <div className={styles.consumerRight}>
            <div className={styles.usageStats}>
              <Text size={200}>
                <strong>{formatTokens(c.usage24h.totalTokens)}</strong> tokens
              </Text>
              <Text size={200} style={{ color: '#999' }}>
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
                style={{ color: '#999', display: 'block', textAlign: 'center' }}
              >
                {quotaPct.toFixed(0)}%
              </Text>
            </div>
            <div className={styles.statusGroup}>
              <Badge color={statusInfo.color} size="small">
                {statusInfo.label}
              </Badge>
              <Text size={100} style={{ color: '#999' }}>
                {relativeTime(c.lastActive)}
              </Text>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {/* Header stats */}
      <div className={styles.stats}>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{users.length}</Text>
          <Text className={styles.statLabel}>Users</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{serviceIdentities.length}</Text>
          <Text className={styles.statLabel}>Service Identities</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue}>{apiKeyConsumers.length}</Text>
          <Text className={styles.statLabel}>API Keys</Text>
        </Card>
        <Card className={styles.statCard}>
          <Text className={styles.statValue} style={{ color: pendingRequests.length > 0 ? '#F7C948' : undefined }}>
            {pendingRequests.length}
          </Text>
          <Text className={styles.statLabel}>Pending Requests</Text>
        </Card>
        <Button appearance="primary" icon={<Add24Regular />}>
          Invite User
        </Button>
      </div>

      {/* Tabs — aligned to governance spec */}
      <TabList
        className={styles.tabs}
        selectedValue={selectedTab}
        onTabSelect={(_, d) => setSelectedTab(d.value as string)}
      >
        <Tab value="users" icon={<Person24Regular />}>Users ({users.length})</Tab>
        <Tab value="services" icon={<Apps24Regular />}>Service Identities ({serviceIdentities.length})</Tab>
        <Tab value="keys" icon={<Key24Regular />}>API Keys ({apiKeyConsumers.length})</Tab>
        <Tab value="requests" icon={<ShieldCheckmark24Regular />}>
          Access Requests {pendingRequests.length > 0 && (
            <Badge appearance="filled" size="small" color="warning" style={{ marginLeft: '6px' }}>
              {pendingRequests.length}
            </Badge>
          )}
        </Tab>
        <Tab value="audit" icon={<DocumentBulletList24Regular />}>Audit Log</Tab>
      </TabList>

      {/* Tab: Users */}
      {selectedTab === 'users' && (
        <div>
          <div className={styles.filters}>
            <Input
              className={styles.searchInput}
              contentBefore={<Search24Regular />}
              placeholder="Search users by name or email..."
              value={search}
              onChange={(_, d) => setSearch(d.value)}
            />
            <Select value={statusFilter} onChange={(_, d) => setStatusFilter(d.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </Select>
          </div>
          {getFilteredIdentities(users).map(renderIdentityCard)}
          {getFilteredIdentities(users).length === 0 && (
            <Card className={styles.consumerCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: '#999' }}>
                No users match the current filters.
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Service Identities */}
      {selectedTab === 'services' && (
        <div>
          <div className={styles.filters}>
            <Input
              className={styles.searchInput}
              contentBefore={<Search24Regular />}
              placeholder="Search service identities..."
              value={search}
              onChange={(_, d) => setSearch(d.value)}
            />
            <Select value={statusFilter} onChange={(_, d) => setStatusFilter(d.value)}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
          {getFilteredIdentities(serviceIdentities).map(renderIdentityCard)}
          {getFilteredIdentities(serviceIdentities).length === 0 && (
            <Card className={styles.consumerCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: '#999' }}>
                No service identities match the current filters.
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
                      <Text size={200} style={{ color: '#999' }}>
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
                      Rotate
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
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: '#999' }}>
                No API key consumers found.
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Access Requests */}
      {selectedTab === 'requests' && (
        <div>
          <div className={styles.filters}>
            <Input
              className={styles.searchInput}
              contentBefore={<Search24Regular />}
              placeholder="Search requests..."
              value={search}
              onChange={(_, d) => setSearch(d.value)}
            />
            <Select value={requestFilter} onChange={(_, d) => setRequestFilter(d.value)}>
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="denied">Denied</option>
            </Select>
          </div>

          {filteredRequests.map(r => {
            const typeInfo = requestTypeLabels[r.type] || requestTypeLabels['namespace-access'];
            const statusColor = r.status === 'approved' ? 'success' : r.status === 'denied' ? 'danger' : 'warning';

            return (
              <Card key={r.id} className={styles.requestCard}>
                <div className={styles.requestRow}>
                  <div className={styles.requestInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text weight="semibold">{r.requesterName}</Text>
                      <span
                        style={{
                          backgroundColor: typeInfo.bg,
                          color: typeInfo.fg,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600,
                        }}
                      >
                        {typeInfo.label}
                      </span>
                      <Badge color={statusColor} size="small">{r.status}</Badge>
                    </div>
                    <Text size={200} style={{ color: '#999' }}>
                      Requesting <strong>{r.requestedRole}</strong> access to <strong>{r.targetName}</strong> in namespace <strong>{r.targetNamespace}</strong>
                    </Text>
                    <Text size={200} style={{ color: '#bbb', fontStyle: 'italic', marginTop: '2px' }}>
                      "{r.justification}"
                    </Text>
                    <div className={styles.auditMeta}>
                      <Text size={200} style={{ color: '#999' }}>
                        Requested {relativeTime(r.createdAt)}
                      </Text>
                      {r.reviewedBy && (
                        <Text size={200} style={{ color: '#999' }}>
                          Reviewed by <strong>{r.reviewedBy}</strong>
                        </Text>
                      )}
                    </div>
                  </div>
                  {r.status === 'pending' && (
                    <div className={styles.requestActions}>
                      <Button appearance="primary" size="small" icon={<Checkmark24Regular />}>
                        Approve
                      </Button>
                      <Button appearance="outline" size="small" icon={<Dismiss24Regular />}>
                        Deny
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}

          {filteredRequests.length === 0 && (
            <Card className={styles.requestCard}>
              <Text style={{ padding: '20px', display: 'block', textAlign: 'center', color: '#999' }}>
                No access requests match the current filters.
              </Text>
            </Card>
          )}
        </div>
      )}

      {/* Tab: Audit Log */}
      {selectedTab === 'audit' && (
        <div>
          <div className={styles.filters}>
            <Input
              className={styles.searchInput}
              contentBefore={<Search24Regular />}
              placeholder="Search audit log..."
              value={search}
              onChange={(_, d) => setSearch(d.value)}
            />
          </div>

          {filteredAudit.map(a => {
            const borderColor = auditOutcomeColors[a.outcome] || '#555';
            return (
              <Card key={a.id} className={styles.auditCard} style={{ borderLeftColor: borderColor }}>
                <div className={styles.auditRow}>
                  <div className={styles.auditInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Text weight="semibold">{a.action}</Text>
                      <Badge
                        appearance="filled"
                        size="small"
                        style={{
                          backgroundColor: a.outcome === 'success' ? '#1a3a2a' : a.outcome === 'denied' ? '#3d1a1a' : '#3d2800',
                          color: a.outcome === 'success' ? '#4ade80' : a.outcome === 'denied' ? '#f87171' : '#fbbf24',
                        }}
                      >
                        {a.outcome}
                      </Badge>
                      <Badge appearance="outline" size="small">{a.resourceType}</Badge>
                    </div>
                    <div className={styles.auditMeta}>
                      <Text size={200} style={{ color: '#999' }}>
                        Actor: <strong>{a.actor}</strong>
                      </Text>
                      <Text size={200} style={{ color: '#999' }}>
                        Resource: <strong>{a.resource}</strong>
                      </Text>
                      <Text size={200} style={{ color: '#999' }}>
                        Namespace: <strong>{a.namespace}</strong>
                      </Text>
                    </div>
                    <Text size={200} style={{ color: '#bbb', marginTop: '2px' }}>
                      {a.details}
                    </Text>
                  </div>
                  <Text size={200} style={{ color: '#999', flexShrink: 0, whiteSpace: 'nowrap' }}>
                    {formatTimestamp(a.timestamp)}
                  </Text>
                </div>
              </Card>
            );
          })}

          {/* Enforcement events inline under audit */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #333', paddingTop: '16px' }}>
            <Text weight="semibold" size={400} style={{ display: 'block', marginBottom: '12px' }}>
              Policy Enforcement Events
            </Text>
            {enforcementEvents.map((e) => {
              const borderColor = actionBorderColors[e.action] || '#555';
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
                    <Text size={200} style={{ color: '#999' }}>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Consumers;
