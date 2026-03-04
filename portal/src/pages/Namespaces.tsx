import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Input,
  TabList,
  Tab,
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
  Person24Regular,
  Building24Regular,
  ArrowLeft24Regular,
  People24Regular,
  Key24Regular,
  LockClosed20Regular,
} from '@fluentui/react-icons';
import { namespaces } from '../data/mockData';
import type { Namespace } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '12px',
  },
  tabBar: {
    marginBottom: '16px',
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
  noPolicies: {
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#666',
    fontSize: '12px',
    fontStyle: 'italic',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
    marginTop: '12px',
  },
  // Detail view styles
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
  },
  detailStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '12px',
    marginBottom: '24px',
  },
  detailStat: {
    padding: '16px',
    textAlign: 'center' as const,
  },
  detailStatValue: {
    fontSize: '24px',
    fontWeight: 700,
  },
  detailStatLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    marginTop: '24px',
  },
  sectionIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  credRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    borderBottom: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

type TabValue = 'all' | 'managed' | 'personal';

const roleColors: Record<string, { bg: string; color: string }> = {
  'namespace-admin': { bg: '#312e81', color: '#a5b4fc' },
  'ai-developer': { bg: '#1a3a2a', color: '#4ade80' },
  viewer: { bg: '#1e293b', color: '#94a3b8' },
};

const envColors: Record<string, { bg: string; color: string }> = {
  production: { bg: '#1a3a2a', color: '#4ade80' },
  development: { bg: '#3d2800', color: '#fbbf24' },
  sandbox: { bg: '#1a2d3d', color: '#38bdf8' },
};

const Namespaces: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<TabValue>('all');
  const [selected, setSelected] = useState<Namespace | null>(null);

  const filtered = namespaces.filter(ns => {
    if (tab !== 'all' && ns.type !== tab) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return ns.name.includes(q) || ns.displayName.toLowerCase().includes(q) || ns.description.toLowerCase().includes(q);
  });

  const managedCount = namespaces.filter(n => n.type === 'managed').length;
  const personalCount = namespaces.filter(n => n.type === 'personal').length;

  // ─── Detail View ───
  if (selected) {
    const ns = selected;
    const isManaged = ns.type === 'managed';
    const iconBg = isManaged ? '#1e293b' : '#1a2332';
    const iconColor = isManaged ? '#6366f1' : '#60cdff';
    const envStyle = envColors[ns.environment] || envColors.production;

    return (
      <div>
        {/* Back + Header */}
        <div className={styles.detailHeader}>
          <Button appearance="subtle" icon={<ArrowLeft24Regular />} onClick={() => setSelected(null)}>
            Namespaces
          </Button>
          <div className={styles.nsIcon} style={{ backgroundColor: iconBg, color: iconColor }}>
            {isManaged ? <Building24Regular /> : <Person24Regular />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text weight="semibold" size={500}>{ns.displayName}</Text>
              <Badge appearance="filled" size="small" style={{
                backgroundColor: isManaged ? '#312e81' : '#1e3a5f',
                color: isManaged ? '#a5b4fc' : '#7dd3fc',
              }}>
                {isManaged ? 'Managed' : 'Personal'}
              </Badge>
              <Badge appearance="filled" size="small" style={{ backgroundColor: envStyle.bg, color: envStyle.color }}>
                {ns.environment}
              </Badge>
            </div>
            <Text size={200} style={{ color: '#999' }}>
              {ns.name} · Owner: {ns.owner} · Created {new Date(ns.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </div>
        </div>

        {/* Description */}
        <Card style={{ padding: '16px', marginBottom: '16px' }}>
          <Text size={300}>{ns.description}</Text>
        </Card>

        {/* Summary Stats */}
        <div className={styles.detailStats}>
          <Card className={styles.detailStat}>
            <div className={styles.detailStatValue} style={{ color: '#4ade80' }}>{ns.totalAssets}</div>
            <div className={styles.detailStatLabel}>Assets</div>
          </Card>
          <Card className={styles.detailStat}>
            <div className={styles.detailStatValue} style={{ color: '#6366f1' }}>{ns.members.length}</div>
            <div className={styles.detailStatLabel}>Members</div>
          </Card>
          <Card className={styles.detailStat}>
            <div className={styles.detailStatValue} style={{ color: '#38bdf8' }}>{ns.serviceIdentities.length}</div>
            <div className={styles.detailStatLabel}>Service Identities</div>
          </Card>
          <Card className={styles.detailStat}>
            <div className={styles.detailStatValue} style={{ color: '#fbbf24' }}>{ns.policies.length}</div>
            <div className={styles.detailStatLabel}>Policies</div>
          </Card>
          <Card className={styles.detailStat}>
            <div className={styles.detailStatValue} style={{ color: '#c084fc' }}>{ns.credentials.length}</div>
            <div className={styles.detailStatLabel}>Credentials</div>
          </Card>
        </div>

        {/* ── Assets ── */}
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ backgroundColor: '#1a3a2a', color: '#4ade80' }}>
            <BrainCircuit20Regular />
          </div>
          <Text weight="semibold" size={400}>Assets</Text>
          <Badge appearance="outline" size="small">{ns.totalAssets}</Badge>
        </div>
        <Card style={{ padding: '16px' }}>
          <div className={styles.assetCounts}>
            {ns.assetCount.models > 0 && (
              <div className={styles.assetCount}>
                <BrainCircuit20Regular style={{ color: '#6366f1' }} />
                <Text size={200} weight="semibold">{ns.assetCount.models}</Text>
                <Text size={200} style={{ color: '#999' }}>models</Text>
              </div>
            )}
            {ns.assetCount.tools > 0 && (
              <div className={styles.assetCount}>
                <PlugConnected20Regular style={{ color: '#0ea5e9' }} />
                <Text size={200} weight="semibold">{ns.assetCount.tools}</Text>
                <Text size={200} style={{ color: '#999' }}>tools</Text>
              </div>
            )}
            {ns.assetCount.mcpServers > 0 && (
              <div className={styles.assetCount}>
                <Server20Regular style={{ color: '#8b5cf6' }} />
                <Text size={200} weight="semibold">{ns.assetCount.mcpServers}</Text>
                <Text size={200} style={{ color: '#999' }}>MCP servers</Text>
              </div>
            )}
            {ns.assetCount.agents > 0 && (
              <div className={styles.assetCount}>
                <Bot20Regular style={{ color: '#10b981' }} />
                <Text size={200} weight="semibold">{ns.assetCount.agents}</Text>
                <Text size={200} style={{ color: '#999' }}>agents</Text>
              </div>
            )}
            {ns.assetCount.skills > 0 && (
              <div className={styles.assetCount}>
                <LightbulbFilament20Regular style={{ color: '#f59e0b' }} />
                <Text size={200} weight="semibold">{ns.assetCount.skills}</Text>
                <Text size={200} style={{ color: '#999' }}>skills</Text>
              </div>
            )}
            {ns.totalAssets === 0 && (
              <Text size={200} style={{ color: '#666', fontStyle: 'italic' }}>No assets in this namespace</Text>
            )}
          </div>
        </Card>

        {/* ── Members ── */}
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ backgroundColor: '#1e293b', color: '#6366f1' }}>
            <People24Regular />
          </div>
          <Text weight="semibold" size={400}>Members</Text>
          <Badge appearance="outline" size="small">{ns.members.length}</Badge>
          <Button appearance="primary" size="small" icon={<Add24Regular />} style={{ marginLeft: 'auto' }}>Add Member</Button>
        </div>
        <Card style={{ padding: 0 }}>
          {ns.members.map((m) => {
            const rc = roleColors[m.role] || roleColors.viewer;
            return (
              <div key={m.name} className={styles.memberRow}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Person24Regular style={{ color: '#999' }} />
                  <Text size={300}>{m.name}</Text>
                </div>
                <Badge appearance="filled" size="small" style={{ backgroundColor: rc.bg, color: rc.color }}>
                  {m.role}
                </Badge>
              </div>
            );
          })}
          {ns.members.length === 0 && (
            <div style={{ padding: '16px', color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
              No members — personal namespaces inherit from owner
            </div>
          )}
        </Card>

        {/* ── Service Identities ── */}
        {ns.serviceIdentities.length > 0 && (
          <>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon} style={{ backgroundColor: '#1a2d3d', color: '#38bdf8' }}>
                <Bot20Regular />
              </div>
              <Text weight="semibold" size={400}>Service Identities</Text>
              <Badge appearance="outline" size="small">{ns.serviceIdentities.length}</Badge>
            </div>
            <Card style={{ padding: 0 }}>
              {ns.serviceIdentities.map((si) => (
                <div key={si.name} className={styles.memberRow}>
                  <Text size={300} style={{ fontFamily: 'monospace' }}>{si.name}</Text>
                  <Text size={200} style={{ color: '#999' }}>{si.purpose}</Text>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* ── Policies ── */}
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ backgroundColor: '#3d2800', color: '#fbbf24' }}>
            <Shield20Regular />
          </div>
          <Text weight="semibold" size={400}>Policies</Text>
          <Badge appearance="outline" size="small">{ns.policies.length}</Badge>
        </div>
        <Card style={{ padding: '16px' }}>
          {ns.policies.length > 0 ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {ns.policies.map(p => (
                <Badge key={p} appearance="tint" color="warning" size="medium">{p}</Badge>
              ))}
            </div>
          ) : (
            <Text size={200} style={{ color: '#666', fontStyle: 'italic' }}>
              {isManaged ? 'No policies assigned — configure policies to enforce governance' : 'Inherits organization-level policies'}
            </Text>
          )}
        </Card>

        {/* ── Credentials ── */}
        <div className={styles.sectionTitle}>
          <div className={styles.sectionIcon} style={{ backgroundColor: '#2d1a4d', color: '#c084fc' }}>
            <LockClosed20Regular />
          </div>
          <Text weight="semibold" size={400}>Credentials</Text>
          <Badge appearance="outline" size="small">{ns.credentials.length}</Badge>
          {isManaged && <Button appearance="primary" size="small" icon={<Key24Regular />} style={{ marginLeft: 'auto' }}>Add Credential</Button>}
        </div>
        <Card style={{ padding: 0 }}>
          {ns.credentials.map((c) => (
            <div key={c.name} className={styles.credRow}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key24Regular style={{ color: '#c084fc' }} />
                <Text size={300} style={{ fontFamily: 'monospace' }}>{c.name}</Text>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Badge appearance="outline" size="small">{c.type}</Badge>
                <Badge appearance="filled" size="small" style={{
                  backgroundColor: (envColors[c.environment] || envColors.production).bg,
                  color: (envColors[c.environment] || envColors.production).color,
                }}>
                  {c.environment}
                </Badge>
              </div>
            </div>
          ))}
          {ns.credentials.length === 0 && (
            <div style={{ padding: '16px', color: '#666', fontStyle: 'italic', fontSize: '13px' }}>
              No credentials configured
            </div>
          )}
        </Card>
      </div>
    );
  }

  // ─── List View ───
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
          <Text size={200} style={{ color: '#999' }}>{filtered.length} namespaces</Text>
        </div>
        <Button appearance="primary" icon={<Add24Regular />}>Create Namespace</Button>
      </div>

      <div className={styles.tabBar}>
        <TabList selectedValue={tab} onTabSelect={(_, d) => setTab(d.value as TabValue)}>
          <Tab value="all">All ({namespaces.length})</Tab>
          <Tab value="managed" icon={<Building24Regular />}>Managed ({managedCount})</Tab>
          <Tab value="personal" icon={<Person24Regular />}>Personal ({personalCount})</Tab>
        </TabList>
      </div>

      <div className={styles.grid}>
        {filtered.map((ns) => {
          const isManaged = ns.type === 'managed';
          const iconBg = isManaged ? '#1e293b' : '#1a2332';
          const iconColor = isManaged ? '#6366f1' : '#60cdff';

          return (
            <Card key={ns.id} className={styles.card} onClick={() => setSelected(ns)}>
              <div className={styles.cardHeader}>
                <div className={styles.titleRow}>
                  <div className={styles.nsIcon} style={{ backgroundColor: iconBg, color: iconColor }}>
                    {isManaged ? <Building24Regular /> : <Person24Regular />}
                  </div>
                  <div>
                    <Text weight="semibold" size={400}>{ns.displayName}</Text>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <Text size={200} style={{ fontFamily: 'monospace', color: '#999' }}>{ns.name}</Text>
                      <Badge
                        appearance="filled"
                        size="small"
                        style={{
                          backgroundColor: isManaged ? '#312e81' : '#1e3a5f',
                          color: isManaged ? '#a5b4fc' : '#7dd3fc',
                        }}
                      >
                        {isManaged ? 'Managed' : 'Personal'}
                      </Badge>
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
                    <Text size={200} style={{ color: '#999' }}>models</Text>
                  </div>
                )}
                {ns.assetCount.tools > 0 && (
                  <div className={styles.assetCount}>
                    <PlugConnected20Regular style={{ color: '#0ea5e9' }} />
                    <Text size={200} weight="semibold">{ns.assetCount.tools}</Text>
                    <Text size={200} style={{ color: '#999' }}>tools</Text>
                  </div>
                )}
                {ns.assetCount.mcpServers > 0 && (
                  <div className={styles.assetCount}>
                    <Server20Regular style={{ color: '#8b5cf6' }} />
                    <Text size={200} weight="semibold">{ns.assetCount.mcpServers}</Text>
                    <Text size={200} style={{ color: '#999' }}>MCP</Text>
                  </div>
                )}
                {ns.assetCount.agents > 0 && (
                  <div className={styles.assetCount}>
                    <Bot20Regular style={{ color: '#10b981' }} />
                    <Text size={200} weight="semibold">{ns.assetCount.agents}</Text>
                    <Text size={200} style={{ color: '#999' }}>agents</Text>
                  </div>
                )}
                {ns.assetCount.skills > 0 && (
                  <div className={styles.assetCount}>
                    <LightbulbFilament20Regular style={{ color: '#f59e0b' }} />
                    <Text size={200} weight="semibold">{ns.assetCount.skills}</Text>
                    <Text size={200} style={{ color: '#999' }}>skills</Text>
                  </div>
                )}
              </div>

              {/* Members summary on card */}
              <div style={{
                paddingTop: '12px',
                borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <People24Regular style={{ color: '#999', fontSize: '14px' }} />
                  <Text size={200} style={{ color: '#999' }}>{ns.members.length} member{ns.members.length !== 1 ? 's' : ''}</Text>
                </div>
                {ns.serviceIdentities.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bot20Regular style={{ color: '#999' }} />
                    <Text size={200} style={{ color: '#999' }}>{ns.serviceIdentities.length} service{ns.serviceIdentities.length !== 1 ? 's' : ''}</Text>
                  </div>
                )}
                {ns.credentials.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LockClosed20Regular style={{ color: '#999' }} />
                    <Text size={200} style={{ color: '#999' }}>{ns.credentials.length} credential{ns.credentials.length !== 1 ? 's' : ''}</Text>
                  </div>
                )}
              </div>

              {ns.policies.length > 0 ? (
                <div className={styles.policies}>
                  <Shield20Regular style={{ color: '#999' }} />
                  {ns.policies.map(p => (
                    <Badge key={p} appearance="outline" size="small">{p}</Badge>
                  ))}
                </div>
              ) : (
                <div className={styles.noPolicies}>
                  {isManaged ? 'No policies assigned' : 'Inherits org-level policies'}
                </div>
              )}

              <div className={styles.footer}>
                <Text size={200} style={{ color: '#999' }}>Owner: <b>{ns.owner}</b></Text>
                <Text size={200} style={{ color: '#999' }}>
                  Created {new Date(ns.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </Text>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Namespaces;
