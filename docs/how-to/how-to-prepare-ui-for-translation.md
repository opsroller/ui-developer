*How-to guide, for developers who are adding a language or sending strings to translators.*

# How to prepare UI for translation

This guide shows you how to make screens translation-ready with the
`localization-readiness` workflow.

1. Confirm the project profile names the string tables, key convention
   and how to switch to a pseudo-locale. If there is no pseudo-locale, add
   one first (see the [localization skill reference](../reference/skill-localization.md)).
2. Run:
   ```
   Run the ui-developer localization-readiness workflow with
   { screens: ["main menu", "settings", ...], locales: ["de", "ar", "ja"] }
   ```
   Leave out `locales` to check against the pseudo-locale only.
3. If the result is `blocked`, each `open` item names a screen and the
   remaining problem: clipping, a hard-coded string, a concatenation.
   Fix and re-run for those screens.
4. When the result is `done`, export the string tables to translators.
   Translator context travels with each key.
5. When translations arrive, run [screen-audit](how-to-audit-screens-before-a-release.md)
   with the real locales.

If a target locale is right-to-left, expect layout mirroring changes;
if it is CJK or a tall script, expect font and line-height changes.
