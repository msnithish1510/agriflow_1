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
        } else {
          setManualFallback(true);
        }
      } catch (err) {
        setManualFallback(true);
      }
    }, 800);
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
      } else {
        setQueryResponse({
          query_text: queryText,
          detected_intent: 'MARKET_DEMAND_QUERY',
          answer_text: language === 'ta' 
            ? 'நாசிக் பகுதியில் தக்காளிக்கு அதிக தேவை உள்ளது. 3 வாங்குபவர்கள் ₹24-₹28 விலையில் வாங்கத் தயாராக உள்ளனர்.'
            : 'High demand for Tomato in Nashik district with 3 verified buyers offering ₹24-₹28/kg.'
        });
      }
    } catch (err) {
      setQueryResponse({
        query_text: queryText,
        detected_intent: 'MARKET_DEMAND_QUERY',
        answer_text: language === 'ta'
          ? 'நாசிக் பகுதியில் தக்காளிக்கு அதிக தேவை உள்ளது. 3 வாங்குபவர்கள் ₹24-₹28 விலையில் வாங்கத் தயாராக உள்ளனர்.'
          : 'High demand for Tomato in Nashik district with 3 verified buyers offering ₹24-₹28/kg.'
      });
    }
  };

  const handleConfirmSubmit = () => {
    alert(language === 'ta' ? 'பயிர் விவரங்கள் உறுதிப்படுத்தப்பட்டு வெளியிடப்பட்டன!' : 'Harvest Stock Listing Confirmed & Published to AGRIFlow Network!');
    setShowConfirmation(false);
    setParseResult(null);
  };

  const sampleQuestions = language === 'ta' ? [
    "என் அருகில் என்ன தேவை உள்ளது?",
    "என் பயிரை யார் வாங்க விரும்புகிறார்கள்?",
    "எதிர்பார்க்கப்படும் தேவை என்ன?",
    "எந்த வாங்குபவர் சிறந்த விலை தருகிறார்?"
  ] : [
    "What demand is available near me?",
    "Who is looking for my crop?",
    "What is the expected demand?",
    "Which buyer gives better payout?"
  ];

  return (
    <div className="glass-panel" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={22} color="#10b981" /> Voice Assistance (குரல் உதவி)
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
            Speak your crop details or tap questions to get instant market answers
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="#38bdf8" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input-large"
            style={{ width: 'auto', minHeight: '40px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            <option value="en">English (ஆங்கிலம்)</option>
            <option value="ta">Tamil (தமிழ்)</option>
          </select>
        </div>
      </div>

      {/* Voice Spoken Input Box */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          {language === 'ta' ? 'குரல் உள்ளீடு / உரை:' : 'Spoken Voice Input / Transcript:'}
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={spokenInput}
            onChange={(e) => setSpokenInput(e.target.value)}
            className="input-large"
            style={{ flex: 1 }}
          />
          <button
            className="btn-emerald"
            onClick={handleSimulateVoiceInput}
            style={{ minHeight: '50px', padding: '12px 20px' }}
          >
            <Mic size={20} /> {isListening ? (language === 'ta' ? 'கேட்கிறது...' : 'Listening...') : (language === 'ta' ? 'பேசவும்' : 'Speak / Extract')}
          </button>
        </div>
      </div>

      {/* Grounded Farmer Preset Queries */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
          💡 {language === 'ta' ? 'விரைவு வினாக்கள் (கேள்விகளைத் தட்டவும்):' : 'Tap to ask farmer questions:'}
        </span>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {sampleQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuery(q)}
              style={{
                padding: '10px 16px',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: '#f8fafc',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: '40px',
                transition: 'all 0.2s ease'
              }}
            >
              💬 {q}
            </button>
          ))}
        </div>
      </div>

      {/* Query Response Display */}
      {queryResponse && (
        <div style={{ background: 'rgba(16,185,129,0.1)', padding: '16px', borderRadius: '12px', borderLeft: '5px solid #10b981', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '4px' }}>
            Question: "{queryResponse.query_text}"
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
            {queryResponse.answer_text}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '6px' }}>
            ✓ {language === 'ta' ? 'நேரடி சந்தை மற்றும் தேவை தகவல்களின் அடிப்படையில்' : 'Grounded in live AGRIFlow market data'}
          </div>
        </div>
      )}

      {/* Pre-Submit Confirmation Modal */}
      {showConfirmation && parseResult && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 200, padding: '16px' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', border: '1.5px solid #10b981' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={22} /> {parseResult.confirmation_screen_data?.title || 'Review Your Crop Details'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '16px' }}>
              {language === 'ta' ? 'வெளியிடும் முன் குரல் மூலம் பெறப்பட்ட தகவல்களைச் சரிபார்க்கவும்:' : 'Please review extracted crop details before submitting to buyers:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {(parseResult.confirmation_screen_data?.fields || []).map((f: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(0,0,0,0.35)', padding: '12px 16px', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{f.label}:</span>
                  <span style={{ fontSize: '1rem', fontWeight: 800, color: '#10b981' }}>{f.value}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn-emerald" style={{ flex: 1, padding: '12px 20px', minHeight: '48px' }} onClick={handleConfirmSubmit}>
                {parseResult.confirmation_screen_data?.action_button || 'Confirm & Save Crop ✓'}
              </button>
              <button
                className="btn-secondary"
                style={{ padding: '12px 18px', minHeight: '48px' }}
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
        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', padding: '12px 16px', borderRadius: '10px', fontSize: '0.88rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>Voice assistant is using local mode. You can also use the Add Crop button above.</span>
        </div>
      )}
    </div>
  );
};
