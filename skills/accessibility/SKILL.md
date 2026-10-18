---
name: accessibility
description: Use when building or reviewing any UI players must perceive or operate - text, colour, icons, HUD, subtitles, motion, timers, settings menus, screen-reader or narration support - and when planning which accessibility features a game's UI should offer.
---

# Accessibility in in-app UI

Sources, in order of use: the **Game Accessibility Guidelines** (GAG;
basic / intermediate / advanced), the **Xbox Accessibility Guidelines**
(XAG 101-123, with prescriptive minimums usable on any platform),
**WCAG 2.2** where the UI behaves like an app or web page, and the target
platforms' guidelines (Apple HIG, Android/Material). Concrete numbers are in
[thresholds.md](thresholds.md).

GAG's advice: do all of **basic** by default (cheap, wide-reaching), plan
**intermediate** at design time, choose **advanced** by audience. Involve
players with disabilities in playtesting.

## 1. Defaults every screen must meet

- **Text size:** default body text at least the platform minimum (XAG 101:
  26 px at 1080p on console, 18 px at 1080p on PC, scaled for 4K and DPI).
  Simple, clear font; no long all-caps or italic blocks.
- **Text scaling** to 200% without loss of content and without two-axis
  scrolling; icons and glyphs scale with it.
- **Contrast:** text 4.5:1 (large text 3:1); essential non-text UI (icons,
  bars, focus rings, control outlines) 3:1 (WCAG 1.4.11; XAG 102 asks 4.5:1
  for standard-size visual elements). On variable game backgrounds,
  measure against the **lowest-contrast** part, or put a backing plate
  behind text with adjustable opacity.
- **No colour-only signals.** Pair colour with shape, icon, pattern, text or
  position (team colours, rarity, health states, valid/invalid fields).
- **No sound-only signals.** Every important audio cue has a visual or
  haptic equivalent (XAG 103).
- **Touch targets** at least 44x44 pt (Apple) / 48x48 dp (Android),
  well spaced; WCAG 2.5.8 minimum 24x24 CSS px for pointer UI.
- **Focus navigation** complete and visible (see `input-and-focus`).
- **Reduced motion:** honour the platform reduce-motion setting and an
  in-game toggle; screen shake, parallax, large zooms and background
  movement can be disabled (GAG; XAG 117).
- **Flashing:** no more than three flashes in any one second, and avoid
  large saturated-red flashes and high-contrast repeating patterns
  (WCAG 2.3.1; XAG 118).
- **Player-paced text:** prompts and dialogue advance on input, not timers.
- **Settings persist** and are reachable before gameplay starts (first
  launch), and can be changed at any time.

## 2. Features the UI usually owns or hosts

| Area | Basic (do by default) | Intermediate / advanced (by agreement) |
|---|---|---|
| Subtitles/captions | on/off, readable default size, background plate, speaker name; can be enabled before any sound plays | size, colour, background opacity options; captions for important sounds; speaker direction |
| Text | readable default, high contrast | text size option, high-contrast mode (7:1), dyslexia-friendly font option |
| HUD | essential info near eye-line | resize, reposition, hide non-essential elements |
| Colour | no colour-only info | colour-blind-safe palettes or customisable colours (not just filters) |
| Input | remap, no required hold/mash | toggle vs hold option, repeat-rate, one-switch support |
| Time | no time-limited menus | pause/extend/disable gameplay timers (XAG 116) |
| Errors | clear messages, confirm destructive actions | undo; errors say how to fix (XAG 115) |
| Narration | UI elements expose label/role/state | screen-reader or text-to-speech of menus (XAG 106) |
| Documentation | accessibility features listed in-game | accessible support channels (XAG 121-122) |

The game designer decides which intermediate/advanced features ship; you
estimate cost, build the hooks into shared widgets so they're cheap, and
flag basic gaps as defects.

## 3. Screen narration and assistive tech hooks

Even before full narration ships, build widgets so it is possible:
- Every interactive element has an accessible **name** (localised), a
  **role** (button, slider, toggle, tab), and a **state/value** (on/off,
  42%, selected, disabled).
- Decorative elements are marked as ignorable.
- Names describe purpose, not looks ("Share", not "blue arrow icon"); no
  role in the name ("Submit", not "Submit button").
- Focus changes and important updates are announceable (e.g. "Saved").
- On platforms with system screen readers, use the platform accessibility
  API so the reader and switch access work.

## 4. Audit method (per screen)

1. Run the basic checklist in [thresholds.md](thresholds.md).
2. Grey-scale screenshot: is every state still distinguishable?
3. Colour-vision simulation (protanopia, deuteranopia, tritanopia).
4. Mute audio: is anything essential lost?
5. Controller-only and keyboard-only pass; touch-only pass.
6. 200% text, high-contrast mode, reduced motion on.
7. Measure contrast of text and focus indicators against worst-case backgrounds.
8. Record each finding with: guideline (GAG / XAG / WCAG id), severity
   (blocker = basic guideline failed; major; minor), screen, fix.

## Decision rules

- A basic GAG item or an XAG minimum missing is a **defect**, not a feature
  request.
- If design and guideline conflict, the guideline wins for defaults; offer
  the designer's version as an option only if it doesn't remove access.
- Prefer fixes in shared widgets and theme, so every screen inherits them.
- Filters that recolour the whole screen are not a substitute for
  colour-independent design.

## Failure modes

- Accessibility added at the end as a settings page with toggles that
  half the screens ignore.
- Settings menu itself inaccessible (tiny text, no focus, applied only
  after restart).
- Subtitles that can't be turned on until after the intro has played.
- HUD contrast measured on a mockup's flat background, not in the game.
- Flash/shake effects with no off switch.

## Documentation

Accessibility features: **reference** listing each feature, its setting
and default (players and support staff consult it; XAG 121 asks for
accessible feature documentation). Why a feature set was chosen:
**explanation**. Procedure for auditing a screen: **how-to**.
