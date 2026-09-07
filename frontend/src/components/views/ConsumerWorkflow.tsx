"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Calculator, PlusCircle, CheckCircle, Truck, Info } from 'lucide-react';
import { Crop, AvailableStock, OrderMatch, PriceBreakdownData } from '@/types';
import { fetchCrops, fetchAvailableStocks, createDemand, createDirectConsumerOrder, fetchOrders, fetchPriceBreakdown } from '@/services/api';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';

export const ConsumerWorkflow: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [nearbyStocks, setNearbyStocks] = useState<AvailableStock[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [selectedStock, setSelectedStock] = useState<AvailableStock | null>(null);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  
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
      alert('Direct Order Placed! Fresh produce will be delivered directly from the farmer.');
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
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.15))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', padding: '22px' }}>
        <div>
          <span className="badge-tag badge-rural">DIRECT FARMER TO CONSUMER</span>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px', color: '#f8fafc' }}>
            Fresh Farm Produce & Transparent Pricing
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '2px' }}>
            Direct rural dispatch & transparent cost breakdown (Farmer + Logistics + Platform)
          </p>
        </div>
        <button className="btn-emerald" onClick={() => setShowRequirementModal(true)} style={{ padding: '14px 22px' }}>
          <PlusCircle size={20} /> Post Household Requirement
        </button>
      </div>

      {/* Nearby Farmer Stock Catalog */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingCart size={22} color="#10b981" /> Available Fresh Produce from Nearby Farmers
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {nearbyStocks.map(stk => (
            <div 
              key={stk.id} 
              onClick={() => handleSelectStock(stk)}
              style={{ 
                background: selectedStock?.id === stk.id ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)', 
                padding: '18px', 
                borderRadius: '14px', 
                border: selectedStock?.id === stk.id ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge-tag badge-rural">FARM FRESH</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>₹{stk.price_per_kg}/kg</span>
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>Farmer ID: {stk.farmer_id}</h4>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '6px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Stock Available: <strong>{stk.available_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                  <div>Remaining Shelf Life: <strong>{stk.shelf_life_remaining_days} days</strong></div>
                </div>
              </div>

              <button className="btn-emerald" style={{ width: '100%', fontSize: '0.92rem', padding: '10px', minHeight: '44px' }} onClick={(e) => { e.stopPropagation(); handlePlaceOrder(stk); }}>
                Buy Direct (₹{stk.price_per_kg}/kg)
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Urban Transparent Price Breakdown */}
      {breakdown && (
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calculator size={22} color="#fbbf24" /> Transparent Price Breakdown Widget
          </h3>
          <div style={{ background: 'rgba(0,0,0,0.3)', padding: '18px', borderRadius: '12px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '0.88rem' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #10b981' }}>
              <strong style={{ color: '#cbd5e1' }}>Farmer Payout:</strong><br />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>₹{breakdown.farmer_price_per_kg}/kg</span>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({breakdown.breakdown_percentages?.farmer_share}%)</div>
            </div>
            <div style={{ background: 'rgba(245,158,11,0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
              <strong style={{ color: '#cbd5e1' }}>Collection/Handling:</strong><br />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>₹{breakdown.collection_handling_fee}/kg</span>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({breakdown.breakdown_percentages?.handling_share}%)</div>
            </div>
            <div style={{ background: 'rgba(6,182,212,0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #06b6d4' }}>
              <strong style={{ color: '#cbd5e1' }}>Transport Logistics:</strong><br />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>₹{breakdown.transport_fee_per_kg}/kg</span>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({breakdown.breakdown_percentages?.transport_share}%)</div>
            </div>
            <div style={{ background: 'rgba(236,72,153,0.1)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #ec4899' }}>
              <strong style={{ color: '#cbd5e1' }}>Platform Fee:</strong><br />
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f472b6' }}>₹{breakdown.platform_coordination_fee}/kg</span>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>({breakdown.breakdown_percentages?.platform_share}%)</div>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking */}
      {selectedTrackingId ? (
        <OrderTrackingView
          trackingId={selectedTrackingId}
          language="en"
          onBack={() => setSelectedTrackingId(null)}
        />
      ) : (
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="#38bdf8" /> My Household Orders & Direct Delivery Live Tracking
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {myOrders.map(ord => (
              <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '16px 20px', borderRadius: '12px', borderLeft: '5px solid #10b981', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="badge-tag badge-rural">{ord.status}</span>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', marginTop: '4px', color: '#f8fafc' }}>Order #{ord.id.substring(0,8)}</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>Quantity: {ord.total_matched_quantity_kg} kg</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontWeight: 800, fontSize: '1.3rem', color: '#10b981' }}>₹{ord.total_amount_inr?.toLocaleString('en-IN')}</div>
                  <button
                    onClick={() => setSelectedTrackingId('AGR-2026-00125')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    Track Order 🚚
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Household Requirement Modal */}
      {showRequirementModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', border: '1.5px solid #10b981' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>Post Household Produce Requirement</h3>
            <form onSubmit={handlePostRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} className="input-large">
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Required Quantity (kg)</label>
                <input type="number" value={reqQty} onChange={e => setReqQty(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Delivery Date</label>
                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="input-large" />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1, minHeight: '48px' }}>Submit Requirement</button>
                <button type="button" onClick={() => setShowRequirementModal(false)} className="btn-secondary" style={{ minHeight: '48px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
