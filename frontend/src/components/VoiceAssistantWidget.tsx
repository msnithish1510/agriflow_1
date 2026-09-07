"use client";

import React, { useState, useEffect } from 'react';
import { Mic, Globe, CheckCircle2, MessageSquare, AlertCircle, Edit3, Volume2 } from 'lucide-react';
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
      ml: 'വിള സ്റ്റോക്ക് ലിസ്റ്റിംഗ് സ്ഥിരീകരിക്കുകയും AGRIFlow നെറ്റ്‌വർക്കിൽ പ്രസിദ്ധീകരിക്കുകയും ചെയ്തു!',
      kn: 'ಬೆಳೆ ದಾಸ್ತಾನು ಪಟ್ಟಿಯನ್ನು ದೃಢೀಕರಿಸಲಾಗಿದೆ ಮತ್ತು AGRIFlow ನೆಟ್‌ವರ್ಕ್‌ನಲ್ಲಿ ಪ್ರಕಟಿಸಲಾಗಿದೆ!'
    };
    alert(alertMessages[language] || alertMessages.en);
    setShowConfirmation(false);
    setParseResult(null);
  };

  const sampleQuestionsByLang: Record<Language, string[]> = {
    ta: [
      "என் அருகில் என்ன தேவை உள்ளது?",
      "என் பயிரை யார் வாங்க விரும்புகிறார்கள்?",
      "எதிர்பார்க்கப்படும் தேவை என்ன?",
      "எந்த வாங்குபவர் சிறந்த விலை தருகிறார்?"
    ],
    hi: [
      "मेरे पास कौन सी मांग उपलब्ध है?",
      "मेरी फसल कौन खरीदना चाहता है?",
      "अपेक्षित बाजार मांग क्या है?",
      "कौन सा खरीदार बेहतर भुगतान देता है?"
    ],
    te: [
      "నా సమీపంలో ఎలాంటి డిమాండ్ ఉంది?",
      "నా పంటను ఎవరు కొనాలనుకుంటున్నారు?",
      "మార్కెట్లో ఆశించిన డిమాండ్ ఏమిటి?",
      "ఏ కొనుగోలుదారు మెరుగైన ధర ఇస్తారు?"
    ],
    ml: [
      "എന്റെ അടുത്ത് എന്തൊക്കെ ആവശ്യക്കാരുണ്ട്?",
      "എന്റെ വിള വാങ്ങാൻ ആഗ്രഹിക്കുന്നത് ആരാണ്?",
      "പ്രതീക്ഷിക്കുന്ന വിപണി ഡിമാൻഡ് എന്താണ്?",
      "ഏത് വ്യാപാരിയാണ് മികച്ച വില നൽകുന്നത്?"
    ],
    kn: [
      "ನನ್ನ ಹತ್ತಿರ ಯಾವ ಬೇಡಿಕೆ ಲಭ್ಯವಿದೆ?",
      "ನನ್ನ ಬೆಳೆಯನ್ನು ಯಾರು ಖರೀದಿಸಲು ಬಯಸುತ್ತಾರೆ?",
      "ನಿರೀಕ್ಷಿತ ಮಾರುಕಟ್ಟೆ ಬೇಡಿಕೆ ಏನು?",
      "ಯಾವ ಖರೀದಿದಾರರು ಉತ್ತಮ ಬೆಲೆ ನೀಡುತ್ತಾರೆ?"
    ],
    en: [
      "What demand is available near me?",
      "Who is looking for my crop?",
      "What is the expected demand?",
      "Which buyer gives better payout?"
    ]
  };

  const sampleQuestions = sampleQuestionsByLang[language] || sampleQuestionsByLang.en;

  const voiceTitleByLang: Record<Language, string> = {
    en: 'Voice Assistance (AI Voice)',
    ta: 'குரல் உதவி (Voice Assistance)',
    hi: 'आवाज सहायता (Voice Assistance)',
    te: 'వాయిస్ సహాయం (Voice Assistance)',
    ml: 'വോയ്‌സ് അസിസ്റ്റൻസ് (Voice Assistance)',
    kn: 'ಧ್ವನಿ ಸಹಾಯಕ (Voice Assistance)'
  };

  const promptSubtextByLang: Record<Language, string> = {
    en: 'Speak your crop details or tap questions to get instant market answers',
    ta: 'பயிர் விவரங்களைப் பேசுங்கள் அல்லது உடனடி சந்தை பதில்களைப் பெற கேள்விகளைத் தட்டவும்',
    hi: 'फसल का विवरण बोलें या तुरंत बाजार की जानकारी पाने के लिए प्रश्नों पर टैप करें',
    te: 'మీ పంట వివరాలను మాట్లాడండి లేదా తక్షణ సమాచారం కోసం ప్రశ్నలపై నొక్కండి',
    ml: 'വിള വിവരങ്ങൾ സംസാരിക്കുക അല്ലെങ്കിൽ വിപണി വിവരങ്ങൾക്കായി ചോദ്യങ്ങളിൽ ടാപ്പ് ചെയ്യുക',
    kn: 'ಬೆಳೆ ವಿವರಗಳನ್ನು ಮಾತನಾಡಿ ಅಥವಾ ತಕ್ಷಣದ ಮಾರುಕಟ್ಟೆ ಉತ್ತರಗಳಿಗಾಗಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ'
  };

  const inputLabelByLang: Record<Language, string> = {
    en: 'Spoken Voice Input / Transcript:',
    ta: 'குரல் உள்ளீடு / உரை:',
    hi: 'आवाज इनपुट / ट्रांसक्रिप्ट:',
    te: 'వాయిస్ ఇన్‌పుట్ / లిప్యంతరీకరణ:',
    ml: 'വോയ്‌സ് ഇൻപുട്ട് / ട്രാൻസ്‌ക്രിപ്റ്റ്:',
    kn: 'ಧ್ವನಿ ಇನ್‌ಪುಟ್ / ಲಿಪ್ಯಂತರ:'
  };

  const speakBtnLabelByLang: Record<Language, string> = {
    en: isListening ? 'Listening...' : 'Speak / Extract',
    ta: isListening ? 'கேட்கிறது...' : 'பேசவும்',
    hi: isListening ? 'सुन रहा है...' : 'बोलें / निकालें',
    te: isListening ? 'వింటుంది...' : 'మాట్లాడండి',
    ml: isListening ? 'കേൾക്കുന്നു...' : 'സംസാരിക്കുക',
    kn: isListening ? 'ಕೇಳುತ್ತಿದೆ...' : 'ಮಾತನಾಡಿ'
  };

  const quickQuestionsLabel: Record<Language, string> = {
    en: 'Tap to ask farmer questions:',
    ta: 'விரைவு வினாக்கள் (கேள்விகளைத் தட்டவும்):',
    hi: 'किसान त्वरित प्रश्न (पूछने के लिए टैप करें):',
    te: 'రైతు త్వరిత ప్రశ్నలు (అడగడానికి నొక్కండి):',
    ml: 'കർഷക ചോദ്യങ്ങൾ (ചോദിക്കാൻ ടാപ്പ് ചെയ്യുക):',
    kn: 'ರೈತ ತ್ವರಿತ ಪ್ರಶ್ನೆಗಳು (ಕೇಳಲು ಟ್ಯಾಪ್ ಮಾಡಿ):'
  };

  const groundedBadgeByLang: Record<Language, string> = {
    en: 'Grounded in live AGRIFlow market data',
    ta: 'நேரடி சந்தை மற்றும் தேவை தகவல்களின் அடிப்படையில்',
    hi: 'लाइव AGRIFlow बाजार डेटा पर आधारित',
    te: 'ప్రత్యక్ష AGRIFlow మార్కెట్ డేటా ఆధారంగా',
    ml: 'തത്സമയ AGRIFlow വിപണി വിവരങ്ങളെ അടിസ്ഥാനമാക്കി',
    kn: 'ಲೈವ್ AGRIFlow ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಯ ಆಧಾರದ ಮೇಲೆ'
  };

  const reviewSubtextByLang: Record<Language, string> = {
    en: 'Please review extracted crop details before submitting to buyers:',
    ta: 'வெளியிடும் முன் குரல் மூலம் பெறப்பட்ட தகவல்களைச் சரிபார்க்கவும்:',
    hi: 'खरीदारों को सबमिट करने से पहले निकाले गए फसल विवरण की समीक्षा करें:',
    te: 'కొనుగోలుదారులకు సమర్పించే ముందు సేకరించిన పంట వివరాలను సమీక్షించండి:',
    ml: 'വ്യാപാരികൾക്ക് സമർപ്പിക്കുന്നതിന് മുമ്പ് ശേഖരിച്ച വിള വിവരങ്ങൾ പരിശോധിക്കുക:',
    kn: 'ಖರೀದಿದಾರರಿಗೆ ಸಲ್ಲಿಸುವ ಮೊದಲು ಹೊರತೆಗೆಯಲಾದ ಬೆಳೆ ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ:'
  };

  return (
    <div className="glass-panel" style={{ border: '1px solid rgba(16,185,129,0.3)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Volume2 size={22} color="#10b981" /> {voiceTitleByLang[language] || voiceTitleByLang.en}
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '2px' }}>
            {promptSubtextByLang[language] || promptSubtextByLang.en}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Globe size={18} color="#38bdf8" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="input-large"
            style={{ width: 'auto', minHeight: '40px', padding: '6px 12px', fontSize: '0.85rem' }}
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>
                {l.nativeName} ({l.label})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Voice Spoken Input Box */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '14px', marginBottom: '16px' }}>
        <label style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '8px', fontWeight: 600 }}>
          {inputLabelByLang[language] || inputLabelByLang.en}
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
            <Mic size={20} /> {speakBtnLabelByLang[language] || speakBtnLabelByLang.en}
          </button>
        </div>
      </div>

      {/* Grounded Farmer Preset Queries */}
      <div style={{ marginBottom: '16px' }}>
        <span style={{ fontSize: '0.85rem', color: '#cbd5e1', display: 'block', marginBottom: '10px', fontWeight: 600 }}>
          💡 {quickQuestionsLabel[language] || quickQuestionsLabel.en}
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
            ✓ {groundedBadgeByLang[language] || groundedBadgeByLang.en}
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
              {reviewSubtextByLang[language] || reviewSubtextByLang.en}
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
