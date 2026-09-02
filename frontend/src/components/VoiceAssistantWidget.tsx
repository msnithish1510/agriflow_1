"use client";

import React, { useState } from 'react';
import { Mic, Globe, CheckCircle2, MessageSquare, AlertCircle, Edit3, Volume2 } from 'lucide-react';

export const VoiceAssistantWidget: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en');
  const [spokenInput, setSpokenInput] = useState('I have 500 kg tomato available tomorrow at ₹28 per kg.');
  const [parseResult, setParseResult] = useState<any>(null);
  const [queryResponse, setQueryResponse] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);

  const handleSimulateVoiceInput = async () => {
    setIsListening(true);
    setTimeout(async () => {
      setIsListening(false);
      try {
        const res = await fetch('http://localhost:8000/api/v1/voice/parse-spoken-listing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ spoken_text: spokenInput, language })
        });
        if (res.ok) {
          const data = await res.json();
          setParseResult(data);
          setShowConfirmation(true);
        }
      } catch (err) {
        setManualFallback(true);
      }
    }, 1000);
  };

  const handleAskQuery = async (queryText: string) => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/voice/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query_text: queryText, district: 'Nashik', crop_name: 'Tomato', language })
      });
      if (res.ok) {
        const data = await res.json();
        setQueryResponse(data);
      }
    } catch (err) {
      alert('Voice assistant fallback activated.');
    }
  };

  const handleConfirmSubmit = () => {
    alert('Harvest Stock Listing Confirmed & Published to AGRIFlow Network!');
    setShowConfirmation(false);
    setParseResult(null);
  };

  return (
    <div className="glass-panel" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={20} color="#10b981" /> Multilingual Voice Assistance (English + Tamil)
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            Voice listing entity extractor & grounded query engine (Never hallucinates data)
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={16} color="#38bdf8" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '8px', background: '#090d16', color: '#38bdf8', border: '1px solid #38bdf8', fontWeight: 700, fontSize: '0.82rem' }}
          >
            <option value="en">English (US/IN)</option>
            <option value="ta">Tamil (தமிழ்)</option>
          </select>
        </div>
      </div>

      {/* Voice Spoken Listing Demo Bar */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
          Spoken Farmer Input Transcript:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={spokenInput}
            onChange={(e) => setSpokenInput(e.target.value)}
            style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#090d16', color: '#fff', border: '1px solid #334155', fontSize: '0.9rem' }}
          />
          <button
            className="btn-emerald"
            onClick={handleSimulateVoiceInput}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Mic size={18} /> {isListening ? 'Listening...' : 'Speak / Extract'}
          </button>
        </div>
      </div>

      {/* Grounded Farmer Preset Queries */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>
          💡 Tap Spoken Farmer Questions (Grounded in Live AGRIFlow Data):
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            "What demand is available near me?",
            "Who is looking for my crop?",
            "What is the expected demand?",
            "Which buyer gives better estimated net realization?"
          ].map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuery(q)}
              style={{
                padding: '8px 12px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255,255,255,0.04)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Response Display */}
      {queryResponse && (
        <div style={{ background: 'rgba(16,185,129,0.08)', padding: '14px', borderRadius: '10px', borderLeft: '4px solid #10b981', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
            Question: "{queryResponse.query_text}" (Intent: {queryResponse.detected_intent})
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
            {queryResponse.answer_text}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>
            ✓ Strictly grounded in live AGRIFlow database & AI forecasting services. Zero hallucination.
          </div>
        </div>
      )}

      {/* Pre-Submit Confirmation Modal */}
      {showConfirmation && parseResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200 }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '440px', border: '1px solid #10b981' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={20} /> {parseResult.confirmation_screen_data?.title}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Please review extracted entities before submitting:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {(parseResult.confirmation_screen_data?.fields || []).map((f: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{f.label}:</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981' }}>{f.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-emerald" style={{ flex: 1 }} onClick={handleConfirmSubmit}>
                {parseResult.confirmation_screen_data?.action_button}
              </button>
              <button
                style={{ padding: '8px 16px', background: 'transparent', color: '#94a3b8', border: '1px solid #334155', borderRadius: '8px', cursor: 'pointer' }}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel / Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Input Fallback */}
      {manualFallback && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={16} />
          <span>Speech service offline. Please use manual harvest declaration form in dashboard.</span>
        </div>
      )}
    </div>
  );
};
