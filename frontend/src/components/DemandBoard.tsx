"use client";

import React, { useState } from 'react';
import { ShoppingBag, Calendar, MapPin, PlusCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserRole } from '@/types';

interface DemandBoardProps {
  currentRole: UserRole;
}

export const DemandBoard: React.FC<DemandBoardProps> = ({ currentRole }) => {
  const [demands, setDemands] = useState([
    { id: 'dem-001', crop: 'Tomato', qty: 25000, targetDate: '2026-09-20', maxPrice: 28.0, location: 'Pune, Maharashtra', buyer: 'Reliance Retail DC', isBulk: true, status: 'OPEN', demandLevel: 'HIGH', availableSupplyKg: 18000 },
    { id: 'dem-002', crop: 'Onion', qty: 40000, targetDate: '2026-09-25', maxPrice: 25.0, location: 'Navi Mumbai APMC', buyer: 'DeHaat Procurement', isBulk: true, status: 'OPEN', demandLevel: 'MODERATE', availableSupplyKg: 35000 },
    { id: 'dem-003', crop: 'Tomato', qty: 50, targetDate: '2026-09-10', maxPrice: 32.0, location: 'Manchar Rural, Pune', buyer: 'Sharma Family (Consumer)', isBulk: false, status: 'OPEN', demandLevel: 'HIGH', availableSupplyKg: 40 }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCrop, setNewCrop] = useState('Tomato');
  const [newQty, setNewQty] = useState('5000');
  const [newPrice, setNewPrice] = useState('26');
  const [newDate, setNewDate] = useState('2026-09-22');
  const [newLocation, setNewLocation] = useState('Indore, MP');

  const handleCreateDemand = (e: React.FormEvent) => {
    e.preventDefault();
    const created = {
      id: `dem-00${demands.length + 1}`,
      crop: newCrop,
      qty: parseFloat(newQty),
      targetDate: newDate,
      maxPrice: parseFloat(newPrice),
      location: newLocation,
      buyer: currentRole === 'CONSUMER' ? 'Household Consumer' : 'Bulk Buyer Org',
      isBulk: currentRole !== 'CONSUMER',
      status: 'OPEN',
      demandLevel: 'HIGH',
      availableSupplyKg: 0
    };
    setDemands([created, ...demands]);
    setShowModal(false);
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={22} color="#10b981" /> Expected Buyer Demand (வாங்குபவர் தேவைகள்)
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
            Live buyer requirements posted before harvest to connect directly with farmers
          </p>
        </div>

        {(currentRole === 'BULK_BUYER' || currentRole === 'CONSUMER' || currentRole === 'ADMIN') && (
          <button className="btn-emerald" onClick={() => setShowModal(true)}>
            <PlusCircle size={18} /> Post Buyer Requirement
          </button>
        )}
      </div>

      {/* Demand Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        {demands.map((dem) => {
          const isHigh = dem.demandLevel === 'HIGH' || dem.qty >= 10000;
          return (
            <div key={dem.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '14px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <span className={`badge-tag ${isHigh ? 'badge-demand-high' : 'badge-demand-mid'}`}>
                    {isHigh ? '🟢 High Demand' : '🟡 Moderate Demand'}
                  </span>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{dem.maxPrice}/kg</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  🌾 {dem.crop}
                </h3>
              </div>

              {/* Demand vs Supply Metric Box */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#cbd5e1' }}>Buyer Requirement:</span>
                  <strong style={{ color: '#fff' }}>{dem.qty.toLocaleString('en-IN')} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#cbd5e1' }}>Available Supply:</span>
                  <strong style={{ color: '#38bdf8' }}>{(dem.availableSupplyKg || dem.qty * 0.8).toLocaleString('en-IN')} kg</strong>
                </div>
              </div>

              <div style={{ fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#fbbf24" /> <strong>Target Harvest Date:</strong> {dem.targetDate}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#38bdf8" /> <strong>Location:</strong> {dem.location}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
                  Posted by: {dem.buyer}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {(currentRole === 'FARMER' || currentRole === 'FPO') ? (
                  <button className="btn-emerald" style={{ width: '100%', fontSize: '0.95rem', padding: '12px', minHeight: '44px' }}>
                    Sell Crop to this Buyer →
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Broadcasted to Nearby Farmers
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', border: '1.5px solid #10b981' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
              Post Future Crop Demand
            </h3>
            <form onSubmit={handleCreateDemand} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Crop Name</label>
                <select value={newCrop} onChange={(e) => setNewCrop(e.target.value)} className="input-large">
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Potato">Potato</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Moong (Green Gram)">Moong (Green Gram)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Required Quantity (kg)</label>
                <input type="number" value={newQty} onChange={(e) => setNewQty(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Max Agreed Price (₹/kg)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Target Delivery Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} className="input-large" />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Delivery Location</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} className="input-large" />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1, padding: '12px 20px', minHeight: '48px' }}>Submit Requirement</button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ padding: '12px 16px', minHeight: '48px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
