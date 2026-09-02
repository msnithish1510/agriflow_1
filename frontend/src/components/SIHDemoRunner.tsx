"use client";

import React, { useState } from 'react';
import { Play, CheckCircle, Zap, ShieldCheck, Cpu, Truck, Volume2, ShoppingBag, Sprout } from 'lucide-react';

interface SIHDemoRunnerProps {
  onSelectScenario: (scenarioId: number) => void;
}

export const SIHDemoRunner: React.FC<SIHDemoRunnerProps> = ({ onSelectScenario }) => {
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [scenarioLogs, setScenarioLogs] = useState<string[]>([]);

  const scenarios = [
    {
      id: 1,
      title: "1. Demand-First Flow (Buyer 1000kg)",
      desc: "Buyer Demand → Supply Match → Multi-Farmer Pooling → Net Realization → Delivery Route → Order Tracking",
      badge: "RURAL DEMAND-FIRST",
      icon: ShoppingBag
    },
    {
      id: 2,
      title: "2. Supply-First Flow (Farmer Stock)",
      desc: "Farmer Stock (500kg Tomato @ ₹28) → Discovery → Buyer Matching → Proposed Direct Order",
      badge: "FARMER SUPPLY-FIRST",
      icon: Sprout
    },
    {
      id: 3,
      title: "3. Price Transparency Breakdown",
      desc: "Farmer Price + Handling + Transport + Wholesale Margin + Fee = Final Price (ESTIMATED vs ACTUAL tags)",
      badge: "PRICE TRANSPARENCY",
      icon: ShieldCheck
    },
    {
      id: 4,
      title: "4. Expected Demand Forecast",
      desc: "15-Day Demand Prediction Curve, 95% Confidence Bounds & Validation Evaluation Metrics",
      badge: "DEMAND FORECAST",
      icon: Cpu
    },
    {
      id: 5,
      title: "5. Multi-Farm Pickup Route",
      desc: "Pickup Waypoints Sequence, Vehicle Capacity (75%), Freight Cost (₹4,158)",
      badge: "DELIVERY ROUTE",
      icon: Truck
    },
    {
      id: 6,
      title: "6. Multilingual Voice Assistant",
      desc: "Voice Transcript → Extracted Crop Details → Pre-Submit Confirmation Modal (English + Tamil)",
      badge: "VOICE ASSISTANCE",
      icon: Volume2
    }
  ];

  const handleRunScenario = (sc: typeof scenarios[0]) => {
    setActiveScenario(sc.id);
    onSelectScenario(sc.id);

    if (sc.id === 1) {
      setScenarioLogs([
        "📍 [1/6] Bulk Buyer Posted Demand: 1,000 kg Tomato for tomorrow @ Coimbatore DC",
        "🌾 [2/6] Matching Engine found candidate pre-harvest declarations within radius",
        "👥 [3/6] Aggregated multi-farmer yield: Ramesh (600kg) + Suresh (400kg) = 1,000 kg total",
        "💰 [4/6] Calculated Net Realization: ₹25.75 / kg (85.8% direct farmer payout)",
        "🚚 [5/6] Computed optimal pickup waypoints sequence & freight cost",
        "✅ [6/6] Order #a0813237 Confirmed & Dispatched! Status: IN_TRANSIT"
      ]);
    } else if (sc.id === 2) {
      setScenarioLogs([
        "🌾 [1/4] Farmer Listed Available Stock: 500 kg Tomato @ ₹28 / kg",
        "💡 [2/4] Executing Supply-First Discovery across pending buyer demands",
        "📊 [3/4] Ranked 3 candidate buyer demands by score & transport distance",
        "✅ [4/4] Proposed order match created and broadcasted to farmer dashboard!"
      ]);
    } else if (sc.id === 3) {
      setScenarioLogs([
        "🛒 [1/3] Consumer selected farm fresh Tomatoes",
        "🔍 [2/3] Executing Transparent Price Breakdown Auditor...",
        "✅ [3/3] Price Stack: Farmer (₹24.00 ACTUAL) + Collection (₹1.00 EST) + Handling (₹1.50 EST) + Transport (₹2.00 EST) + Margin (₹1.92 EST) + Fee (₹0.36 ACTUAL) = Final ₹30.78 / kg"
      ]);
    } else if (sc.id === 4) {
      setScenarioLogs([
        "🤖 [1/3] Loading Demand Forecast Model...",
        "📈 [2/3] Predicted 15-day demand for Tomato @ Nashik: 28,500.0 kg",
        "✅ [3/3] Validation Split Evaluation: MAE 600.4 kg, RMSE 784.8 kg, MAPE 1.87%"
      ]);
    } else if (sc.id === 5) {
      setScenarioLogs([
        "🚚 [1/3] Optimizing Multi-Farm Pickup Route with vehicle capacity limits...",
        "📍 [2/3] Computed waypoints sequence: Depot -> Stop #1 (4000kg) -> Stop #2 (3500kg) -> Pune Dropoff",
        "✅ [3/3] Transit Metrics: Total 174.2 km, 4.98 hrs, 75.0% Vehicle Utilization, Total Freight ₹4,158.20"
      ]);
    } else if (sc.id === 6) {
      setScenarioLogs([
        "🎙️ [1/3] Received Spoken Transcript: 'I have 500 kg tomato available tomorrow at ₹28 per kg'",
        "🔍 [2/3] Extracted Entities: Crop=Tomato, Quantity=500kg, Date=Tomorrow, Price=₹28/kg",
        "✅ [3/3] Pre-Submit Confirmation Modal rendered! Farmer clicks Confirm & Submit."
      ]);
    }
  };

  return (
    <div className="glass-panel" style={{ marginBottom: '24px', border: '1.5px solid rgba(16,185,129,0.3)', background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(6,182,212,0.08))' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, padding: '4px 12px', borderRadius: '12px', background: '#10b981', color: '#fff' }}>
            SIH 2026 DEMO RUNNER
          </span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', color: '#f8fafc' }}>
            AGRIFlow Live Interactive Scenario Controller
          </h2>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
          One-Click Live End-to-End Interactive Scenario Triggers
        </span>
      </div>

      {/* 6 Scenario Trigger Buttons Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px', marginBottom: '16px' }}>
        {scenarios.map((sc) => {
          const Icon = sc.icon;
          const isActive = activeScenario === sc.id;
          return (
            <div
              key={sc.id}
              onClick={() => handleRunScenario(sc)}
              style={{
                background: isActive ? 'rgba(16,185,129,0.18)' : 'rgba(0,0,0,0.35)',
                padding: '16px',
                borderRadius: '12px',
                border: isActive ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: '10px', background: 'rgba(255,255,255,0.1)', color: '#38bdf8' }}>
                  {sc.badge}
                </span>
                <Play size={18} color={isActive ? "#10b981" : "#94a3b8"} />
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={18} color="#10b981" /> {sc.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>
                {sc.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Live Execution Logs Console */}
      {scenarioLogs.length > 0 && (
        <div style={{ background: '#090d16', padding: '16px', borderRadius: '12px', border: '1px solid #334155', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 700, color: '#10b981', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={16} /> Real-Time Scenario Execution Log Stream:
          </div>
          {scenarioLogs.map((log, idx) => (
            <div key={idx} style={{ color: log.includes('✅') ? '#34d399' : '#cbd5e1', marginBottom: '4px' }}>
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
