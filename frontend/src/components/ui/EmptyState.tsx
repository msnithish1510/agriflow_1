import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '🌾',
  title,
  message,
  actionLabel,
  onAction
}) => {
  return (
    <div style={{
      padding: '40px 24px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.02)',
      border: '1px dashed rgba(255, 255, 255, 0.12)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    }}>
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
        {title}
      </h4>
      {message && (
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '420px', margin: '0 auto' }}>
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button className="btn-emerald" onClick={onAction} style={{ marginTop: '8px', minHeight: '42px', padding: '8px 20px' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
