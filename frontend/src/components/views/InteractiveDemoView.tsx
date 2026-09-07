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
      color: "#10b981",
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
      color: "#38bdf8",
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
      color: "#fbbf24",
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
      color: "#c084fc",
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
        setLogs(prev => [...prev, `[Step ${step + 1}/${currentScenario.steps.length}] ${s.label} — ${s.desc}`]);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 900);
  };

  const handleNextStep = () => {
    if (currentStepIndex < currentScenario.steps.length) {
      const nextIdx = currentStepIndex;
      const s = currentScenario.steps[nextIdx];
      setCurrentStepIndex(nextIdx + 1);
      setLogs(prev => [...prev, `[Step ${nextIdx + 1}/${currentScenario.steps.length}] ${s.label} — ${s.desc}`]);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsSimulating(false);
    setLogs([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(6,182,212,0.14) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag badge-rural">
                <Sparkles size={14} /> JUDGE-READY DEMO RUNNER
              </span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Smart India Hackathon 2026</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.demo.title}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
              {t.demo.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-emerald" 
              onClick={handleRunFullSimulation}
              disabled={isSimulating}
              style={{ minHeight: '44px', padding: '10px 22px' }}
            >
              <Play size={18} />
              {isSimulating ? t.demo.runningText : t.demo.runButton}
            </button>
            <button 
              className="btn-secondary" 
              onClick={handleReset}
              disabled={isSimulating}
              style={{ minHeight: '44px', padding: '10px 16px' }}
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
        {scenarios.map(sc => {
          const Icon = sc.icon;
          const isSelected = activeScenarioId === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleSelectScenario(sc.id)}
              className="action-card"
              style={{
                borderLeft: isSelected ? `5px solid ${sc.color}` : '1px solid rgba(255,255,255,0.1)',
                background: isSelected ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
                boxShadow: isSelected ? '0 8px 24px rgba(0,0,0,0.4)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge-tag" style={{ background: `${sc.color}22`, color: sc.color, border: `1px solid ${sc.color}44` }}>
                    {sc.badge}
                  </span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={16} color={sc.color} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                  {sc.title}
                </h3>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {sc.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Scenario Flow Visualizer */}
      <div className="glass-panel" style={{ border: `1.5px solid ${currentScenario.color}44` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CurrentIcon size={24} color={currentScenario.color} />
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
                {currentScenario.title}
              </h2>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '4px' }}>
              {currentScenario.desc}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              className="btn-emerald" 
              onClick={handleNextStep}
              disabled={isSimulating || currentStepIndex >= currentScenario.steps.length}
              style={{ padding: '8px 18px', fontSize: '0.88rem', minHeight: '40px' }}
            >
              <span>{t.demo.nextStepBtn}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Step Progression Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {currentScenario.steps.map((step, idx) => {
            const isCompleted = currentStepIndex > idx;
            const isCurrent = currentStepIndex === idx + 1;
            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  background: isCurrent 
                    ? `${currentScenario.color}18` 
                    : isCompleted 
                    ? 'rgba(255,255,255,0.03)' 
                    : 'rgba(255,255,255,0.01)',
                  border: isCurrent 
                    ? `1px solid ${currentScenario.color}` 
                    : '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: isCompleted ? '#10b981' : isCurrent ? currentScenario.color : '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  {isCompleted ? <Check size={16} /> : idx + 1}
                </div>
                <div>
                  <div style={{
                    fontWeight: 700,
                    fontSize: '0.96rem',
                    color: isCurrent ? '#ffffff' : isCompleted ? '#34d399' : '#cbd5e1'
                  }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: isCurrent ? '#e2e8f0' : '#94a3b8', marginTop: '2px' }}>
                    {step.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Simulation Execution Logs */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.45)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🖥️ {t.demo.simulationLogs}
            </span>
            {currentStepIndex >= currentScenario.steps.length && (
              <span className="badge-tag badge-completed">
                {t.demo.completedBadge}
              </span>
            )}
          </div>

          {logs.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontFamily: 'monospace', fontSize: '0.84rem' }}>
              {logs.map((log, i) => (
                <div key={i} style={{ color: i === logs.length - 1 ? '#34d399' : '#cbd5e1' }}>
                  {log}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
              Click <strong>"{t.demo.runButton}"</strong> or <strong>"{t.demo.nextStepBtn}"</strong> above to begin this interactive scenario.
            </div>
          )}
        </div>
      </div>

      {/* Auxiliary interactive widget for Scenario 3 or 4 */}
      {activeScenarioId === 3 && (
        <PriceBreakdownWidget />
      )}

      {activeScenarioId === 4 && (
        <VoiceAssistantWidget />
      )}

    </div>
  );
};
