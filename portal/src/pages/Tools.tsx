import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Input,
  Dropdown,
  Option,
} from '@fluentui/react-components';
import { Add24Regular, Search24Regular, ArrowRight16Regular } from '@fluentui/react-icons';
import StatusBadge from '../components/StatusBadge';
import { tools } from '../data/mockData';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
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
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  cardIcon: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
  },
  description: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    marginBottom: '12px',
    lineHeight: '1.4',
    minHeight: '36px',
  },
  tags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: '12px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  footerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  footerStat: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
});

const toolIcons: Record<string, { emoji: string; bg: string }> = {
  'Customer CRM API': { emoji: '👥', bg: '#dbeafe' },
  'Billing Service': { emoji: '💳', bg: '#fce7f3' },
  'Slack Connector': { emoji: '💬', bg: '#e0e7ff' },
  'GitHub Issues API': { emoji: '🐙', bg: '#f3e8ff' },
  'Jira Service Desk': { emoji: '📋', bg: '#ecfccb' },
  'Internal Knowledge Base': { emoji: '📚', bg: '#fef3c7' },
  'Weather API': { emoji: '🌤️', bg: '#cffafe' },
  'Payment Gateway': { emoji: '🔒', bg: '#fee2e2' },
};

const Tools: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const [visFilter, setVisFilter] = useState('all');

  const filtered = tools.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    if (visFilter !== 'all' && t.visibility !== visFilter) return false;
    return true;
  });

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <Input
            placeholder="Search tools..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, data) => setSearch(data.value)}
            style={{ minWidth: '260px' }}
          />
          <Dropdown
            placeholder="All visibility"
            value={visFilter === 'all' ? 'All visibility' : visFilter}
            onOptionSelect={(_, data) => setVisFilter(data.optionValue || 'all')}
            style={{ minWidth: '150px' }}
          >
            <Option value="all">All visibility</Option>
            <Option value="public">Public</Option>
            <Option value="team">Team</Option>
            <Option value="private">Private</Option>
          </Dropdown>
          <Text size={200} style={{ color: '#999' }}>{filtered.length} tools</Text>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button appearance="secondary">Convert API → MCP</Button>
          <Button appearance="primary" icon={<Add24Regular />}>Register Tool</Button>
        </div>
      </div>

      <div className={styles.grid}>
        {filtered.map((tool) => {
          const icon = toolIcons[tool.name] || { emoji: '🔧', bg: '#f3f4f6' };
          return (
            <Card key={tool.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  <div className={styles.cardIcon} style={{ backgroundColor: icon.bg }}>
                    {icon.emoji}
                  </div>
                  <div>
                    <Text weight="semibold" size={400}>{tool.name}</Text>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                      <Badge appearance="outline" size="small">{tool.transport.toUpperCase()}</Badge>
                      <Badge
                        appearance="tint"
                        size="small"
                        color={tool.visibility === 'public' ? 'success' : tool.visibility === 'team' ? 'informative' : 'warning'}
                      >
                        {tool.visibility}
                      </Badge>
                    </div>
                  </div>
                </div>
                <StatusBadge status={tool.status} />
              </div>

              <div className={styles.description}>{tool.description}</div>

              <div className={styles.tags}>
                {tool.tags.map(t => (
                  <Badge key={t} appearance="tint" size="small">{t}</Badge>
                ))}
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.footerLeft}>
                  <div className={styles.footerStat}>
                    <Text size={200} style={{ color: '#999' }}>Owner</Text>
                    <Text size={200} weight="semibold">{tool.ownerTeam}</Text>
                  </div>
                  <div className={styles.footerStat}>
                    <Text size={200} style={{ color: '#999' }}>Invocations</Text>
                    <Text size={200} weight="semibold">{tool.invocationsToday.toLocaleString()}</Text>
                  </div>
                </div>
                <ArrowRight16Regular style={{ color: '#999' }} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Tools;
