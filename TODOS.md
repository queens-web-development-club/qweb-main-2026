# Production launch checklist

Reviewed: 2026-09-05 (America/Toronto). Documentation branch based on `main` at `1307091`.

**Launch decision: NOT CLEARED.** This is a list of required release gates, not a certification that the site is secure or legally compliant. No checklist can guarantee that nothing bad will happen. Every applicable gate below must have evidence and an accountable owner before public launch. A legal requirement may be marked not applicable only with a documented reason approved by the responsible privacy/legal reviewer; uncertainty is not clearance.

Scope: the React/Vite public website, browser-to-Supabase content API, static assets, public repository/history, hosting/CDN, and linked membership/contact services. Source inspection does not establish the configuration of the live database, hosting, GitHub protections, consent records, or organizational legal status. Those remain unverified.

Keep credentials, personal data, incident details, database exports, and sensitive scan output out of this file and public PRs. Record sign-offs in a restricted club-owned location; reference only non-sensitive evidence here.

## Findings that drive the checklist

| Evidence in this repository | Launch implication |
| --- | --- |
| `src/lib/supabase.ts` uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the browser. | The URL and anon/publishable key are public by design. Security must come from database permissions, not hiding this key. Verify that no privileged key has been substituted. |
| Migrations enable RLS on `club_projects`, `team_members`, `term_events`, and `sponsors`, but their SELECT policies use `using (true)` for `anon` and `authenticated`. | All rows allowed by the grants are public. Policy names saying “Published” do not implement a publication filter. No publication flag/filter is present. |
| `src/lib/content.ts` selects particular fields. `team_members` includes name, photo, year, program, responsibility, and fun fact. | A browser query's field list is not column-level authorization. Direct API callers can request other granted columns and all publicly readable rows. |
| `.gitignore` now covers `.env*` with an explicit `!.env.example` exception, key and certificate extensions, SQL dumps and backups, and `.claude/`/`.codex/` output (2026-09-07, each verified with `git check-ignore`). | Already-tracked files, the example's values, and every environment still need a separate review, and GitHub push protection and a CI secret check remain to be enabled. |
| Database-controlled links and images are parsed in `src/lib/urls.ts` at the loader boundary (2026-09-07): links must be absolute `https://`, images that or root-relative, and anything else becomes null. | The scheme-injection gap is closed in code. Approving which destinations and image hosts the club actually permits, and adding matching database constraints, is still a content decision. |
| `public/` contains project screenshots, sponsor logos, portraits, and SVGs. | All shipped files are public even when no page links to them. Review rights, visible information, and metadata. |
| Google Fonts is imported in Landing and NotFound CSS. Join uses email and Discord links; no application form, checkout, or account UI was found. | Third-party requests and hosting logs still need a privacy inventory. Do not describe this as a site that handles no personal information. |
| Still no privacy notice or link in the page components. A `.github/workflows/deploy.yml` now publishes to GitHub Pages behind the typecheck, tests, a committed-credential check, `npm audit`, and a frontend environment check (2026-09-07). | The privacy notice is still required and is the club's to write. Release controls now exist and are verifiable in CI; branch protection and required reviews are GitHub settings and remain unset. |
| `package.json` now pins React, React DOM, Vite, and the React plugin to reviewed caret ranges, and `tsconfig.json` plus `npm run typecheck` give a strict TypeScript check over all 33 source files (2026-09-07). | Dependency scanning at release time and triage of any advisory still belong to the release gate. |
| The curriculum ticker now carries a `.bar-toggle` pause/play button in `src/pages/Landing/CurriculumTicker.tsx` (2026-09-07), operable by keyboard and touch, with hover and focus kept as conveniences. | WCAG 2.2.2 has an operable mechanism. The rest of the manual accessibility audit — keyboard order, contrast, zoom, reflow, screen-reader names — is still outstanding. |

## 1. Approve exactly what may be public

Owner: club content lead and privacy lead, with a developer verifying the actual release.

- [x] **Create a public-data inventory.** *Built from actual API responses and the actual build output, 2026-09-07; content approved by the club content lead the same day.* See "Public-data inventory" below. Every item is public-approved; nothing private was found reachable.
- [x] **Choose and enforce the publishing model.** *Decision recorded 2026-09-07: the four tables are strictly public-only.* No draft or private data may be stored in `club_projects`, `sponsors`, `team_members` or `term_events`; there is no publication flag and none is needed, because everything in them is intended to be public. Verified by direct API request: those four tables are the only relations the anon role can reach, `select=*` exposes nothing beyond `created_at` and `display_order`, and ten guessed names for private data (`applications`, `members`, `contacts`, `users`, `profiles`, `submissions`, `emails`, `signups`, `admin`, `clients`) all return 404. **If the club ever adds applications or a member list, they must go in a separate protected table — putting them here would publish them instantly.**
- [x] **Approve personal profiles before publication.** *Attested by the club content lead (Zac Finkelstein), 2026-09-07:* every executive has consented to publication of their name, photo, year, program and personal fact, including public search indexing. Removal and correction requests go to the same person, who is the named owner. No real personal data appears in test fixtures — every fixture uses invented names. The 2026-27 roster is being entered from `docs/add-team-members.sql`; first names only, by the content lead's choice. The 2024-25 roster on the old site was deliberately **not** reused — those people have not agreed to appear on the 2026 site, and consent does not transfer between years.
- [ ] **Review every static asset and seed record.** Inspect project screenshots for names, email addresses, student numbers, dashboards, client records, browser tabs, tokens, and internal URLs. Remove sensitive EXIF/GPS metadata and unapproved material. Check unused files too, including `Unknown_Member.jpg`. Done when every file copied from `public/` into `dist/` has been reviewed, and confidential material is also removed from public storage/history where feasible.
- [x] **Verify rights and claims.** *Attested by the club content lead, 2026-09-07:* the club holds rights to the eleven client screenshots, the five sponsor marks, and its use of Queen's branding. All five sponsor relationships are current and approved for listing, and are managed in the database so a lapsed sponsor can be removed without a deploy. The "300+ active members", "11 client sites shipped" and "$0 cost to join" figures are confirmed accurate. Fonts are Google Fonts under the Open Font License.
- [ ] **Review contact destinations.** *Partly attested 2026-09-07:* the club mailbox is monitored and Zac Finkelstein is the named owner for removal and security requests. The Discord link is an ordinary public invite. Every destination was followed and returns 200 except two: `redbull.com` returns 403 to a command-line client, which is expected bot filtering and needs one check in a browser; and **`qflip.ca` does not resolve at all**. *Remaining to close:* clear or replace the qflip link (SQL in the outbound link check below), and confirm the Discord server has no private member channel reachable from the public invite.

## 2. Prove secrets and private files are not exposed

Owner: security/release maintainer.

- [ ] **Run a full secret scan with redacted output.** Scan all Git branches/tags/history, current tracked and untracked release inputs, migrations, examples, public issues/PR attachments, CI logs/artifacts, and the final `dist/`. Use a maintained secret scanner plus manual review for personal data and confidential documents. Inspect images separately. Done when all findings are triaged privately and no live privileged credential or unauthorized data remains exposed. A narrow regex scan is not sufficient.
- [ ] **Revoke before cleaning up any discovered secret.** Rotate/revoke affected credentials, inspect access logs, invalidate affected sessions when relevant, rebuild/redeploy and invalidate caches, then coordinate history/artifact removal. Removing a file or making the repository private does not undo an exposure. Treat copied/forked secrets as permanently compromised. No destructive history rewrite without maintainer authorization.
- [ ] **Harden ignore rules and secret prevention.** Cover environment variants (for example `.env*` with an explicit exception for a sanitized `.env.example`), database exports, keys, backup files, private reports, and local `.codex/`/`.claude/` outputs as appropriate. Verify with `git check-ignore`; check already tracked files separately. Enable available GitHub secret scanning/push protection and a CI secret check.
- [x] **Verify browser environment values by type.** *Enforced automatically and verified in the deployed bundle, 2026-09-07.* `npm run check:env` runs before every build and refuses to proceed on a service-role JWT, an `sb_secret_` key, or any other `VITE_*` name matching SERVICE_ROLE/SECRET/PASSWORD/PRIVATE_KEY/TOKEN; it was tested against each of those cases. The published bundle was then inspected by type without recording any value: it contains **one publishable key, zero JWTs, and zero secret keys**, plus the intended project URL.
- [x] **Serve only approved build output.** *Verified against the live site, 2026-09-07.* The workflow uploads only the `dist/` artifact, so the repository root is never publishable. Live requests confirm it: `/.env`, `/.env.local`, `/.git/config`, `/package.json`, `/TODOS.md` and `/src/main.tsx` all return **404**, and the bundle's `.map` file returns 404 — no source maps ship. Only the hashed JS and CSS, the eleven screenshots, and the eight `assets/` files are reachable, matching the inventory. Public JS and Inspect mode remain public by design.

## 3. Verify production Supabase authorization

Owner: database maintainer; second maintainer reviews the evidence.

- [ ] **Inspect the real production schema and access configuration.** Compare deployed migrations, enabled RLS, table/column grants, default privileges, exposed schemas, views, functions, storage policies, and any GraphQL/Realtime exposure against the approved model. Review Supabase security advisors. Do not assume migrations prove the current dashboard configuration. RLS and grants must both be correct. [Supabase RLS documentation](https://supabase.com/docs/guides/database/postgres/row-level-security).
- [ ] **Run an authorization test matrix.** On an isolated staging project with the production permission configuration, test anonymous, ordinary authenticated, and authorized editor access. Use disposable fixtures to prove public readers cannot insert, update, delete, upsert, invoke privileged functions, or upload/overwrite/delete storage objects; test unexpected privileges such as `TRUNCATE` through appropriate role-level database tests. Verify allowed reads still work. Do not run destructive probes against production. Repeat safe read-only exposure checks on the production endpoint.
- [x] **Protect storage independently.** *Verified 2026-09-07.* One bucket exists, `sponsor-logos`, and it is public by design. An anonymous listing returns exactly the five approved sponsor logos — `COMPSA.png`, `DDQIC.png`, `Github.png`, `Queens.png`, `Redbull.png` — and no other bucket is visible to the anon role. `20260906000000_create_sponsor_logos_bucket.sql` grants public SELECT on `storage.objects` and defines no write policy, so only `service_role` can upload. No private bucket exists, so nothing depends on obscure object names for authorization. The anonymous *write* probe is deliberately not run against production; it belongs to the staging matrix above.
- [ ] **Restrict administration and unused services.** *Partly attested 2026-09-07:* MFA is enabled and there are at least two accountable maintainers. *Remaining to close:* confirm former executives have been removed from the GitHub org and Supabase project, that no shared password or stale access token remains, and that Supabase public signup and unused auth providers are off (the site uses none); then write down the annual handover and recovery steps, which do not exist yet. A club turns over every year, so this is the gate most likely to be the reason nobody can fix the site in 2028.
- [ ] **Separate preview/development from production.** Preview builds must use sanitized staging data and unprivileged frontend configuration; untrusted PRs must not receive production secrets. Protect private previews with actual access controls. `robots.txt` and `noindex` are not security boundaries.

## 4. Resolve privacy, accessibility, and legal obligations

Owner: designated club privacy lead, supported by Queen's Records Management and Privacy Office / the applicable institutional or legal reviewer.

These are release decisions, not a claim that every law below automatically applies to a student club. Complete the applicability decision before publishing or collecting the affected data.

- [ ] **Document who operates the site and controls its records.** Establish whether QWEB acts independently, through a student association, or on behalf of Queen's. Record who controls the database, domain, mailbox, and third-party accounts. Obtain confirmation of applicable university/association policies and approval to use Queen's name/marks and present the site as official.
- [ ] **Record the privacy-law determination.** PIPEDA generally turns on commercial activity; nonprofit status alone does not decide applicability. Assess client/sponsorship activities and associated information handling. Queen's handles personal information under FIPPA, but the club's records require an actual institutional/control assessment. Do not assert either universal PIPEDA coverage or a blanket student-club exemption. [OPC nonprofit guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/r_o_p/02_05_d_19/?wbdisable=true), [Queen's privacy office and contact](https://www.queensu.ca/accessandprivacy/privacy/personal/overview).
- [ ] **Publish an accurate privacy notice and collection notices where needed.** Explain operator/contact, data collected (including logs and public profiles), purposes, permissions/authority, recipients/processors, retention, international processing, security practices, and access/correction/removal process. Inventory Supabase, hosting/CDN logs, Google Fonts, image origins, and linked Discord/email flows. Confirm contracts, regions, access controls, and retention; do not invent a universal Canadian-only hosting requirement. Done when the responsible reviewer approves the notice and the live site links to it.
- [ ] **Decide tracking and consent requirements from actual traffic.** Inspect a fresh browser's network, cookies, and storage. Disable unapproved analytics, advertising, pixels, and session replay. If tracking is introduced, implement the applicable consent/withdrawal behavior before it starts. Do not add a cosmetic cookie banner or promise “no cookies” without measurement. Self-hosting fonts is an option to reduce third-party requests, subject to licensing and approval.
- [ ] **Assess CASL before promotional messaging.** Joining Discord or sending an email inquiry does not automatically authorize promotional email. If commercial electronic messages are sent, establish the applicable consent or exemption, sender identification, unsubscribe mechanism, and records before sending. If the launch sends no such messages, document that scope and reassess before enabling them. [CRTC CASL FAQ](https://www.crtc.gc.ca/eng/com500/faq500.htm).
- [ ] **Confirm accessibility obligations and pass a manual audit.** Ontario website rules cover designated public-sector bodies and businesses/nonprofits with 50+ employees, with specified WCAG 2.0 AA requirements/exceptions. Queen's policy covers officially associated university sites, including those outside its domain where applicable. Confirm classification with the institution; use WCAG 2.2 AA as the engineering target without mislabeling it as the Ontario statutory version. [Ontario guidance](https://www.ontario.ca/page/how-make-websites-accessible), [Queen's Web Accessibility Policy](https://www.queensu.ca/secretariat/policies/information-technology/web-accessibility-policy).
- [ ] **Fix identified accessibility risks and verify the deployed experience.** Add an operable pause/stop control for the continuously scrolling curriculum ticker or stop its automatic movement. Review background motion as well. Check keyboard-only operation, visible focus, screen-reader names/order, contrast (including gradients), image alternatives, 200% zoom, 320px reflow, reduced motion, and error/empty states. Automated tests alone cannot sign this off. [W3C pause/stop/hide guidance](https://www.w3.org/WAI/WCAG20/Understanding/pause-stop-hide.html).
- [ ] **Document retention and incident obligations.** Assign deadlines/owners for profile removal, mailbox records, logs, backups, and access requests under the applicable rules. Establish escalation to Queen's/the responsible organization. If PIPEDA applies, assess reporting/notification for a real risk of significant harm and keep required breach records; do not import a universal 72-hour rule from another regime. [OPC breach guidance](https://www.priv.gc.ca/en/privacy-topics/privacy-for-businesses/privacy-breaches-at-your-business/gd_pb_201810/).
- [x] **Keep unassessed features out of launch.** *Verified in source and in the built bundle, 2026-09-07.* The site collects nothing: no `<form>`, `<input>`, `<textarea>`, file input, `FormData`, or submit handler exists anywhere in `src/`. No analytics, tag manager, pixel, or session replay is present, and the code sets no cookie and writes to neither `localStorage` nor `sessionStorage`. The only third-party origins the built output requests are `fonts.googleapis.com` (with `fonts.gstatic.com` for the font files) and the Supabase project; every other external URL is a link destination, not a request. **Recorded exclusions:** membership applications, uploads, payments, newsletters, tracking, and accounts are all out of scope for this launch. Adding any of them re-opens this gate and gate 4.

## 5. Harden and verify the release

Owner: release maintainer and independent reviewer.

- [ ] **Create a reproducible release pipeline.** Use a supported, specified Node version, committed lockfile, `npm ci`, automated tests, and `npm run build`. Replace unbounded `latest` declarations with reviewed version ranges and add a real TypeScript configuration/check. Scan dependencies at release time and triage all advisories; fix exploitable issues before launch. Require checks and another maintainer's approval before merge/deploy; never self-approve/self-merge. Lock down CI permissions and third-party actions.
- [ ] **Validate database-controlled URLs.** Parse and enforce approved HTTPS destinations for project/sponsor links and approved same-origin or HTTPS image hosts. Reject executable/data schemes for content links, protocol-relative/unapproved destinations, and malformed values. Use shared validation and database constraints where appropriate, then test hostile fixtures in staging. Existing `rel="noreferrer"` helps external-tab privacy but does not validate a destination. Keep React text escaping; do not add raw HTML rendering for content.
- [ ] **Configure HTTPS and response security policy.** *Partly closed 2026-09-07.* HTTPS is enforced and GitHub sends `strict-transport-security: max-age=31556952` on the Pages domain; the CSP is live in a `<meta>` tag and the site renders correctly under it. **The rest cannot be closed on GitHub Pages:** `frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` are header-only and Pages sends none of them. Closing this gate means a CDN in front of Pages, or a host that sets headers; `vercel.json` is kept ready for that. Verify certificate renewal, HTTP-to-HTTPS redirect, intended canonical domain, and no mixed content. Deploy a tested CSP that restricts scripts/connections/images/fonts to necessary origins, blocks objects and unwanted framing, and restricts base/form targets. Account for this site's Google Fonts, Supabase calls, CSS data-URI SVGs, and React inline styles instead of copying an incompatible policy. Avoid broad script exceptions. Also set and test `X-Content-Type-Options: nosniff`, an appropriate Referrer-Policy and Permissions-Policy, and HSTS once the domain/subdomain HTTPS plan is verified. Confirm actual headers on success and error responses.
- [ ] **Verify actual hosting behavior.** *Partly closed 2026-09-07.* The live site serves the production build, not a dev or preview server. `/` returns 200, and an unknown path returns a genuine **404 status** while still rendering the club's own not-found screen from `404.html`. Assets are content-hashed and resolve correctly under the `/qweb-main-2026/` base. **Remaining:** `qweb.dev` still serves the old 2024 Next.js site from a separate Vercel project. That is exactly the "abandoned deployment alias" this gate warns about — decide whether to point the domain at Pages or retire the old project, and confirm registrar and DNS ownership either way. Serve production assets rather than Vite dev/preview servers. Test `/`, anchor links, direct reloads, missing assets, and unknown paths; confirm real 404 status where required instead of assuming the React NotFound screen sets HTTP status. Keep HTML revalidation and hashed-asset caching compatible with updates/rollbacks. Protect domain ownership, renewals, DNS changes, and any abandoned deployment aliases against takeover.
- [ ] **Test configuration and failure modes.** Ensure the build uses the intended production Supabase project, missing required environment variables block release, and migrations are applied. Test unavailable/malformed content, denied requests, broken images, slow/offline connections, and empty tables. `Team.tsx` currently logs raw Supabase errors and lacks the shared loader's rejection/cancellation handling; make its user-facing failure behavior reliable and keep diagnostics free of private records/credentials. Preserve honest “applications not open” states unless the feature is actually ready.
- [ ] **Perform browser QA on the exact release candidate.** Test desktop/mobile Chrome, Firefox, and Safari as available; all navigation, external links, contact actions, project scrolling, icon assembly, timeline motion, forms if any, and accessibility states. Inspect console and network responses for unintended data and tracking. Check media sizes and performance under a realistic mobile connection. Record screenshots/results privately when they contain personal data.
- [ ] **Prepare recovery before launch.** Verify database and media backup coverage, encryption/access, retention, and an actual isolated restore. Document frontend rollback to a known artifact, migration recovery/compatibility, incident contacts, credential rotation, and a safe temporary shutdown/read-only option. Set uptime/error/quota/billing alerts with a named responder; avoid collecting unnecessary personal data in monitoring. Frontend rate limiting cannot secure an independently reachable Supabase API—review provider-side limits/exposure and a cache strategy for public reads.

## Engineering work completed (2026-09-07)

These landed on `feat/sponsor-logos-bucket`. They are progress inside the gates above, **not sign-offs**: no gate is ticked, because each still needs an accountable owner and evidence.

- **Operable pause for the curriculum ticker.** Extracted `CurriculumTicker` with a real button, `aria-pressed`, and a `data-paused` track; covered by `CurriculumTicker.test.tsx`. Closes the code half of the WCAG 2.2.2 finding.
- **Shared URL validation.** `src/lib/urls.ts` parses every database-controlled link and image inside `content.ts`, so no component can forget. `javascript:`, `data:`, `vbscript:`, `file:`, `http:`, protocol-relative, and malformed values are dropped. 27 cases in `urls.test.ts`, 4 loader cases in `content.test.ts`.
- **Reliable team failure behaviour.** `Team.tsx` moved onto `useContentList`, gaining its cancellation and rejection handling, and no longer logs raw Supabase errors.
- **Reproducible build inputs.** `latest` dependency declarations replaced with caret ranges matching the lockfile; `tsconfig.json` and `npm run typecheck` added (strict, `noUnusedLocals`, verified to fail on a planted type error).
- **Ignore rules hardened.** `.env*` with an `!.env.example` exception, keys, certificates, SQL dumps, backups, and local assistant output; each verified with `git check-ignore`.
- **Public curriculum corrected.** The ticker and Education section advertised Node.js, which the remade Fall 2026 syllabus does not teach. Now HTML, CSS, JavaScript, React, Next.js. **Needs the education lead's confirmation** that these are the five headline skills.

Checks at the time of writing: 75 tests passing, `npm run typecheck` clean, `npm run build` clean.

### Second pass, same day: GitHub Pages

The club chose GitHub Pages over Vercel. That is a real constraint, not a preference: **Pages serves static files and cannot send response headers.**

- **Content-Security-Policy** is set, in a `<meta http-equiv>` tag in `index.html`, derived from what the built bundle actually loads.
- **`frame-ancestors`, HSTS, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` cannot be set on Pages at any effort.** A `<meta>` CSP ignores `frame-ancestors`, and the rest are header-only. This gate cannot be closed while the site is hosted on Pages. Closing it means putting a CDN that can set headers in front of Pages, or hosting elsewhere; `vercel.json` is kept in the repository for that case and sets all of them.
- **Path handling.** A project Pages site is served from `/<repo>/`, so `main.tsx` compared the path against `/` and would have shown the not-found screen at the club's own homepage. `isLandingPath` fixes that, and `assetUrl` resolves every root-relative asset — including the `/projects/...` paths stored in the database — against the deployment base.
- **Real 404s.** `dist/index.html` is copied to `404.html`, so an unknown path returns a genuine 404 status *and* renders the club's own screen.
- **Frontend environment check.** `npm run check:env` decodes the Supabase key and refuses to build if it is a service-role or secret key, or if any other `VITE_*` name looks like a credential. Verified against planted service-role, `sb_secret_`, and stray-variable cases.
- **Committed-credential check.** `npm run check:secrets` decodes JWTs found in tracked files rather than grepping for the word, so prose about service-role keys does not trip it. Verified against a planted key. This is a preventive control, **not** the full history-and-artifact secret audit the gate above still requires.
- **Dependency triage and a pinned runtime.** `npm audit --audit-level=high` runs in CI; `engines` records Node 22+.
- **Skip link.** The navigation had no bypass mechanism (WCAG 2.4.1). Added, focusable, targeting a hero that takes focus.

Accessibility items checked in code and found clean: every `<img>` has `alt`, no control lacks an accessible name, no positive `tabindex`, no `aria-hidden` on anything focusable, `lang` set, viewport does not block zoom, six `:focus-visible` rules and no bare `outline:none`. Contrast, screen-reader order, 200% zoom, and 320px reflow still need the manual audit.

Checks after this pass: 92 tests passing, typecheck clean, build clean, `npm audit` reports 0 vulnerabilities, committed-credential check clean across 97 tracked files.


### Read-only production exposure check (2026-09-07)

Run against the production endpoint with the anon key, reads only — no inserts, updates, deletes or uploads, and nothing on a live table that could change it. This advances the read half of gate 3; the write half still needs the staging authorization matrix.

- **Only the four intended tables are reachable.** `club_projects`, `sponsors`, `team_members`, `term_events` return 200. `applications`, `members`, `contacts`, `users`, `profiles`, `submissions`, `emails`, `signups`, `admin` and `clients` all return 404 — not exposed to the anon role.
- **`select=*` reaches two columns beyond what the site requests**, and both are benign: `created_at` and `display_order`. No private field is reachable through a direct API call.
- **Storage.** `sponsor-logos` is listable anonymously and holds exactly the five approved sponsor logos. No other bucket is visible to the anon role.
- **`team_members` returns zero rows**, so the site renders the role-only structure with no names or photos. That is a content gap, not a permissions finding.

Not tested, and still required: that an anonymous caller cannot insert, update, delete, upsert, invoke privileged functions, or write to storage. Those are write probes and belong on an isolated staging project with the production permission configuration, per the gate above.

### Outbound link check (2026-09-07)

Every external destination the site renders, followed to its final status:

| Destination | Result |
| --- | --- |
| Instagram, GitHub org, Discord invite, LinkedIn | 200 |
| compsa.ca, queensu.ca, queensu.ca/innovationcentre, github.com | 200 |
| redbull.com | 403 to a command-line client; expected bot filtering, verify in a browser |
| **qflip.ca** | **Does not resolve — no DNS record at all. `www.qflip.ca` returns 530.** |

**`qflip.ca` is a finding, not a transient failure.** It is the stored `link` for the "Queen's Feminist Leadership in Politics" project. Two problems: students who click it reach nothing, and if the domain has lapsed rather than merely broken, anyone can register it and the club's site will send visitors to whatever they publish there. Gate 1's "review contact destinations" and gate 5's "prevent compromised content destinations" both cover this.

Until the project owner confirms the domain, clear the link and keep the card:

```sql
update public.club_projects set link = null
where name = 'Queen''s Feminist Leadership in Politics';
```

Reaching 200 is not the same as being approved. Whether each destination is owned by who the club thinks, and whether the Discord invite can expose private channels, is still gate 1 and needs a person.

## Public-data inventory

Built from live API responses and the actual `dist/` file list on 2026-09-07, not from intentions. Everything here is public-approved.

### Database — the only four relations the anon role can reach

| Table | Columns reachable via `select=*` | Rows | Notes |
| --- | --- | --- | --- |
| `club_projects` | `id`, `name`, `photo`, `description`, `link`, `display_order`, `created_at` | 11 | `display_order` and `created_at` are reachable but unused by the site |
| `sponsors` | `id`, `name`, `logo`, `link`, `display_order`, `created_at` | 5 | `logo` is a bucket object name, not a URL |
| `term_events` | `id`, `event_name`, `description`, `event_date`, `event_time`, `event_location`, `created_at` | 10 | Event locations are public rooms on campus |
| `team_members` | not sampled — table is empty | 0 | Roster not yet entered |

No view, RPC or function is exposed. Ten guessed names for private data all return 404.

### Storage

One bucket, `sponsor-logos`, public by design, containing exactly `COMPSA.png`, `DDQIC.png`, `Github.png`, `Queens.png`, `Redbull.png`. Anonymous listing works and reveals only those five. No other bucket is visible to the anon role.

### Files shipped to every visitor

`index.html`, one hashed JS bundle, one hashed CSS bundle, `favicon.ico`, eleven project screenshots in `projects/`, and eight files in `assets/` (`qweb-text-white.png`, `qweb-text-black.png`, `Unknown_Member.jpg`, and the `workshops`, `build-nights`, `client-projects`, `speakers-socials` SVGs).

**Five of those ship but are referenced by nothing** — `qweb-text-black.png` and the four SVGs. They are the club's own branding and carry no personal data, so this is housekeeping rather than a finding, but they are public and should either be used or deleted.

### Third-party requests a visitor's browser makes

`fonts.googleapis.com` (stylesheet), `fonts.gstatic.com` (font files), and the Supabase project. Nothing else. Discord, Instagram, LinkedIn, GitHub and sponsor URLs are link destinations, not requests, so no data reaches them unless a visitor clicks.

### Embedded claims in the bundle

"300+ active members", "11 client sites shipped", "$0 cost to join", and the sponsor reach figures. Confirmed by the content lead; see gate 1.

## 6. Final go/no-go record

- [ ] Club content lead approves the exact public records, assets, links, and claims.
- [ ] Privacy/institutional reviewer approves the applicability decisions, notices, publication basis, and incident process.
- [ ] Security/database reviewer verifies secret-scan triage, production permissions, storage, and safe direct API checks.
- [ ] Accessibility/browser reviewer approves the deployed release candidate and closes blocking findings.
- [ ] Release maintainer records the reviewed commit, successful CI/build, applied migrations, production domain/configuration, backup/restore evidence, monitoring, and rollback artifact.
- [ ] Another project maintainer approves the PR and the release. No deployment is cleared while a mandatory gate is unresolved; document any conditional exclusion and keep that capability disabled.

## Evidence available from this preparation

- Source inspected: frontend data loaders/components, migrations, public file inventory, package manifest/lockfile context, ignore rules, entry point, and documentation. No live Supabase contents or production host settings were inspected.
- `npm audit --json`: succeeded; 0 known vulnerabilities reported for the installed/locked dependency tree at review time. This is not a supply-chain or application-security certification.
- Limited current tracked-text pattern scan: no matches for the selected private-key, GitHub-token, Supabase-secret-key, and AWS-access-key patterns. Only environment variable names were inspected from local environment files; values were not reproduced. Full history, arbitrary secrets, asset contents/metadata, and deployed artifacts still need the gate above.
- A passing build/test suite from development is not production approval. No production authorization tests, legal determination, full secret audit, accessibility audit, or browser certification is claimed here.

This change creates the checklist only. It does not change routes, dependencies, credentials, database policies, public content, or deployment configuration.
