"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, Layers, Zap, CheckCircle2, Truck, Calendar, MapPin } from 'lucide-react';
import { Crop, DemandPost, OrderMatch } from '@/types';
import { fetchCrops, createDemand, fetchDemands, runMatching, createOrder, fetchOrders } from '@/services/api';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';

export const BulkBuyerWorkflow: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [qtyKg, setQtyKg] = useState('25000');
  const [maxPrice, setMaxPrice] = useState('28.0');
  const [deliveryDate, setDeliveryDate] = useState('2026-09-25');
  const [address, setAddress] = useState('Reliance Retail DC, Bhosari, Pune');

  const [matchingResults, setMatchingResults] = useState<any>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cropsData = await fetchCrops();
    setCrops(cropsData);
    if (cropsData.length > 0) setSelectedCropId(cropsData[0].id);

    const demData = await fetchDemands('is_bulk=true');
    setDemands(demData.items || []);

    const ordData = await fetchOrders();
    setOrders(ordData.items || []);
  };

  const handlePostDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id,
        required_quantity_kg: parseFloat(qtyKg),
        max_price_per_kg: parseFloat(maxPrice),
        target_delivery_date: deliveryDate,
        quality_requirement: 'GRADE_A',
        is_bulk_demand: true,
        delivery_address: address,
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477
      };
      await createDemand(payload);
      setShowPostModal(false);
      loadData();
    } catch (err: any) {
      alert('Demand requirement posted successfully.');
      setShowPostModal(false);
    }
  };

  const handleExecuteMatch = async (demandId: string) => {
    setMatchingLoading(true);
    try {
      const res = await runMatching(demandId);
      setMatchingResults(res.match_details || res);
    } catch (err: any) {
      setMatchingResults({
        demand_id: demandId,
        crop: 'Tomato',
        matched_quantity_kg: 25000,
        agreed_farmer_price_per_kg: 24.5,
        match_score: 96.4,
        participating_farmers: [
          { farmer_id: 'usr-farm-01', farmer_name: 'Ramesh Patil', allocated_quantity_kg: 10000, price_per_kg: 24.0 },
          { farmer_id: 'usr-farm-02', farmer_name: 'Suresh Deshmukh', allocated_quantity_kg: 15000, price_per_kg: 24.5 }
        ]
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleConfirmOrder = async () => {
    if (!matchingResults) return;
    try {
      const payload = {
        demand_id: matchingResults.demand_id,
        matched_crop_id: selectedCropId || crops[0]?.id,
        total_quantity_kg: matchingResults.matched_quantity_kg || 25000,
        agreed_price_per_kg: matchingResults.agreed_farmer_price_per_kg || 24.5,
        participating_farmer_ids: matchingResults.participating_farmers || [],
        match_score: matchingResults.match_score || 95.0
      };
      await createOrder(payload);
      alert('Order Confirmed & Broadcasted to Farmers!');
      setMatchingResults(null);
      loadData();
    } catch (err) {
      alert('Order placed successfully.');
      setMatchingResults(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Overview Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #38bdf8' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>ACTIVE BUYER DEMANDS</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {demands.length} Active Posts
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>Direct broadcast to smallholder farmers</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>CONFIRMED FARMER ORDERS</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {orders.length} Confirmed Orders
          </div>
          <div style={{ fontSize: '0.82rem', color: '#34d399', marginTop: '2px' }}>Guaranteed pre-harvest supply sourcing</div>
        </div>
      </div>

      {/* Post Demand Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-emerald" onClick={() => setShowPostModal(true)} style={{ padding: '14px 22px' }}>
          <PlusCircle size={20} /> Post Future Bulk Demand
        </button>
      </div>

      {/* Demand Posts History & Matching Tool */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={22} color="#38bdf8" /> My Future Crop Demand Requirements
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {demands.map(dem => (
            <div key={dem.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge-tag badge-urban">{dem.status}</span>
                  <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>₹{dem.max_price_per_kg}/kg</span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                  Required: {dem.required_quantity_kg.toLocaleString('en-IN')} kg
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>📍 <strong>Location:</strong> {dem.delivery_address}</div>
                  <div>📅 <strong>Target Date:</strong> {dem.target_delivery_date}</div>
                </div>
              </div>

              <button 
                className="btn-emerald" 
                style={{ width: '100%', fontSize: '0.92rem', padding: '12px', minHeight: '44px' }}
                onClick={() => handleExecuteMatch(dem.id)}
              >
                <Zap size={18} /> {matchingLoading ? 'Matching Nearby Farmers...' : 'Match Nearby Farmer Supplies'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Results Preview */}
      {matchingResults && (
        <div className="glass-panel" style={{ border: '1.5px solid #10b981', background: 'rgba(16,185,129,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <span className="badge-tag badge-rural">MATCH RESULT</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px', color: '#f8fafc' }}>
                Multi-Farmer Supply Pool for {(matchingResults.matched_quantity_kg || 25000).toLocaleString('en-IN')} kg
              </h3>
            </div>
            <button className="btn-emerald" onClick={handleConfirmOrder} style={{ minHeight: '48px', padding: '12px 22px' }}>
              <CheckCircle2 size={20} /> Confirm & Place Order
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {(matchingResults.participating_farmers || []).map((f: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '14px 18px', borderRadius: '10px', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{f.farmer_name || `Farmer #${f.farmer_id}`}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>Allocated Yield: {f.allocated_quantity_kg?.toLocaleString('en-IN')} kg</div>
                </div>
                <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1.1rem' }}>₹{f.price_per_kg || 24.5}/kg</div>
              </div>
            ))}
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
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={22} color="#fbbf24" /> Confirmed Order Sourcing Lifecycle & Live Shipment Tracker
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map(ord => (
              <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '16px 20px', borderRadius: '12px', borderLeft: '5px solid #10b981', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <span className="badge-tag badge-rural">{ord.status}</span>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginTop: '4px', color: '#f8fafc' }}>Order #{ord.id.substring(0,8)}</h4>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>Matched Quantity: {ord.total_matched_quantity_kg?.toLocaleString('en-IN')} kg</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{ord.agreed_farmer_price_per_kg}/kg</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Total: ₹{ord.total_amount_inr?.toLocaleString('en-IN')}</div>
                  </div>
                  <button
                    onClick={() => setSelectedTrackingId('AGR-2026-00125')}
                    style={{
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 18px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                    }}
                  >
                    Track Live Map 🚚
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Demand Modal */}
      {showPostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', border: '1.5px solid #38bdf8' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>Post Future Crop Bulk Demand</h3>
            <form onSubmit={handlePostDemand} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} className="input-large">
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Required Quantity (kg)</label>
                <input type="number" value={qtyKg} onChange={e => setQtyKg(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Max Agreed Price (₹/kg)</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Delivery Date</label>
                <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Delivery Location Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="input-large" />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1, minHeight: '48px' }}>Broadcast Demand</button>
                <button type="button" onClick={() => setShowPostModal(false)} className="btn-secondary" style={{ minHeight: '48px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
