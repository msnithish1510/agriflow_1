/**
 * Speech Recognition Service (Obsolete - Replaced by MediaRecorder + Groq Whisper)
 * Delegates all recording actions to audioRecorderService.
 * Retained for backwards compatibility if needed.
 */

import { audioRecorderService, MicPermissionStatus, TranscriptionResult } from './audioRecorderService';

export type SpeechLanguage = 'en-IN' | 'ta-IN';

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string, errorType: string) => void;
  onEnd: () => void;
  onStart: () => void;
}

class SpeechRecognitionServiceAdapter {
  isSupported(): boolean {
    return audioRecorderService.isSupported();
  }

  async startListening(lang: SpeechLanguage, callbacks: SpeechRecognitionCallbacks): Promise<boolean> {
    callbacks.onStart();
    const res = await audioRecorderService.startRecording();
    if (!res.success) {
      callbacks.onError(res.error || 'Failed to start microphone recording.', res.status.toLowerCase());
      callbacks.onEnd();
      return false;
    }
    return true;
  }

  async stopListening(): Promise<void> {
    const blob = await audioRecorderService.stopRecording();
    if (blob) {
      const res = await audioRecorderService.transcribeAudio(blob);
      if (res.success && res.text) {
        // Returned transcript
      }
    }
  }

  getIsActive(): boolean {
    return audioRecorderService.getIsRecording();
  }
}

export const speechRecognitionService = new SpeechRecognitionServiceAdapter();
