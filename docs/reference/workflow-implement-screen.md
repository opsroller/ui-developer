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

## Run modes

Run modes v1. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `plan`, `build`, `check:<area>` (`check:layout`, `check:input`, `check:localization`, `check:accessibility`, `check:fidelity`), `fix`, `docs`, `docs-check`.
