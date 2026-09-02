"use client";

import React, { useState, useEffect } from 'react';
import { Users, Layers, Zap, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
import { ExpectedSupply, OrderMatch } from '@/types';
import { fetchExpectedSupplies, fetchOrders, runMatching } from '@/services/api';

export const FPOWorkflow: React.FC = () => {
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);

  useEffect(() => {
    fetchExpectedSupplies().then(data => setSupplies(data.items || []));
    fetchOrders().then(data => setOrders(data.items || []));
  }, []);

  const totalAggregatedKg = supplies.reduce((acc, s) => acc + s.expected_quantity_kg, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>🌾 FPO MEMBER COMBINED YIELD</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {totalAggregatedKg.toLocaleString('en-IN')} kg
          </div>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>Pooled from local smallholder farmers</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #38bdf8' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>🤝 ACTIVE BULK MATCHES</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {orders.length} Bulk Orders
          </div>
          <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '2px' }}>Direct sales confirmed with buyers</div>
        </div>
      </div>

      {/* Member Supply Directory */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={22} color="#10b981" /> Member Crop Details & Harvest Directory
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {supplies.map(sup => (
            <div key={sup.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '4px solid #10b981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-tag badge-rural">{sup.status}</span>
                <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#10b981' }}>₹{sup.min_price_per_kg}/kg</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>Farmer ID: {sup.farmer_id}</h3>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div>📦 Expected Yield: <strong>{sup.expected_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                <div>📅 Harvest Date: <strong>{sup.expected_harvest_date}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
