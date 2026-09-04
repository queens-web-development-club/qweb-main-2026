# QWEB Design System

<!-- GENERATED:overview source=/document updated=2026-08-25 -->
## Overview

This document describes the single-page Queen's Web Development Club site implemented in `src/main.tsx` and the page folders under `src/pages/` (Landing, AboutUs, Projects, Term, Team, and Footer), based on the CSS and TSX inspected on 2026-08-25. The implementation uses a near-black, mono-led editorial visual system with blue/teal accents and responsive section composition. A separate design-direction document was not found; the visual direction is represented by the implementation evidence below.
<!-- /GENERATED:overview -->

<!-- GENERATED:typography source=/document updated=2026-08-25 -->
## Typography

| Role | Value | Evidence |
| --- | --- | --- |
| Primary/display family | `Space Grotesk` | `src/pages/Landing/Landing.css`, `@import` and `:root`; headings and card titles across page CSS |
| Utility/body family | `DM Mono` | `src/pages/Landing/Landing.css`, `@import`; labels, metadata, navigation, body copy, and status text |
| Hero heading scale | `clamp(50px, 7.3vw, 102px)` | `Landing.css`, `h1` |
| Section heading scale | `clamp(31px, 4vw, 50px)` About; `clamp(34px, 4.3vw, 56px)` shared later sections | `AboutUs.css`, `Projects.css` |
| Membership heading scale | `clamp(35px, 4vw, 54px)` | `Team.css`, `.join-panel h2` |
| Hero heading line height | `.91` | `Landing.css`, `h1` |
| Section heading line height | `.95` to `.98` | `Projects.css`, `.section-heading h2`; `AboutUs.css`, `.about-us h2` |
| Utility tracking | `.11em`–`.17em` | `Landing.css`, `.eyebrow` and hero bar; page CSS section labels |
| Weight usage | `400`, `500`, `600`, `700` are imported; display headings use `700`, utility and card headings generally use `400`/`500` | `Landing.css` import, `h1`, and page CSS declarations |

No CSS custom-property type scale or named typography token map was found.
<!-- /GENERATED:typography -->

<!-- GENERATED:color source=/document updated=2026-08-25 -->
## Color

| Use | Value | Defined/used in |
| --- | --- | --- |
| Page background | `#030607` | `Landing.css`, `:root`, `body`, `.page` |
| Primary text | `#e9edf1`, `#eff2f2`, `#edf1f2` | `Landing.css` and section CSS headings |
| Muted utility/body text | `#83919a`, `#74838b`, `#697a83`, `#61737c` | `Landing.css`, `AboutUs.css`, `Term.css` |
| Blue accent | `#267fea`, `#2878ed`, `#2586ee`, `#286bea` | CTA gradients, hero heading, stats, timeline, project metadata |
| Teal accent | `#19d9ae`, `#1bd6b0`, `#20cbb4`, `#1bd0ae` | CTA gradients, hero heading, ticker, timeline |
| Green accent | `#36c88e`, `#18a86f` | Wave and team visual treatments |
| Borders/dividers | `#142832`, `#14242b`, `#0d1c22`, and low-opacity white/blue/teal borders | Cards, lists, sections, navigation, footer |
| CTA surface | `linear-gradient(110deg,#101d31 0%,#0d2530 50%,#0b2e27 100%)` | `Team.css`, `.join-panel` |

No semantic error, warning, or success color token system was found. Colors are literal declarations rather than shared CSS custom properties; this is implementation drift to preserve when extending the current visual language carefully.
<!-- /GENERATED:color -->

<!-- GENERATED:spacing source=/document updated=2026-08-25 -->
## Spacing

No named spacing scale or base unit was found. Repeated implementation patterns are:

- Horizontal gutters use `clamp(22px, 7vw, 96px)` on the landing hero, navigation, and major sections.
- Major sections use approximately `102px` top and `108px`–`112px` bottom padding in Projects, Term, and Team; About uses `73px`/`75px`.
- Card and list gaps range from `8px` to `10px`; section heading margins range from `28px` to `42px`.
- Mobile sections reduce to roughly `51px`–`76px` top padding and `54px`–`82px` bottom padding at `700px`.

Evidence: `src/pages/Landing/Landing.css`, `AboutUs.css`, `Projects.css`, `Term.css`, `Team.css`, and `Footer/SiteFooter.css`.
<!-- /GENERATED:spacing -->

<!-- GENERATED:components source=/document updated=2026-09-02 -->
## Components

| Component | Purpose | Appearance-relevant surfaces |
| --- | --- | --- |
| `Landing` | Composes the single route, navigation, hero, animated stats, stack ticker, and page sections | `src/pages/Landing/Landing.tsx` and `Landing.css` |
| `InspectMode` | Opt-in mode that labels each major section with the selector it is built from; `InspectModeProvider` owns the state, `InspectToggle` is the nav control, `InspectOverlay` draws the outline and tag | `src/components/InspectMode/` |
| `AnimatedStat` | Counts a statistic from zero to its target when visible | `Landing.tsx`; rendered as bordered translucent stat cards |
| `AboutUs` | Presents offerings as a numbered editorial index and first-year milestones as a continuous progress track | `src/pages/AboutUs/AboutUs.tsx` and `AboutUs.css` |
| `Projects` | Presents three member-built project treatments | `src/pages/Projects/Projects.tsx` and `Projects.css` |
| `Term` | Presents the next event as a date-led featured panel, followed by a compact remainder-of-term list | `src/pages/Term/Term.tsx` and `Term.css` |
| `Team` / `Person` | Presents co-chairs, executives, and membership CTA | `src/pages/Team/Team.tsx` and `Team.css` |
| `SiteFooter` | Presents QWEB identity and grouped navigation links | `src/pages/Footer/SiteFooter.tsx` and `SiteFooter.css` |

Section-level components carry a `data-inspect` attribute holding their real selector (for example `section.projects-section#projects`). Inspect mode reads it on hover; nothing else depends on it, and the innermost annotated element wins. New sections should set one.

`src/components/` holds cross-cutting UI that is not a page section. Page sections keep the colocated `src/pages/<Section>/` convention.
<!-- /GENERATED:components -->

<!-- GENERATED:layout source=/document updated=2026-09-02 -->
## Layout

- The site is a single React route composed by `Landing` in `src/main.tsx`.
- Major sections use a centered `max-width: 1130px` container with responsive horizontal gutters, except the full-width landing frame and ticker.
- Landing navigation is a flex row; hero copy is left-aligned with an absolutely positioned year label and wave field.
- The ticker below the hero is a flex row: a static `This site runs on` label with a right divider, followed by the scrolling stack track. The label is hidden below `700px`.
- Stats use a four-column grid on desktop and two columns below `700px`.
- About offerings use four full-width editorial rows with numbered titles, descriptions, and activity artifacts; its milestone track uses four horizontal stages. On mobile, rows reflow around a fixed index and the milestone track becomes vertical.
- Projects use a three-column grid, with one visible project card on small screens.
- Term uses a date-led featured event panel with time/place metadata, followed by a four-column remainder list; mobile stacks featured metadata and hides list status pills.
- Team uses a two-card co-chair grid and four-card executive grid; the membership panel is a two-sided flex composition that stacks on mobile.
- Footer uses a two-column grid on desktop: brand on the left, navigation groups in the right half; it stacks below `700px`.
<!-- /GENERATED:layout -->

<!-- GENERATED:motion source=/document updated=2026-08-25 -->
## Motion

| Motion | Trigger | Timing/technique | Evidence |
| --- | --- | --- | --- |
| Animated statistics | Intersection with stat card | `requestAnimationFrame`, `1100ms`, cubic easing `1 - (1 - progress) ** 3` | `Landing.tsx`, `AnimatedStat` |
| Rainbow wave drift | Page load/continuous loop | CSS keyframes, `8s`–`13s`, `ease-in-out`, alternating directions | `Landing.css`, `@keyframes drift` and `.wave-*` |
| Framework ticker | Continuous page load loop | CSS keyframes, `23s linear`, transform-based marquee | `Landing.css`, `@keyframes marquee` |
| Link hover | Pointer hover | Color change; no duration specified | `Landing.css`, `nav a:hover`, footer link selectors |
| Page-load entrance | Initial mount | `560ms`, opacity/translateY, staggered by `90ms`/`170ms` | `Landing.tsx` and `Landing.css`, `.page-load` |
| Section/card reveal | Intersection with section or card | `520ms`, opacity/translateY, compositor-only, small sibling stagger | `Landing.tsx` and `Landing.css`, `.reveal-on-scroll` |
| About journey progress | About section intersection | `1100ms`, transform scale along the desktop horizontal or mobile vertical track | `AboutUs.css`, `.about-us__milestones::before` |

No JavaScript animation library or scroll-driven animation was found.
<!-- /GENERATED:motion -->

<!-- GENERATED:responsive source=/document updated=2026-08-25 -->
## Responsive

The primary breakpoint is `700px`, defined in the CSS files for Landing, AboutUs, Projects, Term, Team, and Footer. At this breakpoint navigation links hide, the navigation and logo compact, hero copy and ticker spacing reduce, stats change from four to two columns, About offerings collapse to one column, project cards collapse to one with only the first visible, term dates hide, and the footer stacks. Team also has an `800px` breakpoint that changes person grids to four columns and reduces art height. Evidence: the `@media` blocks in each section stylesheet.
<!-- /GENERATED:responsive -->

<!-- GENERATED:motion-reduced source=/document updated=2026-08-25 -->
## Reduced Motion

`src/pages/Landing/Landing.tsx` checks `prefers-reduced-motion: reduce` and immediately finishes statistic counting. `src/pages/Landing/Landing.css` sets animation duration to `.01ms`, limits animation iterations, disables smooth scrolling, removes the new page-load/reveal transitions, and leaves all content visible for reduced-motion users. This rule affects the CSS wave and ticker animations as well as motion under the page root.
<!-- /GENERATED:motion-reduced -->

<!-- GENERATED:implementation-guidance source=/document updated=2026-09-02 -->
## Implementation Guidance

- Reuse `Space Grotesk` for display and compact headings and `DM Mono` for labels, metadata, navigation, status text, and supporting copy.
- Continue the near-black surface with controlled blue/teal accents, thin dividers, and restrained gradients; avoid introducing an unrelated palette or a parallel token system without a deliberate refactor.
- Follow the existing page-folder convention: each major page/section has a colocated `.tsx` and `.css` file under `src/pages/<Section>/`.
- Prefer semantic `section`, `header`, `nav`, `article`, `footer`, `time`, and heading elements as used by the current implementation.
- Preserve the existing `700px` mobile breakpoint and `800px` Team breakpoint unless a responsive change is intentional and verified.
- Keep motion transform/opacity-oriented and preserve the existing reduced-motion behavior.
- Reserve the `↗` glyph for links that leave the site. In-page anchors use an underline or the button surface instead.
- Keep `//` prefixes for asides that read as code comments (`// Your first year`, `// Join QWEB`). Section kickers are plain mono labels, so the device stays a signal rather than decoration.
- Give new sections a `data-inspect` selector so inspect mode continues to describe the page accurately.
- Keep section composition varied while preserving one visual system, use deliberate typography hierarchy and readable line lengths, prefer whitespace and dividers over unnecessary shells, and use semantic React elements.
<!-- /GENERATED:implementation-guidance -->

<!-- GENERATED:open-questions source=/document updated=2026-08-25 -->
## Open Questions

- No centralized CSS custom-property token system was found for colors or spacing.
- Contrast ratios were not computed in this documentation pass.
- No screenshot or rendered visual evidence was captured; this document reflects declared source styles.
<!-- /GENERATED:open-questions -->
