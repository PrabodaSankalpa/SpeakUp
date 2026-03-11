---
trigger: always_on
---

# Coding Style Rules

- **Naming**: Use camelCase for variables/functions (e.g., `isRecording`), PascalCase for components.
- **Clean Code**: Components **must** be under 200 lines. If larger, refactor logic into `src/utils/`.
- **Formatting**:
  - **Never** use semicolons.
  - **Always** use single quotes for strings.
  - **Always** destructure props: `const RecordButton = ({ onStart, onStop }) => { ... }`.
- **Comments**: **Must** comment the `useEffect` hooks that manage the MediaStream to prevent memory leaks.
