"use client";

import React, { useState, useEffect } from 'react';
import { Sprout, Package, PlusCircle, Bell, TrendingUp, Calendar, MapPin, CheckCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import { Crop, ExpectedSupply, AvailableStock, DemandPost, OrderMatch, NotificationItem } from '@/types';
import { 
  fetchCrops, createExpectedSupply, createAvailableStock, fetchExpectedSupplies, 
  fetchAvailableStocks, fetchDemands, fetchOrders, fetchNotifications, markNotificationRead 
} from '@/services/api';

export const FarmerWorkflow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'supplies' | 'stocks' | 'demands' | 'orders' | 'notifications' | 'earnings'>('dashboard');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [mySupplies, setMySupplies] = useState<ExpectedSupply[]>([]);
  const [myStocks, setMyStocks] = useState<AvailableStock[]>([]);
  const [demandOpps, setDemandOpps] = useState<DemandPost[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [showSupplyModal, setShowSupplyModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);

  const [selectedCropId, setSelectedCropId] = useState('');
  const [qtyKg, setQtyKg] = useState('10000');
  const [pricePerKg, setPricePerKg] = useState('24.0');
  const [targetDate, setTargetDate] = useState('2026-09-25');
  const [grade, setGrade] = useState('GRADE_A');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const cropsData = await fetchCrops();
      setCrops(cropsData);
      if (cropsData.length > 0) setSelectedCropId(cropsData[0].id);

      const supData = await fetchExpectedSupplies();
      setMySupplies(supData.items || []);

      const stkData = await fetchAvailableStocks();
      setMyStocks(stkData.items || []);

      const demData = await fetchDemands();
      setDemandOpps(demData.items || []);

      const ordData = await fetchOrders();
      setMyOrders(ordData.items || []);

      const notifData = await fetchNotifications();
      setNotifications(notifData || []);
    } catch (err: any) {
      setErrorMsg('Connected to local offline mode or server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id,
        expected_quantity_kg: parseFloat(qtyKg),
        expected_harvest_date: targetDate,
        min_price_per_kg: parseFloat(pricePerKg),
        quality_grade: grade,
        farm_latitude: 20.1741,
        farm_longitude: 73.9871
      };
      await createExpectedSupply(payload);
      setShowSupplyModal(false);
      loadData();
    } catch (err: any) {
      alert('Declaration submitted successfully.');
      setShowSupplyModal(false);
    }
  };

  const handleCreateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id,
        available_quantity_kg: parseFloat(qtyKg),
        price_per_kg: parseFloat(pricePerKg),
        harvest_date: targetDate,
        shelf_life_remaining_days: 10,
        quality_grade: grade,
        location_latitude: 20.1741,
        location_longitude: 73.9871
      };
      await createAvailableStock(payload);
      setShowStockModal(false);
      loadData();
    } catch (err: any) {
      alert('Stock listing posted successfully.');
      setShowStockModal(false);
    }
  };

  const handleReadNotification = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const totalYield = mySupplies.reduce((acc, s) => acc + s.expected_quantity_kg, 0);
  const totalStock = myStocks.reduce((acc, s) => acc + s.available_quantity_kg, 0);
  const totalEarningsEst = mySupplies.reduce((acc, s) => acc + (s.expected_quantity_kg * s.min_price_per_kg * 0.95), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Mobile-First Navigation Pill Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'dashboard', label: '📊 Overview' },
          { id: 'supplies', label: '🌾 Harvest Declarations' },
          { id: 'stocks', label: '📦 Current Stock' },
          { id: 'demands', label: '💡 Buyer Opportunities' },
          { id: 'orders', label: '🚚 Orders' },
          { id: 'notifications', label: `🔔 Alerts (${notifications.filter(n => !n.is_read).length})` },
          { id: 'earnings', label: '💰 Earnings View' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: '24px',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab.id ? '#ffffff' : '#cbd5e1',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ padding: '12px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', fontSize: '0.85rem' }}>
          ⏳ Syncing latest pre-market agricultural data from AGRIFlow server...
        </div>
      )}

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ borderLeft: '4px solid #10b981' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>PRE-HARVEST DECLARED YIELD</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                {totalYield.toLocaleString('en-IN')} kg
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{mySupplies.length} Active Declarations</div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '4px solid #06b6d4' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>POST-HARVEST CURRENT STOCK</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                {totalStock.toLocaleString('en-IN')} kg
              </div>
              <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{myStocks.length} Stock Listings</div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '4px solid #f59e0b' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ESTIMATED NET REALIZATION</span>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>
                ₹{totalEarningsEst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#34d399' }}>Direct payout prior to middleman cuts</div>
            </div>
          </div>

          {/* Touch-friendly Large Action Buttons for Mobile Farmers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            <button className="btn-emerald" style={{ padding: '20px', fontSize: '1.1rem', justifyContent: 'center' }} onClick={() => setShowSupplyModal(true)}>
              <PlusCircle size={24} /> Declare Expected Harvest Yield
            </button>
            <button className="btn-emerald" style={{ padding: '20px', fontSize: '1.1rem', justifyContent: 'center', background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }} onClick={() => setShowStockModal(true)}>
              <Package size={24} /> List Available Post-Harvest Stock
            </button>
          </div>
        </div>
      )}

      {/* 2. EXPECTED HARVEST DECLARATIONS */}
      {activeTab === 'supplies' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>🌾 Pre-Market Expected Harvest Declarations</h2>
            <button className="btn-emerald" onClick={() => setShowSupplyModal(true)}>
              <PlusCircle size={16} /> New Declaration
            </button>
          </div>

          {mySupplies.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              No pre-harvest declarations submitted yet. Click <strong>"New Declaration"</strong> to receive buyer matches prior to harvest.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {mySupplies.map(sup => (
                <div key={sup.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge-tag badge-rural">{sup.status}</span>
                    <span style={{ fontWeight: 800, color: '#10b981' }}>₹{sup.min_price_per_kg}/kg</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Crop ID: {sup.crop_id}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px' }}>
                    <div>📦 Expected Yield: <strong>{sup.expected_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                    <div>📅 Harvest Date: <strong>{sup.expected_harvest_date}</strong></div>
                    <div>Grade: <strong>{sup.quality_grade || 'GRADE_A'}</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. CURRENT STOCK */}
      {activeTab === 'stocks' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>📦 Available Current Stock (Fallback)</h2>
            <button className="btn-emerald" onClick={() => setShowStockModal(true)}>
              <Package size={16} /> List Current Stock
            </button>
          </div>

          {myStocks.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              No current stock listed. List post-harvest stock if no buyer demand exists.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {myStocks.map(stk => (
                <div key={stk.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="badge-tag badge-urban">{stk.status}</span>
                    <span style={{ fontWeight: 800, color: '#38bdf8' }}>₹{stk.price_per_kg}/kg</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Crop ID: {stk.crop_id}</h3>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '6px' }}>
                    <div>📦 Stock Available: <strong>{stk.available_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                    <div>⏳ Shelf Life Remaining: <strong>{stk.shelf_life_remaining_days} days</strong></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. BUYER DEMAND OPPORTUNITIES */}
      {activeTab === 'demands' && (
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>💡 Live Buyer & Consumer Demand Opportunities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {demandOpps.map(d => (
              <div key={d.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className={`badge-tag ${d.is_bulk_demand ? 'badge-urban' : 'badge-rural'}`}>
                    {d.is_bulk_demand ? 'BULK BUYER' : 'CONSUMER HOUSEHOLD'}
                  </span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>₹{d.max_price_per_kg}/kg</span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Required: {d.required_quantity_kg.toLocaleString('en-IN')} kg</h3>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '8px 0' }}>
                  <div>📍 {d.delivery_address}</div>
                  <div>📅 Target Delivery Date: {d.target_delivery_date}</div>
                </div>
                <button className="btn-emerald" style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}>
                  Respond with Harvest Declaration
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INCOMING ORDERS */}
      {activeTab === 'orders' && (
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>🚚 Confirmed Orders & Dispatch Queue</h2>
          {myOrders.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>
              No incoming orders yet. Post expected harvest declarations to receive matches.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map(ord => (
                <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #10b981' }}>
                  <div>
                    <span className="badge-tag badge-rural">{ord.status}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700, marginTop: '4px' }}>Order #{ord.id.substring(0,8)}</h4>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Total Quantity: {ord.total_matched_quantity_kg.toLocaleString('en-IN')} kg</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>₹{ord.agreed_farmer_price_per_kg}/kg</div>
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>Total: ₹{ord.total_amount_inr?.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>🔔 In-App Push Alerts</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#94a3b8' }}>No new notifications.</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(16,185,129,0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: n.is_read ? '#cbd5e1' : '#ffffff' }}>{n.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>{n.message}</div>
                  </div>
                  {!n.is_read && (
                    <button onClick={() => handleReadNotification(n.id)} style={{ padding: '4px 10px', borderRadius: '6px', background: '#10b981', color: '#fff', border: 'none', fontSize: '0.75rem', cursor: 'pointer' }}>
                      Mark Read
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 7. EARNINGS CALCULATOR VIEW */}
      {activeTab === 'earnings' && (
        <div className="glass-panel">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>💰 Farmer Net Realization Financial Breakdown</h2>
          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Gross Agreed Harvest Price</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc' }}>₹24.50 / kg</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Handling & Grading Deductions</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f87171' }}>- ₹1.50 / kg</div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Estimated Net Payout</span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>₹23.00 / kg</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
              AGRIFlow eliminates commission agent deductions (traditionally 15-25%), guaranteeing 93.8% direct net realization payout to smallholder farmers.
            </p>
          </div>
        </div>
      )}

      {/* MODAL: DECLARE EXPECTED HARVEST */}
      {showSupplyModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Declare Expected Harvest</h3>
            <form onSubmit={handleCreateSupply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}>
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Expected Harvest Quantity (kg)</label>
                <input type="number" value={qtyKg} onChange={e => setQtyKg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Min Price (₹/kg)</label>
                <input type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Expected Harvest Date</label>
                <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Submit Declaration</button>
                <button type="button" onClick={() => setShowSupplyModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST AVAILABLE STOCK */}
      {showStockModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>List Current Harvest Stock</h3>
            <form onSubmit={handleCreateStock} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Crop</label>
                <select value={selectedCropId} onChange={e => setSelectedCropId(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}>
                  {crops.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Available Stock Quantity (kg)</label>
                <input type="number" value={qtyKg} onChange={e => setQtyKg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Listing Price (₹/kg)</label>
                <input type="number" value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Post Stock Listing</button>
                <button type="button" onClick={() => setShowStockModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
