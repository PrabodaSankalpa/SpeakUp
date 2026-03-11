import React from 'react';
import { detectFillers } from '../utils/scoringEngine';

const AnalysisScreen = ({ transcript, results, onReset }) => {
  const renderAnnotatedTranscript = () => {
    if (!transcript) return null;
    
    // 1. Collect all highlights (Fillers & Grammar)
    const fillerTokens = [
      'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'aaa', 'mmm', 'basically', 'actually'
    ];
    const fillerRegex = new RegExp(`\\b(${fillerTokens.join('|')})\\b`, 'gi');
    
    const highlights = [];
    
    // Fillers
    let match;
    fillerRegex.lastIndex = 0;
    while ((match = fillerRegex.exec(transcript)) !== null) {
      highlights.push({
        start: match.index,
        end: match.index + match[0].length,
        type: 'filler',
        text: match[0],
        message: 'Filler word detected'
      });
    }
    
    // Grammar Errors
    (results.grammarMatches || []).forEach(m => {
      highlights.push({
        start: m.offset,
        end: m.offset + m.length,
        type: 'grammar',
        text: transcript.substring(m.offset, m.offset + m.length),
        message: m.message,
        replacements: m.replacements.slice(0, 3).map(r => r.value).join(', ')
      });
    });
    
    // Sort by start position
    highlights.sort((a, b) => a.start - b.start);
    
    // 2. Render with spans
    const parts = [];
    let lastIndex = 0;
    
    highlights.forEach((h, i) => {
      if (h.start > lastIndex) {
        parts.push(transcript.substring(lastIndex, h.start));
      }
      if (h.start < lastIndex) return;
      
      const className = h.type === 'filler' ? 'highlight-filler' : 'highlight-grammar';
      const tooltip = h.type === 'grammar' ? `${h.message} (Try: ${h.replacements})` : h.message;
      
      parts.push(
        <span 
          key={`${h.start}-${i}`} 
          className={className} 
          title={tooltip}
        >
          {transcript.substring(h.start, h.end)}
        </span>
      );
      
      lastIndex = h.end;
    });
    
    if (lastIndex < transcript.length) {
      parts.push(transcript.substring(lastIndex));
    }
    
    return parts;
  };

  return (
    <div className="glass-card analysis-container">
      <aside className="analysis-sidebar">
        <header className="analysis-header" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.2rem, 5vw, 1.5rem)', fontWeight: '700', marginBottom: '0.5rem' }}>Session Report</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Detailed analysis for your session.</p>
        </header>
        
        <div className="circular-score" style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: 'clamp(2rem, 6vw, 2.5rem)', fontWeight: '700', color: 'var(--accent-teal)' }}>{results.score}</div>
          <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>SCORE</div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{results.wpm}</div>
            <div className="metric-label">Words/Min</div>
            {results.fluencyBonus && <span className="bonus-tag">✨ Bonus Applied</span>}
          </div>

          <div className="metric-card">
            <div className="metric-value">{results.wordCount}</div>
            <div className="metric-label">Total Words</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">{(results.grammarMatches || []).length}</div>
            <div className="metric-label">Grammar Feedback</div>
          </div>

          <div className="metric-card">
            <div className="metric-value">{results.silenceEvents || 0}</div>
            <div className="metric-label">Silence Pauses</div>
          </div>
        </div>

        <button className="btn-primary" onClick={onReset} style={{ width: '100%', marginTop: '2rem' }}>
          New Practice Session
        </button>
      </aside>

      <main className="transcript-main">
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Annotated Transcript</h3>
          <div className="annotated-text">
            {renderAnnotatedTranscript()}
          </div>
        </section>

        {(results.grammarMatches || []).length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem', color: 'var(--text-primary)' }}>Grammar & Clarity Suggestions</h3>
            <div className="grammar-list">
              {(results.grammarMatches || []).map((match, idx) => (
                <div key={idx} className="grammar-item">
                  <div className="grammar-error">
                    <strong>"{transcript.substring(match.offset, match.offset + match.length)}"</strong>
                  </div>
                  <div className="grammar-message">{match.message}</div>
                  {match.replacements && match.replacements.length > 0 && (
                    <div className="grammar-suggestion">
                      Try: {match.replacements.slice(0, 3).map(r => <span key={r.value} className="suggestion-pill">{r.value}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
        
        <footer className="analysis-footer">
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot filler"></span>
              <span>Filler</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot grammar"></span>
              <span>Grammar</span>
            </div>
          </div>
          <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
            Copy Text
          </button>
        </footer>
      </main>

      <style>{`
        .analysis-container { 
          width: 100%; 
          display: flex;
          flex-direction: column;
          gap: 3rem;
          animation: fadeIn 0.6s ease-out;
          min-height: 100vh;
        }

        .analysis-sidebar { padding-bottom: 3rem; border-bottom: 1px solid var(--glass-border); }
        .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
        .metric-card { padding: 2rem; border-radius: 24px; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); text-align: center; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
        .metric-value { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--accent-teal); }
        .metric-label { font-size: 0.9rem; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
        .bonus-tag { font-size: 0.8rem; color: #4ade80; display: block; margin-top: 0.5rem; font-weight: 600; }

        .transcript-main { display: flex; flex-direction: column; flex: 1; }
        .annotated-text { 
          flex: 1;
          background: rgba(0,0,0,0.2); 
          padding: 3rem; 
          border-radius: 32px; 
          line-height: 2;
          max-height: 600px;
          overflow-y: auto;
          border: 1px solid var(--glass-border);
          font-size: 1.3rem;
          box-shadow: inset 0 4px 30px rgba(0,0,0,0.4);
        }

        .analysis-footer { margin-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 2rem; }
        .legend-items { display: flex; gap: 2rem; font-size: 1rem; }
        .legend-item { display: flex; align-items: center; gap: 0.8rem; color: var(--text-secondary); }
        .legend-dot { width: 12px; height: 12px; border-radius: 3px; }
        .legend-dot.filler { background: var(--filler-highlight); border-bottom: 3px solid #ff6464; }
        .legend-dot.grammar { background: var(--error-highlight); border-bottom: 3px solid #ffd700; }

        .grammar-list { display: flex; flex-direction: column; gap: 1rem; }
        .grammar-item { 
          background: rgba(255, 255, 255, 0.02); 
          border: 1px solid var(--glass-border); 
          border-radius: 16px; 
          padding: 1.5rem; 
          transition: transform 0.2s;
        }
        .grammar-item:hover { transform: translateX(5px); background: rgba(255, 255, 255, 0.04); }
        .grammar-error { color: #ffd700; margin-bottom: 0.5rem; font-size: 1.1rem; }
        .grammar-message { color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5; }
        .grammar-suggestion { display: flex; align-items: center; gap: 0.8rem; font-size: 0.9rem; flex-wrap: wrap; }
        .suggestion-pill { 
          background: rgba(0, 210, 255, 0.1); 
          color: var(--accent-teal); 
          padding: 0.3rem 0.8rem; 
          border-radius: 20px; 
          border: 1px solid rgba(0, 210, 255, 0.2);
          font-weight: 600;
        }

        @media (min-width: 992px) {
          .analysis-container { display: grid; grid-template-columns: 350px 1fr; gap: 4rem; }
          .analysis-sidebar { border-right: 1px solid var(--glass-border); border-bottom: none; padding-right: 4rem; padding-bottom: 0; }
          .metrics-grid { grid-template-columns: 1fr; }
          .metric-card { text-align: left; padding: 2rem; }
          .metric-value { font-size: 2.2rem; }
          .annotated-text { padding: 4rem; font-size: 1.4rem; min-height: 60vh; max-height: 75vh; }
        }

        @media (max-width: 768px) {
          .annotated-text { padding: 2rem; font-size: 1.1rem; border-radius: 24px; }
          .metric-card { padding: 1.5rem; }
          .metric-value { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisScreen;
