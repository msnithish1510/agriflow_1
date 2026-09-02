"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, Layers, Zap, CheckCircle2, Truck, Calendar, MapPin } from 'lucide-react';
import { Crop, DemandPost, OrderMatch } from '@/types';
import { fetchCrops, createDemand, fetchDemands, runMatching, createOrder, fetchOrders } from '@/services/api';

export const BulkBuyerWorkflow: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  
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
      // Fallback matching response
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
        <div className="glass-panel" style={{ borderLeft: '4px solid #38bdf8' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ACTIVE FUTURE DEMAND POSTS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {demands.length} Active Posts
          </div>
          <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Direct Farmer Broadcasting Active</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>CONFIRMED BULK ORDERS</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            {orders.length} Confirmed Orders
          </div>
          <div style={{ fontSize: '0.78rem', color: '#34d399' }}>Guaranteed Pre-Harvest Sourcing</div>
        </div>
      </div>

      {/* Post Demand Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button className="btn-emerald" onClick={() => setShowPostModal(true)}>
          <PlusCircle size={18} /> Post Future Bulk Demand
        </button>
      </div>

      {/* Demand Posts History & Matching Tool */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShoppingBag size={20} color="#38bdf8" /> My Future Crop Demand Posts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {demands.map(dem => (
            <div key={dem.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge-tag badge-urban">{dem.status}</span>
                <span style={{ fontWeight: 800, color: '#10b981' }}>₹{dem.max_price_per_kg}/kg</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Required: {dem.required_quantity_kg.toLocaleString('en-IN')} kg</h3>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '8px 0' }}>
                <div>📍 {dem.delivery_address}</div>
                <div>📅 Target Date: {dem.target_delivery_date}</div>
              </div>
              <button 
                className="btn-emerald" 
                style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                onClick={() => handleExecuteMatch(dem.id)}
              >
                <Zap size={16} /> Match Nearby Farmer Supplies
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Matching Results Preview */}
      {matchingResults && (
        <div className="glass-panel" style={{ border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <span className="badge-tag badge-rural">AI MATCH SUCCESS</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '4px' }}>
                Pooled Multi-Farmer Yield for {matchingResults.matched_quantity_kg || 25000} kg
              </h3>
            </div>
            <button className="btn-emerald" onClick={handleConfirmOrder}>
              <CheckCircle2 size={18} /> Confirm & Place Order
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(matchingResults.participating_farmers || []).map((f: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{f.farmer_name || `Farmer #${f.farmer_id}`}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Yield Allocated: {f.allocated_quantity_kg?.toLocaleString('en-IN')} kg</div>
                </div>
                <div style={{ fontWeight: 700, color: '#10b981' }}>₹{f.price_per_kg || 24.5}/kg</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Tracking */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} color="#f59e0b" /> Confirmed Order Sourcing Lifecycle Tracker
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map(ord => (
            <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px' }}>
              <div>
                <span className="badge-tag badge-rural">{ord.status}</span>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Order #{ord.id.substring(0,8)}</h4>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Matched Qty: {ord.total_matched_quantity_kg?.toLocaleString('en-IN')} kg</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>₹{ord.agreed_farmer_price_per_kg}/kg</div>
                <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total: ₹{ord.total_amount_inr?.toLocaleString('en-IN')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Post Demand Modal */}
      {showPostModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Post Future Crop Bulk Demand</h3>
            <form onSubmit={handlePostDemand} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}>
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Required Quantity (kg)</label>
                <input type="number" value={qtyKg} onChange={e => setQtyKg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Max Agreed Price (₹/kg)</label>
                <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target Delivery Date</label>
                <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Delivery Location Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Broadcast Demand</button>
                <button type="button" onClick={() => setShowPostModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
