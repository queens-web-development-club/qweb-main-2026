# QWEB Agent Workflow

This repository is a shared project for Queen’s Web Development Club. Coding agents and contributors should keep changes focused, explain their intent, and leave the project easier to review than they found it.

## Before changing code

1. Read `DESIGN.md` for the current visual system and implementation constraints.
2. Inspect the relevant page folder under `src/pages/` before editing.
3. Preserve the existing dark near-black palette, Space Grotesk/DM Mono typography, responsive breakpoints, accessibility semantics, and reduced-motion behavior unless the task explicitly changes them.
4. Keep each major page section in its own folder with colocated `.tsx` and `.css` files.

## Implementation workflow

1. State the requested scope and identify the files that should change.
2. Make the smallest implementation that satisfies the request.
3. Reuse existing patterns and assets before introducing new dependencies or abstractions.
4. For visual changes, update `DESIGN.md` when the implemented system changes materially.
5. Run the applicable checks, at minimum:

   ```bash
   npm run build
   ```

6. Summarize changed files, validation, and any limitations in the handoff.

## Design documentation

`DESIGN.md` is the source of truth for the implemented design system. It records typography, colors, spacing, layout, components, motion, responsive behavior, and reduced-motion handling. Keep it grounded in actual source values; do not document speculative tokens or visual behavior that does not exist.

## Pull requests and review

- Use a focused branch and open a pull request for changes.
- Include the user-facing intent, files changed, validation performed, and screenshots or visual notes for UI work.
- Keep unrelated changes out of the pull request.
- **Never merge without a pull request being reviewed and approved by another project maintainer.**
- **Do not self-approve or self-merge a pull request.** If review feedback exists, address it in the branch and request another review before merging.

## Safety and collaboration

- Do not overwrite unrelated work in the working tree.
- Do not commit generated output or credentials.
- Do not make destructive Git changes such as hard resets unless the project owner explicitly requests them.
- Ask before changing routes, public APIs, dependencies, or deployment configuration.
