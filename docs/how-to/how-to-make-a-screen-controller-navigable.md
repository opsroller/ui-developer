*How-to guide, for developers whose screen works with mouse or touch but not with a controller or keyboard.*

# How to make a screen controller-navigable

This guide shows you how to fix focus navigation on an existing screen,
using the `input-and-focus` skill.

1. Ask the ui-developer agent:
   ```
   Follow the input-and-focus skill checklist on the "<screen>" screen and
   list every failure. Do not edit yet.
   ```
2. Set a default focus for the screen: the primary action, or the safe
   option for destructive dialogs.
3. Fix focus order: meaning first, else reading order. Add explicit
   neighbours where automatic spatial navigation skips or dead-ends.
4. Make focus visible on every focusable element, in every theme, with at
   least 3:1 contrast against its surroundings.
5. Make lists scroll to keep the focused item visible. Wrap linear lists;
   don't wrap grids.
6. Replace hover-only information with info shown on focus.
7. Wire cancel/back through the navigation owner and restore focus when a
   covering screen closes.
8. Switch button prompts from fixed art to the binding, so they follow the
   last-used device and remapping.
9. Re-run step 1. When the list is empty, update the screen's reference
   page if its actions or bindings changed.

If the project also supports touch, re-test touch afterwards: focus
visuals should hide when the player touches the screen.
