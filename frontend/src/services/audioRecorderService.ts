/**
 * Audio Recorder Service
 * Browser MediaRecorder wrapper with MIME type detection, microphone permission handling,
 * audio blob generation, track cleanup, and backend Groq Whisper transcription API client.
 * Completely replaces old Web Speech API / SpeechRecognition.
 */

export type MicPermissionStatus = 'GRANTED' | 'DENIED' | 'NO_MICROPHONE' | 'UNSUPPORTED' | 'NOT_REQUESTED';

export interface TranscriptionResult {
  success: boolean;
  text: string;
  language?: string;
  error?: string;
}

class AudioRecorderService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private isRecordingState: boolean = false;
  private permissionStatusState: MicPermissionStatus = 'NOT_REQUESTED';

  /**
   * Check if MediaRecorder and getUserMedia are supported in the browser
   */
  isSupported(): boolean {
    if (typeof window === 'undefined') return false;
    return !!(
      navigator.mediaDevices &&
      typeof window.MediaRecorder !== 'undefined'
    );
  }

  /**
   * Select the best supported MIME type for recording
   */
  getSupportedMimeType(): string {
    if (typeof window === 'undefined' || typeof MediaRecorder === 'undefined') return '';

    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/mp4',
      'audio/wav'
    ];

    for (const type of types) {
      try {
        if (MediaRecorder.isTypeSupported(type)) {
          return type;
        }
      } catch (e) {
        // Continue checking
      }
    }

    return '';
  }

  /**
   * Start audio recording with selected browser MIME type
   */
  async startRecording(): Promise<{ success: boolean; status: MicPermissionStatus; error?: string }> {
    if (!this.isSupported()) {
      this.permissionStatusState = 'UNSUPPORTED';
      return { success: false, status: 'UNSUPPORTED', error: 'MediaRecorder is not supported in this browser.' };
    }

    // Stop any existing active recording session
    this.cancelRecording();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaStream = stream;
      this.permissionStatusState = 'GRANTED';
      this.audioChunks = [];

      const mimeType = this.getSupportedMimeType();
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {};

      this.mediaRecorder = new MediaRecorder(stream, options);

      this.mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // collect 100ms chunks
      this.isRecordingState = true;

      return { success: true, status: 'GRANTED' };

    } catch (err: any) {
      this.cleanupStream();
      this.isRecordingState = false;

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.permissionStatusState = 'DENIED';
        return { success: false, status: 'DENIED', error: 'Microphone permission denied by user or browser.' };
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        this.permissionStatusState = 'NO_MICROPHONE';
        return { success: false, status: 'NO_MICROPHONE', error: 'No microphone input device was found.' };
      } else {
        return { success: false, status: 'DENIED', error: err.message || 'Failed to access microphone.' };
      }
    }
  }

  /**
   * Stop audio recording and return recorded Blob
   */
  stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || !this.isRecordingState) {
        this.cleanupStream();
        this.isRecordingState = false;
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || this.getSupportedMimeType() || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        
        this.cleanupStream();
        this.isRecordingState = false;
        this.mediaRecorder = null;
        this.audioChunks = [];

        resolve(audioBlob);
      };

      try {
        if (this.mediaRecorder.state !== 'inactive') {
          this.mediaRecorder.stop();
        } else {
          this.cleanupStream();
          this.isRecordingState = false;
          resolve(null);
        }
      } catch (e) {
        this.cleanupStream();
        this.isRecordingState = false;
        resolve(null);
      }
    });
  }

  /**
   * Cancel recording without returning audio
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        this.mediaRecorder.onstop = null;
        this.mediaRecorder.stop();
      } catch (e) {
        // Ignore
      }
    }
    this.cleanupStream();
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.isRecordingState = false;
  }

  /**
   * Send audio Blob to backend transcription endpoint (/api/v1/voice/transcribe)
   */
  async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    if (!audioBlob || audioBlob.size === 0) {
      return {
        success: false,
        text: '',
        error: 'Recorded audio is empty.'
      };
    }

    try {
      const formData = new FormData();
      const ext = audioBlob.type.includes('ogg') ? 'ogg' : audioBlob.type.includes('mp4') ? 'mp4' : 'webm';
      formData.append('file', audioBlob, `recording.${ext}`);

      // Base API URL handling (supports local dev server proxy or direct port 8000)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/v1/voice/transcribe`;

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return {
          success: false,
          text: '',
          error: errJson.detail || `Server error (HTTP ${response.status})`
        };
      }

      const data: TranscriptionResult = await response.json();
      return data;

    } catch (err: any) {
      return {
        success: false,
        text: '',
        error: err.message || 'Network error connecting to transcription server.'
      };
    }
  }

  /**
   * Check if currently recording
   */
  getIsRecording(): boolean {
    return this.isRecordingState;
  }

  /**
   * Get current microphone permission status
   */
  getPermissionStatus(): MicPermissionStatus {
    return this.permissionStatusState;
  }

  /**
   * Stop all MediaStream tracks and release microphone
   */
  private cleanupStream(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (e) {
          // Ignore
        }
      });
      this.mediaStream = null;
    }
  }
}

export const audioRecorderService = new AudioRecorderService();
