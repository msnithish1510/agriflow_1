"use client";

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types';
import { useLanguage } from '@/i18n';
import { 
  Sprout, ShoppingBag, ShieldCheck, Truck, Users, Home, Globe, 
  Menu, X, ChevronDown, Check, Sparkles, Bell, User
} from 'lucide-react';
import { AuthModal } from './ui/AuthModal';

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
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'FARMER', label: t.common.roles.FARMER, icon: Sprout, color: '#16A34A' },
    { id: 'BULK_BUYER', label: t.common.roles.BULK_BUYER, icon: ShoppingBag, color: '#0EA5E9' },
    { id: 'CONSUMER', label: t.common.roles.CONSUMER, icon: Home, color: '#F59E0B' },
    { id: 'LOGISTICS_PARTNER', label: t.common.roles.LOGISTICS_PARTNER, icon: Truck, color: '#8B5CF6' },
    { id: 'FPO', label: t.common.roles.FPO, icon: Users, color: '#10B981' },
    { id: 'ADMIN', label: t.common.roles.ADMIN, icon: ShieldCheck, color: '#F43F5E' }
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
    setRoleDropdownOpen(false);
    setLangDropdownOpen(false);
  };

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[0];
  const CurrentRoleIcon = currentRoleObj.icon;

  return (
    <>
      <header style={{
        position: 'sticky',
        top: '10px',
        zIndex: 100,
        margin: '0 auto 16px auto',
        maxWidth: '1360px',
        width: 'calc(100% - 24px)',
        boxSizing: 'border-box',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: scrolled ? 'rgba(255, 255, 255, 0.94)' : 'rgba(255, 255, 255, 0.86)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          borderRadius: '20px',
          boxShadow: scrolled 
            ? '0 16px 36px -10px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(22, 163, 74, 0.05), inset 0 1px 1px #ffffff'
            : '0 10px 30px -8px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 1px #ffffff',
          padding: '6px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* 1. Brand Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.15rem',
              color: '#ffffff',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              flexShrink: 0
            }}>
              🌱
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="nav-brand-title" style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: '#17221C',
                  whiteSpace: 'nowrap'
                }}>
                  AGRIFlow
                </span>
                <span style={{
                  fontSize: '0.65rem',
                  padding: '2px 6px',
                  borderRadius: '16px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: '#15803D',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  whiteSpace: 'nowrap'
                }}>
                  <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
                  SIH26033
                </span>
              </div>
              <div className="nav-brand-tagline" style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 500, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>
                {t.common.tagline}
              </div>
            </div>
          </div>

          {/* 2. Desktop Navigation Links */}
          <nav className="nav-desktop-only" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flexShrink: 1,
            minWidth: 0,
            overflow: 'hidden'
          }}>
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className="nav-link-btn"
                  style={{
                    background: isActive ? 'rgba(22, 163, 74, 0.10)' : 'transparent',
                    color: isActive ? '#15803D' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.85rem',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    border: isActive ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                      e.currentTarget.style.color = '#17221C';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#334155';
                    }
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* 3. Action Controls Container: Rural/Urban Switcher, Notification, Language, Persona, Login */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexShrink: 0,
            marginLeft: 'auto'
          }}>
            
            {/* 3a. Scope Mode Switch (Rural vs. Urban) */}
            <div 
              onClick={() => onModeToggle(!isUrbanMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 10px',
                borderRadius: '10px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="Toggle Pre-Harvest Scope"
              className="nav-desktop-only nav-control-btn"
            >
              <span style={{ fontSize: '0.8rem' }}>{isUrbanMode ? '🏙️' : '🌾'}</span>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                color: isUrbanMode ? '#0284C7' : '#15803D',
                whiteSpace: 'nowrap'
              }}>
                {isUrbanMode ? 'Urban 150km' : 'Rural 50km'}
              </span>
            </div>

            {/* 3b. Notification Bell */}
            <button
              onClick={() => alert('🌾 Live Agricultural Alerts:\n• Tomato demand surge in Chennai (+28%)\n• 4 cold-chain trucks available in Erode\n• Minimum Price advisory updated for Salem')}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title="Live Agricultural Notifications"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '6px',
                height: '6px',
                background: '#EF4444',
                borderRadius: '50%',
                boxShadow: '0 0 4px #EF4444'
              }} />
            </button>

            {/* 3c. 6-LANGUAGE DROPDOWN SELECTOR */}
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setRoleDropdownOpen(false);
                }}
                className="nav-control-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  background: langDropdownOpen ? 'rgba(22, 163, 74, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  color: '#17221C',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                aria-label="Select Language"
              >
                <Globe size={15} color="#16A34A" />
                <span style={{ whiteSpace: 'nowrap' }}>{currentLangObj.nativeName}</span>
                <ChevronDown size={13} style={{
                  transform: langDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: '#64748B'
                }} />
              </button>

              {langDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '14px',
                  padding: '6px',
                  minWidth: '200px',
                  boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748B',
                    padding: '4px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Language / மொழி
                  </div>
                  {languages.map((lang) => {
                    const isSelected = lang.code === language;
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
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div>
                          <div style={{
                            fontSize: '0.85rem',
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#15803D' : '#17221C'
                          }}>
                            {lang.nativeName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {lang.label}
                          </div>
                        </div>
                        {isSelected && <Check size={15} color="#16A34A" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3d. ROLE PERSONA SWITCHER */}
            <div style={{ position: 'relative', flexShrink: 0 }} className="nav-desktop-only">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="nav-control-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  color: '#17221C',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
                aria-label="Switch Persona"
              >
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: `${currentRoleObj.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentRoleObj.color,
                  flexShrink: 0
                }}>
                  <CurrentRoleIcon size={13} />
                </div>
                <span style={{ whiteSpace: 'nowrap' }}>{currentRoleObj.label}</span>
                <ChevronDown size={13} style={{
                  transform: roleDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  color: '#64748B'
                }} />
              </button>

              {roleDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: '14px',
                  padding: '6px',
                  minWidth: '210px',
                  boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px'
                }}>
                  <div style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#64748B',
                    padding: '4px 8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Ecosystem Persona
                  </div>
                  {roles.map((r) => {
                    const RoleIcon = r.icon;
                    const isSelected = r.id === currentRole;
                    return (
                      <button
                        key={r.id}
                        onClick={() => {
                          onRoleChange(r.id);
                          setRoleDropdownOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          background: isSelected ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'rgba(0, 0, 0, 0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <div style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '5px',
                          background: `${r.color}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: r.color,
                          flexShrink: 0
                        }}>
                          <RoleIcon size={13} />
                        </div>
                        <div style={{ flex: 1, fontSize: '0.84rem', fontWeight: isSelected ? 700 : 500, color: '#17221C' }}>
                          {r.label}
                        </div>
                        {isSelected && <Check size={15} color="#16A34A" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3e. USER / AUTH PROFILE BUTTON */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="nav-control-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(22, 163, 74, 0.3)',
                userSelect: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              title="User Account & Login"
            >
              <User size={14} />
              <span style={{ whiteSpace: 'nowrap' }}>Login</span>
            </button>

            {/* 3f. MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                padding: '6px',
                cursor: 'pointer',
                color: '#17221C',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
              className="nav-mobile-only"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div style={{
            marginTop: '8px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '18px',
            padding: '14px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Navigation Menu
              </span>
              <div 
                onClick={() => onModeToggle(!isUrbanMode)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: 'rgba(0, 0, 0, 0.04)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: isUrbanMode ? '#0284C7' : '#15803D',
                  cursor: 'pointer'
                }}
              >
                <span>{isUrbanMode ? '🏙️' : '🌾'}</span>
                <span>{isUrbanMode ? 'Urban 150km' : 'Rural 50km'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              {navLinks.map((link) => {
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    style={{
                      background: isActive ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0, 0, 0, 0.02)',
                      color: isActive ? '#15803D' : '#17221C',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      padding: '10px',
                      borderRadius: '10px',
                      border: isActive ? '1px solid rgba(22, 163, 74, 0.3)' : '1px solid rgba(0, 0, 0, 0.05)',
                      textAlign: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Mobile Persona Switcher */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '6px' }}>
                Select Active Persona
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {roles.map((r) => {
                  const isSelected = r.id === currentRole;
                  return (
                    <button
                      key={r.id}
                      onClick={() => {
                        onRoleChange(r.id);
                        setMobileMenuOpen(false);
                      }}
                      style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0, 0, 0, 0.02)',
                        border: isSelected ? '1px solid #16A34A' : '1px solid rgba(0, 0, 0, 0.05)',
                        color: isSelected ? '#15803D' : '#334155',
                        fontSize: '0.78rem',
                        fontWeight: isSelected ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentRole={currentRole}
        onRoleChange={onRoleChange}
      />

      <style jsx global>{`
        @media (max-width: 1023px) {
          .nav-desktop-only {
            display: none !important;
          }
          .nav-mobile-only {
            display: flex !important;
          }
        }
        @media (min-width: 1024px) {
          .nav-desktop-only {
            display: flex !important;
          }
          .nav-mobile-only {
            display: none !important;
          }
        }
        @media (max-width: 1359px) {
          .nav-brand-tagline {
            display: none !important;
          }
        }
        @media (min-width: 1360px) {
          .nav-brand-tagline {
            display: block !important;
          }
        }
        @media (min-width: 1024px) and (max-width: 1279px) {
          .nav-link-btn {
            padding: 5px 7px !important;
            font-size: 0.78rem !important;
          }
          .nav-control-btn {
            padding: 5px 7px !important;
            font-size: 0.76rem !important;
          }
          .nav-brand-title {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </>
  );
};
