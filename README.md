# ui-developer

*Landing page, for anyone deciding whether to use this role plugin or looking for its documentation.*

The **UI developer** (UI engineer, UI programmer) implements in-app UI -
menus, HUD, dialogs, settings - from the graphic designer's visual design.
This plugin gives Claude that job: sound UI architecture and state binding,
responsive layout across screen sizes and safe areas, localization and
internationalization, accessibility (Game Accessibility Guidelines, Xbox
Accessibility Guidelines, WCAG where it applies, platform guidelines), and
touch, mouse, keyboard and controller input. It is a generic job function:
the project's `CLAUDE.md` and profile say which framework and tools to use.

It contains one agent (`ui-developer`), seven skills and three workflows
(`implement-screen`, `screen-audit`, `localization-readiness`). It builds
on the `engineering-practices` plugin.

## Install

```
/plugin marketplace add opsroller/claude-plugins
/plugin install ui-developer@opsroller
```

## Documentation

- **Start here:** [Build your first screen](docs/tutorials/first-task.md)
  walks one dialog from design to a checked, documented screen.
- **Get a job done:** how-to guides for
  [implementing a screen from a design](docs/how-to/how-to-implement-a-screen-from-a-design.md),
  [auditing screens before a release](docs/how-to/how-to-audit-screens-before-a-release.md),
  [preparing UI for translation](docs/how-to/how-to-prepare-ui-for-translation.md) and
  [making a screen controller-navigable](docs/how-to/how-to-make-a-screen-controller-navigable.md).
- **Look something up:** the [reference index](docs/reference/index.md)
  describes the agent, every skill and every workflow (arguments, phases,
  outputs); [SOURCES.md](SOURCES.md) lists the research.
- **Understand the role:** [About the UI developer role](docs/explanation/about-the-role.md)
  covers boundaries with neighbouring roles, quality bars, the trade-offs
  behind the methods and how the role grows from junior to lead.

Versioned with semver tags (`v0.1.0`); changes follow Conventional Commits.

## License

Copyright (C) 2026 the contributors. Licensed under the GNU General Public License v2.0 or later (`GPL-2.0-or-later`); see `LICENSE`.
