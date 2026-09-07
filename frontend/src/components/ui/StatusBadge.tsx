import React from 'react';

export type StatusType = 'PENDING' | 'MATCHED' | 'CONFIRMED' | 'IN_TRANSIT' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'HIGH_DEMAND' | 'MODERATE_DEMAND' | 'LOW_DEMAND' | 'OPEN';

interface StatusBadgeProps {
  status: string;
  label?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, size = 'md' }) => {
  const normStatus = (status || '').toUpperCase();

  let badgeClass = 'badge-pending';
  let icon = '🟡';
  let defaultLabel = status;

  if (normStatus.includes('CONFIRM')) {
    badgeClass = 'badge-confirmed';
    icon = '🟣';
    defaultLabel = label || 'Confirmed';
  } else if (normStatus.includes('MATCH')) {
    badgeClass = 'badge-matched';
    icon = '🔵';
    defaultLabel = label || 'Matched';
  } else if (normStatus.includes('DELIVER') || normStatus.includes('COMPLETE')) {
    badgeClass = 'badge-completed';
    icon = '🟢';
    defaultLabel = label || 'Completed';
  } else if (normStatus.includes('TRANSIT')) {
    badgeClass = 'badge-matched';
    icon = '🚚';
    defaultLabel = label || 'In Transit';
  } else if (normStatus.includes('CANCEL')) {
    badgeClass = 'badge-cancelled';
    icon = '🔴';
    defaultLabel = label || 'Cancelled';
  } else if (normStatus.includes('HIGH')) {
    badgeClass = 'badge-completed';
    icon = '🟢';
    defaultLabel = label || 'High Demand';
  } else if (normStatus.includes('MODERATE')) {
    badgeClass = 'badge-pending';
    icon = '🟡';
    defaultLabel = label || 'Moderate Demand';
  } else if (normStatus.includes('LOW')) {
    badgeClass = 'badge-cancelled';
    icon = '🔴';
    defaultLabel = label || 'Low Demand';
  } else if (normStatus === 'OPEN') {
    badgeClass = 'badge-rural';
    icon = '🟢';
    defaultLabel = label || 'Open';
  }

  return (
    <span 
      className={`badge-tag ${badgeClass}`}
      style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.82rem',
        padding: size === 'sm' ? '2px 8px' : '4px 12px'
      }}
    >
      <span>{icon}</span>
      <span>{label || defaultLabel}</span>
    </span>
  );
};
