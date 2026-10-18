*Reference, for anyone looking up the arguments, phases and outputs of the `localization-readiness` workflow.*

# Workflow: localization-readiness

File: `workflows/localization-readiness.js`.

## Arguments

| Name | Type | Required | Meaning |
|---|---|---|---|
| `screens` | string[] | yes | Screens to make translation-ready (non-empty) |
| `locales` | string[] | no | Target locale codes (e.g. `de`, `ar`, `ja`); without them only the pseudo-locale is used |

Missing or empty `screens` returns the usage string.

## Phases

| Phase | Agents | Edits files | Skills used |
|---|---|---|---|
| Plan | 1 | no | localization (conventions, locale traits); Diataxis compass |
| Scan | 1 per screen, in parallel | no | localization sections 1-4 |
| Apply | 1 (only if changes) | yes: string tables (one edit per table), code, layout | localization, responsive-layout |
| Verify | 1 per screen, in parallel | no | localization section 5 |
| Docs | 1 | yes (project docs) | Diataxis guide prompt fragment |
| Docs check | 1 | no | Diataxis review checklist |

Parallel scan agents return proposed keys and changes; only the Apply agent
edits the shared string tables.

## Outputs

| `status` | When |
|---|---|
| `done` | all phases passed |
| `done-with-unverified-screens` | passed, but some scan or verify agents crashed; `unverifiedScreens` names them |
| `blocked` | planning failed, apply incomplete, problems remain after verify (`open`), or the docs check failed |
| `unverified` | the docs check agent crashed |

Other fields on success: `keysAdded`, `codeChanges`, `layoutFixes`,
`docs`, `undocumented`.

## Run modes

Run modes v1. Besides its own args, the workflow takes the optional `run` arg defined in the engineering-practices
[workflow run modes reference](https://github.com/opsroller/engineering-practices/blob/main/docs/reference/workflow-run-modes.md):
`run: { mode: "inline" }` runs every phase in the calling session with no subagents, `run.only` runs chosen phases or steps,
and `run.from` with `run.results` resumes a stopped run. Without `run`, the workflow and its outputs are as above.
See [how to run a workflow inline](https://github.com/opsroller/engineering-practices/blob/main/docs/how-to/how-to-run-a-workflow-inline.md).

Step labels, for `run.only` and `run.results`: `plan`, `<screen>` (scan, one per screen), `apply`, `verify:<screen>`, `docs`, `docs-check`.
