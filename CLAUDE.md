# CLAUDE.md — Ground Control Portfolio

Working agreement for Claude Code on this repo. Read this before any UI work.

## What this is
A personal developer portfolio **with a first-class blog**, built on the AstroWind
template (Astro 6 + Tailwind v4). The visual design is fixed and lives in
`design/ground-control.html` — that file is the single source of truth for the look.
Do not invent a new aesthetic; match it.

## The five principles (non-negotiable)
1. **One loud thing per screen.** The comic avatar, OR the terminal, OR a spot of
   orange — never two at once. Quiet is what makes the one loud thing land.
2. **Mono is the connective tissue.** Every label, date, tag, nav item, and code
   block uses IBM Plex Mono. It threads the "machine" feeling through the calm
   editorial body.
3. **Hairlines over boxes.** Separate with 1px lines (`border-line`) and whitespace,
   not heavy borders or drop shadows. Let the grid do the structural work.
4. **One spot color per page.** Burnt orange (`spot`) appears exactly once on any
   page — an active link, a status dot, a hover. Scarcity reads as confidence.
5. **Texture, not decoration.** `halftone` and `gridlines` live at low opacity. If a
   texture announces itself, dial it down.

## Type
- Display / headings → `font-display` (Bricolage Grotesque, 700/800)
- Body / prose → `font-body` (Newsreader serif, 400/500 + italic)
- Labels / nav / meta / code → `font-mono` (IBM Plex Mono)
- Reading width capped ~70ch. Body line-height 1.7+.
- Load all three via **Fontsource** (swap out AstroWind's Inter), not a CDN.

## Color (semantic tokens — defined in src/assets/styles/tailwind.css)
Use the token utilities, never raw hex in components.
- Surfaces: `bg-bg` (page), `bg-surface` (cards), `bg-surface-2`
- Text: `text-ink`, `text-ink-2`, `text-muted`, `text-faint`
- Lines: `border-line`, `border-line-strong`
- Accent: `steel`, `steel-deep` (links), `steel-soft` (fills), `steel-wash` (tints)
- Spot: `spot` — the once-per-page pop
These all flip automatically in dark mode. **Do not hand-write `dark:` colors for
them** — the tokens already handle it.

## Dark mode
AstroWind ships dark mode (class-based `html.dark`, toggled in the header). Keep that
toggle. Our tokens flip via `.dark` overrides in tailwind.css, so any component built
with the semantic tokens is dark-correct for free. Watch these:
- **ComicPanel**: border + offset shadow use `ink` (which flips) so the frame reads on
  both light and dark. The avatar image itself has a black background.
- **Terminal / code blocks**: `term-*` tokens are ALWAYS dark in both modes. In dark
  mode add `border-term-border` so the panel stays distinct from the page.
- Test every new component in BOTH modes before calling it done.

## The terminal = all code
The "ghosted Tron" terminal is not just a hand-placed component — it's how ALL code
renders, especially in blog posts. Wire the markdown code-fence pipeline (Shiki, custom
theme from `term-*` tones) so every fenced block gets the chrome: faint grid, drifting
scanlines, window dots, low-glow cyan. Syntax tones (keep exactly, don't invent):
- comment → `term-dim` italic · keyword → `term-cyan` · function → `term-blue`
- string → `term-green` · number → `term-spot` · prompt → `term-cyan`

## Blog is first-class
Keep AstroWind's blog plumbing: content collection, RSS, tags, categories, MDX,
reading time, SEO, sitemap. Re-skin it to Ground Control — JSDev-style index (featured
cards + calm dated list), Newsreader post body, mono meta, Tron code blocks. Delete
AstroWind's marketing widgets (Hero variants, Pricing, Features, Steps, FAQs, CTA,
testimonials).

## Working style
- Build one step at a time; run the dev server, tell me what to look at, then wait.
- Stay pixel-honest to `design/ground-control.html`. If you must deviate, say why first.
- **Reconcile, don't fight, AstroWind**: remap its `--aw-color-*` variables to our
  tokens so its components inherit the theme, rather than overriding piecemeal.

## Build progress
The 8-step plan lives in `BUILD.md` §3. Status:
- ✅ **1** baseline strip · ✅ **2** foundation (tokens/fonts/`/styleguide`) ·
  ✅ **3** Header + Footer · ✅ **4** core components + Tron code pipeline ·
  ✅ **5** Home (hero + comic panel, featured work, recent writing) ·
  ✅ **6** `/work` index + `/work/[slug]` (work collection, `.gc-prose`) ·
  ✅ **7** blog re-skin (index, post detail, `/tags`, `/categories`, RSS kept) ·
  ✅ **8** `/about` (comic panel) + custom 404 (Tron terminal)
- **All 8 steps complete.** Remaining: real content (posts/projects/bio,
  optimize avatar) + deploy to Cloudflare Pages (BUILD.md §7).

## Where things live (conventions established)
- **GC components** → `src/components/ui/`: `Pill`, `Button` (solid/ghost/steel/link),
  `ListRow`, `ProjectCard`, `ComicPanel`, `CodeBlock`. Prefer reusing these.
- **Tokens + component CSS** → `src/assets/styles/tailwind.css`. GC `--gc-*` tokens
  flip in `.dark`; registered as utilities via `@theme inline`. Pseudo-element/
  transform-heavy visuals (`.gc-comic*`, `.gc-pthumb`, `.gc-terminal*`) live here too.
- **`text-muted` is a `@utility`** (maps to `--gc-muted`); there is deliberately no
  `--color-muted` theme token, so `bg-muted`/`border-muted` don't exist — muted is text only.
- **Fonts + `--aw-*` remap** → `src/components/CustomStyles.astro` (Fontsource imports;
  `--aw-*` point at `--gc-*`, so AstroWind chrome inherits the theme in both modes).
- **Code pipeline** → markdown uses standard `markdown.shikiConfig` in `astro.config.ts`
  with `src/theme/tron.ts` (theme) + `src/theme/tronTerminal.ts` (transformer that wraps
  every fence in `.gc-terminal` chrome). `CodeBlock.astro` shares the same theme for
  hand-placed code. Copy-to-clipboard is a guarded site-wide script in `PageLayout.astro`.
- **Brand name** comes from `site.name` in `src/config.yaml` (currently "Ground Control").
- **Avatar** at `src/assets/images/avatar.png` (placeholder — large, optimize before launch).
