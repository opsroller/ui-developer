---
name: design-implementation
description: Use when turning the graphic designer's visual design (mockups, specs, tokens, motion notes) into working screens, widgets and theme - before writing screen code and when checking a built screen against its design.
---

# Implementing UI from the visual design

The graphic designer owns how the UI looks; you own making it real at every
size, language and input. Fidelity means matching intent, not copying one
mockup's pixels.

## 1. Intake: read the design before code

Collect, from the design source the project names:

- Mockups at the reference size, plus any other sizes provided.
- Tokens: colour, type scale, spacing scale, radii, elevation, motion
  durations/easings, iconography set. If they exist only as values in
  mockups, extract them into the project's token source first.
- Component specs: each widget's anatomy, sizes, padding, and states.
- Motion notes: transitions, timings, what animates on focus/press.
- Flow from the game designer: what each screen offers, entry/exit points,
  what back does.

## 2. The state inventory (do this every time)

For every interactive element and every screen, list which of these are
designed. Missing ones go back as questions, not guesses.

| Element states | Screen states |
|---|---|
| default, hover, focused, pressed, selected, disabled | empty, loading, error, offline, partial data |
| toggled on/off, invalid, read-only | first-run, returning player, max data (99+ items) |
| with long text, with icon only | smallest window, largest window, portrait/landscape |
| right-to-left mirror | 200% text, high-contrast mode, reduced motion |

Focus state is the most commonly missing one; controller and keyboard
players cannot use a screen without it.

## 3. Build order

1. **Tokens -> theme.** Map design tokens to named theme values. Code
   references names (`color.surface.raised`, `space.3`), never raw values.
2. **Widgets.** Build or extend the shared widget for each component spec,
   with all states, before any screen uses it. One button, one list row,
   one slider - parameterised, not copied per screen.
3. **Layout skeleton.** Containers, anchors and constraints per
   `responsive-layout`; no absolute positions for content that can grow.
4. **Bind data** per `ui-architecture`, with fake data first (including
   worst cases: longest name, zero items, 10,000 items).
5. **Motion and sound hooks.** Implement transitions from the motion notes,
   respecting the reduced-motion setting; expose hooks for UI sounds that
   the sound designer fills.
6. **Assets.** Export at the densities the profile lists; prefer vector or
   nine-slice for anything that stretches; text never baked into images.

## 4. Decision rules

- **Design conflicts with a guideline** (contrast below 4.5:1, touch target
  below platform minimum, text below platform minimum): implement the
  compliant version, show both to the graphic designer, record the reason.
  Accessibility minimums are not negotiable by taste.
- **Design is silent on a size or state:** derive from tokens and existing
  widgets; mark it "assumed" in the PR for the designer's review.
- **Design is expensive to build** (custom shader, per-frame layout): give
  the designer a cost estimate and a cheaper option; let them choose.
- **One-off visual on one screen:** still a widget variant or theme value
  if a second screen could ever need it.

## 5. Fidelity check

Compare the built screen to the mockup at the reference size, side by side
or overlaid:

- [ ] Spacing, alignment and type scale match tokens (within one spacing step).
- [ ] Colours come from theme names; no stray raw values.
- [ ] Every designed state reachable and correct, including focus.
- [ ] Motion timing and easing match notes; reduced-motion variant exists.
- [ ] At other sizes the layout keeps the design's hierarchy and grouping.
- [ ] Text is live text, localisable, scales with the text-size setting.
- [ ] Assets crisp at every target density.

## Failure modes

- Building screen by screen with copied styles; theme drift follows.
- Treating the mockup's English copy length as the layout's maximum.
- Silent "improvements" to the design. Propose, don't impose.
- Text, numbers or button labels baked into bitmaps.
- Hover-only affordances that touch and controller players never see.

## Documentation

New widget or token: update the project's UI **reference** (widget API,
states, tokens). A design decision that changed during implementation:
add it to the UI **explanation** doc. A repeatable procedure (e.g. adding
a token): a **how-to**.
