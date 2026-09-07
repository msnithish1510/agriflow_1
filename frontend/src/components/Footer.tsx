"use client";

import React from 'react';
import { useLanguage } from '@/i18n';
import { Sprout, ShieldCheck, Heart, Globe, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { UserRole } from '@/types';

interface FooterProps {
  onNavigate?: (view: string) => void;
  onRoleSelect?: (role: UserRole) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onRoleSelect }) => {
  const { t, language, setLanguage, languages } = useLanguage();

  return (
    <footer style={{
      marginTop: '64px',
      borderTop: '1px solid rgba(0, 0, 0, 0.08)',
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      paddingTop: '52px',
      paddingBottom: '36px',
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.02), inset 0 1px 0 #ffffff'
    }}>
      <div className="app-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '36px',
          marginBottom: '44px'
        }}>
          {/* Brand & Purpose Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'linear-gradient(135deg, #16A34A, #15803D)',
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                color: '#fff',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                🌱
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#17221C', letterSpacing: '-0.5px' }}>
                AGRIFlow
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.65 }}>
              {t.footer.aboutText}
            </p>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: '12px',
              background: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              fontSize: '0.82rem',
              color: '#15803D',
              fontWeight: 600,
              width: 'fit-content'
            }}>
              <ShieldCheck size={16} />
              <span>Smart India Hackathon • SIH26033</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#17221C', marginBottom: '16px' }}>
              {t.footer.quickLinks}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'home', label: t.nav.home },
                { id: 'how-it-works', label: t.nav.howItWorks },
                { id: 'market-pulse', label: t.nav.marketPulse },
                { id: 'price-transparency', label: t.nav.priceTransparency },
                { id: 'demo', label: t.nav.interactiveDemo }
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigate?.(link.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#16A34A';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholder Portals */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#17221C', marginBottom: '16px' }}>
              {t.footer.stakeholders}
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { role: 'FARMER' as UserRole, label: t.common.roles.FARMER, icon: '🌾' },
                { role: 'BULK_BUYER' as UserRole, label: t.common.roles.BULK_BUYER, icon: '🏢' },
                { role: 'CONSUMER' as UserRole, label: t.common.roles.CONSUMER, icon: '🥗' },
                { role: 'LOGISTICS_PARTNER' as UserRole, label: t.common.roles.LOGISTICS_PARTNER, icon: '🚚' },
                { role: 'FPO' as UserRole, label: t.common.roles.FPO, icon: '🤝' },
                { role: 'ADMIN' as UserRole, label: t.common.roles.ADMIN, icon: '🛡️' }
              ].map((item) => (
                <li key={item.role}>
                  <button
                    onClick={() => {
                      onRoleSelect?.(item.role);
                      onNavigate?.('dashboard');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748B',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'left',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#16A34A';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = '#64748B';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Multilingual Support Strip */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#17221C', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={18} color="#16A34A" />
              <span>{t.footer.accessibility}</span>
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '14px', lineHeight: 1.5 }}>
              Switch interface to your preferred regional language:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {languages.map((l) => {
                const isActive = l.code === language;
                return (
                  <button
                    key={l.code}
                    onClick={() => setLanguage(l.code)}
                    style={{
                      background: isActive ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0, 0, 0, 0.03)',
                      color: isActive ? '#15803D' : '#334155',
                      border: isActive ? '1px solid rgba(22, 163, 74, 0.35)' : '1px solid rgba(0, 0, 0, 0.06)',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{l.nativeName}</span>
                    {isActive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(0, 0, 0, 0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.85rem',
          color: '#64748B'
        }}>
          <div>
            {t.footer.copyright}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Built for Indian Farmers & Consumers with</span>
            <Heart size={14} color="#EF4444" fill="#EF4444" />
          </div>
        </div>
      </div>
    </footer>
  );
};
