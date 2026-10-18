---
name: ui-verification
description: Use when testing or auditing UI before merge or release - building the screen x size x language x input x accessibility test matrix, writing automated UI tests, profiling UI performance, and reporting findings with severities.
---

# Verifying UI

UI defects cluster at combinations: the German string on the smallest
phone in landscape with 200% text using a controller. Test the
combinations deliberately instead of hoping.

## 1. Build the matrix from the project profile

| Axis | Values to cover (minimum) |
|---|---|
| Size | smallest and largest window, each supported orientation, one tall notched device, TV-safe if targeted |
| Language | source language, longest pseudo-locale, one RTL (if in scope), one CJK (if in scope) |
| Input | each supported: touch, mouse, keyboard, controller |
| Accessibility | 200% text, high-contrast mode, reduced motion, subtitles on, audio muted |
| Data | empty, typical, maximum (longest names, 99+ counts), error/offline |

Don't run the full cross-product. Use pairwise coverage: every pair of
values appears together at least once, and always include the known worst
case (smallest size + longest language + largest text).

## 2. Per-screen pass

For each screen, walk the flow end to end and check:

- [ ] Matches design at reference size (`design-implementation` fidelity check).
- [ ] Layout holds at every size case (`responsive-layout` matrix).
- [ ] Every string localised; pseudo-locale clean (`localization` checklist).
- [ ] Completable with each supported input; focus visible; back works
      (`input-and-focus` checklist).
- [ ] Basic accessibility checklist passes (`accessibility/thresholds.md`).
- [ ] State correctness: values match game state after every action, after
      cover/uncover, after state changes underneath (`ui-architecture`).
- [ ] No leaks: open/close the screen many times; subscriptions and memory return to baseline.

## 3. Automated tests (where the stack allows)

Prioritise, cheapest first:

1. **View model unit tests:** formatting, visibility, enabled flags,
   plural selection per locale, given fake state. No rendering needed.
2. **String lint:** no user text in code; every key exists in every
   locale table; placeholders match across locales; ICU syntax parses.
3. **Navigation tests:** open each screen through the navigation owner;
   assert default focus, focus order, back behaviour, focus restore.
4. **Screenshot tests:** key screens at size x language combinations;
   compare against approved baselines; review diffs, don't auto-accept.
5. **Accessibility lint** where the platform offers one (labels present,
   contrast, target size).

## 4. Performance

- Measure on the slowest target device with the busiest screen open and
  the longest language: UI frame cost, layout passes, allocations per
  frame, screen open time, memory after open/close cycles.
- Compare to the project's UI budget; record before/after numbers in the PR.
- Common culprits: per-frame layout invalidation, text re-shaping,
  unpooled list rows, overdraw from stacked translucent panels.

## 5. Reporting findings

One line per finding:

```
[severity] screen / case: problem -> expected (guideline or skill rule) -> suggested fix (shared widget? theme?)
```

Severity:
- **blocker:** screen cannot be completed with a supported input; basic
  accessibility guideline failed; text clipped so meaning is lost; crash
  or wrong game state.
- **major:** design mismatch visible to players; focus lost; untranslated
  string; layout broken at one supported size.
- **minor:** cosmetic spacing, animation timing, inconsistency.

Group by root cause; fix shared widgets and theme first, then individual
screens. A release with open blockers is blocked.

## Failure modes

- Testing only in the source language at the developer's monitor size.
- Screenshot baselines accepted wholesale after a change.
- Accessibility checked on mockups instead of the running UI.
- Performance measured on a desktop when the slowest target is a phone.

## Documentation

New test cases or a new matrix axis: **reference** (the matrix and how
results are recorded). A recurring problem players hit (e.g. "subtitles
too small on TV"): a troubleshooting **how-to**. Audit results themselves
go in the PR or release notes, not in the docs.
