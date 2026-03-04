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
  Table,
  TableHeader,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@fluentui/react-components';
import { ArrowClockwise24Regular, Search24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { recentLogs } from '../data/mockData';
import type { LogEntry } from '../data/mockData';

const useStyles = makeStyles({
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
  card: {
    padding: '0',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: '6px',
  },
  liveIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  liveDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    animation: 'pulse 2s infinite',
  },
  pathCell: {
    fontFamily: 'monospace',
    fontSize: '12px',
    color: tokens.colorNeutralForeground3,
  },
  latencyGood: {
    color: '#10b981',
    fontWeight: 600,
  },
  latencyWarn: {
    color: '#f59e0b',
    fontWeight: 600,
  },
  latencyBad: {
    color: '#ef4444',
    fontWeight: 600,
  },
  clickableRow: {
    cursor: 'pointer',
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground3,
    },
  },
  detailPanel: {
    padding: '20px',
    marginTop: '16px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  detailGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    marginTop: '12px',
  },
  detailField: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  detailLabel: {
    fontSize: '11px',
    color: tokens.colorNeutralForeground3,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  detailValue: {
    fontSize: '14px',
    fontWeight: 600,
  },
  statusStats: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
});

const getStatusColor = (code: number): string => {
  if (code >= 200 && code < 300) return '#10b981';
  if (code >= 400 && code < 500) return '#f59e0b';
  return '#ef4444';
};

const getLatencyClass = (ms: number, styles: ReturnType<typeof useStyles>): string => {
  if (ms < 500) return styles.latencyGood;
  if (ms < 2000) return styles.latencyWarn;
  return styles.latencyBad;
};

const formatTime = (ts: string): string => {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

const assetTypeColors: Record<string, 'brand' | 'success' | 'informative' | 'warning' | 'danger'> = {
  model: 'brand',
  tool: 'informative',
  'mcp-server': 'success',
  agent: 'warning',
};

const Logs: React.FC = () => {
  const styles = useStyles();
  const [filter, setFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = recentLogs.filter((log) => {
    if (filter !== 'all' && log.assetType !== filter) return false;
    if (statusFilter === 'success' && (log.statusCode < 200 || log.statusCode >= 300)) return false;
    if (statusFilter === 'error' && log.statusCode < 400) return false;
    if (statusFilter === '4xx' && (log.statusCode < 400 || log.statusCode >= 500)) return false;
    if (statusFilter === '5xx' && log.statusCode < 500) return false;
    if (search && !log.assetName.toLowerCase().includes(search.toLowerCase()) &&
        !log.path.toLowerCase().includes(search.toLowerCase()) &&
        !log.userId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const successCount = recentLogs.filter(l => l.statusCode >= 200 && l.statusCode < 300).length;
  const errorCount = recentLogs.filter(l => l.statusCode >= 400).length;

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.liveIndicator}>
          <div className={styles.liveDot} />
          <Text size={200} weight="semibold" style={{ color: '#10b981' }}>Live</Text>
        </div>
        <div className={styles.filters}>
          <Input
            placeholder="Search logs..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ minWidth: '240px' }}
          />
          <Dropdown
            placeholder="All types"
            value={filter === 'all' ? 'All types' : filter}
            onOptionSelect={(_, data) => setFilter(data.optionValue || 'all')}
            style={{ minWidth: '140px' }}
          >
            <Option value="all" text="All types">All types</Option>
            <Option value="model" text="Models">Models</Option>
            <Option value="tool" text="Tools">Tools</Option>
            <Option value="mcp-server" text="MCP Servers">MCP Servers</Option>
            <Option value="agent" text="Agents">Agents</Option>
          </Dropdown>
          <Dropdown
            placeholder="All statuses"
            value={statusFilter === 'all' ? 'All statuses' : statusFilter === 'success' ? '2xx Success' : statusFilter === '4xx' ? '4xx Client Error' : statusFilter === '5xx' ? '5xx Server Error' : 'All errors'}
            onOptionSelect={(_, data) => setStatusFilter(data.optionValue || 'all')}
            style={{ minWidth: '150px' }}
          >
            <Option value="all" text="All statuses">All statuses</Option>
            <Option value="success" text="2xx Success">2xx Success</Option>
            <Option value="error" text="All errors">All errors</Option>
            <Option value="4xx" text="4xx Client Error">4xx Client Error</Option>
            <Option value="5xx" text="5xx Server Error">5xx Server Error</Option>
          </Dropdown>
        </div>
        <div className={styles.statusStats}>
          <Badge appearance="filled" size="small" style={{ backgroundColor: '#1a3a2a', color: '#4ade80' }}>
            {successCount} ok
          </Badge>
          <Badge appearance="filled" size="small" style={{ backgroundColor: '#3d1a1a', color: '#f87171' }}>
            {errorCount} error{errorCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        <Button appearance="subtle" icon={<ArrowClockwise24Regular />}>Refresh</Button>
        <Text size={200} style={{ color: '#999' }}>
          {filteredLogs.length} requests
        </Text>
      </div>

      <Card className={styles.card}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell style={{ width: '80px' }}>Time</TableHeaderCell>
              <TableHeaderCell style={{ width: '60px' }}>Status</TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>Method</TableHeaderCell>
              <TableHeaderCell>Path</TableHeaderCell>
              <TableHeaderCell>Asset</TableHeaderCell>
              <TableHeaderCell style={{ width: '80px' }}>Latency</TableHeaderCell>
              <TableHeaderCell style={{ width: '100px' }}>Tokens</TableHeaderCell>
              <TableHeaderCell>User</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow
                key={log.id}
                className={styles.clickableRow}
                onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                style={selectedLog?.id === log.id ? { backgroundColor: tokens.colorNeutralBackground3 } : undefined}
              >
                <TableCell>
                  <Text size={200} style={{ fontFamily: 'monospace' }}>{formatTime(log.timestamp)}</Text>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className={styles.statusDot} style={{ backgroundColor: getStatusColor(log.statusCode) }} />
                    <Text size={200} weight="semibold">{log.statusCode}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge appearance="outline" size="small">{log.method}</Badge>
                </TableCell>
                <TableCell>
                  <span className={styles.pathCell}>{log.path}</span>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Badge appearance="tint" color={assetTypeColors[log.assetType] || 'informative'} size="small">
                      {log.assetType}
                    </Badge>
                    <Text size={200}>{log.assetName}</Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Text size={200} className={getLatencyClass(log.latencyMs, styles)}>
                    {log.latencyMs}ms
                  </Text>
                </TableCell>
                <TableCell>
                  {log.tokensIn !== undefined ? (
                    <Text size={200}>{log.tokensIn} → {log.tokensOut}</Text>
                  ) : (
                    <Text size={200} style={{ color: '#999' }}>—</Text>
                  )}
                </TableCell>
                <TableCell>
                  <Text size={200} style={{ fontFamily: 'monospace', fontSize: '11px' }}>{log.userId}</Text>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* ─── Log Detail Panel ─── */}
      {selectedLog && (
        <Card className={styles.detailPanel}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text weight="semibold" size={400}>Request Detail</Text>
              <Badge appearance="tint" color={assetTypeColors[selectedLog.assetType] || 'informative'} size="small">
                {selectedLog.assetType}
              </Badge>
              <Text size={300}>{selectedLog.assetName}</Text>
            </div>
            <Button appearance="subtle" icon={<Dismiss24Regular />} size="small" onClick={() => setSelectedLog(null)} />
          </div>
          <div className={styles.detailGrid}>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Timestamp</span>
              <span className={styles.detailValue}>{new Date(selectedLog.timestamp).toLocaleString()}</span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Status</span>
              <span className={styles.detailValue} style={{ color: getStatusColor(selectedLog.statusCode) }}>
                {selectedLog.statusCode} {selectedLog.statusCode === 200 ? 'OK' : selectedLog.statusCode === 429 ? 'Too Many Requests' : selectedLog.statusCode === 500 ? 'Internal Server Error' : ''}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Method & Path</span>
              <span className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {selectedLog.method} {selectedLog.path}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Latency</span>
              <span className={styles.detailValue} style={{ color: selectedLog.latencyMs < 500 ? '#10b981' : selectedLog.latencyMs < 2000 ? '#f59e0b' : '#ef4444' }}>
                {selectedLog.latencyMs}ms
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Tokens (In → Out)</span>
              <span className={styles.detailValue}>
                {selectedLog.tokensIn !== undefined ? `${selectedLog.tokensIn} → ${selectedLog.tokensOut}` : 'N/A'}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>User / Identity</span>
              <span className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {selectedLog.userId}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>IP Address</span>
              <span className={styles.detailValue} style={{ fontFamily: 'monospace' }}>
                {selectedLog.ipAddress}
              </span>
            </div>
            <div className={styles.detailField}>
              <span className={styles.detailLabel}>Request ID</span>
              <span className={styles.detailValue} style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                {selectedLog.id}
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Logs;
