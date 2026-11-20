'use client';

import React from 'react';
import { Mic, Loader2 } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  lang?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
  disabled?: boolean;
}

export default function VoiceInputButton({
  onTranscript,
  lang = 'en-IN',
  className = '',
  size = 'md',
  title = 'Search or fill by voice',
  disabled = false,
}: VoiceInputButtonProps) {
  const { isListening, isSupported, error, startListening, stopListening } =
    useSpeechRecognition({
      lang,
      interimResults: true,
      continuous: false,
      onResult: (text, isFinal) => {
        if (text) {
          onTranscript(text);
        }
      },
    });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-9 h-9 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18,
  };

  if (!isSupported) {
    return null; // Gracefully hide if browser has zero speech support
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        title={isListening ? 'Listening... Tap to stop' : title}
        aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
        className={`relative inline-flex items-center justify-center rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-95 ${
          sizeClasses[size]
        } ${
          isListening
            ? 'bg-rose-500 text-white shadow-lg ring-4 ring-rose-400/40 animate-pulse'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-[#005689] border border-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {isListening ? (
          <>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping" />
            <Mic size={iconSizes[size]} className="animate-bounce" />
          </>
        ) : (
          <Mic size={iconSizes[size]} />
        )}
      </button>

      {/* Floating subtle tooltip when active */}
      {isListening && (
        <span className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-slate-900 text-white text-[10px] font-semibold whitespace-nowrap shadow-md pointer-events-none animate-in fade-in zoom-in-95 z-50">
          Listening...
        </span>
      )}

      {error && !isListening && (
        <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-medium whitespace-nowrap shadow-md pointer-events-none animate-in fade-in z-50">
          {error}
        </span>
      )}
    </div>
  );
}
