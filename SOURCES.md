# Sources

*Reference, for anyone checking what research the ui-developer role is built on.*

Job postings and career ladders
- Senior UI Engineer posting (Turtle Rock Studios), https://uiuxjobsboard.com/job/1139225-remote-north-america-senior-ui-engineer - responsibilities: UI tools, art integration, localization of text/fonts/textures/VO, owning screens, UI performance; event-driven UI.
- UI Programmer posting (Ubisoft), https://www.careerbeacon.com/fr/emplois-2/3523332/ubisoft/ui-programmer-march-of-giants - menus/HUD, design docs to features, designer collaboration, animation and sound hooks, UI tests and tools, MVVM, UX/localization/accessibility principles.
- Engineering Ladders (Jorge Fioranelli), https://github.com/jorgef/engineeringladders - technology/system/people/process/influence axes used for the junior-to-lead progression.

Accessibility standards and guidelines
- Game Accessibility Guidelines, https://gameaccessibilityguidelines.com/ and full list https://gameaccessibilityguidelines.com/full-list/ - basic/intermediate/advanced tiers; UI-relevant guidelines (text, contrast, colour, input parity, subtitles, motion, settings).
- Xbox Accessibility Guidelines overview, https://learn.microsoft.com/en-us/gaming/accessibility/guidelines - XAG 101-123 list; UI navigation, focus, errors, time limits, photosensitivity.
- XAG 101 Text display, https://devdocs.xbox.com/build/game-principles/accessibility/xag-deep-dives/xag-101-text-display.md - minimum text sizes per platform, spacing, 200% scaling, line length.
- XAG 102 Contrast, https://devdocs.xbox.com/build/game-principles/accessibility/xag-deep-dives/xag-102-contrast.md - 4.5:1 / 3:1, lowest-contrast measurement, 7:1 high-contrast mode.
- XAG 112 UI navigation, https://devdocs.xbox.com/gaming/accessibility/xbox-accessibility-guidelines/112 - focus order, wrapping rules, digital-input parity, consistent prompts.
- XAG 113 UI focus handling, https://learn.microsoft.com/en-us/gaming/accessibility/xbox-accessibility-guidelines/113 - always-visible focus indicator, dialog focus.
- W3C WCAG 2.2 Understanding 2.5.8 Target Size (Minimum), https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html - 24x24 CSS px and spacing exception.
- W3C WCAG 2.2 Understanding 2.4.11 Focus Not Obscured, https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html - focused item never fully hidden.

Platform guidelines
- Apple Human Interface Guidelines: Layout, https://developer.apple.com/design/human-interface-guidelines/layout - safe areas, size classes, both orientations, Dynamic Type, 44x44 pt targets, tvOS safe zone.
- Android Developers: Window size classes, https://developer.android.com/develop/ui/compose/layouts/adaptive/window-size-classes - width/height breakpoints; window size over device type.
- Android Developers: Make apps more accessible, https://developer.android.com/guide/topics/ui/accessibility/apps - 48x48 dp targets, content labels, contrast thresholds.

Internationalization
- Unicode CLDR Language Plural Rules, https://www.unicode.org/cldr/charts/41/supplemental/language_plural_rules.html - six plural categories and per-language rules.
- Lokalise: Complete guide to ICU MessageFormat, https://lokalise.com/blog/complete-guide-to-icu-message-format/ - plural, select, number and date arguments.
- W3C Internationalization: Text size in translation, https://www.w3.org/International/articles/article-text-size - expansion by string length; layout advice for CJK, tall scripts, compound words.
- Lingoport: 9 Internationalization Best Practices, https://lingoport.com/9-best-practices-for-internationalization/ - externalize strings, no concatenation, ICU formatting, pseudo-localization, quality gates.

Practitioner talks
- Joel Gonzales, "UI Engineering Patterns from Marvel's Midnight Suns", GDC 2023, https://www.gdcvault.com/play/1029385/UI-Engineering-Patterns-from-Marvel - shared UI architecture for many screens.
- Stephan Dilly, "Data Binding Architectures for Rapid UI Creation in Unity", GDC 2017, https://gdcvault.com/play/1023978/Data-Binding-Architectures-for-Rapid - MVC/MVVM data binding so designers and developers work and test independently.

Documentation
- Diataxis, https://diataxis.fr/ - the four documentation kinds and the compass, applied through the project's Diataxis guide.
