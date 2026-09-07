"use client";

import React from 'react';

/**
 * Animated waveform bars displayed while the assistant is listening.
 * Pure CSS animation — no audio analysis required.
 */
export const VoiceWaveform: React.FC = () => {
  return (
    <div className="voice-waveform" role="status" aria-label="Listening for speech">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="voice-waveform-bar" />
      ))}
    </div>
  );
};
