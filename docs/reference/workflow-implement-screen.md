*Reference, for anyone looking up the arguments, phases and outputs of the `implement-screen` workflow.*

# Workflow: implement-screen

File: `workflows/implement-screen.js`. Invoke: ask Claude to run the
ui-developer `implement-screen` workflow with the arguments below.

## Arguments

| Name | Type | Required | Meaning |
|---|---|---|---|
| `screen` | string | yes | Name of the screen, dialog or HUD element |
| `design` | string | yes | Path or link to the visual design |
| `flow` | string | no | Path or section of the flow spec; defaults to the one the project profile names |

Missing `screen` or `design` returns the usage string.

## Phases

| Phase | Agents | Edits files | Skills used |
|---|---|---|---|
| Plan | 1 | no | design-implementation (state inventory); Diataxis compass |
| Build | 1 | yes | design-implementation, ui-architecture, responsive-layout, input-and-focus, localization, accessibility |
| Check | 5 in parallel: layout, input, localization, accessibility, fidelity | no | the matching skill checklists; ui-verification severities |
| Fix | 1 (only if findings) | yes | all |
| Docs | 1 | yes (project docs) | Diataxis guide prompt fragment |
| Docs check | 1 | no | Diataxis review checklist |

## Outputs

| `status` | When |
|---|---|
| `done` | all phases passed |
| `done-with-unverified-checks` | passed, but one or more check agents crashed; `unverifiedLenses` names them |
| `blocked` | planning or build failed, fixes left items `open`, or the docs check failed |
| `unverified` | the docs check agent crashed |

Other fields on success: `states`, `assumedForDesigner` (design gaps built
with defaults), `findingsFixed`, `unverifiedLenses`, `docs` (pages
touched), `undocumented`.
