"use client";

import React from 'react';
import { Mic } from 'lucide-react';

interface VoiceAssistantFABProps {
  isListening: boolean;
  isOpen: boolean;
  onClick: () => void;
}

/**
 * Floating Action Button — bottom-right corner.
 * Pulsing microphone icon with emerald gradient.
 * Shows a red indicator dot when actively listening.
 */
export const VoiceAssistantFAB: React.FC<VoiceAssistantFABProps> = ({
  isListening,
  isOpen,
  onClick,
}) => {
  return (
    <button
      className={`voice-fab ${isListening ? 'listening' : ''}`}
      onClick={onClick}
      aria-label="Open voice assistant"
      aria-expanded={isOpen}
      id="voice-assistant-fab"
      style={{
        transform: isOpen ? 'scale(0.9)' : undefined,
      }}
    >
      <Mic size={26} color="white" strokeWidth={2.5} />
      {isListening && <div className="voice-fab-indicator" />}
    </button>
  );
};
