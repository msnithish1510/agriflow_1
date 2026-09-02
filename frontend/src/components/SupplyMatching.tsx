"use client";

import React, { useState } from 'react';
import { Layers, Users, Zap, CheckCircle } from 'lucide-react';

export const SupplyMatching: React.FC = () => {
  const [matchingRunning, setMatchingRunning] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<any>(null);

  const runSampleMatch = () => {
    setMatchingRunning(true);
    setTimeout(() => {
      setMatchedOrder({
        demand_id: 'dem-001',
        crop: 'Tomato',
        required_qty: 25000,
        matched_qty: 25000,
        agreed_price: 24.50,
        match_score: 96.4,
        farmers: [
          { name: 'Ramesh Patil (Farmer)', village: 'Pimpalgaon, Nashik', qty: 10000, price: 24.0, distance_km: 85.2 },
          { name: 'Suresh Deshmukh (Farmer)', village: 'Niphad, Nashik', qty: 10000, price: 24.5, distance_km: 91.0 },
          { name: 'Sahyadri Farmers Co. (FPO)', village: 'Mohadi, Nashik', qty: 5000, price: 25.0, distance_km: 78.4 }
        ]
      });
      setMatchingRunning(false);
    }, 600);
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#38bdf8" /> Pre-Market Multi-Farmer Aggregation Matcher
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Algorithmic pooling of smallholder yields to fulfill bulk buyer requirements</p>
        </div>

        <button className="btn-emerald" onClick={runSampleMatch} disabled={matchingRunning}>
          <Zap size={18} /> {matchingRunning ? 'Running Matching Engine...' : 'Run Aggregation Matcher'}
        </button>
      </div>

      {matchedOrder ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '12px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge-tag badge-rural">SUCCESSFULLY MATCHED</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
                Order Pool for 25,000 kg {matchedOrder.crop}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>₹{matchedOrder.agreed_price}/kg</div>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>AI Compatibility Score: {matchedOrder.match_score}%</div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="#f59e0b" /> Pooled Participating Farmers/FPOs:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {matchedOrder.farmers.map((f: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{f.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>📍 {f.village} ({f.distance_km} km to buyer)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>{f.qty.toLocaleString('en-IN')} kg</div>
                  <div style={{ fontSize: '0.8rem', color: '#34d399' }}>₹{f.price}/kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' }}>
          Click <strong>"Run Aggregation Matcher"</strong> to test spatial multi-farmer pooling for bulk buyer demands.
        </div>
      )}
    </div>
  );
};
