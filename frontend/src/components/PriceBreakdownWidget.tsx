"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Tag, Users, CheckCircle2, Info, HelpCircle } from 'lucide-react';
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
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={22} color="#fbbf24" /> Suggested Price Range & Buyer Offers
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
            Transparent price breakdown showing direct farmer payout vs handling costs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('urban')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'urban' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              minHeight: '40px'
            }}
          >
            Price Breakdown
          </button>
          <button
            onClick={() => setActiveTab('buyer_comparison')}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'buyer_comparison' ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              minHeight: '40px'
            }}
          >
            Buyer Offers Matrix
          </button>
        </div>
      </div>

      {/* Advisory Guidance Notice */}
      <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 16px', borderRadius: '12px', fontSize: '0.88rem', color: '#fbbf24', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Info size={20} style={{ flexShrink: 0 }} />
        <span>
          <strong>Suggested Price Range:</strong> Based on available market, demand and crop information. The farmer and buyer decide the final price.
        </span>
      </div>

      {activeTab === 'urban' && (
        <>
          {/* Quick Input Controls */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Your Expected Price (₹/kg)
              </label>
              <input
                type="number"
                value={farmerPrice}
                onChange={(e) => setFarmerPrice(parseFloat(e.target.value) || 0)}
                className="input-large"
                style={{ color: '#10b981', fontWeight: 800 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Crop Type / Perishability
              </label>
              <select
                value={perishability}
                onChange={(e) => setPerishability(e.target.value)}
                className="input-large"
              >
                <option value="HIGH">Perishable (e.g. Tomato)</option>
                <option value="MEDIUM">Semi-Perishable (e.g. Onion, Potato)</option>
                <option value="LOW">Grain / Non-Perishable (e.g. Wheat)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Distance to Market (km)
              </label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="input-large"
              />
            </div>
          </div>

          {urbanModel && (
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Direct Farmer Realization:</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>₹{urbanModel.farmer_price_per_kg}/kg</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Final Estimated Buyer/Consumer Price:</span>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>₹{urbanModel.final_consumer_price_per_kg}/kg</div>
                </div>
              </div>

              {/* Itemized Cost Breakdown List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(urbanModel.breakdown_items || []).map((item: any, idx: number) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '12px 16px', borderRadius: '10px', borderLeft: item.type === 'ACTUAL' ? '4px solid #10b981' : '4px solid #f59e0b' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {item.component}
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: item.type === 'ACTUAL' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                          color: item.type === 'ACTUAL' ? '#34d399' : '#fbbf24',
                          border: item.type === 'ACTUAL' ? '1px solid rgba(16,185,129,0.4)' : '1px solid rgba(245,158,11,0.4)'
                        }}>
                          {item.type}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>{item.description}</div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1.05rem' }}>
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
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} /> Competing Buyer Procurement Offers Matrix
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(comparisonData.comparison_matrix || []).map((b: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '14px 18px', borderRadius: '10px', borderLeft: idx === 0 ? '5px solid #10b981' : '1px solid rgba(255,255,255,0.1)', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#f8fafc' }}>
                    {b.buyer_name} {idx === 0 && <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 800 }}>★ BEST PAYOUT</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    Offered Price: <strong>₹{b.offered_price_per_kg}/kg</strong> | Distance: {b.distance_km} km
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                    Net ₹{b.estimated_net_realization_per_kg}/kg
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 600 }}>{b.net_percentage}% Direct Payout</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
