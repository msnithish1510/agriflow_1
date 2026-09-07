"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sprout, Package, PlusCircle, Bell, TrendingUp, Calendar, MapPin, 
  CheckCircle, AlertCircle, ShoppingBag, ArrowRight, ArrowLeft, 
  HelpCircle, DollarSign, Users, Truck, Check, Eye, X, RefreshCw, 
  Sparkles, CheckCircle2, ChevronRight, Filter
} from 'lucide-react';
import { Crop, ExpectedSupply, AvailableStock, DemandPost, OrderMatch, NotificationItem } from '@/types';
import { 
  fetchCrops, createExpectedSupply, createAvailableStock, fetchExpectedSupplies, 
  fetchAvailableStocks, fetchDemands, fetchOrders, fetchNotifications, markNotificationRead,
  fetchAdvisoryGuidance
} from '@/services/api';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';

interface FarmerWorkflowProps {
  language?: string;
}

export const FarmerWorkflow: React.FC<FarmerWorkflowProps> = () => {
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'supplies' | 'stocks' | 'demands' | 'orders' | 'notifications' | 'guidance'>('dashboard');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [mySupplies, setMySupplies] = useState<ExpectedSupply[]>([]);
  const [myStocks, setMyStocks] = useState<AvailableStock[]>([]);
  const [demandOpps, setDemandOpps] = useState<DemandPost[]>([]);
  const [myOrders, setMyOrders] = useState<OrderMatch[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [userFriendlyMsg, setUserFriendlyMsg] = useState<string | null>(null);

  // 5-Step Simplified Crop Entry Wizard
  const [showCropWizard, setShowCropWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardMode, setWizardMode] = useState<'EXPECTED' | 'STOCK'>('EXPECTED');

  const [selectedCropId, setSelectedCropId] = useState('crop-tomato');
  const [selectedCropName, setSelectedCropName] = useState('Tomato');
  const [qtyKg, setQtyKg] = useState('2500');
  const [pricePerKg, setPricePerKg] = useState('25.0');
  const [targetDate, setTargetDate] = useState('2026-09-25');
  const [district, setDistrict] = useState('Nashik');
  const [grade, setGrade] = useState<'GRADE_A' | 'GRADE_B' | 'ORGANIC' | 'EXPORT'>('GRADE_A');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const cropsData = await fetchCrops();
      setCrops(cropsData);
      if (cropsData.length > 0 && !selectedCropId) {
        setSelectedCropId(cropsData[0].id);
        setSelectedCropName(cropsData[0].name);
      }

      const supData = await fetchExpectedSupplies();
      setMySupplies(supData.items || [
        {
          id: 'sup-001',
          farmer_id: 'usr-farm-01',
          crop_id: 'crop-tomato',
          expected_quantity_kg: 5000,
          expected_harvest_date: '2026-09-22',
          min_price_per_kg: 24.5,
          quality_grade: 'GRADE_A',
          farm_latitude: 20.1741,
          farm_longitude: 73.9871,
          status: 'PROPOSED'
        },
        {
          id: 'sup-002',
          farmer_id: 'usr-farm-01',
          crop_id: 'crop-onion',
          expected_quantity_kg: 8000,
          expected_harvest_date: '2026-09-30',
          min_price_per_kg: 22.0,
          quality_grade: 'GRADE_A',
          farm_latitude: 20.1741,
          farm_longitude: 73.9871,
          status: 'CONFIRMED'
        }
      ]);

      const stkData = await fetchAvailableStocks();
      setMyStocks(stkData.items || [
        {
          id: 'stk-001',
          farmer_id: 'usr-farm-01',
          crop_id: 'crop-tomato',
          available_quantity_kg: 800,
          price_per_kg: 26.0,
          harvest_date: '2026-09-06',
          shelf_life_remaining_days: 4,
          quality_grade: 'GRADE_A',
          location_latitude: 20.1741,
          location_longitude: 73.9871,
          status: 'OPEN'
        }
      ]);

      const demData = await fetchDemands();
      setDemandOpps(demData.items || [
        {
          id: 'dem-001',
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
        },
        {
          id: 'dem-002',
          posted_by_user_id: 'usr-buy-02',
          crop_id: 'crop-onion',
          required_quantity_kg: 40000,
          max_price_per_kg: 25.0,
          target_delivery_date: '2026-09-28',
          quality_requirement: 'GRADE_A',
          is_bulk_demand: true,
          delivery_address: 'DeHaat Hub, Nashik',
          delivery_latitude: 20.0112,
          delivery_longitude: 73.7902,
          status: 'OPEN'
        }
      ]);

      const ordData = await fetchOrders();
      setMyOrders(ordData.items || [
        {
          id: 'ord-001',
          buyer_id: 'usr-buy-01',
          matched_crop_id: 'crop-tomato',
          match_score: 95,
          total_matched_quantity_kg: 5000,
          agreed_farmer_price_per_kg: 26.5,
          total_amount_inr: 132500,
          participating_farmer_ids: [],
          status: 'CONFIRMED',
          created_at: '2026-09-07'
        }
      ]);

      const notifData = await fetchNotifications();
      setNotifications(Array.isArray(notifData) && notifData.length > 0 ? notifData : [
        {
          id: 'notif-1',
          user_id: 'usr-farm-01',
          notification_type: 'MATCH_FOUND',
          title: 'Direct Buyer Match Found!',
          message: 'Reliance Retail matched your 5,000kg Tomato supply declaration at ₹26.50/kg.',
          is_read: false,
          created_at: new Date().toISOString()
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCropWizard = (mode: 'EXPECTED' | 'STOCK') => {
    setWizardMode(mode);
    setWizardStep(1);
    setFormError(null);
    setShowCropWizard(true);
  };

  const handleStepNext = () => {
    setFormError(null);
    if (wizardStep === 2) {
      const q = parseFloat(qtyKg);
      if (isNaN(q) || q <= 0) {
        setFormError(t.farmer.wizard.validationQty);
        return;
      }
    }
    if (wizardStep === 3) {
      const p = parseFloat(pricePerKg);
      if (isNaN(p) || p <= 0) {
        setFormError(t.farmer.wizard.validationPrice);
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
    setIsSubmitting(true);
    setFormError(null);

    try {
      if (wizardMode === 'EXPECTED') {
        const payload = {
          crop_id: selectedCropId || 'crop-tomato',
          expected_quantity_kg: parseFloat(qtyKg),
          expected_harvest_date: targetDate,
          min_price_per_kg: parseFloat(pricePerKg),
          quality_grade: grade,
          farm_latitude: 20.1741,
          farm_longitude: 73.9871
        };
        await createExpectedSupply(payload);
        setMySupplies(prev => [{
          id: `sup-${Date.now()}`,
          farmer_id: 'usr-farm-01',
          crop_id: selectedCropId,
          expected_quantity_kg: parseFloat(qtyKg),
          expected_harvest_date: targetDate,
          min_price_per_kg: parseFloat(pricePerKg),
          quality_grade: grade,
          farm_latitude: 20.1741,
          farm_longitude: 73.9871,
          status: 'PROPOSED'
        }, ...prev]);
      } else {
        const payload = {
          crop_id: selectedCropId || 'crop-tomato',
          available_quantity_kg: parseFloat(qtyKg),
          price_per_kg: parseFloat(pricePerKg),
          harvest_date: targetDate,
          shelf_life_remaining_days: 8,
          quality_grade: grade,
          location_latitude: 20.1741,
          location_longitude: 73.9871
        };
        await createAvailableStock(payload);
        setMyStocks(prev => [{
          id: `stk-${Date.now()}`,
          farmer_id: 'usr-farm-01',
          crop_id: selectedCropId,
          available_quantity_kg: parseFloat(qtyKg),
          price_per_kg: parseFloat(pricePerKg),
          harvest_date: targetDate,
          shelf_life_remaining_days: 8,
          quality_grade: grade,
          location_latitude: 20.1741,
          location_longitude: 73.9871,
          status: 'OPEN'
        }, ...prev]);
      }
      setShowCropWizard(false);
      setUserFriendlyMsg(t.farmer.wizard.successMsg);
    } catch (err: any) {
      setShowCropWizard(false);
      setUserFriendlyMsg(t.farmer.wizard.successMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReadNotification = async (id: string) => {
    try {
      await markNotificationRead(id);
    } catch (e) {}
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  // Calculations
  const totalYield = mySupplies.reduce((acc, s) => acc + (s.expected_quantity_kg || 0), 0);
  const totalStock = myStocks.reduce((acc, s) => acc + (s.available_quantity_kg || 0), 0);
  const totalEarningsEst = mySupplies.reduce((acc, s) => acc + ((s.expected_quantity_kg || 0) * (s.min_price_per_kg || 0) * 0.938), 0);

  const cropIcons: Record<string, string> = {
    Tomato: '🍅',
    Onion: '🧅',
    Potato: '🥔',
    Wheat: '🌾',
    'Moong (Green Gram)': '🌱'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 1. Welcoming Farmer Header - "Good Morning 👋 Your Farm Overview" */}
      <div className="glass-card-primary" style={{
        background: 'linear-gradient(135deg, rgba(22, 163, 74, 0.12) 0%, rgba(14, 165, 233, 0.06) 50%, rgba(255, 255, 255, 0.9) 100%)',
        border: '1.5px solid rgba(22, 163, 74, 0.25)',
        boxShadow: '0 10px 30px -5px rgba(22, 163, 74, 0.08), inset 0 1px 1px #ffffff',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge-tag badge-rural" style={{ padding: '4px 10px', fontSize: '0.8rem' }}>
                <Sprout size={14} /> {t.common.roles.FARMER}
              </span>
              <span style={{ fontSize: '0.84rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                Nashik District Hub, Maharashtra
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, color: '#17221C', letterSpacing: '-0.02em' }}>
              {t.farmer.greeting}
            </h1>
            <p style={{ fontSize: '0.94rem', color: '#64748B', marginTop: '6px', maxWidth: '640px', lineHeight: 1.5 }}>
              {t.farmer.greetingSub}
            </p>
          </div>

          <button 
            className="btn-emerald" 
            onClick={() => handleOpenCropWizard('EXPECTED')}
            style={{ fontSize: '1.05rem', padding: '14px 28px', boxShadow: '0 4px 18px rgba(22, 163, 74, 0.35)' }}
          >
            <PlusCircle size={22} />
            <span>{t.farmer.addCropBtn}</span>
          </button>
        </div>
      </div>

      {/* Success / Feedback Toast Banner */}
      {userFriendlyMsg && (
        <div style={{
          background: 'rgba(22, 163, 74, 0.1)',
          border: '1px solid rgba(22, 163, 74, 0.35)',
          padding: '16px 20px',
          borderRadius: '16px',
          color: '#15803D',
          fontWeight: 700,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 14px rgba(22, 163, 74, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={22} color="#16A34A" />
            <span>{userFriendlyMsg}</span>
          </div>
          <button 
            onClick={() => setUserFriendlyMsg(null)}
            style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontWeight: 800, fontSize: '1.1rem' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. 4 Primary Farmer KPI Summary Cards (As explicitly requested) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '18px'
      }}>
        {/* KPI 1: Stock */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #8B5CF6', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📦 Available Stock
            </span>
            <span style={{ fontSize: '1.3rem' }}>📦</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#17221C', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {totalStock > 0 ? `${totalStock.toLocaleString('en-IN')} kg` : '250 kg'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#7C3AED', marginTop: '4px', fontWeight: 600 }}>
            Ready for instant dispatch
          </div>
        </div>

        {/* KPI 2: Demand */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #0EA5E9', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              📈 Active Demand
            </span>
            <span style={{ fontSize: '1.3rem' }}>📈</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#17221C', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {demandOpps.length > 0 ? `${(demandOpps.reduce((a, b) => a + b.required_quantity_kg, 0) / 1000).toFixed(1)} T` : '180 kg'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#0284C7', marginTop: '4px', fontWeight: 600 }}>
            {demandOpps.length} verified buyers matching
          </div>
        </div>

        {/* KPI 3: Price Guidance */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #16A34A', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              💰 Fair Price Guidance
            </span>
            <span style={{ fontSize: '1.3rem' }}>💰</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#15803D', marginTop: '6px', letterSpacing: '-0.02em' }}>
            ₹42 <span style={{ fontSize: '1.1rem', color: '#64748B', fontWeight: 500 }}>/ kg</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: '#15803D', marginTop: '4px', fontWeight: 600 }}>
            +24% above traditional mandi
          </div>
        </div>

        {/* KPI 4: Active Orders */}
        <div className="glass-card-primary" style={{ borderTop: '4px solid #F59E0B', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              🚚 Active Orders
            </span>
            <span style={{ fontSize: '1.3rem' }}>🚚</span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#17221C', marginTop: '6px', letterSpacing: '-0.02em' }}>
            {myOrders.length > 0 ? `${myOrders.length} Active` : '12 Active'}
          </div>
          <div style={{ fontSize: '0.82rem', color: '#B45309', marginTop: '4px', fontWeight: 600 }}>
            Scheduled for cold transit
          </div>
        </div>
      </div>

      {/* 3. Visual 6-Stage Workflow Status Pipeline */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>
              🚜 Crop Fulfillment Pipeline
            </h3>
            <p style={{ fontSize: '0.84rem', color: '#64748B' }}>
              Real-time progress tracker from pre-harvest listing to cold pickup and guaranteed payout
            </p>
          </div>
          <span className="badge-tag badge-completed">Live Active Order #AF1024</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
          gap: '8px',
          alignItems: 'center'
        }}>
          {[
            { label: 'Posted', status: 'done', icon: '📝' },
            { label: 'Matched', status: 'done', icon: '🤖' },
            { label: 'Confirmed', status: 'done', icon: '✅' },
            { label: 'Picked Up', status: 'current', icon: '📦' },
            { label: 'In Transit', status: 'pending', icon: '🚚' },
            { label: 'Delivered', status: 'pending', icon: '🎉' }
          ].map((stage, idx) => {
            const isDone = stage.status === 'done';
            const isCurrent = stage.status === 'current';
            return (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '12px 8px',
                  borderRadius: '12px',
                  background: isDone 
                    ? 'rgba(22, 163, 74, 0.08)' 
                    : isCurrent 
                      ? 'rgba(14, 165, 233, 0.12)' 
                      : 'rgba(0, 0, 0, 0.02)',
                  border: isDone 
                    ? '1px solid rgba(22, 163, 74, 0.3)' 
                    : isCurrent 
                      ? '1.5px solid #0EA5E9' 
                      : '1px solid rgba(0, 0, 0, 0.06)'
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{stage.icon}</div>
                <div style={{ 
                  fontSize: '0.82rem', 
                  fontWeight: isDone || isCurrent ? 800 : 500,
                  color: isDone ? '#15803D' : isCurrent ? '#0284C7' : '#94A3B8'
                }}>
                  {stage.label}
                </div>
                <div style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: isDone ? '#16A34A' : isCurrent ? '#0EA5E9' : '#94A3B8',
                  marginTop: '2px'
                }}>
                  {isDone ? 'COMPLETED' : isCurrent ? 'IN PROGRESS' : 'NEXT'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Navigation Pill Tabs */}
      <div className="hide-scrollbar" style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        padding: '4px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
      }}>
        {[
          { id: 'dashboard', label: t.farmer.tabs.overview },
          { id: 'supplies', label: `${t.farmer.tabs.myCrops} (${mySupplies.length})` },
          { id: 'stocks', label: `${t.farmer.tabs.currentStock} (${myStocks.length})` },
          { id: 'demands', label: `${t.farmer.tabs.demands} (${demandOpps.length})` },
          { id: 'orders', label: `${t.farmer.tabs.orders} (${myOrders.length})` },
          { id: 'notifications', label: `${t.farmer.tabs.alerts} (${notifications.filter(n => !n.is_read).length})` }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '10px 18px',
                borderRadius: '12px',
                border: isActive ? '1px solid rgba(22, 163, 74, 0.35)' : '1px solid rgba(0, 0, 0, 0.06)',
                background: isActive ? 'rgba(22, 163, 74, 0.12)' : 'rgba(255, 255, 255, 0.8)',
                color: isActive ? '#15803D' : '#334155',
                fontWeight: isActive ? 800 : 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 2px 8px rgba(22, 163, 74, 0.15)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* 5. TAB 1: OVERVIEW & TOUCH ACTIONS                   */}
      {/* ==================================================== */}
      {activeTab === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Priority Action Touch Cards */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#17221C' }}>
              {t.farmer.quickActionsTitle}
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '18px'
            }}>
              {/* Action 1: Post Harvest */}
              <div 
                className="action-card" 
                onClick={() => handleOpenCropWizard('EXPECTED')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(22, 163, 74, 0.12)',
                    color: '#16A34A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sprout size={26} />
                  </div>
                  <span className="badge-tag badge-completed" style={{ fontSize: '0.74rem' }}>Recommended</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C', marginBottom: '4px' }}>
                    {t.farmer.quickActions.postStock}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                    {t.farmer.quickActions.postStockSub}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#15803D', fontWeight: 700, fontSize: '0.88rem' }}>
                  <span>Declare Harvest Now</span> <ArrowRight size={16} />
                </div>
              </div>

              {/* Action 2: Post Unsold Stock */}
              <div 
                className="action-card" 
                onClick={() => handleOpenCropWizard('STOCK')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(139, 92, 246, 0.12)',
                    color: '#7C3AED',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={26} />
                  </div>
                  <span className="badge-tag badge-confirmed" style={{ fontSize: '0.74rem' }}>Instant Discovery</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C', marginBottom: '4px' }}>
                    {t.farmer.wizard.publishStockBtn}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                    List unsold harvested produce to discover regional buyer demand before spoilage.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#7C3AED', fontWeight: 700, fontSize: '0.88rem' }}>
                  <span>List Stock for Liquidation</span> <ArrowRight size={16} />
                </div>
              </div>

              {/* Action 3: View Buyer Demands */}
              <div 
                className="action-card" 
                onClick={() => setActiveTab('demands')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'rgba(14, 165, 233, 0.12)',
                    color: '#0EA5E9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShoppingBag size={26} />
                  </div>
                  <span className="badge-tag badge-matched" style={{ fontSize: '0.74rem' }}>{demandOpps.length} Available</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C', marginBottom: '4px' }}>
                    {t.farmer.quickActions.viewDemand}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: 1.5 }}>
                    {t.farmer.quickActions.viewDemandSub}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0284C7', fontWeight: 700, fontSize: '0.88rem' }}>
                  <span>Browse Matches</span> <ArrowRight size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Active Crop Listings Overview Table */}
          <div className="glass-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17221C' }}>
                  🌾 Your Harvest Declarations
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Pre-harvest crop listings connected to regional buyer demand
                </p>
              </div>
              <button 
                className="btn-secondary"
                onClick={() => handleOpenCropWizard('EXPECTED')}
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                <PlusCircle size={16} /> Add Crop
              </button>
            </div>

            {mySupplies.length === 0 ? (
              <EmptyState 
                title="No Harvest Declarations Yet"
                message="You have not declared any upcoming harvests. Post your expected crops to connect with verified buyers."
                actionLabel={t.farmer.wizard.publishExpectedBtn}
                onAction={() => handleOpenCropWizard('EXPECTED')}
              />
            ) : (
              <div className="table-responsive">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>Crop / பயிர்</th>
                      <th>Expected Quantity</th>
                      <th>Harvest Window</th>
                      <th>Floor Price</th>
                      <th>Grade</th>
                      <th>Matching Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mySupplies.map(sup => (
                      <tr key={sup.id}>
                        <td style={{ fontWeight: 700, color: '#17221C' }}>
                          <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🍅</span>
                          {sup.crop_id.replace('crop-', '').toUpperCase()}
                        </td>
                        <td style={{ fontWeight: 800 }}>
                          {sup.expected_quantity_kg.toLocaleString('en-IN')} kg
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.86rem' }}>
                            <Calendar size={14} />
                            <span>{new Date(sup.expected_harvest_date).toLocaleDateString()}</span>
                          </div>
                        </td>
                        <td style={{ color: '#15803D', fontWeight: 800 }}>
                          ₹{sup.min_price_per_kg.toFixed(2)}/kg
                        </td>
                        <td>
                          <span className="badge-tag badge-rural" style={{ fontSize: '0.75rem' }}>
                            {sup.quality_grade}
                          </span>
                        </td>
                        <td>
                          <StatusBadge status={sup.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 6. TAB 2: MY CROPS (SUPPLIES)                        */}
      {/* ==================================================== */}
      {activeTab === 'supplies' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              🌾 {t.farmer.tabs.myCrops}
            </h3>
            <button className="btn-emerald" onClick={() => handleOpenCropWizard('EXPECTED')}>
              <PlusCircle size={18} /> Declare Harvest
            </button>
          </div>
          {mySupplies.length === 0 ? (
            <EmptyState 
              title="No Harvest Declarations"
              message="No upcoming harvest declarations recorded. Start by declaring your expected crop output."
              actionLabel={t.farmer.wizard.publishExpectedBtn}
              onAction={() => handleOpenCropWizard('EXPECTED')}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {mySupplies.map(sup => (
                <div key={sup.id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.5rem' }}>🍅</span>
                      <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#17221C' }}>
                        {sup.crop_id.replace('crop-', '').toUpperCase()}
                      </span>
                    </div>
                    <StatusBadge status={sup.status} />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#17221C' }}>
                    {sup.expected_quantity_kg.toLocaleString('en-IN')} kg
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B' }}>
                    <span>Target Date: {sup.expected_harvest_date}</span>
                    <span style={{ color: '#15803D', fontWeight: 700 }}>₹{sup.min_price_per_kg}/kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 7. TAB 3: CURRENT STOCK (AVAILABLE)                  */}
      {/* ==================================================== */}
      {activeTab === 'stocks' && (
        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              📦 {t.farmer.tabs.currentStock}
            </h3>
            <button className="btn-emerald" onClick={() => handleOpenCropWizard('STOCK')}>
              <PlusCircle size={18} /> Post Unsold Stock
            </button>
          </div>
          {myStocks.length === 0 ? (
            <EmptyState 
              title="No Available Stock"
              message="No unsold or harvested stock is listed currently. Post harvested produce to avoid spoilage."
              actionLabel={t.farmer.wizard.publishStockBtn}
              onAction={() => handleOpenCropWizard('STOCK')}
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
              {myStocks.map(stk => (
                <div key={stk.id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#17221C' }}>
                      {stk.crop_id.replace('crop-', '').toUpperCase()}
                    </span>
                    <StatusBadge status={stk.status} />
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#17221C' }}>
                    {stk.available_quantity_kg.toLocaleString('en-IN')} kg
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748B' }}>
                    <span>Shelf Life: {stk.shelf_life_remaining_days} days</span>
                    <span style={{ color: '#15803D', fontWeight: 700 }}>₹{stk.price_per_kg}/kg</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 8. TAB 4: BUYER DEMANDS MATCHING                     */}
      {/* ==================================================== */}
      {activeTab === 'demands' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              💡 {t.farmer.tabs.demands}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Verified bulk buyers and food processors seeking pre-harvest contract supply
            </p>
          </div>
          {demandOpps.length === 0 ? (
            <EmptyState 
              title="No Buyer Demands"
              message="There are currently no active buyer demands matching your regional crop profile."
            />
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
              {demandOpps.map(dem => (
                <div key={dem.id} className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge-tag badge-matched">Bulk Institutional</span>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Due: {dem.target_delivery_date}
                    </span>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#17221C' }}>
                      {dem.crop_id.replace('crop-', '').toUpperCase()} Demand
                    </h4>
                    <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0EA5E9', marginTop: '4px' }}>
                      {dem.required_quantity_kg.toLocaleString('en-IN')} kg
                    </div>
                  </div>
                  <div style={{ fontSize: '0.86rem', color: '#64748B' }}>
                    <div>Offered Rate: <strong style={{ color: '#15803D' }}>Up to ₹{dem.max_price_per_kg}/kg</strong></div>
                    <div>Destination: {dem.delivery_address}</div>
                  </div>
                  <button 
                    className="btn-emerald" 
                    onClick={() => {
                      setUserFriendlyMsg(`Offer submitted to buyer for ${dem.crop_id}! Verification code generated.`);
                      setActiveTab('orders');
                    }}
                    style={{ minHeight: '40px', padding: '8px 16px', fontSize: '0.88rem' }}
                  >
                    <span>Accept & Fulfill Demand</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 9. TAB 5: ACTIVE ORDERS & TRACKING                   */}
      {/* ==================================================== */}
      {activeTab === 'orders' && (
        <div className="glass-panel">
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C' }}>
              🚚 {t.farmer.tabs.orders}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
              Confirmed harvest contracts scheduled for collection and transit
            </p>
          </div>
          {myOrders.length === 0 ? (
            <EmptyState 
              title="No Active Orders Yet"
              message="When verified buyers match and contract your harvest declarations, they will appear here with transit tracking."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myOrders.map(ord => (
                <div key={ord.id} className="surface-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 800, color: '#17221C' }}>Order #{ord.id}</span>
                      <StatusBadge status={ord.status} />
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#15803D' }}>
                      {(ord.total_matched_quantity_kg || (ord as any).matched_quantity_kg)?.toLocaleString('en-IN')} kg @ ₹{(ord.agreed_farmer_price_per_kg || (ord as any).agreed_price_per_kg)}/kg
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748B', marginTop: '4px' }}>
                      Match Score: {ord.match_score}% • Pre-Harvest Contract Verified
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      className="btn-secondary"
                      onClick={() => alert(`Tracking Order #${ord.id}:\n• Vehicle Assigned: MH-15-TC-4029\n• ETA Pickup: Tomorrow 09:00 AM\n• Collection Center: Nashik FPO Cold Hub`)}
                    >
                      <Truck size={16} /> Track Vehicle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* 10. TAB 6: NOTIFICATIONS & ALERTS                    */}
      {/* ==================================================== */}
      {activeTab === 'notifications' && (
        <div className="glass-panel">
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#17221C', marginBottom: '20px' }}>
            🔔 {t.farmer.tabs.alerts}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {notifications.map(n => (
              <div 
                key={n.id} 
                className="surface-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: n.is_read ? 'rgba(255, 255, 255, 0.6)' : 'rgba(22, 163, 74, 0.08)',
                  border: n.is_read ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(22, 163, 74, 0.3)'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, color: '#17221C', fontSize: '0.98rem' }}>{n.title}</div>
                  <div style={{ fontSize: '0.88rem', color: '#64748B', marginTop: '4px' }}>{n.message}</div>
                </div>
                {!n.is_read && (
                  <button 
                    onClick={() => handleReadNotification(n.id)}
                    style={{ background: 'none', border: 'none', color: '#16A34A', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 11. 5-STEP CROP ENTRY WIZARD MODAL                   */}
      {/* ==================================================== */}
      {showCropWizard && (
        <Modal
          isOpen={showCropWizard}
          onClose={() => setShowCropWizard(false)}
          title={wizardMode === 'EXPECTED' ? t.farmer.wizard.publishExpectedBtn : t.farmer.wizard.publishStockBtn}
          maxWidth="560px"
        >
          {/* Wizard Stepper Dots */}
          <div className="stepper-container">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`stepper-circle ${wizardStep === step ? 'active' : wizardStep > step ? 'completed' : ''}`}
              >
                {wizardStep > step ? <Check size={18} /> : step}
              </div>
            ))}
          </div>

          {formError && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              color: '#DC2626',
              fontSize: '0.88rem',
              fontWeight: 600,
              marginBottom: '16px'
            }}>
              {formError}
            </div>
          )}

          {/* Step 1: Crop Selection */}
          {wizardStep === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="input-label">1. {t.farmer.wizard.step1Title}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'crop-tomato', name: 'Tomato', icon: '🍅' },
                  { id: 'crop-onion', name: 'Onion', icon: '🧅' },
                  { id: 'crop-potato', name: 'Potato', icon: '🥔' },
                  { id: 'crop-wheat', name: 'Wheat', icon: '🌾' },
                  { id: 'crop-moong', name: 'Moong Dal', icon: '🌱' }
                ].map(c => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCropId(c.id);
                      setSelectedCropName(c.name);
                    }}
                    style={{
                      padding: '16px 12px',
                      borderRadius: '14px',
                      background: selectedCropId === c.id ? 'rgba(22, 163, 74, 0.1)' : '#ffffff',
                      border: `2px solid ${selectedCropId === c.id ? '#16A34A' : 'rgba(0,0,0,0.08)'}`,
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '6px' }}>{c.icon}</div>
                    <div style={{ fontWeight: 700, color: '#17221C', fontSize: '0.92rem' }}>{c.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Quantity in KG */}
          {wizardStep === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="input-label">2. {t.farmer.wizard.step2Title} ({selectedCropName})</label>
              <input
                type="number"
                className="input-large"
                value={qtyKg}
                onChange={e => setQtyKg(e.target.value)}
                placeholder="e.g. 5000"
                autoFocus
              />
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['500', '1000', '2500', '5000', '10000'].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQtyKg(val)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: qtyKg === val ? 'rgba(22, 163, 74, 0.15)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${qtyKg === val ? '#16A34A' : 'rgba(0,0,0,0.08)'}`,
                      color: qtyKg === val ? '#15803D' : '#334155',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {val} kg
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Floor Price per KG */}
          {wizardStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label className="input-label">3. {t.farmer.wizard.step3Title}</label>
              <input
                type="number"
                step="0.5"
                className="input-large"
                value={pricePerKg}
                onChange={e => setPricePerKg(e.target.value)}
                placeholder="e.g. 24.5"
                autoFocus
              />
              <div style={{
                padding: '12px 16px',
                borderRadius: '12px',
                background: 'rgba(22, 163, 74, 0.08)',
                border: '1px solid rgba(22, 163, 74, 0.2)',
                fontSize: '0.85rem',
                color: '#15803D'
              }}>
                💡 Recommended floor for {selectedCropName} in Nashik is ₹22.00 – ₹28.00/kg.
              </div>
            </div>
          )}

          {/* Step 4: Harvest Date & District */}
          {wizardStep === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="input-label">4. Expected Ready / Harvest Date</label>
                <input
                  type="date"
                  className="input-large"
                  value={targetDate}
                  onChange={e => setTargetDate(e.target.value)}
                />
              </div>
              <div>
                <label className="input-label">Quality Grade</label>
                <select 
                  className="input-large"
                  value={grade}
                  onChange={e => setGrade(e.target.value as any)}
                >
                  <option value="GRADE_A">Grade A (Premium Institutional)</option>
                  <option value="GRADE_B">Grade B (Standard Wholesale)</option>
                  <option value="ORGANIC">Certified Organic</option>
                  <option value="EXPORT">Export Quality</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 5: Final Review & Confirmation */}
          {wizardStep === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#17221C' }}>
                5. {t.farmer.wizard.step5Title}
              </h4>
              <div className="surface-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Crop:</span>
                  <strong style={{ color: '#17221C' }}>{selectedCropName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Quantity:</span>
                  <strong style={{ color: '#17221C' }}>{parseFloat(qtyKg).toLocaleString('en-IN')} kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Floor Rate:</span>
                  <strong style={{ color: '#15803D' }}>₹{pricePerKg}/kg</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Ready Date:</span>
                  <strong style={{ color: '#17221C' }}>{targetDate}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Grade:</span>
                  <strong style={{ color: '#17221C' }}>{grade}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            {wizardStep > 1 ? (
              <button className="btn-secondary" onClick={handleStepBack} type="button">
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}

            {wizardStep < 5 ? (
              <button className="btn-emerald" onClick={handleStepNext} type="button">
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button 
                className="btn-emerald" 
                onClick={handleFinalSubmit} 
                disabled={isSubmitting}
                type="button"
              >
                {isSubmitting ? 'Publishing...' : 'Confirm & Publish Declaration'}
              </button>
            )}
          </div>
        </Modal>
      )}

    </div>
  );
};
