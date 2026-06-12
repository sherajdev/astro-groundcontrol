# Terminal Cursor Identity Marker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the ghosted-Tron blinking cursor an automatic "this terminal is alive" identity marker — exactly one per page, on the last code block in the main content — instead of a hand-placed opt-in prop.

**Architecture:** A small guarded client-side script in `PageLayout.astro` runs on `astro:page-load` (fires on first load and after every View Transition navigation), finds the last `.gc-terminal` inside `<main>`, and places the cursor there. If that terminal already has a `.gc-term-prompt` output line (the home page), the cursor is appended inline to it; otherwise a new trailing `.gc-term-prompt` line holding just the cursor is added. The `cursor` prop is removed from `CodeBlock`, leaving the script as the single placement path.

**Tech Stack:** Astro 6, TypeScript, Tailwind v4, View Transitions (`ClientRouter`). No JS test runner in the project — verification is manual via the dev server plus `npm run check` (astro check + eslint + prettier).

---

## Context for the engineer

- The project renders ALL code in "ghosted-Tron" terminal chrome. Markdown fences are
  auto-wrapped into `<div class="gc-terminal">…</div>` by a Shiki transformer
  (`src/theme/tronTerminal.ts`); hand-placed code uses `CodeBlock.astro`, which emits the
  same `.gc-terminal` chrome.
- The cursor's appearance is already built (from PR #1): the `term-cursor` `@utility` and
  `@keyframes term-blink` live in `src/assets/styles/tailwind.css`. The cursor markup is
  `<span class="term-cursor" aria-hidden="true"></span>` (also wrapped in
  `src/components/ui/TermCursor.astro`). Do NOT restyle the cursor — only change WHERE it
  is placed.
- `.gc-term-prompt` is the dim italic "output line" container (also styled in
  `tailwind.css`). The home page uses it for a `› build complete …` line via `CodeBlock`'s
  `prompt` prop. The script reuses this same class as the cursor's container.
- View Transitions are ON (`ClientRouter` in `src/layouts/Layout.astro`). Scripts that
  mutate the DOM must run on every navigation, so bind to `astro:page-load`, which fires on
  initial load and after each swap. (The existing copy-to-clipboard script in
  `PageLayout.astro` uses event delegation instead, which is why it can bind once on
  `window` — our DOM mutation needs the per-page event.)
- `text-muted` is text-only; cursor color comes from `--gc-term-cyan` via the
  `term-cursor` utility — already correct in light and dark mode.

## File Structure

- **Modify** `src/components/ui/CodeBlock.astro` — remove the `cursor` prop and its
  rendering branch; keep the `prompt` prop and the `.gc-term-prompt` line. (`TermCursor`
  import is no longer needed here.)
- **Modify** `src/pages/index.astro` — remove the `cursor` attribute from the home-page
  `<CodeBlock>` (keep `prompt`).
- **Modify** `src/layouts/PageLayout.astro` — add the guarded `astro:page-load` cursor
  placement script alongside the existing copy script.
- **Keep, unchanged** `src/components/ui/TermCursor.astro` and the `term-cursor` /
  `term-blink` / `.gc-term-prompt` CSS in `src/assets/styles/tailwind.css`.

> **Why no automated tests:** the project has no JS test runner (no vitest/jest/playwright),
> and this is a ~20-line DOM script. Standing up jsdom + a runner for one script is YAGNI.
> Verification is manual in the browser (Task 4) plus `npm run check`. Each code task ends
> with a commit.

---

### Task 1: Remove the `cursor` prop from `CodeBlock`

**Files:**

- Modify: `src/components/ui/CodeBlock.astro`

- [ ] **Step 1: Replace the component frontmatter and template**

Replace the ENTIRE contents of `src/components/ui/CodeBlock.astro` with:

```astro
---
import { Code } from 'astro:components';
import tronTheme from '~/theme/tron';

// Hand-placed code in the ghosted-Tron terminal chrome. Markdown fences get the
// same chrome automatically via the Shiki transformer; this is for code placed
// directly in .astro pages. Chrome styling lives in `.gc-terminal` (tailwind.css).
//
// Optional `prompt` renders a faux terminal output line under the code (the
// `›` line from design/ground-control.html). The blinking cursor is NOT placed
// here — a site-wide script (PageLayout.astro) drops one cursor on the LAST
// terminal of each page (see docs/superpowers/specs/2026-06-11-terminal-cursor-identity-design.md).
export interface Props {
  code: string;
  lang?: string;
  title?: string;
  prompt?: string;
}

const { code, lang = 'text', title, prompt } = Astro.props;
const label = title ?? lang;
---

<div class="gc-terminal">
  <div class="gc-term-head">
    <span class="gc-term-dot r"></span>
    <span class="gc-term-dot y"></span>
    <span class="gc-term-dot g"></span>
    <span class="gc-term-title">{label}</span>
    <span class="gc-term-copy" data-gc-copy>copy</span>
  </div>
  <Code code={code} lang={lang as never} theme={tronTheme} />
  {
    prompt && (
      <div class="gc-term-prompt">
        <span class="gc-term-prompt-mark">›</span> {prompt}
      </div>
    )
  }
</div>
```

- [ ] **Step 2: Verify nothing else still passes `cursor` to CodeBlock**

Run: `grep -rn "cursor" src/pages src/components --include="*.astro" | grep -i codeblock`
Expected: no output (the home page is fixed in Task 2; if any OTHER usage appears, remove its `cursor` attribute too).

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/CodeBlock.astro
git commit -m "refactor: remove cursor prop from CodeBlock (script owns placement)"
```

---

### Task 2: Remove the `cursor` attribute from the home page

**Files:**

- Modify: `src/pages/index.astro`

- [ ] **Step 1: Find the current usage**

Run: `grep -n "cursor" src/pages/index.astro`
Expected: a comment mentioning the cursor, plus a bare `cursor` attribute line inside the `<CodeBlock>` (around line 106).

- [ ] **Step 2: Remove the bare `cursor` attribute**

In the `<CodeBlock>` element, delete the line that is exactly the attribute `cursor` (the
last attribute before the self-closing `/>`). The element must become:

```astro
<CodeBlock
  code={heroSnippet}
  lang="ts"
  title="~/ground-control/src/content/config.ts"
  prompt="build complete — 0 errors, 12 routes"
/>
```

- [ ] **Step 3: Update the two stale comments to reflect automatic placement**

Replace the comment near the top of the frontmatter (currently begins
`// The one featured code snippet — the only place the blinking term-cursor lives`) with:

```astro
// The home page's featured code snippet. The blinking cursor is placed // automatically by the site-wide script
(PageLayout.astro) on the last terminal // of each page; on the home page that is this block.
```

Replace the inline HTML comment (currently
`<!-- THE TERMINAL ─ the one featured code snippet, the only place the cursor lives -->`)
with:

```astro
<!-- THE TERMINAL ─ the featured code snippet; the page's last terminal, so the cursor lands here -->
```

- [ ] **Step 4: Verify no `cursor` attribute remains**

Run: `grep -n "cursor" src/pages/index.astro`
Expected: only the two updated comments mention "cursor" — no bare `cursor` attribute line.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "refactor: drop manual cursor attr on home (script places it)"
```

---

### Task 3: Add the site-wide cursor-placement script

**Files:**

- Modify: `src/layouts/PageLayout.astro`

- [ ] **Step 1: Add the cursor-placement script after the existing copy script**

In `src/layouts/PageLayout.astro`, immediately AFTER the closing `</script>` of the existing
copy-to-clipboard `<script>` block (the last lines of the file), append this new block:

```astro
<script>
  // "Which terminal is alive on this page" — places ONE blinking cursor on the
  // LAST .gc-terminal inside <main>; all other code blocks stay cursor-free.
  // See docs/superpowers/specs/2026-06-11-terminal-cursor-identity-design.md.
  // Runs on astro:page-load so it fires on first load AND after every View
  // Transition navigation. Cursor is decorative (aria-hidden), so no-JS loses
  // nothing.
  function gcPlaceTerminalCursor() {
    // Idempotency: never add a second cursor to a page.
    if (document.querySelector('.term-cursor')) return;

    const main = document.querySelector('main');
    if (!main) return;

    const terminals = main.querySelectorAll('.gc-terminal');
    if (terminals.length === 0) return;

    const last = terminals[terminals.length - 1];

    const cursor = document.createElement('span');
    cursor.className = 'term-cursor';
    cursor.setAttribute('aria-hidden', 'true');

    // If the last terminal already has an output line (the home page's
    // `› build complete …`), tuck the cursor inline at its end; otherwise add a
    // trailing line holding just the cursor (plain blog/work fences).
    const existingPrompt = last.querySelector<HTMLElement>(':scope > .gc-term-prompt');
    if (existingPrompt) {
      existingPrompt.appendChild(document.createTextNode(' '));
      existingPrompt.appendChild(cursor);
    } else {
      const line = document.createElement('div');
      line.className = 'gc-term-prompt';
      line.appendChild(cursor);
      last.appendChild(line);
    }
  }

  document.addEventListener('astro:page-load', gcPlaceTerminalCursor);
</script>
```

- [ ] **Step 2: Type/lint/format check**

Run: `npm run check`
Expected: PASS — no astro-check type errors, no eslint errors, prettier clean. (If prettier
flags formatting, run `npm run fix` and re-run `npm run check`.)

- [ ] **Step 3: Commit**

```bash
git add src/layouts/PageLayout.astro
git commit -m "feat: auto-place terminal cursor on last code block per page"
```

---

### Task 4: Manual browser verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run: `npm run dev`
Expected: server ready at `http://localhost:4321/`.

- [ ] **Step 2: Home page — one cursor, inline with the prompt line**

Open `http://localhost:4321/`. Scroll to the "01 — the terminal" section.
Expected: the `› build complete — 0 errors, 12 routes` line ends with the blinking glowing
cursor INLINE (one line, not a lonely cursor underneath). No second cursor anywhere on the
page.

- [ ] **Step 3: Blog post with MULTIPLE code fences — cursor on the LAST fence only**

Open a blog post that has 2+ fenced code blocks (e.g. browse `/` → recent writing, or check
`src/data/post/` for a post with multiple fences and open its URL).
Expected: only the LAST code block shows a cursor — on its own trailing line just under the
code. Every earlier fence is cursor-free. Prose is unaffected.

- [ ] **Step 4: Blog post with ONE fence — that fence gets the cursor**

Open a post with exactly one code block.
Expected: that single block shows the trailing-line cursor.

- [ ] **Step 5: A page with NO code — no cursor, no console errors**

Open `/about` (or `/tags`).
Expected: no cursor; browser console shows no errors from `gcPlaceTerminalCursor`.

- [ ] **Step 6: `/work` case study with code — last terminal gets the cursor**

Open a `/work/<slug>` entry that contains code.
Expected: cursor on the last terminal only.

- [ ] **Step 7: View-Transition navigation — cursor re-places, never doubles**

From the home page, click into a blog post and back, then into a `/work` entry — using
in-site links (View Transitions, no full reload).
Expected: each destination shows exactly ONE cursor on its last terminal; navigating back to
home still shows exactly one (no stacked/duplicate cursors).

- [ ] **Step 8: Dark mode parity**

Toggle dark mode (header toggle) on the home page and on a blog post.
Expected: the cursor reads identically in both modes (it lives on the always-dark term
surface).

- [ ] **Step 9: Final full check**

Run: `npm run check`
Expected: PASS.

---

## Self-Review notes (for the implementer)

- **Spec coverage:** last-block-only placement (Tasks 3, 4.3), trailing-line slot /
  inline-on-prompt (Task 3 + 4.2/4.3), `cursor` prop removed (Task 1), home page kept with
  prompt (Task 2), dark-mode parity (4.8), no-JS/aria-hidden (script comment + decorative
  span), View-Transition re-placement (4.7) — all covered.
- **No double cursor:** guarded three ways — `cursor` prop removed so no component emits one,
  the `if (document.querySelector('.term-cursor')) return;` idempotency guard, and
  `astro:page-load` giving fresh per-page DOM.
- **Naming consistency:** the function is `gcPlaceTerminalCursor` and the cursor class is
  `term-cursor` everywhere; the container class is `.gc-term-prompt` everywhere.
