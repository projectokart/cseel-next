'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    lang = 'en-IN',
    continuous = false,
    interimResults = true,
    onResult,
    onError,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<any>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognition));
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping speech recognition:', err);
      }
    }
    setIsListening(false);
  }, [isListening]);

  const startListening = useCallback(
    (customLang?: string) => {
      if (typeof window === 'undefined') return;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        const msg = 'Speech recognition is not supported in this browser.';
        setError(msg);
        optionsRef.current.onError?.(msg);
        return;
      }

      // Stop previous instance if running
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      setError(null);
      setTranscript('');

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = customLang || lang || 'en-IN';
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          let isFinal = false;

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const piece = event.results[i][0].transcript;
            currentTranscript += piece;
            if (event.results[i].isFinal) {
              isFinal = true;
            }
          }

          const trimmed = currentTranscript.trim();
          setTranscript(trimmed);
          optionsRef.current.onResult?.(trimmed, isFinal);
        };

        recognition.onerror = (event: any) => {
          let errorMsg = 'Speech recognition error';
          if (event.error === 'not-allowed') {
            errorMsg = 'Microphone permission denied. Please allow microphone access.';
          } else if (event.error === 'no-speech') {
            errorMsg = 'No speech detected. Please speak clearly into your mic.';
          } else if (event.error === 'network') {
            errorMsg = 'Network error during voice recognition.';
          } else {
            errorMsg = `Voice error: ${event.error}`;
          }

          setError(errorMsg);
          setIsListening(false);
          optionsRef.current.onError?.(errorMsg);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        const msg = err?.message || 'Failed to start speech recognition.';
        setError(msg);
        setIsListening(false);
        optionsRef.current.onError?.(msg);
      }
    },
    [lang, continuous, interimResults]
  );

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
}
