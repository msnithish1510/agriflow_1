"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, ShoppingBag, Layers, Activity, Map, Truck, Eye } from 'lucide-react';
import { Crop, DemandPost, ExpectedSupply, OrderMatch } from '@/types';
import { fetchCrops, fetchDemands, fetchExpectedSupplies, fetchOrders } from '@/services/api';
import { AIForecastPanel } from '../AIForecastPanel';
import { LogisticsMap } from '../LogisticsMap';
import { OrderTrackingView } from '../tracking/OrderTrackingView';

export const AdminWorkflow: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCrops().then(setCrops);
    fetchExpectedSupplies().then(d => setSupplies(d.items || []));
    fetchDemands().then(d => setDemands(d.items || []));
    fetchOrders().then(d => setOrders(d.items || []));
  }, []);

  const totalVolumeInr = orders.reduce((acc, o) => acc + (o.total_amount_inr || 0), 0);
  const platformRevenue = Math.round(totalVolumeInr * 0.015);

  if (selectedTrackingId) {
    return (
      <OrderTrackingView
        trackingId={selectedTrackingId}
        language="en"
        userRole="ADMIN"
        onBack={() => setSelectedTrackingId(null)}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>TOTAL TRADE VOLUME</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            ₹{totalVolumeInr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>Direct smallholder farmer realization</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #f59e0b' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>PLATFORM COORDINATION FEE (1.5%)</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            ₹{platformRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>Nominal sustainability fee</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #06b6d4' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>ACTIVE DEMAND VS CROP DETAILS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {demands.length} Demands / {supplies.length} Crops
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>Direct platform network live</div>
        </div>
      </div>

      {/* Admin Live Tracking Overview Bar (Phase 22) */}
      <div className="glass-panel" style={{ borderLeft: '5px solid #a855f7' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="#c084fc" /> Admin Live Fleet & Active Deliveries Control
          </h3>
          <button
            onClick={() => setSelectedTrackingId('AGR-2026-00125')}
            style={{
              background: 'linear-gradient(135deg, #a855f7, #7e22ce)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Eye size={16} /> Open Fleet Live Tracking Map
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', textAlign: 'center' }}>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL ACTIVE</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>12</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>IN TRANSIT</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}>7</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>NEAR DESTINATION</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#c084fc' }}>3</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>DELAYED</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f87171' }}>2</div>
          </div>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>DELIVERED TODAY</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}>25</div>
          </div>
        </div>
      </div>

      {/* Admin Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        <AIForecastPanel />
        <LogisticsMap />
      </div>
    </div>
  );
};
