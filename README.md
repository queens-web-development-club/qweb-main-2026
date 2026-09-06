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
3. Apply the SQL files in `supabase/migrations/` in filename order using your Supabase migration workflow before deploying the frontend. The September 5 migrations seed eleven legacy projects (skipping existing names, case-insensitively) and create and seed five sponsors. The September 6 migrations move sponsor logos into storage and seed the ten-session Fall 2026 workshop schedule into `term_events`, skipping event names already present so a date the club has moved is never overwritten. Existing project content is preserved; existing rows receive the default display order of 1000.
4. Upload the sponsor logos into the `sponsor-logos` bucket. The dashboard's storage uploader is the usual route; for a batch, `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run upload:sponsor-logos -- --dir <directory>` uploads every image in a directory, and `--dry-run` lists them first. The service-role key is server-only: keep it out of the repository, out of `.env.local`, and never give it a `VITE_` prefix.
5. Manage `club_projects` (`name`, `photo`, `description`, `link`, `display_order`), `sponsors` (`name`, `logo`, `link`, `display_order`), `team_members` (`name`, `photo`, `role`, `year`, `program`, `responsibility`, `fun_fact`), and `term_events` (`event_name`, `description`, `event_date`, `event_time`, `event_location`) in the Supabase dashboard. Project and team images can use public image URLs or existing root-relative asset paths such as `/projects/qflip.jpg`. A sponsor's `logo` is the object's file name inside the `sponsor-logos` bucket, such as `COMPSA.png`; a database constraint rejects slashes, schemes, and anything else, and the frontend resolves the name to the bucket's public URL. Sponsor links must be HTTP(S) URLs. `role` accepts `Co-Chair`, `Development`, `Outreach`, `Design`, or `Education`. Use an ISO date such as `2026-09-12` for `event_date`.

Projects and sponsors sort by `display_order` ascending, then UUID for stable ties. Set `display_order` in the dashboard to reorder entries. Both sections use database content exclusively: loading, unavailable, and empty results have explicit messages. Deleting all rows leaves an empty section; no old entries reappear. Seed data lives only in migrations. Project images remain in `public/projects/`. Sponsor logos live in the `sponsor-logos` storage bucket and are no longer shipped with the site, so the bucket's own backups are what protect them; the originals moved on 2026-09-06 remain in Git history.

The site reads these tables anonymously using the publishable/anon key. Row-level security allows public reads and blocks client-side inserts, updates, and deletes. Manage content through the dashboard or a trusted server, never with a service-role key in the frontend. The team retains its role-only fallback, while events explain when no schedule is available. Sponsor reach statistics are historical club figures, independent of the sponsor and project listings.

### Console troubleshooting

- A team request returning HTTP 400 with code `42703` and `column team_members.year does not exist` means the optional profile migration has not been applied. Team loading accepts the existing table columns and treats missing profile details as null, so the roster can still load. Apply `supabase/migrations/20260902000005_add_person_details_to_team_members.sql` through your migration workflow before editing those details. The team table is public content: the request selects all existing columns, then returns only the card fields to the component; keep private data in a separate protected table.
- `Error parsing shader source` with `RGX2`/`RGX3` and `GpuShader filters are not supported when GPU compositing is disabled` points to browser image enhancement, not a QWEB shader. In Opera GX, disable RGX image/video enhancement and reload to confirm. [Opera documents RGX here](https://www.opera.com/gx/features/rgx). QWEB's hero uses CSS and SVG, with no GPU shader source.
- `contentscript.js` listener and `ObjectMultiplex` warnings likely originate from an injected browser extension. Recheck with extensions disabled; inspect the script's full URL in DevTools to identify its owner. The React DevTools suggestion and QWEB source banner are informational.

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
scripts/
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
