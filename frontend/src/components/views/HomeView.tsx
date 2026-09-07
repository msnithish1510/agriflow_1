'use client';

import React from 'react';
import { useLanguage } from '@/i18n/LanguageContext';
import { UserRole } from '@/types';
import {
  Sprout,
  ShoppingBag,
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowRight,
  CheckCircle2,
  Cpu,
  BarChart3,
  DollarSign,
  Users,
  MapPin,
  Sparkles,
  Play,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'market-pulse' | 'price-transparency' | 'demo' | 'dashboard') => void;
  onRoleSelect: (role: UserRole) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onRoleSelect }) => {
  const { t } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px', paddingBottom: '60px' }}>
      
      {/* ==================================================== */}
      {/* 1. HERO SECTION WITH AMBIENT LIGHT BLOOMS & GLASS     */}
      {/* ==================================================== */}
      <section style={{
        textAlign: 'center',
        padding: '48px 16px 36px 16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Glow backdrop behind hero */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '700px',
          height: '350px',
          background: 'radial-gradient(ellipse at center, rgba(34, 197, 94, 0.15) 0%, rgba(14, 165, 233, 0.08) 45%, transparent 70%)',
          filter: 'blur(45px)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        {/* Hero Top Pill Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.1)',
          backdropFilter: 'blur(12px)',
          fontSize: '0.84rem',
          fontWeight: 700,
          color: '#15803D',
          marginBottom: '24px'
        }}>
          <Sparkles size={15} color="#16A34A" />
          <span>{t.home.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2.3rem, 5.5vw, 3.8rem)',
          fontWeight: 900,
          maxWidth: '960px',
          letterSpacing: '-0.035em',
          lineHeight: 1.15,
          color: '#17221C',
          marginBottom: '20px'
        }}>
          {t.home.heroTitle}{' '}
          <span style={{
            background: 'linear-gradient(135deg, #16A34A 0%, #0EA5E9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 2px 10px rgba(22, 163, 74, 0.12))'
          }}>
            {t.home.heroHighlight}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1.05rem, 2vw, 1.22rem)',
          color: '#334155',
          maxWidth: '760px',
          lineHeight: 1.65,
          fontWeight: 400,
          marginBottom: '32px'
        }}>
          {t.home.heroSubtitle}
        </p>

        {/* Call to Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '40px'
        }}>
          <button 
            className="btn-emerald"
            onClick={() => {
              onRoleSelect('FARMER');
              onNavigate('dashboard');
            }}
            style={{ padding: '14px 28px', fontSize: '1.05rem' }}
          >
            <Sprout size={18} />
            <span>{t.home.getStartedBtn}</span>
            <ArrowRight size={18} />
          </button>
          
          <button 
            className="btn-secondary"
            onClick={() => onNavigate('demo')}
            style={{ padding: '14px 24px', fontSize: '1.02rem' }}
          >
            <Play size={17} color="#16A34A" />
            <span>{t.home.exploreDemoBtn}</span>
          </button>

          <button 
            className="btn-outline"
            onClick={() => onNavigate('market-pulse')}
            style={{ padding: '14px 24px', fontSize: '1.02rem' }}
          >
            <BarChart3 size={17} />
            <span>{t.home.marketPulseBtn}</span>
          </button>
        </div>

        {/* Floating Glass Intelligence Preview Cards (Hero Graphic) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          width: '100%',
          maxWidth: '1040px',
          marginTop: '12px'
        }}>
          {/* Card 1: Expected Demand */}
          <div className="glass-card-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pre-Harvest Demand
              </span>
              <span className="badge-tag badge-matched" style={{ fontSize: '0.74rem' }}>
                +18% Peak Window
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C' }}>
              1,48,500 <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>kg</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Verified institutional demand for next 15 days across Nashik & Pune clusters.
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '78%', height: '100%', background: 'linear-gradient(90deg, #0EA5E9, #22C55E)', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Card 2: Supply Aggregation */}
          <div className="glass-card-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Available Supply Pool
              </span>
              <span className="badge-tag badge-completed" style={{ fontSize: '0.74rem' }}>
                Verified Smallholders
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C' }}>
              5.2 <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>Tonnes</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Aggregated farmer declarations ready for pre-harvest contract matching.
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '92%', height: '100%', background: 'linear-gradient(90deg, #16A34A, #34D399)', borderRadius: '9999px' }} />
            </div>
          </div>

          {/* Card 3: Direct Institutional Matching */}
          <div className="glass-card-floating" style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Smart Yield Contracts
              </span>
              <span className="badge-tag badge-confirmed" style={{ fontSize: '0.74rem' }}>
                AI Optimized
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C' }}>
              8 <span style={{ fontSize: '1rem', color: '#64748B', fontWeight: 500 }}>Buyers Linked</span>
            </div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Pre-agreed fair floor prices with 0% unrecorded commission fees.
            </div>
            <div style={{
              height: '6px',
              background: 'rgba(0, 0, 0, 0.06)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #8B5CF6, #0EA5E9)', borderRadius: '9999px' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. PLATFORM KEY METRICS SUMMARY                      */}
      {/* ==================================================== */}
      <section className="glass-panel" style={{ padding: '32px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#15803D' }}>
              {t.home.keyMetrics.farmerShare}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
              {t.home.keyMetrics.farmerShareLabel}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0EA5E9' }}>
              {t.home.keyMetrics.zeroMiddlemen}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
              {t.home.keyMetrics.zeroMiddlemenLabel}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#7C3AED' }}>
              {t.home.keyMetrics.priceStack}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
              {t.home.keyMetrics.priceStackLabel}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#E11D48' }}>
              {t.home.keyMetrics.spoilageCut}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#475569', fontWeight: 600, marginTop: '4px' }}>
              {t.home.keyMetrics.spoilageCutLabel}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. DUAL-ENGINE ARCHITECTURE (RURAL & URBAN)          */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#16A34A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.home.modelsSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#17221C', marginTop: '6px' }}>
            {t.home.modelsSection.title}
          </h2>
          <p style={{ color: '#64748B', maxWidth: '680px', margin: '8px auto 0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            {t.home.modelsSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Rural Direct Model */}
          <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderTop: '4px solid #16A34A'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge-tag badge-rural">Direct Farm-Gate</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#17221C', marginTop: '8px' }}>
                  {t.home.modelsSection.ruralTitle}
                </h3>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(22, 163, 74, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#16A34A'
              }}>
                <Sprout size={24} />
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
              {t.home.modelsSection.ruralSubtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', color: '#15803D', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.ruralStep1}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.ruralStep1Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', color: '#15803D', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.ruralStep2}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.ruralStep2Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(22, 163, 74, 0.15)', color: '#15803D', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.ruralStep3}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.ruralStep3Desc}</div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 'auto',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(22, 163, 74, 0.08)',
              border: '1px solid rgba(22, 163, 74, 0.2)',
              color: '#15803D',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}>
              ✨ {t.home.modelsSection.ruralBenefit}
            </div>
          </div>

          {/* Urban Transparent Supply Chain */}
          <div className="glass-panel" style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderTop: '4px solid #0EA5E9'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span className="badge-tag badge-urban">Cold-Chain Traceability</span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#17221C', marginTop: '8px' }}>
                  {t.home.modelsSection.urbanTitle}
                </h3>
              </div>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(14, 165, 233, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0EA5E9'
              }}>
                <Truck size={24} />
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6 }}>
              {t.home.modelsSection.urbanSubtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', color: '#0369A1', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.urbanStep1}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.urbanStep1Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', color: '#0369A1', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.urbanStep2}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.urbanStep2Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', color: '#0369A1', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>3</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.urbanStep3}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.urbanStep3Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.15)', color: '#0369A1', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>4</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{t.home.modelsSection.urbanStep4}</div>
                  <div style={{ color: '#64748B', fontSize: '0.84rem' }}>{t.home.modelsSection.urbanStep4Desc}</div>
                </div>
              </div>
            </div>

            <div style={{
              marginTop: 'auto',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'rgba(14, 165, 233, 0.08)',
              border: '1px solid rgba(14, 165, 233, 0.2)',
              color: '#0369A1',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}>
              🔍 {t.home.modelsSection.urbanBenefit}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. HOW IT WORKS: 4-STAGE FLOW PIPELINE              */}
      {/* ==================================================== */}
      <section id="how-it-works-section" className="glass-panel" style={{ padding: '40px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.home.howItWorksSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#17221C', marginTop: '6px' }}>
            {t.home.howItWorksSection.title}
          </h2>
          <p style={{ color: '#64748B', maxWidth: '640px', margin: '8px auto 0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            {t.home.howItWorksSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px'
        }}>
          {/* Step 1 */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(22, 163, 74, 0.12)',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sprout size={22} />
            </div>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#17221C' }}>
              {t.home.howItWorksSection.step1Title}
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
              {t.home.howItWorksSection.step1Desc}
            </p>
          </div>

          {/* Step 2 */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(14, 165, 233, 0.12)',
              color: '#0EA5E9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Cpu size={22} />
            </div>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#17221C' }}>
              {t.home.howItWorksSection.step2Title}
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
              {t.home.howItWorksSection.step2Desc}
            </p>
          </div>

          {/* Step 3 */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(245, 158, 11, 0.12)',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={22} />
            </div>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#17221C' }}>
              {t.home.howItWorksSection.step3Title}
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
              {t.home.howItWorksSection.step3Desc}
            </p>
          </div>

          {/* Step 4 */}
          <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(124, 58, 237, 0.12)',
              color: '#7C3AED',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={22} />
            </div>
            <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: '#17221C' }}>
              {t.home.howItWorksSection.step4Title}
            </h4>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.55 }}>
              {t.home.howItWorksSection.step4Desc}
            </p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. TRADITIONAL MANDI VS AGRIFLOW COMPARISON          */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E11D48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.home.comparisonSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#17221C', marginTop: '6px' }}>
            {t.home.comparisonSection.title}
          </h2>
          <p style={{ color: '#64748B', maxWidth: '660px', margin: '8px auto 0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            {t.home.comparisonSection.subtitle}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
          <div className="table-responsive">
            <table className="table-modern">
              <thead>
                <tr>
                  <th style={{ width: '24%' }}>{t.home.comparisonSection.headers.factor}</th>
                  <th style={{ width: '38%', color: '#E11D48' }}>{t.home.comparisonSection.headers.traditional}</th>
                  <th style={{ width: '38%', color: '#15803D' }}>{t.home.comparisonSection.headers.agriflow}</th>
                </tr>
              </thead>
              <tbody>
                {t.home.comparisonSection.rows.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 800, color: '#17221C' }}>{row.factor}</td>
                    <td style={{ color: '#64748B' }}>
                      <span style={{ color: '#EF4444', marginRight: '6px', fontWeight: 900 }}>✕</span>
                      {row.traditional}
                    </td>
                    <td style={{ color: '#15803D', fontWeight: 600 }}>
                      <span style={{ color: '#16A34A', marginRight: '6px', fontWeight: 900 }}>✓</span>
                      {row.agriflow}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. AI CAPABILITIES GRID                              */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.home.aiSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#17221C', marginTop: '6px' }}>
            {t.home.aiSection.title}
          </h2>
          <p style={{ color: '#64748B', maxWidth: '660px', margin: '8px auto 0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            {t.home.aiSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ borderLeft: '4px solid #16A34A' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <TrendingUp size={22} color="#16A34A" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>{t.home.aiSection.feature1Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>{t.home.aiSection.feature1Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #0EA5E9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Users size={22} color="#0EA5E9" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>{t.home.aiSection.feature2Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>{t.home.aiSection.feature2Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #F59E0B' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Truck size={22} color="#D97706" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>{t.home.aiSection.feature3Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>{t.home.aiSection.feature3Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #7C3AED' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Cpu size={22} color="#7C3AED" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>{t.home.aiSection.feature4Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6 }}>{t.home.aiSection.feature4Desc}</p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. STAKEHOLDER BENEFIT CARDS                         */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0EA5E9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.home.benefitsSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.7rem, 3.5vw, 2.3rem)', fontWeight: 900, color: '#17221C', marginTop: '6px' }}>
            {t.home.benefitsSection.title}
          </h2>
          <p style={{ color: '#64748B', maxWidth: '640px', margin: '8px auto 0 auto', fontSize: '1rem', lineHeight: 1.6 }}>
            {t.home.benefitsSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {/* Farmers */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(22, 163, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16A34A' }}>
                <Sprout size={22} />
              </div>
              <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#17221C' }}>{t.home.benefitsSection.farmersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.farmersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
                  <CheckCircle2 size={18} color="#16A34A" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bulk Buyers */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                <ShoppingBag size={22} />
              </div>
              <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#17221C' }}>{t.home.benefitsSection.buyersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.buyersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
                  <CheckCircle2 size={18} color="#0EA5E9" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Family Consumers */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.22rem', fontWeight: 800, color: '#17221C' }}>{t.home.benefitsSection.consumersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.consumersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#475569' }}>
                  <CheckCircle2 size={18} color="#D97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 8. PREVIEWS: MARKET PULSE & PRICE TRANSPARENCY       */}
      {/* ==================================================== */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '24px'
      }}>
        {/* Market Pulse Preview Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(14, 165, 233, 0.12)',
                color: '#0EA5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <BarChart3 size={20} />
              </div>
              <span className="badge-tag badge-matched">Real-Time Forecasts</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#17221C', marginBottom: '8px' }}>
              {t.nav.marketPulse}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
              AI-driven 15-day district demand curves, APMC arrival trends, and price advisories to guide planting and harvesting decisions.
            </p>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => onNavigate('market-pulse')}
            style={{ width: 'fit-content' }}
          >
            <span>Explore Market Pulse</span>
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Price Transparency Preview Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(22, 163, 74, 0.12)',
                color: '#16A34A',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <DollarSign size={20} />
              </div>
              <span className="badge-tag badge-urban">Farm-to-Consumer Waterfall</span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#17221C', marginBottom: '8px' }}>
              {t.nav.priceTransparency}
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', lineHeight: 1.6 }}>
              Inspect where every rupee goes. Audited 5-stage supply stack proving why farmers receive up to 93% direct realization under AGRIFlow.
            </p>
          </div>
          <button 
            className="btn-secondary"
            onClick={() => onNavigate('price-transparency')}
            style={{ width: 'fit-content' }}
          >
            <span>Explore Price Transparency</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 9. FINAL CALL-TO-ACTION BANNER                       */}
      {/* ==================================================== */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(14, 165, 233, 0.08) 100%), rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1.5px solid rgba(22, 163, 74, 0.3)',
        borderRadius: '24px',
        padding: '48px 32px',
        textAlign: 'center',
        boxShadow: '0 20px 40px -10px rgba(22, 163, 74, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #16A34A, #15803D)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.8rem',
          color: '#ffffff',
          boxShadow: '0 8px 20px rgba(22, 163, 74, 0.35)'
        }}>
          🌱
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#17221C', maxWidth: '780px' }}>
          {t.home.finalCta.title}
        </h2>
        <p style={{ fontSize: '1.05rem', color: '#475569', maxWidth: '640px', lineHeight: 1.6 }}>
          {t.home.finalCta.subtitle}
        </p>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '6px' }}>
          <button 
            className="btn-emerald"
            onClick={() => {
              onRoleSelect('FARMER');
              onNavigate('dashboard');
            }}
            style={{ padding: '14px 32px', fontSize: '1.05rem' }}
          >
            <Sprout size={18} />
            <span>{t.home.finalCta.farmerAction}</span>
            <ArrowRight size={18} />
          </button>
          <button 
            className="btn-secondary"
            onClick={() => {
              onRoleSelect('BULK_BUYER');
              onNavigate('dashboard');
            }}
            style={{ padding: '14px 26px', fontSize: '1rem' }}
          >
            <ShoppingBag size={18} />
            <span>{t.home.finalCta.buyerAction}</span>
          </button>
          <button 
            className="btn-outline"
            onClick={() => onNavigate('demo')}
            style={{ padding: '14px 26px', fontSize: '1rem' }}
          >
            <Play size={16} />
            <span>{t.home.finalCta.demoAction}</span>
          </button>
        </div>
      </section>

    </div>
  );
};
