"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, MicOff, Volume2, VolumeX, Send, Zap, Square, StopCircle } from 'lucide-react';
import { ProcessingState, UserRole } from '@/types';
import { Language, translations } from '@/services/translations';
import { VoiceWaveform } from './VoiceWaveform';
import { VoiceLanguageSelector } from './VoiceLanguageSelector';
import { VoiceMessage as VoiceMessageComponent } from './VoiceMessage';
import { VoiceSuggestions } from './VoiceSuggestions';
import type { UseVoiceAssistantReturn } from '@/hooks/useVoiceAssistant';

interface VoicePanelProps {
  assistant: UseVoiceAssistantReturn;
  userRole: UserRole;
  onLanguageChange: (lang: Language) => void;
}

/**
 * Main voice assistant panel — slide-up overlay with conversation,
 * MediaRecorder audio visualization, Groq Whisper processing status,
 * microphone controls (Start, Stop, Cancel), text input fallback, and suggestions.
 */
export const VoicePanel: React.FC<VoicePanelProps> = ({
  assistant,
  userRole,
  onLanguageChange,
}) => {
  const [textInput, setTextInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  const t = translations[assistant.language].voiceAssistant;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [assistant.messages, assistant.interimTranscript, assistant.processingState]);

  const handleTextSubmit = () => {
    const trimmed = textInput.trim();
    if (trimmed) {
      assistant.processTextInput(trimmed);
      setTextInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const focusTextInput = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  // Processing state steps
  const processingSteps: { state: ProcessingState; icon: string; label: string }[] = [
    { state: 'LISTENING', icon: '🔴', label: t.listening },
    { state: 'UNDERSTANDING', icon: '⏳', label: t.understanding },
    { state: 'DETECTING_INTENT', icon: '🧠', label: t.detectingIntent },
    { state: 'CHECKING_PERMISSIONS', icon: '🔐', label: t.checkingPermissions },
    { state: 'PERFORMING_ACTION', icon: '⚡', label: t.performingAction },
    { state: 'RESPONSE_READY', icon: '🤖', label: t.responseReady },
  ];

  const stateOrder: ProcessingState[] = ['LISTENING', 'UNDERSTANDING', 'DETECTING_INTENT', 'CHECKING_PERMISSIONS', 'PERFORMING_ACTION', 'RESPONSE_READY'];
  const currentStateIndex = stateOrder.indexOf(assistant.processingState);

  return (
    <div className="voice-panel" role="dialog" aria-label="Voice Assistant Panel" aria-modal="false">
      {/* ============================================================
          Header
          ============================================================ */}
      <div className="voice-panel-header">
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
              {t.panelTitle}
            </span>
            {assistant.isDemoMode && (
              <span className="voice-demo-badge">{t.demoMode}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <VoiceLanguageSelector language={assistant.language} onLanguageChange={onLanguageChange} />
            <button
              onClick={assistant.toggleMute}
              aria-label={assistant.isMuted ? t.unmute : t.mute}
              title={assistant.isMuted ? t.unmute : t.mute}
              style={{
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: assistant.isMuted ? '#f87171' : '#34d399',
                display: 'flex',
                alignItems: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {assistant.isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>
            <button
              onClick={assistant.toggleDemoMode}
              title={t.demoModeLabel}
              style={{
                background: assistant.isDemoMode ? 'rgba(245,158,11,0.2)' : 'transparent',
                border: `1px solid ${assistant.isDemoMode ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '8px',
                padding: '4px 8px',
                cursor: 'pointer',
                color: assistant.isDemoMode ? '#fbbf24' : '#94a3b8',
                fontSize: '0.7rem',
                fontWeight: 700,
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              <Zap size={12} />
            </button>
          </div>
        </div>
        <button
          onClick={assistant.closePanel}
          aria-label={t.close}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* ============================================================
          Body — Messages + Processing
          ============================================================ */}
      <div className="voice-panel-body" ref={bodyRef}>
        {/* Conversation messages */}
        {assistant.messages.map(msg => (
          <VoiceMessageComponent
            key={msg.id}
            message={msg}
            language={assistant.language}
            onConfirm={assistant.confirmAction}
            onCancel={assistant.cancelAction}
          />
        ))}

        {/* Interim transcript or active status */}
        {assistant.interimTranscript && (
          <div className="voice-message voice-message-user" style={{ opacity: 0.7 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#34d399', marginBottom: '4px' }}>
              🎤 {t.listening}
            </div>
            <div style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
              {assistant.interimTranscript}
            </div>
          </div>
        )}

        {/* Processing visualization */}
        {assistant.processingState !== 'IDLE' && (
          <div className="voice-processing">
            {processingSteps.map((step) => {
              const stepIndex = stateOrder.indexOf(step.state);
              const isDone = stepIndex < currentStateIndex;
              const isActive = stepIndex === currentStateIndex;
              const isPending = stepIndex > currentStateIndex;

              return (
                <div
                  key={step.state}
                  className={`voice-processing-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  style={{ opacity: isPending ? 0.3 : 1 }}
                >
                  <span className="step-icon">
                    {isDone ? '✓' : step.icon}
                  </span>
                  {isActive && <div className="step-spinner" />}
                  <span>{step.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Demo mode scenarios */}
        {assistant.isDemoMode && assistant.messages.length <= 1 && (
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fbbf24', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} /> {assistant.language === 'ta' ? 'டெமோ சூழ்நிலைகள் — தட்டி இயக்கவும்' : 'Demo Scenarios — Tap to Run'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {assistant.demoScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => assistant.runDemoScenario(scenario)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid rgba(245,158,11,0.2)',
                    background: 'rgba(245,158,11,0.06)',
                    color: '#fbbf24',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    fontFamily: 'inherit',
                  }}
                >
                  🎤 {assistant.language === 'ta' ? scenario.inputTa : scenario.inputEn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions (show when idle and no recent messages) */}
        {assistant.processingState === 'IDLE' && !assistant.isDemoMode && (
          <VoiceSuggestions
            language={assistant.language}
            userRole={userRole}
            onSuggestionClick={assistant.sendSuggestion}
          />
        )}
      </div>

      {/* ============================================================
          Footer — Microphone + MediaRecorder Controls + Text Input
          ============================================================ */}
      <div className="voice-panel-footer">
        {/* Microphone / MediaRecorder controls */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          {assistant.isListening ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  className="voice-mic-btn listening"
                  onClick={assistant.stopListening}
                  aria-label="Stop recording and transcribe"
                  title="Stop recording"
                >
                  <StopCircle size={28} color="white" />
                </button>
                <button
                  onClick={assistant.cancelListening}
                  aria-label="Cancel recording"
                  title="Cancel recording"
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    color: '#f87171',
                    borderRadius: '50%',
                    width: '38px',
                    height: '38px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <X size={18} />
                </button>
              </div>
              <VoiceWaveform />
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#ef4444', fontWeight: 700 }}>
                  🔴 {t.listening}
                </span>
                <button
                  onClick={assistant.cancelListening}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  {t.cancel}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <button
                className="voice-mic-btn"
                onClick={assistant.startListening}
                aria-label="Start voice assistant"
                disabled={assistant.processingState !== 'IDLE' || assistant.isDemoMode}
                style={{
                  opacity: (assistant.processingState !== 'IDLE' || assistant.isDemoMode) ? 0.5 : 1,
                }}
              >
                <Mic size={28} color="white" />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                  🎤 {t.tapToSpeak}
                </span>
                <span style={{ color: '#475569', fontSize: '0.75rem' }}>•</span>
                <button
                  onClick={focusTextInput}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#10b981',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  {t.typeInstead || (assistant.language === 'ta' ? 'தட்டச்சு செய்யவும்' : 'Type instead')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Text input fallback */}
        <div className="voice-text-input-row">
          <input
            ref={textInputRef}
            type="text"
            className="voice-text-input"
            placeholder={t.typeHere}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={t.typeHere}
          />
          <button
            className="voice-send-btn"
            onClick={handleTextSubmit}
            aria-label={t.send}
            disabled={!textInput.trim()}
            style={{ opacity: textInput.trim() ? 1 : 0.5 }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
