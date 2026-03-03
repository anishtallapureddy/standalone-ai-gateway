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
import { ArrowClockwise24Regular, Search24Regular } from '@fluentui/react-icons';
import { recentLogs } from '../data/mockData';

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
  const [search, setSearch] = useState<string>('');

  const filteredLogs = recentLogs.filter((log) => {
    if (filter !== 'all' && log.assetType !== filter) return false;
    if (search && !log.assetName.toLowerCase().includes(search.toLowerCase()) &&
        !log.path.toLowerCase().includes(search.toLowerCase()) &&
        !log.userId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
            <Option value="all">All types</Option>
            <Option value="model">Models</Option>
            <Option value="tool">Tools</Option>
            <Option value="mcp-server">MCP Servers</Option>
            <Option value="agent">Agents</Option>
          </Dropdown>
        </div>
        <Button appearance="subtle" icon={<ArrowClockwise24Regular />}>Refresh</Button>
        <Text size={200} style={{ color: '#666' }}>
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
              <TableRow key={log.id}>
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
    </div>
  );
};

export default Logs;
