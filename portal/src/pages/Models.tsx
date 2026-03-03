import React from 'react';
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
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { models } from '../data/mockData';

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
  providerBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
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
  usageFill: {
    height: '100%',
    borderRadius: '3px',
  },
});

const providerColors: Record<string, string> = {
  'Azure OpenAI': '#0078d4',
  'Anthropic': '#d97706',
  'Google Vertex AI': '#4285f4',
  'AWS Bedrock': '#ff9900',
  'Custom': '#6b7280',
};

const Models: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {models.length} models registered across {new Set(models.map(m => m.provider)).size} providers
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.map((model) => {
              const usagePct = Math.min((model.tokensUsedToday / model.tokenLimit) * 100, 100);
              const barColor = usagePct > 80 ? '#ef4444' : usagePct > 60 ? '#f59e0b' : '#10b981';
              return (
                <TableRow key={model.id}>
                  <TableCell>
                    <Text weight="semibold">{model.name}</Text>
                  </TableCell>
                  <TableCell>
                    <Badge
                      appearance="outline"
                      style={{ borderColor: providerColors[model.provider] || '#666', color: providerColors[model.provider] || '#666' }}
                    >
                      {model.provider}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {model.capabilities.map(c => (
                        <Badge key={c} appearance="tint" size="small">{c}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={model.status} />
                  </TableCell>
                  <TableCell>
                    <Text size={200}>
                      {(model.tokensUsedToday / 1000).toFixed(0)}K / {(model.tokenLimit / 1000).toFixed(0)}K
                    </Text>
                    <div className={styles.usageBar}>
                      <div className={styles.usageFill} style={{ width: `${usagePct}%`, backgroundColor: barColor }} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Text>{model.requestsToday.toLocaleString()}</Text>
                  </TableCell>
                  <TableCell>
                    {model.failoverTargets.length > 0 ? (
                      <Badge appearance="tint" color="informative">
                        {model.failoverTargets.length} target{model.failoverTargets.length > 1 ? 's' : ''}
                      </Badge>
                    ) : (
                      <Text size={200} style={{ color: '#999' }}>None</Text>
                    )}
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
