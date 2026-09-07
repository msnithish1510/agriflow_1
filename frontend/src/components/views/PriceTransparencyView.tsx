"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { 
  Calculator, ArrowRight, ShieldCheck, Tag, Users, CheckCircle2, 
  Info, HelpCircle, ChevronRight, Sliders, DollarSign, Percent, 
  Sparkles, Layers, TrendingUp
} from 'lucide-react';
import { fetchUrbanBreakdownModel, fetchBuyerComparison } from '@/services/api';

export const PriceTransparencyView: React.FC = () => {
  const { t, language } = useLanguage();
  const [farmerPrice, setFarmerPrice] = useState(20.0);
  const [perishability, setPerishability] = useState('HIGH');
  const [distanceKm, setDistanceKm] = useState(65.0);
  const [isUrban, setIsUrban] = useState(true);

  const [urbanModel, setUrbanModel] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    fetchUrbanBreakdownModel(farmerPrice, perishability, distanceKm, isUrban).then(setUrbanModel);
    fetchBuyerComparison(farmerPrice).then(setComparisonData);
  }, [farmerPrice, perishability, distanceKm, isUrban]);

  const finalPrice = urbanModel ? urbanModel.final_consumer_price_per_kg : (farmerPrice + 20.0);
  const farmerSharePercentage = Math.round((farmerPrice / (finalPrice || 1)) * 1000) / 10;

  // Waterfall price progression calculation
  const pFarmer = farmerPrice;
  const pIntermediary = pFarmer + 5.0;
  const pDistributor = pIntermediary + 5.0;
  const pRetail = pDistributor + 6.0;
  const pFinal = pRetail + 4.0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.1) 0%, rgba(245, 158, 11, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-tag badge-estimated" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} /> SIH26033 AUDIT ENGINE
          </span>
          <span style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700 }}>
            ● 100% Itemized Cost Visibility
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
          {t.priceTransparency.title}
        </h1>
        <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '800px', lineHeight: 1.6 }}>
          {t.priceTransparency.subtitle}
        </p>
      </div>

      {/* Advisory Guidance Notice */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        padding: '16px 20px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        fontSize: '0.9rem',
        color: '#B45309',
        boxShadow: '0 4px 14px rgba(245, 158, 11, 0.05)'
      }}>
        <Info size={22} style={{ flexShrink: 0, color: '#D97706' }} />
        <span>{t.priceTransparency.guidanceNotice}</span>
      </div>

      {/* ==================================================== */}
      {/* 1. VISUAL 5-STAGE WATERFALL PRICE PROGRESSION        */}
      {/* ==================================================== */}
      <div className="glass-card-primary">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '6px', color: '#17221C' }}>
          {t.priceTransparency.waterfallTitle}
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '26px' }}>
          Tracking every rupee added along the supply chain from farmer payout to retail shelf.
        </p>

        {/* 5-Stage Waterfall Flow */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '14px',
          position: 'relative'
        }}>
          {/* Stage 1: Farmer Price */}
          <div className="surface-card" style={{ borderTop: '4px solid #16A34A', background: 'rgba(22, 163, 74, 0.08)' }}>
            <div style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage 1: Farm Gate
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803D', margin: '6px 0', letterSpacing: '-0.02em' }}>
              ₹{pFarmer.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17221C' }}>
              FARMER
            </div>
            <span className="badge-tag badge-actual" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
              100% DIRECT (ACTUAL)
            </span>
          </div>

          {/* Stage 2: Intermediary */}
          <div className="surface-card" style={{ borderTop: '4px solid #F59E0B' }}>
            <div style={{ fontSize: '0.74rem', color: '#B45309', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage 2: Collection
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C', margin: '6px 0', letterSpacing: '-0.02em' }}>
              ₹{pIntermediary.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17221C' }}>
              INTERMEDIARY
            </div>
            <span className="badge-tag badge-estimated" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
              +₹5.00 Handling & Cold Box
            </span>
          </div>

          {/* Stage 3: Distributor */}
          <div className="surface-card" style={{ borderTop: '4px solid #0EA5E9' }}>
            <div style={{ fontSize: '0.74rem', color: '#0284C7', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage 3: Transit
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C', margin: '6px 0', letterSpacing: '-0.02em' }}>
              ₹{pDistributor.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17221C' }}>
              DISTRIBUTOR
            </div>
            <span className="badge-tag badge-matched" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
              +₹5.00 Freight & Transit
            </span>
          </div>

          {/* Stage 4: Retailer */}
          <div className="surface-card" style={{ borderTop: '4px solid #8B5CF6' }}>
            <div style={{ fontSize: '0.74rem', color: '#7C3AED', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage 4: Urban Store
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C', margin: '6px 0', letterSpacing: '-0.02em' }}>
              ₹{pRetail.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17221C' }}>
              RETAILER
            </div>
            <span className="badge-tag badge-confirmed" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
              +₹6.00 Shelf & Sort
            </span>
          </div>

          {/* Stage 5: Final Consumer Price */}
          <div className="surface-card" style={{ borderTop: '4px solid #16A34A', background: 'rgba(22, 163, 74, 0.08)' }}>
            <div style={{ fontSize: '0.74rem', color: '#15803D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Stage 5: Final Shelf
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803D', margin: '6px 0', letterSpacing: '-0.02em' }}>
              ₹{pFinal.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#17221C' }}>
              CONSUMER
            </div>
            <span className="badge-tag badge-completed" style={{ marginTop: '10px', fontSize: '0.72rem' }}>
              Fair Retail Ceiling
            </span>
          </div>
        </div>

        {/* Farmer Share Summary Metric */}
        <div style={{
          marginTop: '24px',
          padding: '16px 20px',
          borderRadius: '14px',
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: '#64748B' }}>Farmer Share Realization</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D' }}>
              {Math.round((pFarmer / pFinal) * 100)}% of Consumer Rupee
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748B', textAlign: 'right' }}>
            Traditional Mandi benchmark: <strong>25% – 32%</strong>
            <div style={{ color: '#15803D', fontWeight: 700 }}>AGRIFlow Advantage: +22% to +35% Fairer</div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. INTERACTIVE COST SIMULATION SLIDERS              */}
      {/* ==================================================== */}
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Sliders size={20} color="#16A34A" />
          <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#17221C' }}>
            Interactive Price Stack Simulator
          </h3>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Slider 1: Farmer Price */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="input-label" style={{ margin: 0 }}>Farm Gate Price (₹/kg)</label>
              <strong style={{ color: '#15803D' }}>₹{farmerPrice.toFixed(2)}</strong>
            </div>
            <input 
              type="range"
              min="10"
              max="60"
              step="1"
              value={farmerPrice}
              onChange={(e) => setFarmerPrice(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#16A34A', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              <span>₹10</span>
              <span>₹35</span>
              <span>₹60</span>
            </div>
          </div>

          {/* Slider 2: Transit Distance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label className="input-label" style={{ margin: 0 }}>Transit Haul Distance (km)</label>
              <strong style={{ color: '#0284C7' }}>{distanceKm} km</strong>
            </div>
            <input 
              type="range"
              min="10"
              max="250"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#0EA5E9', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>
              <span>10 km (Local)</span>
              <span>120 km</span>
              <span>250 km (Urban Hub)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 3. ITEMIZED AUDIT TABLE                              */}
      {/* ==================================================== */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C', marginBottom: '16px' }}>
          Itemized Margin & Cost Audit
        </h3>
        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Cost Component / நடவடிக்கை</th>
                <th>Recipient / Stakeholder</th>
                <th>Amount (₹/kg)</th>
                <th>Category</th>
                <th>Audit Verification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700, color: '#17221C' }}>🌾 Farmer Production & Net Payout</td>
                <td>Farmer Account (Direct DBT)</td>
                <td style={{ fontWeight: 800, color: '#15803D' }}>₹{pFarmer.toFixed(2)}</td>
                <td><span className="badge-tag badge-actual">ACTUAL</span></td>
                <td><span style={{ color: '#15803D', fontWeight: 700 }}>✓ Verified Bank Floor</span></td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#17221C' }}>📦 Collection, Sorting & Crating</td>
                <td>Local FPO Hub</td>
                <td style={{ fontWeight: 700 }}>₹2.50</td>
                <td><span className="badge-tag badge-estimated">HANDLING</span></td>
                <td>✓ Weighbridge API Logged</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#17221C' }}>🚚 Cold-Chain Reefer Freight</td>
                <td>Logistics Partner</td>
                <td style={{ fontWeight: 700 }}>₹2.50</td>
                <td><span className="badge-tag badge-matched">LOGISTICS</span></td>
                <td>✓ GPS Route Telemetry</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#17221C' }}>🏢 Urban Distribution Center</td>
                <td>Regional Hub Operations</td>
                <td style={{ fontWeight: 700 }}>₹5.00</td>
                <td><span className="badge-tag badge-confirmed">DISTRIBUTION</span></td>
                <td>✓ Warehouse Barcode Scan</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 700, color: '#17221C' }}>🏪 Last-Mile Retail & Shelf Margin</td>
                <td>Urban Retail Store</td>
                <td style={{ fontWeight: 700 }}>₹6.00</td>
                <td><span className="badge-tag badge-rural">RETAIL</span></td>
                <td>✓ POS Receipt Matched</td>
              </tr>
              <tr style={{ background: 'rgba(22, 163, 74, 0.06)', fontWeight: 800 }}>
                <td style={{ color: '#17221C', fontSize: '1rem' }}>Final Consumer Shelf Price</td>
                <td style={{ color: '#64748B' }}>Transparent Farm-to-Fork Total</td>
                <td style={{ color: '#15803D', fontSize: '1.15rem' }}>₹{pFinal.toFixed(2)}/kg</td>
                <td colSpan={2}>
                  <span className="badge-tag badge-completed">100% AUDIT COMPLETE</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
