"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { 
  TrendingUp, TrendingDown, Activity, AlertCircle, Sparkles, MapPin, 
  Calendar, Layers, ArrowUpRight, ArrowDownRight, CheckCircle2, Info 
} from 'lucide-react';
import { AIForecastPanel } from '../AIForecastPanel';

export const MarketPulseView: React.FC = () => {
  const { t, language } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [selectedDistrict, setSelectedDistrict] = useState('Nashik');

  const cropNamesByLang: Record<string, Record<string, string>> = {
    Tomato: { en: 'Tomato', ta: 'தக்காளி', hi: 'टमाटर', te: 'టమోటా', ml: 'തക്കാളി', kn: 'ಟೊಮೆಟೊ' },
    Onion: { en: 'Onion', ta: 'வெங்காயம்', hi: 'प्याज', te: 'ఉల్లిపాయ', ml: 'ഉള്ളി', kn: 'ಈರುಳ್ಳಿ' },
    Potato: { en: 'Potato', ta: 'உருளைக்கிழங்கு', hi: 'आलू', te: 'బంగాళాదుంప', ml: 'ഉരുളക്കിഴങ്ങ്', kn: 'ಆಲೂಗಡ್ಡೆ' },
    Wheat: { en: 'Wheat', ta: 'கோதுமை', hi: 'गेहूं', te: 'గోధుమలు', ml: 'ഗോതമ്പ്', kn: 'ಗೋಧಿ' },
    Moong: { en: 'Moong', ta: 'பயறு (Moong)', hi: 'मूंग दाल', te: 'పెసలు', ml: 'ചെറുപയർ', kn: 'ಹೆಸರುಕಾಳು' }
  };

  const trendingCrops = [
    { name: 'Tomato', category: 'Vegetable', demandIndex: 94, trend: 'UP', price: '₹28/kg', change: '+14%', status: 'HIGH_DEMAND' },
    { name: 'Onion', category: 'Vegetable', demandIndex: 82, trend: 'STABLE', price: '₹24/kg', change: '+2%', status: 'MODERATE_DEMAND' },
    { name: 'Potato', category: 'Tubers', demandIndex: 78, trend: 'STABLE', price: '₹19/kg', change: '-1%', status: 'MODERATE_DEMAND' },
    { name: 'Wheat', category: 'Grains', demandIndex: 88, trend: 'UP', price: '₹25/kg', change: '+6%', status: 'HIGH_DEMAND' },
    { name: 'Moong', category: 'Pulses', demandIndex: 91, trend: 'UP', price: '₹78/kg', change: '+9%', status: 'HIGH_DEMAND' }
  ];

  const regionalDemands = [
    { district: 'Nashik', openDemands: 18, totalVolumeKg: 85000, topCrop: 'Tomato & Onion', status: 'High Sourcing Activity' },
    { district: 'Pune', openDemands: 24, totalVolumeKg: 120000, topCrop: 'Fresh Vegetables', status: 'Urban Retail Peak' },
    { district: 'Ahmednagar', openDemands: 12, totalVolumeKg: 45000, topCrop: 'Pulses & Grains', status: 'Stable' },
    { district: 'Coimbatore', openDemands: 15, totalVolumeKg: 62000, topCrop: 'Tomato & Coconut', status: 'Active Procurement' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.12) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag badge-rural">
                <Activity size={14} /> LIVE DISTRICT RADAR
              </span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>● Real-Time AI Evaluator</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.marketPulse.title}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
              {t.marketPulse.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="input-large"
              style={{ width: 'auto', minHeight: '44px', padding: '8px 14px', fontSize: '0.9rem' }}
            >
              <option value="Nashik">Nashik (நாசிக்)</option>
              <option value="Pune">Pune (புனே)</option>
              <option value="Ahmednagar">Ahmednagar (அகமதுநகர்)</option>
              <option value="Coimbatore">Coimbatore (கோயம்புத்தூர்)</option>
            </select>
          </div>
        </div>
      </div>

      {/* AI Market Insight Notice */}
      <div style={{
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'rgba(16, 185, 129, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={20} color="#10b981" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {t.marketPulse.aiInsightTitle}
            <span style={{ fontSize: '0.72rem', background: 'rgba(16,185,129,0.2)', padding: '2px 8px', borderRadius: '8px' }}>XGBoost Regressor v1.0</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '4px', lineHeight: 1.5 }}>
            {t.marketPulse.aiInsightText}
          </p>
        </div>
      </div>

      {/* Demand vs Supply Gap Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.marketPulse.currentDemand}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            1,48,500 kg
          </div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpRight size={16} /> +22% vs. previous 15-day cycle
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #38bdf8' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.marketPulse.expectedSupply}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
            1,12,000 kg
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
            From 48 registered farmer groups
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #f59e0b' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.marketPulse.demandSupplyGap}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
            -36,500 kg Deficit
          </div>
          <div style={{ fontSize: '0.85rem', color: '#fbbf24', marginTop: '4px' }}>
            High selling opportunity for late-stage farmers
          </div>
        </div>
      </div>

      {/* Embedded Deep AI Forecast Panel */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', color: '#f8fafc' }}>
          📈 15-Day Predictive Demand Curve ({selectedDistrict})
        </h2>
        <AIForecastPanel />
      </div>

      {/* Trending Crops Table */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
          🔥 {t.marketPulse.trendingCrops}
        </h2>
        
        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Category</th>
                <th>Indicative Price</th>
                <th>15-Day Change</th>
                <th>Demand Index</th>
                <th>Market Pulse</th>
              </tr>
            </thead>
            <tbody>
              {trendingCrops.map((c, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#f8fafc' }}>
                    {cropNamesByLang[c.name]?.[language] || c.name}
                  </td>
                  <td>{c.category}</td>
                  <td style={{ fontWeight: 800, color: '#10b981' }}>{c.price}</td>
                  <td style={{ color: c.trend === 'UP' ? '#34d399' : '#94a3b8', fontWeight: 700 }}>
                    {c.change}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${c.demandIndex}%`, height: '100%', background: c.demandIndex > 85 ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>{c.demandIndex}/100</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge-tag ${c.demandIndex > 85 ? 'badge-completed' : 'badge-pending'}`}>
                      {c.demandIndex > 85 ? '🟢 High Demand' : '🟡 Stable'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Regional Procurement Demand Summary */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
          📍 Regional Sourcing Hotspots
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {regionalDemands.map((r, idx) => (
            <div key={idx} className="surface-card" style={{ borderLeft: idx === 0 ? '4px solid #10b981' : '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>{r.district}</h3>
                <span className="badge-tag badge-rural">{r.status}</span>
              </div>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Open Buyer Demands: <strong>{r.openDemands}</strong></div>
                <div>Aggregated Volume: <strong style={{ color: '#38bdf8' }}>{r.totalVolumeKg.toLocaleString('en-IN')} kg</strong></div>
                <div>Top Crop: <strong>{r.topCrop}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
