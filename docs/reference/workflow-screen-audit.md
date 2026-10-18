*Reference, for anyone looking up the arguments, phases and outputs of the `screen-audit` workflow.*

# Workflow: screen-audit

File: `workflows/screen-audit.js`. Read-only on code; edits only project docs.

## Arguments

| Name | Type | Required | Meaning |
|---|---|---|---|
| `screens` | string[] | yes | Screens to audit (non-empty) |
| `release` | string | no | Release or milestone name used in prompts and the report |

Missing or empty `screens` returns the usage string.

## Phases

| Phase | Agents | Edits files | Skills used |
|---|---|---|---|
| Plan | 1 | no | ui-verification section 1 (matrix); Diataxis compass |
| Audit | 1 per screen, in parallel | no | ui-verification, responsive-layout, input-and-focus, localization, accessibility |
| Triage | 1 (only if findings) | no | ui-verification section 5 |
| Docs | 1 | yes (project docs) | Diataxis guide prompt fragment |
| Docs check | 1 | no | Diataxis review checklist |

## Outputs

| `status` | When |
|---|---|
| `pass` | no blockers, every screen audited, docs check passed |
| `blocked` | at least one finding group has severity `blocker`; `blockers` lists root causes |
| `incomplete` | no blockers, but `unverifiedScreens` is non-empty or `docsCheck` is not `pass` |
| `unverified` | the triage agent crashed; raw `findings` returned |

Other fields: `groups` (root cause, sharedFix, severity, screens, fix),
`report`, `docs`, `docsCheck` (`pass`, `fail`, `unverified`), `docsProblems`.

Finding severities: `blocker`, `major`, `minor`, as defined in the
[ui-verification skill](skill-ui-verification.md).
