# QWEB Site Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the single-scroll site into four anchored regions — Home, About Us, Education & Projects, Join / Reach Out — carrying across the real content that still lives on qweb.dev and in the 2024 repo.

**Architecture:** One React route, four anchored regions, nav scrolling between them. No router. Pure logic moves out of components into `src/lib/` modules so it can be unit-tested; components keep rendering. Every data-backed region reads Supabase with a static fallback, exactly as the current sections do.

**Tech Stack:** React 19, Vite 8, Supabase JS, plain CSS (one stylesheet per section, colocated). Vitest for logic tests — added by Task 1.

**Spec:** `docs/specs/2026-09-02-site-restructure.md`

## Global Constraints

- Follow `AGENTS.md`: focused branch and PR per task, never self-merge, ask before changing routes, public APIs, dependencies, or deployment config.
- Every task ends with `npm run build` passing and `npm run test` passing (from Task 1 onward).
- Preserve the near-black surface `#030607`, blue `#267fea` / teal `#19d9ae` accents, Space Grotesk display, DM Mono utility.
- Preserve the `700px` breakpoint and the Team `800px` breakpoint.
- Motion stays transform/opacity only, and the `prefers-reduced-motion` block in `Landing.css` keeps working.
- Every section carries `data-inspect="<real selector>"` so inspect mode keeps describing the page accurately.
- Placeholder policy: unfinished content renders as visibly unfinished. No invented names, logos, numbers, or links.
- Assets come from `~/Projects/Extras/qweb-main-2024` (the 2024 repo). Never fabricate a replacement for an asset you cannot find — stop and ask.

**Region anchors:** `#home` · `#about` · `#education` · `#join`

---

### Task 1: Vitest, and pure logic extracted from Term

The date and status logic in `Term.tsx` calls `new Date()` directly, so it cannot be tested and silently changes behaviour with the calendar. Move it into a module that takes the current day as an argument.

**Files:**
- Modify: `package.json` (add `vitest`, add `test` script)
- Create: `src/lib/events.ts`
- Create: `src/lib/events.test.ts`
- Create: `src/lib/team.ts`
- Create: `src/lib/team.test.ts`
- Modify: `src/pages/Term/Term.tsx:15-37` (delete the moved functions, import them)
- Modify: `src/pages/Team/Team.tsx:28-29` (use the split helper)

**Interfaces:**
- Consumes: `TermEvent`, `TeamMember` from `src/lib/content.ts`
- Produces:
  - `todayKey(today?: Date): string` — `"YYYY-MM-DD"`
  - `findNextEvent(events: TermEvent[], today?: string): TermEvent | null`
  - `getEventStatus(event: TermEvent, nextEventId: string | null, today?: string): 'finished' | 'next' | 'soon'`
  - `formatEventDate(date: string): string` — `"SEP 12"`
  - `formatEventMonth(date: string): string` — `"SEP"`
  - `formatEventDay(date: string): string` — `"12"`
  - `splitTeam(members: T[]): { chairs: T[]; executives: T[] }` where `T extends { role: string }`

- [ ] **Step 1: Install Vitest and add the script**

```bash
npm install --save-dev vitest
```

Then in `package.json`, add to `scripts`:

```json
"test": "vitest run"
```

No config file is needed — these are pure functions, so Vitest's default Node environment is correct.

- [ ] **Step 2: Write the failing tests**

Create `src/lib/events.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { findNextEvent, formatEventDate, formatEventDay, formatEventMonth, getEventStatus, todayKey } from './events';
import type { TermEvent } from './content';

const event = (id: string, event_date: string): TermEvent => ({ id, event_name: id, description: '', event_date });
const term = [event('past', '2026-09-01'), event('next', '2026-09-12'), event('later', '2026-10-17')];

describe('todayKey', () => {
  it('formats a date as YYYY-MM-DD with padding', () => {
    expect(todayKey(new Date(2026, 8, 2))).toBe('2026-09-02');
  });
});

describe('findNextEvent', () => {
  it('picks the earliest event that has not passed', () => {
    expect(findNextEvent(term, '2026-09-02')?.id).toBe('next');
  });

  it('treats an event happening today as still upcoming', () => {
    expect(findNextEvent(term, '2026-09-12')?.id).toBe('next');
  });

  it('returns null once the term is over', () => {
    expect(findNextEvent(term, '2026-12-01')).toBeNull();
  });

  it('returns null for an empty schedule', () => {
    expect(findNextEvent([], '2026-09-02')).toBeNull();
  });
});

describe('getEventStatus', () => {
  it('marks a past event finished', () => {
    expect(getEventStatus(term[0], 'next', '2026-09-02')).toBe('finished');
  });

  it('marks the next event next', () => {
    expect(getEventStatus(term[1], 'next', '2026-09-02')).toBe('next');
  });

  it('marks a later event soon', () => {
    expect(getEventStatus(term[2], 'next', '2026-09-02')).toBe('soon');
  });
});

describe('formatters', () => {
  it('formats a full date label', () => {
    expect(formatEventDate('2026-09-12')).toBe('SEP 12');
  });

  it('formats month and day separately', () => {
    expect(formatEventMonth('2026-09-12')).toBe('SEP');
    expect(formatEventDay('2026-09-12')).toBe('12');
  });

  it('does not shift the day across a timezone boundary', () => {
    expect(formatEventDay('2026-01-01')).toBe('01');
  });
});
```

Create `src/lib/team.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { splitTeam } from './team';

const members = [
  { id: '1', role: 'Co-Chair' },
  { id: '2', role: 'Development' },
  { id: '3', role: 'Co-Chair' },
  { id: '4', role: 'Design' },
];

describe('splitTeam', () => {
  it('separates co-chairs from executives', () => {
    const { chairs, executives } = splitTeam(members);
    expect(chairs.map((m) => m.id)).toEqual(['1', '3']);
    expect(executives.map((m) => m.id)).toEqual(['2', '4']);
  });

  it('preserves the incoming order within each group', () => {
    const { executives } = splitTeam(members);
    expect(executives[0].id).toBe('2');
  });

  it('handles an empty roster', () => {
    expect(splitTeam([])).toEqual({ chairs: [], executives: [] });
  });
});
```

- [ ] **Step 3: Run the tests and watch them fail**

Run: `npm run test`
Expected: FAIL — `Failed to resolve import "./events"` and `"./team"`.

- [ ] **Step 4: Write the modules**

Create `src/lib/events.ts` by moving the functions out of `Term.tsx`, adding the injectable day:

```ts
import type { TermEvent } from './content';

export type EventStatus = 'finished' | 'next' | 'soon';

export function todayKey(today = new Date()) {
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

export function findNextEvent(events: TermEvent[], today = todayKey()) {
  return events.find((event) => event.event_date >= today) ?? null;
}

export function getEventStatus(event: TermEvent, nextEventId: string | null, today = todayKey()): EventStatus {
  if (event.event_date < today) return 'finished';
  return event.id === nextEventId ? 'next' : 'soon';
}

// Parsing with an explicit midnight keeps the day from shifting west of UTC.
const asDate = (date: string) => new Date(`${date}T00:00:00`);
const format = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-CA', options).format(asDate(date));

export function formatEventDate(date: string) {
  return format(date, { month: 'short', day: '2-digit' }).toUpperCase();
}

export function formatEventMonth(date: string) {
  return format(date, { month: 'short' }).toUpperCase();
}

export function formatEventDay(date: string) {
  return format(date, { day: '2-digit' });
}
```

Create `src/lib/team.ts`:

```ts
export function splitTeam<T extends { role: string }>(members: T[]) {
  return {
    chairs: members.filter((member) => member.role === 'Co-Chair'),
    executives: members.filter((member) => member.role !== 'Co-Chair'),
  };
}
```

- [ ] **Step 5: Run the tests and watch them pass**

Run: `npm run test`
Expected: PASS, 12 tests.

- [ ] **Step 6: Point the components at the modules**

In `Term.tsx`, delete `todayKey`, `getEventStatus`, `formatEventDate`, `formatEventMonth`, `formatEventDay` and the `EventStatus` type, then import them from `../../lib/events`. Replace the inline next-event lookup with `findNextEvent(events)`.

In `Team.tsx`, replace the two `filter` calls with `const { chairs, executives } = splitTeam(members);` imported from `../../lib/team`.

- [ ] **Step 7: Verify nothing moved on screen**

Run: `npm run build` — expect success.
Run the dev server and confirm the events section still shows the same featured event and list, and the team still splits into co-chairs and executives.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json src/lib src/pages/Term/Term.tsx src/pages/Team/Team.tsx
git commit -m "Extract term and team logic into tested modules"
```

---

### Task 2: The `< Section />` motif and the four-region shell

Restore the club's own heading device from qweb.dev and regroup the existing sections into four anchored regions. Content does not change in this task — only where it sits and how it is headed.

**Files:**
- Create: `src/components/SectionHeading/SectionHeading.tsx`
- Create: `src/components/SectionHeading/SectionHeading.css`
- Create: `src/components/SectionHeading/index.ts`
- Modify: `src/pages/Landing/Landing.tsx` (nav links, region wrappers)
- Modify: `src/pages/Landing/Landing.css` (region rhythm)
- Modify: `src/pages/AboutUs/AboutUs.tsx`, `src/pages/Projects/Projects.tsx`, `src/pages/Term/Term.tsx`, `src/pages/Team/Team.tsx` (swap kickers for the motif)

**Interfaces:**
- Produces: `<SectionHeading tag="About Us" title="..." summary?={ReactNode} id?={string} />` rendering `< About Us />` above the title.

- [ ] **Step 1: Build the heading component**

Create `src/components/SectionHeading/SectionHeading.tsx`:

```tsx
import type { ReactNode } from 'react';
import './SectionHeading.css';

/**
 * The club's own section device, carried over from qweb.dev: a JSX-style tag
 * above the heading. The angle brackets are decorative, so they are hidden
 * from assistive tech and the tag name is read as ordinary text.
 */
export function SectionHeading({ tag, title, summary, id }: { tag: string; title: ReactNode; summary?: ReactNode; id?: string }) {
  return <div className="section-heading">
    <div>
      <p className="section-tag"><span aria-hidden="true">&lt;</span>{tag}<span aria-hidden="true">/&gt;</span></p>
      <h2 id={id}>{title}</h2>
    </div>
    {summary && <p className="section-summary">{summary}</p>}
  </div>;
}
```

Create `src/components/SectionHeading/index.ts`:

```ts
export { SectionHeading } from './SectionHeading';
```

- [ ] **Step 2: Style it against the existing scale**

Create `src/components/SectionHeading/SectionHeading.css`. Reuse the values already in `Projects.css` so the heading rhythm does not shift:

```css
.section-heading { display:flex; justify-content:space-between; align-items:flex-end; gap:32px; margin-bottom:28px; }
.section-tag { margin:0; color:#6c858d; font:9px 'DM Mono',monospace; letter-spacing:.14em; text-transform:uppercase; }
.section-tag span { color:#2586ee; padding:0 4px; }
.section-heading h2 { margin:12px 0 0; color:#edf1f2; font-size:clamp(34px,4.3vw,56px); line-height:.95; letter-spacing:-.065em; }
.section-summary { max-width:290px; margin:0; color:#74838b; font:10px/1.7 'DM Mono',monospace; }
@media (max-width:700px) { .section-heading { flex-direction:column; align-items:flex-start; gap:14px; } }
```

Then delete the now-duplicated `.section-heading`, `.section-kicker`, and `.team-summary` rules from `Projects.css` and `Team.css`.

- [ ] **Step 3: Swap every section over**

Replace each section's heading block with the component. Four call sites:

```tsx
<SectionHeading tag="About Us" id="about-title" title={<>Four nights a month that<br /><span>turn into a portfolio.</span></>} summary="Everything we run is hands-on. You leave every session with something on your screen that wasn’t there when you walked in." />
<SectionHeading tag="Projects" id="projects-title" title="Live in the wild." />
<SectionHeading tag="Our Events" id="term-title" title="This term at QWEB." />
<SectionHeading tag="Meet the Team" id="team-title" title="Made by students." summary="The people behind the builds, the workshops, and the group chat that keeps it moving." />
```

Keep `// Your first year` and `// Join QWEB` as they are — those read as genuine asides, not section headings.

- [ ] **Step 4: Group the sections into regions**

In `Landing.tsx`, wrap the existing components so the anchors land on regions rather than individual sections:

```tsx
<section className="region" id="about" data-inspect="section.region#about"><AboutUs /><Team /></section>
<section className="region" id="education" data-inspect="section.region#education"><Term /><Projects /></section>
<section className="region" id="join" data-inspect="section.region#join"><JoinPanel /></section>
```

`JoinPanel` does not exist yet — for this task, leave the join panel where it is inside `Team.tsx` and omit the `#join` region wrapper. Task 6 extracts it. Remove the now-duplicated `id="about"`, `id="projects"`, `id="events"`, `id="team"` from the inner sections, since the regions own the anchors.

Update the nav to the three regions plus the CTA:

```tsx
<nav><a href="#about">About</a><a href="#education">Education &amp; Projects</a><a href="#join">Join</a></nav>
```

- [ ] **Step 5: Verify**

Run: `npm run test` and `npm run build` — both pass.
In the browser: each nav link scrolls to its region; every section heading shows as `< Tag />`; inspect mode labels the new region wrappers; check 700px.

- [ ] **Step 6: Commit**

```bash
git add src/components/SectionHeading src/pages
git commit -m "Restore the < Section /> motif and group sections into regions"
```

---

### Task 3: Migrate the eleven client projects

Replace the three gradient placeholders with the club's real work.

**Files:**
- Create: `public/projects/*` (copied assets)
- Create: `src/data/projects.ts`
- Modify: `src/lib/content.ts` (add `link` to `ClubProject`)
- Modify: `src/pages/Projects/Projects.tsx`, `src/pages/Projects/Projects.css`
- Create: `supabase/migrations/20260902000004_add_link_to_club_projects.sql`

**Interfaces:**
- Consumes: `ClubProject` from `src/lib/content.ts`
- Produces: `fallbackProjects: ClubProject[]` exported from `src/data/projects.ts`

- [ ] **Step 1: Copy the screenshots**

```bash
cp ~/Projects/Extras/qweb-main-2024/public/projects/* public/projects/
```

Eleven files. Two are large — `qvsa.png` at 9.4MB and `gods-blood.png` at 4.3MB. Check their dimensions and re-export both to a maximum width of 1200px before committing; do not commit multi-megabyte screenshots.

- [ ] **Step 2: Write the project data**

Create `src/data/projects.ts` with all eleven entries, copied verbatim from `~/Projects/Extras/qweb-main-2024/src/Components/Past-Projects/constants.js`. The first three, exactly:

```ts
import type { ClubProject } from '../lib/content';

export const fallbackProjects: ClubProject[] = [
  { id: 'biotech-leadership', name: 'Biotech Leadership Consulting', photo: '/projects/biotech-leadership.PNG', description: 'Website designed for a company providing leadership consulting on pharmaceutical projects.', link: null },
  { id: 'qflip', name: "Queen's Feminist Leadership in Politics", photo: '/projects/qflip.jpg', description: 'Website designed for QFLIP, a Queen\'s club focused on empowering women in the political realm.', link: 'https://qflip.ca/' },
  { id: 'stooleys', name: "Stooley's Pub", photo: '/projects/stooleys.png', description: 'Website designed for local Kingston club allowing customers to view their menu and place orders.', link: null },
  // ...continue with mystic-welcome, safe-dentistry, torus_home, sci-formal-logger,
  // fiscal-fresh, van-the-man, qvsa, gods-blood — copy names and descriptions verbatim.
];
```

Note: `constants.js` has `link: "null"` as a string on one entry. That is a bug in the old data — write a real `null`.

- [ ] **Step 3: Add `link` to the type and the database**

In `src/lib/content.ts`, add `link: string | null` to `ClubProject` and to the `select` in `getProjects`.

Create `supabase/migrations/20260902000004_add_link_to_club_projects.sql`:

```sql
alter table club_projects add column if not exists link text;
```

- [ ] **Step 4: Render real screenshots**

In `Projects.tsx`, import `fallbackProjects` from `../../data/projects` and delete the local placeholder array. Wrap a card in an anchor when `project.link` exists:

```tsx
{projects.map((project, index) => {
  const card = <>
    <div className="project-art">{project.photo ? <img src={project.photo} alt="" loading="lazy" /> : <span className="project-art__empty" aria-hidden="true" />}<span className="project-index">{String(index + 1).padStart(2, '0')}</span></div>
    <div className="project-meta"><div><h3>{project.name}</h3><p>{project.description}</p></div>{project.link && <span className="project-visit">Visit ↗</span>}</div>
  </>;
  return project.link
    ? <a className="project-card" key={project.id} href={project.link} target="_blank" rel="noreferrer" data-inspect="a.project-card">{card}</a>
    : <article className="project-card" key={project.id} data-inspect="article.project-card">{card}</article>;
})}
```

In `Projects.css`: keep the gradient as the empty state only (`.project-art__empty`), give `.project-art img` `object-fit:cover`, and **delete `.project-card:not(:first-child){display:none}` from the 700px block** — with eleven real projects, hiding ten on mobile is indefensible. Let the grid go to one column and scroll.

- [ ] **Step 5: Verify**

Run: `npm run test`, `npm run build`.
In the browser: eleven cards with real screenshots, the QFLIP card opens qflip.ca in a new tab, and mobile shows all eleven stacked.

- [ ] **Step 6: Commit**

```bash
git add public/projects src/data/projects.ts src/lib/content.ts src/pages/Projects supabase/migrations
git commit -m "Migrate the eleven client projects with real screenshots"
```

---

### Task 4: The About region — club bio and team cards that carry a person

Give the exec cards the shape the 2024 site had — year, program, responsibility, fun fact — without hardcoding last year's people, and restore the club bio the current site never had.

**Files:**
- Modify: `src/lib/content.ts` (extend `TeamMember`)
- Create: `supabase/migrations/20260902000005_add_person_details_to_team_members.sql`
- Modify: `src/pages/Team/Team.tsx`, `src/pages/Team/Team.css`
- Modify: `src/pages/AboutUs/AboutUs.tsx` (club bio)

**Interfaces:**
- Produces: `TeamMember` gains `year: string | null`, `program: string | null`, `responsibility: string | null`, `fun_fact: string | null`

- [ ] **Step 1: Extend the type and the table**

In `src/lib/content.ts`, add the four nullable fields to `TeamMember` and to the `select` in `getTeamMembers`.

```sql
-- supabase/migrations/20260902000005_add_person_details_to_team_members.sql
alter table team_members add column if not exists year text;
alter table team_members add column if not exists program text;
alter table team_members add column if not exists responsibility text;
alter table team_members add column if not exists fun_fact text;
```

- [ ] **Step 2: Render the detail, degrade without it**

Every field is nullable, so a card must render correctly with none of them. In `Person`:

```tsx
<article className="person" data-inspect="article.person">
  <div className="person-art">{person.photo ? <img src={person.photo} alt="" loading="lazy" /> : null}</div>
  <h3>{person.name}</h3>
  <p className="person-role">{person.role}{person.year ? ` · ${person.year}` : ''}{person.program ? ` · ${person.program}` : ''}</p>
  {person.responsibility && <p className="person-responsibility">{person.responsibility}</p>}
  {person.fun_fact && <p className="person-fact"><span aria-hidden="true">✦</span>{person.fun_fact}</p>}
</article>
```

Style `.person-fact` as the warmest thing on the page — it is the club's voice, so let it read as a human aside rather than metadata.

- [ ] **Step 3: Keep the fallback honest**

The static fallback keeps role-only entries (`Co-chair`, `Development`) with all four details `null`, so an unconfigured build shows the structure without inventing people.

- [ ] **Step 4: Add the club bio**

The About region opens with offerings but never says what the club *is*. Add a bio paragraph above the offerings, built from qweb.dev's own description — student-run, teaches through tutorials, workshops and real practice, members sorted into design teams and given a real customer to consult with, experienced members leading teams of mixed ability, design as well as code.

Write it in the site's existing voice rather than pasting the 2024 sentences verbatim — that copy has grammar breaks ("For local businesses and clubs." as its own fragment). Keep the facts, fix the prose. Every claim must trace to something qweb.dev says.

- [ ] **Step 5: Verify**

Run: `npm run test`, `npm run build`.
Check both states: with Supabase unset (roles only, no detail lines, no layout collapse) and with a locally seeded row carrying all four fields.

- [ ] **Step 6: Commit**

```bash
git add src/lib/content.ts src/pages/Team src/pages/AboutUs supabase/migrations
git commit -m "Add the club bio and give team cards their human detail"
```

---

### Task 5: The Education region

Add the two halves the site is missing — what the club teaches and how it works — around the schedule that already exists.

**Files:**
- Create: `src/pages/Education/Education.tsx`, `src/pages/Education/Education.css`
- Modify: `src/pages/Landing/Landing.tsx` (compose `Education` into the `#education` region)

**Interfaces:**
- Produces: `<Education />` rendering the curriculum and process; `Term` and `Projects` sit beside it in the region.

- [ ] **Step 1: Write the content, verbatim from qweb.dev**

```tsx
const curriculum = ['HTML', 'CSS', 'JavaScript', 'Node.js', 'React'];
const process = ['Consult', 'Design', 'Develop', 'Test', 'Deploy'];
```

The framing line from qweb.dev: *"Want more skills to present on your resume? We got these (and more!) covered in our curriculum."*

- [ ] **Step 2: Build the section**

Render two blocks under one `SectionHeading tag="Education"`:

```tsx
export function Education() {
  return <section className="education reveal-on-scroll" aria-labelledby="education-title" data-inspect="section.education">
    <SectionHeading tag="Education" id="education-title" title="What you'll actually learn." summary="Want more skills to present on your resume? We cover these — and more — in our curriculum." />
    <ol className="education__curriculum">
      {curriculum.map((skill, index) => <li key={skill} data-inspect="li.education__skill"><span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>{skill}</li>)}
    </ol>
    <div className="education__process">
      <p className="education__process-label">// How a client project runs</p>
      <ol className="education__steps">{process.map((step) => <li key={step}>{step}</li>)}</ol>
    </div>
  </section>;
}
```

Style the process as a horizontal track on desktop, vertical below 700px. Reuse the milestone track pattern already in `AboutUs.css` (`.about-us__milestones`) — do not invent a second timeline treatment.

- [ ] **Step 3: Compose the region in order**

In `Landing.tsx`, the `#education` region reads: `<Education />` (what we teach) → `<Term />` (when it runs) → `<Projects />` (what got built).

- [ ] **Step 4: Restore the ticker's curriculum framing**

PR #7 retargeted the hero ticker from the club's curriculum to this site's own stack, on the mistaken read that it was generic filler. It was carrying the curriculum from qweb.dev. Point it back at what the club teaches, and reuse the same list so the two never drift:

```tsx
import { curriculum } from '../Education/Education';
// label becomes "What we teach"; entries become the curriculum array, uppercased.
```

Export `curriculum` from `Education.tsx` for this. The ticker and the Education region must read from one array.

- [ ] **Step 4: Verify**

Run: `npm run test`, `npm run build`. Check the region reads as one argument top to bottom, and the process track collapses correctly at 700px.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Education src/pages/Landing
git commit -m "Add the Education region: curriculum and process"
```

---

### Task 6: The Join / Reach Out region

Extract the join panel out of `Team`, and give it the contact routes, the application links, and the grad destinations placeholder.

**Files:**
- Create: `src/pages/Join/Join.tsx`, `src/pages/Join/Join.css`
- Modify: `src/pages/Team/Team.tsx` (remove the join panel)
- Modify: `src/pages/Landing/Landing.tsx` (add the `#join` region)
- Modify: `src/pages/Footer/SiteFooter.tsx` (real social URLs)

**Interfaces:**
- Produces: `<Join />`

- [ ] **Step 1: Move the panel**

Cut the `.join-panel` block from `Team.tsx` into the new `Join` component, along with its CSS from `Team.css`. Behaviour does not change in this step.

- [ ] **Step 2: Add the contact routes**

Three routes, all real: the Discord invite already in this repo, `mailto:qweb@queensu.ca`, and Slack marked as coming later — rendered as plain text, not a dead link.

- [ ] **Step 3: Add applications as an honest placeholder**

No form URLs exist yet. Render a disabled control, not a link to nowhere:

```tsx
<p className="join-applications" aria-live="polite">
  <span className="join-applications__label">Developer applications</span>
  <span className="join-applications__state">Opening for 2026–27 — check back or ask on Discord</span>
</p>
```

When the URLs arrive this becomes an anchor. Do not ship a button that goes nowhere.

- [ ] **Step 4: Add the grad destinations empty state**

The data is gatherable but not gathered. Render a described empty state — a short line saying where members have gone after QWEB will be listed here — rather than invented alumni. Keep it to one block so it is trivial to fill later.

- [ ] **Step 5: Fix the footer socials**

Replace the four `#top` placeholders with the real URLs from the 2024 repo:

```tsx
<a href="https://www.instagram.com/qweb_club/" target="_blank" rel="noreferrer">Instagram</a>
<a href="https://github.com/queens-web-development-club" target="_blank" rel="noreferrer">GitHub</a>
<a href="https://discord.gg/3Zpw49BVrh" target="_blank" rel="noreferrer">Discord</a>
<a href="https://www.linkedin.com/company/qweb-queens-university-website-development/" target="_blank" rel="noreferrer">LinkedIn</a>
```

Use this repo's Discord invite, not the 2024 one — they differ.

- [ ] **Step 6: Verify**

Run: `npm run test`, `npm run build`. Click every external link and confirm it resolves. Confirm no control looks clickable unless it goes somewhere.

- [ ] **Step 7: Commit**

```bash
git add src/pages/Join src/pages/Team src/pages/Landing src/pages/Footer
git commit -m "Add the Join region with real contact routes"
```

---

### Task 7: The sponsor tail

Close About Us with the sponsor-facing block.

**Files:**
- Create: `public/sponsors/*` (five logos)
- Create: `src/data/sponsors.ts`
- Create: `src/pages/Sponsors/Sponsors.tsx`, `src/pages/Sponsors/Sponsors.css`
- Modify: `src/pages/Landing/Landing.tsx` (append to the `#about` region)

**Interfaces:**
- Produces: `<Sponsors />`, and `sponsors: { name: string; logo: string; link: string }[]` from `src/data/sponsors.ts`

Sponsors stay a static data file rather than a Supabase table: the logos are committed assets, so a database row pointing at a repo file would add a moving part without adding flexibility. Revisit if logos ever get hosted.

- [ ] **Step 1: Copy the logos**

```bash
cp ~/Projects/Extras/qweb-main-2024/public/sponsors/logos/* public/sponsors/
```

Five files: `COMPSA.png`, `DDQIC.png`, `Github.png`, `Queens.png`, `Redbull.png`.

- [ ] **Step 2: Write the data**

```ts
export const sponsors = [
  { name: 'COMPSA', logo: '/sponsors/COMPSA.png', link: 'https://compsa.ca' },
  { name: "Queen's Innovation Centre", logo: '/sponsors/DDQIC.png', link: 'https://www.queensu.ca/innovationcentre' },
  { name: "Queen's University", logo: '/sponsors/Queens.png', link: 'https://www.queensu.ca' },
  { name: 'GitHub', logo: '/sponsors/Github.png', link: 'https://github.com' },
  { name: 'Red Bull', logo: '/sponsors/Redbull.png', link: 'https://www.redbull.com' },
];
```

The 2024 file repeats the same five in a loop to fill a slider. Do not copy the repetition — list each once.

- [ ] **Step 3: Build the section**

`SectionHeading tag="Our Partners"`, then the two numbers a sponsor cares about — 300+ members reached, 11 sites shipped — then the logo row, then a `mailto:qweb@queensu.ca` CTA. Logos need `alt={sponsor.name}` since they carry meaning here, unlike the decorative project screenshots.

- [ ] **Step 4: Verify**

Run: `npm run test`, `npm run build`. Confirm logos are legible on the near-black surface — several are dark PNGs and may need a light plate behind them. Check the row wraps at 700px.

- [ ] **Step 5: Commit**

```bash
git add public/sponsors src/data/sponsors.ts src/pages/Sponsors src/pages/Landing
git commit -m "Add the sponsor tail to About Us"
```

---

### Task 8: Home stats, favicon, and the last of the invented content

**Files:**
- Create: `public/favicon.ico`
- Modify: `index.html` (favicon link)
- Modify: `src/pages/Landing/Landing.tsx` (stats, next-up line)

- [ ] **Step 1: Carry the favicon over**

```bash
cp ~/Projects/Extras/qweb-main-2024/public/favicon.ico public/
```

Add to `index.html`'s head: `<link rel="icon" href="/favicon.ico" />`

- [ ] **Step 2: Make the stats true**

```tsx
const stats = [
  { value: 300, suffix: '+', label: 'Active members' },
  { value: 11, suffix: '', label: 'Client sites shipped' },
  { value: 0, prefix: '$', suffix: '', label: 'Cost to join' },
];
```

`300+` comes from qweb.dev; `11` is the archive count. The `20+ workshops a year` figure has no source — drop it rather than carry an invented number. Three stats, so update `.stats` to a three-column grid on desktop.

- [ ] **Step 3: Add the next-up line to Home**

Home shows only the next event; the full schedule stays in `#education`. Reuse `findNextEvent` from `src/lib/events.ts` — do not re-derive it — and render a single line under the stats linking to `#education`. Render nothing when the schedule is empty.

- [ ] **Step 4: Verify**

Run: `npm run test`, `npm run build`. Confirm the tab shows the QWEB icon, the stats count to 300 / 11 / $0, and the next-up line disappears cleanly with an empty schedule.

- [ ] **Step 5: Commit**

```bash
git add public/favicon.ico index.html src/pages/Landing
git commit -m "Use real stats, add the favicon and the next-up line"
```

---

## Verification across the whole restructure

After Task 8, one pass over the finished page:

- `npm run test` and `npm run build` pass.
- All four anchors reachable from the nav; `#sponsors`-style deep links land correctly.
- Every region renders with Supabase configured and unconfigured.
- 1440px and 390px both correct; no horizontal overflow.
- `prefers-reduced-motion` still suppresses the wave drift, marquee, reveals, and stat counting.
- Inspect mode labels every region and card accurately.
- No control that looks interactive fails to go somewhere.
