# Site restructure: four regions, real content

**Status:** draft, awaiting review
**Date:** 2026-09-02

## Why

The site is one long scroll of six sections that all share a shape: mono kicker, oversized headline ending in a period, supporting paragraph pinned right, grid. It reads as machine-made, and the placeholder content ("Project name", "Co-chair") means nothing on the page is specific to this club.

Meanwhile the previous site at qweb.dev holds real material this one dropped: eleven client projects with screenshots, executives with years, programs, responsibilities and fun facts, a stated curriculum, a five-step process, and a member count. The restructure is mostly a migration of things that already exist, not an invention.

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Information architecture | Four regions: Home, About Us, Education & Projects, Join / Reach Out | Zac's structure. Groups the site by what a visitor wants rather than by content type. |
| Navigation | One page, four anchors (`#home`, `#about`, `#education`, `#join`) | No router dependency, no host rewrite config, no new concept for next year's exec. Anchors still give shareable links. |
| Home scope | Hero, stats, next event, curriculum ticker — then routes onward | Enough that a first-year who never scrolls still gets the pitch; nothing duplicated from other regions. |
| Term events | Live inside Education & Projects | Workshops and tutorials *are* the education. Puts the one recurring reason to revisit on a page that would otherwise be static. |
| Sponsors | Tail of About Us, after the student-facing material | Two audiences on one region: students stop reading before the sponsor block; sponsors scroll to it. |
| Team data | Build the structure, leave the people to Supabase | The 2024 exec is real but stale. Design carries the personality; data stays current. |
| Section headings | Restore the `< Section />` motif from qweb.dev | The club's own device, dropped by the current site. Unmistakably a web development club, and it rhymes with inspect mode. |

## Regions

### `#home`

Hero, intro copy, and CTAs as they are today. Below: the stat row, a single "next up" event line pulled from `term_events`, and the curriculum ticker restored to its original framing — the technologies the club actually teaches, not decoration.

Stats become real numbers. `150+ active members` contradicts qweb.dev's `300+`; one is wrong and Zac resolves it. `8 client sites shipped` should be the real count — the archive holds eleven.

### `#about`

Three movements, student-facing first:

1. **`< About Us />`** — club bio and what the club runs. Source material exists on qweb.dev: student-run, teaches through tutorials, workshops and real practice, members sorted into design teams and given a real customer to consult with, experienced members lead teams of mixed ability, both design and coding.
2. **`< Meet the Team />`** — exec cards carrying name, role, year, program, responsibility, and a fun fact. The fun fact is the point: it is the club's existing voice, and the current site has nothing like it.
3. **`< Our Partners />`** — sponsor-facing tail. Reach, client work shipped, sponsor logos, and a sponsorship CTA.

### `#education`

Three movements, in the order a prospective member asks the questions:

1. **What we teach** — the curriculum (HTML → CSS → JS → Node.js → React) and the five-step process from qweb.dev: Consult → Design → Develop → Test → Deploy.
2. **When it runs** — the existing `Term` component: next event featured, rest of term listed, times and rooms.
3. **What got built** — the eleven client projects with real screenshots, names, descriptions, and live links where they exist.

### `#join`

Contact routes (Discord now, Slack later, email), application links out to forms, and — if the data can be gathered — where graduating members ended up. That last one is the strongest recruiting argument on the site and the least certain to be available.

## Content model

Existing Supabase tables stay: `club_projects`, `team_members`, `term_events`.

Changes needed:

- `team_members` gains `year`, `program`, `responsibility`, `fun_fact`. All nullable — a card renders without them.
- New `sponsors`: name, logo, tier, link.
- New `alumni` if grad destinations go ahead: name, grad year, where they landed. Deferred until the data exists.
- `club_projects` needs a `link` column for live project URLs.

Every section keeps a static fallback so the page never renders empty when Supabase is unreachable, as it does today.

## Visual system

Unchanged: near-black surface, blue/teal accents, Space Grotesk display, DM Mono utility, the 700px breakpoint, transform/opacity motion, and the reduced-motion behaviour.

Changed: `< Section />` headings replace the `//` kickers as the section device. Inspect mode and the subtractions from PR #7 carry forward.

## Needed from Zac

1. Real member count — `150+` or `300+`.
2. Which of the eleven archived projects are still shown, and any newer ones.
3. Application form URLs.
4. Sponsor names and logos, if any are current.
5. Whether grad destination data is gatherable.
6. Instagram and LinkedIn URLs — footer links still point at `#top`.
7. A favicon.

## Order of work

1. `< Section />` motif and the four-region shell — structure only, existing content moved.
2. Projects migration: eleven builds, screenshots, links.
3. Team card structure and the `team_members` columns.
4. Education region: curriculum, process, Term folded in.
5. Join region: contacts and application links.
6. Sponsors tail, once assets exist.
7. Alumni, if the data materialises.

Steps 1–5 need nothing from outside the repo. 6 and 7 are blocked on content.

## Verification

`npm run build` per `AGENTS.md`, plus a driven browser pass per step: every anchor reachable from the nav, each region rendering with Supabase both configured and absent, the 700px breakpoint, and reduced motion. Each step is its own PR, reviewed by another maintainer — no self-merge.

## Open questions

- Does the Education region need a way to submit a project brief, or does that go through the contact route?
- Does the sponsor tail need a rate card, or just a contact CTA?
