---
name: ui-architecture
description: Use when structuring UI code - screens, navigation, HUD, data binding to app or game state, widget libraries, theming, UI performance - or when a UI change is getting hard to make.
---

# UI architecture and state

Goal: screens are cheap to add and change, never disagree with the game
state, and never contain game rules. Industry practice (MVVM/MVP data
binding, a central screen stack, shared widget libraries) exists so that
designers, UI developers and gameplay programmers can work independently
and test their parts separately.

## Core shape

```
game/app state --events--> view model / presenter --bindings--> view (widgets)
       ^                                                        |
       +----------------commands / intents <--------------------+
```

- **State lives outside the UI.** The gameplay programmer's systems own
  it. UI reads it through the contracts doc (events, queries) and changes
  it only by sending commands.
- **View model per screen or HUD element.** Converts raw state to display
  state: formatting, localisation keys, visibility, enabled flags. It is
  plain code, testable without rendering.
- **Views are dumb.** They render the view model and emit intents
  ("confirm pressed", "tab next"). No rule checks, no saving, no network.
- **One navigation owner.** A screen stack or router opens, closes and
  replaces screens and modals; screens never instantiate each other.
  It also owns back/cancel behaviour, focus restore and input routing to
  the top layer.

## Layers

Keep these visually and logically separate, with defined z-order and input
priority: world-space UI, HUD, screens/menus, modals/dialogs, system
overlays (toasts, loading, error). Input goes to the topmost layer that
accepts it; HUD never steals menu input.

## Decision rules

- **Push or event?** Bind to change events for values that change during
  play (health, ammo, timers); query once for static screens. Never poll
  every frame when an event exists.
- **Where does a formatting rule go?** Number/date formatting and string
  selection: view model. Whether an action is allowed: game state (exposed
  as a flag), not the UI.
- **New widget or variant?** If two screens need it, it is a shared widget
  with parameters. If the design differs only in tokens, it is a theme
  variant.
- **Modal or screen?** Modal when the player must decide before continuing
  (destructive confirm, unsaved changes); screen otherwise. Modals trap
  focus inside themselves until dismissed.
- **Destructive actions** (delete save, quit without saving, spend currency)
  always get a confirm step or undo; the default focus is the safe option.

## Screen lifecycle checklist

- [ ] Opened only via the navigation owner, with typed parameters.
- [ ] On open: subscribes to events, sets default focus, plays intro motion.
- [ ] On cover (another screen on top): stops consuming input, keeps state.
- [ ] On uncover: restores focus to the element that had it.
- [ ] On close: unsubscribes everything, cancels pending async work.
- [ ] Back/cancel behaviour defined (close, confirm-then-close, or blocked
      with a visible reason).
- [ ] Handles state changing underneath it (item sold, player disconnected).

## HUD rules

- Read-only view of state; updates on events; no layout work per frame.
- Grouped by priority; critical info near the player's eye-line, not
  only in corners (Game Accessibility Guidelines).
- Each element can be hidden, resized or repositioned if the project offers
  HUD customisation; positions stored as anchors, not pixels.
- Never blocks gameplay input outside its own hit areas.

## Performance

- Budget UI cost in the frame budget the project sets; profile on the
  slowest target, with the busiest screen and longest language.
- Batch: avoid per-frame layout recalculation, text re-shaping and widget
  creation. Pool list rows; virtualise long lists.
- Load screens and atlases on demand; release them on close.
- Measure before and after; record numbers in the PR.

## Failure modes

- Screen A calls screen B directly; back stack and focus restore break.
- UI computes damage, prices or unlock rules; it drifts from the game.
- Event subscriptions leak on close; ghost updates and crashes.
- One giant "UI manager" that knows every screen.
- Bindings that fire every frame because a value is reassigned unchanged.

## Documentation

New screen or HUD element: **reference** entry (view model fields, events
consumed, commands sent, navigation entry points). Architecture choice (why
a screen stack, why this binding approach): **explanation**. Procedure for
adding a screen: **how-to**.
