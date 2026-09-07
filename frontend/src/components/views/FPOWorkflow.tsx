"use client";

import React, { useState, useEffect } from 'react';
import { Users, Layers, Zap, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(139,92,246,0.12) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-tag badge-rural">
            <Users size={14} /> {t.common.roles.FPO}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Collective Yield Sourcing</span>
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
          {t.fpo.title}
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
          {t.fpo.subtitle}
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.fpo.combinedYieldTitle}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {totalAggregatedKg.toLocaleString('en-IN')} kg
          </div>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '2px' }}>
            Aggregated across {supplies.length} smallholder members
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #38bdf8' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            ACTIVE CONTRACT POOLS
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {orders.length || 2} Bulk Contracts
          </div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '2px' }}>
            Direct corporate institutional fulfillment
          </div>
        </div>
      </div>

      {/* Member Supply Directory */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#10b981" /> {t.fpo.memberDirectoryTitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {supplies.map(sup => (
            <div key={sup.id} className="surface-card" style={{ borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <StatusBadge status={sup.status} />
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>
                  ₹{sup.min_price_per_kg}/kg
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                {sup.farmer_id}
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>Committed Yield: <strong style={{ color: '#fff' }}>{sup.expected_quantity_kg?.toLocaleString('en-IN')} kg</strong></div>
                <div>Harvest Date: <strong style={{ color: '#38bdf8' }}>{sup.expected_harvest_date}</strong></div>
                <div>Grade: <span>{sup.quality_grade}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
