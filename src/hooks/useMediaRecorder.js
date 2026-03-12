import { useState, useRef, useCallback } from 'react';

export const useMediaRecorder = (onSilenceAnomaly) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isRecordingRef = useRef(false);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 1. Initialize MediaRecorder with a supported MIME type
      const mimeType = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg', '']
        .find(type => type === '' || MediaRecorder.isTypeSupported(type));
      const recorderOptions = mimeType ? { mimeType } : undefined;
      mediaRecorderRef.current = new MediaRecorder(stream, recorderOptions);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mediaRecorderRef.current.mimeType || 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      // 2. Initialize Web Audio API for silence detection
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      // Resume AudioContext — required on mobile where it starts suspended
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      let isSilent = false;
      const SILENCE_THRESHOLD = parseFloat(import.meta.env.VITE_SILENCE_THRESHOLD) || 0.01;
      const SILENCE_DURATION_MS = parseInt(import.meta.env.VITE_SILENCE_DURATION_MS) || 3000;

      const checkVolume = () => {
        if (!isRecordingRef.current && mediaRecorderRef.current?.state !== 'recording') return;
        
        analyserRef.current.getByteTimeDomainData(dataArray);
        
        // Calculate RMS (Loudness)
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = (dataArray[i] - 128) / 128; // Normalize to [-1, 1]
          sum += v * v;
        }
        const rms = Math.sqrt(sum / bufferLength);

        if (rms < SILENCE_THRESHOLD) {
          if (!isSilent) {
            isSilent = true;
            silenceTimerRef.current = setTimeout(() => {
              if (onSilenceAnomaly) onSilenceAnomaly();
              console.log('Silence Anomaly Detected (3s+)');
              // Reset timer to allow multiple detections if silence continues
              isSilent = false; 
            }, SILENCE_DURATION_MS);
          }
        } else {
          if (isSilent) {
            clearTimeout(silenceTimerRef.current);
            isSilent = false;
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };

      mediaRecorderRef.current.start();
      isRecordingRef.current = true;
      setIsRecording(true);
      setError(null);
      checkVolume();
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone.');
      setIsRecording(false);
    }
  }, [onSilenceAnomaly]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      isRecordingRef.current = false;
      setIsRecording(false);
      
      // Cleanup Audio API
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    }
  }, []);

  return {
    isRecording,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    setAudioBlob
  };
};
