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

<!-- GENERATED:components source=/document updated=2026-08-25 -->
## Components

| Component | Purpose | Appearance-relevant surfaces |
| --- | --- | --- |
| `Landing` | Composes the single route, navigation, hero, animated stats, technology ticker, and page sections | `src/pages/Landing/Landing.tsx` and `Landing.css` |
| `AnimatedStat` | Counts a statistic from zero to its target when visible | `Landing.tsx`; rendered as bordered translucent stat cards |
| `AboutUs` | Presents offerings and first-year milestones | `src/pages/AboutUs/AboutUs.tsx` and `AboutUs.css` |
| `Projects` | Presents three member-built project treatments | `src/pages/Projects/Projects.tsx` and `Projects.css` |
| `Term` | Presents term events as a bordered list with dates and status labels | `src/pages/Term/Term.tsx` and `Term.css` |
| `Team` / `Person` | Presents co-chairs, executives, and membership CTA | `src/pages/Team/Team.tsx` and `Team.css` |
| `SiteFooter` | Presents QWEB identity and grouped navigation links | `src/pages/Footer/SiteFooter.tsx` and `SiteFooter.css` |

No shared UI package or component library was found.
<!-- /GENERATED:components -->

<!-- GENERATED:layout source=/document updated=2026-08-25 -->
## Layout

- The site is a single React route composed by `Landing` in `src/main.tsx`.
- Major sections use a centered `max-width: 1130px` container with responsive horizontal gutters, except the full-width landing frame and ticker.
- Landing navigation is a flex row; hero copy is left-aligned with an absolutely positioned year label and wave field.
- Stats use a four-column grid on desktop and two columns below `700px`.
- About offerings use a two-column grid, then milestones use four columns; both collapse to one/two-column mobile arrangements.
- Projects use a three-column grid, with one visible project card on small screens.
- Term uses a four-column row structure: index, content, date, status; mobile hides dates and reduces columns.
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

No JavaScript animation library or scroll-driven animation was found.
<!-- /GENERATED:motion -->

<!-- GENERATED:responsive source=/document updated=2026-08-25 -->
## Responsive

The primary breakpoint is `700px`, defined in the CSS files for Landing, AboutUs, Projects, Term, Team, and Footer. At this breakpoint navigation links hide, the navigation and logo compact, hero copy and ticker spacing reduce, stats change from four to two columns, About offerings collapse to one column, project cards collapse to one with only the first visible, term dates hide, and the footer stacks. Team also has an `800px` breakpoint that changes person grids to four columns and reduces art height. Evidence: the `@media` blocks in each section stylesheet.
<!-- /GENERATED:responsive -->

<!-- GENERATED:motion-reduced source=/document updated=2026-08-25 -->
## Reduced Motion

`src/pages/Landing/Landing.tsx` checks `prefers-reduced-motion: reduce` and immediately finishes statistic counting. `src/pages/Landing/Landing.css` sets animation duration to `.01ms`, limits animation iterations, and disables smooth scrolling for reduced-motion users. This rule affects the CSS wave and ticker animations as well as any future animations under the page root.
<!-- /GENERATED:motion-reduced -->

<!-- GENERATED:implementation-guidance source=/document updated=2026-08-25 -->
## Implementation Guidance

- Reuse `Space Grotesk` for display and compact headings and `DM Mono` for labels, metadata, navigation, status text, and supporting copy.
- Continue the near-black surface with controlled blue/teal accents, thin dividers, and restrained gradients; avoid introducing an unrelated palette or a parallel token system without a deliberate refactor.
- Follow the existing page-folder convention: each major page/section has a colocated `.tsx` and `.css` file under `src/pages/<Section>/`.
- Prefer semantic `section`, `header`, `nav`, `article`, `footer`, `time`, and heading elements as used by the current implementation.
- Preserve the existing `700px` mobile breakpoint and `800px` Team breakpoint unless a responsive change is intentional and verified.
- Keep motion transform/opacity-oriented and preserve the existing reduced-motion behavior.
- Keep section composition varied while preserving one visual system, use deliberate typography hierarchy and readable line lengths, prefer whitespace and dividers over unnecessary shells, and use semantic React elements.
<!-- /GENERATED:implementation-guidance -->

<!-- GENERATED:open-questions source=/document updated=2026-08-25 -->
## Open Questions

- No centralized CSS custom-property token system was found for colors or spacing.
- Contrast ratios were not computed in this documentation pass.
- No screenshot or rendered visual evidence was captured; this document reflects declared source styles.
<!-- /GENERATED:open-questions -->
