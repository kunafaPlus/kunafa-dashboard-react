import { useEffect, useState } from 'react';

interface UseVoiceCommandProps {
  onCommand?: (command: string) => void;
  commands?: string[];
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

interface UseVoiceCommandReturn {
  isListening: boolean;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
  state: 'idle' | 'listening' | 'processing' | 'success' | 'error';
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: () => void;
  onresult: (event: any) => void;
  onerror: (event: { error: string }) => void;
  onend: () => void;
}

export const useVoiceCommand = ({
  onCommand,
  commands = [],
  language = 'en-US',
  continuous = false,
  interimResults = true,
}: UseVoiceCommandProps): UseVoiceCommandReturn => {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'listening' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognitionConstructor();

      recognitionInstance.continuous = continuous;
      recognitionInstance.interimResults = interimResults;
      recognitionInstance.lang = language;

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setState('listening');
      };

      recognitionInstance.onresult = (event:any) => {
        const transcript = Array.from(event.results)
          .map((result:any) => result[0])
          .map(result => result.transcript)
          .join('');

        if (event.results[0].isFinal) {
          setState('processing');
          if (commands.length === 0 || commands.some(command => transcript.toLowerCase().includes(command.toLowerCase()))) {
            onCommand?.(transcript);
            setState('success');
          }
        }
      };

      recognitionInstance.onerror = (event:any) => {
        setError(event.error);
        setState('error');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (state !== 'error' && state !== 'success') {
          setState('idle');
        }
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [commands, continuous, interimResults, language, onCommand]);

  const startListening = () => {
    if (recognition) {
      setError(null);
      setState('idle');
      recognition.start();
    }
  };

  const stopListening = () => {
    recognition?.stop();
  };

  return {
    isListening,
    error,
    startListening,
    stopListening,
    state,
  };
};