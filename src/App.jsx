import React, { useState, useEffect, useRef } from "react";
import LandingScreen from "./pages/LandingScreen";
import RecordingScreen from "./pages/RecordingScreen";
import AnalysisScreen from "./pages/AnalysisScreen";
import { useSpeechRecognition } from "./hooks/useSpeechRecognition";
import { useMediaRecorder } from "./hooks/useMediaRecorder";
import { calculateScore, detectFillers } from "./utils/scoringEngine";

const App = () => {
  const [screen, setScreen] = useState("landing");
  const [duration, setDuration] = useState(0);
  const [results, setResults] = useState(null);
  const [silenceCount, setSilenceCount] = useState(0);
  const timerRef = useRef(null);

  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    setTranscript,
  } = useSpeechRecognition();

  const handleSilenceAnomaly = () => {
    setSilenceCount(prev => prev + 1);
  };

  const { startRecording, stopRecording } = useMediaRecorder(handleSilenceAnomaly);

  const handleStart = () => {
    setTranscript("");
    setDuration(0);
    setSilenceCount(0);
    setScreen("recording");
    startListening();
    startRecording();

    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const checkGrammar = async (text) => {
    try {
      const response = await fetch(import.meta.env.VITE_LANGUAGETOOL_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          text,
          language: "en-US",
        }),
      });
      console.log("LanguageTool API Status:", response.status);
      const data = await response.json();
      console.log("LanguageTool API Response:", data);

      const significantMatches = data.matches.filter(
        (m) =>
          m.rule.category.id !== "PUNCTUATION" &&
          m.rule.category.id !== "CASING" &&
          m.rule.category.id !== "TYPOGRAPHY",
      );
      return { count: significantMatches.length, matches: significantMatches };
    } catch (err) {
      console.error("LanguageTool error:", err);
      return { count: 0, matches: [] };
    }
  };

  const handleStop = async () => {
    clearInterval(timerRef.current);
    stopListening();
    stopRecording();

    // Analyze results
    const fillersFound = detectFillers(transcript);
    const grammarResults = await checkGrammar(transcript);

    const calculated = calculateScore(
      transcript,
      fillersFound.length,
      grammarResults.count,
      duration,
      silenceCount
    );

    // Attach matches for highlighting
    calculated.grammarMatches = grammarResults.matches;

    setResults(calculated);
    setScreen("analysis");
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    stopListening();
    stopRecording();
    setSilenceCount(0);
    setScreen("landing");
  };

  const handleReset = () => {
    setScreen("landing");
    setResults(null);
    setDuration(0);
    setSilenceCount(0);
    setTranscript("");
  };

  return (
    <div className="app-container">
      {screen === "landing" && <LandingScreen onStart={handleStart} />}
      {screen === "recording" && (
        <RecordingScreen
          transcript={transcript}
          isRecording={isListening}
          duration={duration}
          onStop={handleStop}
          onCancel={handleCancel}
        />
      )}
      {screen === "analysis" && (
        <AnalysisScreen
          transcript={transcript}
          results={results}
          onReset={handleReset}
        />
      )}
    </div>
  );
};

export default App;
