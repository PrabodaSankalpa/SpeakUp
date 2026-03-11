import React from 'react';

const LandingScreen = ({ onStart }) => {
  const isChromium = !!window.chrome;

  return (
    <div className="glass-card full-screen-landing" style={{ animation: 'fadeIn 0.8s ease-out', minHeight: '100vh', justifyContent: 'center' }}>
      <header style={{ marginBottom: '2.5rem', maxWidth: '800px', margin: '0 auto 2.5rem', width: '100%' }}>
        <h1 className="responsive-h1" style={{ fontWeight: '700', letterSpacing: '-2px', marginBottom: '1rem' }}>SpeakUp</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'clamp(1rem, 4vw, 1.4rem)', lineHeight: '1.5' }}>Master your English fluency through local AI analysis. Fast, Private, and Powerful.</p>
      </header>
      
      <div className="feature-grid">
        {[
          { icon: '🎙️', title: '1. Speak Freely', desc: 'Record your voice without limits. Everything stays private on your device.', color: 'rgba(0, 210, 255, 0.1)' },
          { icon: '⏹️', title: '2. Finish & Process', desc: 'Stop whenever you\'re ready. Our local engine starts the analysis immediately.', color: 'rgba(164, 19, 236, 0.1)' },
          { icon: '📈', title: '3. Instant Feedback', desc: 'Get a detailed score, filler word counts, and grammar suggestions.', color: 'rgba(0, 255, 0, 0.1)' }
        ].map((item, idx) => (
          <div key={idx} className="feature-card">
            <div className="feature-icon" style={{ background: item.color }}>{item.icon}</div>
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <button className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '1.1rem' }}>🇺🇸</span> English (US)
          </button>
        </div>

        <button className="btn-primary" onClick={onStart} style={{ width: '100%', height: '65px', fontSize: '1.3rem' }}>
          Start Practice Session
        </button>

        {!isChromium && (
          <div style={{ marginTop: '2rem', padding: '1.2rem', background: 'rgba(255, 165, 0, 0.05)', border: '1px solid rgba(255, 165, 0, 0.1)', borderRadius: '16px', fontSize: '0.85rem', color: '#ffcc00', lineHeight: '1.5', textAlign: 'center' }}>
            ⚠️ <strong>Optimized Experience:</strong> SpeakUp works best in Chrome or Edge. Accuracy might vary in your current browser.
          </div>
        )}
      </div>

      <style>{`
        .responsive-h1 { font-size: clamp(2.5rem, 8vw, 5rem); }
        .feature-grid { 
          margin-bottom: 3rem; 
          text-align: left; 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
          gap: 1.5rem; 
          max-width: 1200px; 
          margin-left: auto; 
          margin-right: auto;
          width: 100%;
        }
        .feature-card { 
          display: flex; 
          gap: 1.2rem; 
          align-items: start; 
          background: rgba(255,255,255,0.02); 
          padding: 1.5rem; 
          border-radius: 24px; 
          border: 1px solid var(--glass-border); 
        }
        .feature-icon { 
          font-size: 1.5rem; 
          padding: 0.8rem; 
          border-radius: 16px; 
          min-width: 50px; 
          text-align: center; 
        }

        @media (max-width: 768px) {
          .full-screen-landing { padding: 2rem 1.5rem !important; }
          .feature-grid { grid-template-columns: 1fr; gap: 1rem; margin-bottom: 2rem; }
          .feature-card { padding: 1.2rem; gap: 1rem; }
          .feature-icon { font-size: 1.2rem; min-width: 45px; padding: 0.6rem; }
          .responsive-h1 { margin-bottom: 0.5rem; }
        }

        @media (min-width: 769px) {
          .feature-card { padding: 2rem; gap: 1.5rem; }
          .feature-icon { font-size: 2rem; min-width: 60px; padding: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default LandingScreen;
