# QWEB Design System

<!-- GENERATED:overview source=/document updated=2026-09-03 -->
## Overview

This document describes the single-page Queen's Web Development Club site implemented in `src/main.tsx` and the page folders under `src/pages/` (Landing, AboutUs, Education, Projects, Term, Team, Join, Sponsors, and Footer), based on the CSS and TSX inspected on 2026-09-03. The implementation uses a near-black, mono-led editorial visual system with blue/teal accents and responsive section composition. A separate design-direction document was not found; the visual direction is represented by the implementation evidence below.
<!-- /GENERATED:overview -->

<!-- GENERATED:typography source=/document updated=2026-09-03 -->
## Typography

| Role | Value | Evidence |
| --- | --- | --- |
| Primary/display family | `IBM Plex Sans` | `src/pages/Landing/Landing.css`, `@import` and `:root`; headings and card titles across page CSS |
| Utility/body family | `DM Mono` | `src/pages/Landing/Landing.css`, `@import`; labels, metadata, navigation, body copy, and status text |
| Hero heading scale | `clamp(46px, 6.5vw, 84px)` | `Landing.css`, `h1` |
| Section heading scale | `clamp(34px, 4.3vw, 56px)` for every section | `SectionHeading.css` |
| Membership heading scale | `clamp(35px, 4vw, 54px)` | `Join.css`, `.join-panel h2` |
| Hero heading line height | `.95` | `Landing.css`, `h1` |
| Section heading line height | `.95` to `.98` | `Projects.css`, `.section-heading h2`; `AboutUs.css`, `.about-us h2` |
| Utility tracking | `.04em`–`.18em` | `Landing.css`, hero bar and page CSS labels |
| Weight usage | `400`, `500`, `600`, `700` are imported; display headings use `700`, utility and card headings generally use `400`/`500` | `Landing.css` import, `h1`, and page CSS declarations |

Role tokens are defined on `:root` in `src/pages/Landing/Landing.css` and name the job rather than the value:

| Token | Value | Role |
| --- | --- | --- |
| `--t-micro` | `11px` | Uppercase tracked labels and status pills |
| `--t-meta` | `12px` | Roles, dates, captions, supporting metadata |
| `--t-body` | `14px` | Descriptions and running copy |
| `--t-control` | `14px` | Buttons and navigation |
| `--t-card` | `16px` | Card and list-item titles |
| `--t-lede` | `16px` | Hero intro and section summaries |
| `--t-stat` | `28px` | Prominent facts and counts |

Before these, body copy ran at 8–9px and labels at 7px (one at 6px) — roughly half the ordinary web floor, and punishing as light text on a near-black surface. Muted greys were lightened by roughly one step alongside the size increase, since size and contrast compound on dark. Mobile overrides that re-imposed 7–8px were raised to match.
<!-- /GENERATED:typography -->

<!-- GENERATED:color source=/document updated=2026-09-03 -->
## Color

The hero word ?Development? restores its original `linear-gradient(98deg,#2878ed 16%,#1bd6b0 78%)` clipped to text, with a system text-color fallback in forced-colors mode. A static, low-opacity blue/teal radial wash spans the hero behind the copy and sculpture.

| Use | Value | Defined/used in |
| --- | --- | --- |
| Page background | `#030607` | `Landing.css`, `:root`, `body`, `.page` |
| Primary text | `#e9edf1`, `#eff2f2`, `#edf1f2` | `Landing.css` and section CSS headings |
| Muted utility/body text | `#83919a`, `#74838b`, `#697a83`, `#61737c` | `Landing.css`, `AboutUs.css`, `Term.css` |
| Blue accent | `#267fea`, `#2878ed`, `#2586ee`, `#286bea` | Stats, timeline, project metadata |
| Teal accent | `#19d9ae`, `#1bd6b0`, `#20cbb4`, `#1bd0ae` | Solid CTAs, hero heading, curriculum strip, timeline |
| Green accent | `#36c88e`, `#18a86f` | Wave and team visual treatments |
| Borders/dividers | `#142832`, `#14242b`, `#0d1c22`, and low-opacity white/blue/teal borders | Cards, lists, sections, navigation, footer |
| CTA surface | `#0b1d25` with `#20cbb4` primary action | `Join.css`, `.join-panel` and `.join-button` |

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

September 2026 polish: Team entries without a supplied photo use `/assets/Unknown_Member.jpg` in the same portrait frame as supplied photos. Mobile people grids use two columns and all portraits use a 4:5 ratio. Join uses an open, ruled invitation with rectangular actions using `--radius`, followed by unboxed contact columns (stacked with dividers below 700px). Sponsor statistics use three unboxed columns at both desktop and mobile widths, with `--t-stat` values. These refinements supersede the earlier card descriptions below; typography and the underlying palette are unchanged.

| Component | Purpose | Appearance-relevant surfaces |
| --- | --- | --- |
| `Landing` | Composes the single route, navigation, hero, stationary 3D code icon, animated stats, animated curriculum ticker, and four anchored regions | `src/pages/Landing/Landing.tsx` and `Landing.css` |
| `InspectMode` | Opt-in mode that labels each major section with the selector it is built from; `InspectModeProvider` owns the state, `InspectToggle` is the nav control, `InspectOverlay` draws the outline and tag | `src/components/InspectMode/` |
| `AnimatedStat` | Counts a statistic from zero to its target when visible | `Landing.tsx`; rendered as bordered translucent stat cards |
| `AboutUs` | Presents offerings as a numbered editorial index and first-year milestones as a continuous progress track | `src/pages/AboutUs/AboutUs.tsx` and `AboutUs.css` |
| `SectionHeading` | Owns the JSX-style `< Section />` heading device shared by the major sections | `src/components/SectionHeading/` |
| `Education` | Presents a selectable curriculum index with code examples and the five-step client project process | `src/pages/Education/Education.tsx` and `Education.css` |
| `Projects` | Presents eleven member-built project treatments on a horizontal snap rail, linking out where a live site is known | `src/pages/Projects/Projects.tsx` and `Projects.css` |
| `Term` | Presents the next event as a date-led featured panel, followed by a compact remainder-of-term list | `src/pages/Term/Term.tsx` and `Term.css` |
| `Team` / `Person` | Presents co-chairs and executives with optional personal details. Cards carry no index number — the order is not information | `src/pages/Team/Team.tsx` and `Team.css` |
| `Join` | Presents membership contact routes and honest empty states for unavailable application and graduate data | `src/pages/Join/Join.tsx` and `Join.css` |
| `Sponsors` | Presents reach statistics, sponsor marks, and a sponsor contact route | `src/pages/Sponsors/Sponsors.tsx` and `Sponsors.css` |
| `SiteFooter` | Presents QWEB identity and grouped navigation links | `src/pages/Footer/SiteFooter.tsx` and `SiteFooter.css` |

Section-level components carry a `data-inspect` attribute holding their real selector (for example `section.projects-section`). Region wrappers own the shareable anchors such as `#about` and `#education`; inspect mode reads the nearest annotation on hover, and nothing else depends on it. New sections should set one.

`src/components/` holds cross-cutting UI that is not a page section. Page sections keep the colocated `src/pages/<Section>/` convention.

Projects and sponsor marks now load exclusively from Supabase, ordered by `display_order` with UUID tie-breaking. Loading, error, and empty messages use `--t-body`, a `1.7` line height, and `#93a6af`. Empty projects omit the rail and counter; empty sponsors omit the logo grid. The seeded database preserves the original eleven projects and five sponsors without bundling fallback records into the frontend.
<!-- /GENERATED:components -->

<!-- GENERATED:layout source=/document updated=2026-09-03 -->
## Layout

- The site is a single React route composed by `Landing` in `src/main.tsx`, with four anchored regions: `#home` is the landing frame, `#about` groups About Us, Projects, Team, and Sponsors, `#education` groups Education and Term, and `#join` contains membership routes. Projects also carries its own `#projects` anchor, targeted by the hero's "See our work" action and the footer's Projects link.
- Reading order within `#about` is claim → proof → people → backing: About Us promises a portfolio, Projects is that portfolio, then the team behind it and the partners funding it.
- Major sections use a centered `max-width: 1130px` container with responsive horizontal gutters, except the full-width landing frame and ticker.
- Landing navigation is a flex row; hero copy is left-aligned beside the unframed 3D sculpture, with a shared blue/teal radial wash behind both.
- The curriculum strip below the hero is a flex row: a static `What we teach` label with a right divider, followed by a continuously looping curriculum track. The track pauses on hover/focus and stops under reduced motion. The label is hidden below `700px`.
- Stats use a three-column grid on desktop and two columns below `700px`; the landing-page next-event line has been removed.
- About offerings use four full-width editorial rows with numbered titles, descriptions, and activity artifacts; its milestone track uses four horizontal stages. On mobile, rows reflow around a fixed index and the milestone track becomes vertical.
- Education pairs an open, ruled curriculum index with one code example in a `.85fr / 1.15fr` grid with a `48px` gap. The five native buttons retain the curriculum order and use `aria-pressed`, a teal selected label, and an arrow to identify selection. Each example includes a filename, a short explanation, and wrapping code. At `700px`, the example moves below the compact index with a `28px` gap. Skill names use `clamp(24px,2.5vw,32px)` (24px on mobile), while supporting text and code reuse the existing type tokens. The original section heading, summary, and client-project process remain intact.
- Projects use a horizontal snap rail rather than a grid: fixed-width cards on an `overflow-x` track with `scroll-snap-type:x mandatory`, a hairline meter and an `01 / 11` counter beneath. Eleven cards cost one row instead of four. It is deliberately not a carousel — nothing auto-advances, and there are no dots or arrow controls. The partially-cut card at the right edge plus the meter and counter are the scroll affordances; the track is focusable and labelled for keyboard and assistive technology.
- Term uses a date-led featured event panel with time/place metadata, followed by a four-column remainder list; mobile stacks featured metadata and hides list status pills.
- Team places the co-chair and executive groups side by side in a `2fr / 4fr` grid (`.team-people`) so the row fills the 1130px container; the groups stack below `700px`. Join uses a two-sided flex composition plus three route cards that stack on mobile. Sponsors use a five-column logo grid that becomes two columns on mobile.
- Footer uses a two-column grid on desktop: brand on the left, navigation groups in the right half; it stacks below `700px`.
- No rule separates sections. Spacing tiers keep the page reading as one document. Rules survive only *inside* a section, where they carry structure: the About offering rows, the About journey and Education process tracks (whose progress fill rides on the rule itself), and the Term event list.
- A single full-page animated wave field carries the six-color line language behind the document at low opacity. Regions stay on the same plain surface; the fixed `.noise` grain spans the full document.
<!-- /GENERATED:layout -->

<!-- GENERATED:motion source=/document updated=2026-09-03 -->
## Motion

September 2026 3D hero: `Landing/CodeSculpture.tsx` and its colocated CSS render a stationary, extruded `< />` icon. Each bracket and the slash use a single continuous SVG polygon for the front and back surfaces, joined by CSS side faces with 28px depth. This avoids visible rectangular bar seams at the bracket elbows. Dark translucent teal/blue fills and thin luminous outlines restore the original cube's glass-like finish. The mark has a fixed -12-degree X / -18-degree Y perspective, with two static orbital outlines. Its zero-size scene is explicitly centered at 50% / 50% inside a positioned, clipped stage. The mark and rings remain stationary except when the native Explode/Assemble button is activated. Explode moves the brackets 24px outward with opposing 8px vertical and 20px depth offsets, and brings the slash 64px forward. Transform transitions take 900ms and reverse on Assemble; reduced motion changes the positions instantly. There is no automatic rotation, pointer tilt, or animation loop.

The hero now uses a `1.25fr / 1fr` grid with a 36px gap; statistics occupy a full-width row in normal flow so they cannot overlap the content on short screens. Below 700px, the sculpture follows the copy in a single column. Its stage is 420px high on desktop and 340px on mobile, with the 3D object scaled to 1.15 on wide screens, .9 between 701px and 1100px, and .85 on mobile (.72 at widths up to 400px). The sculpture is unframed: no standalone headings, captions, floor grid, or divider; a centered Explode/Assemble button sits beneath the icon, exposes its pressed state, and retains the global keyboard focus ring. The sculpture uses existing DM Mono type roles, blue/teal colors, and radius tokens. Decorative geometry is hidden from assistive technology; the enclosing aside supplies a descriptive label. The full-page background waves remain intact.

Vertical wheel scrolling over the project rail moves through projects horizontally. Card snapping stays disabled after wheel input so pauses between slow wheel movements do not shift the cards. A pointer press or keyboard input restores snapping for direct interaction. At either end, outward scrolling resumes normal page scrolling; horizontal trackpad input, keyboard navigation, and zoom gestures retain their native behavior.

| Motion | Trigger | Timing/technique | Evidence |
| --- | --- | --- | --- |
| Animated statistics | Intersection with stat card | `requestAnimationFrame`, `1100ms`, cubic easing `1 - (1 - progress) ** 3` | `Landing.tsx`, `AnimatedStat` |
| Curriculum ticker | Continuous page load loop | CSS keyframes, `23s linear`, transform-based marquee; pauses on hover/focus and is disabled for reduced motion | `Landing.tsx` and `Landing.css`, `.bar-track` |
| Rainbow wave drift | Continuous page background and regional atmosphere | CSS keyframes, `8s`–`23s`, `ease-in-out`, alternating directions; the full-page field is softer than the hero treatment | `Landing.tsx`, `SiteWaves`; `Landing.css`, `@keyframes drift` and `.wave-*` |
| Link hover | Pointer hover | Color change; no duration specified | `Landing.css`, `nav a:hover`, footer link selectors |
| Page-load entrance | Initial mount | `560ms`, opacity/translateY, staggered by `90ms`/`170ms` | `Landing.tsx` and `Landing.css`, `.page-load` |
| Section/card reveal | Intersection with section or card | `400ms` opacity cross-fade; content choreography is staged by section | `Landing.tsx` and `Landing.css`, `.reveal-on-scroll` |
| Scroll content choreography | Section enters the viewport | `300ms`–`520ms` opacity/transform transitions, with `50ms`–`360ms` stagger caps | Local section styles for About, Education, Projects, Term, Team, Sponsors, and Join |
| About journey progress | Each milestone becomes 35% visible, once | Each connector draws over 800ms; desktop milestones stagger at 0/800/1600/2400ms. The line forms a continuous blue-to-teal gradient (#287fea ? #2598d8 ? #23b2c6 ? #20cbb4), with matching milestone markers and month labels; headings rise 6px into place. Gradient direction follows the horizontal desktop or vertical mobile track. Below 700px each vertical segment starts independently with no delay. Reduced motion shows completed lines immediately; text always stays visible. | `AboutUs.tsx`, journey observer; `AboutUs.css`, milestone `li::before` |
| Client project timeline | Half of the process block enters the viewport, once | `4800ms` linear horizontal track fill; five labels highlight teal over `180ms`, staggered by `960ms` to match each fifth of the bar. Reduced motion shows the full bar and highlighted labels immediately | `Education.tsx` and `Education.css`, `.education__process` |
| About offering focus | Scroll position while About is in view | `620ms` transform on the offering nearest the viewport center, plus a lit `#071014` surface; all rows stay fully legible | `AboutUs.tsx` and `AboutUs.css`, `.about-us__offering` |
| Curriculum example change | Explicit button selection | `180ms` opacity entrance; selection colors and arrow opacity transition over `160ms`. All are limited to `prefers-reduced-motion: no-preference`; selection never moves focus or auto-advances | `Education.tsx` and `Education.css` |

No JavaScript animation library is used. Landing owns one `IntersectionObserver` for once-only section entry, while the About offering focus uses a small scroll-position listener to select the offering nearest the viewport center. The new local sequences keep motion meaningful to the content: offerings and curriculum arrive in order, timelines draw along their existing tracks, project cards enter as a rail, event rows follow the featured event, and the Join panel lands before its route options.

The section container remains a plain cross-fade so a section never moves as a whole and the page keeps its editorial steadiness. The authored moments are the scroll relationships inside each section: ordered content uses a short capped stagger, and the About offering focus still carries the strongest interaction by lighting the row nearest the viewport center. Every new sequence uses transform/opacity only, with the existing progress lines reserved for the two curriculum journeys.
<!-- /GENERATED:motion -->

<!-- GENERATED:responsive source=/document updated=2026-09-03 -->
## Responsive

The primary breakpoint is `700px`, defined in the CSS files for Landing, AboutUs, Education, Projects, Term, Team, Join, Sponsors, and Footer. At this breakpoint navigation links hide, the navigation and logo compact, hero copy and ticker spacing reduce, stats change from three to two columns, About offerings collapse to one column, curriculum and sponsor grids reflow, project cards collapse to one column, term metadata stacks and status pills hide, Join routes stack, and the footer stacks. Team also has an `800px` breakpoint that changes person grids to four columns and reduces art height. Evidence: the `@media` blocks in each section stylesheet.
<!-- /GENERATED:responsive -->

<!-- GENERATED:motion-reduced source=/document updated=2026-09-03 -->
## Reduced Motion

`src/pages/Landing/Landing.tsx` checks `prefers-reduced-motion: reduce` and immediately finishes statistic counting. `src/pages/Landing/Landing.css` sets animation duration to `.01ms`, limits animation iterations, disables smooth scrolling, removes the page-load/reveal transitions, and leaves all content visible. Section-specific scroll choreography is additionally wrapped in `prefers-reduced-motion: no-preference`, so curriculum cards, project cards, event rows, people, sponsor marks, and Join routes never start hidden for reduced-motion users.
<!-- /GENERATED:motion-reduced -->

<!-- GENERATED:implementation-guidance source=/document updated=2026-09-03 -->
## Implementation Guidance

- Reuse `IBM Plex Sans` for display and compact headings and `DM Mono` for labels, metadata, navigation, status text, and supporting copy.
- Continue the near-black surface with controlled blue/teal accents, thin dividers, and solid surfaces; avoid introducing an unrelated palette or a parallel token system without a deliberate refactor.
- Follow the existing page-folder convention: each major page/section has a colocated `.tsx` and `.css` file under `src/pages/<Section>/`; shared UI belongs under `src/components/` and static fallback content under `src/data/`.
- Prefer semantic `section`, `header`, `nav`, `article`, `footer`, `time`, and heading elements as used by the current implementation.
- Preserve the existing `700px` mobile breakpoint and `800px` Team breakpoint unless a responsive change is intentional and verified.
- Keep motion transform/opacity-oriented and preserve the existing reduced-motion behavior.
- Reserve the `↗` glyph for links that leave the site. In-page anchors use an underline or the button surface instead.
- Reach for `--sp-xl`/`--sp-lg`/`--sp-md` and `--gutter` on new sections rather than fresh one-off padding values; pick the tier from how much the section carries.
- Use the `--t-*` type roles and `--radius` rather than raw px. Nothing on the page should sit below `--t-micro`.
- `SectionHeading` owns the heading scale for every section; do not give a section its own heading size.
- Browser-owned surfaces are themed in `Landing.css` and belong to the system: `::selection` (teal wash), a global `:focus-visible` ring, and a thin near-black scrollbar via both `scrollbar-color` and `::-webkit-scrollbar`. Keep new interactive surfaces consistent with them.
- Keep `//` prefixes for asides that read as code comments (`// Your first year`, `// How a client project runs`). Local section labels are plain mono text, so the device stays a signal rather than decoration.
- Give new sections a `data-inspect` selector so inspect mode continues to describe the page accurately.
- Keep section composition varied while preserving one visual system, use deliberate typography hierarchy and readable line lengths, prefer whitespace and dividers over unnecessary shells, and use semantic React elements.
<!-- /GENERATED:implementation-guidance -->

<!-- GENERATED:open-questions source=/document updated=2026-09-03 -->
## Open Questions

- Spacing, type and radius now have documented token scales. Color remains literal declarations with no shared custom-property token map, and contrast ratios still have not been computed for the lightened greys.
- Contrast ratios were not computed in this documentation pass.
- No screenshot or rendered visual evidence was captured; this document reflects declared source styles.
<!-- /GENERATED:open-questions -->
