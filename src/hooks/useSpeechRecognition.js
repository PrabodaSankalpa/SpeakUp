import { useCallback, useState } from 'react';
import SpeechRecognition, { useSpeechRecognition as useLibSpeechRecognition } from 'react-speech-recognition';

export const useSpeechRecognition = () => {
  const [error, setError] = useState(null);

  const {
    transcript,
    listening: isListening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useLibSpeechRecognition();

  const startListening = useCallback(() => {
    if (!browserSupportsSpeechRecognition) {
      setError('Speech Recognition API not supported in this browser.');
      return;
    }
    setError(null);
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  }, [browserSupportsSpeechRecognition, resetTranscript]);

  const stopListening = useCallback(() => {
    SpeechRecognition.stopListening();
  }, []);

  const setTranscript = useCallback(() => {
    resetTranscript();
  }, [resetTranscript]);

  return {
    transcript,
    isListening,
    error,
    startListening,
    stopListening,
    setTranscript,
  };
};
