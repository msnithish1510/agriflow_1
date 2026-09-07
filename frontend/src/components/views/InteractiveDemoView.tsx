"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/i18n';
import { 
  Play, CheckCircle2, Zap, ShieldCheck, Cpu, Truck, Volume2, 
  ShoppingBag, Sprout, ArrowRight, RotateCcw, Sparkles, Clock, Check 
} from 'lucide-react';
import { VoiceAssistantWidget } from '../VoiceAssistantWidget';
import { PriceBreakdownWidget } from '../PriceBreakdownWidget';

export const InteractiveDemoView: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeScenarioId, setActiveScenarioId] = useState<number>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  // Scenario Definitions
  const scenarios = [
    {
      id: 1,
      title: t.demo.scenario1Title,
      desc: t.demo.scenario1Desc,
      badge: "DEMAND-FIRST WORKFLOW",
      icon: ShoppingBag,
      color: "#16A34A",
      steps: [
        { label: "1. Buyer Posts Demand", desc: "Bulk Buyer posts 'Need 500 kg Tomato for Coimbatore DC @ ₹28/kg' with target delivery in 3 days." },
        { label: "2. AI Identifies Farmers", desc: "Matching Engine scans registered pre-harvest declarations within 50km radius and ranks candidate smallholders." },
        { label: "3. Farmer Receives Notification", desc: "Farmer Ramesh (300kg) and Farmer Suresh (200kg) receive automated SMS/app broadcast." },
        { label: "4. Farmer Confirms Supply", desc: "Both farmers accept procurement terms; guaranteed payout ₹25.50/kg locked in before harvest." },
        { label: "5. Pooled Match Created", desc: "Order #SIH-POOL-892 generated aggregating 500kg with 96.4% compatibility score." },
        { label: "6. Coordinated Pickup & Dispatch", desc: "Google OR-Tools VRPTW sequences shared pickup truck; transit scheduled; order marked IN_TRANSIT." },
        { label: "7. Order Completed", desc: "Delivery confirmed at DC with automated direct bank payout release. Zero distress sale!" }
      ]
    },
    {
      id: 2,
      title: t.demo.scenario2Title,
      desc: t.demo.scenario2Desc,
      badge: "UNSOLD STOCK DISCOVERY",
      icon: Sprout,
      color: "#0EA5E9",
      steps: [
        { label: "1. Farmer Declares Stock", desc: "Farmer Murugan harvests 300 kg Tomato with no advance buyer in local village." },
        { label: "2. AI Scans Regional Demand", desc: "AGRIFlow discovery agent queries institutional canteens and retail buyers within 60km." },
        { label: "3. Matching Buyer Located", desc: "Identifies Coimbatore Central Canteen seeking 300kg fresh produce tomorrow." },
        { label: "4. Direct Match Proposed", desc: "Fair payout of ₹24.00/kg proposed with zero middleman deductions." },
        { label: "5. Logistics Waypoint Added", desc: "Farmer Murugan's farm added as Stop #2 on an active nearby refrigerated route." },
        { label: "6. Stock Picked Up & Sold", desc: "Produce collected within 4 hours. Freshness preserved, 100% stock monetized!" }
      ]
    },
    {
      id: 3,
      title: t.demo.scenario3Title,
      desc: t.demo.scenario3Desc,
      badge: "PRICE TRANSPARENCY AUDIT",
      icon: ShieldCheck,
      color: "#F59E0B",
      steps: [
        { label: "1. Consumer Selects Produce", desc: "Urban household adds 25 kg organic Tomatoes to direct procurement cart." },
        { label: "2. Real-Time Price Stack Audit", desc: "System itemizes direct farmer price + handling + cold transit + retail distribution." },
        { label: "3. Transparency Verification", desc: "Consumer views clear ESTIMATED vs ACTUAL component breakdown and confirms order." }
      ]
    },
    {
      id: 4,
      title: t.demo.scenario4Title,
      desc: t.demo.scenario4Desc,
      badge: "MULTILINGUAL VOICE",
      icon: Volume2,
      color: "#8B5CF6",
      steps: [
        { label: "1. Farmer Speaks Details", desc: "Farmer taps microphone and speaks: 'நாளை 500 கிலோ தக்காளி அறுவடை உள்ளது, விலை 28 ரூபாய்'." },
        { label: "2. Entity Extraction Engine", desc: "AI extracts: Crop=Tomato, Quantity=500kg, Date=Tomorrow, TargetPrice=₹28." },
        { label: "3. Instant Confirmation Modal", desc: "Pre-filled review screen opens for farmer tap-confirmation without typing." }
      ]
    }
  ];

  const currentScenario = scenarios.find(s => s.id === activeScenarioId) || scenarios[0];
  const CurrentIcon = currentScenario.icon;

  const handleSelectScenario = (id: number) => {
    setActiveScenarioId(id);
    setCurrentStepIndex(0);
    setIsSimulating(false);
    setLogs([]);
  };

  const handleRunFullSimulation = () => {
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setLogs([]);

    let step = 0;
    const interval = setInterval(() => {
      if (step < currentScenario.steps.length) {
        const s = currentScenario.steps[step];
        setCurrentStepIndex(step + 1);
        setLogs(prev => [...prev, `[SIMULATION ${new Date().toLocaleTimeString()}] Stage ${step + 1}: ${s.label} -> Completed.`]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
        setLogs(prev => [...prev, `[SUCCESS] End-to-End simulation completed successfully with verified payouts.`]);
      }
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-tag badge-rural" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <Zap size={14} /> LIVE SIMULATION RUNNER
          </span>
          <span style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>
            ● SIH26033 Interactive Demonstration
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
          {t.demo.title}
        </h1>
        <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '750px', lineHeight: 1.6 }}>
          {t.demo.subtitle}
        </p>
      </div>

      {/* Scenario Selection Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {scenarios.map(s => {
          const isSelected = s.id === activeScenarioId;
          const SIcon = s.icon;
          return (
            <div
              key={s.id}
              onClick={() => handleSelectScenario(s.id)}
              className="glass-card-primary"
              style={{
                borderTop: `4px solid ${s.color}`,
                cursor: 'pointer',
                background: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.75)',
                boxShadow: isSelected ? `0 12px 28px -6px ${s.color}35` : '0 4px 12px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge-tag" style={{ background: `${s.color}15`, color: s.color, fontSize: '0.74rem' }}>
                  {s.badge}
                </span>
                <SIcon size={20} color={s.color} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C', marginBottom: '6px' }}>
                {s.title}
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Active Scenario Pipeline Runner */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: currentScenario.color, fontWeight: 800, textTransform: 'uppercase' }}>
              CURRENT SCENARIO #{currentScenario.id}
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#17221C' }}>
              {currentScenario.title}
            </h2>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn-emerald"
              onClick={handleRunFullSimulation}
              disabled={isSimulating}
              style={{ padding: '10px 22px', fontSize: '0.95rem' }}
            >
              <Play size={18} />
              <span>{isSimulating ? 'Simulating Pipeline...' : 'Run Auto Simulation'}</span>
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                setCurrentStepIndex(0);
                setLogs([]);
              }}
              style={{ padding: '10px 18px', fontSize: '0.95rem' }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Step Sequence Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
          {currentScenario.steps.map((st, i) => {
            const isDone = currentStepIndex > i;
            const isCurrent = currentStepIndex === i + 1;
            return (
              <div 
                key={i} 
                className="surface-card"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '16px',
                  border: isCurrent ? `1.5px solid ${currentScenario.color}` : '1px solid rgba(0,0,0,0.06)',
                  background: isCurrent ? `${currentScenario.color}08` : isDone ? 'rgba(22, 163, 74, 0.05)' : '#ffffff'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isDone ? '#16A34A' : isCurrent ? currentScenario.color : 'rgba(0,0,0,0.06)',
                  color: isDone || isCurrent ? '#ffffff' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  flexShrink: 0
                }}>
                  {isDone ? <Check size={18} /> : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#17221C', fontSize: '0.98rem' }}>{st.label}</div>
                  <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '4px', lineHeight: 1.5 }}>{st.desc}</div>
                </div>
                <span className="badge-tag" style={{
                  fontSize: '0.72rem',
                  background: isDone ? 'rgba(22, 163, 74, 0.12)' : isCurrent ? `${currentScenario.color}15` : 'rgba(0,0,0,0.04)',
                  color: isDone ? '#15803D' : isCurrent ? currentScenario.color : '#94A3B8'
                }}>
                  {isDone ? 'COMPLETED' : isCurrent ? 'EXECUTING' : 'PENDING'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Simulation Terminal Output */}
        <div>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#17221C', marginBottom: '8px' }}>
            Simulation Terminal Output:
          </h4>
          <div style={{
            background: '#0F172A',
            borderRadius: '14px',
            padding: '16px 20px',
            fontFamily: 'monospace',
            fontSize: '0.84rem',
            color: '#34D399',
            minHeight: '110px',
            maxHeight: '220px',
            overflowY: 'auto',
            lineHeight: 1.6
          }}>
            {logs.length === 0 ? (
              <span style={{ color: '#64748B' }}>
                &gt; Simulation runner ready. Click "Run Auto Simulation" to execute end-to-end workflow...
              </span>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
