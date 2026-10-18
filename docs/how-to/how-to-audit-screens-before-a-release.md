*How-to guide, for developers or release owners who need to know whether the UI is ready to ship.*

# How to audit screens before a release

This guide shows you how to audit many screens at once across sizes,
languages, inputs and accessibility settings with the `screen-audit`
workflow.

1. List the screens to audit. For a release, include every screen a
   player can reach, plus the HUD.
2. Run:
   ```
   Run the ui-developer screen-audit workflow with
   { screens: ["main menu", "settings", "HUD", ...], release: "v1.2" }
   ```
3. Read the result:
   - `status: "blocked"`: at least one blocker. The release waits until
     each item in `blockers` is fixed.
   - `status: "incomplete"`: some screens crashed during audit
     (`unverifiedScreens`) or the docs check did not pass. Re-run for those
     screens or fix the docs problems.
   - `status: "pass"`: no blockers.
4. Fix the groups marked as shared fixes first (a widget, the theme, the
   navigation owner), then per-screen findings. Use
   [implement-screen](how-to-implement-a-screen-from-a-design.md) for
   large changes.
5. Paste `report` into the release PR or release notes.

To audit one area only (e.g. accessibility before a certification
submission), say so in the request; the agents still use the full matrix
but you can filter the report.

See the [screen-audit reference](../reference/workflow-screen-audit.md).
