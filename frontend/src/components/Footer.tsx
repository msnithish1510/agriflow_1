"use client";

import React from 'react';
import { useLanguage } from '@/i18n';
import { Sprout, ShieldCheck, Heart, Globe, ArrowRight, ExternalLink } from 'lucide-react';
import { UserRole } from '@/types';

interface FooterProps {
  onNavigate?: (view: string) => void;
  onRoleSelect?: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onRoleSelect }) => {
  const { t, language, setLanguage, languages } = useLanguage();

  return (
    <footer style={{
      marginTop: '60px',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(9, 13, 22, 0.95)',
      paddingTop: '48px',
      paddingBottom: '36px'
    }}>
      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '40px'
        }}>
          {/* Brand & Purpose Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: '#fff',
                boxShadow: '0 4px 12px rgba(16,185,129,0.3)'
              }}>
                🌱
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.5px' }}>
                AGRIFlow
              </span>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
              {t.footer.aboutText}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34d399',
              fontSize: '0.78rem',
              fontWeight: 700,
              width: 'fit-content'
            }}>
              <ShieldCheck size={16} />
              {t.footer.sihBadge}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              {[
                { id: 'home', label: t.nav.home },
                { id: 'how-it-works', label: t.nav.howItWorks },
                { id: 'market-pulse', label: t.nav.marketPulse },
                { id: 'price-transparency', label: t.nav.priceTransparency },
                { id: 'demo', label: t.nav.interactiveDemo },
                { id: 'dashboard', label: t.nav.farmerPortal }
              ].map(item => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate && onNavigate(item.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '2px 0',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#10b981')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    <span>›</span> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholder Portals */}
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {t.footer.stakeholders}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              {[
                { role: 'FARMER' as UserRole, label: t.common.roles.FARMER },
                { role: 'BULK_BUYER' as UserRole, label: t.common.roles.BULK_BUYER },
                { role: 'CONSUMER' as UserRole, label: t.common.roles.CONSUMER },
                { role: 'LOGISTICS_PARTNER' as UserRole, label: t.common.roles.LOGISTICS_PARTNER },
                { role: 'FPO' as UserRole, label: t.common.roles.FPO },
                { role: 'ADMIN' as UserRole, label: t.common.roles.ADMIN }
              ].map(p => (
                <li key={p.role}>
                  <button
                    onClick={() => {
                      if (onRoleSelect) onRoleSelect(p.role);
                      if (onNavigate) onNavigate('dashboard');
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#cbd5e1',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '2px 0',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#cbd5e1')}
                  >
                    <span>›</span> {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Language & Trust Statement */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              {t.nav.language} (Language)
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '8px'
            }}>
              {languages.map(lang => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                      background: isSelected ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.04)',
                      color: isSelected ? '#34d399' : '#94a3b8',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{lang.nativeName}</span>
                    {isSelected && <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800 }}>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.07)',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '0.78rem',
              color: '#94a3b8',
              lineHeight: 1.5
            }}>
              {t.footer.transparencyNotice}
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          paddingTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '0.82rem',
          color: '#64748b'
        }}>
          <div>{t.footer.copyright}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🌱</span>
            <span>{t.common.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
