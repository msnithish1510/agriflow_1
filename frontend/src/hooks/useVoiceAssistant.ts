/**
 * useVoiceAssistant — React hook combining voice assistant services.
 * Manages panel state, MediaRecorder audio recording, backend Groq Whisper transcription,
 * messages, processing visualization, demo mode, confirmation flows, and text-to-speech.
 */

"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { VoiceMessage, ProcessingState, UserRole, NavigateToTarget, VoiceAction } from '@/types';
import { Language, translations } from '@/services/translations';
import { audioRecorderService, MicPermissionStatus } from '@/services/audioRecorderService';
import { speechSynthesisService } from '@/services/speechSynthesisService';
import { voiceAssistantService, DemoScenario } from '@/services/voiceAssistantService';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

export interface UseVoiceAssistantReturn {
  // Panel state
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;

  // Listening & Recording (MediaRecorder + Backend Groq Whisper)
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => Promise<void>;
  cancelListening: () => void;

  // Messages
  messages: VoiceMessage[];
  interimTranscript: string;

  // Processing
  processingState: ProcessingState;

  // Language
  language: Language;

  // TTS
  isMuted: boolean;
  toggleMute: () => void;

  // Demo mode
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  runDemoScenario: (scenario: DemoScenario) => void;
  demoScenarios: DemoScenario[];

  // Text input
  processTextInput: (text: string) => void;

  // Confirmation
  confirmAction: (messageId: string) => void;
  cancelAction: (messageId: string) => void;

  // Suggestion
  sendSuggestion: (text: string) => void;

  // Speech & MediaRecorder supported
  isSpeechSupported: boolean;

  // Navigation callback
  pendingNavigation: NavigateToTarget | null;
  clearNavigation: () => void;
}

export function useVoiceAssistant(
  appLanguage: Language,
  userRole: UserRole,
  onLanguageChange?: (lang: Language) => void,
): UseVoiceAssistantReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [processingState, setProcessingState] = useState<ProcessingState>('IDLE');
  const [isMuted, setIsMuted] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<NavigateToTarget | null>(null);

  const language = appLanguage;
  const hasGreeted = useRef(false);

  // Add greeting when panel opens
  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      hasGreeted.current = true;
      const t = translations[language].voiceAssistant;
      addAssistantMessage(t.greeting);
    }
  }, [isOpen, language]);

  const isSpeechSupported = typeof window !== 'undefined' && audioRecorderService.isSupported();

  // ============================================================
  // Message management
  // ============================================================

  const addUserMessage = useCallback((text: string) => {
    const msg: VoiceMessage = {
      id: generateId(),
      type: 'user',
      text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  const addAssistantMessage = useCallback((text: string, action?: VoiceAction, confirmationData?: VoiceMessage['confirmationData']) => {
    const msg: VoiceMessage = {
      id: generateId(),
      type: 'assistant',
      text,
      timestamp: new Date(),
      action,
      confirmationData,
    };
    setMessages(prev => [...prev, msg]);
    return msg;
  }, []);

  // ============================================================
  // Processing pipeline
  // ============================================================

  const processInput = useCallback(async (text: string) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setInterimTranscript('');

    // Processing visualization
    setProcessingState('UNDERSTANDING');
    await delay(200);
    setProcessingState('DETECTING_INTENT');
    await delay(200);
    setProcessingState('CHECKING_PERMISSIONS');
    await delay(150);
    setProcessingState('PERFORMING_ACTION');

    // Process through AGRIFlow voice assistant orchestrator service
    const result = voiceAssistantService.processCommand(text, language, userRole);

    await delay(150);
    setProcessingState('RESPONSE_READY');

    // Add response message
    if (result.requiresConfirmation) {
      addAssistantMessage(result.response, result.action, {
        actionDescription: result.response,
        intent: result.intent,
        entities: result.entities,
      });
    } else {
      addAssistantMessage(result.response, result.action);
    }

    // Handle navigation
    if (result.action.type === 'NAVIGATE' && !result.requiresConfirmation) {
      setPendingNavigation({
        role: result.action.role,
        tab: result.action.tab,
      });
    }

    // Speak response using browser SpeechSynthesis
    if (!isMuted) {
      speechSynthesisService.speak(result.response, language);
    }

    await delay(400);
    setProcessingState('IDLE');
  }, [language, userRole, isMuted, addUserMessage, addAssistantMessage]);

  // ============================================================
  // MediaRecorder + Groq Whisper Speech Recognition
  // ============================================================

  const startListening = useCallback(async () => {
    if (!isSpeechSupported) {
      const t = translations[language].voiceAssistant;
      addAssistantMessage(t.browserNotSupported);
      return;
    }

    setInterimTranscript('');
    setProcessingState('LISTENING');

    const res = await audioRecorderService.startRecording();
    if (res.success) {
      setIsListening(true);
    } else {
      setIsListening(false);
      setProcessingState('IDLE');
      const t = translations[language].voiceAssistant;

      if (res.status === 'DENIED') {
        addAssistantMessage(t.micPermissionDenied);
      } else if (res.status === 'NO_MICROPHONE') {
        addAssistantMessage(language === 'ta' ? 'மைக்ரோஃபோன் சாதனம் கிடைக்கவில்லை.' : 'No microphone input device was found.');
      } else {
        addAssistantMessage(res.error || t.notUnderstood);
      }
    }
  }, [isSpeechSupported, language, addAssistantMessage]);

  const stopListening = useCallback(async () => {
    if (!isListening && !audioRecorderService.getIsRecording()) return;

    setIsListening(false);
    setProcessingState('UNDERSTANDING');

    const audioBlob = await audioRecorderService.stopRecording();

    if (!audioBlob || audioBlob.size === 0) {
      setProcessingState('IDLE');
      return;
    }

    setProcessingState('DETECTING_INTENT');

    const transResult = await audioRecorderService.transcribeAudio(audioBlob);

    if (transResult.success && transResult.text && transResult.text.trim()) {
      await processInput(transResult.text.trim());
    } else {
      setProcessingState('IDLE');
      const t = translations[language].voiceAssistant;
      addAssistantMessage(transResult.error || t.notUnderstood);
    }
  }, [isListening, language, processInput, addAssistantMessage]);

  const cancelListening = useCallback(() => {
    audioRecorderService.cancelRecording();
    setIsListening(false);
    setProcessingState('IDLE');
    setInterimTranscript('');
  }, []);

  // ============================================================
  // Panel controls
  // ============================================================

  const togglePanel = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    cancelListening();
    speechSynthesisService.stop();
  }, [cancelListening]);

  // ============================================================
  // TTS controls
  // ============================================================

  const toggleMute = useCallback(() => {
    const muted = speechSynthesisService.toggleMute();
    setIsMuted(muted);
  }, []);

  // ============================================================
  // Demo mode
  // ============================================================

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => !prev);
  }, []);

  const runDemoScenario = useCallback(async (scenario: DemoScenario) => {
    const input = language === 'ta' ? scenario.inputTa : scenario.inputEn;
    const response = language === 'ta' ? scenario.responseTa : scenario.responseEn;

    // Simulate listening
    setProcessingState('LISTENING');
    setInterimTranscript('');
    await delay(300);

    // Simulate speech appearing word by word
    const words = input.split(' ');
    for (let i = 0; i < words.length; i++) {
      setInterimTranscript(words.slice(0, i + 1).join(' '));
      await delay(100);
    }

    await delay(200);
    setInterimTranscript('');
    addUserMessage(input);

    // Processing visualization
    setProcessingState('UNDERSTANDING');
    await delay(300);
    setProcessingState('DETECTING_INTENT');
    await delay(300);
    setProcessingState('CHECKING_PERMISSIONS');
    await delay(200);
    setProcessingState('PERFORMING_ACTION');
    await delay(200);
    setProcessingState('RESPONSE_READY');

    addAssistantMessage(response, scenario.action);

    // Navigate
    if (scenario.action.type === 'NAVIGATE') {
      setPendingNavigation({
        role: scenario.action.role,
        tab: scenario.action.tab,
      });
    }

    // Speak
    if (!isMuted) {
      speechSynthesisService.speak(response, language);
    }

    await delay(400);
    setProcessingState('IDLE');
  }, [language, isMuted, addUserMessage, addAssistantMessage]);

  const demoScenarios = voiceAssistantService.getAllDemoScenarios();

  // ============================================================
  // Text input & suggestion
  // ============================================================

  const processTextInput = useCallback((text: string) => {
    processInput(text);
  }, [processInput]);

  const sendSuggestion = useCallback((text: string) => {
    processInput(text);
  }, [processInput]);

  // ============================================================
  // Confirmation
  // ============================================================

  const confirmAction = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.confirmationData) {
        return { ...m, confirmationData: { ...m.confirmationData, confirmed: true } };
      }
      return m;
    }));

    const confirmMsg = language === 'ta'
      ? '✅ செயல் உறுதிப்படுத்தப்பட்டது! உங்கள் கோரிக்கை செயல்படுத்தப்பட்டது.'
      : '✅ Action confirmed! Your request has been processed.';
    addAssistantMessage(confirmMsg);

    if (!isMuted) {
      speechSynthesisService.speak(confirmMsg, language);
    }
  }, [language, isMuted, addAssistantMessage]);

  const cancelAction = useCallback((messageId: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id === messageId && m.confirmationData) {
        return { ...m, confirmationData: { ...m.confirmationData, confirmed: false } };
      }
      return m;
    }));

    const cancelMsg = language === 'ta'
      ? '❌ செயல் ரத்து செய்யப்பட்டது.'
      : '❌ Action cancelled.';
    addAssistantMessage(cancelMsg);
  }, [language, addAssistantMessage]);

  // ============================================================
  // Navigation
  // ============================================================

  const clearNavigation = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  return {
    isOpen,
    togglePanel,
    closePanel,
    isListening,
    startListening,
    stopListening,
    cancelListening,
    messages,
    interimTranscript,
    processingState,
    language,
    isMuted,
    toggleMute,
    isDemoMode,
    toggleDemoMode,
    runDemoScenario,
    demoScenarios,
    processTextInput,
    confirmAction,
    cancelAction,
    sendSuggestion,
    isSpeechSupported,
    pendingNavigation,
    clearNavigation,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
