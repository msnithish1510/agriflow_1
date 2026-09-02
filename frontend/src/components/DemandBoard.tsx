"use client";

import React, { useState } from 'react';
import { ShoppingBag, Calendar, MapPin, PlusCircle, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types';

interface DemandBoardProps {
  currentRole: UserRole;
}

export const DemandBoard: React.FC<DemandBoardProps> = ({ currentRole }) => {
  const [demands, setDemands] = useState([
    { id: 'dem-001', crop: 'Tomato', qty: 25000, targetDate: '2026-09-20', maxPrice: 28.0, location: 'Pune, Maharashtra', buyer: 'Reliance Retail DC', isBulk: true, status: 'OPEN' },
    { id: 'dem-002', crop: 'Onion', qty: 40000, targetDate: '2026-09-25', maxPrice: 25.0, location: 'Navi Mumbai APMC', buyer: 'DeHaat Procurement', isBulk: true, status: 'OPEN' },
    { id: 'dem-003', crop: 'Tomato', qty: 50, targetDate: '2026-09-10', maxPrice: 32.0, location: 'Manchar Rural, Pune', buyer: 'Sharma Family (Consumer)', isBulk: false, status: 'OPEN' }
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
      status: 'OPEN'
    };
    setDemands([created, ...demands]);
    setShowModal(false);
  };

  return (
    <div className="glass-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="#10b981" /> Pre-Market Crop Demand Requirements
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Future requirements posted by buyers & consumers prior to harvest</p>
        </div>

        {(currentRole === 'BULK_BUYER' || currentRole === 'CONSUMER' || currentRole === 'ADMIN') && (
          <button className="btn-emerald" onClick={() => setShowModal(true)}>
            <PlusCircle size={18} /> Post Future Demand
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
        {demands.map((dem) => (
          <div key={dem.id} style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className={`badge-tag ${dem.isBulk ? 'badge-urban' : 'badge-rural'}`}>
                  {dem.isBulk ? 'BULK BUYER DEMAND' : 'RURAL CONSUMER'}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '8px', color: '#ffffff' }}>{dem.crop}</h3>
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#10b981' }}>₹{dem.maxPrice}/kg</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
              <div>📦 <strong>Required Quantity:</strong> {dem.qty.toLocaleString('en-IN')} kg</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={14} color="#f59e0b" /> <strong>Target Harvest Date:</strong> {dem.targetDate}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={14} color="#06b6d4" /> {dem.location}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Posted by: {dem.buyer}</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {(currentRole === 'FARMER' || currentRole === 'FPO') ? (
                <button className="btn-emerald" style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}>
                  Declare Harvest to Match
                </button>
              ) : (
                <span style={{ fontSize: '0.8rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 size={14} /> Broadcaster Active to Nearby Farmers
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px' }}>Post Future Crop Demand</h3>
            <form onSubmit={handleCreateDemand} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Crop Name</label>
                <select value={newCrop} onChange={(e) => setNewCrop(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }}>
                  <option value="Tomato">Tomato</option>
                  <option value="Onion">Onion</option>
                  <option value="Potato">Potato</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Moong (Green Gram)">Moong (Green Gram)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Required Quantity (kg)</label>
                <input type="number" value={newQty} onChange={(e) => setNewQty(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Max Agreed Price (₹/kg)</label>
                <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Target Delivery Date</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Delivery Location</label>
                <input type="text" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#090d16', color: '#fff', border: '1px solid #334155' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1 }}>Submit Requirement</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
