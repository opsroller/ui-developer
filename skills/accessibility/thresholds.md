# Accessibility thresholds and basic checklist

Reference for the `accessibility` skill. Numbers are minimum defaults; the
project profile may set stricter ones.

## Text size (XAG 101, default at launch)

Measured as body height, lowest descender to highest ascender.

| Platform | Resolution / density | Minimum |
|---|---|---|
| Console (TV distance) | 1080p | 26 px |
| Console | 4K | 52 px |
| PC / VR | 1080p | 18 px |
| PC / VR | 4K | 36 px |
| Mobile / streaming | 100 DPI | 18 px |
| Mobile / streaming | 200 DPI | 36 px |
| Mobile / streaming | 400 DPI | 72 px |

## Text spacing (XAG 101, blocks over two lines)

| Property | Minimum |
|---|---|
| Line spacing | 1.5x font size |
| Paragraph spacing | 2x line spacing |
| Letter spacing | 0.12x font size |
| Word spacing | 0.16x font size |
| Line length | 80 characters max (40 for CJK) |
| Text scaling | to 200% without loss of content |

## Contrast

| Element | Ratio | Source |
|---|---|---|
| Standard text | 4.5:1 | WCAG 1.4.3, XAG 102 |
| Large text | 3:1 | WCAG 1.4.3, XAG 102 |
| Disabled or inactive text | 3:1 | XAG 102 |
| Essential non-text UI (icons, focus, outlines) | 3:1 (XAG: 4.5:1 standard size) | WCAG 1.4.11, XAG 102 |
| High-contrast mode, all UI | 7:1 | XAG 102 |
| Over dynamic backgrounds | measure at lowest-contrast area | XAG 102 |

Android counts text below 18 sp (14 sp bold) as standard size.

## Targets

| Platform | Minimum |
|---|---|
| Apple platforms | 44x44 pt |
| Android / Material | 48x48 dp |
| WCAG 2.5.8 (AA) | 24x24 CSS px or spacing exception |

## Motion and flashing

- No more than 3 flashes in any 1-second period (WCAG 2.3.1); avoid
  saturated red flashes and high-contrast stripes or checkerboards.
- Reduced-motion: shake, parallax, zoom, background motion can be turned off.

## Basic checklist (GAG basic + XAG minimums, applied to UI)

- [ ] Default text meets the size table; text scales to 200%.
- [ ] Text and essential UI meet contrast; HUD checked in-game.
- [ ] No information by colour alone; none by sound alone.
- [ ] All UI reachable with the gameplay input; controller digital and
      keyboard only (where supported).
- [ ] Focus always visible; logical order; no traps; back works.
- [ ] Touch targets meet platform minimum and are well spaced.
- [ ] Text advances at the player's pace; no timed menus.
- [ ] Subtitles available, readable, can be enabled before any speech.
- [ ] Separate volume controls for music, effects and speech (UI hosts them).
- [ ] Reduced-motion and flash safety respected.
- [ ] Destructive actions confirmed or undoable; errors say how to fix.
- [ ] All settings saved and applied immediately.
- [ ] Game can be started without many levels of menus.
- [ ] Accessibility features described in-game.
