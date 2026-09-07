"use client";

import React from 'react';
import { VoiceMessage as VoiceMessageType } from '@/types';
import { Language, translations } from '@/services/translations';

interface VoiceMessageProps {
  message: VoiceMessageType;
  language: Language;
  onConfirm?: (messageId: string) => void;
  onCancel?: (messageId: string) => void;
}

/**
 * Individual chat message bubble — user messages (right-aligned)
 * and assistant messages (left-aligned with action buttons).
 */
export const VoiceMessage: React.FC<VoiceMessageProps> = ({
  message,
  language,
  onConfirm,
  onCancel,
}) => {
  const isUser = message.type === 'user';
  const t = translations[language].voiceAssistant;
  const hasConfirmation = message.confirmationData && message.confirmationData.confirmed === undefined;

  return (
    <div
      className={`voice-message ${isUser ? 'voice-message-user' : 'voice-message-ai'}`}
      role={isUser ? 'log' : 'status'}
    >
      {/* Sender label */}
      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          marginBottom: '4px',
          color: isUser ? '#34d399' : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {isUser ? (
          <>🎤 {t.youSaid}</>
        ) : (
          <>🤖 {t.aiResponse}</>
        )}
      </div>

      {/* Message text */}
      <div style={{ fontSize: '0.9rem', lineHeight: 1.55 }}>
        {message.text}
      </div>

      {/* Confirmation buttons */}
      {hasConfirmation && (
        <div className="voice-confirm-actions">
          <button
            className="voice-confirm-btn confirm"
            onClick={() => onConfirm?.(message.id)}
            aria-label="Confirm action"
          >
            ✓ {t.confirm}
          </button>
          <button
            className="voice-confirm-btn cancel"
            onClick={() => onCancel?.(message.id)}
            aria-label="Cancel action"
          >
            ✕ {t.cancel}
          </button>
        </div>
      )}

      {/* Confirmed/Cancelled status */}
      {message.confirmationData?.confirmed === true && (
        <div style={{ fontSize: '0.78rem', color: '#34d399', marginTop: '6px', fontWeight: 600 }}>
          ✅ {language === 'ta' ? 'உறுதிப்படுத்தப்பட்டது' : 'Confirmed'}
        </div>
      )}
      {message.confirmationData?.confirmed === false && (
        <div style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '6px', fontWeight: 600 }}>
          ❌ {language === 'ta' ? 'ரத்து செய்யப்பட்டது' : 'Cancelled'}
        </div>
      )}
    </div>
  );
};
