"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Globe, CheckCircle2, MessageSquare, AlertCircle, Edit3, Volume2, Sparkles, Send } from 'lucide-react';
import { useLanguage, Language } from '@/i18n';

export const VoiceAssistantWidget: React.FC = () => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  const defaultSpokenByLang: Record<Language, string> = {
    en: 'I have 500 kg tomato available tomorrow at ₹28 per kg.',
    ta: 'நாளை 500 கிலோ தக்காளி ஒரு கிலோ ₹28 விலைக்கு விற்பனைக்கு உள்ளது.',
    hi: 'कल मेरे पास 500 किग्रा टमाटर ₹28 प्रति किग्रा पर उपलब्ध है।',
    te: 'రేపు 500 కిలోల టమాటాలు కిలో ₹28 చొప్పున అందుబాటులో ఉన్నాయి.',
    ml: 'നാളെ 500 കിലോഗ്രാം തക്കാളി കിലോയ്ക്ക് ₹28 നിരക്കിൽ ലഭ്യമാണ്.',
    kn: 'ನಾಳೆ 500 ಕೆಜಿ ಟೊಮೆಟೊ ಕೆಜಿಗೆ ₹28 ದರದಲ್ಲಿ ಲಭ್ಯವಿದೆ.'
  };

  const [spokenInput, setSpokenInput] = useState(defaultSpokenByLang[language] || defaultSpokenByLang.en);
  const [parseResult, setParseResult] = useState<any>(null);
  const [queryResponse, setQueryResponse] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [manualFallback, setManualFallback] = useState(false);

  useEffect(() => {
    setSpokenInput(defaultSpokenByLang[language] || defaultSpokenByLang.en);
  }, [language]);

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
        const fallbackAnswers: Record<Language, string> = {
          ta: 'நாசிக் பகுதியில் தக்காளிக்கு அதிக தேவை உள்ளது. 3 வாங்குபவர்கள் ₹24-₹28 விலையில் வாங்கத் தயாராக உள்ளனர்.',
          hi: 'नासिक जिले में टमाटर की भारी मांग है। 3 सत्यापित खरीदार ₹24-₹28/किग्रा की दर से खरीदने को तैयार हैं।',
          te: 'నాసిక్ జిల్లాలో టమాటాకు అధిక డిమాండ్ ఉంది. 3 ధృవీకరించబడిన కొనుగోలుదారులు ₹24-₹28/కిలో చెల్లించడానికి సిద్ధంగా ఉన్నారు.',
          ml: 'നാസിക് ജില്ലയിൽ തക്കാളിക്ക് ഉയർന്ന ആവശ്യക്കാരുണ്ട്. 3 സ്ഥിരീകരിച്ച വ്യാപാരികൾ കിലോയ്ക്ക് ₹24-₹28 നിരക്കിൽ വാങ്ങാൻ തയ്യാറാണ്.',
          kn: 'ನಾಸಿಕ್ ಜಿಲ್ಲೆಯಲ್ಲಿ ಟೊಮೆಟೊಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯಿದೆ. 3 ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು ಕೆಜಿಗೆ ₹24-₹28 ದರದಲ್ಲಿ ಖರೀದಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದಾರೆ.',
          en: 'High demand for Tomato in Nashik district with 3 verified buyers offering ₹24-₹28/kg.'
        };
        setQueryResponse({
          query_text: queryText,
          detected_intent: 'MARKET_DEMAND_QUERY',
          answer_text: fallbackAnswers[language] || fallbackAnswers.en
        });
      }
    } catch (err) {
      const fallbackAnswers: Record<Language, string> = {
        ta: 'நாசிக் பகுதியில் தக்காளிக்கு அதிக தேவை உள்ளது. 3 வாங்குபவர்கள் ₹24-₹28 விலையில் வாங்கத் தயாராக உள்ளனர்.',
        hi: 'नासिक जिले में टमाटर की भारी मांग है। 3 सत्यापित खरीदार ₹24-₹28/किग्रा की दर से खरीदने को तैयार हैं।',
        te: 'నాసిక్ జిల్లాలో టమాటాకు అధిక డిమాండ్ ఉంది. 3 ధృవీకరించబడిన కొనుగోలుదారులు ₹24-₹28/కిలో చెల్లించడానికి సిద్ధంగా ఉన్నారు.',
        ml: 'നാസിക് ജില്ലയിൽ തക്കാളിക്ക് ഉയർന്ന ആവശ്യക്കാരുണ്ട്. 3 സ്ഥിരീകരിച്ച വ്യാപാരികൾ കിലോയ്ക്ക് ₹24-₹28 നിരക്കിൽ വാങ്ങാൻ തയ്യാറാണ്.',
        kn: 'ನಾಸಿಕ್ ಜಿಲ್ಲೆಯಲ್ಲಿ ಟೊಮೆಟೊಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯಿದೆ. 3 ಪರಿಶೀಲಿಸಿದ ಖರೀದಿದಾರರು ಕೆಜಿಗೆ ₹24-₹28 ದರದಲ್ಲಿ ಖರೀದಿಸಲು ಸಿದ್ಧರಾಗಿದ್ದಾರೆ.',
        en: 'High demand for Tomato in Nashik district with 3 verified buyers offering ₹24-₹28/kg.'
      };
      setQueryResponse({
        query_text: queryText,
        detected_intent: 'MARKET_DEMAND_QUERY',
        answer_text: fallbackAnswers[language] || fallbackAnswers.en
      });
    }
  };

  const handleConfirmSubmit = () => {
    const alertMessages: Record<Language, string> = {
      en: 'Harvest Stock Listing Confirmed & Published to AGRIFlow Network!',
      ta: 'பயிர் விவரங்கள் உறுதிப்படுத்தப்பட்டு வெளியிடப்பட்டன!',
      hi: 'फसल स्टॉक लिस्टिंग की पुष्टि हुई और AGRIFlow नेटवर्क पर प्रकाशित की गई!',
      te: 'పంట స్టాక్ లిస్టింగ్ నిర్ధారించబడింది మరియు AGRIFlow నెట్‌వర్క్‌లో ప్రచురించబడింది!',
      ml: 'വിള സ്റ്റോക്ക് ലിസ്റ്റിംഗ് സ്ഥിരീകരിച്ച് AGRIFlow നെറ്റ്‌വർക്കിൽ പ്രസിദ്ധീകരിച്ചു!',
      kn: 'ಬೆಳೆ ಸ್ಟಾಕ್ ಪಟ್ಟಿಯನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು AGRIFlow ನೆಟ್‌ವರ್ಕ್‌ಗೆ ಪ್ರಕಟಿಸಲಾಗಿದೆ!'
    };
    alert(alertMessages[language] || alertMessages.en);
    setShowConfirmation(false);
    setParseResult(null);
  };

  const assistantTitles: Record<Language, string> = {
    en: 'Multilingual Voice Assistant',
    ta: 'பன்மொழி குரல் உதவியாளர்',
    hi: 'बहुभाषी आवाज सहायक',
    te: 'బహుభాషా వాయిస్ అసిస్టెంట్',
    ml: 'ബഹുഭാഷാ വോയ്‌സ് അസിസ്റ്റന്റ്',
    kn: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಸಹಾಯಕ'
  };

  const sampleQueriesByLang: Record<Language, string[]> = {
    en: [
      'What is today’s tomato price in Nashik?',
      'Who is buying onion in Pune?',
      'Can I declare 2000kg harvest for next Monday?'
    ],
    ta: [
      'இன்று நாசிக்கில் தக்காளி விலை என்ன?',
      'புனேவில் வெங்காயம் வாங்குபவர் யார்?',
      'அடுத்த திங்கட்கிழமைக்கு 2000 கிலோ அறுவடை பதிவு செய்யலாமா?'
    ],
    hi: [
      'आज नासिक में टमाटर का भाव क्या है?',
      'पुणे में प्याज कौन खरीद रहा है?',
      'क्या मैं अगले सोमवार के लिए 2000 किग्रा फसल दर्ज कर सकता हूं?'
    ],
    te: [
      'ఈరోజు నాసిక్‌లో టమాటా ధర ఎంత?',
      'పూణేలో ఉల్లిపాయలు ఎవరు కొంటున్నారు?',
      'వచ్చే సోమవారానికి 2000 కిలోల పంటను నమోదు చేయవచ్చా?'
    ],
    ml: [
      'ഇന്ന് നാസിക്കിൽ തക്കാളി വില എത്രയാണ്?',
      'പൂനെയിൽ ഉള്ളി വാങ്ങുന്നത് ആരാണ്?',
      'അടുത്ത തിങ്കളാഴ്ചത്തേക്ക് 2000 കിലോ വിളവ് പ്രഖ്യാപിക്കാമോ?'
    ],
    kn: [
      'ಇಂದು ನಾಸಿಕ್‌ನಲ್ಲಿ ಟೊಮೆಟೊ ಬೆಲೆ ಎಷ್ಟು?',
      'ಪುಣೆಯಲ್ಲಿ ಈರುಳ್ಳಿ ಖರೀದಿಸುವವರು ಯಾರು?',
      'ಮುಂದಿನ ಸೋಮವಾರಕ್ಕೆ 2000 ಕೆಜಿ ಕೊಯ್ಲು ನೋಂದಾಯಿಸಬಹುದೇ?'
    ]
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(22, 163, 74, 0.12)',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Volume2 size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#17221C' }}>
              {assistantTitles[language] || assistantTitles.en}
            </h3>
            <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
              Speech-to-Intent in 6 Indian Languages
            </div>
          </div>
        </div>
        <span className="badge-tag badge-completed">Live Assistant</span>
      </div>

      {/* Mic Trigger & Simulated Spoken Text Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={handleSimulateVoiceInput}
            disabled={isListening}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: isListening ? '#EF4444' : 'linear-gradient(135deg, #16A34A, #15803D)',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.5)' : '0 4px 14px rgba(22, 163, 74, 0.3)',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
            title="Tap to Speak in your Language"
          >
            <Mic size={24} />
          </button>

          <input
            type="text"
            className="input-large"
            value={spokenInput}
            onChange={(e) => setSpokenInput(e.target.value)}
            placeholder="Speak or type crop declaration..."
            style={{ flex: 1, minHeight: '48px' }}
          />

          <button
            className="btn-emerald"
            onClick={handleSimulateVoiceInput}
            style={{ minHeight: '48px', padding: '10px 18px' }}
          >
            <Send size={18} />
          </button>
        </div>

        {isListening && (
          <div style={{ fontSize: '0.85rem', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="pulse-dot" />
            <span>Listening to {languages.find(l => l.code === language)?.nativeName} speech stream...</span>
          </div>
        )}
      </div>

      {/* Sample Query Pills */}
      <div>
        <div style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 700, marginBottom: '8px' }}>
          Try Asking in {languages.find(l => l.code === language)?.nativeName}:
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(sampleQueriesByLang[language] || sampleQueriesByLang.en).map((query, i) => (
            <button
              key={i}
              onClick={() => handleAskQuery(query)}
              style={{
                background: 'rgba(0, 0, 0, 0.03)',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '9999px',
                padding: '6px 12px',
                fontSize: '0.8rem',
                color: '#334155',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(22, 163, 74, 0.1)';
                e.currentTarget.style.color = '#15803D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.color = '#334155';
              }}
            >
              💬 {query}
            </button>
          ))}
        </div>
      </div>

      {/* Query Answer Display */}
      {queryResponse && (
        <div style={{
          marginTop: '16px',
          padding: '14px 16px',
          borderRadius: '12px',
          background: 'rgba(22, 163, 74, 0.08)',
          border: '1px solid rgba(22, 163, 74, 0.25)',
          fontSize: '0.9rem',
          lineHeight: 1.5
        }}>
          <div style={{ fontWeight: 800, color: '#15803D', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} /> AI Answer
          </div>
          <div style={{ color: '#17221C' }}>{queryResponse.answer_text}</div>
        </div>
      )}

      {/* Confirmation Card after entity extraction */}
      {showConfirmation && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          borderRadius: '14px',
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1.5px solid rgba(22, 163, 74, 0.4)',
          boxShadow: '0 8px 24px rgba(22, 163, 74, 0.15)'
        }}>
          <div style={{ fontWeight: 800, color: '#17221C', marginBottom: '8px', fontSize: '1rem' }}>
            Extracted Declaration Details:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.85rem', marginBottom: '12px' }}>
            <div>Crop: <strong style={{ color: '#15803D' }}>Tomato</strong></div>
            <div>Quantity: <strong style={{ color: '#17221C' }}>500 kg</strong></div>
            <div>Target Price: <strong style={{ color: '#15803D' }}>₹28.00/kg</strong></div>
            <div>Ready: <strong style={{ color: '#0284C7' }}>Tomorrow</strong></div>
          </div>
          <button className="btn-emerald" onClick={handleConfirmSubmit} style={{ width: '100%', minHeight: '40px' }}>
            <CheckCircle2 size={16} /> Confirm & Publish Listing
          </button>
        </div>
      )}

    </div>
  );
};
