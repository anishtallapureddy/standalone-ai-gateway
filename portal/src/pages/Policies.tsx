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
  Switch,
} from '@fluentui/react-components';
import { Add24Regular } from '@fluentui/react-icons';
import { policies } from '../data/mockData';

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

const targetColors: Record<string, 'brand' | 'success' | 'informative' | 'warning' | 'danger'> = {
  models: 'brand',
  tools: 'informative',
  agents: 'success',
  global: 'warning',
  'mcp-servers': 'danger',
};

const Policies: React.FC = () => {
  const styles = useStyles();

  return (
    <div>
      <div className={styles.toolbar}>
        <Text size={300} style={{ color: '#666' }}>
          {policies.length} policies · {policies.filter(p => p.enabled).length} enabled · {policies.filter(p => p.phase === 'runtime').length} runtime · {policies.filter(p => p.phase === 'design-time').length} design-time
        </Text>
        <Button appearance="primary" icon={<Add24Regular />}>Create Policy</Button>
      </div>
      <Card className={styles.card}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Policy</TableHeaderCell>
              <TableHeaderCell>Target</TableHeaderCell>
              <TableHeaderCell>Phase</TableHeaderCell>
              <TableHeaderCell>Rules</TableHeaderCell>
              <TableHeaderCell>Applied To</TableHeaderCell>
              <TableHeaderCell>Enabled</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {policies.map((policy) => (
              <TableRow key={policy.id}>
                <TableCell>
                  <Text weight="semibold">{policy.name}</Text>
                  <br />
                  <Text size={200} style={{ color: '#666' }}>{policy.description}</Text>
                </TableCell>
                <TableCell>
                  <Badge appearance="tint" color={targetColors[policy.target] || 'informative'}>
                    {policy.target}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge appearance="outline">
                    {policy.phase}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Text>{policy.ruleCount} rule{policy.ruleCount !== 1 ? 's' : ''}</Text>
                </TableCell>
                <TableCell>
                  <Text>{policy.appliedTo} asset{policy.appliedTo !== 1 ? 's' : ''}</Text>
                </TableCell>
                <TableCell>
                  <Switch checked={policy.enabled} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Policies;
