# BUILD.md — Ground Control Portfolio + Blog

A complete runbook: clone AstroWind → re-theme to Ground Control → add a blog →

deploy to Cloudflare Pages. Follow top to bottom. Steps marked **[CC]** are where
you hand work to Claude Code; the rest you do yourself.

---

## Build status (Claude Code steps, see §3)
- [x] **1.** Strip to portfolio+blog baseline
- [x] **2.** Foundation — tokens, fonts, `/styleguide`
- [x] **3.** Re-skin Header + Footer
- [x] **4.** Core components + ghosted-Tron code pipeline
- [x] **5.** Home — hero + comic panel, featured work, recent writing
- [x] **6.** `/work` index + `/work/[slug]`
- [x] **7.** Blog re-skin (index, post detail, tags, categories)
- [x] **8.** `/about` + custom 404

---

## 0. Prerequisites
- **Node ≥ 22.12.0** (AstroWind requires it). Check: `node -v`. Use nvm if needed.
- A GitHub account, a Cloudflare account, VS Code with the Claude Code extension.
- Have these three files ready to drop in: `design/ground-control.html` (the design
  system page), `CLAUDE.md`, and `gc-theme.css`.

---

## 1. Get AstroWind into your GitHub
Use the template button so you get a clean repo (not a linked fork):
1. Open the AstroWind repo (the one behind https://astrowind.vercel.app/).
2. Click **Use this template → Create a new repository**.
3. Owner = your account, name it e.g. `portfolio`, set visibility, **Create**.
4. Clone it locally and install:
   ```bash
   git clone https://github.com/<you>/portfolio.git
   cd portfolio
   npm install
   npm run dev          # confirm AstroWind boots at http://localhost:4321
   ```
   Commit this untouched baseline first: `git commit -am "chore: AstroWind baseline"`.

---

## 2. Drop in the design assets
```bash
mkdir design
# copy ground-control.html  -> design/ground-control.html
# copy CLAUDE.md            -> ./CLAUDE.md   (repo root)
# copy gc-theme.css         -> keep handy; its contents go into tailwind.css in step 4
git add -A && git commit -m "docs: add Ground Control design system + CLAUDE.md"
```
Open the repo in VS Code. Claude Code auto-reads `CLAUDE.md` at the root.

---

## 3. [CC] Kick off — paste this prompt into Claude Code
> I'm building my dev portfolio **with a blog** on top of the AstroWind template in
> this repo (Astro 6 + Tailwind v4). The target look is fixed and lives in
> `design/ground-control.html` — open it and treat it as the SINGLE source of truth.
> Read `CLAUDE.md` first; follow its five principles. Don't invent a new style.
>
> Work in the order below. **Pause for my review after each step.** Run the dev server
> and tell me exactly what to look at, then wait.
>
> 1. ✅ **DONE** — Strip AstroWind to a portfolio+blog baseline: KEEP the blog content collection,
>    RSS, tags, categories, MDX, reading time, SEO, sitemap, BaseLayout, Header,
>    Footer, and the existing dark-mode toggle. DELETE the marketing widgets (Hero
>    variants, Pricing, Features, Steps, FAQs, CallToAction, testimonials). Confirm
>    `npm run dev` still runs clean.
> 2. ✅ **DONE** — Foundation: paste my Ground Control tokens into `src/assets/styles/tailwind.css`
>    (I'll provide them), swap AstroWind's Inter for the three Fontsource fonts
>    (Bricolage Grotesque, Newsreader, IBM Plex Mono), and remap AstroWind's
>    `--aw-color-*` vars to our tokens. Build a `/styleguide` page rendering the
>    swatches + type scale so we confirm the foundation — in BOTH light and dark.
> 3. ✅ **DONE** — Re-skin Header (mono nav, keep the theme toggle) + Footer (include the RSS link).
> 4. ✅ **DONE** — Core components: ProjectCard (halftone thumb), ListRow, Pill/Badge, Button
>    (solid/ghost/steel), ComicPanel (3px ink border, hard 7px offset shadow,
>    counter-rotated halftone backdrop, ~1.6° tilt), and the ghosted-Tron CodeBlock.
>    THEN wire the markdown pipeline: configure Shiki with a custom theme from the
>    `term-*` tones and wrap every code fence in the terminal chrome (faint grid,
>    scanlines, window dots, low-glow cyan). Verify with a sample post containing a
>    fenced TS + bash block.
> 5. ✅ **DONE** — Home: hero (display headline + comic panel) → featured work grid → a "recent
>    writing" teaser pulling the latest 3 blog posts.
> 6. ✅ **DONE** — /work index + /work/[slug] project detail.
> 7. ✅ **DONE** — Blog, re-skinned: index (featured cards + calm dated list, JSDev layout
>    recolored), post detail (Newsreader prose, Bricolage headings, mono meta +
>    reading time, Tron code blocks, tag chips), /tags + /categories. Keep RSS working.
> 8. ✅ **DONE** — /about (uses the comic panel) + custom 404.
>
> Keep it pixel-honest to `design/ground-control.html`; if you deviate, say why first.

When Claude Code reaches step 2 and asks for the tokens, paste the full contents of
`gc-theme.css` (everything after AstroWind's existing `@import "tailwindcss";`).

---

## 4. Foundation checkpoint (after step 2)
Before going further, eyeball `/styleguide` and confirm:
- [ ] Paper background, soft-black ink text, dusty steel accent — matches the HTML.
- [ ] Three fonts loading: Bricolage (display), Newsreader (body), Plex Mono (labels).
- [ ] Dark toggle flips the whole page; steel links go lighter, terminal stays dark.
- [ ] Burnt-orange spot appears once, not scattered.
Fix here before building components — a wrong foundation multiplies downstream.

---

## 5. The terminal / Shiki checkpoint (after step 4)
This is the fiddliest part. In a sample post, add:
```ts
const ok: boolean = true;   // should glow faint cyan keywords
```
Confirm: comments dim italic, keywords cyan, strings green, numbers burnt, subtle
scanlines, window dots, readable contrast. Iterate tones here until legible — tell
Claude Code to keep the exact `term-*` values, not invent new ones.

---

## 6. Add your real content
- **Projects**: AstroWind stores content in a collection (recent versions:
  `src/data/post/`; some use `src/content/`). Ask Claude Code where yours lives, then
  add a `work` collection or reuse the post collection tagged `project`.
- **First blog post**: write one real `.md`/`.mdx` with a code block to exercise the
  terminal. Set the `site` URL in `astro.config.*` so RSS + sitemap generate correctly.
- Replace AstroWind's demo posts and sample images. Swap in your avatar art.

---

## 7. Deploy to Cloudflare Pages
1. Push to GitHub: `git push`.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
   pick the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
4. **Environment variables** → add `NODE_VERSION = 22.12.0` (Pages' default Node is
   older and will fail the AstroWind build without this).
5. Deploy. Then **Custom domains** → add your subdomain; Cloudflare adds the DNS
   record automatically if the zone is on your account. HTTPS is automatic.

---

## 8. Fine-tuning loop
- Keep iterating through Claude Code with small, specific asks ("tighten the card
  hover", "the terminal glow is too strong — halve the text-shadow alpha").
- Re-run the light/dark check after any color or component change.
- When the design settles, ask Claude Code to update `CLAUDE.md` with any new
  conventions so future sessions stay consistent.

---

## Quick reference
| Thing | Value |
|---|---|
| Node | ≥ 22.12.0 |
| Dev | `npm run dev` → :4321 |
| Build | `npm run build` → `dist` |
| Fonts | Bricolage Grotesque · Newsreader · IBM Plex Mono (Fontsource) |
| Tokens | `src/assets/styles/tailwind.css` (paste `gc-theme.css`) |
| Design truth | `design/ground-control.html` |
| Dark mode | AstroWind toggle (`html.dark`); tokens flip automatically |
| Deploy | Cloudflare Pages, `NODE_VERSION=22.12.0` |
