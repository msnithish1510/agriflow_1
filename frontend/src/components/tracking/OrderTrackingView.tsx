"use client";

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Clock, AlertTriangle, ShieldCheck, ArrowLeft, RefreshCw, CheckCircle2, ChevronRight, Activity, Calendar, Box, UserCheck } from 'lucide-react';
import { InteractiveLiveMap } from './InteractiveLiveMap';
import { DeliverySimulator } from './DeliverySimulator';
import { Language } from '@/services/translations';
import { UserRole } from '@/types';

export interface TrackingData {
  id: string;
  tracking_id: string;
  order_id: string;
  farmer_name: string;
  buyer_name: string;
  crop_name: string;
  quantity_kg: number;
  pickup_location: { name: string; lat: number; lng: number; details?: string };
  destination_location: { name: string; lat: number; lng: number; details?: string };
  current_latitude: number;
  current_longitude: number;
  current_location_name: string;
  route: { lat: number; lng: number; name: string }[];
  distance_remaining_km: number;
  estimated_transit_minutes: number;
  expected_delivery_time: string;
  current_status: string;
  driver_name?: string;
  vehicle_number?: string;
  history?: { status: string; status_label?: string; location_name: string; timestamp: string; completed: boolean; is_current?: boolean }[];
  is_delayed?: boolean;
  delay_minutes?: number;
  last_updated?: string;
}

interface OrderTrackingViewProps {
  trackingId: string;
  language: Language;
  userRole?: UserRole;
  onBack?: () => void;
}

export const OrderTrackingView: React.FC<OrderTrackingViewProps> = ({
  trackingId,
  language,
  userRole = 'CONSUMER',
  onBack,
}) => {
  const isTa = language === 'ta';
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<string>('11:23 AM');
  const [isMoving, setIsMoving] = useState<boolean>(true);

  // Fetch tracking data from backend
  const fetchTracking = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/v1/tracking/${trackingId}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        setData(getFallbackDemo(trackingId));
      }
    } catch (e) {
      setData(getFallbackDemo(trackingId));
    } finally {
      setLoading(false);
      const now = new Date();
      setLastRefreshed(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 10000);
    return () => clearInterval(interval);
  }, [trackingId]);

  // Handle simulator updates
  const handleSimulatorUpdate = (simUpdate: {
    lat: number;
    lng: number;
    location_name: string;
    status: string;
    distance_remaining_km: number;
    estimated_transit_minutes: number;
  }) => {
    if (!data) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setIsMoving(simUpdate.status !== 'DELIVERED');

    setData((prev) => {
      if (!prev) return null;
      const updatedHistory = (prev.history || []).map((h) => {
        if (h.status === simUpdate.status) {
          return { ...h, completed: true, is_current: true, timestamp: timeStr };
        } else if (h.status === 'IN_TRANSIT' && simUpdate.status !== 'IN_TRANSIT') {
          return { ...h, is_current: false };
        }
        return h;
      });

      return {
        ...prev,
        current_latitude: simUpdate.lat,
        current_longitude: simUpdate.lng,
        current_location_name: simUpdate.location_name,
        current_status: simUpdate.status,
        distance_remaining_km: simUpdate.distance_remaining_km,
        estimated_transit_minutes: simUpdate.estimated_transit_minutes,
        history: updatedHistory,
        last_updated: now.toISOString(),
      };
    });
    setLastRefreshed(timeStr);
  };

  if (loading || !data) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#94a3b8' }}>
        <RefreshCw size={32} className="animate-spin" style={{ margin: '0 auto 16px auto', color: '#10b981' }} />
        <p>{isTa ? 'ஆர்டர் கண்காணிப்பு விவரங்கள் ஏற்றப்படுகின்றன...' : 'Loading order live tracking details...'}</p>
      </div>
    );
  }

  // Calculate dynamic Estimated Delivery Date & Time (Section 2 & 5)
  const isDelivered = data.current_status === 'DELIVERED';
  const etaMinutes = data.estimated_transit_minutes;
  const etaDateObj = new Date(Date.now() + etaMinutes * 60 * 1000);
  const formattedEta = formatDeliveryDateTime(etaDateObj, isTa);

  // Calculate dynamic route progress percentage (Section 7)
  const totalRouteDistanceKm = 42.0; // total nominal distance
  const distanceTravelled = Math.max(0, totalRouteDistanceKm - data.distance_remaining_km);
  const progressPercent = isDelivered ? 100 : Math.min(99, Math.max(5, Math.round((distanceTravelled / totalRouteDistanceKm) * 100)));

  // Format Status Badge & Message (Section 6)
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return {
          label: isTa ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered',
          headline: isTa ? '✓ ஆர்டர் டெலிவரி செய்யப்பட்டது' : '✓ Delivered Today',
          subtext: isTa ? `இன்று ${lastRefreshed}-க்கு டெலிவரி செய்யப்பட்டது` : `Delivered today at ${lastRefreshed}`,
          bg: 'rgba(16, 185, 129, 0.2)', border: '#10b981', color: '#34d399'
        };
      case 'OUT_FOR_DELIVERY':
        return {
          label: isTa ? 'டெலிவரிக்கு சென்றுள்ளது' : 'Out for Delivery',
          headline: isTa ? '🚚 டெலிவரிக்கு சென்றுள்ளது' : '🚚 Out for Delivery',
          subtext: isTa ? `இன்று ${formattedEta.timeStr}-க்குள் எதிர்பார்க்கப்படுகிறது` : `Expected today by ${formattedEta.timeStr}`,
          bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', color: '#60a5fa'
        };
      case 'NEAR_DESTINATION':
        return {
          label: isTa ? 'இலக்கு அருகே' : 'Near Destination',
          headline: isTa ? '🚚 இலக்கு அருகே வந்துவிட்டது!' : '🚚 Almost there!',
          subtext: isTa ? `சுமார் ${etaMinutes} நிமிடங்களில் வருகை` : `Arriving in approximately ${etaMinutes} minutes`,
          bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', color: '#c084fc'
        };
      case 'IN_TRANSIT':
      default:
        return {
          label: isTa ? 'பயணத்தில் உள்ளது (In Transit)' : 'In Transit',
          headline: isTa ? `சுமார் ${etaMinutes} நிமிடங்களில் வருகை` : `Arriving in ${etaMinutes} minutes`,
          subtext: isTa ? `எதிர்பார்க்கப்படும் டெலிவரி: ${formattedEta.fullStr}` : `Estimated delivery: ${formattedEta.fullStr}`,
          bg: 'rgba(245, 158, 11, 0.2)', border: '#f59e0b', color: '#fbbf24'
        };
    }
  };

  const statusConfig = getStatusConfig(data.current_status);

  return (
    <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '16px' }}>
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            color: '#34d399',
            fontSize: '0.88rem',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '16px',
            padding: 0,
          }}
        >
          <ArrowLeft size={18} />
          <span>{isTa ? 'டாஷ்போர்டுக்கு திரும்பு' : 'Back to Dashboard'}</span>
        </button>
      )}

      {/* Admin Summary Stats Bar (Section 22) */}
      {userRole === 'ADMIN' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '20px',
        }}>
          <div className="glass-panel" style={{ padding: '12px 16px', borderLeft: '4px solid #38bdf8' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>TOTAL ACTIVE SHIPMENTS</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>12 Shipments</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px 16px', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>IN TRANSIT</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24' }}>7 Moving</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px 16px', borderLeft: '4px solid #c084fc' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>NEAR DESTINATION</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#c084fc' }}>3 Near</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px 16px', borderLeft: '4px solid #f87171' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>DELAYED</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f87171' }}>2 Delayed</div>
          </div>
          <div className="glass-panel" style={{ padding: '12px 16px', borderLeft: '4px solid #34d399' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>DELIVERED TODAY</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399' }}>25 Completed</div>
          </div>
        </div>
      )}

      {/* Main Order Header (Section 18, 19, 20 Role Priority) */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
                {isTa ? 'ஆர்டர் கண்காணிப்பு' : 'Order Tracking'}
              </span>
              <span style={{
                background: statusConfig.bg,
                border: `1px solid ${statusConfig.border}`,
                color: statusConfig.color,
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.78rem',
                fontWeight: 800,
                letterSpacing: '0.5px'
              }}>
                ● {statusConfig.label}
              </span>
            </div>

            {/* Role-Specific Priority Header Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.88rem', color: '#94a3b8', flexWrap: 'wrap' }}>
              <span>{isTa ? 'ஆர்டர் எண்' : 'Order ID'}: <strong style={{ color: '#f8fafc' }}>#{data.order_id}</strong></span>
              <span>•</span>
              <span>{isTa ? 'பயிர்' : 'Product'}: <strong style={{ color: '#34d399' }}>{data.crop_name} ({data.quantity_kg} kg)</strong></span>
              <span>•</span>
              {userRole === 'BULK_BUYER' || userRole === 'FARMER' ? (
                <span>{isTa ? 'விவசாயி' : 'Farmer'}: <strong style={{ color: '#fbbf24' }}>{data.farmer_name}</strong></span>
              ) : (
                <span>{isTa ? 'கண்காணிப்பு எண்' : 'Tracking ID'}: <strong style={{ color: '#34d399' }}>{data.tracking_id}</strong></span>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>
              {isTa ? 'கடைசியாக புதுப்பிக்கப்பட்டது' : 'Last Updated'}
            </div>
            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', fontWeight: 600 }}>
              ⏱️ {lastRefreshed}
            </div>
          </div>
        </div>
      </div>

      {/* Delay Alert Banner (Section 15) */}
      {data.is_delayed && !isDelivered && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#fca5a5'
        }}>
          <AlertTriangle size={24} color="#ef4444" style={{ flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#f87171', display: 'block', fontSize: '0.95rem' }}>
              ⚠️ {isTa ? 'டெலிவரி தாமதமாகியுள்ளது (Delivery Delayed)' : 'Delivery Delayed'}
            </strong>
            <span style={{ fontSize: '0.85rem' }}>
              {isTa
                ? `எதிர்பார்க்கப்பட்டது: 11:45 AM | புதுப்பிக்கப்பட்ட நேரம்: ${formattedEta.timeStr} | சுமார் ${data.delay_minutes || 20} நிமிடங்கள் தாமதம்.`
                : `Expected: 11:45 AM | Updated estimate: ${formattedEta.timeStr} | Delayed by approximately ${data.delay_minutes || 20} minutes.`}
            </span>
          </div>
        </div>
      )}

      {/* On Track / Early Delivery Indicator (Section 16) */}
      {!data.is_delayed && !isDelivered && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '14px',
          padding: '10px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#34d399',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🟢</span>
            <strong style={{ color: '#34d399' }}>{isTa ? 'சரியான பாதையில் உள்ளது (On Track)' : 'On Track'}</strong>
            <span style={{ color: '#cbd5e1' }}>• {isTa ? 'திட்டமிட்டபடி டெலிவரி நடைபெறும்' : 'Shipment is running on schedule'}</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            {isTa ? 'போக்குவரத்து நிலை சாதகமானது' : 'Normal highway conditions'}
          </span>
        </div>
      )}

      {/* Main Grid: Left Map | Right Cards & Progress & Simulator & Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* LEFT COLUMN — Live Map */}
        <div>
          <InteractiveLiveMap
            pickup={data.pickup_location}
            destination={data.destination_location}
            currentLocation={{
              lat: data.current_latitude,
              lng: data.current_longitude,
              location_name: data.current_location_name,
            }}
            route={data.route}
            vehicleNumber={data.vehicle_number}
            driverName={data.driver_name}
          />
        </div>

        {/* RIGHT COLUMN — Live ETA Card, Demo Tracking Panel, Delivery Progress, Location Card, Timeline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Enhanced Live ETA Card (Section 1, 2, 4, 6) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.95))',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '20px',
            padding: '22px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🚚 {isTa ? 'எதிர்பார்க்கப்படும் டெலிவரி நேரம் (ESTIMATED DELIVERY)' : 'ESTIMATED DELIVERY'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '6px' }}>
                {isTa ? 'நிகழ்நேர கணக்கீடு' : 'Dynamic Live Calculation'}
              </span>
            </div>

            {/* Main Delivery Clock Time (Section 1 & 5) */}
            <div style={{ fontSize: '2.1rem', fontWeight: 900, color: '#f8fafc', marginBottom: '4px', letterSpacing: '-0.5px' }}>
              {isDelivered ? (isTa ? `இன்று, ${lastRefreshed}` : `Delivered Today, ${lastRefreshed}`) : formattedEta.fullStr}
            </div>

            {/* Countdown / Status Subheadline (Section 6) */}
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: statusConfig.color, marginBottom: '14px' }}>
              {statusConfig.headline}
            </div>

            {/* Distance & Last Updated Details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              background: 'rgba(0,0,0,0.3)',
              padding: '12px 14px',
              borderRadius: '12px',
              marginBottom: '10px'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {isTa ? 'மீதமுள்ள தூரம்' : 'Distance Remaining'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
                  {isDelivered ? '0.0 km' : `${data.distance_remaining_km} km`}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                  {isTa ? 'கடைசி புதுப்பிப்பு' : 'Last Updated'}
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {lastRefreshed}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: '#64748b', textAlign: 'center', fontStyle: 'italic' }}>
              {isTa ? 'தோராயமானது • போக்குவரத்து நிலையைப் பொறுத்து மாறக்கூடும்' : 'Estimated • May vary with traffic and highway conditions'}
            </div>
          </div>

          {/* DEMO TRACKING PANEL (Placed right near Estimated Delivery & Delivery Progress) */}
          <DeliverySimulator
            route={data.route}
            onUpdateLocation={handleSimulatorUpdate}
            language={language}
          />

          {/* Delivery Progress Percentage Bar (Section 7 & 23) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '18px 20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                📊 {isTa ? 'டெலிவரி முன்னேற்றம்' : 'Delivery Progress'}
              </span>
              <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#34d399' }}>
                {progressPercent}% {isTa ? 'நிறைவடைந்தது' : 'completed'}
              </span>
            </div>
            <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: isDelivered ? '#10b981' : 'linear-gradient(90deg, #10b981, #f59e0b)',
                transition: 'width 0.4s ease',
              }} />
            </div>
          </div>

          {/* Current Vehicle Location Card (Section 8) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                🚚 {isTa ? 'தற்போதைய வாகன இருப்பிடம்' : 'Current Vehicle Location'}
              </div>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: isMoving ? '#34d399' : '#fbbf24',
                background: isMoving ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                {isMoving ? (isTa ? '🟢 நகர்கிறது' : '🟢 Moving') : (isTa ? '🟡 வாகனம் நின்றது' : '🟡 Vehicle stopped')}
              </span>
            </div>

            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc', marginBottom: '10px' }}>
              📍 {data.current_location_name}
            </div>

            <div style={{ fontSize: '0.82rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>🏢 <strong>{isTa ? 'விவசாயி சேகரிப்பு மையம்' : 'Farmer Pickup'}:</strong> {data.farmer_name}</div>
              <div>📍 <strong>{isTa ? 'டெலிவரி இலக்கு' : 'Destination'}:</strong> {data.buyer_name} ({data.destination_location.name})</div>
              <div>🚛 <strong>{isTa ? 'வாகனம் & ஓட்டுநர்' : 'Driver & Vehicle'}:</strong> {data.driver_name || 'Murugan'} ({data.vehicle_number || 'TN-37-AZ-4420'})</div>
            </div>
          </div>

          {/* Order Status Timeline & Journey History (Section 8, 9, 23) */}
          <div style={{
            background: 'rgba(30, 41, 59, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              📋 {isTa ? 'டெலிவரி நிலை பயணவரிசை (Delivery Journey)' : 'Order Tracking Timeline & Delivery Journey'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
              {(data.history || getFallbackTimeline(isTa)).map((step, idx) => {
                const isCurrent = step.is_current || step.status === data.current_status;
                const isCompleted = step.completed;

                return (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    {/* Circle Icon */}
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isCurrent ? '#f59e0b' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)',
                      border: `2px solid ${isCurrent ? '#fbbf24' : isCompleted ? '#34d399' : 'rgba(255,255,255,0.2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white',
                      flexShrink: 0,
                      boxShadow: isCurrent ? '0 0 12px rgba(245, 158, 11, 0.6)' : 'none',
                    }}>
                      {isCompleted ? '✓' : isCurrent ? '●' : '○'}
                    </div>

                    {/* Step details */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '0.88rem',
                        fontWeight: isCurrent ? 800 : isCompleted ? 700 : 500,
                        color: isCurrent ? '#fbbf24' : isCompleted ? '#f8fafc' : '#64748b'
                      }}>
                        {step.status_label || formatStatusLabel(step.status, isTa)}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: isCurrent ? '#cbd5e1' : '#64748b' }}>
                        {step.location_name} {step.timestamp && `(${step.timestamp})`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export function formatDeliveryDateTime(d: Date, isTa: boolean = false): { dateStr: string; timeStr: string; fullStr: string } {
  if (!d || isNaN(d.getTime())) {
    return { dateStr: 'Today', timeStr: '11:45 AM', fullStr: 'Today, 11:45 AM' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const diffDays = Math.round((targetDay.getTime() - today.getTime()) / (1000 * 3600 * 24));
  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let dateStr = '';
  if (diffDays === 0) {
    dateStr = isTa ? 'இன்று' : 'Today';
  } else if (diffDays === 1) {
    dateStr = isTa ? 'நாளை' : 'Tomorrow';
  } else {
    dateStr = d.toLocaleDateString([], { day: 'numeric', month: 'short' });
  }

  return {
    dateStr,
    timeStr,
    fullStr: `${dateStr}, ${timeStr}`
  };
}

function formatStatusLabel(status: string, isTa: boolean): string {
  switch (status) {
    case 'ORDER_PLACED': return isTa ? 'ஆர்டர் செய்யப்பட்டது' : 'Order Placed';
    case 'ORDER_CONFIRMED': return isTa ? 'ஆர்டர் உறுதி செய்யப்பட்டது' : 'Order Confirmed';
    case 'FARMER_PREPARING': return isTa ? 'விவசாயி தயாரிப்பு' : 'Farmer Preparing Harvest';
    case 'READY_FOR_PICKUP': return isTa ? 'எடுக்க தயார்' : 'Ready for Pickup';
    case 'PICKED_UP': return isTa ? 'வாகனத்தில் எடுக்கப்பட்டது' : 'Picked Up';
    case 'IN_TRANSIT': return isTa ? 'வழியில் உள்ளது' : 'In Transit';
    case 'NEAR_DESTINATION': return isTa ? 'இலக்கு அருகே' : 'Near Destination';
    case 'OUT_FOR_DELIVERY': return isTa ? 'டெலிவரிக்கு சென்றுள்ளது' : 'Out for Delivery';
    case 'DELIVERED': return isTa ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered';
    default: return status;
  }
}

function getFallbackTimeline(isTa: boolean) {
  return [
    { status: 'ORDER_PLACED', status_label: isTa ? 'ஆர்டர் செய்யப்பட்டது' : 'Order Placed', location_name: 'System Order Confirmed', timestamp: '09:30 AM', completed: true },
    { status: 'ORDER_CONFIRMED', status_label: isTa ? 'ஆர்டர் உறுதி செய்யப்பட்டது' : 'Order Confirmed', location_name: 'Escrow Payment Locked', timestamp: '09:45 AM', completed: true },
    { status: 'FARMER_PREPARING', status_label: isTa ? 'விவசாயி தயாரிப்பு' : 'Farmer Preparing', location_name: 'Harvest & Sorting', timestamp: '10:15 AM', completed: true },
    { status: 'READY_FOR_PICKUP', status_label: isTa ? 'எடுக்க தயார்' : 'Ready for Pickup', location_name: 'Coimbatore Collection Hub', timestamp: '10:45 AM', completed: true },
    { status: 'PICKED_UP', status_label: isTa ? 'எடுக்கப்பட்டது' : 'Picked Up', location_name: 'Vehicle Loaded (TN-37-AZ-4421)', timestamp: '11:10 AM', completed: true },
    { status: 'IN_TRANSIT', status_label: isTa ? 'வழியில் உள்ளது' : 'In Transit', location_name: 'Sulur Highway Junction', timestamp: '11:23 AM', completed: true, is_current: true },
    { status: 'NEAR_DESTINATION', status_label: isTa ? 'இலக்கு அருகே' : 'Near Destination', location_name: 'Singanallur Junction', timestamp: '--:--', completed: false },
    { status: 'OUT_FOR_DELIVERY', status_label: isTa ? 'டெலிவரிக்கு சென்றுள்ளது' : 'Out for Delivery', location_name: 'RS Puram District', timestamp: '--:--', completed: false },
    { status: 'DELIVERED', status_label: isTa ? 'டெலிவரி செய்யப்பட்டது' : 'Delivered', location_name: 'RS Puram Consumer Direct Hub', timestamp: '--:--', completed: false },
  ];
}

function getFallbackDemo(trackingId: string): TrackingData {
  return {
    id: trackingId,
    tracking_id: trackingId,
    order_id: trackingId,
    farmer_name: "Ramesh Kumar (Coimbatore Farm Pool)",
    buyer_name: "Saravana Fresh Direct (RS Puram)",
    crop_name: "Grade-A Tomato",
    quantity_kg: 500.0,
    pickup_location: {
      name: "Coimbatore Farm Collection Center, Sulur",
      lat: 11.0286,
      lng: 77.1258,
      details: "Gate #2, Pool Storage"
    },
    destination_location: {
      name: "RS Puram Consumer Direct Hub, Coimbatore",
      lat: 11.0065,
      lng: 76.9535,
      details: "Main Store Complex"
    },
    current_latitude: 11.0180,
    current_longitude: 77.0420,
    current_location_name: "Sulur Highway Junction, Coimbatore",
    route: [
      { lat: 11.0286, lng: 77.1258, name: "Coimbatore Farm Collection Center" },
      { lat: 11.0220, lng: 77.0850, name: "Karanampettai Toll Gate" },
      { lat: 11.0180, lng: 77.0420, name: "Sulur Highway Junction" },
      { lat: 11.0120, lng: 76.9950, name: "Singanallur Junction" },
      { lat: 11.0090, lng: 76.9720, name: "Avinashi Road Flyover" },
      { lat: 11.0065, lng: 76.9535, name: "RS Puram Consumer Direct Hub" }
    ],
    distance_remaining_km: 12.4,
    estimated_transit_minutes: 22,
    expected_delivery_time: new Date(Date.now() + 22 * 60000).toISOString(),
    current_status: "IN_TRANSIT",
    driver_name: "Murugan Express Freight (TN-37-AZ-4420)",
    vehicle_number: "TN-37-AZ-4420",
    is_delayed: false,
    delay_minutes: 0,
    last_updated: new Date().toISOString()
  };
}
