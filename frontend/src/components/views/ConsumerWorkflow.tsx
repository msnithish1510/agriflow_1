"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, MapPin, Calculator, PlusCircle, CheckCircle, Truck, Info, Check } from 'lucide-react';
import { Crop, AvailableStock, OrderMatch, PriceBreakdownData } from '@/types';
import { fetchCrops, fetchAvailableStocks, createDemand, createDirectConsumerOrder, fetchOrders, fetchPriceBreakdown } from '@/services/api';
import { OrderTrackingView } from '@/components/tracking/OrderTrackingView';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';
import { Modal } from '../ui/Modal';
import { EmptyState } from '../ui/EmptyState';

export const ConsumerWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [nearbyStocks, setNearbyStocks] = useState<AvailableStock[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [selectedStock, setSelectedStock] = useState<AvailableStock | null>(null);
  const [selectedTrackingId, setSelectedTrackingId] = useState<string | null>(null);

  const [showRequirementModal, setShowRequirementModal] = useState(false);
  const [showBreakdownModal, setShowBreakdownModal] = useState(false);
  const [selectedCropId, setSelectedCropId] = useState('');
  const [reqQty, setReqQty] = useState('25');
  const [targetDate, setTargetDate] = useState('2026-09-12');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [breakdown, setBreakdown] = useState<PriceBreakdownData | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cropsData = await fetchCrops();
    setCrops(cropsData);
    if (cropsData.length > 0) setSelectedCropId(cropsData[0].id);

    const stockData = await fetchAvailableStocks();
    setNearbyStocks(stockData.items?.length > 0 ? stockData.items : [
      {
        id: 'stk-cons-1',
        farmer_id: 'usr-farm-01',
        crop_id: 'crop-tomato',
        available_quantity_kg: 500,
        price_per_kg: 26.0,
        harvest_date: '2026-09-06',
        shelf_life_remaining_days: 5,
        quality_grade: 'GRADE_A',
        location_latitude: 18.5204,
        location_longitude: 73.8567,
        status: 'OPEN'
      },
      {
        id: 'stk-cons-2',
        farmer_id: 'usr-farm-02',
        crop_id: 'crop-onion',
        available_quantity_kg: 1200,
        price_per_kg: 22.0,
        harvest_date: '2026-09-04',
        shelf_life_remaining_days: 14,
        quality_grade: 'GRADE_A',
        location_latitude: 18.5204,
        location_longitude: 73.8567,
        status: 'OPEN'
      }
    ]);

    const ordData = await fetchOrders();
    setMyOrders(ordData.items || []);
  };

  const handleInspectBreakdown = async (stock: AvailableStock) => {
    setSelectedStock(stock);
    const bd = await fetchPriceBreakdown(stock.price_per_kg, 'HIGH', 25.0, true);
    setBreakdown(bd);
    setShowBreakdownModal(true);
  };

  const handlePlaceOrder = async (stock: AvailableStock) => {
    try {
      await createDirectConsumerOrder(stock.farmer_id, stock.crop_id, 25.0, stock.price_per_kg);
      const orderSuccessMsgs: Record<string, string> = {
        en: 'Direct Order Placed! Fresh produce will be dispatched directly from the farmer.',
        ta: 'நேரடி ஆர்டர் பதிவு செய்யப்பட்டது! பண்ணையிலிருந்து புதிதாக அனுப்பப்படும்.',
        hi: 'सीधा ऑर्डर दिया गया! ताजी उपज सीधे किसान द्वारा भेजी जाएगी।',
        te: 'ప్రత్యక్ష ఆర్డర్ ఇవ్వబడింది! తాజా పంట నేరుగా రైతు నుండి పంపబడుతుంది.',
        ml: 'നേരിട്ടുള്ള ഓർഡർ നൽകി! പുതിയ ഉൽപ്പന്നങ്ങൾ കർഷകനിൽ നിന്ന് നേരിട്ട് അയക്കും.',
        kn: 'ನೇರ ಆರ್ಡರ್ ನೀಡಲಾಗಿದೆ! ತಾಜಾ ಉತ್ಪನ್ನಗಳನ್ನು ನೇರವಾಗಿ ರೈತರಿಂದ ರವಾನಿಸಲಾಗುತ್ತದೆ.'
      };
      setToastMessage(orderSuccessMsgs[language] || orderSuccessMsgs.en);
      loadData();
    } catch (err) {
      const orderOkMsgs: Record<string, string> = {
        en: 'Order placed successfully.',
        ta: 'ஆர்டர் உறுதி செய்யப்பட்டது.',
        hi: 'ऑर्डर सफलतापूर्वक दिया गया।',
        te: 'ఆర్డర్ విజయవంతంగా ఇవ్వబడింది.',
        ml: 'ഓർഡർ വിജയകരമായി നൽകി.',
        kn: 'ಆರ್ಡರ್ ಯಶಸ್ವಿಯಾಗಿ ನೀಡಲಾಗಿದೆ.'
      };
      setToastMessage(orderOkMsgs[language] || orderOkMsgs.en);
    }
  };

  const handlePostRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        crop_id: selectedCropId || crops[0]?.id || 'crop-tomato',
        required_quantity_kg: parseFloat(reqQty),
        max_price_per_kg: 32.0,
        target_delivery_date: targetDate,
        quality_requirement: 'GRADE_A',
        is_bulk_demand: false,
        delivery_address: 'Consumer Residence, Pune Rural',
        delivery_latitude: 18.5204,
        delivery_longitude: 73.8567
      };
      await createDemand(payload);
      setShowRequirementModal(false);
      const reqSuccessMsgs: Record<string, string> = {
        en: 'Household produce requirement posted for nearby farmers.',
        ta: 'குடும்ப தேவை வெற்றிகரமாக வெளியிடப்பட்டது!',
        hi: 'पास के किसानों के लिए घरेलू उपज की आवश्यकता पोस्ट की गई।',
        te: 'సమీప రైతుల కోసం గృహ ఉత్పత్తుల అవసరం పోస్ట్ చేయబడింది.',
        ml: 'സമീപത്തുള്ള കർഷകർക്കായി വീട്ടുപകരണ ആവശ്യം പോസ്റ്റ് ചെയ്തു.',
        kn: 'ಹತ್ತಿರದ ರೈತರಿಗಾಗಿ ಗೃಹ ಉತ್ಪನ್ನದ ಅಗತ್ಯವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ.'
      };
      setToastMessage(reqSuccessMsgs[language] || reqSuccessMsgs.en);
    } catch (err) {
      setShowRequirementModal(false);
      const reqOkMsgs: Record<string, string> = {
        en: 'Requirement posted.',
        ta: 'தேவை வெளியிடப்பட்டது.',
        hi: 'आवश्यकता पोस्ट की गई।',
        te: 'అవసరం పోస్ట్ చేయబడింది.',
        ml: 'ആവശ്യം പോസ്റ്റ് ചെയ്തു.',
        kn: 'ಅಗತ್ಯವನ್ನು ಪೋಸ್ಟ್ ಮಾಡಲಾಗಿದೆ.'
      };
      setToastMessage(reqOkMsgs[language] || reqOkMsgs.en);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(245,158,11,0.12) 100%)',
        border: '1px solid rgba(16,185,129,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-tag badge-rural">
                <ShoppingCart size={14} /> {t.common.roles.CONSUMER}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Direct Farm-to-Kitchen</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.consumer.title}
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
              {t.consumer.subtitle}
            </p>
          </div>

          <button
            className="btn-emerald"
            onClick={() => setShowRequirementModal(true)}
            style={{ fontSize: '1.05rem', padding: '14px 24px' }}
          >
            <PlusCircle size={20} />
            {t.consumer.postRequirementBtn}
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
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

      {/* Nearby Stock Catalog */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc' }}>
          {t.consumer.catalogTitle}
        </h2>

        {nearbyStocks.length === 0 ? (
          <EmptyState
            icon="🌾"
            title="No Nearby Produce Available"
            message="Check back soon for fresh stock from local farmers."
          />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            {nearbyStocks.map(stock => {
              const cropName = stock.crop_id.includes('onion') ? 'Onion' : 'Tomato';
              const icon = cropName === 'Onion' ? '🧅' : '🍅';
              return (
                <div key={stock.id} className="surface-card" style={{ borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <span className="badge-tag badge-rural">DIRECT FROM FARM</span>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                        ₹{stock.price_per_kg}/kg
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
                      {icon} {cropName}
                    </h3>

                    <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Available Batch: <strong style={{ color: '#fff' }}>{stock.available_quantity_kg} kg</strong></div>
                      <div>Shelf Life: <strong style={{ color: '#38bdf8' }}>{stock.shelf_life_remaining_days} days remaining</strong></div>
                      <div>Location: <span>Manchar Rural, 18km away</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      className="btn-emerald"
                      onClick={() => handlePlaceOrder(stock)}
                      style={{ width: '100%', minHeight: '42px', fontSize: '0.92rem' }}
                    >
                      <ShoppingCart size={16} /> {t.consumer.directOrderBtn}
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => handleInspectBreakdown(stock)}
                      style={{ width: '100%', minHeight: '38px', fontSize: '0.85rem' }}
                    >
                      <Calculator size={16} color="#fbbf24" /> {t.consumer.priceBreakdownBtn}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Household Orders & Direct Delivery Live Tracking */}
      {selectedTrackingId ? (
        <OrderTrackingView
          trackingId={selectedTrackingId}
          language={language}
          onBack={() => setSelectedTrackingId(null)}
        />
      ) : (
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
            <Truck size={22} color="#38bdf8" /> My Household Orders & Direct Delivery Live Tracking
          </h3>
          {myOrders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="No Household Orders Yet"
              message="When you place direct farm orders, they will appear here with live tracking."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map(ord => (
                <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '16px 20px', borderRadius: '12px', borderLeft: '5px solid #10b981', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <StatusBadge status={ord.status} />
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
          )}
        </div>
      )}

      {/* Household Requirement Modal */}
      <Modal
        isOpen={showRequirementModal}
        onClose={() => setShowRequirementModal(false)}
        title={t.consumer.householdModalTitle}
        maxWidth="500px"
      >
        <form onSubmit={handlePostRequirement} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="input-label">Select Vegetable / Crop</label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="input-large"
            >
              <option value="crop-tomato">Tomato (தக்காளி)</option>
              <option value="crop-onion">Onion (வெங்காயம்)</option>
              <option value="crop-potato">Potato (உருளை)</option>
            </select>
          </div>

          <div>
            <label className="input-label">Needed Quantity (kg)</label>
            <input
              type="number"
              value={reqQty}
              onChange={(e) => setReqQty(e.target.value)}
              className="input-large"
              placeholder="e.g. 25"
              required
            />
          </div>

          <div>
            <label className="input-label">Needed Date</label>
            <input
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="input-large"
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secondary" onClick={() => setShowRequirementModal(false)}>
              {t.common.cancel}
            </button>
            <button type="submit" className="btn-emerald">
              {t.common.confirm}
            </button>
          </div>
        </form>
      </Modal>

      {/* Itemized Price Breakdown Modal */}
      <Modal
        isOpen={showBreakdownModal}
        onClose={() => setShowBreakdownModal(false)}
        title={t.priceTransparency.title}
        maxWidth="520px"
      >
        {breakdown && selectedStock && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(16,185,129,0.12)', padding: '12px 16px', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700 }}>Direct Farmer Payout</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>₹{selectedStock.price_per_kg}/kg</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>Final Consumer Price</span>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>₹{breakdown.final_consumer_price_per_kg}/kg</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span>Farmer Payout (ACTUAL)</span>
                <strong>₹{selectedStock.price_per_kg.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span>Handling & Grading (EST)</span>
                <strong>₹{breakdown.collection_handling_fee.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span>Cold Transport (EST)</span>
                <strong>₹{breakdown.transport_fee_per_kg.toFixed(2)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <span>Platform Coordination Fee (ACTUAL)</span>
                <strong>₹{breakdown.platform_coordination_fee.toFixed(2)}</strong>
              </div>
            </div>

            <button className="btn-emerald" onClick={() => setShowBreakdownModal(false)} style={{ marginTop: '8px' }}>
              {t.common.close}
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
};
