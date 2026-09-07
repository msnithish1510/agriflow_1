"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/i18n';
import { 
  Calculator, ArrowRight, ShieldCheck, Tag, Users, CheckCircle2, 
  Info, HelpCircle, ChevronRight, Sliders, DollarSign, Percent 
} from 'lucide-react';
import { fetchUrbanBreakdownModel, fetchBuyerComparison } from '@/services/api';

export const PriceTransparencyView: React.FC = () => {
  const { t, language } = useLanguage();
  const [farmerPrice, setFarmerPrice] = useState(25.0);
  const [perishability, setPerishability] = useState('HIGH');
  const [distanceKm, setDistanceKm] = useState(65.0);
  const [isUrban, setIsUrban] = useState(true);

  const [urbanModel, setUrbanModel] = useState<any>(null);
  const [comparisonData, setComparisonData] = useState<any>(null);

  useEffect(() => {
    fetchUrbanBreakdownModel(farmerPrice, perishability, distanceKm, isUrban).then(setUrbanModel);
    fetchBuyerComparison(farmerPrice).then(setComparisonData);
  }, [farmerPrice, perishability, distanceKm, isUrban]);

  const finalPrice = urbanModel ? urbanModel.final_consumer_price_per_kg : (farmerPrice + 17.0);
  const farmerSharePercentage = Math.round((farmerPrice / (finalPrice || 1)) * 1000) / 10;

  // Waterfall price progression calculation
  const pFarmer = farmerPrice;
  const pIntermediary = pFarmer + (urbanModel?.breakdown_items?.[1]?.amount || 1.5) + (urbanModel?.breakdown_items?.[2]?.amount || 2.0);
  const pDistributor = pIntermediary + (urbanModel?.breakdown_items?.[3]?.amount || 3.5);
  const pRetail = pDistributor + (urbanModel?.breakdown_items?.[4]?.amount || 4.5);
  const pFinal = finalPrice;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(16,185,129,0.12) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-tag badge-estimated">
            <ShieldCheck size={14} /> SIH26033 AUDIT ENGINE
          </span>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24' }}>● 100% Itemized Cost Visibility</span>
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc' }}>
          {t.priceTransparency.title}
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px', maxWidth: '800px' }}>
          {t.priceTransparency.subtitle}
        </p>
      </div>

      {/* Advisory Guidance Notice */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '14px 18px',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.88rem',
        color: '#fbbf24'
      }}>
        <Info size={22} style={{ flexShrink: 0 }} />
        <span>{t.priceTransparency.guidanceNotice}</span>
      </div>

      {/* ==================================================== */}
      {/* 1. VISUAL WATERFALL PRICE MOVEMENT */}
      {/* ==================================================== */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px', color: '#f8fafc' }}>
          {t.priceTransparency.waterfallTitle}
        </h2>
        <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '24px' }}>
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
          <div className="surface-card" style={{ borderTop: '4px solid #10b981', background: 'rgba(16,185,129,0.06)' }}>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
              Stage 1: Farm Gate
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', margin: '6px 0' }}>
              ₹{pFarmer.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Farmer Price
            </div>
            <span className="badge-tag badge-actual" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
              100% DIRECT (ACTUAL)
            </span>
          </div>

          {/* Stage 2: Aggregation & Handling */}
          <div className="surface-card" style={{ borderTop: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 800, textTransform: 'uppercase' }}>
              Stage 2: Collection
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0' }}>
              ₹{pIntermediary.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
              Intermediary Price
            </div>
            <span className="badge-tag badge-estimated" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
              +₹{(pIntermediary - pFarmer).toFixed(2)} Grading/Sorting
            </span>
          </div>

          {/* Stage 3: Cold Transport */}
          <div className="surface-card" style={{ borderTop: '4px solid #06b6d4' }}>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              Stage 3: Freight
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0' }}>
              ₹{pDistributor.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
              Distributor Price
            </div>
            <span className="badge-tag badge-estimated" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
              +₹{(pDistributor - pIntermediary).toFixed(2)} Transit Fee
            </span>
          </div>

          {/* Stage 4: Retail Margin */}
          <div className="surface-card" style={{ borderTop: '4px solid #8b5cf6' }}>
            <div style={{ fontSize: '0.75rem', color: '#a78bfa', fontWeight: 800, textTransform: 'uppercase' }}>
              Stage 4: Urban Retail
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', margin: '6px 0' }}>
              ₹{pRetail.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#cbd5e1' }}>
              Retail Shelf Price
            </div>
            <span className="badge-tag badge-estimated" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
              +₹{(pRetail - pDistributor).toFixed(2)} Store Margin
            </span>
          </div>

          {/* Stage 5: Final Consumer Price */}
          <div className="surface-card" style={{ borderTop: '4px solid #38bdf8', background: 'rgba(6,182,212,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 800, textTransform: 'uppercase' }}>
              Stage 5: Final Shelf
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', margin: '6px 0' }}>
              ₹{pFinal.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>
              Consumer Price
            </div>
            <span className="badge-tag badge-actual" style={{ marginTop: '8px', fontSize: '0.72rem' }}>
              +₹0.50 Platform Fee
            </span>
          </div>
        </div>

        {/* Highlighted Farmer Share Callout */}
        <div style={{
          marginTop: '24px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1.5px solid #10b981',
          borderRadius: '16px',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: '#34d399', fontWeight: 800, textTransform: 'uppercase' }}>
              🌾 Smallholder Realization Index
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {t.priceTransparency.farmerShareStatement.replace('{percentage}', farmerSharePercentage.toString())}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
              Traditional mandi systems deliver only 28% - 38% to farmers for the same produce.
            </div>
          </div>

          <div style={{
            fontSize: '2.4rem',
            fontWeight: 900,
            color: '#10b981',
            letterSpacing: '-1px'
          }}>
            {farmerSharePercentage}%
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. INTERACTIVE CALCULATOR SLIDERS */}
      {/* ==================================================== */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={20} color="#10b981" /> {t.priceTransparency.calculatorTitle}
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '24px'
        }}>
          {/* Farmer Ask Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>
                {t.priceTransparency.farmerAskPrice}
              </label>
              <strong style={{ color: '#10b981', fontSize: '1.05rem' }}>₹{farmerPrice}/kg</strong>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="1"
              value={farmerPrice}
              onChange={(e) => setFarmerPrice(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#10b981', cursor: 'pointer', height: '6px' }}
            />
          </div>

          {/* Perishability Select */}
          <div>
            <label className="input-label">{t.priceTransparency.cropPerishability}</label>
            <select
              value={perishability}
              onChange={(e) => setPerishability(e.target.value)}
              className="input-large"
            >
              <option value="HIGH">Perishable (e.g. Tomato, Spinach)</option>
              <option value="MEDIUM">Semi-Perishable (e.g. Onion, Potato)</option>
              <option value="LOW">Grain / Non-Perishable (e.g. Wheat, Moong)</option>
            </select>
          </div>

          {/* Distance Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label className="input-label" style={{ marginBottom: 0 }}>
                {t.priceTransparency.transitDistance}
              </label>
              <strong style={{ color: '#38bdf8', fontSize: '1.05rem' }}>{distanceKm} km</strong>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseFloat(e.target.value))}
              style={{ width: '100%', accentColor: '#06b6d4', cursor: 'pointer', height: '6px' }}
            />
          </div>
        </div>

        {/* Itemized Audit Table */}
        {urbanModel && (
          <div className="table-responsive" style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px' }}>
            <table className="table-modern">
              <thead>
                <tr>
                  <th>{t.priceTransparency.breakdownHeaders.component}</th>
                  <th>{t.priceTransparency.breakdownHeaders.type}</th>
                  <th>{t.priceTransparency.breakdownHeaders.amount}</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {(urbanModel.breakdown_items || []).map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: item.type === 'ACTUAL' ? '#10b981' : '#f8fafc' }}>
                      {item.component}
                    </td>
                    <td>
                      <span className={`badge-tag ${item.type === 'ACTUAL' ? 'badge-actual' : 'badge-estimated'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 800, color: item.type === 'ACTUAL' ? '#10b981' : '#cbd5e1' }}>
                      ₹{Number(item.amount).toFixed(2)}/kg
                    </td>
                    <td style={{ fontSize: '0.84rem', color: '#94a3b8' }}>
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. COMPETING BUYER OFFERS MATRIX */}
      {/* ==================================================== */}
      {comparisonData && (
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={20} color="#38bdf8" /> {t.priceTransparency.matrixTitle}
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#94a3b8', marginBottom: '18px' }}>
            Audited net realization after all freight and handling deductions for ₹{farmerPrice}/kg baseline.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(comparisonData.comparison_matrix || []).map((b: any, idx: number) => (
              <div 
                key={idx} 
                className="surface-card" 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  borderLeft: idx === 0 ? '5px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {b.buyer_name}
                    {idx === 0 && (
                      <span className="badge-tag badge-rural" style={{ fontSize: '0.72rem' }}>
                        {t.priceTransparency.bestOffer}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#cbd5e1', marginTop: '4px' }}>
                    Offered Gross Price: <strong>₹{b.offered_price_per_kg}/kg</strong> | Transit Distance: {b.distance_km} km
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                    Net ₹{b.estimated_net_realization_per_kg}/kg
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>
                    {b.net_percentage}% Direct Payout Realization
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
