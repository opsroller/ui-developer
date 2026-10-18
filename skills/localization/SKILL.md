---
name: localization
description: Use when adding or changing any user-visible text, number, date, currency, name or image with text; when adding a language; or when preparing UI for translation (internationalization, pseudo-localization, right-to-left, CJK, fonts).
---

# Localization and internationalization

Internationalization (i18n) is your job: make the UI able to show any
language correctly. Localization (l10n) is translators' job: supply the
language. Bugs found after translation cost far more than bugs found
while building, so i18n rules apply from the first string.

## 1. Strings

- Every user-visible string lives in the string tables the project names,
  under a stable key (`settings.audio.music_volume.label`), never inline.
- **Whole messages, never concatenation.** Word order differs by language.
  `"You found " + n + " " + item` is a defect; use one message with
  placeholders: `"You found {count} {item}"`.
- **Named placeholders**, not positional `%s %s`, so translators can reorder.
- **Plurals by CLDR category**, using ICU MessageFormat or the framework's
  equivalent:
  ```
  {count, plural, one {# coin} other {# coins}}
  ```
  English has `one`/`other`; Russian and Polish use `one`/`few`/`many`/
  `other`; Arabic uses all six (`zero`, `one`, `two`, `few`, `many`,
  `other`); Japanese and Chinese only `other`. Never write `if n == 1`.
- **Gender and variants** with `select`; ordinals ("1st", "2nd") with
  `selectordinal`. Never build them by appending suffixes.
- **Translator context** with every key: where it appears, max length if a
  hard limit truly exists, what each placeholder is, a screenshot when
  available.
- No text in images. If unavoidable (logo lockups), list the asset as
  localisable.
- Same English word in two places gets two keys if meaning differs
  ("Back" navigation vs "Back" body part in a character editor).

## 2. Formatting (CLDR / ICU data, never hand-rolled)

- Numbers: decimal and grouping separators vary (`1,234.5` / `1.234,5` /
  `1 234,5`). Use locale-aware formatters; never format with string ops.
- Dates and times, relative time ("3 minutes ago"), durations, lists
  ("A, B and C"), units, percentages, currency: locale-aware formatter.
- Sorting and search: locale collation, not byte order.
- Names: don't assume first/last order or ASCII.
- The player's locale comes from platform settings, with an in-game
  override if the project offers one; text and voice language may differ.

## 3. Layout for any language

- **Expansion** (W3C, citing IBM data): strings up to 10 English characters
  can grow 200-300%; 11-20 chars about 180-200%; long text about 130%.
  Short labels (buttons, tabs) break most often.
- Containers wrap and grow (see `responsive-layout`); compound words in
  German, Finnish, Dutch may not wrap - allow hyphenation or shrink-to-fit
  with a floor no smaller than the minimum text size.
- **CJK** needs wider glyphs, line-breaking rules and fonts with the
  character set; line width about 40 characters (XAG 101).
- **Vertical space:** Thai, Arabic, Devanagari and Vietnamese need taller
  line height for marks above and below.
- **Right-to-left** (Arabic, Hebrew, Persian, Urdu): mirror layout, reading
  order and directional icons (back arrows, progress); do not mirror
  logos, media controls, clocks or numbers. Handle bidirectional text so
  embedded numbers and Latin names display correctly.
- **Fonts:** each locale's font covers its script; fallback chain defined;
  licensing checked (provenance). Text shaping engine handles complex
  scripts (Arabic joining, Indic).

## 4. Pseudo-localization (in the normal test loop)

Run the UI in a pseudo-locale that:
- replaces characters with accented look-alikes (`Settings` -> `[Šéţţîñĝš ~~~~]`),
- pads length by 30-50% (more for short strings),
- wraps each string in brackets to expose clipping and concatenation,
- optionally mirrors as right-to-left.

Any unaccented text on screen is a hard-coded string. Any missing bracket
is clipping. Fragments inside one bracket pair reveal concatenation.

## 5. Checklist for a screen

- [ ] No hard-coded user text (pseudo-locale shows none unaccented).
- [ ] No concatenated sentences; named placeholders; plurals by category.
- [ ] Numbers, dates, currency through locale formatters.
- [ ] Longest pseudo-locale: no clipping, overlap or overflow at smallest size.
- [ ] Right-to-left pseudo-locale (if any RTL language is in scope): mirrored
      correctly, navigation direction mirrored.
- [ ] CJK and tall-script sample text renders with correct fonts and line height.
- [ ] Every new key has translator context.
- [ ] Changing language at runtime (if supported) refreshes all visible text.

## Failure modes

- "Just this one string" hard-coded; it ships untranslated.
- Translations that don't fit, "fixed" by shrinking text below the minimum.
- Keys reused across contexts; translators can't get both right.
- Strings extracted late, so translators work without screenshots.
- Fonts that silently show boxes for missing glyphs.

## Documentation

New strings: translator context lives with the keys (the strings table is
**reference**). New language or i18n mechanism: **reference** for the
string-key conventions and supported locales; **how-to** for adding a
string or a language. Why a library or format was chosen: **explanation**.
