*How-to guide, for developers using the ui-developer role who need a new or changed screen, dialog or HUD element.*

# How to implement a screen from a design

This guide shows you how to take a visual design and flow spec to a
working, checked and documented screen with the `implement-screen`
workflow.

1. Make sure the design exists and is reachable (file path or link). If
   the flow (what the screen offers, where back goes) is not written down,
   ask the game designer first.
2. Run:
   ```
   Run the ui-developer implement-screen workflow with
   { screen: "<name>", design: "<path or link>", flow: "<flow spec section>" }
   ```
   Leave out `flow` if the project profile names a single flow spec.
3. When the Plan phase lists design gaps, send them to the graphic
   designer (visual states) or game designer (behaviour). The build uses
   the stated defaults and marks them "assumed" in the PR.
4. If the workflow returns `status: "blocked"`, read `open`: fix each item
   or get a decision, then re-run the workflow.
5. If it returns `done-with-unverified-checks`, run the named checks by
   hand with the matching skill checklist, or run
   [screen-audit](how-to-audit-screens-before-a-release.md) on this screen.
6. Attach the screenshots and the assumed-defaults list to the PR and
   hand off through the engineering-practices work-package flow.

For a HUD element, give the HUD element's name as `screen`; the HUD rules in
`ui-architecture` apply automatically.

See the [implement-screen reference](../reference/workflow-implement-screen.md)
for arguments, phases and outputs.
