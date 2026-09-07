"use client";

import React from 'react';
import { useLanguage } from '@/i18n';
import { 
  Sprout, TrendingUp, ShieldCheck, Truck, Users, ArrowRight, CheckCircle2, 
  Cpu, Activity, Zap, ShoppingBag, DollarSign, Calendar, MapPin, ChevronRight, HelpCircle 
} from 'lucide-react';
import { UserRole } from '@/types';

interface HomeViewProps {
  onNavigate: (view: string) => void;
  onRoleSelect: (role: UserRole) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate, onRoleSelect }) => {
  const { t, language } = useLanguage();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '56px' }}>
      
      {/* ==================================================== */}
      {/* 1. HERO SECTION */}
      {/* ==================================================== */}
      <section style={{
        position: 'relative',
        padding: '36px 0 24px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px'
      }}>
        {/* Hackathon Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.84rem',
          fontWeight: 700
        }}>
          <span>🌾</span>
          <span>{t.home.heroBadge}</span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontSize: 'clamp(2rem, 5vw, 3.4rem)',
          fontWeight: 800,
          maxWidth: '900px',
          letterSpacing: '-0.03em',
          lineHeight: 1.18
        }}>
          {t.home.heroTitle}{' '}
          <span style={{
            background: 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t.home.heroHighlight}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: '#cbd5e1',
          maxWidth: '720px',
          lineHeight: 1.6
        }}>
          {t.home.heroSubtitle}
        </p>

        {/* Call-to-Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '14px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: '10px'
        }}>
          <button
            className="btn-emerald"
            onClick={() => {
              onRoleSelect('FARMER');
              onNavigate('dashboard');
            }}
            style={{ fontSize: '1.05rem', padding: '14px 28px' }}
          >
            <Sprout size={20} />
            {t.home.getStartedBtn}
          </button>

          <button
            className="btn-secondary"
            onClick={() => onNavigate('demo')}
            style={{ fontSize: '1.05rem', padding: '14px 24px' }}
          >
            <Zap size={20} color="#fbbf24" />
            {t.home.exploreDemoBtn}
          </button>

          <button
            className="btn-outline"
            onClick={() => onNavigate('market-pulse')}
            style={{ fontSize: '1.05rem', padding: '14px 22px' }}
          >
            <Activity size={20} />
            {t.home.marketPulseBtn}
          </button>
        </div>

        {/* 4 Impact Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          width: '100%',
          marginTop: '28px'
        }}>
          <div className="glass-panel" style={{ borderTop: '4px solid #10b981', textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#10b981' }}>
              {t.home.keyMetrics.farmerShare}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
              {t.home.keyMetrics.farmerShareLabel}
            </div>
          </div>

          <div className="glass-panel" style={{ borderTop: '4px solid #38bdf8', textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38bdf8' }}>
              {t.home.keyMetrics.zeroMiddlemen}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
              {t.home.keyMetrics.zeroMiddlemenLabel}
            </div>
          </div>

          <div className="glass-panel" style={{ borderTop: '4px solid #fbbf24', textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#fbbf24' }}>
              {t.home.keyMetrics.priceStack}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
              {t.home.keyMetrics.priceStackLabel}
            </div>
          </div>

          <div className="glass-panel" style={{ borderTop: '4px solid #a855f7', textAlign: 'center', padding: '20px 16px' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#c084fc' }}>
              {t.home.keyMetrics.spoilageCut}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px', fontWeight: 600 }}>
              {t.home.keyMetrics.spoilageCutLabel}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 2. RURAL VS. URBAN MODEL COMPARISON */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.home.modelsSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '6px' }}>
            {t.home.modelsSection.title}
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '680px', margin: '8px auto 0 auto' }}>
            {t.home.modelsSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Rural Model Card */}
          <div className="glass-panel" style={{ border: '1.5px solid rgba(16, 185, 129, 0.4)', background: 'linear-gradient(180deg, rgba(16,185,129,0.08) 0%, rgba(18,27,43,0.9) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span className="badge-tag badge-rural">🌾 50 km RADIUS</span>
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>ZERO UNNECESSARY CUTS</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              {t.home.modelsSection.ruralTitle}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
              {t.home.modelsSection.ruralSubtitle}
            </p>

            {/* Visual Step Chain */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 800 }}>1</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{t.home.modelsSection.ruralStep1}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{t.home.modelsSection.ruralStep1Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '12px 16px', borderRadius: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontWeight: 800 }}>2</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{t.home.modelsSection.ruralStep2}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{t.home.modelsSection.ruralStep2Desc}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16,185,129,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid #10b981' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontWeight: 800 }}>3</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#ffffff' }}>{t.home.modelsSection.ruralStep3}</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{t.home.modelsSection.ruralStep3Desc}</div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(16,185,129,0.12)', borderRadius: '10px', fontSize: '0.85rem', color: '#34d399', fontWeight: 600 }}>
              ✓ {t.home.modelsSection.ruralBenefit}
            </div>
          </div>

          {/* Urban Model Card */}
          <div className="glass-panel" style={{ border: '1.5px solid rgba(6, 182, 212, 0.4)', background: 'linear-gradient(180deg, rgba(6,182,212,0.08) 0%, rgba(18,27,43,0.9) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <span className="badge-tag badge-urban">🏙️ 150 km RADIUS</span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 800 }}>PRICE STACK AUDIT</span>
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
              {t.home.modelsSection.urbanTitle}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginBottom: '24px' }}>
              {t.home.modelsSection.urbanSubtitle}
            </p>

            {/* Visual Step Chain */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#f8fafc' }}>1. {t.home.modelsSection.urbanStep1}</span>
                <span className="badge-tag badge-actual">₹25/kg (ACTUAL)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>2. {t.home.modelsSection.urbanStep2}</span>
                <span className="badge-tag badge-estimated">+₹3.50/kg (EST)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.04)', padding: '10px 14px', borderRadius: '10px' }}>
                <span style={{ fontSize: '0.88rem', color: '#cbd5e1' }}>3. {t.home.modelsSection.urbanStep3}</span>
                <span className="badge-tag badge-estimated">+₹5.00/kg (EST)</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(6,182,212,0.15)', padding: '12px 14px', borderRadius: '10px', border: '1px solid #06b6d4' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#ffffff' }}>4. {t.home.modelsSection.urbanStep4}</span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>= ₹42.00/kg</span>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(6,182,212,0.12)', borderRadius: '10px', fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
              ✓ {t.home.modelsSection.urbanBenefit}
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 3. HOW IT WORKS (4 STEPS) */}
      {/* ==================================================== */}
      <section style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '40px 24px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.home.howItWorksSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '6px' }}>
            {t.home.howItWorksSection.title}
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.home.howItWorksSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {[
            { num: '01', title: t.home.howItWorksSection.step1Title, desc: t.home.howItWorksSection.step1Desc, icon: Calendar, color: '#10b981' },
            { num: '02', title: t.home.howItWorksSection.step2Title, desc: t.home.howItWorksSection.step2Desc, icon: Users, color: '#38bdf8' },
            { num: '03', title: t.home.howItWorksSection.step3Title, desc: t.home.howItWorksSection.step3Desc, icon: ShieldCheck, color: '#fbbf24' },
            { num: '04', title: t.home.howItWorksSection.step4Title, desc: t.home.howItWorksSection.step4Desc, icon: Truck, color: '#c084fc' }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, opacity: 0.8 }}>{s.num}</span>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={20} color={s.color} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 4. TRADITIONAL MANDI VS AGRIFLOW COMPARISON */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.home.comparisonSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '6px' }}>
            {t.home.comparisonSection.title}
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.home.comparisonSection.subtitle}
          </p>
        </div>

        <div className="table-responsive glass-panel" style={{ padding: '8px' }}>
          <table className="table-modern">
            <thead>
              <tr>
                <th style={{ width: '22%' }}>{t.home.comparisonSection.headers.factor}</th>
                <th style={{ width: '39%', color: '#f87171' }}>⚠️ {t.home.comparisonSection.headers.traditional}</th>
                <th style={{ width: '39%', color: '#34d399' }}>✓ {t.home.comparisonSection.headers.agriflow}</th>
              </tr>
            </thead>
            <tbody>
              {t.home.comparisonSection.rows.map((row, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700, color: '#f8fafc' }}>{row.factor}</td>
                  <td style={{ color: '#cbd5e1', background: 'rgba(239, 68, 68, 0.03)' }}>{row.traditional}</td>
                  <td style={{ color: '#ffffff', background: 'rgba(16, 185, 129, 0.05)', fontWeight: 500 }}>{row.agriflow}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 5. AI-POWERED TECH HIGHLIGHTS */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.home.aiSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '6px' }}>
            {t.home.aiSection.title}
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '8px auto 0 auto' }}>
            {t.home.aiSection.subtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <TrendingUp size={22} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{t.home.aiSection.feature1Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>{t.home.aiSection.feature1Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #38bdf8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Users size={22} color="#38bdf8" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{t.home.aiSection.feature2Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>{t.home.aiSection.feature2Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #fbbf24' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Truck size={22} color="#fbbf24" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{t.home.aiSection.feature3Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>{t.home.aiSection.feature3Desc}</p>
          </div>

          <div className="glass-panel" style={{ borderLeft: '4px solid #a855f7' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <Cpu size={22} color="#c084fc" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{t.home.aiSection.feature4Title}</h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6 }}>{t.home.aiSection.feature4Desc}</p>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 6. STAKEHOLDER BENEFITS */}
      {/* ==================================================== */}
      <section>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {t.home.benefitsSection.tag}
          </span>
          <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, marginTop: '6px' }}>
            {t.home.benefitsSection.title}
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '8px auto 0 auto' }}>
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
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={22} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{t.home.benefitsSection.farmersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.farmersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={18} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bulk Buyers */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(6,182,212,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={22} color="#06b6d4" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{t.home.benefitsSection.buyersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.buyersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={18} color="#06b6d4" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Family Consumers */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#fbbf24" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>{t.home.benefitsSection.consumersTitle}</h3>
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {t.home.benefitsSection.consumersPoints.map((pt, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                  <CheckCircle2 size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ==================================================== */}
      {/* 7. FINAL CALL TO ACTION */}
      {/* ==================================================== */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(6,182,212,0.18) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        borderRadius: '24px',
        padding: '48px 24px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px'
      }}>
        <div style={{ fontSize: '2.5rem' }}>🌾🤝🏙️</div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, color: '#ffffff', maxWidth: '750px' }}>
          {t.home.finalCta.title}
        </h2>
        <p style={{ color: '#cbd5e1', maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {t.home.finalCta.subtitle}
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10px' }}>
          <button
            className="btn-emerald"
            onClick={() => {
              onRoleSelect('FARMER');
              onNavigate('dashboard');
            }}
            style={{ fontSize: '1.05rem', padding: '14px 28px' }}
          >
            <Sprout size={20} />
            {t.home.finalCta.farmerAction}
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              onRoleSelect('BULK_BUYER');
              onNavigate('dashboard');
            }}
            style={{ fontSize: '1.05rem', padding: '14px 24px' }}
          >
            <ShoppingBag size={20} />
            {t.home.finalCta.buyerAction}
          </button>
          <button
            className="btn-outline"
            onClick={() => onNavigate('demo')}
            style={{ fontSize: '1.05rem', padding: '14px 22px' }}
          >
            <Zap size={20} />
            {t.home.finalCta.demoAction}
          </button>
        </div>
      </section>

    </div>
  );
};
