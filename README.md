# Ui Developer

UI developer: builds menus, HUDs and screens that bind to game state, with clean navigation, localisation and accessibility.

This plugin is a **job function**, not a project. It says how the job is done; the project it works on says with which tools, in its `CLAUDE.md` and project profile.

## Skills

| Skill | Use when |
|---|---|
| `ui-architecture` | Use when building screens, HUD elements, navigation or theming. |
| `localization-accessibility` | Use when adding text, colours, or interactions players must perceive or operate. |

## Workflows

Multi-agent workflows (Claude Code Workflow scripts in `workflows/`).

| Workflow | Does |
|---|---|
| `/ui-developer:screen-audit` | Audit every screen in parallel for layout, navigation, localisation and accessibility |

## Agent

`agents/ui-developer.md` defines the role as a subagent.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install ui-developer@opsroller
```

Versioned on its own with semver tags (`v0.1.0`). Changes follow Conventional Commits.
