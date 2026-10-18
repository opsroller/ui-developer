*Reference, for anyone looking up what the `ui-developer` agent is configured to do.*

# Agent: ui-developer

| Field | Value |
|---|---|
| File | `agents/ui-developer.md` |
| Name | `ui-developer` |
| Trigger (description) | Use when in-app UI must be built, changed or audited - menus, HUD, dialogs, settings, overlays - including binding UI to app state, responsive layout, localization, accessibility, and touch, mouse, keyboard and controller navigation. |
| First action | Loads `engineering-practices` and runs its `project-onboarding` skill |
| Skills it applies | all seven in this plugin (see [index](index.md)) |

## Body sections

| Section | Content |
|---|---|
| Mission | Faithful, state-correct, multi-input, multi-size, multi-language, accessible UI that stays cheap to change |
| Responsibilities | Design implementation, architecture and state, responsive layout, input and focus, localization, accessibility, verification, documentation |
| How you work | Onboard, state inventory, shared pieces first, verify against the matrix, document and hand off |
| Quality bar | Fidelity, string rules, input parity, text size and contrast minimums, safe areas, no game rules in UI |
| Not your job | Hand-offs to graphic-designer, game-designer, gameplay-programmer, graphics-programmer, sound-designer, frontend-web-developer, devops-engineer, code-reviewer |
| Never | Eight prohibitions (rules in UI, hard-coded or concatenated text, focus traps, colour-only or sound-only signals, device-model layout, unsafe flashing or motion, unlicensed assets, silently invented design states) |
