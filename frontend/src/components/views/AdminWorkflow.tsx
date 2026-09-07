"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, ShoppingBag, Layers, Activity, Map, Cpu, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Filter } from 'lucide-react';
import { Crop, DemandPost, ExpectedSupply, OrderMatch } from '@/types';
import { fetchCrops, fetchDemands, fetchExpectedSupplies, fetchOrders } from '@/services/api';
import { AIForecastPanel } from '../AIForecastPanel';
import { LogisticsMap } from '../LogisticsMap';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';

export const AdminWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  const [filterRole, setFilterRole] = useState('ALL');

  useEffect(() => {
    fetchCrops().then(setCrops);
    fetchExpectedSupplies().then(d => setSupplies(d.items || []));
    fetchDemands().then(d => setDemands(d.items || []));
    fetchOrders().then(d => setOrders(d.items || []));
  }, []);

  const totalVolumeInr = orders.reduce((acc, o) => acc + (o.total_amount_inr || 0), 257500);
  const platformRevenue = Math.round(totalVolumeInr * 0.015);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Top Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(14, 165, 233, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="badge-tag badge-rural" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
            <ShieldCheck size={14} /> {t.common.roles.ADMIN}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#15803D', fontWeight: 700 }}>
            ● Platform Operations & Network Governance
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
          {t.admin.title}
        </h1>
        <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '750px', lineHeight: 1.6 }}>
          {t.admin.subtitle}
        </p>
      </div>

      {/* 8 Primary Platform KPI Cards (As requested by user) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px'
      }}>
        {/* Total Users */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #16A34A', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Users</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#17221C', marginTop: '4px' }}>1,420</div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', marginTop: '2px', fontWeight: 600 }}>+12% this month</div>
        </div>

        {/* Farmers */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #22C55E', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Verified Farmers</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803D', marginTop: '4px' }}>850</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Across 14 FPO clusters</div>
        </div>

        {/* Buyers */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #0EA5E9', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Bulk Buyers</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0284C7', marginTop: '4px' }}>120</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Retail chains & exporters</div>
        </div>

        {/* Consumers */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #F59E0B', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Consumers</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#B45309', marginTop: '4px' }}>450</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Direct farm-to-table</div>
        </div>

        {/* Active Orders */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #8B5CF6', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Orders</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#7C3AED', marginTop: '4px' }}>18</div>
          <div style={{ fontSize: '0.78rem', color: '#7C3AED', marginTop: '2px', fontWeight: 600 }}>In cold transit</div>
        </div>

        {/* Completed Orders */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #10B981', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Completed Orders</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#15803D', marginTop: '4px' }}>242</div>
          <div style={{ fontSize: '0.78rem', color: '#15803D', marginTop: '2px' }}>99.2% on-time delivery</div>
        </div>

        {/* Total Produce */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #06B6D4', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Total Produce</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0369A1', marginTop: '4px' }}>148.5 T</div>
          <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>Aggregated volume</div>
        </div>

        {/* Unsold Stock Mitigated */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #F43F5E', padding: '18px' }}>
          <span style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Waste Reduction</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#E11D48', marginTop: '4px' }}>94.2%</div>
          <div style={{ fontSize: '0.78rem', color: '#E11D48', marginTop: '2px', fontWeight: 600 }}>Unsold stock rescued</div>
        </div>
      </div>

      {/* Network Activity & Telemetry Table */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              Live Ecosystem Activity Audit
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Real-time audit log of demands, harvests, and verified payouts
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'FARMER', 'BUYER', 'LOGISTICS'].map(r => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: filterRole === r ? 'rgba(22, 163, 74, 0.12)' : 'rgba(0,0,0,0.03)',
                  border: filterRole === r ? '1px solid #16A34A' : '1px solid rgba(0,0,0,0.06)',
                  color: filterRole === r ? '#15803D' : '#64748B',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Event Time</th>
                <th>Actor / Stakeholder</th>
                <th>Action Type</th>
                <th>Commodity & Volume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color: '#64748B', fontSize: '0.84rem' }}>10 mins ago</td>
                <td style={{ fontWeight: 700, color: '#17221C' }}>Farmer Ramesh (Pimpalgaon)</td>
                <td>Declared Pre-Harvest</td>
                <td style={{ fontWeight: 700 }}>Tomato • 4,000 kg</td>
                <td><span className="badge-tag badge-completed">VERIFIED</span></td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', fontSize: '0.84rem' }}>25 mins ago</td>
                <td style={{ fontWeight: 700, color: '#17221C' }}>Reliance Retail DC Pune</td>
                <td>Contract Matched</td>
                <td style={{ fontWeight: 700 }}>Tomato • 25,000 kg</td>
                <td><span className="badge-tag badge-matched">MATCHED</span></td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', fontSize: '0.84rem' }}>40 mins ago</td>
                <td style={{ fontWeight: 700, color: '#17221C' }}>Cold Transit MH-15-TC-4029</td>
                <td>Pickup Route Initiated</td>
                <td style={{ fontWeight: 700 }}>Reefer Consolidated • 7.5 T</td>
                <td><span className="badge-tag badge-confirmed">IN TRANSIT</span></td>
              </tr>
              <tr>
                <td style={{ color: '#64748B', fontSize: '0.84rem' }}>1 hour ago</td>
                <td style={{ fontWeight: 700, color: '#17221C' }}>Kaveri Organic FPO</td>
                <td>Cluster Yield Pooled</td>
                <td style={{ fontWeight: 700 }}>Onion • 10,000 kg</td>
                <td><span className="badge-tag badge-rural">POOLED</span></td>
              </tr>
            </tbody>
          </table>
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
