"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Tag, Users, CheckCircle2, Info } from 'lucide-react';
import { fetchUrbanBreakdownModel, fetchBuyerComparison } from '@/services/api';

export const PriceBreakdownWidget: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'urban' | 'buyer_comparison'>('urban');
  const [farmerPrice, setFarmerPrice] = useState(24.0);
  const [perishability, setPerishability] = useState('HIGH');
  const [distanceKm, setDistanceKm] = useState(50.0);
  const [isUrban, setIsUrban] = useState(true);

  const [urbanModel, setUrbanModel] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    fetchUrbanBreakdownModel(farmerPrice, perishability, distanceKm, isUrban).then(setUrbanModel);
    fetchBuyerComparison(farmerPrice).then(setComparisonData);
  }, [farmerPrice, perishability, distanceKm, isUrban]);

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} color="#f59e0b" /> Urban Price Transparency & Buyer Comparison
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Audited price breakdown with explicit Estimated vs Actual cost labels
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('urban')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'urban' ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Urban Transparency
          </button>
          <button
            onClick={() => setActiveTab('buyer_comparison')}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'buyer_comparison' ? '#10b981' : 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer'
            }}
          >
            Buyer Offers Matrix
          </button>
        </div>
      </div>

      {activeTab === 'urban' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Farmer Price (₹/kg)</label>
              <input
                type="number"
                value={farmerPrice}
                onChange={(e) => setFarmerPrice(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#10b981', fontWeight: 700, border: '1px solid #334155' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Crop Perishability</label>
              <select
                value={perishability}
                onChange={(e) => setPerishability(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}
              >
                <option value="HIGH">HIGH (e.g. Tomato)</option>
                <option value="MEDIUM">MEDIUM (e.g. Onion)</option>
                <option value="LOW">LOW (e.g. Wheat)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Transport Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}
              />
            </div>
          </div>

          {urbanModel && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Final Consumer Price:</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>₹{urbanModel.final_consumer_price_per_kg}/kg</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Farmer Payout:</span>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{urbanModel.farmer_price_per_kg}/kg</div>
                </div>
              </div>

              {/* Itemized Cost Breakdown List with ESTIMATED vs ACTUAL Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(urbanModel.breakdown_items || []).map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '10px 14px', borderRadius: '8px', borderLeft: item.type === 'ACTUAL' ? '3px solid #10b981' : '3px solid #f59e0b' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.component}
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: item.type === 'ACTUAL' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                          color: item.type === 'ACTUAL' ? '#34d399' : '#fbbf24',
                          border: item.type === 'ACTUAL' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(245,158,11,0.4)'
                        }}>
                          {item.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{item.description}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>
                      ₹{item.amount.toFixed(2)}/kg
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'buyer_comparison' && comparisonData && (
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} /> Competing Buyer Procurement Offers Matrix
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(comparisonData.comparison_matrix || []).map((b: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '8px', borderLeft: idx === 0 ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    {b.buyer_name} {idx === 0 && <span style={{ color: '#10b981', fontSize: '0.75rem' }}>(RECOMMENDED BEST PAYOUT)</span>}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Offered Price: <strong>₹{b.offered_price_per_kg}/kg</strong> | Distance: {b.distance_km} km
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>
                    Net ₹{b.estimated_net_realization_per_kg}/kg
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#38bdf8' }}>{b.net_percentage}% Payout</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
