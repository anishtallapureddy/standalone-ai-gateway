import React, { useState, useMemo } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
  Input,
  CounterBadge,
} from '@fluentui/react-components';
import { Add24Regular, Search24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { skills, models, tools } from '../data/mockData';
import type { Skill } from '../data/mockData';

// ── colour maps ──────────────────────────────────────────────────────────────

const typeColors: Record<string, string> = {
  'prompt-chain': '#a78bfa',
  automation: '#34d399',
  analysis: '#fb923c',
};

const typeLabels: Record<string, string> = {
  'prompt-chain': 'Prompt Chain',
  automation: 'Automation',
  analysis: 'Analysis',
};

const statusColors: Record<Skill['status'], string> = {
  active: '#34d399',
  draft: '#fbbf24',
  deprecated: '#9ca3af',
};

const stepIcons: Record<string, string> = {
  model: '🧠',
  tool: '🔧',
  logic: '⚙️',
};

// ── styles ───────────────────────────────────────────────────────────────────

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  pill: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    cursor: 'pointer',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: 'transparent',
    color: tokens.colorNeutralForeground3,
    transition: 'all 0.15s',
    ':hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
  },
  pillActive: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    cursor: 'pointer',
    border: '1px solid rgba(96,165,250,0.5)',
    backgroundColor: 'rgba(96,165,250,0.12)',
    color: '#60a5fa',
    transition: 'all 0.15s',
  },
  separator: {
    width: '1px',
    height: '24px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginLeft: '4px',
    marginRight: '4px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  card: {
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
    ':hover': { boxShadow: tokens.shadow4 },
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '6px',
  },
  description: {
    color: '#999',
    fontSize: '13px',
    lineHeight: '1.4',
    marginBottom: '12px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  stepsFlow: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  stepBox: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '3px 8px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '11px',
    whiteSpace: 'nowrap',
  },
  stepArrow: {
    color: '#666',
    fontSize: '12px',
    flexShrink: 0,
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

  // ── detail panel ──
  overlay: {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  panel: {
    width: '520px',
    maxWidth: '100%',
    height: '100%',
    backgroundColor: '#1e1e1e',
    borderLeft: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowY: 'auto',
    padding: '28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  panelHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  timelineStep: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
  },
  timelineIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    flexShrink: 0,
  },
  connectorLine: {
    width: '2px',
    height: '10px',
    backgroundColor: tokens.colorNeutralStroke2,
    marginLeft: '13px',
  },
  assetChip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '13px',
  },
  configBlock: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '8px',
    padding: '14px',
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#ccc',
    whiteSpace: 'pre-wrap',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    overflowX: 'auto',
  },
  panelFooter: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

// ── helpers ──────────────────────────────────────────────────────────────────

const modelMap = new Map(models.map((m) => [m.id, m.name]));
const toolMap = new Map(tools.map((t) => [t.id, t.name]));

const typeFilters: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Prompt Chain', value: 'prompt-chain' },
  { label: 'Automation', value: 'automation' },
  { label: 'Analysis', value: 'analysis' },
];

const statusFilters: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Draft', value: 'draft' },
  { label: 'Deprecated', value: 'deprecated' },
];

// ── component ────────────────────────────────────────────────────────────────

const Skills: React.FC = () => {
  const styles = useStyles();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Skill | null>(null);

  const activeFilterCount =
    (typeFilter !== 'all' ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);

  const filtered = useMemo(
    () =>
      skills.filter((s) => {
        if (s.type === 'workflow') return false;
        if (
          search &&
          !s.name.toLowerCase().includes(search.toLowerCase()) &&
          !s.description.toLowerCase().includes(search.toLowerCase())
        )
          return false;
        if (typeFilter !== 'all' && s.type !== typeFilter) return false;
        if (statusFilter !== 'all' && s.status !== statusFilter) return false;
        return true;
      }),
    [search, typeFilter, statusFilter],
  );

  // ── build config JSON for detail panel ──
  const buildConfig = (s: Skill) =>
    JSON.stringify(
      {
        type: s.type,
        visibility: s.visibility,
        models: s.modelIds.map((id) => modelMap.get(id) ?? id),
        tools: s.toolIds.map((id) => toolMap.get(id) ?? id),
        steps: s.steps.map((st) => `${st.order}. [${st.type}] ${st.label}`),
      },
      null,
      2,
    );

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerRight}>
          <Input
            placeholder="Search skills..."
            contentBefore={<Search24Regular />}
            value={search}
            onChange={(_, d) => setSearch(d.value)}
            style={{ minWidth: '220px' }}
          />
          <Button appearance="primary" icon={<Add24Regular />}>
            Create Skill
          </Button>
        </div>
      </div>

      {/* ── Filter bar ─────────────────────────────────────────── */}
      <div className={styles.filterBar}>
        {typeFilters.map((f) => (
          <button
            key={f.value}
            className={typeFilter === f.value ? styles.pillActive : styles.pill}
            onClick={() => setTypeFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <div className={styles.separator} />
        {statusFilters.map((f) => (
          <button
            key={f.value}
            className={statusFilter === f.value ? styles.pillActive : styles.pill}
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        {activeFilterCount > 0 && (
          <CounterBadge count={activeFilterCount} size="small" color="informative" />
        )}
        <Text size={200} style={{ color: '#999', marginLeft: '8px' }}>
          {filtered.length} skill{filtered.length !== 1 ? 's' : ''}
        </Text>
      </div>

      {/* ── Card grid ──────────────────────────────────────────── */}
      <div className={styles.grid}>
        {filtered.map((skill) => (
          <Card
            key={skill.id}
            className={styles.card}
            onClick={() => setSelected(skill)}
          >
            <div className={styles.cardHeader}>
              <Text weight="semibold" size={400}>
                {skill.name}
              </Text>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Badge
                  appearance="filled"
                  size="small"
                  style={{ backgroundColor: typeColors[skill.type], color: '#000' }}
                >
                  {typeLabels[skill.type]}
                </Badge>
                <Badge
                  appearance="filled"
                  size="small"
                  style={{ backgroundColor: statusColors[skill.status], color: '#000' }}
                >
                  {skill.status}
                </Badge>
              </div>
            </div>

            <div className={styles.description}>{skill.description}</div>

            {/* Steps flow */}
            <div className={styles.stepsFlow}>
              {skill.steps
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <React.Fragment key={step.order}>
                    {i > 0 && <span className={styles.stepArrow}>→</span>}
                    <span className={styles.stepBox}>
                      {stepIcons[step.type]} {step.label}
                    </span>
                  </React.Fragment>
                ))}
            </div>

            <div className={styles.tags}>
              {skill.tags.map((t) => (
                <Badge key={t} appearance="tint" size="small">
                  {t}
                </Badge>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.footerLeft}>
                <div className={styles.footerStat}>
                  <Text size={200} style={{ color: '#999' }}>
                    Owner
                  </Text>
                  <Text size={200} weight="semibold">
                    {skill.ownerTeam}
                  </Text>
                </div>
                <div className={styles.footerStat}>
                  <Text size={200} style={{ color: '#999' }}>
                    Invocations
                  </Text>
                  <Text size={200} weight="semibold">
                    {skill.invocationsToday.toLocaleString()}
                  </Text>
                </div>
                <Badge
                  appearance="tint"
                  size="small"
                  color={
                    skill.visibility === 'public'
                      ? 'success'
                      : skill.visibility === 'namespace'
                        ? 'informative'
                        : 'warning'
                  }
                >
                  {skill.visibility}
                </Badge>
              </div>
              <Text
                size={200}
                weight="semibold"
                style={{ color: '#60a5fa', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(skill);
                }}
              >
                View Details
              </Text>
            </div>
          </Card>
        ))}
      </div>

      {/* ── Detail panel ───────────────────────────────────────── */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
            {/* Panel header */}
            <div className={styles.panelHeader}>
              <div>
                <Text as="h2" size={600} weight="bold" block>
                  {selected.name}
                </Text>
                <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                  <Badge
                    appearance="filled"
                    size="small"
                    style={{
                      backgroundColor: typeColors[selected.type],
                      color: '#000',
                    }}
                  >
                    {typeLabels[selected.type]}
                  </Badge>
                  <Badge
                    appearance="filled"
                    size="small"
                    style={{
                      backgroundColor: statusColors[selected.status],
                      color: '#000',
                    }}
                  >
                    {selected.status}
                  </Badge>
                  <Badge
                    appearance="tint"
                    size="small"
                    color={
                      selected.visibility === 'public'
                        ? 'success'
                        : selected.visibility === 'namespace'
                          ? 'informative'
                          : 'warning'
                    }
                  >
                    {selected.visibility}
                  </Badge>
                </div>
              </div>
              <Button
                appearance="subtle"
                icon={<Dismiss24Regular />}
                onClick={() => setSelected(null)}
              />
            </div>

            <Text size={300} style={{ color: '#999' }}>
              {selected.description}
            </Text>

            {/* Steps timeline */}
            <div className={styles.section}>
              <Text className={styles.sectionTitle}>Steps</Text>
              {selected.steps
                .sort((a, b) => a.order - b.order)
                .map((step, i) => (
                  <React.Fragment key={step.order}>
                    {i > 0 && <div className={styles.connectorLine} />}
                    <div className={styles.timelineStep}>
                      <div className={styles.timelineIcon}>
                        {stepIcons[step.type]}
                      </div>
                      <div>
                        <Text size={300} weight="semibold" block>
                          {step.label}
                        </Text>
                        <Text size={200} style={{ color: '#999' }}>
                          {step.type}
                        </Text>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
            </div>

            {/* Connected assets */}
            <div className={styles.section}>
              <Text className={styles.sectionTitle}>Connected Assets</Text>

              {selected.modelIds.length > 0 && (
                <div>
                  <Text size={200} style={{ color: '#999', marginBottom: '4px' }} block>
                    Models
                  </Text>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selected.modelIds.map((id) => (
                      <span key={id} className={styles.assetChip}>
                        🧠 {modelMap.get(id) ?? id}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selected.toolIds.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <Text size={200} style={{ color: '#999', marginBottom: '4px' }} block>
                    Tools
                  </Text>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {selected.toolIds.map((id) => (
                      <span key={id} className={styles.assetChip}>
                        🔧 {toolMap.get(id) ?? id}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Configuration */}
            <div className={styles.section}>
              <Text className={styles.sectionTitle}>Configuration</Text>
              <div className={styles.configBlock}>{buildConfig(selected)}</div>
            </div>

            {/* Owner / stats */}
            <div className={styles.section}>
              <Text className={styles.sectionTitle}>Info</Text>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div className={styles.footerStat}>
                  <Text size={200} style={{ color: '#999' }}>
                    Owner
                  </Text>
                  <Text size={300} weight="semibold">
                    {selected.ownerTeam}
                  </Text>
                </div>
                <div className={styles.footerStat}>
                  <Text size={200} style={{ color: '#999' }}>
                    Invocations today
                  </Text>
                  <Text size={300} weight="semibold">
                    {selected.invocationsToday.toLocaleString()}
                  </Text>
                </div>
                <div className={styles.footerStat}>
                  <Text size={200} style={{ color: '#999' }}>
                    Created
                  </Text>
                  <Text size={300} weight="semibold">
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </Text>
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className={styles.panelFooter}>
              <Button appearance="primary">Edit</Button>
              <Button appearance="secondary">Test in Playground</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skills;
