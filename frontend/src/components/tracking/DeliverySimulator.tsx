"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, FastForward, Activity } from 'lucide-react';
import { Language } from '@/services/translations';

interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

interface DeliverySimulatorProps {
  route: Waypoint[];
  onUpdateLocation: (location: {
    lat: number;
    lng: number;
    location_name: string;
    status: string;
    distance_remaining_km: number;
    estimated_transit_minutes: number;
  }) => void;
  language: Language;
}

export const DeliverySimulator: React.FC<DeliverySimulatorProps> = ({
  route,
  onUpdateLocation,
  language,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1); // 1x, 2x, 5x, 10x
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const timerRef = useRef<any>(null);

  const isTa = language === 'ta';

  // Predefined default route fallback if route is missing
  const activeRoute = route && route.length > 0 ? route : [
    { lat: 11.0286, lng: 77.1258, name: "Coimbatore Farm Collection Center" },
    { lat: 11.0220, lng: 77.0850, name: "Karanampettai Toll Gate" },
    { lat: 11.0180, lng: 77.0420, name: "Sulur Highway Junction" },
    { lat: 11.0120, lng: 76.9950, name: "Singanallur Junction" },
    { lat: 11.0090, lng: 76.9720, name: "Avinashi Road Flyover" },
    { lat: 11.0065, lng: 76.9535, name: "RS Puram Consumer Direct Hub" },
  ];

  const totalSteps = activeRoute.length;

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(400, 2400 / speed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          const nextIndex = prev + 1;
          if (nextIndex >= totalSteps) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return totalSteps - 1;
          }
          return nextIndex;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, totalSteps]);

  // Broadcast step update to parent OrderTrackingView
  useEffect(() => {
    const waypoint = activeRoute[currentStepIndex];
    if (!waypoint) return;

    const totalDistanceKm = 12.4;
    const remainingRatio = (totalSteps - 1 - currentStepIndex) / (totalSteps - 1 || 1);
    const distance_remaining_km = Math.max(0, round(totalDistanceKm * remainingRatio, 1));
    const estimated_transit_minutes = Math.max(0, Math.round(22 * remainingRatio));

    // Dynamic Status Transition Flow: In Transit -> Near Destination -> Out for Delivery -> Delivered
    let status = 'IN_TRANSIT';
    if (currentStepIndex === 0) {
      status = 'IN_TRANSIT';
    } else if (currentStepIndex === totalSteps - 1) {
      status = 'DELIVERED';
    } else if (currentStepIndex === totalSteps - 2) {
      status = 'OUT_FOR_DELIVERY';
    } else if (currentStepIndex >= totalSteps - 3) {
      status = 'NEAR_DESTINATION';
    }

    onUpdateLocation({
      lat: waypoint.lat,
      lng: waypoint.lng,
      location_name: waypoint.name,
      status,
      distance_remaining_km,
      estimated_transit_minutes,
    });
  }, [currentStepIndex]);

  const handleTogglePlay = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const progressPercent = Math.min(100, Math.round((currentStepIndex / (totalSteps - 1 || 1)) * 100));

  // Determine play button text
  const getPlayButtonText = () => {
    if (isPlaying) {
      return isTa ? '⏸ நிறுத்து' : '⏸ Pause';
    }
    if (currentStepIndex === 0) {
      return isTa ? '▶ சிமுலேஷன் தொடங்கு' : '▶ Start Demo Tracking';
    }
    if (currentStepIndex >= totalSteps - 1) {
      return isTa ? '▶ மீண்டும் தொடங்கு' : '▶ Restart Demo Tracking';
    }
    return isTa ? '▶ மீண்டும் இயக்கு' : '▶ Resume Demo Tracking';
  };

  return (
    <div
      className="demo-tracking-panel"
      style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(30, 41, 59, 0.98))',
        backdropFilter: 'blur(16px)',
        border: '2px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '20px',
        padding: '20px 24px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.45)',
        margin: '20px 0',
      }}
    >
      {/* Header & Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="#fbbf24" className={isPlaying ? 'animate-pulse' : ''} />
            <span style={{ fontSize: '1.05rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              🚚 {isTa ? 'டெமோ டிராக்கிங் (DEMO TRACKING)' : 'DEMO TRACKING'}
            </span>
            {isPlaying && (
              <span style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid #10b981',
                color: '#34d399',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                {isTa ? 'இயங்குகிறது' : 'SIMULATION RUNNING'}
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '4px', margin: '4px 0 0 0', fontWeight: 500 }}>
            {isTa
              ? 'சிமுலேஷன் முறை — ஆர்ப்பாட்ட நோக்கங்களுக்காக வாகன இருப்பிடம் உருவகப்படுத்தப்பட்டுள்ளது.'
              : 'Simulation mode — vehicle location is simulated for demonstration purposes.'}
          </p>
        </div>

        {/* Speed Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '6px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontSize: '0.75rem', color: '#cbd5e1', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FastForward size={14} color="#f59e0b" /> {isTa ? 'வேகம்:' : 'Speed:'}
          </span>
          {[1, 2, 5, 10].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              style={{
                background: speed === s ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                color: speed === s ? '#0f172a' : '#cbd5e1',
                border: `1px solid ${speed === s ? '#f59e0b' : 'rgba(255,255,255,0.12)'}`,
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Step Progress & Location Display */}
      <div style={{ marginBottom: '16px', background: 'rgba(0,0,0,0.25)', padding: '12px 16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#f8fafc', marginBottom: '8px', fontWeight: 700 }}>
          <span>📍 {activeRoute[currentStepIndex]?.name || 'Starting Location'}</span>
          <span style={{ color: '#34d399', fontWeight: 900 }}>{progressPercent}% {isTa ? 'நிறைவடைந்தது' : 'completed'}</span>
        </div>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #f59e0b, #10b981)',
            transition: 'width 0.3s ease-in-out'
          }} />
        </div>
      </div>

      {/* Main Action Buttons: Start Demo Tracking / Pause / Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <button
          onClick={handleTogglePlay}
          id="btn-start-demo-tracking"
          aria-label={isPlaying ? 'Pause Simulation' : 'Start Demo Tracking'}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: isPlaying
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '0.95rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: isPlaying ? '0 4px 20px rgba(239, 68, 68, 0.4)' : '0 4px 20px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.2s ease',
            fontFamily: 'inherit',
            letterSpacing: '0.3px'
          }}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span>{getPlayButtonText()}</span>
        </button>

        {isPlaying && (
          <button
            onClick={() => setIsPlaying(false)}
            id="btn-pause-demo-tracking"
            aria-label="Pause Simulation"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <Pause size={16} />
            <span>{isTa ? '⏸ நிறுத்து' : '⏸ Pause'}</span>
          </button>
        )}

        <button
          onClick={handleReset}
          id="btn-reset-demo-tracking"
          aria-label="Reset Simulation"
          title="Reset vehicle location to start"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.08)',
            color: '#cbd5e1',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '12px',
            padding: '12px 20px',
            fontSize: '0.9rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <RotateCcw size={16} />
          <span>{isTa ? '↻ மீட்டமை' : '↻ Reset'}</span>
        </button>
      </div>
    </div>
  );
};

function round(val: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(val * factor) / factor;
}

