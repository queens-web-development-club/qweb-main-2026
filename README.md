# QWEB 2026–27

The official website for Queen’s Web Development Club: a student-run community for learning, shipping, and building a portfolio on the web.

[![Vite](https://img.shields.io/badge/vite-latest-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![React](https://img.shields.io/badge/react-latest-149ECA?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-0ea5e9)](LICENSE)

## Overview

QWEB is a dark, editorial single-page site for Queen’s University students. It introduces the club, explains what members learn, shows member-built work, presents the student leadership team and sponsors, and directs prospective members to join.

## Stack

- React with TypeScript
- Vite for development and production builds
- CSS co-located with each page section
- Space Grotesk and DM Mono via Google Fonts
- Local SVG and PNG assets in `public/assets`

## Getting started

Requirements: Node.js 22+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Create a production build with:

```bash
npm run build
npm run preview
```

## Supabase setup

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
3. Add rows to `club_projects` (`name`, `photo`, `description`, `link`), `team_members` (`name`, `photo`, `role`, `year`, `program`, `responsibility`, `fun_fact`), and `term_events` (`event_name`, `description`, `event_date`, `event_time`, `event_location`). Photo values should be public image URLs. `role` accepts `Co-Chair`, `Development`, `Outreach`, `Design`, or `Education`. Use an ISO date such as `2026-09-12` for `event_date`.

Apply the migrations in `supabase/migrations/` before using the newer `club_projects.link` and `team_members.year`, `program`, `responsibility`, and `fun_fact` fields. If Supabase is unavailable, the site renders its committed fallback content; configured empty event data renders an honest empty state.

The site reads these tables anonymously using the publishable/anon key. Row-level security allows public reads and blocks client-side inserts, updates, and deletes. Until the environment variables and rows are present, the committed fallback content remains visible for projects and team, while the events section explains when no schedule is available.

## Project structure

```text
src/
  main.tsx
  components/
  data/
  lib/
  pages/
    Landing/
    AboutUs/
    Education/
    Projects/
    Term/
    Team/
    Join/
    Sponsors/
    Footer/
public/
  assets/
  projects/
  sponsors/
DESIGN.md
AGENTS.md
```

Each page section owns its TSX and CSS file. `DESIGN.md` documents the currently implemented visual system and should be consulted before making visual changes.

## Contributing

1. Read `AGENTS.md` and `DESIGN.md` before changing the interface.
2. Create a focused branch and keep changes scoped to one improvement.
3. Run `npm test` and `npm run build` before opening a pull request.
4. Open a pull request with screenshots or a concise visual description for UI changes.
5. A project maintainer must review and approve the pull request before merge. **Do not merge your own PR or merge any PR that has not been reviewed.**

## License

MIT. See [LICENSE](LICENSE).
