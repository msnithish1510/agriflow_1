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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={22} color="#38bdf8" /> Multi-Farmer Pooling & Supply Matcher
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
            Automatic pooling of smallholder yields to fulfill bulk buyer requirements
          </p>
        </div>

        <button className="btn-emerald" onClick={runSampleMatch} disabled={matchingRunning} style={{ minHeight: '44px', padding: '10px 20px' }}>
          <Zap size={18} /> {matchingRunning ? 'Matching Nearby Farmers...' : 'Find Farmer Matches'}
        </button>
      </div>

      {matchedOrder ? (
        <div style={{ background: 'rgba(16, 185, 129, 0.06)', border: '1.5px solid #10b981', borderRadius: '14px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="badge-tag badge-rural">SUCCESSFULLY MATCHED</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', color: '#f8fafc' }}>
                Order Pool for {matchedOrder.matched_qty.toLocaleString('en-IN')} kg {matchedOrder.crop}
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>₹{matchedOrder.agreed_price}/kg</div>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8' }}>Match Compatibility: {matchedOrder.match_score}%</div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={18} color="#fbbf24" /> Pooled Participating Farmers / FPOs:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {matchedOrder.farmers.map((f: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px 16px', borderRadius: '10px', borderLeft: '4px solid #10b981', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{f.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>📍 {f.village} ({f.distance_km} km to buyer)</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>{f.qty.toLocaleString('en-IN')} kg</div>
                  <div style={{ fontSize: '0.85rem', color: '#34d399' }}>₹{f.price}/kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ padding: '36px 20px', textAlign: 'center', color: '#cbd5e1', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '14px', background: 'rgba(0,0,0,0.2)' }}>
          Click <strong>"Find Farmer Matches"</strong> to test combining multiple farmer yields for buyer orders.
        </div>
      )}
    </div>
  );
};
