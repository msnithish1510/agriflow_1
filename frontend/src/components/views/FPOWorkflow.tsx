"use client";

import React, { useState, useEffect } from 'react';
import { Users, Layers, Zap, ShoppingBag, CheckCircle, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import { ExpectedSupply, OrderMatch } from '@/types';
import { fetchExpectedSupplies, fetchOrders, runMatching } from '@/services/api';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';

export const FPOWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);

  useEffect(() => {
    fetchExpectedSupplies().then(data => {
      setSupplies(data.items?.length > 0 ? data.items : [
        { id: 'sup-fpo-1', farmer_id: 'Ramesh Patil (Member #12)', crop_id: 'crop-tomato', expected_quantity_kg: 10000, expected_harvest_date: '2026-09-22', min_price_per_kg: 24.5, quality_grade: 'GRADE_A', farm_latitude: 20.1, farm_longitude: 73.9, status: 'PROPOSED' },
        { id: 'sup-fpo-2', farmer_id: 'Suresh Deshmukh (Member #15)', crop_id: 'crop-tomato', expected_quantity_kg: 10000, expected_harvest_date: '2026-09-24', min_price_per_kg: 24.5, quality_grade: 'GRADE_A', farm_latitude: 20.0, farm_longitude: 74.1, status: 'CONFIRMED' },
        { id: 'sup-fpo-3', farmer_id: 'Anand Shinde (Member #22)', crop_id: 'crop-tomato', expected_quantity_kg: 5000, expected_harvest_date: '2026-09-25', min_price_per_kg: 25.0, quality_grade: 'GRADE_A', farm_latitude: 20.2, farm_longitude: 73.8, status: 'PROPOSED' }
      ]);
    });
    fetchOrders().then(data => setOrders(data.items || []));
  }, []);

  const totalAggregatedKg = supplies.reduce((acc, s) => acc + (s.expected_quantity_kg || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(139, 92, 246, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-tag badge-rural" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <Users size={14} /> {t.common.roles.FPO}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>● Collective Yield Sourcing</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
          {t.fpo.title}
        </h1>
        <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '750px', lineHeight: 1.6 }}>
          {t.fpo.subtitle}
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
        <div className="glass-card-primary" style={{ borderLeft: '4px solid #16A34A', padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {t.fpo.combinedYieldTitle}
          </span>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#15803D', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {totalAggregatedKg.toLocaleString('en-IN')} kg
          </div>
          <div style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '4px' }}>
            Aggregated across {supplies.length} smallholder members
          </div>
        </div>

        <div className="glass-card-primary" style={{ borderLeft: '4px solid #0EA5E9', padding: '22px' }}>
          <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ACTIVE CONTRACT POOLS
          </span>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#0284C7', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {orders.length || 2} Bulk Contracts
          </div>
          <div style={{ fontSize: '0.84rem', color: '#15803D', marginTop: '4px', fontWeight: 600 }}>
            Direct corporate institutional fulfillment
          </div>
        </div>
      </div>

      {/* Member Supply Directory */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.35rem', fontWeight: 900, marginBottom: '18px', color: '#17221C', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} color="#16A34A" /> {t.fpo.memberDirectoryTitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
          {supplies.map(sup => (
            <div key={sup.id} className="surface-card" style={{ borderLeft: '4px solid #16A34A', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <StatusBadge status={sup.status} />
                <span style={{ fontWeight: 900, fontSize: '1.3rem', color: '#15803D' }}>
                  ₹{sup.min_price_per_kg}/kg
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>
                {sup.farmer_id}
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Committed Yield: <strong style={{ color: '#17221C' }}>{sup.expected_quantity_kg?.toLocaleString('en-IN')} kg</strong></div>
                <div>Harvest Date: <strong style={{ color: '#0284C7' }}>{sup.expected_harvest_date}</strong></div>
                <div>Grade: <span>{sup.quality_grade}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
