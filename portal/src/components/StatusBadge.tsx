import React from 'react';
import { Badge } from '@fluentui/react-components';

interface StatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, { color: 'success' | 'danger' | 'warning' | 'informative' | 'subtle'; label: string }> = {
  active: { color: 'success', label: 'Active' },
  inactive: { color: 'subtle', label: 'Inactive' },
  degraded: { color: 'warning', label: 'Degraded' },
  error: { color: 'danger', label: 'Error' },
  enabled: { color: 'success', label: 'Enabled' },
  disabled: { color: 'subtle', label: 'Disabled' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status.toLowerCase()] || { color: 'informative' as const, label: status };
  return (
    <Badge appearance="filled" color={config.color}>
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
