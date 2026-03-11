---
trigger: always_on
---

# Tech Stack & Constraint Rules

## React Implementation

- **Always** use Functional Components and Hooks (`useState`, `useEffect`, `useRef`).
- **Never** use Class Components.
- **Never** install Redux, MobX, or Zustand. Use local state or Context API for global needs.
- **Must** use Vite as the build tool.

## Styling & UI

- **Always** keep UI minimal and "Utility-First" using Tailwind.
- **Never** suggest heavy UI frameworks like Material UI or Ant Design.
- **Must** ensure the app is responsive for mobile PWA usage.

## Browser APIs

- **Always** check for `window.SpeechRecognition` or `window.webkitSpeechRecognition` before initializing.
- **Must** provide a `Notice` component if the browser is not Chromium-based.
