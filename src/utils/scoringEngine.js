/**
 * SpeakUp Scoring Engine
 * Based on logic-specs.md
 */

const FILLER_TOKENS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'aaa', 'mmm', 'basically', 'actually'
];

const FILLER_REGEX = new RegExp(`\\b(${FILLER_TOKENS.join('|')})\\b`, 'gi');

export const detectFillers = (text) => {
  if (!text) return [];
  const matches = [...text.matchAll(FILLER_REGEX)];
  return matches.map(match => ({
    word: match[0],
    index: match.index,
    length: match[0].length
  }));
};

export const calculateScore = (
  transcript,
  fillerCount,
  grammarErrors,
  durationSeconds,
  silenceEvents = 0
) => {
  const wordCount = transcript.trim().split(/\s+/).length;
  const minutes = durationSeconds / 60;
  const wpm = minutes > 0 ? Math.round(wordCount / minutes) : 0;

  let finalScore = 10.0;

  // Grammar Penalty: -0.4 per error
  finalScore -= grammarErrors * 0.4;

  // Filler Penalty: -0.15 per filler word
  finalScore -= fillerCount * 0.15;

  // Silence Penalty: -0.5 per 3s+ anomaly
  finalScore -= silenceEvents * 0.5;

  // Fluency Bonus: +1.0 if WPM is between 80 and 150
  let fluencyBonus = 0;
  if (wpm >= 80 && wpm <= 150) {
    fluencyBonus = 1.0;
    finalScore += fluencyBonus;
  }

  // Ensure floor of 0.0
  finalScore = Math.max(0.0, Math.min(10.0, finalScore));

  return {
    score: parseFloat(finalScore.toFixed(1)),
    wpm,
    wordCount,
    fluencyBonus: fluencyBonus > 0,
    silenceEvents,
    penalties: {
      grammar: grammarErrors * 0.4,
      fillers: fillerCount * 0.15,
      silence: silenceEvents * 0.5
    },
  };
};
