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
  ToggleButton,
} from '@fluentui/react-components';
import {
  DataUsage24Regular,
  Money24Regular,
  ArrowTrending24Regular,
  People24Regular,
  Clock24Regular,
  ArrowDown24Regular,
  ArrowUp24Regular,
} from '@fluentui/react-icons';
import StatCard from '../components/StatCard';
import {
  tokenUsageByModel,
  enterpriseTimeSeries24h,
  consumers,
} from '../data/mockData';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

function formatCost(n: number): string {
  return `$${n.toFixed(2)}`;
}

function formatLatency(ms: number): string {
  return `${Math.round(ms)}ms`;
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  toggleGroup: {
    display: 'flex',
    gap: '4px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  section: {
    marginBottom: '28px',
  },
  sectionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '14px',
  },
  chartCard: {
    padding: '20px',
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '4px',
    height: '180px',
    paddingTop: '8px',
  },
  barGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  barStack: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'flex-end',
    width: '100%',
    height: '160px',
  },
  barIn: {
    backgroundColor: '#4f6bed',
    borderRadius: '2px 2px 0 0',
    minHeight: '1px',
  },
  barOut: {
    backgroundColor: '#47c28e',
    borderRadius: '0 0 2px 2px',
    minHeight: '0px',
  },
  barLabel: {
    fontSize: '10px',
    color: tokens.colorNeutralForeground3,
    marginTop: '4px',
    whiteSpace: 'nowrap' as const,
  },
  chartLegend: {
    display: 'flex',
    gap: '16px',
    marginTop: '12px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  legendDot: {
    width: '10px',
    height: '10px',
    borderRadius: '2px',
  },
  modelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px',
  },
  modelCard: {
    padding: '20px',
  },
  modelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  },
  modelName: {
    fontWeight: 600,
    fontSize: '15px',
  },
  modelMeta: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px 16px',
    marginTop: '12px',
  },
  metaItem: {
    display: 'flex',
    flexDirection: 'column' as const,
  },
  metaLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  metaValue: {
    fontSize: '14px',
    fontWeight: 600,
  },
  progressTrack: {
    height: '6px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '4px',
  },
  progressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  tokenBar: {
    display: 'flex',
    height: '8px',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px',
  },
  tokenBarIn: {
    backgroundColor: '#4f6bed',
  },
  tokenBarOut: {
    backgroundColor: '#47c28e',
  },
  tokenBarLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '4px',
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
  },
  tableCard: {
    padding: '0',
    overflow: 'auto',
  },
  tableHeader: {
    padding: '16px 20px 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeBadge: {
    fontSize: '11px',
    textTransform: 'capitalize' as const,
  },
  quotaBar: {
    width: '60px',
    height: '6px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '3px',
    overflow: 'hidden',
    display: 'inline-block',
    marginLeft: '8px',
    verticalAlign: 'middle',
  },
  nsBarContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  nsLabel: {
    width: '130px',
    fontSize: '13px',
    fontWeight: 600,
    textAlign: 'right' as const,
    flexShrink: 0,
  },
  nsBarTrack: {
    flex: 1,
    height: '20px',
    backgroundColor: tokens.colorNeutralStroke2,
    borderRadius: '4px',
    overflow: 'hidden',
    position: 'relative' as const,
  },
  nsBarFill: {
    height: '100%',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '8px',
    fontSize: '11px',
    fontWeight: 600,
    color: '#fff',
    whiteSpace: 'nowrap' as const,
  },
  nsValue: {
    width: '90px',
    fontSize: '13px',
    color: tokens.colorNeutralForeground3,
    flexShrink: 0,
  },
  sortIcon: {
    display: 'inline-flex',
    verticalAlign: 'middle',
    marginLeft: '2px',
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Analytics: React.FC = () => {
  const styles = useStyles();
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Aggregated stats
  const totalTokens = tokenUsageByModel.reduce((s, m) => s + m.totalTokens, 0);
  const totalCost = tokenUsageByModel.reduce((s, m) => s + m.cost, 0);
  const totalRequests = tokenUsageByModel.reduce((s, m) => s + m.requests, 0);
  const weightedLatency =
    tokenUsageByModel.reduce((s, m) => s + m.avgLatencyMs * m.requests, 0) / totalRequests;

  // Chart helpers
  const maxHourlyTokens = Math.max(
    ...enterpriseTimeSeries24h.map((p) => p.tokensIn + p.tokensOut),
  );

  // Sorted models
  const sortedModels = [...tokenUsageByModel].sort((a, b) => b.totalTokens - a.totalTokens);

  // Sorted consumers
  const sortedConsumers = [...consumers].sort(
    (a, b) => b.usage24h.totalTokens - a.usage24h.totalTokens,
  );

  // Namespace aggregation
  const nsByTokens = consumers.reduce<Record<string, number>>((acc, c) => {
    acc[c.namespace] = (acc[c.namespace] || 0) + c.usage24h.totalTokens;
    return acc;
  }, {});
  const nsEntries = Object.entries(nsByTokens).sort((a, b) => b[1] - a[1]);
  const maxNsTokens = nsEntries.length > 0 ? nsEntries[0][1] : 1;

  // Quota color helper
  function quotaColor(pct: number): string {
    if (pct >= 80) return '#d13438';
    if (pct >= 60) return '#ca8a04';
    return '#47c28e';
  }

  // Type badge color
  function typeBadgeColor(type: string): 'informative' | 'warning' | 'important' {
    if (type === 'user') return 'informative';
    if (type === 'application') return 'warning';
    return 'important';
  }

  // Provider colors
  function providerColor(provider: string): string {
    if (provider.includes('OpenAI')) return '#4f6bed';
    if (provider.includes('Anthropic')) return '#d4875e';
    if (provider.includes('Google')) return '#34a853';
    if (provider.includes('AWS')) return '#ff9900';
    return '#888';
  }

  // Namespace bar colors
  const nsColors = ['#4f6bed', '#47c28e', '#d4875e', '#34a853', '#ff9900', '#9b59b6', '#e74c3c'];

  return (
    <div>
      {/* ---------------------------------------------------------------- */}
      {/* Header                                                           */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <DataUsage24Regular />
          <Text size={600} weight="semibold">
            Token Analytics
          </Text>
        </div>
        <div className={styles.toggleGroup}>
          {(['24h', '7d', '30d'] as const).map((r) => (
            <ToggleButton
              key={r}
              size="small"
              checked={timeRange === r}
              onClick={() => setTimeRange(r)}
            >
              {r === '24h' ? '24 Hours' : r === '7d' ? '7 Days' : '30 Days'}
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Top Stats                                                        */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.statsGrid}>
        <StatCard
          value={formatNumber(totalTokens)}
          label="Total Tokens"
          icon={<DataUsage24Regular />}
          color="#4f6bed"
        />
        <StatCard
          value={formatCost(totalCost)}
          label="Total Cost"
          icon={<Money24Regular />}
          color="#47c28e"
        />
        <StatCard
          value={formatNumber(totalRequests)}
          label="Total Requests"
          icon={<ArrowTrending24Regular />}
          color="#d4875e"
        />
        <StatCard
          value={formatLatency(weightedLatency)}
          label="Avg Latency (weighted)"
          icon={<Clock24Regular />}
          color="#9b59b6"
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Usage Trend Chart                                                */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.section}>
        <Card className={styles.chartCard}>
          <div className={styles.sectionTitle}>
            <ArrowTrending24Regular />
            <Text size={500} weight="semibold">
              Token Usage — Last 24 Hours
            </Text>
          </div>

          <div className={styles.chartContainer}>
            {enterpriseTimeSeries24h.map((point, idx) => {
              const total = point.tokensIn + point.tokensOut;
              const heightPct = maxHourlyTokens > 0 ? (total / maxHourlyTokens) * 100 : 0;
              const inPct = total > 0 ? (point.tokensIn / total) * heightPct : 0;
              const outPct = heightPct - inPct;
              const hour = new Date(point.timestamp).getUTCHours();
              const showLabel = hour % 4 === 0;

              return (
                <div className={styles.barGroup} key={idx} title={`${hour}:00 — ${formatNumber(total)} tokens`}>
                  <div className={styles.barStack}>
                    <div className={styles.barIn} style={{ height: `${inPct}%` }} />
                    <div className={styles.barOut} style={{ height: `${outPct}%` }} />
                  </div>
                  {showLabel && (
                    <span className={styles.barLabel}>{`${hour}:00`}</span>
                  )}
                </div>
              );
            })}
          </div>

          <div className={styles.chartLegend}>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: '#4f6bed' }} />
              Tokens In
            </span>
            <span className={styles.legendItem}>
              <span className={styles.legendDot} style={{ backgroundColor: '#47c28e' }} />
              Tokens Out
            </span>
          </div>
        </Card>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Usage by Model                                                   */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <DataUsage24Regular />
          <Text size={500} weight="semibold">
            Usage by Model
          </Text>
        </div>

        <div className={styles.modelGrid}>
          {sortedModels.map((m) => {
            const pct = totalTokens > 0 ? (m.totalTokens / totalTokens) * 100 : 0;
            const inRatio = m.totalTokens > 0 ? (m.tokensIn / m.totalTokens) * 100 : 0;

            return (
              <Card key={m.modelId} className={styles.modelCard}>
                <div className={styles.modelHeader}>
                  <Text className={styles.modelName}>{m.modelName}</Text>
                  <Badge
                    size="small"
                    appearance="tint"
                    style={{ backgroundColor: `${providerColor(m.provider)}20`, color: providerColor(m.provider) }}
                  >
                    {m.provider}
                  </Badge>
                </div>

                {/* Percentage bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text style={{ fontSize: '12px', color: tokens.colorNeutralForeground3, width: '42px' }}>
                    {pct.toFixed(1)}%
                  </Text>
                  <div className={styles.progressTrack} style={{ flex: 1 }}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${pct}%`, backgroundColor: providerColor(m.provider) }}
                    />
                  </div>
                </div>

                {/* Token in/out bar */}
                <div className={styles.tokenBar}>
                  <div className={styles.tokenBarIn} style={{ width: `${inRatio}%` }} />
                  <div className={styles.tokenBarOut} style={{ width: `${100 - inRatio}%` }} />
                </div>
                <div className={styles.tokenBarLabels}>
                  <span>In: {formatNumber(m.tokensIn)}</span>
                  <span>Out: {formatNumber(m.tokensOut)}</span>
                </div>

                {/* Metrics */}
                <div className={styles.modelMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Total Tokens</span>
                    <span className={styles.metaValue}>{formatNumber(m.totalTokens)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Requests</span>
                    <span className={styles.metaValue}>{formatNumber(m.requests)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Cost</span>
                    <span className={styles.metaValue}>{formatCost(m.cost)}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Avg Latency</span>
                    <span className={styles.metaValue}>{formatLatency(m.avgLatencyMs)}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Top Consumers                                                    */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <People24Regular />
          <Text size={500} weight="semibold">
            Top Consumers
          </Text>
          <span className={styles.sortIcon}>
            <ArrowDown24Regular style={{ fontSize: '16px', color: tokens.colorNeutralForeground3 }} />
          </span>
        </div>

        <Card className={styles.tableCard}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>Consumer</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Team</TableHeaderCell>
                <TableHeaderCell>Tokens Used</TableHeaderCell>
                <TableHeaderCell>Cost</TableHeaderCell>
                <TableHeaderCell>Requests</TableHeaderCell>
                <TableHeaderCell>Models Used</TableHeaderCell>
                <TableHeaderCell>Quota %</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedConsumers.map((c) => {
                const quotaPct =
                  c.quotas.tokensPerDay > 0
                    ? (c.usage24h.totalTokens / c.quotas.tokensPerDay) * 100
                    : 0;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Text weight="semibold">{c.displayName}</Text>
                      <br />
                      <Text style={{ fontSize: '11px', color: tokens.colorNeutralForeground3 }}>
                        {c.name}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge
                        size="small"
                        appearance="tint"
                        color={typeBadgeColor(c.type)}
                        className={styles.typeBadge}
                      >
                        {c.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.team}</TableCell>
                    <TableCell>
                      <Text weight="semibold">{formatNumber(c.usage24h.totalTokens)}</Text>
                    </TableCell>
                    <TableCell>{formatCost(c.usage24h.totalCost)}</TableCell>
                    <TableCell>{formatNumber(c.usage24h.totalRequests)}</TableCell>
                    <TableCell>
                      {c.usage24h.modelsUsed.map((model) => (
                        <Badge
                          key={model}
                          size="small"
                          appearance="outline"
                          style={{ marginRight: '4px', marginBottom: '2px' }}
                        >
                          {model}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Text style={{ color: quotaColor(quotaPct), fontWeight: 600 }}>
                        {quotaPct.toFixed(1)}%
                      </Text>
                      <div className={styles.quotaBar}>
                        <div
                          style={{
                            height: '100%',
                            width: `${Math.min(quotaPct, 100)}%`,
                            backgroundColor: quotaColor(quotaPct),
                            borderRadius: '3px',
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Namespace Breakdown                                              */}
      {/* ---------------------------------------------------------------- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <ArrowUp24Regular />
          <Text size={500} weight="semibold">
            Namespace Breakdown
          </Text>
        </div>

        <Card style={{ padding: '20px' }}>
          {nsEntries.map(([ns, tkns], idx) => {
            const widthPct = maxNsTokens > 0 ? (tkns / maxNsTokens) * 100 : 0;

            return (
              <div className={styles.nsBarContainer} key={ns}>
                <span className={styles.nsLabel}>{ns}</span>
                <div className={styles.nsBarTrack}>
                  <div
                    className={styles.nsBarFill}
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: nsColors[idx % nsColors.length],
                    }}
                  >
                    {widthPct > 18 ? formatNumber(tkns) : ''}
                  </div>
                </div>
                <span className={styles.nsValue}>{formatNumber(tkns)} tokens</span>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
