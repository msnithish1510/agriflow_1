"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, ShoppingBag, Layers, Activity, Map } from 'lucide-react';
import { Crop, DemandPost, ExpectedSupply, OrderMatch } from '@/types';
import { fetchCrops, fetchDemands, fetchExpectedSupplies, fetchOrders } from '@/services/api';
import { AIForecastPanel } from '../AIForecastPanel';
import { LogisticsMap } from '../LogisticsMap';

export const AdminWorkflow: React.FC = () => {
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

  const totalVolumeInr = orders.reduce((acc, o) => acc + (o.total_amount_inr || 0), 0);
  const platformRevenue = Math.round(totalVolumeInr * 0.015);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TOTAL TRADE VOLUME</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            ₹{totalVolumeInr.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Direct Farmer Realization</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PLATFORM FEE REVENUE (1.5%)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
            ₹{platformRevenue.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Nominal Coordination Fee</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid #06b6d4' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ACTIVE DEMAND VS SUPPLY</span>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {demands.length} Demands / {supplies.length} Supplies
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>SIH26033 Platform Operational</div>
        </div>
      </div>

      {/* Admin Modules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        <AIForecastPanel />
        <LogisticsMap />
      </div>
    </div>
  );
};
