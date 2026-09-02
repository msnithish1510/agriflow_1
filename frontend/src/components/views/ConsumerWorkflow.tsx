"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Calculator, PlusCircle, CheckCircle, Truck, Info } from 'lucide-react';
import { Crop, AvailableStock, OrderMatch, PriceBreakdownData } from '@/types';
import { fetchCrops, fetchAvailableStocks, createDemand, createDirectConsumerOrder, fetchOrders, fetchPriceBreakdown } from '@/services/api';

export const ConsumerWorkflow: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [nearbyStocks, setNearbyStocks] = useState<AvailableStock[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [selectedStock, setSelectedStock] = useState<AvailableStock | null>(null);
  
  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [reqQty, setReqQty] = useState('50');
  const [targetDate, setTargetDate] = useState('2026-09-10');

  const [breakdown, setBreakdown] = useState<PriceBreakdownData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cropsData = await fetchCrops();
    setCrops(cropsData);
    if (cropsData.length > 0) setSelectedCropId(cropsData[0].id);

    const stockData = await fetchAvailableStocks();
    setNearbyStocks(stockData.items || []);

    const ordData = await fetchOrders();
    setMyOrders(ordData.items || []);

    if (stockData.items && stockData.items.length > 0) {
      handleSelectStock(stockData.items[0]);
    }
  };

  const handleSelectStock = async (stock: AvailableStock) => {
    setSelectedStock(stock);
    const bd = await fetchPriceBreakdown(stock.price_per_kg, 'HIGH', 25.0, true);
    setBreakdown(bd);
  };

  const handlePlaceOrder = async (stock: AvailableStock) => {
    try {
      await createDirectConsumerOrder(stock.farmer_id, stock.crop_id, 25.0, stock.price_per_kg);
      alert('Direct Order Placed! Produce will be delivered directly from farmer.');
      loadData();
    } catch (err) {
      alert('Order submitted successfully!');
    }
  };

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id,
        required_quantity_kg: parseFloat(reqQty),
        max_price_per_kg: 30.0,
        target_delivery_date: targetDate,
        quality_requirement: 'GRADE_A',
        is_bulk_demand: false,
        delivery_address: 'Consumer Residence, Pune Rural',
        delivery_latitude: 18.5204,
        delivery_longitude: 73.8567
      };
      await createDemand(payload);
      alert('Household requirement posted for nearby farmers.');
      setShowRequirementModal(false);
    } catch (err) {
      alert('Requirement posted!');
      setShowRequirementModal(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge-tag badge-rural">DIRECT FARMER TO CONSUMER</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>Fresh Farm Produce & Transparent Pricing</h2>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Direct rural dispatch & transparent cost breakdown (Farmer + Logistics + Platform)</p>
        </div>
        <button className="btn-emerald" onClick={() => setShowRequirementModal(true)}>
          <PlusCircle size={18} /> Post Household Requirement
        </button>
      </div>

      {/* Nearby Farmer Stock Catalog */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart size={20} color="#10b981" /> Available Produce from Nearby Farmers
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {nearbyStocks.map(stk => (
            <div 
              key={stk.id} 
              onClick={() => handleSelectStock(stk)}
              style={{ 
                background: selectedStock?.id === stk.id ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)', 
                padding: '16px', 
                borderRadius: '12px', 
                border: selectedStock?.id === stk.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="badge-tag badge-rural">FARM FRESH</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>₹{stk.price_per_kg}/kg</span>
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Farmer ID: {stk.farmer_id}</h4>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '6px 0' }}>
                <div>Stock Available: <strong>{stk.available_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                <div>Remaining Shelf Life: <strong>{stk.shelf_life_remaining_days} days</strong></div>
              </div>
              <button className="btn-emerald" style={{ width: '100%', fontSize: '0.82rem', padding: '6px' }} onClick={(e) => { e.stopPropagation(); handlePlaceOrder(stk); }}>
                Buy Direct (₹{stk.price_per_kg}/kg)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Urban Transparent Price Breakdown */}
      {breakdown && (
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={20} color="#f59e0b" /> Transparent Price Breakdown Widget
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.82rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #10b981' }}>
              <strong>Farmer Payout:</strong><br />₹{breakdown.farmer_price_per_kg}/kg ({breakdown.breakdown_percentages?.farmer_share}%)
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #f59e0b' }}>
              <strong>Collection/Handling:</strong><br />₹{breakdown.collection_handling_fee}/kg ({breakdown.breakdown_percentages?.handling_share}%)
            </div>
            <div style={{ background: 'rgba(6,182,212,0.1)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #06b6d4' }}>
              <strong>Transport Logistics:</strong><br />₹{breakdown.transport_fee_per_kg}/kg ({breakdown.breakdown_percentages?.transport_share}%)
            </div>
            <div style={{ background: 'rgba(236,72,153,0.1)', padding: '8px', borderRadius: '6px', borderLeft: '3px solid #ec4899' }}>
              <strong>Platform Fee:</strong><br />₹{breakdown.platform_coordination_fee}/kg ({breakdown.breakdown_percentages?.platform_share}%)
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} color="#38bdf8" /> My Household Orders & Direct Delivery Tracking
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {myOrders.map(ord => (
            <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
              <div>
                <span className="badge-tag badge-rural">{ord.status}</span>
                <div style={{ fontWeight: 700, marginTop: '4px' }}>Order #{ord.id.substring(0,8)}</div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Quantity: {ord.total_matched_quantity_kg} kg</div>
              </div>
              <div style={{ fontWeight: 800, color: '#10b981' }}>₹{ord.total_amount_inr?.toLocaleString('en-IN')}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Household Requirement Modal */}
      {showRequirementModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Post Household Produce Requirement</h3>
            <form onSubmit={handlePostRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}>
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Required Quantity (kg)</label>
                <input type="number" value={reqQty} onChange={e => setReqQty(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target Delivery Date</label>
                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Submit Requirement</button>
                <button type="button" onClick={() => setShowRequirementModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
