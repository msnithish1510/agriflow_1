"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sprout, Package, PlusCircle, Bell, TrendingUp, Calendar, MapPin, 
  CheckCircle, AlertCircle, ShoppingBag, ArrowRight, ArrowLeft, 
  HelpCircle, DollarSign, Users, Truck, Check, Eye
} from 'lucide-react';
import { Crop, ExpectedSupply, AvailableStock, DemandPost, OrderMatch, NotificationItem } from '@/types';
import { 
  fetchCrops, createExpectedSupply, createAvailableStock, fetchExpectedSupplies, 
  fetchAvailableStocks, fetchDemands, fetchOrders, fetchNotifications, markNotificationRead,
  fetchAdvisoryGuidance
} from '@/services/api';
import { Language, translations } from '@/services/translations';

interface FarmerWorkflowProps {
  language?: Language;
}

export const FarmerWorkflow: React.FC<FarmerWorkflowProps> = ({ language = 'en' }) => {
  const t = translations[language] || translations.en;

  const [activeTab, setActiveTab] = useState<'dashboard' | 'supplies' | 'stocks' | 'demands' | 'orders' | 'notifications' | 'earnings'>('dashboard');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [mySupplies, setMySupplies] = useState<ExpectedSupply[]>([]);
  const [myStocks, setMyStocks] = useState<AvailableStock[]>([]);
  const [demandOpps, setDemandOpps] = useState<DemandPost[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState(t.loadingMessages.syncing);
  const [userFriendlyMsg, setUserFriendlyMsg] = useState<string | null>(null);

  // 5-Step Crop Entry Wizard States
  const [showCropWizard, setShowCropWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardMode, setWizardMode] = useState<'EXPECTED' | 'STOCK'>('EXPECTED');

  const [selectedCropId, setSelectedCropId] = useState('');
  const [selectedCropName, setSelectedCropName] = useState('Tomato');
  const [qtyKg, setQtyKg] = useState('5000');
  const [pricePerKg, setPricePerKg] = useState('24.0');
  const [targetDate, setTargetDate] = useState('2026-09-25');
  const [grade, setGrade] = useState<'GRADE_A' | 'GRADE_B' | 'ORGANIC' | 'EXPORT'>('GRADE_A');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setLoadingText(t.loadingMessages.syncing);
    try {
      const cropsData = await fetchCrops();
      setCrops(cropsData);
      if (cropsData.length > 0) {
        setSelectedCropId(cropsData[0].id);
        setSelectedCropName(cropsData[0].name);
      }

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
      setUserFriendlyMsg(t.errorMessages.general);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCropWizard = (mode: 'EXPECTED' | 'STOCK' = 'EXPECTED') => {
    setWizardMode(mode);
    setWizardStep(1);
    setFormError(null);
    setShowCropWizard(true);
  };

  const handleCropSelect = (cropId: string) => {
    setSelectedCropId(cropId);
    const found = crops.find(c => c.id === cropId);
    if (found) {
      setSelectedCropName(found.name);
      if (found.indicative_base_price_per_kg) {
        setPricePerKg(found.indicative_base_price_per_kg.toString());
      }
    }
  };

  const handleStepNext = () => {
    setFormError(null);
    if (wizardStep === 2) {
      const q = parseFloat(qtyKg);
      if (isNaN(q) || q <= 0) {
        setFormError(t.errorMessages.quantityInvalid);
        return;
      }
    } else if (wizardStep === 4) {
      const p = parseFloat(pricePerKg);
      if (isNaN(p) || p <= 0) {
        setFormError(t.errorMessages.priceInvalid);
        return;
      }
    }
    setWizardStep(prev => Math.min(prev + 1, 5));
  };

  const handleStepBack = () => {
    setFormError(null);
    setWizardStep(prev => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setLoadingText(t.loadingMessages.savingCrop);
    setFormError(null);

    try {
      if (wizardMode === 'EXPECTED') {
        const payload = {
          crop_id: selectedCropId || crops[0]?.id || 'crop-tomato',
          expected_quantity_kg: parseFloat(qtyKg),
          expected_harvest_date: targetDate,
          min_price_per_kg: parseFloat(pricePerKg),
          quality_grade: grade,
          farm_latitude: 20.1741,
          farm_longitude: 73.9871
        };
        await createExpectedSupply(payload);
      } else {
        const payload = {
          crop_id: selectedCropId || crops[0]?.id || 'crop-tomato',
          available_quantity_kg: parseFloat(qtyKg),
          price_per_kg: parseFloat(pricePerKg),
          harvest_date: targetDate,
          shelf_life_remaining_days: 10,
          quality_grade: grade,
          location_latitude: 20.1741,
          location_longitude: 73.9871
        };
        await createAvailableStock(payload);
      }
      setShowCropWizard(false);
      setUserFriendlyMsg(language === 'ta' ? 'உங்கள் பயிர் விவரங்கள் வெற்றிகரமாகச் சேமிக்கப்பட்டன!' : 'Your crop details have been saved successfully!');
      loadData();
    } catch (err: any) {
      // In demo offline mode
      setShowCropWizard(false);
      setUserFriendlyMsg(language === 'ta' ? 'உங்கள் பயிர் விவரங்கள் சேமிக்கப்பட்டன.' : 'Crop details saved.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadNotification = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const totalYield = mySupplies.reduce((acc, s) => acc + (s.expected_quantity_kg || 0), 0);
  const totalStock = myStocks.reduce((acc, s) => acc + (s.available_quantity_kg || 0), 0);
  const totalEarningsEst = mySupplies.reduce((acc, s) => acc + ((s.expected_quantity_kg || 0) * (s.min_price_per_kg || 0) * 0.95), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* 1. Welcoming Farmer Header */}
      <div className="glass-panel" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(6,182,212,0.12) 100%)', border: '1px solid rgba(16,185,129,0.3)', padding: '22px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {t.welcomeTitle}
            </h1>
            <p style={{ fontSize: '0.95rem', color: '#cbd5e1', marginTop: '4px' }}>
              {t.welcomeSubtitle}
            </p>
          </div>

          <button 
            className="btn-emerald" 
            onClick={() => handleOpenCropWizard('EXPECTED')}
            style={{ fontSize: '1.05rem', padding: '14px 26px', boxShadow: '0 6px 20px rgba(16,185,129,0.45)' }}
          >
            <PlusCircle size={22} /> {t.quickActions.addCrop}
          </button>
        </div>
      </div>

      {/* User Friendly Notification Banner */}
      {userFriendlyMsg && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', padding: '14px 18px', borderRadius: '12px', color: '#34d399', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>✓ {userFriendlyMsg}</span>
          <button onClick={() => setUserFriendlyMsg(null)} style={{ background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Loading State with Plain Language */}
      {loading && (
        <div style={{ padding: '14px 18px', background: 'rgba(6,182,212,0.15)', color: '#38bdf8', borderRadius: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(6,182,212,0.3)' }}>
          <span style={{ fontSize: '1.2rem' }}>⏳</span> {loadingText}
        </div>
      )}

      {/* Navigation Pill Bar (Mobile Scrollable) */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px' }}>
        {[
          { id: 'dashboard', label: t.farmerTabs.overview },
          { id: 'supplies', label: t.farmerTabs.myCrops },
          { id: 'stocks', label: t.farmerTabs.currentStock },
          { id: 'demands', label: t.farmerTabs.buyerOpportunities },
          { id: 'orders', label: t.farmerTabs.orders },
          { id: 'notifications', label: `${t.farmerTabs.alerts} (${notifications.filter(n => !n.is_read).length})` },
          { id: 'earnings', label: t.farmerTabs.suggestedPrice }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              borderRadius: '24px',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
              color: activeTab === tab.id ? '#ffffff' : '#cbd5e1',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              minHeight: '44px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================================================== */}
      {/* 1. DASHBOARD OVERVIEW */}
      {/* ==================================================== */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Quick Action Grid (Large Touch Cards) */}
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '12px', color: '#cbd5e1' }}>
              {language === 'ta' ? 'முக்கிய செயல்கள் (Quick Actions)' : 'What would you like to do?'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div className="action-card" onClick={() => handleOpenCropWizard('EXPECTED')} style={{ borderLeft: '4px solid #10b981' }}>
                <div style={{ fontSize: '1.8rem' }}>🌾</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#10b981' }}>{t.quickActions.addCrop}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.addCropSub}</div>
                </div>
              </div>

              <div className="action-card" onClick={() => setActiveTab('demands')} style={{ borderLeft: '4px solid #38bdf8' }}>
                <div style={{ fontSize: '1.8rem' }}>📊</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#38bdf8' }}>{t.quickActions.viewDemand}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.viewDemandSub}</div>
                </div>
              </div>

              <div className="action-card" onClick={() => setActiveTab('earnings')} style={{ borderLeft: '4px solid #f59e0b' }}>
                <div style={{ fontSize: '1.8rem' }}>💰</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fbbf24' }}>{t.quickActions.suggestedPrice}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.suggestedPriceSub}</div>
                </div>
              </div>

              <div className="action-card" onClick={() => setActiveTab('demands')} style={{ borderLeft: '4px solid #a855f7' }}>
                <div style={{ fontSize: '1.8rem' }}>🤝</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#c084fc' }}>{t.quickActions.findBuyers}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.findBuyersSub}</div>
                </div>
              </div>

              <div className="action-card" onClick={() => setActiveTab('orders')} style={{ borderLeft: '4px solid #06b6d4' }}>
                <div style={{ fontSize: '1.8rem' }}>🚚</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#38bdf8' }}>{t.quickActions.delivery}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.deliverySub}</div>
                </div>
              </div>

              <div className="action-card" onClick={() => setActiveTab('notifications')} style={{ borderLeft: '4px solid #ec4899' }}>
                <div style={{ fontSize: '1.8rem' }}>🔔</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#f472b6' }}>{t.quickActions.alerts}</div>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '2px' }}>{t.quickActions.alertsSub}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                🌾 {language === 'ta' ? 'எதிர்பார்க்கும் அறுவடை அளவு' : 'YOUR DECLARED HARVEST'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>
                {totalYield.toLocaleString('en-IN')} kg
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                {mySupplies.length} {language === 'ta' ? 'செயலில் உள்ள பயிர்கள்' : 'Active Crop Details'}
              </div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '5px solid #38bdf8' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                💡 {language === 'ta' ? 'வாங்குபவர் தேவைகள்' : 'EXPECTED BUYER DEMAND'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '6px' }}>
                {demandOpps.length} {language === 'ta' ? 'தேவைகள்' : 'Requirements'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '4px' }}>
                {language === 'ta' ? 'உங்கள் பகுதியில் உள்ள வாங்குபவர்கள்' : 'Active buyers near your location'}
              </div>
            </div>

            <div className="glass-panel" style={{ borderLeft: '5px solid #f59e0b' }}>
              <span style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                💰 {language === 'ta' ? 'மதிப்பிடப்பட்ட நேரடி வருவாய்' : 'ESTIMATED DIRECT PAYOUT'}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24', marginTop: '6px' }}>
                ₹{totalEarningsEst.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#34d399', marginTop: '4px' }}>
                {language === 'ta' ? 'இடைத்தரகர் கட்டணங்கள் இல்லாத நேரடித் தொகை' : 'Direct payout without middleman cuts'}
              </div>
            </div>
          </div>

          {/* Quick Dual Action Buttons for Mobile Farmers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
            <button 
              className="btn-emerald" 
              style={{ padding: '18px', fontSize: '1.1rem', justifyContent: 'center' }} 
              onClick={() => handleOpenCropWizard('EXPECTED')}
            >
              <PlusCircle size={24} /> {language === 'ta' ? '🌾 பயிர் விவரங்களை உள்ளிடவும்' : '🌾 Declare Expected Harvest Yield'}
            </button>
            <button 
              className="btn-emerald" 
              style={{ padding: '18px', fontSize: '1.1rem', justifyContent: 'center', background: 'linear-gradient(135deg, #06b6d4, #0284c7)' }} 
              onClick={() => handleOpenCropWizard('STOCK')}
            >
              <Package size={24} /> {language === 'ta' ? '📦 அறுவடை செய்த கையிருப்பை விற்க' : '📦 List Available Harvest Stock'}
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MY CROPS / HARVEST DECLARATIONS */}
      {/* ==================================================== */}
      {activeTab === 'supplies' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
                🌾 {language === 'ta' ? 'உங்கள் பயிர் விவரங்கள் (Crop Details)' : 'Your Crop Details & Harvest Plan'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {language === 'ta' ? 'வாங்குபவர்கள் இந்த விவரங்களின் அடிப்படையில் உங்களை அணுகுவார்கள்' : 'Buyers will see these details and propose matches prior to harvest'}
              </p>
            </div>
            <button className="btn-emerald" onClick={() => handleOpenCropWizard('EXPECTED')}>
              <PlusCircle size={18} /> {language === 'ta' ? 'புதிய பயிர் சேர்க்க' : 'Add New Crop'}
            </button>
          </div>

          {mySupplies.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🌾</div>
              <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>
                {language === 'ta' ? 'இன்னும் பயிர் விவரங்கள் சேர்க்கப்படவில்லை.' : 'No crop declarations submitted yet.'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                {language === 'ta' ? '"புதிய பயிர் சேர்க்க" பொத்தானைக் கிளிக் செய்யவும்.' : 'Click "Add New Crop" to declare what you are growing.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {mySupplies.map(sup => (
                <div key={sup.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.25)', borderLeft: '4px solid #10b981' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge-tag badge-rural">{sup.status}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#10b981' }}>₹{sup.min_price_per_kg}/kg</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                    🌾 {crops.find(c => c.id === sup.crop_id)?.name || sup.crop_id}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>📦 <strong>{language === 'ta' ? 'எதிர்பார்க்கும் அளவு' : 'Expected Quantity'}:</strong> {sup.expected_quantity_kg.toLocaleString('en-IN')} kg</div>
                    <div>📅 <strong>{language === 'ta' ? 'அறுவடை தேதி' : 'Harvest Date'}:</strong> {sup.expected_harvest_date}</div>
                    <div>⭐ <strong>{language === 'ta' ? 'தரம்' : 'Quality'}:</strong> {sup.quality_grade || 'GRADE_A'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CURRENT STOCK */}
      {/* ==================================================== */}
      {activeTab === 'stocks' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc' }}>
                📦 {language === 'ta' ? 'கையிருப்பு விவரங்கள் (Current Stock)' : 'Current Harvested Stock'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {language === 'ta' ? 'ஏற்கனவே அறுவடை செய்யப்பட்ட பயிர்களை உடனடி விற்பனைக்கு வைக்கலாம்' : 'List produce that has already been harvested for immediate buyer purchase'}
              </p>
            </div>
            <button className="btn-emerald" onClick={() => handleOpenCropWizard('STOCK')}>
              <Package size={18} /> {language === 'ta' ? 'கையிருப்பு சேர்க்க' : 'Add Harvested Stock'}
            </button>
          </div>

          {myStocks.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📦</div>
              <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>
                {language === 'ta' ? 'கையிருப்பு எதுவும் சேர்க்கப்படவில்லை.' : 'No current stock listed.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {myStocks.map(stk => (
                <div key={stk.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(6,182,212,0.25)', borderLeft: '4px solid #06b6d4' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="badge-tag badge-urban">{stk.status}</span>
                    <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#38bdf8' }}>₹{stk.price_per_kg}/kg</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                    📦 {crops.find(c => c.id === stk.crop_id)?.name || stk.crop_id}
                  </h3>
                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>📦 <strong>{language === 'ta' ? 'இருப்பு அளவு' : 'Available Stock'}:</strong> {stk.available_quantity_kg.toLocaleString('en-IN')} kg</div>
                    <div>⏳ <strong>{language === 'ta' ? 'மீதமுள்ள நாட்கள்' : 'Shelf Life'}:</strong> {stk.shelf_life_remaining_days} days</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 4. BUYER DEMAND OPPORTUNITIES */}
      {/* ==================================================== */}
      {activeTab === 'demands' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🤝 {language === 'ta' ? 'வாங்குபவர் தேவைகள் (Expected Buyer Demand)' : 'Live Expected Buyer Demand'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {language === 'ta' ? 'வாங்குபவர்கள் கேட்கும் தேவைகள். உங்கள் பயிரை விற்க இணக்கமாக உள்ளவற்றைத் தேர்ந்தெடுக்கவும்.' : 'Buyers looking for harvest produce. Select matching demands to sell directly.'}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {demandOpps.map(d => {
              const cropName = crops.find(c => c.id === d.crop_id)?.name || 'Crop';
              return (
                <div key={d.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '18px', borderRadius: '14px', border: '1px solid rgba(16,185,129,0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge-tag badge-demand-high">
                      {t.demandLevels.high}
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#10b981' }}>₹{d.max_price_per_kg}/kg</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                    🌾 {cropName}
                  </h3>

                  <div style={{ fontSize: '0.9rem', color: '#cbd5e1', margin: '10px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <div>📦 <strong>{language === 'ta' ? 'தேவையான அளவு' : 'Buyer Requirement'}:</strong> {d.required_quantity_kg.toLocaleString('en-IN')} kg</div>
                    <div>📍 <strong>{language === 'ta' ? 'இடம்' : 'Location'}:</strong> {d.delivery_address}</div>
                    <div>📅 <strong>{language === 'ta' ? 'தேவையான தேதி' : 'Target Date'}:</strong> {d.target_delivery_date}</div>
                  </div>

                  <button 
                    className="btn-emerald" 
                    style={{ width: '100%', fontSize: '0.92rem', padding: '12px', minHeight: '44px' }}
                    onClick={() => handleOpenCropWizard('EXPECTED')}
                  >
                    {language === 'ta' ? '🤝 வாங்குபவருடன் இணையவும்' : '🤝 Match Your Crop with this Buyer'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5. INCOMING ORDERS */}
      {/* ==================================================== */}
      {activeTab === 'orders' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🚚 {language === 'ta' ? 'உங்கள் ஆர்டர்கள் மற்றும் டெலிவரி' : 'Your Orders & Delivery Tracker'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {language === 'ta' ? 'உறுதிசெய்யப்பட்ட ஆர்டர்கள் மற்றும் போக்குவரத்து நிலை' : 'Confirmed crop sales and direct pickup status'}
            </p>
          </div>

          {myOrders.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>🚚</div>
              <p style={{ fontSize: '1rem', color: '#cbd5e1' }}>
                {language === 'ta' ? 'இன்னும் ஆர்டர்கள் இல்லை.' : 'No confirmed orders yet.'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                {language === 'ta' ? 'பயிர் விவரங்களை உள்ளிட்ட பிறகு வாங்குபவர் ஆர்டர்கள் இங்கு தோன்றும்.' : 'Post your crop details to receive buyer matches and purchase orders.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myOrders.map(ord => (
                <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.35)', padding: '16px 20px', borderRadius: '12px', borderLeft: '5px solid #10b981', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <span className="badge-tag badge-rural">{ord.status}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: '6px' }}>
                      {language === 'ta' ? 'ஆர்டர் எண்' : 'Order'} #{ord.id.substring(0,8)}
                    </h4>
                    <div style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
                      {language === 'ta' ? 'மொத்த அளவு' : 'Quantity'}: {ord.total_matched_quantity_kg.toLocaleString('en-IN')} kg
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981' }}>₹{ord.agreed_farmer_price_per_kg}/kg</div>
                    <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontWeight: 600 }}>
                      {language === 'ta' ? 'மொத்தத் தொகை' : 'Total'}: ₹{ord.total_amount_inr?.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. ALERTS */}
      {/* ==================================================== */}
      {activeTab === 'notifications' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🔔 {language === 'ta' ? 'முக்கிய அறிவிப்புகள் (Alerts)' : 'Important Alerts & Notifications'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {language === 'ta' ? 'வாங்குபவர் தேவைகள் மற்றும் விலை மாற்றங்கள்' : 'Actionable updates on buyer needs and market prices'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '30px 20px', textAlign: 'center', color: '#94a3b8', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                {language === 'ta' ? 'புதிய அறிவிப்புகள் இல்லை.' : 'No new notifications.'}
              </div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(16,185,129,0.12)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '1rem', color: n.is_read ? '#cbd5e1' : '#ffffff' }}>{n.title}</div>
                    <div style={{ fontSize: '0.88rem', color: '#94a3b8', marginTop: '2px' }}>{n.message}</div>
                  </div>
                  {!n.is_read && (
                    <button 
                      onClick={() => handleReadNotification(n.id)} 
                      style={{ padding: '8px 14px', borderRadius: '8px', background: '#10b981', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', minHeight: '38px' }}
                    >
                      {language === 'ta' ? 'படித்ததாகக் குறிக்க' : 'Mark Read'}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. SUGGESTED PRICE & FINANCIAL BREAKDOWN */}
      {/* ==================================================== */}
      {activeTab === 'earnings' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              💰 {t.priceGuidance.title}
            </h2>
            <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', color: '#fbbf24', marginTop: '8px' }}>
              ℹ️ {t.priceGuidance.disclaimer}
            </div>
          </div>

          <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.25)', padding: '22px', borderRadius: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {language === 'ta' ? 'வாங்குபவர் வழங்கும் சராசரி விலை' : 'Average Market Price'}
                </span>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>₹24.50 / kg</div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {language === 'ta' ? 'கையாளுதல் & போக்குவரத்து' : 'Handling & Transport'}
                </span>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f87171', marginTop: '4px' }}>- ₹1.50 / kg</div>
              </div>
              <div>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  {t.priceGuidance.farmerShare}
                </span>
                <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>₹23.00 / kg</div>
              </div>
            </div>
            
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
              {language === 'ta'
                ? 'AGRIFlow மூலம் விவசாயிகள் இடைத்தரகர் கழிவுகள் இன்றி 93.8% நேரடித் தொகையைப் பெறுகின்றனர்.'
                : 'AGRIFlow eliminates commission agent deductions (traditionally 15-25%), guaranteeing 93.8% direct net payout to smallholder farmers.'}
            </p>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 5-STEP SIMPLE CROP ENTRY WIZARD MODAL */}
      {/* ==================================================== */}
      {showCropWizard && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '520px', maxHeight: '92vh', overflowY: 'auto', border: '1.5px solid #10b981', boxShadow: '0 12px 40px rgba(0,0,0,0.6)' }}>
            
            {/* Wizard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {wizardMode === 'EXPECTED' ? (language === 'ta' ? 'அறுவடை அறிவிப்பு' : 'PRE-HARVEST CROP') : (language === 'ta' ? 'கையிருப்பு விற்பனை' : 'STOCK LISTING')}
                </span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>
                  {t.cropForm.title}
                </h3>
              </div>
              <button 
                onClick={() => setShowCropWizard(false)}
                style={{ background: 'transparent', border: 'none', color: '#cbd5e1', fontSize: '1.4rem', cursor: 'pointer', padding: '4px 8px' }}
              >
                ✕
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="stepper-container">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="stepper-step">
                  <div className={`stepper-circle ${wizardStep === s ? 'active' : (wizardStep > s ? 'completed' : '')}`}>
                    {wizardStep > s ? <Check size={18} /> : s}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: wizardStep === s ? '#34d399' : '#94a3b8', fontWeight: 600 }}>
                    {s === 1 ? 'Crop' : s === 2 ? 'Qty' : s === 3 ? 'Date' : s === 4 ? 'Price' : 'Save'}
                  </span>
                </div>
              ))}
            </div>

            {/* Form Error Banner */}
            {formError && (
              <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid #ef4444', padding: '10px 14px', borderRadius: '8px', color: '#f87171', fontSize: '0.88rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} /> {formError}
              </div>
            )}

            {/* STEP 1: CROP SELECTION */}
            {wizardStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {t.cropForm.step1Title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {t.cropForm.step1Subtitle}
                  </p>
                </div>

                {/* Quick Visual Crop Chips */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px' }}>
                  {crops.map((c) => {
                    const isSelected = selectedCropId === c.id;
                    const emoji = c.name.includes('Tomato') ? '🍅' : c.name.includes('Onion') ? '🧅' : c.name.includes('Potato') ? '🥔' : c.name.includes('Wheat') ? '🌾' : '🌱';
                    return (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => handleCropSelect(c.id)}
                        style={{
                          padding: '12px 8px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                          background: isSelected ? 'rgba(16,185,129,0.2)' : 'rgba(0,0,0,0.3)',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <span style={{ fontSize: '1.6rem' }}>{emoji}</span>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.name}</span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.category}</span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    {t.cropForm.cropLabel} (Dropdown)
                  </label>
                  <select 
                    value={selectedCropId} 
                    onChange={e => handleCropSelect(e.target.value)} 
                    className="input-large"
                  >
                    {crops.map(c => <option key={c.id} value={c.id}>{c.name} ({c.category})</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* STEP 2: QUANTITY */}
            {wizardStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {t.cropForm.step2Title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {t.cropForm.step2Subtitle}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    {t.cropForm.quantityLabel}
                  </label>
                  <input 
                    type="number" 
                    value={qtyKg} 
                    onChange={e => setQtyKg(e.target.value)} 
                    placeholder={t.cropForm.quantityPlaceholder}
                    className="input-large"
                    style={{ fontSize: '1.3rem', fontWeight: 800, color: '#34d399' }}
                  />
                </div>

                {/* Quick Quantity Presets */}
                <div>
                  <span style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                    {language === 'ta' ? 'விரைவு அளவுகள் (Quick Presets):' : 'Tap to set quantity:'}
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['500', '1000', '2500', '5000', '10000', '25000'].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => setQtyKg(amt)}
                        style={{
                          padding: '8px 14px',
                          borderRadius: '8px',
                          background: qtyKg === amt ? '#10b981' : 'rgba(255,255,255,0.06)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          fontWeight: 700,
                          fontSize: '0.85rem',
                          cursor: 'pointer'
                        }}
                      >
                        {parseInt(amt).toLocaleString('en-IN')} kg
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: HARVEST DATE */}
            {wizardStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {t.cropForm.step3Title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {t.cropForm.step3Subtitle}
                  </p>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    {t.cropForm.harvestDateLabel}
                  </label>
                  <input 
                    type="date" 
                    value={targetDate} 
                    onChange={e => setTargetDate(e.target.value)} 
                    className="input-large"
                    style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    {language === 'ta' ? 'தரம் (Quality Grade)' : 'Quality Grade'}
                  </label>
                  <select 
                    value={grade} 
                    onChange={e => setGrade(e.target.value as any)} 
                    className="input-large"
                  >
                    <option value="GRADE_A">Grade A (Premium)</option>
                    <option value="GRADE_B">Grade B (Standard)</option>
                    <option value="ORGANIC">Organic Certified</option>
                    <option value="EXPORT">Export Quality</option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 4: SUGGESTED PRICE */}
            {wizardStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {t.cropForm.step4Title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {t.cropForm.step4Subtitle}
                  </p>
                </div>

                {/* Price Guidance Banner */}
                <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 14px', borderRadius: '10px' }}>
                  <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem', marginBottom: '4px' }}>
                    💰 {language === 'ta' ? 'பரிந்துரைக்கப்பட்ட விலை வரம்பு' : 'Suggested Price Guidance'}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {language === 'ta'
                      ? 'தற்போதைய சந்தை மதிப்பு ₹22 - ₹28 / கிலோ. நீங்களே உங்கள் விலையைத் தீர்மானிக்கலாம்.'
                      : 'Current market range for this crop is ₹22 - ₹28 / kg. You retain full control to set your expected price.'}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    {t.cropForm.priceLabel}
                  </label>
                  <input 
                    type="number" 
                    value={pricePerKg} 
                    onChange={e => setPricePerKg(e.target.value)} 
                    placeholder={t.cropForm.pricePlaceholder}
                    className="input-large"
                    style={{ fontSize: '1.3rem', fontWeight: 800, color: '#fbbf24' }}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW AND SAVE */}
            {wizardStep === 5 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc' }}>
                    {t.cropForm.step5Title}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
                    {t.cropForm.step5Subtitle}
                  </p>
                </div>

                {/* Summary Card */}
                <div style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(16,185,129,0.3)', padding: '16px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>🌾 {t.cropForm.cropLabel}:</span>
                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{selectedCropName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>📦 {t.cropForm.quantityLabel}:</span>
                    <strong style={{ color: '#34d399', fontSize: '1rem' }}>{parseFloat(qtyKg).toLocaleString('en-IN')} kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>📅 {t.cropForm.harvestDateLabel}:</span>
                    <strong style={{ color: '#fff', fontSize: '1rem' }}>{targetDate}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '8px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>💰 {language === 'ta' ? 'விலை' : 'Price'}:</span>
                    <strong style={{ color: '#fbbf24', fontSize: '1.1rem' }}>₹{pricePerKg} / kg</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>📍 {language === 'ta' ? 'இடம்' : 'Location'}:</span>
                    <span style={{ color: '#38bdf8', fontSize: '0.9rem' }}>Nashik, Maharashtra (Default Farm)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Controls (Back & Next / Save) */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {wizardStep > 1 && (
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={handleStepBack}
                  style={{ flex: '0 0 auto', padding: '12px 18px' }}
                >
                  <ArrowLeft size={18} /> {t.cropForm.backBtn}
                </button>
              )}

              {wizardStep < 5 ? (
                <button 
                  type="button" 
                  className="btn-emerald"
                  onClick={handleStepNext}
                  style={{ flex: 1, padding: '12px 20px', justifyContent: 'center' }}
                >
                  {t.cropForm.nextBtn}
                </button>
              ) : (
                <button 
                  type="button" 
                  className="btn-emerald"
                  onClick={handleFinalSubmit}
                  style={{ flex: 1, padding: '12px 20px', justifyContent: 'center', background: 'linear-gradient(135deg, #10b981 0%, #047857 100%)' }}
                >
                  {t.cropForm.saveBtn}
                </button>
              )}

              <button 
                type="button" 
                onClick={() => setShowCropWizard(false)}
                style={{ padding: '12px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer' }}
              >
                {t.cropForm.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
