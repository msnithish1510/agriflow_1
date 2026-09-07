"use client";

import React from 'react';
import { Language } from '@/services/translations';

interface VoiceLanguageSelectorProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

/**
 * Compact language toggle between தமிழ் and English.
 */
export const VoiceLanguageSelector: React.FC<VoiceLanguageSelectorProps> = ({
  language,
  onLanguageChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        background: 'rgba(0,0,0,0.4)',
        padding: '2px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <button
        onClick={() => onLanguageChange('en')}
        aria-label="Switch to English"
        style={{
          padding: '4px 10px',
          borderRadius: '8px',
          border: 'none',
          background: language === 'en' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
          color: language === 'en' ? '#fff' : '#94a3b8',
          fontWeight: 700,
          fontSize: '0.78rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
        }}
      >
        EN
      </button>
      <button
        onClick={() => onLanguageChange('ta')}
        aria-label="Switch to Tamil"
        style={{
          padding: '4px 10px',
          borderRadius: '8px',
          border: 'none',
          background: language === 'ta' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
          color: language === 'ta' ? '#fff' : '#94a3b8',
          fontWeight: 700,
          fontSize: '0.78rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: 'inherit',
        }}
      >
        தமிழ்
      </button>
    </div>
  );
};
