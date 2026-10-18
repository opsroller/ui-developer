*Explanation, for anyone who wants to understand what a UI developer does and why this role plugin works the way it does.*

# About the UI developer role

## What the job is

Studios call it UI developer, UI engineer or UI programmer. The job is the
same: build the interface players actually touch - menus, HUD, dialogs,
settings, store, results, credits - from a visual design someone else made
and a flow someone else specified. Current postings describe it as owning
the technical side of key UI features and screens, turning design
documents into UI features, integrating designers' art and animation,
adding hooks for animation and sound, building UI tools, profiling UI
performance, and applying UX, localization and accessibility principles.
Alongside a specific framework, they ask for experience with
event-driven UI and MVVM-style data binding - patterns that carry across
frameworks.

What makes it a distinct job, rather than "gameplay programming that draws
boxes", is the number of axes a single screen must survive at once: every
screen size and safe area, every language and script, every input device,
and every player, including those with disabilities. A gameplay system is
usually right or wrong; a screen can be right in English on a monitor and
broken in German on a phone held sideways with a controller attached.

## Where the boundaries sit

The graphic designer owns how the UI looks; the UI developer owns how it
behaves and whether it holds up. The line matters because both roles
touch the same pixels. The UI developer feeds back on feasibility and on
accessibility minimums, and builds the designer's intent at sizes and in
states the mockups never showed, but does not redesign.

The game designer owns what a screen must offer and where its flow leads.
The gameplay programmer owns the state the UI shows; the UI reads it
through events and changes it only through commands. That one-way
discipline is the most important architectural decision in game UI: once
a menu computes a price or a HUD decides whether an ability is ready, the
UI and the game will disagree, and the bug report will be filed against
whichever one players saw.

The graphics programmer owns the device input layer and rendering; the UI
developer owns UI actions, focus and routing on top. The sound designer
makes the UI sounds; the UI developer exposes the hooks. Websites are the
frontend web developer's, even though the accessibility rules overlap.

## Why accessibility is built in, not bolted on

The Game Accessibility Guidelines sort advice into basic (cheap, wide
reaching), intermediate (needs planning) and advanced (complex, niche).
The basic tier is almost entirely UI work: readable default text, high
contrast, nothing by colour alone, UI reachable with the gameplay input,
large well-spaced touch targets, player-paced text, settings that persist.
Microsoft's Xbox Accessibility Guidelines add measurable minimums that are
useful on any platform: 26 px text at 1080p on a TV, 4.5:1 text contrast,
7:1 in high-contrast mode, focus that is always visible, menus fully
navigable by digital input.

These are cheap when they live in shared widgets and the theme, and
expensive when retrofitted screen by screen. That is why the plugin treats
a missing basic guideline as a defect rather than a feature request, and
why the `accessibility` skill keeps concrete thresholds instead of
general advice.

The trade-off is that defaults sometimes override taste. A designer's
low-contrast label or hover-only tooltip gets built in a compliant form
first, with the designer's version offered only where it removes no one's
access.

## Why internationalization is the UI developer's job

Translation is localizers' work, but whether a translation can appear
correctly is decided in code: concatenated sentences cannot be reordered,
`n == 1` cannot express Russian or Arabic plurals, hand-formatted numbers
are wrong in most of Europe, and fixed-width buttons cannot hold German.
Unicode CLDR supplies the plural categories and formatting data; ICU
MessageFormat (or an equivalent) lets one message carry its own plural and
gender logic. W3C's guidance that short strings expand most - often two
to three times - is why buttons and tabs break first. Pseudo-localization
makes all of this visible before a single translator is hired, which is
why the plugin puts it in the normal test loop.

## Why layout follows the window, not the device

Platform guidance from both Apple and Google moved from device classes to
window size classes because split screen, foldables, resizable windows and
rotation change the available space while the app runs. A layout keyed to
"is this a tablet" breaks the first time a player splits the screen.
Safe areas follow the same logic: notches, rounded corners, home
indicators and TV overscan are read at runtime, not hard-coded.

## How the role grows

Career ladders commonly describe growth along technology, system, people,
process and influence axes. For a UI developer that looks like:

- **Junior:** builds screens on existing widgets from a clear design;
  follows the checklists; asks when a state is missing.
- **Mid:** owns whole features end to end; extends the widget library;
  catches localization and accessibility problems before review; writes
  view-model tests.
- **Senior:** designs the UI architecture (navigation owner, binding,
  layers); sets the test matrix and performance budget; negotiates
  feasibility and accessibility with design; mentors.
- **Lead / principal:** sets UI technology direction and tools for the
  team or studio; defines accessibility and localization commitments with
  production; influences beyond the team (talks, shared libraries,
  standards work).

## Trade-offs this plugin makes

- **Shared widgets over per-screen speed.** Slower for the first screen,
  much faster and more consistent for the twentieth, and the only way
  accessibility and localization fixes reach every screen.
- **Pairwise test coverage over the full matrix.** The full
  size x language x input x setting cross-product is too large; pairwise
  plus the known worst case catches most combination bugs.
- **Read-only parallel checkers, one fixer.** Slower than letting each
  checker fix what it finds, but parallel edits to shared widgets and
  string tables conflict.
- **Defaults with "assumed" labels over waiting.** Missing design states
  are built with sensible defaults and flagged, so work continues and the
  designer still decides.

See the [reference index](../reference/index.md) for the parts of the
plugin and [SOURCES.md](../../SOURCES.md) for the research.
