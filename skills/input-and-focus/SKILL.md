---
name: input-and-focus
description: Use when making UI operable by touch, mouse, keyboard and controller - focus navigation, focus order and visibility, button prompts and glyphs, remapping, hold/tap alternatives - or when a screen cannot be completed with one of the supported inputs.
---

# Input and focus across touch, mouse, keyboard and controller

Rule from both the Game Accessibility Guidelines and Xbox Accessibility
Guideline 112: every part of the UI is reachable with the same input
method as gameplay, and fully navigable by keyboard and by controller
**digital** input alone (D-pad / arrow keys), where those inputs are
supported.

## 1. Input model

- The low-level device layer belongs to the graphics programmer or the
  engine; you own **UI actions** on top of it: navigate (up/down/left/right),
  confirm, cancel/back, tab-next/prev, page, context, menu.
- Map devices to these actions in one place. Screens consume actions, not
  raw keys or buttons.
- Track the **last used device** and switch prompts, cursor and focus
  visuals immediately when it changes (moving the mouse shows the pointer
  and hover; pressing the D-pad shows the focus ring).
- Never require analogue, gesture, multi-touch, drag or speech input as the
  only way to do something; they are supplements (GAG motor/speech).

## 2. Focus navigation rules (XAG 112/113)

- **Default focus:** every screen opens with focus on a sensible element
  (primary action, or the safe option on destructive dialogs).
- **Focus order** follows meaning, else visual reading order (mirrors in
  right-to-left locales). Repeated components keep the same relative order
  on every screen.
- **Visible focus:** a highly visible indicator, always on screen, never on
  hidden or off-screen elements; at least 3:1 against adjacent colours
  (WCAG 1.4.11 non-text contrast).
  Auto-scroll lists so the focused item is never obscured (WCAG 2.4.11).
- **Wrapping:** linear lists wrap last-to-first; 2D grids do not; offer a
  setting to toggle wrapping if possible.
- **Escape hatch:** if an input can move focus into something, the same
  input can move it out. Modals trap focus until closed; the background
  does not receive input.
- **Restore:** closing a screen or modal returns focus to the element that
  opened it.
- **Directional search:** prefer explicit neighbours for irregular layouts;
  automatic spatial navigation must be checked for dead ends and skipped
  elements.
- **Back:** cancel/back always works and is consistent; persistent route
  back to the main menu from submenus.

## 3. Widget behaviour per input

| Widget | Touch | Mouse | Keyboard / controller |
|---|---|---|---|
| Button | tap, 44 pt / 48 dp target | click, hover state | confirm on focus |
| Slider | drag + tap steps | drag, wheel | left/right steps, hold to accelerate |
| Dropdown | full-screen picker on compact | popup list | confirm opens, up/down, confirm/cancel |
| Text field | system keyboard | type | on-screen keyboard on controller |
| Tabs | tap, swipe optional | click | shoulder buttons / tab-next |
| Scroll list | flick | wheel, scrollbar | focus moves, list follows |
| Tooltip / hover info | long-press or info button | hover | shown on focus |

Hover-only information is a defect: touch and controller players never see it.

## 4. Prompts and glyphs

- Show prompts for the active device family; use platform-correct glyphs
  and confirm/cancel conventions (some platforms and regions swap them).
- Prompts come from the binding, not hard-coded art, so remapping updates
  them. Glyphs scale with text size.
- Keep prompt positions and meanings consistent across screens (XAG 112).

## 5. Motor accessibility in input

- Remappable controls, including UI actions, if the project supports
  remapping; save per profile.
- Alternatives to hold-to-confirm and button mashing (toggle, or a setting).
- No precise timing required in menus; no moving targets for pointer input.
- Adjustable repeat rate and sensitivity for held navigation.
- Large, well-spaced targets on touch; stationary menu targets.

## Checklist per screen

- [ ] Completed start to finish with controller D-pad only.
- [ ] Completed with keyboard only (if keyboard supported).
- [ ] Completed with touch only (if touch supported), no hover dependency.
- [ ] Completed with mouse only.
- [ ] Default focus set; focus visible every step; no dead ends; no traps.
- [ ] Back works everywhere; focus restored on return.
- [ ] Prompts switch with the last-used device and follow remapping.
- [ ] Right-to-left: left/right navigation mirrors with the layout.

## Failure modes

- Focus lost after a list reloads or an item is deleted.
- Mouse hover and controller focus fighting over two highlighted items.
- Invisible focus on dark backgrounds.
- Hard-coded "Press A" art; prompts wrong after remapping.
- Scroll views that the controller cannot scroll.

## Documentation

New UI action or binding: **reference** (actions table, default
bindings). New navigation pattern: **reference** for the widget plus a
**how-to** for wiring it on a screen. Player-facing controls changes: tell
the game designer which player docs need updating.
