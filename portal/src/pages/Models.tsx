import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  TabList,
  Tab,
} from '@fluentui/react-components';
import {
  Add24Regular,
  ArrowLeft24Regular,
  Globe24Regular,
  ArrowSync24Regular,
  Shield24Regular,
  Warning24Regular,
  Checkmark24Regular,
  ChevronRight24Regular,
  DataUsage24Regular,
  Clock24Regular,
  ArrowRouting24Regular,
  HeartPulse24Regular,
} from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { models, routingConfigs, failoverEvents } from '../data/mockData';
import type { Model, ModelDeployment, RoutingConfig, FailoverEvent } from '../data/mockData';

/* ------------------------------------------------------------------ */
/*  Styles                                                            */
/* ------------------------------------------------------------------ */

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  card: {
    padding: '0',
  },
  usageBar: {
    width: '100px',
    height: '6px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'inline-block',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  usageBarWide: {
    width: '100%',
    height: '6px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '4px',
  },
  usageFill: {
    height: '100%',
    borderRadius: '3px',
  },
  viewDetails: {
    cursor: 'pointer',
    color: tokens.colorBrandForeground1,
    fontSize: '12px',
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '2px',
    ':hover': {
      textDecorationLine: 'underline',
    },
  },

  /* Detail view */
  detailHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  backButton: {
    minWidth: 'auto',
  },
  detailTitle: {
    fontSize: '20px',
    fontWeight: 600,
  },
  tabContent: {
    marginTop: '20px',
  },

  /* Stats row */
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '20px',
  },
  statCard: {
    padding: '16px',
  },
  statLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    marginBottom: '4px',
  },
  statValue: {
    fontSize: '20px',
    fontWeight: 600,
  },

  /* Info card */
  infoCard: {
    padding: '16px',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '8px',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    minWidth: '100px',
  },

  /* Failover targets */
  targetList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  targetItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '6px',
    backgroundColor: tokens.colorNeutralBackground3,
  },

  /* Routing tab */
  routingHeader: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    marginBottom: '20px',
    alignItems: 'center',
  },
  deploymentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  deployCard: {
    padding: '16px',
  },
  deployHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  deployRegion: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: 600,
  },
  deployStat: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    marginBottom: '6px',
  },
  statusDot: {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },

  /* Failover chain */
  failoverChain: {
    display: 'flex',
    alignItems: 'center',
    gap: '0px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  chainBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: tokens.colorNeutralBackground3,
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    minWidth: '120px',
    textAlign: 'center' as const,
  },
  chainArrow: {
    padding: '0 8px',
    fontSize: '18px',
    color: tokens.colorNeutralForeground3,
  },
  chainLabel: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground3,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
  },

  /* Failover events */
  eventCard: {
    padding: '16px',
    marginBottom: '12px',
  },
  eventHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  eventFlow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
  },
  eventMeta: {
    display: 'flex',
    gap: '12px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '40px 20px',
    color: tokens.colorNeutralForeground3,
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '12px',
  },
});

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const providerColors: Record<string, string> = {
  'Azure OpenAI': '#0078d4',
  'Anthropic': '#d97706',
  'Google Vertex AI': '#4285f4',
  'AWS Bedrock': '#ff9900',
  'Custom': '#6b7280',
};

const deploymentTypeColors: Record<string, string> = {
  ptu: '#7c3aed',
  paygo: '#0078d4',
  standard: '#6b7280',
};

const statusDotColor = (s: string) =>
  s === 'healthy' ? '#10b981' : s === 'degraded' ? '#f59e0b' : '#ef4444';

const reasonColors: Record<string, string> = {
  'health-check-failure': '#ef4444',
  'capacity-exceeded': '#f59e0b',
  'latency-threshold': '#f97316',
  manual: '#0078d4',
};

const eventStatusColors: Record<string, 'success' | 'warning' | 'danger'> = {
  recovered: 'success',
  active: 'warning',
  investigating: 'danger',
};

const usageBarColor = (pct: number) =>
  pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#10b981';

function formatTokens(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return `${(n / 1000).toFixed(0)}K`;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

const ProviderBadge: React.FC<{ provider: string }> = ({ provider }) => (
  <Badge
    appearance="outline"
    style={{
      borderColor: providerColors[provider] || '#666',
      color: providerColors[provider] || '#666',
    }}
  >
    {provider}
  </Badge>
);

/* ------------------------------------------------------------------ */
/*  Overview Tab                                                      */
/* ------------------------------------------------------------------ */

const OverviewTab: React.FC<{ model: Model }> = ({ model }) => {
  const styles = useStyles();
  const usagePct = Math.min((model.tokensUsedToday / model.tokenLimit) * 100, 100);

  return (
    <>
      {/* Stats row */}
      <div className={styles.statsRow}>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Total Requests Today</div>
          <div className={styles.statValue}>{model.requestsToday.toLocaleString()}</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Tokens Used / Limit</div>
          <div className={styles.statValue}>
            {formatTokens(model.tokensUsedToday)}{' '}
            <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
              / {formatTokens(model.tokenLimit)}
            </Text>
          </div>
          <div className={styles.usageBarWide}>
            <div
              className={styles.usageFill}
              style={{ width: `${usagePct}%`, backgroundColor: usageBarColor(usagePct) }}
            />
          </div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Avg Latency</div>
          <div className={styles.statValue}>—</div>
        </Card>
        <Card className={styles.statCard}>
          <div className={styles.statLabel}>Failover Targets</div>
          <div className={styles.statValue}>{model.failoverTargets.length}</div>
        </Card>
      </div>

      {/* Endpoint info */}
      <Card className={styles.infoCard}>
        <Text weight="semibold" style={{ marginBottom: '12px', display: 'block' }}>
          Endpoint Information
        </Text>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Endpoint</span>
          <Text size={200} style={{ wordBreak: 'break-all' }}>{model.endpoint}</Text>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Capabilities</span>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {model.capabilities.map((c) => (
              <Badge key={c} appearance="tint" size="small">
                {c}
              </Badge>
            ))}
          </div>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Created</span>
          <Text size={200}>{new Date(model.createdAt).toLocaleDateString()}</Text>
        </div>
      </Card>

      {/* Failover targets list */}
      {model.failoverTargets.length > 0 && (
        <>
          <Text weight="semibold" style={{ marginBottom: '8px', display: 'block' }}>
            Failover Targets
          </Text>
          <div className={styles.targetList}>
            {model.failoverTargets.map((targetId) => {
              const target = models.find((m) => m.id === targetId);
              return (
                <div key={targetId} className={styles.targetItem}>
                  <Checkmark24Regular style={{ color: '#10b981' }} />
                  <Text weight="semibold">{target?.name ?? targetId}</Text>
                  {target && (
                    <>
                      <ProviderBadge provider={target.provider} />
                      <StatusBadge status={target.status} />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Routing Tab                                                       */
/* ------------------------------------------------------------------ */

const RoutingTab: React.FC<{ model: Model }> = ({ model }) => {
  const styles = useStyles();
  const config: RoutingConfig | undefined = routingConfigs.find(
    (rc) => rc.modelId === model.id,
  );

  if (!config) {
    return (
      <div className={styles.emptyState}>
        <ArrowRouting24Regular style={{ fontSize: '32px', marginBottom: '8px' }} />
        <Text block>No routing configured for this model.</Text>
      </div>
    );
  }

  const chainLabels = ['Primary', 'Secondary', 'Tertiary', 'Quaternary'];

  return (
    <>
      {/* Strategy / settings row */}
      <div className={styles.routingHeader}>
        <Badge
          appearance="filled"
          color="brand"
          icon={<ArrowSync24Regular />}
        >
          {config.strategy}
        </Badge>
        <Badge
          appearance="filled"
          color={config.ptuSpillover ? 'success' : 'subtle'}
        >
          PTU Spillover: {config.ptuSpillover ? 'On' : 'Off'}
        </Badge>
        <Badge appearance="outline" icon={<HeartPulse24Regular />}>
          Health Check: {config.healthCheckIntervalSec}s / threshold {config.healthCheckThreshold}
        </Badge>
      </div>

      {/* Deployments grid */}
      <div className={styles.sectionTitle}>Deployments</div>
      <div className={styles.deploymentsGrid}>
        {config.deployments.map((d: ModelDeployment) => {
          const rpsPct = Math.min((d.currentRPS / d.maxRPS) * 100, 100);
          return (
            <Card key={d.id} className={styles.deployCard}>
              <div className={styles.deployHeader}>
                <div className={styles.deployRegion}>
                  <Globe24Regular />
                  <span>{d.region}</span>
                </div>
                <span
                  className={styles.statusDot}
                  style={{ backgroundColor: statusDotColor(d.status) }}
                  title={d.status}
                />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <Badge
                  appearance="filled"
                  style={{
                    backgroundColor: deploymentTypeColors[d.deploymentType],
                    color: '#fff',
                  }}
                >
                  {d.deploymentType.toUpperCase()}
                </Badge>
              </div>

              <div className={styles.deployStat}>
                <span>RPS</span>
                <span>
                  {d.currentRPS} / {d.maxRPS}
                </span>
              </div>
              <div className={styles.usageBarWide}>
                <div
                  className={styles.usageFill}
                  style={{ width: `${rpsPct}%`, backgroundColor: usageBarColor(rpsPct) }}
                />
              </div>

              <div className={styles.deployStat} style={{ marginTop: '8px' }}>
                <span>Avg Latency</span>
                <span>{d.avgLatencyMs}ms</span>
              </div>
              <div className={styles.deployStat}>
                <span>Requests (1h)</span>
                <span>{d.requestsLast1h.toLocaleString()}</span>
              </div>
              {d.deploymentType === 'ptu' && d.ptuCapacity != null && (
                <div className={styles.deployStat}>
                  <span>PTU Capacity</span>
                  <span>{d.ptuCapacity}</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Failover chain */}
      <div className={styles.sectionTitle}>Failover Chain</div>
      <div className={styles.failoverChain}>
        {config.failoverChain.map((deployId, idx) => {
          const dep = config.deployments.find((d) => d.id === deployId);
          return (
            <React.Fragment key={deployId}>
              {idx > 0 && <span className={styles.chainArrow}>→</span>}
              <div className={styles.chainBox}>
                <span className={styles.chainLabel}>
                  {chainLabels[idx] ?? `#${idx + 1}`}
                </span>
                <Text weight="semibold" size={200}>
                  {dep?.region ?? deployId}
                </Text>
                {dep && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge
                      appearance="filled"
                      size="small"
                      style={{
                        backgroundColor: deploymentTypeColors[dep.deploymentType],
                        color: '#fff',
                      }}
                    >
                      {dep.deploymentType.toUpperCase()}
                    </Badge>
                    <span
                      className={styles.statusDot}
                      style={{ backgroundColor: statusDotColor(dep.status) }}
                    />
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </>
  );
};

/* ------------------------------------------------------------------ */
/*  Failover Events Tab                                               */
/* ------------------------------------------------------------------ */

const FailoverEventsTab: React.FC<{ model: Model }> = ({ model }) => {
  const styles = useStyles();
  const events: FailoverEvent[] = failoverEvents.filter(
    (e) => e.modelName === model.name,
  );

  if (events.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Shield24Regular style={{ fontSize: '32px', marginBottom: '8px' }} />
        <Text block>No failover events recorded for this model.</Text>
      </div>
    );
  }

  return (
    <div>
      {events.map((evt) => (
        <Card key={evt.id} className={styles.eventCard}>
          <div className={styles.eventHeader}>
            <div className={styles.eventFlow}>
              <Warning24Regular style={{ color: reasonColors[evt.reason] }} />
              <Text weight="semibold">{evt.fromDeployment}</Text>
              <span>→</span>
              <Text weight="semibold">{evt.toDeployment}</Text>
            </div>
            <Badge
              appearance="filled"
              color={eventStatusColors[evt.status] ?? 'informative'}
            >
              {evt.status}
            </Badge>
          </div>
          <div className={styles.eventMeta}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock24Regular style={{ fontSize: '14px' }} />
              {new Date(evt.timestamp).toLocaleString()}
            </span>
            <Badge
              appearance="outline"
              style={{
                borderColor: reasonColors[evt.reason],
                color: reasonColors[evt.reason],
              }}
            >
              {evt.reason}
            </Badge>
            {evt.recoveryTimeSec > 0 && (
              <span>Recovery: {evt.recoveryTimeSec}s</span>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Detail View                                                       */
/* ------------------------------------------------------------------ */

const ModelDetail: React.FC<{ model: Model; onBack: () => void }> = ({
  model,
  onBack,
}) => {
  const styles = useStyles();
  const [tab, setTab] = useState<string>('overview');

  return (
    <div>
      <div className={styles.detailHeader}>
        <Button
          className={styles.backButton}
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          onClick={onBack}
        >
          Back to Models
        </Button>
        <Text className={styles.detailTitle}>{model.name}</Text>
        <ProviderBadge provider={model.provider} />
        <StatusBadge status={model.status} />
      </div>

      <TabList
        selectedValue={tab}
        onTabSelect={(_, d) => setTab(d.value as string)}
      >
        <Tab value="overview" icon={<DataUsage24Regular />}>
          Overview
        </Tab>
        <Tab value="routing" icon={<ArrowRouting24Regular />}>
          Routing &amp; Load Balancing
        </Tab>
        <Tab value="failover" icon={<Shield24Regular />}>
          Failover Events
        </Tab>
      </TabList>

      <div className={styles.tabContent}>
        {tab === 'overview' && <OverviewTab model={model} />}
        {tab === 'routing' && <RoutingTab model={model} />}
        {tab === 'failover' && <FailoverEventsTab model={model} />}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

const Models: React.FC = () => {
  const styles = useStyles();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const selectedModel = selectedModelId
    ? models.find((m) => m.id === selectedModelId) ?? null
    : null;

  if (selectedModel) {
    return (
      <ModelDetail
        model={selectedModel}
        onBack={() => setSelectedModelId(null)}
      />
    );
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {models.length} models registered across{' '}
          {new Set(models.map((m) => m.provider)).size} providers
        </Text>
        <Button appearance="primary" icon={<Add24Regular />}>
          Register Model
        </Button>
      </div>
      <Card className={styles.card}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Provider</TableHeaderCell>
              <TableHeaderCell>Capabilities</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Token Usage (24h)</TableHeaderCell>
              <TableHeaderCell>Requests</TableHeaderCell>
              <TableHeaderCell>Failover</TableHeaderCell>
              <TableHeaderCell>{/* Actions */}</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const usagePct = Math.min(
                (model.tokensUsedToday / model.tokenLimit) * 100,
                100,
              );
              const barColor = usageBarColor(usagePct);
              return (
                <TableRow key={model.id}>
                  <TableCell>
                    <Text weight="semibold">{model.name}</Text>
                  </TableCell>
                  <TableCell>
                    <ProviderBadge provider={model.provider} />
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {model.capabilities.map((c) => (
                        <Badge key={c} appearance="tint" size="small">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={model.status} />
                  </TableCell>
                  <TableCell>
                    <Text size={200}>
                      {(model.tokensUsedToday / 1000).toFixed(0)}K /{' '}
                      {(model.tokenLimit / 1000).toFixed(0)}K
                    </Text>
                    <div className={styles.usageBar}>
                      <div
                        className={styles.usageFill}
                        style={{
                          width: `${usagePct}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text>{model.requestsToday.toLocaleString()}</Text>
                  </TableCell>
                  <TableCell>
                    {model.failoverTargets.length > 0 ? (
                      <Badge appearance="tint" color="informative">
                        {model.failoverTargets.length} target
                        {model.failoverTargets.length > 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Text size={200} style={{ color: '#999' }}>
                        None
                      </Text>
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      className={styles.viewDetails}
                      onClick={() => setSelectedModelId(model.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ')
                          setSelectedModelId(model.id);
                      }}
                    >
                      View Details <ChevronRight24Regular style={{ fontSize: '14px' }} />
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Models;
