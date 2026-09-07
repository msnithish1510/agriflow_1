"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { 
  TrendingUp, TrendingDown, Activity, AlertCircle, Sparkles, MapPin, 
  Calendar, Layers, ArrowUpRight, ArrowDownRight, CheckCircle2, Info, 
  BarChart3, RefreshCw
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
    Wheat: { en: 'Wheat', ta: 'கோதுமை', hi: 'गेहूं', te: 'గోధుಮలు', ml: 'ഗോതമ്പ്', kn: 'ಗೋಧಿ' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tag badge-rural" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                <Activity size={14} /> LIVE DISTRICT RADAR
              </span>
              <span style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                Real-Time AI Evaluator
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
              {t.marketPulse.title}
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '750px', lineHeight: 1.6 }}>
              {t.marketPulse.subtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="input-large"
              style={{ width: 'auto', minHeight: '44px', padding: '8px 16px', fontSize: '0.92rem' }}
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
        background: 'rgba(22, 163, 74, 0.08)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        padding: '18px 22px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        boxShadow: '0 4px 14px rgba(22, 163, 74, 0.05)'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'rgba(22, 163, 74, 0.15)',
          color: '#16A34A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Sparkles size={22} />
        </div>
        <div>
          <div style={{ fontWeight: 800, color: '#17221C', fontSize: '1rem', marginBottom: '4px' }}>
            AI Pre-Harvest Market Advisory • {selectedDistrict}
          </div>
          <div style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.5 }}>
            {selectedCrop} demand is expected to peak in the next 10-14 days (+18% forward institutional commitments). Farmers with ready crops are advised to declare harvests early to lock guaranteed purchase contracts above ₹26.00/kg.
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. EMBEDDED AI FORECAST PANEL                       */}
      {/* ==================================================== */}
      <AIForecastPanel selectedCrop={selectedCrop} />

      {/* ==================================================== */}
      {/* 2. COMMODITY PRICE TICKER & DEMAND METRICS          */}
      {/* ==================================================== */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              {t.marketPulse.trendingCrops}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Live wholesale mandi spot rates vs. forward contracted floor prices
            </p>
          </div>
          <span className="badge-tag badge-completed">Updated 10m ago</span>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Crop Name</th>
                <th>Category</th>
                <th>Pre-Harvest Demand Index</th>
                <th>Avg Fair Price</th>
                <th>7-Day Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trendingCrops.map(item => {
                const localizedName = cropNamesByLang[item.name]?.[language] || item.name;
                const isUp = item.trend === 'UP';
                return (
                  <tr key={item.name}>
                    <td style={{ fontWeight: 800, color: '#17221C' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>
                          {item.name === 'Tomato' ? '🍅' : item.name === 'Onion' ? '🧅' : item.name === 'Potato' ? '🥔' : item.name === 'Wheat' ? '🌾' : '🌱'}
                        </span>
                        <div>
                          <div>{localizedName}</div>
                          <div style={{ fontSize: '0.74rem', color: '#64748B' }}>{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge-tag badge-rural" style={{ fontSize: '0.75rem' }}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          flex: 1,
                          height: '6px',
                          background: 'rgba(0, 0, 0, 0.06)',
                          borderRadius: '9999px',
                          overflow: 'hidden',
                          maxWidth: '100px'
                        }}>
                          <div style={{ width: `${item.demandIndex}%`, height: '100%', background: '#16A34A' }} />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{item.demandIndex}/100</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 800, color: '#15803D', fontSize: '1rem' }}>
                      {item.price}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: isUp ? '#15803D' : '#D97706', fontWeight: 700 }}>
                        {isUp ? <ArrowUpRight size={16} /> : <TrendingDown size={16} />}
                        <span>{item.change}</span>
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn-secondary"
                        onClick={() => setSelectedCrop(item.name)}
                        style={{ padding: '6px 12px', fontSize: '0.8rem', minHeight: '32px' }}
                      >
                        Forecast
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. REGIONAL SOURCING DEMAND CLUSTERS                */}
      {/* ==================================================== */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C', marginBottom: '16px' }}>
          Regional Sourcing Clusters & Procurement Hubs
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px'
        }}>
          {regionalDemands.map(reg => (
            <div key={reg.district} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, color: '#17221C', fontSize: '1.1rem' }}>{reg.district}</span>
                <span className="badge-tag badge-matched" style={{ fontSize: '0.74rem' }}>{reg.status}</span>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0EA5E9' }}>
                {(reg.totalVolumeKg / 1000).toFixed(1)} Tonnes
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                <div>Open Demands: <strong>{reg.openDemands} contracts</strong></div>
                <div>Primary Focus: <strong>{reg.topCrop}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
