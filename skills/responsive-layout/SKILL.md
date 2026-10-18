---
name: responsive-layout
description: Use when laying out any screen or HUD that must work across screen sizes, aspect ratios, orientations, resizable windows, notches and safe areas, TV overscan, or enlarged text.
---

# Responsive layout across sizes and safe areas

Lay out from the space you actually have, not from the device you think
you are on. Android's window size classes and Apple's size classes both
exist because split screen, foldables, resizable windows and rotation
change the available space while the app runs.

## 1. Get the target envelope from the project profile

- Smallest and largest window (logical units, both orientations).
- Aspect ratios to support (e.g. 4:3 tablets through 21:9 ultrawide and
  tall phones).
- Which orientations: portrait, landscape, both. The Game Accessibility
  Guidelines list supporting both as an advanced accessibility feature.
- Platforms with TV viewing (overscan, 10-foot distance) or handheld.
- Text scaling range (at least up to 200% per Xbox Accessibility
  Guideline 101; platform text-size settings on mobile).

If the profile is silent, ask; until answered, assume both orientations
and 200% text.

## 2. Classify the window, then choose a layout

Use width (and height) classes, not device names. Reference breakpoints
from Android's window size classes, useful on any platform:

| Width class | Logical width | Typical layout |
|---|---|---|
| Compact | < 600 | single column, bottom or full-screen navigation |
| Medium | 600-839 | two panes possible, side rail |
| Expanded | 840-1199 | list + detail, persistent navigation |
| Large / extra-large | >= 1200 | more panes or wider content with max width |

Height classes: compact < 480, medium 480-899, expanded >= 900. A
landscape phone is compact height: shrink vertical chrome, not content.

Rules:
- Re-evaluate the class on every resize/rotation/fold event; the class can
  change mid-session.
- Keep the same content and actions available in every class; change
  arrangement, not capability (Apple HIG: adapt gracefully to context).
- Constrain reading width (about 80 characters, 40 for CJK, per XAG 101)
  on large windows; don't stretch text across a monitor.

## 3. Safe areas and insets

- Read safe-area insets from the platform at runtime; never hard-code
  notch sizes. Re-read on rotation.
- **Backgrounds** extend edge to edge; **content and controls** stay inside
  the safe area.
- Avoid controls along the bottom edge and screen corners where system
  gestures live; a system gesture can cancel a custom one (Apple HIG).
- TV/console: keep essential content inside the title-safe region. Apple's
  tvOS guidance is 60 px top/bottom and 80 px sides at 1080p; many consoles
  use a 5-10% margin, and a player-adjustable safe-zone setting is common.
- HUD anchors to safe-area edges, so it moves with the notch on rotation.

## 4. Building blocks

- Containers and constraints (stack, grid, flex, anchors), never absolute
  positions for content that can grow.
- Sizes in logical units (pt, dp, or reference-resolution units scaled by
  the framework), never physical pixels.
- Every text container can grow: wrap, then grow the container, then
  scroll - in that order. Truncate only non-essential text, with the full
  text reachable (tooltip, details).
- Images: aspect-fit for content, aspect-fill for backgrounds; nine-slice
  for panels.
- Touch targets: at least 44x44 pt (Apple) / 48x48 dp (Android); the
  visible graphic may be smaller than the hit area.
- Scaling strategy for HUDs: scale with the shorter screen side within a
  clamp, so it is neither tiny on 4K nor huge on a phone.

## 5. Test matrix (minimum)

| Case | Check |
|---|---|
| Smallest window, portrait and landscape | nothing clipped, overlapping or off-screen |
| Largest window / ultrawide | content centred or constrained, no stretched text |
| Tall phone with notch and home indicator | controls inside safe area, both orientations |
| Live resize / rotate / fold mid-screen | layout re-flows, focus and scroll position kept |
| 200% text | no loss of content, no two-axis scrolling |
| Longest language (pseudo-locale) | see `localization` |
| TV/overscan if targeted | essential info inside title-safe area |

Capture screenshots for each case in the PR.

## Failure modes

- Branching on "isTablet" or device model.
- Designing only for the mockup's single size.
- Hard-coded notch heights; content under the home indicator.
- Fixed-height text boxes that clip German, Finnish or Thai.
- HUD elements positioned in pixels from the top-left of a 16:9 frame.

## Documentation

New layout rule or breakpoint: **reference** (the supported envelope and
breakpoints table). Why a layout strategy was chosen: **explanation**.
Procedure to test a screen across sizes: **how-to**.
