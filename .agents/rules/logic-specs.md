---
trigger: always_on
---

# Logic & Scoring Specifications

## Filler Word Detection
**Must** use case-insensitive regex for the following tokens:
`um`, `uh`, `er`, `ah`, `like`, `you know`, `so`, `aaa`, `mmm`, `basically`, `actually`.

## Scoring Formula
**Always** calculate the `finalScore` based on the following weights:
- **Base Score**: 10.0
- **Grammar Penalty**: `-0.4` per significant error (exclude punctuation-only errors).
- **Filler Penalty**: `-0.15` per filler word.
- **Fluency Bonus**: `+1.0` if Words Per Minute (WPM) is between 80 and 150.
- **Floor**: Minimum score is `0.0`.

## API Integration
- **Endpoint**: `https://api.languagetool.org/v2/check`
- **Method**: POST
- **Payload**: `text=[TRANSCRIPT]&language=en-US`