import React, { useState, useEffect } from 'react';

const RecordingScreen = ({ transcript, isRecording, duration, onStop, onCancel }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-card" style={{ animation: 'fadeIn 0.5s ease-out', minHeight: '100vh' }}>
      <div className="recording-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="recording-pulse"></div>
          <span className="recording-label">RECORDING</span>
        </div>
        
        <div className="waveform-container">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className="waveform-bar"
              style={{ 
                animationDelay: `${i * 0.1}s`
              }} 
            />
          ))}
        </div>

        <div className="timer-display">
          {formatTime(duration)}
        </div>
      </div>

      <div className="transcript-area">
        {transcript || <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', opacity: 0.5 }}>Start speaking...</span>}
      </div>

      <div className="recording-controls">
        <button className="btn-primary" onClick={onStop} style={{ flex: 2 }}>
          Finish & Analyze
        </button>
        <button 
          className="btn-secondary" 
          onClick={onCancel} 
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>

      <style>{`
        .recording-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 3rem; 
        }
        .recording-label { font-weight: 700; color: var(--accent-red); letter-spacing: 2px; font-size: 1rem; }
        .timer-display { font-size: 2.5rem; font-weight: 600; color: white; font-family: monospace; }
        
        .waveform-container { flex: 1; display: flex; justify-content: center; gap: 6px; height: 50px; align-items: center; margin: 0 4rem; }
        .waveform-bar { width: 6px; background-color: var(--accent-teal); border-radius: 3px; animation: waveform 1s ease-in-out infinite; height: 100%; }

        .transcript-area {
          flex: 1;
          background: rgba(0,0,0,0.2);
          border-radius: 32px;
          padding: 4rem;
          overflow-y: auto;
          line-height: 2;
          font-size: 1.5rem;
          margin-bottom: 3rem;
          border: 1px solid var(--glass-border);
          color: rgba(255,255,255,1);
          box-shadow: inset 0 4px 30px rgba(0,0,0,0.4);
        }

        .recording-controls { display: flex; gap: 2rem; margin-top: auto; }
        .recording-controls button { height: 80px; font-size: 1.3rem; border-radius: 20px; }

        @keyframes waveform {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }

        @media (max-width: 768px) {
          .timer-display { font-size: 1.8rem; }
          .waveform-container { gap: 4px; margin: 0 1.5rem; height: 30px; }
          .waveform-bar { width: 4px; }
          .transcript-area { padding: 2rem; font-size: 1.2rem; }
          .recording-controls { gap: 1rem; }
          .recording-controls button { height: 65px; font-size: 1.1rem; }
          .recording-header { margin-bottom: 2rem; }
        }

        @media (max-width: 480px) {
          .waveform-container { display: none; }
          .recording-controls { flex-direction: column; }
          .recording-controls button { width: 100%; min-height: 55px; }
          .transcript-area { padding: 1.5rem; font-size: 1.1rem; border-radius: 20px; }
        }
      `}</style>
    </div>
  );
};

export default RecordingScreen;
