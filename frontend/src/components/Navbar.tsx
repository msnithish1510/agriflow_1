"use client";

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Sprout, ShoppingBag, ShieldCheck, Truck, Users, Home } from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isUrbanMode?: boolean;
  onModeToggle?: (isUrban: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  isUrbanMode = false,
  onModeToggle
}) => {
  const [urbanState, setUrbanState] = useState(isUrbanMode);

  const handleToggle = (urban: boolean) => {
    setUrbanState(urban);
    if (onModeToggle) onModeToggle(urban);
  };

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: 'FARMER', label: 'Farmer', icon: Sprout },
    { id: 'FPO', label: 'FPO', icon: Users },
    { id: 'BULK_BUYER', label: 'Bulk Buyer', icon: ShoppingBag },
    { id: 'CONSUMER', label: 'Consumer', icon: Home },
    { id: 'LOGISTICS_PARTNER', label: 'Logistics', icon: Truck },
    { id: 'ADMIN', label: 'Admin', icon: ShieldCheck }
  ];

  return (
    <header className="glass-panel" style={{ margin: '16px 0 24px 0', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, color: '#fff', fontSize: '1.2rem' }}>
          🌱
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AGRIFlow
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
            SIH 2026 Pre-Market Coordination Platform
          </div>
        </div>
      </div>

      {/* RURAL vs URBAN Mode Indicator Toggle */}
      <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '4px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button
          onClick={() => handleToggle(false)}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            border: 'none',
            background: !urbanState ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
            color: !urbanState ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🌾 RURAL MODE (50km)
        </button>
        <button
          onClick={() => handleToggle(true)}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            border: 'none',
            background: urbanState ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
            color: urbanState ? '#fff' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🏙️ URBAN MODE (150km)
        </button>
      </div>

      {/* Role Selector Tabs */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {roles.map((r) => {
          const Icon = r.icon;
          const isActive = currentRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onRoleChange(r.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                color: isActive ? '#10b981' : '#94a3b8',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} />
              {r.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
