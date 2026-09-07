"use client";

import React from 'react';
import { UserRole } from '@/types';
import { Language, translations } from '@/services/translations';

interface VoiceSuggestionsProps {
  language: Language;
  userRole: UserRole;
  onSuggestionClick: (text: string) => void;
}

/**
 * Role-aware suggestion chips. Shows different quick commands
 * based on user role with Tamil and English versions.
 */
export const VoiceSuggestions: React.FC<VoiceSuggestionsProps> = ({
  language,
  userRole,
  onSuggestionClick,
}) => {
  const t = translations[language].voiceAssistant;

  let suggestions: string[];
  switch (userRole) {
    case 'FARMER':
    case 'FPO':
      suggestions = t.farmerSuggestions;
      break;
    case 'CONSUMER':
      suggestions = t.consumerSuggestions;
      break;
    case 'BULK_BUYER':
      suggestions = t.buyerSuggestions;
      break;
    default:
      suggestions = t.generalSuggestions;
  }

  return (
    <div>
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#64748b',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        💡 {t.suggestions}
      </div>
      <div className="voice-suggestions">
        {suggestions.map((suggestion, idx) => (
          <button
            key={idx}
            className="voice-suggestion-chip"
            onClick={() => onSuggestionClick(suggestion)}
            aria-label={suggestion}
          >
            🎤 {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
