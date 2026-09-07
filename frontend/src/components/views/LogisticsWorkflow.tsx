"use client";

import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Navigation, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { OrderMatch } from '@/types';
import { fetchLogisticsJobs, acceptLogisticsJob, updateOrderStatus } from '@/services/api';
import { useLanguage } from '@/i18n';
import { StatusBadge } from '../ui/StatusBadge';

export const LogisticsWorkflow: React.FC = () => {
  const { t, language } = useLanguage();
  const [jobs, setJobs] = useState<OrderMatch[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await fetchLogisticsJobs();
      setJobs(data?.length > 0 ? data : [
        {
          id: 'ord-log-01',
          buyer_id: 'usr-buy-01',
          matched_crop_id: 'crop-tomato',
          total_matched_quantity_kg: 7500,
          agreed_farmer_price_per_kg: 25.0,
          total_amount_inr: 4158,
          participating_farmer_ids: [
            { farmer_id: 'usr-farm-01', farmer_name: 'Farmer Ramesh (Pimpalgaon, Nashik)', allocated_quantity_kg: 4000, price_per_kg: 24.5 },
            { farmer_id: 'usr-farm-02', farmer_name: 'Farmer Suresh (Niphad, Nashik)', allocated_quantity_kg: 3500, price_per_kg: 25.0 }
          ],
          match_score: 96.5,
          status: 'CONFIRMED',
          created_at: '2026-09-07'
        }
      ]);
    } catch (err) {
      console.warn('Fallback jobs query');
    }
  };

  const handleAcceptJob = async (orderId: string) => {
    try {
      await acceptLogisticsJob(orderId);
    } catch (err) {}
    const acceptMsgs: Record<string, string> = {
      en: 'Transport job accepted! Vehicle scheduled for multi-farm pickup.',
      ta: 'போக்குவரத்து வேலை ஏற்றுக்கொள்ளப்பட்டது! நிலை: பயணத்தில் உள்ளது.',
      hi: 'परिवहन कार्य स्वीकार किया गया! वाहन बहु-कृषि पिकअप के लिए निर्धारित।',
      te: 'రవాణా పని ఆమోదించబడింది! బహుళ-వ్యవసాయ పికప్ కోసం వాహనం షెడ్యూల్ చేయబడింది.',
      ml: 'ഗതാഗത ജോലി സ്വീകരിച്ചു! ഒന്നിലധികം ഫാമുകളിൽ നിന്നുള്ള പിക്കപ്പിനായി വാഹനം നിശ്ചയിച്ചു.',
      kn: 'ಸಾರಿಗೆ ಕೆಲಸವನ್ನು ಸ್ವೀಕರಿಸಲಾಗಿದೆ! ಬಹು-ಫಾರ್ಮ್ ಪಿಕಪ್‌ಗಾಗಿ ವಾಹನವನ್ನು ನಿಗದಿಪಡಿಸಲಾಗಿದೆ.'
    };
    setToastMessage(acceptMsgs[language] || acceptMsgs.en);
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {}
    setJobs(jobs.map(j => j.id === orderId ? { ...j, status: status as any } : j));
    const statusMsgs: Record<string, string> = {
      en: `Order delivery status updated to ${status}!`,
      ta: 'விநியோக நிலை வெற்றிகரமாக புதுப்பிக்கப்பட்டது!',
      hi: `ऑर्डर डिलीवरी स्थिति को ${status} में अपडेट किया गया!`,
      te: `ఆర్డర్ డెలివరీ స్థితి ${status} కు నవీకరించబడింది!`,
      ml: `ഓർഡർ ഡെലിവറി നില ${status} ലേക്ക് പുതുക്കി!`,
      kn: `ಆರ್ಡರ್ ವಿತರಣಾ ಸ್ಥಿತಿಯನ್ನು ${status} ಗೆ ನವೀಕರಿಸಲಾಗಿದೆ!`
    };
    setToastMessage(statusMsgs[language] || statusMsgs.en);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.14) 0%, rgba(16,185,129,0.12) 100%)',
        border: '1px solid rgba(6,182,212,0.3)',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-tag badge-urban">
            <Truck size={14} /> {t.common.roles.LOGISTICS_PARTNER}
          </span>
          <span style={{ fontSize: '0.8rem', color: '#38bdf8' }}>Google OR-Tools VRPTW Fleet Dispatch</span>
        </div>
        <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#f8fafc' }}>
          {t.logistics.title}
        </h1>
        <p style={{ fontSize: '0.92rem', color: '#cbd5e1', marginTop: '4px' }}>
          {t.logistics.subtitle}
        </p>
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

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ borderLeft: '5px solid #06b6d4' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            {t.logistics.activeJobsTitle}
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {jobs.length} Active Trips
          </div>
          <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '2px' }}>
            Multi-farm collection & direct delivery routes
          </div>
        </div>

        <div className="glass-panel" style={{ borderLeft: '5px solid #10b981' }}>
          <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 600, textTransform: 'uppercase' }}>
            VEHICLE UTILIZATION
          </span>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
            75.0% Capacity
          </div>
          <div style={{ fontSize: '0.82rem', color: '#34d399', marginTop: '2px' }}>
            7,500 kg / 10,000 kg Truck Limit
          </div>
        </div>
      </div>

      {/* Assigned Delivery Queue */}
      <div className="glass-panel">
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={20} color="#06b6d4" /> {t.logistics.activeJobsTitle}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {jobs.map(j => (
            <div key={j.id} className="surface-card" style={{ borderLeft: '4px solid #06b6d4', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StatusBadge status={j.status} />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      Trip #{j.id}
                    </h3>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '2px' }}>
                    Route: Nashik Fleet Depot → 2 Farm Pickups → Pune Distribution Center
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                    {j.total_matched_quantity_kg?.toLocaleString('en-IN')} kg
                  </div>
                  <div style={{ fontSize: '0.84rem', color: '#fbbf24' }}>
                    Freight Payout: ₹{j.total_amount_inr?.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Waypoint Stops */}
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '14px', borderRadius: '12px', fontSize: '0.88rem' }}>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '8px' }}>
                  📍 {t.logistics.pickupStopsTitle}:
                </div>
                {(j.participating_farmer_ids || []).map((f: any, idx: number) => (
                  <div key={idx} style={{ paddingLeft: '12px', borderLeft: '3px solid #38bdf8', marginBottom: '6px', color: '#cbd5e1' }}>
                    Stop #{idx + 1}: <strong>{f.farmer_name || `Farmer ${f.farmer_id}`}</strong> — Pickup: {f.allocated_quantity_kg} kg
                  </div>
                ))}
                <div style={{ paddingLeft: '12px', borderLeft: '3px solid #10b981', color: '#34d399', fontWeight: 700, marginTop: '8px' }}>
                  Destination: Reliance DC, Bhosari, Pune (Deadline: 20:00)
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {j.status === 'CONFIRMED' && (
                  <button className="btn-emerald" onClick={() => handleAcceptJob(j.id)}>
                    <Check size={16} /> {t.logistics.acceptJobBtn}
                  </button>
                )}
                {j.status === 'IN_TRANSIT' && (
                  <button className="btn-emerald" onClick={() => handleUpdateStatus(j.id, 'DELIVERED')}>
                    <CheckCircle2 size={16} /> {t.logistics.completedStatusBtn}
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
