"use client";

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { Sprout, ShoppingBag, ShieldCheck, Truck, Users, Home, Globe } from 'lucide-react';
import { Language } from '@/services/translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isUrbanMode?: boolean;
  onModeToggle?: (isUrban: boolean) => void;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  isUrbanMode = false,
  onModeToggle,
  language = 'en',
  onLanguageChange
}) => {
  const [urbanState, setUrbanState] = useState(isUrbanMode);

  const handleToggle = (urban: boolean) => {
    setUrbanState(urban);
    if (onModeToggle) onModeToggle(urban);
  };

  const handleLangToggle = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
  };

  const roles: { id: UserRole; label: string; subLabel: string; icon: any }[] = [
    { id: 'FARMER', label: 'Farmer', subLabel: 'உழவர்', icon: Sprout },
    { id: 'FPO', label: 'FPO Group', subLabel: 'குழு', icon: Users },
    { id: 'BULK_BUYER', label: 'Buyer', subLabel: 'வாங்குபவர்', icon: ShoppingBag },
    { id: 'CONSUMER', label: 'Consumer', subLabel: 'நுகர்வோர்', icon: Home },
    { id: 'LOGISTICS_PARTNER', label: 'Delivery', subLabel: 'டெலிவரி', icon: Truck },
    { id: 'ADMIN', label: 'Admin', subLabel: 'நிர்வாகம்', icon: ShieldCheck }
  ];

  return (
    <header className="glass-panel" style={{ margin: '16px 0 20px 0', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
      {/* Brand & Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 900, color: '#fff', fontSize: '1.4rem', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
          🌱
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.5px', background: 'linear-gradient(135deg, #ffffff, #e2e8f0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'center', gap: '8px' }}>
            AGRIFlow
            <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
              Direct Market
            </span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>
            {language === 'ta' ? 'விவசாயிகளுக்கான நேரடி பயிர் வர்த்தக தளம்' : 'Farmer Direct Crop Supply & Demand Platform'}
          </div>
        </div>
      </div>

      {/* Language Switcher & Region Mode Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* Bilingual Language Switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '3px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', alignItems: 'center' }}>
          <button
            onClick={() => handleLangToggle('en')}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: language === 'en' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: language === 'en' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => handleLangToggle('ta')}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: language === 'ta' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: language === 'ta' ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            🇮🇳 தமிழ் (Tamil)
          </button>
        </div>

        {/* Region Mode Switch */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={() => handleToggle(false)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: !urbanState ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
              color: !urbanState ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🌾 {language === 'ta' ? 'கிராமப்புறம் (50 கி.மீ)' : 'Rural (50km)'}
          </button>
          <button
            onClick={() => handleToggle(true)}
            style={{
              padding: '6px 12px',
              borderRadius: '10px',
              border: 'none',
              background: urbanState ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
              color: urbanState ? '#fff' : '#94a3b8',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            🏙️ {language === 'ta' ? 'நகர்ப்புறம் (150 கி.மீ)' : 'Urban (150km)'}
          </button>
        </div>
      </div>

      {/* Role Navigation Buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px' }}>
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
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '10px',
                border: isActive ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                background: isActive ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.03)',
                color: isActive ? '#34d399' : '#cbd5e1',
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: '1 1 auto',
                justifyContent: 'center',
                minHeight: '44px'
              }}
            >
              <Icon size={18} color={isActive ? '#10b981' : '#94a3b8'} />
              <span>{language === 'ta' ? r.subLabel : r.label}</span>
              <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>({language === 'ta' ? r.label : r.subLabel})</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
