"use client";

import React, { useState, useEffect } from 'react';
import { Users, Layers, Zap, ShoppingBag, CheckCircle, MapPin } from 'lucide-react';
import { ExpectedSupply, OrderMatch } from '@/types';
import { fetchExpectedSupplies, fetchOrders, runMatching } from '@/services/api';

export const FPOWorkflow: React.FC = () => {
  const [supplies, setSupplies] = useState<ExpectedSupply[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  const [matchedResult, setMatchedResult] = useState<any>(null);

  useEffect(() => {
    fetchExpectedSupplies().then(data => setSupplies(data.items || []));
    fetchOrders().then(data => setOrders(data.items || []));
  }, []);

  const totalAggregatedKg = supplies.reduce((acc, s) => acc + s.expected_quantity_kg, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>FPO MEMBER AGGREGATED YIELD</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {totalAggregatedKg.toLocaleString('en-IN')} kg
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Pooled from 20 Member Farmers</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid #38bdf8' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ACTIVE FPO BULK MATCHES</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {orders.length} Bulk Orders
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Direct Sales Guaranteed</div>
        </div>
      </div>

      {/* Member Supply Directory */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users size={20} color="#10b981" /> FPO Member Supply Declarations Directory
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {supplies.map(sup => (
            <div key={sup.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge-tag badge-rural">{sup.status}</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>₹{sup.min_price_per_kg}/kg</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Farmer ID: {sup.farmer_id}</h3>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                <div>Declared Yield: <strong>{sup.expected_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                <div>Harvest Date: <strong>{sup.expected_harvest_date}</strong></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
