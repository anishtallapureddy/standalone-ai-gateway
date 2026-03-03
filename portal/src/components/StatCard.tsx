import React from 'react';
import { Card, Text, makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
  card: {
    padding: '20px',
    minWidth: '180px',
    flex: '1 1 180px',
  },
  value: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2,
  },
  label: {
    color: tokens.colorNeutralForeground3,
    fontSize: '13px',
    marginTop: '4px',
  },
  iconRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

interface StatCardProps {
  value: string | number;
  label: string;
  icon: React.ReactElement;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, icon, color }) => {
  const styles = useStyles();
  return (
    <Card className={styles.card}>
      <div className={styles.iconRow}>
        <Text className={styles.value} style={{ color: color || tokens.colorNeutralForeground1 }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Text>
        <div style={{ color: color || '#666', fontSize: '24px' }}>{icon}</div>
      </div>
      <Text className={styles.label}>{label}</Text>
    </Card>
  );
};

export default StatCard;
