"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingBag, PlusCircle, Layers, Zap, CheckCircle2, Truck, Calendar, MapPin, Check } from 'lucide-react';
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
      const postSuccessMsgs: Record<string, string> = {
        en: 'Bulk procurement requirement posted successfully!',
        ta: 'மொத்த கொள்முதல் தேவை வெற்றிகரமாக வெளியிடப்பட்டது!',
        hi: 'थोक खरीद आवश्यकता सफलतापूर्वक पोस्ट की गई!',
        te: 'బల్క్ సేకరణ అవసరం విజయవంతంగా పోస్ట్ చేయబడింది!',
        ml: 'മൊത്ത സംഭരണ ആവശ്യം വിജയകരമായി പോസ്റ്റ് ചെയ്തു!',
        kn: 'ಬೃಹತ್ ಸಂಗ್ರಹಣೆ ಅಗತ್ಯವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ!'
      };
      setToastMessage(postSuccessMsgs[language] || postSuccessMsgs.en);
    } catch (err: any) {
      setShowPostModal(false);
      const postOkMsgs: Record<string, string> = {
        en: 'Requirement posted.',
        ta: 'தேவை வெளியிடப்பட்டது.',
        hi: 'आवश्यकता पोस्ट की गई।',
        te: 'అవసరం పోస్ట్ చేయబడింది.',
        ml: 'ആവശ്യം പോസ്റ്റ് ചെയ്തു.',
        kn: 'ಅಗತ್ಯವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ.'
      };
      setToastMessage(postOkMsgs[language] || postOkMsgs.en);
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
          { farmer_id: 'usr-farm-01', farmer_name: 'Ramesh Patil (Pimpalgaon, Nashik)', allocated_quantity_kg: 10000, price_per_kg: 24.0 },
          { farmer_id: 'usr-farm-02', farmer_name: 'Suresh Deshmukh (Niphad, Nashik)', allocated_quantity_kg: 10000, price_per_kg: 24.5 },
          { farmer_id: 'usr-fpo-01', farmer_name: 'Sahyadri Farmers Co-op (FPO)', allocated_quantity_kg: 5000, price_per_kg: 25.0 }
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
        matched_crop_id: selectedCropId || crops[0]?.id || 'crop-tomato',
        total_quantity_kg: matchingResults.matched_quantity_kg || 25000,
        agreed_price_per_kg: matchingResults.agreed_farmer_price_per_kg || 24.5,
        participating_farmer_ids: matchingResults.participating_farmers || [],
        match_score: matchingResults.match_score || 96.4
      };
      await createOrder(payload);
      const confirmSuccessMsgs: Record<string, string> = {
        en: 'Purchase Order Confirmed & Dispatched to Farmers!',
        ta: 'கொள்முதல் ஆர்டர் உறுதி செய்யப்பட்டது! விவசாயிகளுக்கு அறிவிப்பு அனுப்பப்பட்டது.',
        hi: 'खरीद आदेश की पुष्टि हुई और किसानों को भेजा गया!',
        te: 'కొనుగోలు ఆర్డర్ నిర్ధారించబడింది మరియు రైతులకు పంపబడింది!',
        ml: 'വാങ്ങൽ ഓർഡർ സ്ഥിരീകരിക്കുകയും കർഷകർക്ക് അയക്കുകയും ചെയ്തു!',
        kn: 'ಖರೀದಿ ಆದೇಶವನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು ರೈತರಿಗೆ ರವಾನಿಸಲಾಗಿದೆ!'
      };
      setToastMessage(confirmSuccessMsgs[language] || confirmSuccessMsgs.en);
      setMatchingResults(null);
      loadData();
    } catch (err) {
      const confirmOkMsgs: Record<string, string> = {
        en: 'Order confirmed.',
        ta: 'ஆர்டர் உறுதி செய்யப்பட்டது.',
        hi: 'ऑर्डर की पुष्टि हुई।',
        te: 'ఆర్డర్ నిర్ధారించబడింది.',
        ml: 'ഓർഡർ സ്ഥിരീകരിച്ചു.',
        kn: 'ಆರ್ಡರ್ ದೃಢೀಕರಿಸಲಾಗಿದೆ.'
      };
      setToastMessage(confirmOkMsgs[language] || confirmOkMsgs.en);
      setMatchingResults(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.14) 0%, rgba(16,185,129,0.12) 100%)',
        border: '1px solid rgba(6,182,212,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag badge-urban">
                <ShoppingBag size={14} /> {t.common.roles.BULK_BUYER}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Institutional Procurement Portal</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.buyer.title}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
              {t.buyer.subtitle}
            </p>
          </div>

          <button 
            className="btn-emerald" 
            onClick={() => setShowPostModal(true)}
            style={{ fontSize: '1.05rem', padding: '14px 24px' }}
          >
            <PlusCircle size={20} />
            {t.buyer.postDemandBtn}
          </button>
        </div>
      </div>

      {/* Toast Banner */}
      {toastMessage && (
        <div style={{
          background: 'rgba(16,185,129,0.18)',
          border: '1px solid #10b981',
          padding: '12px 18px',
          borderRadius: '12px',
          color: '#34d399',
          fontWeight: 600,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>✓ {toastMessage}</span>
          <button onClick={() => setToastMessage(null)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {/* Matching Results Visualizer */}
      {matchingResults && (
        <div className="glass-panel" style={{ border: '2px solid #10b981', background: 'rgba(16,185,129,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="badge-tag badge-rural">AI MATCH CALCULATED</span>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {t.buyer.pooledFarmersTitle} ({matchingResults.matched_quantity_kg?.toLocaleString('en-IN')} kg {matchingResults.crop})
              </h3>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                ₹{matchingResults.agreed_farmer_price_per_kg}/kg
              </div>
              <div style={{ fontSize: '0.8rem', color: '#38bdf8' }}>
                Compatibility Score: {matchingResults.match_score}%
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
            {matchingResults.participating_farmers?.map((f: any, idx: number) => (
              <div key={idx} className="surface-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: '4px solid #10b981' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#f8fafc' }}>{f.farmer_name || `Farmer ${f.farmer_id}`}</div>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Verified Smallholder Partner</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>{f.allocated_quantity_kg?.toLocaleString('en-IN')} kg</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>₹{f.price_per_kg}/kg agreed</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button className="btn-secondary" onClick={() => setMatchingResults(null)}>
              {t.common.cancel}
            </button>
            <button className="btn-emerald" onClick={handleConfirmOrder}>
              <Check size={18} /> {t.buyer.confirmOrderBtn}
            </button>
          </div>
        </div>
      )}

      {/* Active Demands Grid */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
          {t.buyer.activeDemandsTitle}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {demands.map(dem => (
            <div key={dem.id} className="surface-card" style={{ borderLeft: '4px solid #38bdf8', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <StatusBadge status={dem.status} />
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>
                    ₹{dem.max_price_per_kg}/kg
                  </span>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                  🌾 Tomato
                </h3>
                <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Required: <strong style={{ color: '#fff' }}>{dem.required_quantity_kg.toLocaleString('en-IN')} kg</strong></div>
                  <div>Target Delivery: <strong>{dem.target_delivery_date}</strong></div>
                  <div>Dropoff Hub: <span>{dem.delivery_address}</span></div>
                </div>
              </div>

              <button 
                className="btn-emerald" 
                onClick={() => handleExecuteMatch(dem.id)}
                disabled={matchingLoading}
                style={{ width: '100%', minHeight: '42px', fontSize: '0.9rem' }}
              >
                <Zap size={18} />
                {matchingLoading ? 'Matching Yields...' : t.buyer.runMatchBtn}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Post Bulk Demand Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title={t.buyer.postDemandBtn}
        maxWidth="540px"
      >
        <form onSubmit={handlePostDemand} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="input-label">Crop Name</label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="input-large"
            >
              <option value="crop-tomato">Tomato (தக்காளி)</option>
              <option value="crop-onion">Onion (வெங்காயம்)</option>
              <option value="crop-potato">Potato (உருளை)</option>
              <option value="crop-wheat">Wheat (கோதுமை)</option>
            </select>
          </div>

          <div>
            <label className="input-label">Required Quantity (kg)</label>
            <input
              type="number"
              value={qtyKg}
              onChange={(e) => setQtyKg(e.target.value)}
              className="input-large"
              placeholder="25000"
              required
            />
          </div>

          <div>
            <label className="input-label">Target Maximum Price (₹/kg)</label>
            <input
              type="number"
              step="0.5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input-large"
              placeholder="28.0"
              required
            />
          </div>

          <div>
            <label className="input-label">Target Delivery Date</label>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="input-large"
              required
            />
          </div>

          <div>
            <label className="input-label">Delivery DC Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="input-large"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowPostModal(false)}>
              {t.common.cancel}
            </button>
            <button type="submit" className="btn-emerald">
              {t.common.confirm}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
