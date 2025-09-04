import { useState, useEffect, useRef, useCallback } from 'react';

interface VoiceNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
  onRepeat: () => void;
}

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useVoiceNavigation = ({ onNext, onPrevious, onRepeat }: VoiceNavigationProps) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn('Speech Recognition is not supported by this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const last = event.results.length - 1;
      const command = event.results[last][0].transcript.trim().toLowerCase();
      console.log('Voice command received:', command);

      if (command.includes('next') || command.includes('next step')) {
        onNext();
      } else if (command.includes('previous') || command.includes('last step') || command.includes('go back')) {
        onPrevious();
      } else if (command.includes('repeat') || command.includes('repeat instruction')) {
        onRepeat();
      }
    };

    recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setIsListening(false);
        }
    };
    
    recognition.onend = () => {
        if(isListening){
            recognition.start(); // Restart listening if it stops unexpectedly
        }
    };

    recognitionRef.current = recognition;
  }, [onNext, onPrevious, onRepeat, isListening]);
  
  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  }, [isListening]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  return { isListening, toggleListening };
};
