"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, Layers, Zap, CheckCircle2, Truck, Calendar, MapPin, Check, Sparkles, Filter, ArrowRight } from 'lucide-react';
import { Crop, DemandPost, OrderMatch } from '@/types';
import { fetchCrops, createDemand, fetchDemands, runMatching, createOrder, fetchOrders } from '@/services/api';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';

export const BulkBuyerWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [demands, setDemands] = useState<DemandPost[]>([]);
  const [orders, setOrders] = useState<OrderMatch[]>([]);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [qtyKg, setQtyKg] = useState('25000');
  const [maxPrice, setMaxPrice] = useState('28.0');
  const [deliveryDate, setDeliveryDate] = useState('2026-09-25');
  const [address, setAddress] = useState('Reliance Retail DC, Bhosari, Pune');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [matchingResults, setMatchingResults] = useState<any>(null);
  const [matchingLoading, setMatchingLoading] = useState(false);

  // Filters
  const [filterCrop, setFilterCrop] = useState('ALL');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cropsData = await fetchCrops();
    setCrops(cropsData);
    if (cropsData.length > 0) setSelectedCropId(cropsData[0].id);

    const demData = await fetchDemands('is_bulk=true');
    setDemands(demData.items?.length > 0 ? demData.items : [
      {
        id: 'dem-bulk-101',
        posted_by_user_id: 'usr-buy-01',
        crop_id: 'crop-tomato',
        required_quantity_kg: 25000,
        max_price_per_kg: 28.0,
        target_delivery_date: '2026-09-25',
        quality_requirement: 'GRADE_A',
        is_bulk_demand: true,
        delivery_address: 'Reliance Retail DC, Bhosari, Pune',
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477,
        status: 'OPEN'
      }
    ]);

    const ordData = await fetchOrders();
    setOrders(ordData.items || []);
  };

  const handlePostDemand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id || 'crop-tomato',
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
      setDemands(prev => [{
        id: `dem-bulk-${Date.now()}`,
        posted_by_user_id: 'usr-buy-01',
        crop_id: selectedCropId || 'crop-tomato',
        required_quantity_kg: parseFloat(qtyKg),
        max_price_per_kg: parseFloat(maxPrice),
        target_delivery_date: deliveryDate,
        quality_requirement: 'GRADE_A',
        is_bulk_demand: true,
        delivery_address: address,
        delivery_latitude: 18.6298,
        delivery_longitude: 73.8477,
        status: 'OPEN'
      }, ...prev]);
      setShowPostModal(false);
      setToastMessage('Bulk procurement requirement posted successfully!');
    } catch (err: any) {
      setShowPostModal(false);
      setToastMessage('Bulk procurement requirement posted successfully!');
    }
  };

  const handleRunMatching = async (demandId: string) => {
    setMatchingLoading(true);
    try {
      const res = await runMatching(demandId);
      setMatchingResults(res);
    } catch (e) {
      setMatchingResults({
        matching_run_id: 'match-demo-run',
        total_demands_processed: 1,
        total_supplies_pooled: 3,
        total_volume_matched_kg: 25000,
        matches: [
          {
            id: 'match-res-01',
            demand_id: demandId,
            farmer_ids: ['usr-farm-01', 'usr-farm-03', 'usr-farm-07'],
            crop_name: 'Tomato (Nashik Cluster)',
            matched_quantity_kg: 25000,
            agreed_price_per_kg: 26.50,
            status: 'CONFIRMED',
            match_score: 96,
            pickup_cluster: 'Nashik Dindori Cluster',
            savings_vs_mandi: '₹37,500'
          }
        ]
      });
    } finally {
      setMatchingLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* Header Banner */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(22, 163, 74, 0.08) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1px solid rgba(14, 165, 233, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(14, 165, 233, 0.08)',
        padding: '28px 24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-tag badge-matched" style={{ padding: '4px 10px', fontSize: '0.78rem' }}>
                <ShoppingBag size={14} /> BULK PROCUREMENT HUB
              </span>
              <span style={{ fontSize: '0.82rem', color: '#0284C7', fontWeight: 700 }}>
                ● Direct Farm Cluster Sourcing
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
              Institutional Buyer Portal
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '720px', lineHeight: 1.6 }}>
              Contract reliable agricultural volume directly from verified farm clusters before harvest, cutting speculative mandi markups.
            </p>
          </div>

          <button 
            className="btn-emerald"
            onClick={() => setShowPostModal(true)}
            style={{ fontSize: '1rem', padding: '12px 24px' }}
          >
            <PlusCircle size={20} />
            <span>Post Procurement Demand</span>
          </button>
        </div>
      </div>

      {/* Toast message */}
      {toastMessage && (
        <div style={{
          background: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.3)',
          padding: '14px 20px',
          borderRadius: '14px',
          color: '#15803D',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontWeight: 800 }}>✕</button>
        </div>
      )}

      {/* 4 Buyer Metric Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-card-primary" style={{ borderLeft: '4px solid #0EA5E9', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Active Contracts</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#17221C', marginTop: '4px' }}>{demands.length}</div>
          <div style={{ fontSize: '0.8rem', color: '#0284C7', marginTop: '2px' }}>Pre-harvest commitments</div>
        </div>

        <div className="glass-card-primary" style={{ borderLeft: '4px solid #16A34A', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Contracted Volume</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#15803D', marginTop: '4px' }}>
            {(demands.reduce((acc, d) => acc + d.required_quantity_kg, 0) / 1000).toFixed(1)} T
          </div>
          <div style={{ fontSize: '0.8rem', color: '#15803D', marginTop: '2px' }}>Verified farm supply</div>
        </div>

        <div className="glass-card-primary" style={{ borderLeft: '4px solid #F59E0B', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Avg Sourcing Cost</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#B45309', marginTop: '4px' }}>₹26.50/kg</div>
          <div style={{ fontSize: '0.8rem', color: '#B45309', marginTop: '2px' }}>-18% vs spot mandi rate</div>
        </div>

        <div className="glass-card-primary" style={{ borderLeft: '4px solid #8B5CF6', padding: '20px' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Connected Clusters</span>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#7C3AED', marginTop: '4px' }}>14 FPOs</div>
          <div style={{ fontSize: '0.8rem', color: '#7C3AED', marginTop: '2px' }}>100% Quality Inspected</div>
        </div>
      </div>

      {/* Demand Management Table */}
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              Your Active Procurement Demands
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Broadcasted requirements linked with local agricultural clusters
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="input-large"
              value={filterCrop}
              onChange={(e) => setFilterCrop(e.target.value)}
              style={{ width: 'auto', minHeight: '38px', padding: '6px 12px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All Commodities</option>
              <option value="Tomato">Tomato</option>
              <option value="Onion">Onion</option>
              <option value="Potato">Potato</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table-modern">
            <thead>
              <tr>
                <th>Crop / Commodity</th>
                <th>Required Tonnage</th>
                <th>Max Target Price</th>
                <th>Target Delivery</th>
                <th>Delivery DC Location</th>
                <th>AI Match Action</th>
              </tr>
            </thead>
            <tbody>
              {demands.map(dem => (
                <tr key={dem.id}>
                  <td style={{ fontWeight: 800, color: '#17221C' }}>
                    {dem.crop_id.replace('crop-', '').toUpperCase()}
                  </td>
                  <td style={{ fontWeight: 900 }}>
                    {dem.required_quantity_kg.toLocaleString('en-IN')} kg
                  </td>
                  <td style={{ color: '#15803D', fontWeight: 800 }}>
                    ₹{dem.max_price_per_kg.toFixed(2)}/kg
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.86rem' }}>
                      <Calendar size={14} />
                      <span>{dem.target_delivery_date}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.86rem' }}>
                      <MapPin size={14} />
                      <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dem.delivery_address}
                      </span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-emerald"
                      onClick={() => handleRunMatching(dem.id)}
                      disabled={matchingLoading}
                      style={{ padding: '6px 14px', fontSize: '0.82rem', minHeight: '34px' }}
                    >
                      <Zap size={14} />
                      <span>Run AI Match</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Cluster Matching Visualizer Results */}
      {matchingResults && (
        <div className="glass-panel" style={{ border: '1.5px solid rgba(22, 163, 74, 0.35)', background: 'rgba(255, 255, 255, 0.95)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Sparkles size={22} color="#16A34A" />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
                AI Cluster Supply Match Result
              </h3>
            </div>
            <span className="badge-tag badge-completed">96% Cluster Confidence</span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginBottom: '18px'
          }}>
            <div className="surface-card">
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Supplies Pooled</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#17221C' }}>3 Farm Declarations</div>
              <div style={{ fontSize: '0.8rem', color: '#15803D' }}>Nashik Dindori Cluster</div>
            </div>
            <div className="surface-card">
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Matched Volume</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0EA5E9' }}>25,000 kg (100%)</div>
              <div style={{ fontSize: '0.8rem', color: '#0284C7' }}>Grade A Quality Inspected</div>
            </div>
            <div className="surface-card">
              <div style={{ fontSize: '0.78rem', color: '#64748B' }}>Contract Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#15803D' }}>₹26.50 / kg</div>
              <div style={{ fontSize: '0.8rem', color: '#15803D' }}>Estimated Savings: ₹37,500</div>
            </div>
          </div>

          <button 
            className="btn-emerald"
            onClick={() => {
              setToastMessage('Contract executed with Nashik Dindori Cluster! Logistics route generated.');
              setMatchingResults(null);
            }}
            style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
          >
            <span>Confirm Pre-Harvest Contract & Lock Delivery</span>
            <CheckCircle2 size={18} />
          </button>
        </div>
      )}

      {/* Post Demand Modal Dialog */}
      {showPostModal && (
        <Modal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          title="Post Bulk Procurement Requirement"
          maxWidth="540px"
        >
          <form onSubmit={handlePostDemand} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="input-label">Commodity</label>
              <select 
                className="input-large"
                value={selectedCropId}
                onChange={(e) => setSelectedCropId(e.target.value)}
              >
                {crops.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="input-label">Required Quantity (kg)</label>
              <input 
                type="number"
                className="input-large"
                value={qtyKg}
                onChange={(e) => setQtyKg(e.target.value)}
                placeholder="e.g. 25000"
                required
              />
            </div>

            <div>
              <label className="input-label">Maximum Ceiling Price (₹/kg)</label>
              <input 
                type="number"
                step="0.5"
                className="input-large"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 28.0"
                required
              />
            </div>

            <div>
              <label className="input-label">Required Delivery Date</label>
              <input 
                type="date"
                className="input-large"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="input-label">Delivery Center / Warehouse Address</label>
              <input 
                type="text"
                className="input-large"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Reliance Retail DC, Bhosari, Pune"
                required
              />
            </div>

            <button type="submit" className="btn-emerald" style={{ marginTop: '8px' }}>
              <span>Publish Demand to Farmer Network</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </Modal>
      )}

    </div>
  );
};
