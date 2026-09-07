"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, ShoppingBag, Layers, Activity, Map, Cpu } from 'lucide-react';
import { Crop, DemandPost, ExpectedSupply, OrderMatch } from '@/types';
import { fetchCrops, fetchDemands, fetchExpectedSupplies, fetchOrders } from '@/services/api';
import { AIForecastPanel } from '../AIForecastPanel';
import { LogisticsMap } from '../LogisticsMap';
import { useLanguage } from '@/i18n';

export const AdminWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);

  useEffect(() => {
    fetchCrops().then(setCrops);
    fetchExpectedSupplies().then(d => setSupplies(d.items || []));
    fetchDemands().then(d => setDemands(d.items || []));
    fetchOrders().then(d => setOrders(d.items || []));
  }, []);

  const totalVolumeInr = orders.reduce((acc, o) => acc + (o.total_amount_inr || 0), 257500);
  const platformRevenue = Math.round(totalVolumeInr * 0.015);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(6,182,212,0.14) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-tag badge-rural">
            <ShieldCheck size={14} /> {t.common.roles.ADMIN}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Platform Operations & Network Telemetry</span>
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
          {t.admin.title}
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
          {t.admin.subtitle}
        </p>
      </div>

      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.admin.tradeVolumeTitle}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            ₹{totalVolumeInr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
            Direct smallholder farmer realization
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #f59e0b' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.admin.platformRevenueTitle}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            ₹{platformRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
            Nominal platform sustainability fee
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #06b6d4' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.admin.activeNetworkTitle}
          </span>
          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {demands.length || 2} Demands / {supplies.length || 3} Harvests
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>
            Direct network operational nodes
          </div>
        </div>
      </div>

      {/* Admin Intelligence Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        <AIForecastPanel />
        <LogisticsMap />
      </div>

    </div>
  );
};
