import React from 'react';
import {
  Card,
  Text,
  makeStyles,
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
import { tools } from '../data/mockData';

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
});

const Tools: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {tools.length} tools registered · {tools.filter(t => t.status === 'active').length} active
        </Text>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button appearance="secondary">Convert API → MCP</Button>
          <Button appearance="primary" icon={<Add24Regular />}>Register Tool</Button>
        </div>
      </div>
      <Card className={styles.card}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Transport</TableHeaderCell>
              <TableHeaderCell>Owner</TableHeaderCell>
              <TableHeaderCell>Visibility</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Invocations (24h)</TableHeaderCell>
              <TableHeaderCell>Tags</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                <TableCell>
                  <Text weight="semibold">{tool.name}</Text>
                </TableCell>
                <TableCell>
                  <Text size={200} style={{ color: '#666' }}>{tool.description}</Text>
                </TableCell>
                <TableCell>
                  <Badge appearance="outline">{tool.transport.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <Text size={200}>{tool.ownerTeam}</Text>
                </TableCell>
                <TableCell>
                  <Badge
                    appearance="tint"
                    color={tool.visibility === 'public' ? 'success' : tool.visibility === 'team' ? 'informative' : 'warning'}
                  >
                    {tool.visibility}
                  </Badge>
                </TableCell>
                <TableCell>
                  <StatusBadge status={tool.status} />
                </TableCell>
                <TableCell>
                  <Text>{tool.invocationsToday.toLocaleString()}</Text>
                </TableCell>
                <TableCell>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {tool.tags.slice(0, 3).map(t => (
                      <Badge key={t} appearance="tint" size="small">{t}</Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Tools;
