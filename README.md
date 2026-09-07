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
5. Manage `club_projects` (`name`, `photo`, `description`, `link`, `display_order`), `sponsors` (`name`, `logo`, `link`, `display_order`), `team_members` (`name`, `photo`, `role`, `year`, `program`, `responsibility`, `fun_fact`), and `term_events` (`event_name`, `description`, `event_date`, `event_time`, `event_location`) in the Supabase dashboard. Project and team images can use public image URLs or existing root-relative asset paths such as `/projects/qflip.jpg`. A sponsor's `logo` is the object's file name inside the `sponsor-logos` bucket, such as `COMPSA.png`; a database constraint rejects slashes, schemes, and anything else, and the frontend resolves the name to the bucket's public URL. Sponsor links must be HTTPS URLs. Every database-controlled link and image is parsed in `src/lib/urls.ts` before it reaches the page: a link must be an absolute `https://` URL, and an image must be that or a root-relative path such as `/projects/qflip.jpg`. Anything else — `http://`, `javascript:`, `data:`, a protocol-relative `//host`, or a malformed value — is dropped, so a card renders without its link or picture rather than with a hostile one. If a link you saved does not appear on the site, check that it starts with `https://`. `role` is free text up to 40 characters, so the club can add a position without a migration. Only `Co-Chair` carries meaning: those cards group at the top under "Co-chairs" and everyone else appears under "Executives". The match ignores case and surrounding spaces, so `co-chair` still groups correctly. Use an ISO date such as `2026-09-12` for `event_date`.

Projects and sponsors sort by `display_order` ascending, then UUID for stable ties. Set `display_order` in the dashboard to reorder entries. Both sections use database content exclusively: loading, unavailable, and empty results have explicit messages. Deleting all rows leaves an empty section; no old entries reappear. Seed data lives only in migrations. Project images remain in `public/projects/`. Sponsor logos live in the `sponsor-logos` storage bucket and are no longer shipped with the site, so the bucket's own backups are what protect them; the originals moved on 2026-09-06 remain in Git history.

The site reads these tables anonymously using the publishable/anon key. Row-level security allows public reads and blocks client-side inserts, updates, and deletes. Manage content through the dashboard or a trusted server, never with a service-role key in the frontend. The team retains its role-only fallback, while events explain when no schedule is available. Sponsor reach statistics are historical club figures, independent of the sponsor and project listings.

### Console troubleshooting

- A team request returning HTTP 400 with code `42703` and `column team_members.year does not exist` means the optional profile migration has not been applied. Team loading accepts the existing table columns and treats missing profile details as null, so the roster can still load. Apply `supabase/migrations/20260902000005_add_person_details_to_team_members.sql` through your migration workflow before editing those details. The team table is public content: the request selects all existing columns, then returns only the card fields to the component; keep private data in a separate protected table.
- `Error parsing shader source` with `RGX2`/`RGX3` and `GpuShader filters are not supported when GPU compositing is disabled` points to browser image enhancement, not a QWEB shader. In Opera GX, disable RGX image/video enhancement and reload to confirm. [Opera documents RGX here](https://www.opera.com/gx/features/rgx). QWEB's hero uses CSS and SVG, with no GPU shader source.
- `contentscript.js` listener and `ObjectMultiplex` warnings likely originate from an injected browser extension. Recheck with extensions disabled; inspect the script's full URL in DevTools to identify its owner. The React DevTools suggestion and QWEB source banner are informational.

## Deployment

The site deploys to GitHub Pages from `.github/workflows/deploy.yml` on every push to `main`. The workflow runs `npm ci`, the typecheck, the tests, the committed-credential check, `npm audit`, and the frontend environment check before it builds, so a deploy cannot ship what would not pass review.

First-time setup:

1. **Settings → Pages → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Both are public by design — Vite writes them into the browser bundle, and the site cannot read content without them. They live in Actions secrets for convenience, not for confidentiality; security comes from row-level security, not from hiding the anon key. `npm run check:env` refuses to build if a service-role or secret key is put there by mistake.
3. Push to `main` and watch the Actions run. The published URL appears on the workflow's `deploy` job.

### Moving qweb.dev onto Pages

Adding a `public/CNAME` file containing `qweb.dev` makes the workflow build with `--base=/` so GitHub can serve the site at the apex domain, redirecting `www` to it. That file is **not** in the repository yet, on purpose — it belongs in the same change as the DNS cutover.

**The order matters.** Merging the CNAME file before DNS is ready builds the site at `/` while it is still served from `/qweb-main-2026/`, and every asset 404s until the domain resolves. Do it in this order:

1. **In the old Vercel project, remove `qweb.dev` and `www.qweb.dev`.** DNS for the domain is served by `ns1.vercel-dns.com` / `ns2.vercel-dns.com`, so the records live in the Vercel dashboard even after the project stops serving the site. Leaving the domain attached there means two services both claim it.
2. **Set these records in Vercel's DNS for `qweb.dev`.** Replace the existing `A` records on the apex:

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | AAAA | `@` | `2606:50c0:8000::153` |
   | AAAA | `@` | `2606:50c0:8001::153` |
   | AAAA | `@` | `2606:50c0:8002::153` |
   | AAAA | `@` | `2606:50c0:8003::153` |
   | CNAME | `www` | `queens-web-development-club.github.io` |

3. **Wait for propagation.** `dig +short A qweb.dev` should return the four GitHub addresses and nothing else.
4. **Merge this branch.** The workflow rebuilds with `--base=/` and publishes the `CNAME` file, which sets the custom domain in GitHub Pages.
5. **Settings → Pages**, confirm the custom domain shows `qweb.dev` with a green check, then tick **Enforce HTTPS** once the certificate is issued. That can take up to an hour; the site is served over plain HTTP until it is, so do not announce the link before this step.

To undo: delete `public/CNAME`, push, and the site returns to `https://queens-web-development-club.github.io/qweb-main-2026/`.

Without a custom domain the site is served from `https://<org>.github.io/<repo>/`, so the workflow builds with `--base=/<repo>/`. Everything root-relative — the logo, portraits, and the `/projects/...` paths stored in the database — is resolved against that base by `assetUrl` in `src/lib/urls.ts`. To move the club's domain onto Pages, add a `public/CNAME` file containing the hostname and point the DNS at GitHub; the workflow sees the file and builds with `--base=/` instead. Nothing else changes.

`dist/index.html` is copied to `dist/404.html`, so an unknown path gets a real 404 status from GitHub *and* renders the club's own not-found screen rather than GitHub's.

### What GitHub Pages cannot do

Pages serves static files and cannot send response headers. The Content-Security-Policy therefore travels in a `<meta http-equiv>` tag in `index.html`, which browsers honour for everything except `frame-ancestors`. These protections are **not available on Pages at any effort**, and the gate in `TODOS.md` stays open for as long as the site is hosted there:

| Protection | Status on Pages |
| --- | --- |
| Content-Security-Policy | Set, via `<meta>` in `index.html` |
| `frame-ancestors` (clickjacking) | **Not possible** — header-only, ignored in `<meta>` |
| `Strict-Transport-Security` | **Not possible** — Pages sets its own and it cannot be changed |
| `X-Content-Type-Options: nosniff` | **Not possible** |
| `Referrer-Policy`, `Permissions-Policy` | **Not possible** |

If the club later wants those closed, put a CDN that can set headers in front of Pages, or host somewhere that can. `vercel.json` is kept in the repository for that second case: it is inert unless a Vercel project points at this repo, and it sets every header in the table above.

The CSP is written for what this site actually loads — its own bundle, Google Fonts stylesheets and font files, HTTPS images, `data:` SVGs in CSS, and Supabase requests. Check the browser console on the first deploy rather than assuming it still fits after a change. `img-src` allows any HTTPS host, matching what `src/lib/urls.ts` accepts; tighten both together once the club has approved a list of image hosts.

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
.github/
  workflows/
vercel.json
supabase/
  migrations/
tsconfig.json
DESIGN.md
AGENTS.md
```

Each page section owns its TSX and CSS file. `DESIGN.md` documents the currently implemented visual system and should be consulted before making visual changes.

## Contributing

1. Read `AGENTS.md` and `DESIGN.md` before changing the interface.
2. Create a focused branch and keep changes scoped to one improvement.
3. Run `npm run typecheck`, `npm test`, `npm run check:secrets`, and `npm run build` before opening a pull request. CI runs all of them again on `main`.
4. Open a pull request with screenshots or a concise visual description for UI changes.
5. A project maintainer must review and approve the pull request before merge. **Do not merge your own PR or merge any PR that has not been reviewed.**

## License

MIT. See [LICENSE](LICENSE).
