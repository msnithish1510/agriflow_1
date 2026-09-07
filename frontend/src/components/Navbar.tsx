"use client";

import React, { useState } from 'react';
import { UserRole } from '@/types';
import { useLanguage } from '@/i18n';
import { 
  Sprout, ShoppingBag, ShieldCheck, Truck, Users, Home, Globe, 
  Menu, X, ChevronDown, Activity, Sparkles, SlidersHorizontal 
} from 'lucide-react';

interface NavbarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  isUrbanMode: boolean;
  onModeToggle: (isUrban: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  currentRole,
  onRoleChange,
  isUrbanMode,
  onModeToggle
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  const roles: { id: UserRole; label: string; icon: any }[] = [
    { id: 'FARMER', label: t.common.roles.FARMER, icon: Sprout },
    { id: 'BULK_BUYER', label: t.common.roles.BULK_BUYER, icon: ShoppingBag },
    { id: 'CONSUMER', label: t.common.roles.CONSUMER, icon: Home },
    { id: 'LOGISTICS_PARTNER', label: t.common.roles.LOGISTICS_PARTNER, icon: Truck },
    { id: 'FPO', label: t.common.roles.FPO, icon: Users },
    { id: 'ADMIN', label: t.common.roles.ADMIN, icon: ShieldCheck }
  ];

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'how-it-works', label: t.nav.howItWorks },
    { id: 'market-pulse', label: t.nav.marketPulse },
    { id: 'price-transparency', label: t.nav.priceTransparency },
    { id: 'demo', label: t.nav.interactiveDemo },
    { id: 'dashboard', label: t.nav.farmerPortal }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      background: 'rgba(8, 13, 22, 0.92)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      marginBottom: '20px'
    }}>
      <div className="app-container">
        {/* Top Navbar Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '68px',
          gap: '16px'
        }}>
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.3rem',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              flexShrink: 0
            }}>
              🌱
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '-0.5px',
                  background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  AGRIFlow
                </span>
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.18)',
                  color: '#34d399',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 700
                }}>
                  SIH26033
                </span>
              </div>
              <div style={{ fontSize: '0.76rem', color: '#94a3b8', fontWeight: 500 }}>
                {t.common.tagline}
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '4px'
          }} className="desktop-nav">
            {navLinks.map(link => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    color: isActive ? '#34d399' : '#cbd5e1',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#cbd5e1';
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Scope, Language, Persona Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Scope Mode (Rural / Urban) - Desktop */}
            <div style={{ display: 'none', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }} className="desktop-controls">
              <button
                onClick={() => onModeToggle(false)}
                title={t.common.ruralScope}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  background: !isUrbanMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
                  color: !isUrbanMode ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🌾 {language === 'ta' ? 'கிராமப்புறம்' : language === 'hi' ? 'ग्रामीण' : language === 'te' ? 'గ్రామీణ' : language === 'ml' ? 'ഗ്രാമീണ' : language === 'kn' ? 'ಗ್ರಾಮೀಣ' : 'Rural'}
              </button>
              <button
                onClick={() => onModeToggle(true)}
                title={t.common.urbanScope}
                style={{
                  padding: '5px 10px',
                  borderRadius: '9px',
                  border: 'none',
                  background: isUrbanMode ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'transparent',
                  color: isUrbanMode ? '#ffffff' : '#94a3b8',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                🏙️ {language === 'ta' ? 'நகர்ப்புறம்' : language === 'hi' ? 'शहरी' : language === 'te' ? 'పట్టణ' : language === 'ml' ? 'നഗര' : language === 'kn' ? 'ನಗರ' : 'Urban'}
              </button>
            </div>

            {/* Global 6-Language Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 11px',
                  borderRadius: '11px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.84rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Select Language"
                aria-expanded={langDropdownOpen}
              >
                <Globe size={16} style={{ color: '#10b981' }} />
                <span className="lang-label">{currentLangObj.nativeName}</span>
                <ChevronDown size={14} style={{ transform: langDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {langDropdownOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 998 }} 
                    onClick={() => setLangDropdownOpen(false)} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '180px',
                    background: '#091512',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '12px',
                    padding: '6px',
                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(16, 185, 129, 0.15)',
                    backdropFilter: 'blur(16px)',
                    zIndex: 999,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px'
                  }}>
                    <div style={{
                      padding: '6px 10px',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: '#6ee7b7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                      marginBottom: '4px'
                    }}>
                      {t.common.appName} Languages
                    </div>
                    {languages.map(lang => {
                      const isSelected = language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setLangDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: isSelected ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
                            color: isSelected ? '#34d399' : '#e2e8f0',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.84rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{lang.nativeName}</span>
                            <span style={{ fontSize: '0.68rem', color: isSelected ? '#10b981' : '#94a3b8' }}>
                              {lang.label}
                            </span>
                          </div>
                          {isSelected && <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Persona / Role Selector Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  minHeight: '40px'
                }}
              >
                <CurrentRoleIcon size={16} color="#10b981" />
                <span className="persona-label">{currentRoleObj.label}</span>
                <ChevronDown size={14} color="#94a3b8" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div 
                    style={{ position: 'fixed', inset: 0, zIndex: 110 }} 
                    onClick={() => setRoleDropdownOpen(false)} 
                  />
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '240px',
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '14px',
                    padding: '8px',
                    boxShadow: '0 16px 36px rgba(0, 0, 0, 0.6)',
                    zIndex: 120,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}>
                    <div style={{ padding: '6px 10px', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t.common.changeRole}
                    </div>
                    {roles.map(r => {
                      const Icon = r.icon;
                      const isSelected = currentRole === r.id;
                      return (
                        <button
                          key={r.id}
                          onClick={() => {
                            onRoleChange(r.id);
                            setRoleDropdownOpen(false);
                            onNavigate('dashboard');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            border: 'none',
                            background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            color: isSelected ? '#34d399' : '#cbd5e1',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Icon size={16} color={isSelected ? '#10b981' : '#94a3b8'} />
                          <span>{r.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-hamburger"
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
                cursor: 'pointer'
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            padding: '16px 0 20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {navLinks.map(link => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    background: isActive ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255,255,255,0.03)',
                    color: isActive ? '#34d399' : '#f8fafc',
                    fontWeight: isActive ? 700 : 600,
                    fontSize: '0.95rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{link.label}</span>
                  {isActive && <span style={{ color: '#10b981' }}>✓</span>}
                </button>
              );
            })}

            {/* Mobile Scope Toggle */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginTop: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              <button
                onClick={() => onModeToggle(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: !isUrbanMode ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                🌾 {t.common.ruralScope}
              </button>
              <button
                onClick={() => onModeToggle(true)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isUrbanMode ? 'linear-gradient(135deg, #06b6d4, #0284c7)' : 'rgba(255,255,255,0.06)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                🏙️ {t.common.urbanScope}
              </button>
            </div>

            {/* Mobile 6-Language Selector Grid */}
            <div style={{
              marginTop: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.06)'
            }}>
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#94a3b8',
                marginBottom: '8px',
                paddingLeft: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Globe size={14} style={{ color: '#10b981' }} />
                <span>Language / மொழி / भाषा</span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '6px'
              }}>
                {languages.map(lang => {
                  const isSelected = language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: isSelected ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                        background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.03)',
                        color: isSelected ? '#34d399' : '#e2e8f0',
                        fontWeight: isSelected ? 700 : 500,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {lang.nativeName}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .desktop-controls {
            display: flex !important;
          }
        }
        @media (max-width: 899px) {
          .mobile-hamburger {
            display: flex !important;
          }
          .persona-label {
            display: none;
          }
          .lang-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
