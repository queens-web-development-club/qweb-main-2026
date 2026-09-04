# QWEB Design System

<!-- GENERATED:overview source=/document updated=2026-09-03 -->
## Overview

This document describes the single-page Queen's Web Development Club site implemented in `src/main.tsx` and the page folders under `src/pages/` (Landing, AboutUs, Education, Projects, Term, Team, Join, Sponsors, and Footer), based on the CSS and TSX inspected on 2026-09-03. The implementation uses a near-black, mono-led editorial visual system with blue/teal accents and responsive section composition. A separate design-direction document was not found; the visual direction is represented by the implementation evidence below.
<!-- /GENERATED:overview -->

<!-- GENERATED:typography source=/document updated=2026-09-03 -->
## Typography

| Role | Value | Evidence |
| --- | --- | --- |
| Primary/display family | `Space Grotesk` | `src/pages/Landing/Landing.css`, `@import` and `:root`; headings and card titles across page CSS |
| Utility/body family | `DM Mono` | `src/pages/Landing/Landing.css`, `@import`; labels, metadata, navigation, body copy, and status text |
| Hero heading scale | `clamp(50px, 7.3vw, 102px)` | `Landing.css`, `h1` |
| Section heading scale | `clamp(34px, 4.3vw, 56px)` for every section | `SectionHeading.css` |
| Membership heading scale | `clamp(35px, 4vw, 54px)` | `Join.css`, `.join-panel h2` |
| Hero heading line height | `.91` | `Landing.css`, `h1` |
| Section heading line height | `.95` to `.98` | `Projects.css`, `.section-heading h2`; `AboutUs.css`, `.about-us h2` |
| Utility tracking | `.11em`–`.17em` | `Landing.css`, `.eyebrow` and hero bar; page CSS section labels |
| Weight usage | `400`, `500`, `600`, `700` are imported; display headings use `700`, utility and card headings generally use `400`/`500` | `Landing.css` import, `h1`, and page CSS declarations |

Role tokens are defined on `:root` in `src/pages/Landing/Landing.css` and name the job rather than the value:

| Token | Value | Role |
| --- | --- | --- |
| `--t-micro` | `10px` | Uppercase tracked labels, status pills, section tags |
| `--t-meta` | `11px` | Roles, dates, captions, supporting metadata |
| `--t-body` | `13px` | Descriptions and running copy |
| `--t-control` | `13px` | Buttons and navigation |
| `--t-card` | `15px` | Card and list-item titles |
| `--t-lede` | `15px` | Hero intro and section summaries |

Before these, body copy ran at 8–9px and labels at 7px (one at 6px) — roughly half the ordinary web floor, and punishing as light text on a near-black surface. Muted greys were lightened by roughly one step alongside the size increase, since size and contrast compound on dark. Mobile overrides that re-imposed 7–8px were raised to match.
<!-- /GENERATED:typography -->

<!-- GENERATED:color source=/document updated=2026-09-03 -->
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
| CTA surface | `linear-gradient(110deg,#101d31 0%,#0d2530 50%,#0b2e27 100%)` | `Join.css`, `.join-panel` |

Corner radius is a single token, `--radius: 7px`, on `:root`. The page previously mixed `5px`, `6px`, `7px` and `8px` across equivalent surfaces. Pill controls keep `999px`; the inspect overlay and focus rings keep their own small radii.

No semantic error, warning, or success color token system was found. Colors are literal declarations rather than shared CSS custom properties; this is implementation drift to preserve when extending the current visual language carefully.
<!-- /GENERATED:color -->

<!-- GENERATED:spacing source=/document updated=2026-09-03 -->
## Spacing

A three-tier section rhythm is defined as custom properties on `:root` in `src/pages/Landing/Landing.css`:

| Token | Value | Role |
| --- | --- | --- |
| `--sp-xl` | `88px` | Opens a region (About, Education, and the Join panel's bottom) |
| `--sp-lg` | `64px` | Continuation section within a region (Team, Term, Projects) |
| `--sp-md` | `48px` | Closes a region out, and light sections (Sponsors) |
| `--gutter` | `clamp(22px,7vw,96px)` | Shared horizontal gutter |

The tiers are assigned by how much a section carries, not applied uniformly. Before this scale every major section paid a near-identical `102px`–`112px` top and `112px`–`118px` bottom regardless of content, which put roughly `1,266px` of pure padding below the fold and flattened the page into one cadence.

- Card and list gaps range from `8px` to `14px`; section heading margins range from `20px` to `28px`.
- Mobile sections reduce to roughly `48px`–`60px` top and `48px`–`56px` bottom at `700px`.

Evidence: `src/pages/Landing/Landing.css` `:root`, and the `padding` declarations in `AboutUs.css`, `Projects.css`, `Term.css`, `Team.css`, `Sponsors.css`, `Join.css`, and `Footer/SiteFooter.css`.
<!-- /GENERATED:spacing -->

<!-- GENERATED:components source=/document updated=2026-09-03 -->
## Components

| Component | Purpose | Appearance-relevant surfaces |
| --- | --- | --- |
| `Landing` | Composes the single route, navigation, hero, animated stats, next-event line, curriculum ticker, and four anchored regions | `src/pages/Landing/Landing.tsx` and `Landing.css` |
| `InspectMode` | Opt-in mode that labels each major section with the selector it is built from; `InspectModeProvider` owns the state, `InspectToggle` is the nav control, `InspectOverlay` draws the outline and tag | `src/components/InspectMode/` |
| `AnimatedStat` | Counts a statistic from zero to its target when visible | `Landing.tsx`; rendered as bordered translucent stat cards |
| `AboutUs` | Presents offerings as a numbered editorial index and first-year milestones as a continuous progress track | `src/pages/AboutUs/AboutUs.tsx` and `AboutUs.css` |
| `SectionHeading` | Owns the JSX-style `< Section />` heading device shared by the major sections | `src/components/SectionHeading/` |
| `Education` | Presents the curriculum and five-step client project process | `src/pages/Education/Education.tsx` and `Education.css` |
| `Projects` | Presents eleven member-built project treatments on a horizontal snap rail, linking out where a live site is known | `src/pages/Projects/Projects.tsx` and `Projects.css` |
| `Term` | Presents the next event as a date-led featured panel, followed by a compact remainder-of-term list | `src/pages/Term/Term.tsx` and `Term.css` |
| `Team` / `Person` | Presents co-chairs and executives with optional personal details. Cards carry no index number — the order is not information | `src/pages/Team/Team.tsx` and `Team.css` |
| `Join` | Presents membership contact routes and honest empty states for unavailable application and graduate data | `src/pages/Join/Join.tsx` and `Join.css` |
| `Sponsors` | Presents reach statistics, sponsor marks, and a sponsor contact route | `src/pages/Sponsors/Sponsors.tsx` and `Sponsors.css` |
| `SiteFooter` | Presents QWEB identity and grouped navigation links | `src/pages/Footer/SiteFooter.tsx` and `SiteFooter.css` |

Section-level components carry a `data-inspect` attribute holding their real selector (for example `section.projects-section`). Region wrappers own the shareable anchors such as `#about` and `#education`; inspect mode reads the nearest annotation on hover, and nothing else depends on it. New sections should set one.

`src/components/` holds cross-cutting UI that is not a page section. Page sections keep the colocated `src/pages/<Section>/` convention.
<!-- /GENERATED:components -->

<!-- GENERATED:layout source=/document updated=2026-09-03 -->
## Layout

- The site is a single React route composed by `Landing` in `src/main.tsx`, with four anchored regions: `#home` is the landing frame, `#about` groups About Us, Projects, Team, and Sponsors, `#education` groups Education and Term, and `#join` contains membership routes. Projects also carries its own `#projects` anchor, targeted by the hero's "See our work" action and the footer's Projects link.
- Reading order within `#about` is claim → proof → people → backing: About Us promises a portfolio, Projects is that portfolio, then the team behind it and the partners funding it.
- Major sections use a centered `max-width: 1130px` container with responsive horizontal gutters, except the full-width landing frame and ticker.
- Landing navigation is a flex row; hero copy is left-aligned with an absolutely positioned year label and wave field.
- The ticker below the hero is a flex row: a static `What we teach` label with a right divider, followed by the scrolling curriculum track. The label is hidden below `700px`.
- Stats use a three-column grid on desktop and two columns below `700px`; the next-event line spans the grid.
- About offerings use four full-width editorial rows with numbered titles, descriptions, and activity artifacts; its milestone track uses four horizontal stages. On mobile, rows reflow around a fixed index and the milestone track becomes vertical.
- Projects use a horizontal snap rail rather than a grid: fixed-width cards on an `overflow-x` track with `scroll-snap-type:x mandatory`, a hairline meter and an `01 / 11` counter beneath. Eleven cards cost one row instead of four. It is deliberately not a carousel — nothing auto-advances, and there are no dots or arrow controls. The partially-cut card at the right edge plus a fade that clears at the end (`[data-end]`) are the scroll affordances; the track is focusable and labelled for keyboard and assistive technology.
- Term uses a date-led featured event panel with time/place metadata, followed by a four-column remainder list; mobile stacks featured metadata and hides list status pills.
- Team places the co-chair and executive groups side by side in a `2fr / 4fr` grid (`.team-people`) so the row fills the 1130px container; the groups stack below `700px`. Join uses a two-sided flex composition plus three route cards that stack on mobile. Sponsors use a five-column logo grid that becomes two columns on mobile.
- Footer uses a two-column grid on desktop: brand on the left, navigation groups in the right half; it stacks below `700px`.
- No rule separates sections. A hairline across the full width — accent or neutral — cut the page into stacked panels that read as separate pages rather than sections of one document; separation is spacing tiers and the ambient washes alone. Rules survive only *inside* a section, where they carry structure: the About offering rows, the About journey and Education process tracks (whose progress fill rides on the rule itself), and the Term event list.
- Each `.region` carries an ambient radial wash drawn from the hero's wave palette (blue for `#about`, teal for `#education`, green for `#join`), and consecutive regions are separated by a hairline that fades blue → teal. The hero's animated wave field itself stops at the fold; these washes carry the same light down the page without repeating six animated layers. The fixed `.noise` grain already spans the full document.
<!-- /GENERATED:layout -->

<!-- GENERATED:motion source=/document updated=2026-09-03 -->
## Motion

| Motion | Trigger | Timing/technique | Evidence |
| --- | --- | --- | --- |
| Animated statistics | Intersection with stat card | `requestAnimationFrame`, `1100ms`, cubic easing `1 - (1 - progress) ** 3` | `Landing.tsx`, `AnimatedStat` |
| Rainbow wave drift | Page load/continuous loop | CSS keyframes, `8s`–`13s`, `ease-in-out`, alternating directions | `Landing.css`, `@keyframes drift` and `.wave-*` |
| Framework ticker | Continuous page load loop | CSS keyframes, `23s linear`, transform-based marquee | `Landing.css`, `@keyframes marquee` |
| Link hover | Pointer hover | Color change; no duration specified | `Landing.css`, `nav a:hover`, footer link selectors |
| Page-load entrance | Initial mount | `560ms`, opacity/translateY, staggered by `90ms`/`170ms` | `Landing.tsx` and `Landing.css`, `.page-load` |
| Section/card reveal | Intersection with section or card | `400ms` opacity cross-fade, no translate, no stagger | `Landing.tsx` and `Landing.css`, `.reveal-on-scroll` |
| About journey progress | About section intersection | `1100ms`, transform scale along the desktop horizontal or mobile vertical track | `AboutUs.css`, `.about-us__milestones::before` |
| Region wave drift | Continuous, per region | Two lines per region reusing the hero's `.wave` classes at `opacity:.22`, same `drift` keyframes | `Landing.tsx`, `RegionWaves`; `Landing.css`, `.region-waves` |
| About offering focus | Scroll position while About is in view | `620ms` transform on the offering nearest the viewport center, plus a lit `#071014` surface; all rows stay fully legible | `AboutUs.tsx` and `AboutUs.css`, `.about-us__offering` |

No JavaScript animation library is used; the About offering focus uses a small scroll-position listener to select the offering nearest the viewport center.

The section reveal is a plain cross-fade on purpose. Seven sections each translating up by the same `18px` read as one identical entrance repeated down the page and made the page feel longer than it measured. The About offering focus is the page's one authored motion moment. That focus treatment previously dropped unfocused rows to `opacity:.14`, which failed contrast outright and forced a slow scroll through all four rows to read them; focus is now carried by a lit surface and an accent index instead.
<!-- /GENERATED:motion -->

<!-- GENERATED:responsive source=/document updated=2026-09-03 -->
## Responsive

The primary breakpoint is `700px`, defined in the CSS files for Landing, AboutUs, Education, Projects, Term, Team, Join, Sponsors, and Footer. At this breakpoint navigation links hide, the navigation and logo compact, hero copy and ticker spacing reduce, stats change from three to two columns, About offerings collapse to one column, curriculum and sponsor grids reflow, project cards collapse to one column, term metadata stacks and status pills hide, Join routes stack, and the footer stacks. Team also has an `800px` breakpoint that changes person grids to four columns and reduces art height. Evidence: the `@media` blocks in each section stylesheet.
<!-- /GENERATED:responsive -->

<!-- GENERATED:motion-reduced source=/document updated=2026-09-03 -->
## Reduced Motion

`src/pages/Landing/Landing.tsx` checks `prefers-reduced-motion: reduce` and immediately finishes statistic counting. `src/pages/Landing/Landing.css` sets animation duration to `.01ms`, limits animation iterations, disables smooth scrolling, removes the new page-load/reveal transitions, and leaves all content visible for reduced-motion users. This rule affects the CSS wave and ticker animations as well as motion under the page root.
<!-- /GENERATED:motion-reduced -->

<!-- GENERATED:implementation-guidance source=/document updated=2026-09-03 -->
## Implementation Guidance

- Reuse `Space Grotesk` for display and compact headings and `DM Mono` for labels, metadata, navigation, status text, and supporting copy.
- Continue the near-black surface with controlled blue/teal accents, thin dividers, and restrained gradients; avoid introducing an unrelated palette or a parallel token system without a deliberate refactor.
- Follow the existing page-folder convention: each major page/section has a colocated `.tsx` and `.css` file under `src/pages/<Section>/`; shared UI belongs under `src/components/` and static fallback content under `src/data/`.
- Prefer semantic `section`, `header`, `nav`, `article`, `footer`, `time`, and heading elements as used by the current implementation.
- Preserve the existing `700px` mobile breakpoint and `800px` Team breakpoint unless a responsive change is intentional and verified.
- Keep motion transform/opacity-oriented and preserve the existing reduced-motion behavior.
- Reserve the `↗` glyph for links that leave the site. In-page anchors use an underline or the button surface instead.
- Reach for `--sp-xl`/`--sp-lg`/`--sp-md` and `--gutter` on new sections rather than fresh one-off padding values; pick the tier from how much the section carries.
- Use the `--t-*` type roles and `--radius` rather than raw px. Nothing on the page should sit below `--t-micro`.
- `SectionHeading` owns the heading scale for every section; do not give a section its own heading size.
- Browser-owned surfaces are themed in `Landing.css` and belong to the system: `::selection` (teal wash), a global `:focus-visible` ring, and a thin near-black scrollbar via both `scrollbar-color` and `::-webkit-scrollbar`. Keep new interactive surfaces consistent with them.
- Keep `//` prefixes for asides that read as code comments (`// Your first year`, `// Join QWEB`). Section kickers are plain mono labels, so the device stays a signal rather than decoration.
- Give new sections a `data-inspect` selector so inspect mode continues to describe the page accurately.
- Keep section composition varied while preserving one visual system, use deliberate typography hierarchy and readable line lengths, prefer whitespace and dividers over unnecessary shells, and use semantic React elements.
<!-- /GENERATED:implementation-guidance -->

<!-- GENERATED:open-questions source=/document updated=2026-09-03 -->
## Open Questions

- Spacing, type and radius now have documented token scales. Color remains literal declarations with no shared custom-property token map, and contrast ratios still have not been computed for the lightened greys.
- Contrast ratios were not computed in this documentation pass.
- No screenshot or rendered visual evidence was captured; this document reflects declared source styles.
<!-- /GENERATED:open-questions -->
