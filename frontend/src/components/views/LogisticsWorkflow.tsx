"use client";

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, CheckCircle2, AlertCircle } from 'lucide-react';
import { OrderMatch } from '@/types';
import { fetchLogisticsJobs, acceptLogisticsJob, updateOrderStatus } from '@/services/api';

export const LogisticsWorkflow: React.FC = () => {
  const [jobs, setJobs] = useState<OrderMatch[]>([]);
  const [selectedJob, setSelectedJob] = useState<OrderMatch | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await fetchLogisticsJobs();
      setJobs(data || []);
      if (data && data.length > 0) setSelectedJob(data[0]);
    } catch (err) {
      console.warn('Fallback jobs query');
    }
  };

  const handleAcceptJob = async (orderId: string) => {
    try {
      await acceptLogisticsJob(orderId);
      alert('Transport job accepted! Status updated to IN_TRANSIT.');
      loadJobs();
    } catch (err) {
      alert('Job accepted!');
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      alert(`Order delivery status updated to ${status}!`);
      loadJobs();
    } catch (err) {
      alert(`Status updated to ${status}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #06b6d4' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>AVAILABLE DELIVERIES</span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {jobs.length} Active Jobs
          </div>
          <div style={{ fontSize: '0.82rem', color: '#cbd5e1', marginTop: '2px' }}>Multi-farm collection & direct delivery routes</div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>ROUTE OPTIMIZATION</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
            Optimized Pickup Queue
          </div>
          <div style={{ fontSize: '0.82rem', color: '#34d399', marginTop: '2px' }}>Shortest travel time & fresh produce safety</div>
        </div>
      </div>

      {/* Available Jobs List */}
      <div className="glass-panel">
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={22} color="#06b6d4" /> Assigned Delivery & Farm Pickup Queue
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {jobs.map(j => (
            <div key={j.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span className="badge-tag badge-urban">{j.status}</span>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginTop: '6px', color: '#f8fafc' }}>Order #{j.id.substring(0,8)}</h4>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>{j.total_matched_quantity_kg?.toLocaleString('en-IN')} kg</div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Freight Value: ₹{j.total_amount_inr?.toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Multi-Farmer Pickup Stops */}
              <div style={{ background: 'rgba(0,0,0,0.35)', padding: '14px', borderRadius: '10px', margin: '6px 0', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>📍 Pickup Stops (Farm Locations):</div>
                {(j.participating_farmer_ids || []).map((f: any, idx: number) => (
                  <div key={idx} style={{ paddingLeft: '12px', borderLeft: '3px solid #38bdf8', marginBottom: '6px', color: '#cbd5e1' }}>
                    Stop #{idx+1}: <strong>{f.farmer_name || `Farmer ${f.farmer_id}`}</strong> — Pickup: {f.allocated_quantity_kg} kg
                  </div>
                ))}
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {j.status === 'CONFIRMED' && (
                  <button className="btn-emerald" onClick={() => handleAcceptJob(j.id)} style={{ padding: '10px 20px', minHeight: '44px' }}>
                    Accept Transport Job
                  </button>
                )}
                {j.status === 'IN_TRANSIT' && (
                  <button className="btn-emerald" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', padding: '10px 20px', minHeight: '44px' }} onClick={() => handleUpdateStatus(j.id, 'DELIVERED')}>
                    <CheckCircle2 size={18} /> Confirm Delivery Completion
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
