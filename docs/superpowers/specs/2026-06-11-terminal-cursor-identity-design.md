# Terminal cursor as "last terminal is alive" identity marker

**Date:** 2026-06-11
**Status:** Approved (design)
**Branch:** `claude/ghosted-tron-cursor-x7yjue` (extends PR #1)

## Goal

The ghosted-Tron blinking cursor is a **code identity marker**: it signals that
the terminal surface is "alive." On any page, exactly **one** code block is
alive — the last one in the main content. Every other code block and all prose
stay cursor-free.

This reframes PR #1, which placed the cursor as a hand-positioned, opt-in accent
(`cursor` prop, default off, wired only into the home page). The goal is
automatic identity, not manual decoration — so placement moves from an authored
prop to a site-wide rule.

## Behavior

- On every page, the **last `.gc-terminal` block within the main content region**
  receives the blinking, glowing cursor.
- All earlier code blocks render with no cursor. All prose is unaffected.
- The cursor sits on its **own trailing line just below the last line of code**,
  inside the terminal chrome — the same slot the home-page featured snippet uses.
  Consistent across blog fences, `/work` case studies, and the home page.
- The home page already has a single terminal, so it keeps its cursor under this
  rule with no special-casing.

### Why "last block, loud, others nothing"

A single blinking glowing cursor is a "loud thing." One per page is a confident
accent; a cursor on every fence of an 8-fence blog post reads as a screensaver
and violates the project's "one loud thing per screen" principle. Restricting the
live cursor to the last terminal keeps the page calm while still threading the
"living terminal" identity through every page that has code.

This is consistent with `CLAUDE.md`:

- The cursor is `term-cyan`, **not** the orange `spot` color, so "one spot color
  per page" is untouched.
- "One loud thing per screen" is preserved: one cursor per page, max.

## Mechanism (Approach A — client-side "last terminal" script)

A small **guarded, site-wide script** in `src/layouts/PageLayout.astro`, mirroring
the existing copy-to-clipboard script already in that file:

1. On `DOMContentLoaded` (and guarded against double-running, like the copy
   script), query all `.gc-terminal` blocks **scoped to the main content region**
   (the article/`<main>` content), so a stray terminal in a header/footer can't
   be selected.
2. Take the last matching block.
3. Append the cursor markup — a trailing `.gc-term-prompt` line containing the
   `term-cursor` span (`aria-hidden="true"`) — to that block, unless it already
   ends with a cursor (idempotency guard, so a manually-placed cursor on the home
   page is not duplicated).

### Why client-side and not build-time

Blog markdown fences are auto-wrapped into `.gc-terminal` chrome by the Shiki
transformer (`src/theme/tronTerminal.ts`). That transformer processes each fence
in isolation and has no knowledge of which fence is last _on the rendered page_.
Only a client-side pass sees the whole assembled page, so it is the only place
"last terminal on this page" can be resolved. Build-time injection would force a
cursor onto every fence (the ruled-out screensaver) or require page-level
post-processing anyway.

The cursor is decorative and `aria-hidden`, so a no-JS visitor loses nothing; the
cursor simply appears once the script runs.

## Reuse from PR #1 (keep)

- `term-cursor` `@utility` + `term-blink` keyframes in
  `src/assets/styles/tailwind.css` — unchanged.
- `src/components/ui/TermCursor.astro` — the cursor span markup, reused.
- `.gc-term-prompt` / `.gc-term-prompt-mark` styles — kept; the script reuses the
  `.gc-term-prompt` line as the cursor's trailing-line container.
- `prompt` prop on `CodeBlock.astro` — kept as a **separate, manual editorial
  feature** (the `› build complete — 0 errors, 12 routes` line). Independent of
  cursor placement.
- The home-page "01 — the terminal" section, its copy, and its `prompt` line —
  kept (manual, editorial).

## Changes from PR #1

- The `cursor` prop on `CodeBlock.astro` is no longer the placement mechanism.
  The site-wide script owns cursor placement. Remove the `cursor` prop usage from
  the home page (`src/pages/index.astro`); the script will place the cursor on the
  home page's terminal automatically (it is the last/only terminal there).
- **Remove the `cursor` prop from `CodeBlock`'s interface entirely** (decided).
  Only one placement path exists: the site-wide script. The script's idempotency
  guard still checks for an already-present cursor before appending, for safety.

## Components & boundaries

- **`PageLayout.astro` script** — owns "which terminal is alive on this page."
  Input: the rendered DOM. Output: one cursor appended to the last in-content
  terminal. Depends on `.gc-terminal` class + `.gc-term-prompt`/`term-cursor`
  markup contract.
- **`term-cursor` utility / `TermCursor.astro`** — owns the cursor's _appearance_.
  No knowledge of placement.
- **`CodeBlock.astro` `prompt`** — owns the optional editorial output line. No
  knowledge of cursor placement.

## Testing / verification

- Home page: one cursor on the featured terminal; `› build complete` prompt line
  still present; no duplicate cursor.
- A blog post with **multiple** code fences: cursor on the **last** fence only;
  all earlier fences cursor-free.
- A blog post with **one** code fence: that fence gets the cursor.
- A page with **no** code: no cursor, no errors.
- A `/work` case study with code: last terminal gets the cursor.
- Light **and** dark mode: cursor reads identically (it lives on the always-dark
  term surface).
- No-JS: page renders fine, simply without the cursor.
- Cursor is `aria-hidden` and not announced by assistive tech.

## Out of scope

- Static (non-blinking) cursors on non-last blocks — explicitly ruled out; other
  blocks get nothing.
- Cursor at the end of the last _code line_ (REPL-style) — ruled out in favor of
  the trailing-line slot for consistency and reliable positioning.
