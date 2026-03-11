# Project: SpeakUp (Antigravity Edition)

## Context

SpeakUp is a 100% client-side React PWA designed for English learners to practice speaking. It focuses on speed, simplicity, and privacy by processing everything in the browser.

## Core Mandates

- **Zero Backend**: Never suggest Node.js, Express, Firebase, or Cloud Functions.
- **Privacy First**: All audio processing happens locally via `MediaRecorder` and `Web Speech API`.
- **Browser Priority**: Optimized for Chrome/Edge. Must include fallbacks for Safari/Firefox.
- **Cost Zero**: Only use free, public APIs (e.g., LanguageTool public tier).

## Primary Workflows

1. **Record**: Capture user audio and generate real-time transcript.
2. **Analyze**: Send transcript to LanguageTool; run local filler-word regex.
3. **Score**: Apply the custom scoring formula (see `.agents/rules/logic-specs.md`).
4. **Display**: Show breakdown with `aria-live` accessibility.

## Tech Stack

- Vite + React (Functional)
- Tailwind CSS (Minimal)
- Web Speech API
- LanguageTool API
