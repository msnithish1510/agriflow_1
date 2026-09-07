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
        top: '12px',
        zIndex: 100,
        margin: '0 auto 20px auto',
        maxWidth: '1360px',
        width: 'calc(100% - 24px)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div style={{
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          background: scrolled ? 'rgba(255, 255, 255, 0.92)' : 'rgba(255, 255, 255, 0.82)',
          border: '1px solid rgba(255, 255, 255, 0.95)',
          borderRadius: '24px',
          boxShadow: scrolled 
            ? '0 16px 36px -10px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(22, 163, 74, 0.05), inset 0 1px 1px #ffffff'
            : '0 10px 30px -8px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02), inset 0 1px 1px #ffffff',
          padding: '8px 16px 8px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          {/* 1. Brand Logo & Tagline */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              userSelect: 'none',
              flexShrink: 0
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.4)'
            }}>
              🌱
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '1.35rem',
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: '#17221C'
                }}>
                  AGRIFlow
                </span>
                <span style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  background: 'rgba(22, 163, 74, 0.1)',
                  color: '#15803D',
                  border: '1px solid rgba(22, 163, 74, 0.25)',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                  SIH26033
                </span>
              </div>
              <div style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 500, letterSpacing: '0.01em' }}>
                {t.common.tagline}
              </div>
            </div>
          </div>

          {/* 2. Desktop Navigation Links */}
          <nav style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }} className="hide-on-mobile">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'rgba(22, 163, 74, 0.10)' : 'transparent',
                    color: isActive ? '#15803D' : '#334155',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.9rem',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: isActive ? '1px solid rgba(22, 163, 74, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    whiteSpace: 'nowrap'
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

          {/* 3. Action Controls: Scope Toggle, 6-Lang Switcher, Persona, Auth */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            
            {/* Scope Mode Switch (Rural vs. Urban) */}
            <div 
              onClick={() => onModeToggle(!isUrbanMode)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                borderRadius: '12px',
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                cursor: 'pointer',
                userSelect: 'none',
                transition: 'all 0.2s ease'
              }}
              title="Toggle Pre-Harvest Scope"
              className="hide-on-mobile"
            >
              <span style={{ fontSize: '0.8rem' }}>{isUrbanMode ? '🏙️' : '🌾'}</span>
              <span style={{ 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                color: isUrbanMode ? '#0284C7' : '#15803D' 
              }}>
                {isUrbanMode ? 'Urban 150km' : 'Rural 50km'}
              </span>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => alert('🌾 Live Agricultural Alerts:\n• Tomato demand surge in Chennai (+28%)\n• 4 cold-chain trucks available in Erode\n• Minimum Price advisory updated for Salem')}
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
              title="Live Agricultural Notifications"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                background: '#EF4444',
                borderRadius: '50%',
                boxShadow: '0 0 4px #EF4444'
              }} />
            </button>

            {/* 6-LANGUAGE DROPDOWN SELECTOR */}
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
                  padding: '7px 12px',
                  borderRadius: '12px',
                  background: langDropdownOpen ? 'rgba(22, 163, 74, 0.1)' : 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  color: '#17221C',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
                aria-label="Select Language"
              >
                <Globe size={16} color="#16A34A" />
                <span>{currentLangObj.nativeName}</span>
                <ChevronDown size={14} style={{
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
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '210px',
                  boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: '#64748B', 
                    padding: '6px 10px',
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
                          padding: '9px 12px',
                          borderRadius: '10px',
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
                            fontSize: '0.9rem', 
                            fontWeight: isSelected ? 700 : 500,
                            color: isSelected ? '#15803D' : '#17221C'
                          }}>
                            {lang.nativeName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            {lang.label}
                          </div>
                        </div>
                        {isSelected && <Check size={16} color="#16A34A" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ROLE PERSONA SWITCHER */}
            <div style={{ position: 'relative' }} className="hide-on-mobile">
              <button
                onClick={() => {
                  setRoleDropdownOpen(!roleDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.85)',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  cursor: 'pointer',
                  color: '#17221C',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
                aria-label="Switch Persona"
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  background: `${currentRoleObj.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: currentRoleObj.color
                }}>
                  <CurrentRoleIcon size={14} />
                </div>
                <span>{currentRoleObj.label}</span>
                <ChevronDown size={14} style={{
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
                  borderRadius: '16px',
                  padding: '8px',
                  minWidth: '220px',
                  boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)',
                  zIndex: 200,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}>
                  <div style={{ 
                    fontSize: '0.72rem', 
                    fontWeight: 700, 
                    color: '#64748B', 
                    padding: '6px 10px',
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
                          gap: '10px',
                          padding: '9px 12px',
                          borderRadius: '10px',
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
                          width: '24px',
                          height: '24px',
                          borderRadius: '6px',
                          background: `${r.color}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: r.color
                        }}>
                          <RoleIcon size={14} />
                        </div>
                        <div style={{ flex: 1, fontSize: '0.88rem', fontWeight: isSelected ? 700 : 500, color: '#17221C' }}>
                          {r.label}
                        </div>
                        {isSelected && <Check size={16} color="#16A34A" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* USER / AUTH PROFILE BUTTON */}
            <button
              onClick={() => setAuthModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 14px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #16A34A 0%, #15803D 100%)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(22, 163, 74, 0.3)',
                userSelect: 'none'
              }}
              title="User Account & Login"
            >
              <User size={15} />
              <span className="hide-on-mobile">Login</span>
            </button>

            {/* MOBILE HAMBURGER BUTTON */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'rgba(255, 255, 255, 0.85)',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: '10px',
                padding: '8px',
                cursor: 'pointer',
                color: '#17221C',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              className="show-on-mobile"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {mobileMenuOpen && (
          <div style={{
            marginTop: '10px',
            background: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.9)',
            borderRadius: '20px',
            padding: '18px',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
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
                  color: isUrbanMode ? '#0284C7' : '#15803D'
                }}
              >
                <span>{isUrbanMode ? '🏙️' : '🌾'}</span>
                <span>{isUrbanMode ? 'Urban 150km' : 'Rural 50km'}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                      fontSize: '0.88rem',
                      padding: '12px',
                      borderRadius: '12px',
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
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748B', marginBottom: '8px' }}>
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
                        borderRadius: '10px',
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
        @media (max-width: 900px) {
          .hide-on-mobile {
            display: none !important;
          }
          .show-on-mobile {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};
