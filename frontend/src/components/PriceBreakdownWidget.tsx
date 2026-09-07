"use client";

import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight, Tag, Users, CheckCircle2, Info, HelpCircle, Sparkles } from 'lucide-react';
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
    <div className="glass-card-primary">
      {/* Header & Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#17221C', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator size={20} color="#D97706" />
            </div>
            <span>Suggested Price Range & Buyer Offers</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '3px' }}>
            Transparent price breakdown showing direct farmer payout vs handling costs
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('urban')}
            style={{
              padding: '8px 18px',
              borderRadius: '11px',
              border: activeTab === 'urban' ? '1px solid rgba(22, 163, 74, 0.35)' : '1px solid rgba(0,0,0,0.06)',
              background: activeTab === 'urban' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0,0,0,0.03)',
              color: activeTab === 'urban' ? '#15803D' : '#64748B',
              fontWeight: 800,
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
              padding: '8px 18px',
              borderRadius: '11px',
              border: activeTab === 'buyer_comparison' ? '1px solid rgba(22, 163, 74, 0.35)' : '1px solid rgba(0,0,0,0.06)',
              background: activeTab === 'buyer_comparison' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0,0,0,0.03)',
              color: activeTab === 'buyer_comparison' ? '#15803D' : '#64748B',
              fontWeight: 800,
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
      <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '14px 18px', borderRadius: '14px', fontSize: '0.88rem', color: '#B45309', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Info size={20} style={{ flexShrink: 0, color: '#D97706' }} />
        <span>
          <strong>Suggested Price Range:</strong> Based on available market, demand and crop information. The farmer and buyer decide the final price.
        </span>
      </div>

      {activeTab === 'urban' && urbanModel && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Top Realization Metric Banner */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderRadius: '14px',
            background: 'rgba(22, 163, 74, 0.08)',
            border: '1px solid rgba(22, 163, 74, 0.25)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Farmer Direct Realization</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803D' }}>
                ₹{farmerPrice.toFixed(2)} / kg
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Fair Consumer Price</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C' }}>
                ₹{urbanModel.final_consumer_price_per_kg?.toFixed(2)} / kg
              </div>
            </div>
          </div>

          {/* Breakdown Items List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {urbanModel.breakdown_items?.map((item: any, idx: number) => (
              <div key={idx} className="surface-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.2rem' }}>
                    {idx === 0 ? '🌾' : idx === 1 ? '📦' : idx === 2 ? '🚚' : idx === 3 ? '🏢' : '🏪'}
                  </span>
                  <div>
                    <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{item.component}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B' }}>{item.recipient}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: idx === 0 ? '#15803D' : '#17221C', fontSize: '1rem' }}>
                    ₹{item.amount?.toFixed(2)}
                  </div>
                  <span className="badge-tag" style={{ fontSize: '0.7rem', padding: '2px 6px' }}>
                    {item.is_estimated ? 'ESTIMATED' : 'ACTUAL'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'buyer_comparison' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { buyer: 'Reliance Fresh Supermarket', offer: '₹26.50/kg', terms: 'Cold Reefer Pickup at Farm Gate', diff: '+₹2.50' },
            { buyer: 'Kaveri District FPO Pool', offer: '₹25.00/kg', terms: 'Aggregated Local Dispatch', diff: '+₹1.00' },
            { buyer: 'Local Traditional Mandi Broker', offer: '₹19.50/kg', terms: 'Requires farmer to pay transport & 8% commission', diff: '-₹4.50' }
          ].map((item, idx) => (
            <div key={idx} className="surface-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px' }}>
              <div>
                <div style={{ fontWeight: 800, color: '#17221C', fontSize: '0.95rem' }}>{item.buyer}</div>
                <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '2px' }}>{item.terms}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 900, color: item.diff.startsWith('+') ? '#15803D' : '#E11D48' }}>
                  {item.offer}
                </div>
                <div style={{ fontSize: '0.78rem', color: item.diff.startsWith('+') ? '#15803D' : '#E11D48', fontWeight: 700 }}>
                  {item.diff} vs target floor
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
