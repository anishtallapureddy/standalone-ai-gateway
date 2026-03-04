import React, { useState } from 'react';
import {
  Card,
  Text,
  makeStyles,
  tokens,
  Badge,
  Button,
} from '@fluentui/react-components';
import { Add24Regular, Dismiss24Regular } from '@fluentui/react-icons';
import { skills, models, tools } from '../data/mockData';
import type { Skill } from '../data/mockData';

// ── helpers ──────────────────────────────────────────────────────────────────

const workflows = skills.filter((s) => s.type === 'workflow');
const modelMap = new Map(models.map((m) => [m.id, m.name]));
const toolMap = new Map(tools.map((t) => [t.id, t.name]));

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
  statsBar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    padding: '20px',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    backgroundColor: tokens.colorNeutralBackground3,
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
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
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    fontSize: '11px',
    whiteSpace: 'nowrap',
  },
  stepArrow: {
    color: '#475569',
    fontSize: '12px',
    flexShrink: 0,
  },
  connectedAssets: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    marginBottom: '12px',
  },
  assetRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap',
  },
  assetBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    fontSize: '11px',
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
    fontSize: '12px',
    color: '#999',
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
    width: '560px',
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
  timelineItem: {
    display: 'flex',
    gap: '12px',
  },
  timelineTrack: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '28px',
    flexShrink: 0,
  },
  timelineNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 700,
    backgroundColor: 'rgba(96,165,250,0.15)',
    color: '#60a5fa',
    border: '1px solid rgba(96,165,250,0.3)',
    flexShrink: 0,
  },
  timelineLine: {
    width: '2px',
    flexGrow: 1,
    backgroundColor: '#475569',
    minHeight: '12px',
  },
  timelineCard: {
    flexGrow: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: `1px solid ${tokens.colorNeutralStroke2}`,
    marginBottom: '4px',
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
  panelFooter: {
    display: 'flex',
    gap: '8px',
    marginTop: 'auto',
    paddingTop: '16px',
    borderTop: `1px solid ${tokens.colorNeutralStroke2}`,
  },
});

// ── component ────────────────────────────────────────────────────────────────

const Workflows: React.FC = () => {
  const styles = useStyles();
  const [selected, setSelected] = useState<Skill | null>(null);

  const totalWorkflows = workflows.length;
  const activeCount = workflows.filter((w) => w.status === 'active').length;
  const totalSteps = workflows.reduce((sum, w) => sum + w.steps.length, 0);

  const resolveModels = (ids: string[]) =>
    ids.map((id) => modelMap.get(id) ?? id);
  const resolveTools = (ids: string[]) =>
    ids.map((id) => toolMap.get(id) ?? id);

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div />
        <Button appearance="primary" icon={<Add24Regular />}>
          Create Workflow
        </Button>
      </div>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }} block>
            Total Workflows
          </Text>
          <Text size={700} weight="bold" style={{ color: '#60a5fa' }}>
            {totalWorkflows}
          </Text>
        </Card>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }} block>
            Active
          </Text>
          <Text size={700} weight="bold" style={{ color: '#34d399' }}>
            {activeCount}
          </Text>
        </Card>
        <Card className={styles.statCard}>
          <Text size={200} style={{ color: '#999' }} block>
            Total Steps
          </Text>
          <Text size={700} weight="bold" style={{ color: '#fbbf24' }}>
            {totalSteps}
          </Text>
        </Card>
      </div>

      {/* ── Card grid ──────────────────────────────────────────── */}
      <div className={styles.grid}>
        {workflows.map((wf) => (
          <Card
            key={wf.id}
            className={styles.card}
            onClick={() => setSelected(wf)}
          >
            <div className={styles.cardHeader}>
              <Text weight="semibold" size={400}>
                {wf.name}
              </Text>
              <Badge
                appearance="filled"
                size="small"
                style={{
                  backgroundColor: statusColors[wf.status],
                  color: '#000',
                }}
              >
                {wf.status}
              </Badge>
            </div>

            <div className={styles.description}>{wf.description}</div>

            {/* Visual step flow */}
            <div className={styles.stepsFlow}>
              {wf.steps
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

            {/* Connected assets */}
            <div className={styles.connectedAssets}>
              {wf.modelIds.length > 0 && (
                <div className={styles.assetRow}>
                  <Text size={200} style={{ color: '#999' }}>
                    Models:
                  </Text>
                  {resolveModels(wf.modelIds).map((name) => (
                    <span key={name} className={styles.assetBadge}>
                      🧠 {name}
                    </span>
                  ))}
                </div>
              )}
              {wf.toolIds.length > 0 && (
                <div className={styles.assetRow}>
                  <Text size={200} style={{ color: '#999' }}>
                    Tools:
                  </Text>
                  {resolveTools(wf.toolIds).map((name) => (
                    <span key={name} className={styles.assetBadge}>
                      🔧 {name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.tags}>
              {wf.tags.map((t) => (
                <Badge key={t} appearance="tint" size="small">
                  {t}
                </Badge>
              ))}
            </div>

            <div className={styles.cardFooter}>
              <span>{wf.ownerTeam}</span>
              <span>{wf.invocationsToday.toLocaleString()} invocations today</span>
              <Badge
                appearance="tint"
                size="small"
                color={
                  wf.visibility === 'public'
                    ? 'success'
                    : wf.visibility === 'team'
                      ? 'informative'
                      : 'warning'
                }
              >
                {wf.visibility}
              </Badge>
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
                        : selected.visibility === 'team'
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
                  <div key={step.order} className={styles.timelineItem}>
                    <div className={styles.timelineTrack}>
                      <div className={styles.timelineNumber}>{step.order}</div>
                      {i < selected.steps.length - 1 && (
                        <div className={styles.timelineLine} />
                      )}
                    </div>
                    <div className={styles.timelineCard}>
                      <Text size={300} weight="semibold" block>
                        {stepIcons[step.type]} {step.label}
                      </Text>
                      <Text size={200} style={{ color: '#999' }}>
                        {step.type}
                      </Text>
                    </div>
                  </div>
                ))}
            </div>

            {/* Connected Models */}
            {selected.modelIds.length > 0 && (
              <div className={styles.section}>
                <Text className={styles.sectionTitle}>Connected Models</Text>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {resolveModels(selected.modelIds).map((name) => (
                    <span key={name} className={styles.assetChip}>
                      🧠 {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Tools */}
            {selected.toolIds.length > 0 && (
              <div className={styles.section}>
                <Text className={styles.sectionTitle}>Connected Tools</Text>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {resolveTools(selected.toolIds).map((name) => (
                    <span key={name} className={styles.assetChip}>
                      🔧 {name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Info */}
            <div className={styles.section}>
              <Text className={styles.sectionTitle}>Info</Text>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div>
                  <Text size={200} style={{ color: '#999' }} block>
                    Owner
                  </Text>
                  <Text size={300} weight="semibold">
                    {selected.ownerTeam}
                  </Text>
                </div>
                <div>
                  <Text size={200} style={{ color: '#999' }} block>
                    Invocations today
                  </Text>
                  <Text size={300} weight="semibold">
                    {selected.invocationsToday.toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Text size={200} style={{ color: '#999' }} block>
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
              <Button appearance="primary">Edit Workflow</Button>
              <Button appearance="secondary">Test in Playground</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workflows;
