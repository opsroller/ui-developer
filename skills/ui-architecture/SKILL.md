---
name: ui-architecture
description: Use when building screens, HUD elements, navigation or theming.
---

# UI architecture

- One scene per screen, reusable widgets, one shared theme.
- A single navigation service changes screens; no screen opens another
  directly.
- Bind to state through the events in the project's contracts doc.
- Layout with containers and anchors only; test at the smallest
  portrait and largest landscape targets.
- Fonts and icons only under licenses the profile allows, logged in the
  provenance log.
