*Reference landing page, for anyone looking up a part of the ui-developer plugin.*

# ui-developer reference

The plugin is one agent, seven skills and three workflows. Each page below
describes one part in the same format.

## Agent

- [ui-developer](agent.md): the role as a subagent; triggers, sections, hand-offs.

## Skills

Building a screen:
- [design-implementation](skill-design-implementation.md): from visual design to widgets, theme and states.
- [ui-architecture](skill-ui-architecture.md): view models, navigation owner, layers, HUD rules, performance.
- [responsive-layout](skill-responsive-layout.md): size classes, safe areas, TV-safe, text scaling.

Making it work for everyone:
- [input-and-focus](skill-input-and-focus.md): touch, mouse, keyboard, controller; focus rules; prompts.
- [localization](skill-localization.md): strings, ICU plurals, CLDR formatting, expansion, RTL, pseudo-locale.
- [accessibility](skill-accessibility.md): GAG, XAG, WCAG and platform minimums; thresholds table.

Checking it:
- [ui-verification](skill-ui-verification.md): test matrix, automated tests, performance, severities.

## Workflows

| Workflow | Arguments | Page |
|---|---|---|
| `implement-screen` | `{ screen, design, flow? }` | [reference](workflow-implement-screen.md) |
| `screen-audit` | `{ screens[], release? }` | [reference](workflow-screen-audit.md) |
| `localization-readiness` | `{ screens[], locales[]? }` | [reference](workflow-localization-readiness.md) |

## Plugin manifest (`.claude-plugin/plugin.json`)

| Field | Value |
|---|---|
| `name` | `ui-developer` |
| `version` | `0.3.0` |
| `author.name` | `opsroller` |
| `repository` | `https://github.com/opsroller/ui-developer` |
| `license` | `GPL-2.0-or-later` |
| `keywords` | `role`, `job-function`, `ui`, `ui-engineering`, `hud`, `menus`, `localization`, `internationalization`, `accessibility`, `responsive-layout`, `controller-navigation` |

## Sources

The research behind the skills is listed in [SOURCES.md](../../SOURCES.md).
