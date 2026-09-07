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
      padding: '48px 24px',
      textAlign: 'center',
      background: 'rgba(255, 255, 255, 0.70)',
      border: '1.5px dashed rgba(22, 163, 74, 0.35)',
      borderRadius: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.02)'
    }}>
      <div style={{
        fontSize: '2.6rem',
        filter: 'drop-shadow(0 4px 10px rgba(22, 163, 74, 0.15))'
      }}>
        {icon}
      </div>
      <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17221C' }}>
        {title}
      </h4>
      {message && (
        <p style={{ fontSize: '0.92rem', color: '#64748B', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>
          {message}
        </p>
      )}
      {actionLabel && onAction && (
        <button className="btn-emerald" onClick={onAction} style={{ marginTop: '8px', minHeight: '44px', padding: '10px 24px' }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
