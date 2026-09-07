"use client";

import React, { useState } from 'react';
import { Modal } from './Modal';
import { UserRole } from '@/types';
import { Sprout, Lock, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2, User, KeyRound } from 'lucide-react';
import { useLanguage } from '@/i18n';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

type AuthMode = 'login' | 'register' | 'otp' | 'forgot' | 'role_select';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onRoleChange
}) => {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>('login');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);
    // auto advance
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      setSuccessMessage('Logged in successfully! Welcome back.');
      setTimeout(() => {
        setSuccessMessage(null);
        onRoleChange(selectedRole);
        onClose();
      }, 1200);
    } else if (mode === 'register') {
      setMode('otp');
    } else if (mode === 'otp') {
      setSuccessMessage('Verification confirmed! Account activated.');
      setTimeout(() => {
        setSuccessMessage(null);
        onRoleChange(selectedRole);
        onClose();
      }, 1200);
    } else if (mode === 'forgot') {
      setSuccessMessage('Password reset link sent to your phone/email!');
      setTimeout(() => {
        setSuccessMessage(null);
        setMode('login');
      }, 1500);
    } else if (mode === 'role_select') {
      onRoleChange(selectedRole);
      onClose();
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back 👋';
      case 'register': return 'Create AGRIFlow Account 🌱';
      case 'otp': return 'Verify Mobile / OTP 📲';
      case 'forgot': return 'Reset Password 🔑';
      case 'role_select': return 'Switch Ecosystem Persona 👥';
    }
  };

  const roleOptions: { id: UserRole; label: string; icon: string; desc: string }[] = [
    { id: 'FARMER', label: t.common.roles.FARMER, icon: '🌾', desc: 'Post supplies, get price guidance & buyer contracts' },
    { id: 'BULK_BUYER', label: t.common.roles.BULK_BUYER, icon: '🏢', desc: 'Direct farm sourcing for retail chains & food processors' },
    { id: 'CONSUMER', label: t.common.roles.CONSUMER, icon: '🥗', desc: 'Transparent farm-to-door fresh produce purchasing' },
    { id: 'LOGISTICS_PARTNER', label: t.common.roles.LOGISTICS_PARTNER, icon: '🚚', desc: 'Route fulfillment, cold transit & farm pickups' },
    { id: 'FPO', label: t.common.roles.FPO, icon: '🤝', desc: 'Cluster aggregation & farmer group representation' },
    { id: 'ADMIN', label: t.common.roles.ADMIN, icon: '🛡️', desc: 'System governance, fraud prevention & audits' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={getTitle()} maxWidth="520px">
      {successMessage ? (
        <div style={{
          textAlign: 'center',
          padding: '36px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(22, 163, 74, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#16A34A',
            border: '2px solid #16A34A'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
            {successMessage}
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
            Synchronizing your agricultural workspace...
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Logo brand pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 16px',
            background: 'rgba(22, 163, 74, 0.07)',
            borderRadius: '12px',
            border: '1px solid rgba(22, 163, 74, 0.18)'
          }}>
            <span style={{ fontSize: '1.3rem' }}>🌱</span>
            <div style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 600 }}>
              AGRIFlow Agricultural Coordination Network
            </div>
          </div>

          {/* Form Content Based on Mode */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* LOGIN MODE */}
            {mode === 'login' && (
              <>
                <div>
                  <label className="input-label">Mobile Number or Email</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input-large"
                      placeholder="e.g. 9876543210 or farmer@agriflow.in"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label className="input-label" style={{ margin: 0 }}>Password</label>
                    <button 
                      type="button" 
                      onClick={() => setMode('forgot')}
                      style={{ background: 'none', border: 'none', color: '#16A34A', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Forgot?
                    </button>
                  </div>
                  <input
                    type="password"
                    className="input-large"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Operating Persona</label>
                  <select
                    className="input-large"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  >
                    {roleOptions.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.icon} {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-emerald" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Login to AGRIFlow</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748B', marginTop: '6px' }}>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Create Account
                  </button>
                </div>
              </>
            )}

            {/* REGISTER MODE */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="input-label">Full Name / Farm or Business Name</label>
                  <input
                    type="text"
                    className="input-large"
                    placeholder="e.g. Murugan Selvam / Kaveri Organic FPO"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="input-large"
                    placeholder="10-digit mobile number"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="input-label">Role in Agricultural Supply Chain</label>
                  <select
                    className="input-large"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  >
                    {roleOptions.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.icon} {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="btn-emerald" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Send Verification Code (OTP)</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', fontSize: '0.88rem', color: '#64748B', marginTop: '6px' }}>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Login here
                  </button>
                </div>
              </>
            )}

            {/* OTP VERIFICATION MODE */}
            {mode === 'otp' && (
              <>
                <p style={{ fontSize: '0.9rem', color: '#64748B', textAlign: 'center' }}>
                  Enter the 6-digit verification code sent to your registered mobile number:
                </p>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '10px 0' }}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      style={{
                        width: '44px',
                        height: '52px',
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontWeight: 800,
                        borderRadius: '12px',
                        border: '1.5px solid rgba(0,0,0,0.15)',
                        background: '#ffffff',
                        color: '#17221C'
                      }}
                    />
                  ))}
                </div>

                <button type="submit" className="btn-emerald" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Confirm & Activate Account</span>
                  <CheckCircle2 size={18} />
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  >
                    ← Back to Login
                  </button>
                  <button
                    type="button"
                    onClick={() => alert('New OTP sent via SMS!')}
                    style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Resend Code
                  </button>
                </div>
              </>
            )}

            {/* FORGOT PASSWORD MODE */}
            {mode === 'forgot' && (
              <>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Enter your registered phone or email to receive an instant login link or temporary password:
                </p>

                <div>
                  <label className="input-label">Mobile Number or Email</label>
                  <input
                    type="text"
                    className="input-large"
                    placeholder="e.g. 9876543210"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn-emerald" style={{ width: '100%', marginTop: '6px' }}>
                  <span>Send Reset Instructions</span>
                  <ArrowRight size={18} />
                </button>

                <div style={{ textAlign: 'center', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                  >
                    ← Back to Login
                  </button>
                </div>
              </>
            )}

            {/* ROLE SWITCHING ONLY MODE */}
            {mode === 'role_select' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p style={{ fontSize: '0.88rem', color: '#64748B' }}>
                  Select the persona you want to simulate or operate under in the platform:
                </p>
                {roleOptions.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setSelectedRole(r.id);
                      onRoleChange(r.id);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      background: selectedRole === r.id ? 'rgba(22, 163, 74, 0.08)' : 'rgba(255, 255, 255, 0.7)',
                      border: `1.5px solid ${selectedRole === r.id ? '#16A34A' : 'rgba(0,0,0,0.06)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.6rem' }}>{r.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.98rem' }}>{r.label}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{r.desc}</div>
                    </div>
                    {selectedRole === r.id && (
                      <CheckCircle2 size={20} color="#16A34A" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      )}
    </Modal>
  );
};
