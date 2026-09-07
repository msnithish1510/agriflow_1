import React from 'react';

interface SkeletonBoxProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonBox: React.FC<SkeletonBoxProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const SkeletonKpiCard: React.FC = () => {
  return (
    <div className="glass-card-primary" style={{ padding: '20px', minHeight: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <SkeletonBox width="45%" height="16px" />
        <SkeletonBox width="36px" height="36px" borderRadius="10px" />
      </div>
      <SkeletonBox width="60%" height="28px" style={{ marginBottom: '10px' }} />
      <SkeletonBox width="75%" height="14px" />
    </div>
  );
};

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="glass-card-primary" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
        <SkeletonBox width="42px" height="42px" borderRadius="12px" />
        <div style={{ flex: 1 }}>
          <SkeletonBox width="50%" height="18px" style={{ marginBottom: '8px' }} />
          <SkeletonBox width="30%" height="12px" />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonBox key={i} width={`${90 - i * 15}%`} height="14px" />
        ))}
      </div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="glass-card-primary" style={{ padding: '20px', overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
        <SkeletonBox width="25%" height="16px" />
        <SkeletonBox width="25%" height="16px" />
        <SkeletonBox width="25%" height="16px" />
        <SkeletonBox width="25%" height="16px" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: '16px' }}>
            <SkeletonBox width="25%" height="20px" />
            <SkeletonBox width="25%" height="20px" />
            <SkeletonBox width="25%" height="20px" />
            <SkeletonBox width="25%" height="20px" />
          </div>
        ))}
      </div>
    </div>
  );
};
