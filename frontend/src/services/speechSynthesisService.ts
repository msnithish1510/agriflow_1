/**
 * Speech Synthesis Service
 * Browser SpeechSynthesis wrapper for text-to-speech.
 * Supports Tamil and English India voices with mute control.
 */

class SpeechSynthesisService {
  private isMutedState: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  /**
   * Check if SpeechSynthesis is available
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return 'speechSynthesis' in window;
  }

  /**
   * Speak text aloud in the specified language
   */
  speak(text: string, language: string): void {
    if (!this.isSupported() || this.isMutedState) return;

    // Stop any current speech
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const langCodes: Record<string, string> = {
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ml: 'ml-IN',
      kn: 'kn-IN',
      en: 'en-IN'
    };
    utterance.lang = langCodes[language] || 'en-IN';
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find the best voice for the language
    const voices = window.speechSynthesis.getVoices();
    const targetLang = language;

    const preferredVoice = voices.find(v =>
      v.lang.startsWith(targetLang) && v.lang.includes('IN')
    ) || voices.find(v =>
      v.lang.startsWith(targetLang)
    );

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop current speech
   */
  stop(): void {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * Check if currently speaking
   */
  isSpeaking(): boolean {
    if (!this.isSupported()) return false;
    return window.speechSynthesis.speaking;
  }

  /**
   * Get muted state
   */
  get isMuted(): boolean {
    return this.isMutedState;
  }

  /**
   * Set muted state
   */
  setMuted(muted: boolean): void {
    this.isMutedState = muted;
    if (muted) {
      this.stop();
    }
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }
}

export const speechSynthesisService = new SpeechSynthesisService();
