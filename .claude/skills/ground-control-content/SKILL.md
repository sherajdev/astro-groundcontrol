---
name: ground-control-content
description: Use when authoring or editing content for this portfolio — a blog post (tutorial, review, opinion, YouTube writeup) or a /work project entry. Use when creating files in src/data/post/ or src/data/work/, embedding a YouTube/Tweet/Vimeo, or unsure which frontmatter fields, category, or .md-vs-.mdx to use.
---

# Ground Control — Content Authoring

## Overview
Content lives in two Astro content collections. Posts and work entries are plain
markdown with strict frontmatter; the design system does the styling. Your job is
**correct frontmatter + clean prose** — never hand-style HTML or invent CSS.

- Blog posts → `src/data/post/<slug>.md` (or `.mdx`) — schema: `post`
- Work projects → `src/data/work/<slug>.md` (or `.mdx`) — schema: `work`
- Schema source of truth: `src/content.config.ts`. If a field isn't there, it doesn't exist.

Filename = URL slug. Use lowercase-kebab (`stateless-polling.md` → `/work/stateless-polling`).

## Decide first: `.md` or `.mdx`?
Default to **`.md`**. Use **`.mdx`** ONLY when the body embeds a component:
`<YouTube>`, `<Tweet>`, `<Vimeo>`, or any `~/components/*`. A YouTube-review post is
`.mdx`; a plain tutorial is `.md`. Fenced code blocks do NOT require `.mdx` — they work
in both.

## Authoring workflow
1. Pick collection (`post` vs `work`) and `.md`/`.mdx`.
2. Copy the matching template (`references/blog-post.template.mdx` or
   `references/work-entry.template.md`) and fill the frontmatter.
3. Write the body — see Body rules.
4. **Re-read for voice** and strip AI tells — see Voice.
5. Set `draft: true` while in progress; remove it (or set `false`) to publish.
6. Verify: `npm run check` then `npm run build`. Both must pass.

## Frontmatter rules

### Blog post (`post`)
| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Plain string. |
| `publishDate` | ✅ in practice | ISO date, e.g. `2026-06-09T00:00:00Z`. **Controls ordering AND featuring** — the two newest posts lead page 1 as featured cards. There is no `featured` field for posts. |
| `excerpt` | strongly | 1–2 sentences; shown on cards and in SEO. |
| `category` | recommended | ONE per post. Reuse an existing value (`Tutorials`, `Documentation`) or add a deliberate new one — every distinct string spawns a `/category/<x>` page. |
| `tags` | recommended | Array, **lowercase-kebab** (`ground-control`, not `Ground Control`). Reuse existing tags; each spawns a `/tag/<x>` page, so casing drift fragments them. |
| `image` | optional | Renders as the post hero. Local (`~/assets/images/...`) or remote URL. |
| `author` | optional | Shows in the meta row. |
| `updateDate`, `metadata` | optional | `metadata` overrides SEO/OpenGraph (see schema). |

### Work entry (`work`)
| Field | Required | Notes |
|---|---|---|
| `title` | ✅ | Project name. |
| `excerpt` | strongly | One line; the card blurb. |
| `thumbLabel` | recommended | The big blended word on the card thumbnail. Short (1–2 words), lowercase reads best. Falls back to `title`. |
| `year` | recommended | Number. First half of the card meta row. |
| `role` | optional | e.g. `Design + build`. |
| `stack` | recommended | Array of tech. First **two** items show in the card meta row, so order them by importance. |
| `featured` | optional | `true` surfaces it on the home page. |
| `order` | optional | Lower sorts first on `/work` (ties break by newest `publishDate`). Give shipped/headline work low numbers. |
| `tags` | optional | lowercase-kebab, same discipline as posts. |
| `liveUrl`, `sourceUrl` | optional | Live demo / repo links. |
| `publishDate`, `draft`, `image`, `updateDate`, `metadata` | optional | As in posts. |

## Body rules
- **Prose is Newsreader serif; you write plain markdown.** Headings `##`/`###`, `**bold**`,
  `_italic_`, lists, blockquotes, tables — all pre-styled by `.gc-prose`. Don't add inline
  styles or raw `<div>` wrappers for layout.
- **One `#` h1 is the frontmatter `title`** — start the body at `##`.
- **All code goes in fenced blocks.** Every fence auto-wraps in the ghosted-Tron terminal
  chrome. Add a window title with fence meta:

  ````
  ```ts title="src/theme/tron.ts"
  const x = 1;
  ```
  ````
  Inline `` `code` `` stays plain — that's intended. Don't reach for `CodeBlock.astro`
  in markdown; it's for hand-placed code in `.astro` pages only.
- **Embeds (`.mdx` only)** — import once at the top of the body, then use the tag:

  ```mdx
  import { YouTube, Tweet, Vimeo } from 'astro-embed';

  <YouTube id="dQw4w9WgXcQ" />
  <Tweet id="https://twitter.com/user/status/123" />
  <Vimeo id="178430038" />
  ```
- **Reference posts** (study these for live formatting): `/ground-control-codeblocks`
  (code fences) and `/markdown-elements-demo-post` (every element + embeds). Source in
  `src/data/post/`.

## Voice — write like a person, not a model
These posts are written in **first person** by the site's owner. They should read like
a developer explaining their own work, not like generated copy. Default to plain,
specific, slightly informal prose. The point is to inform, not to impress.

**Do:**
- Write as "I". Say what you did, why you did it, and where it was annoying or fun.
- Use contractions (`it's`, `didn't`, `I'd`).
- **Vary sentence length.** Follow a long sentence with a short one. Let some
  paragraphs be two sentences.
- Be concrete. Name the actual file, number, or trade-off instead of an abstraction.
- It's fine to have an opinion ("the bit I'm most happy with", "I'd never use it").

**Don't — these are the AI tells. Cut them:**
| Tell | Instead |
|---|---|
| Em-dash on every other line | Use a period, comma, or parentheses. One em-dash per few paragraphs, max. |
| "It's not just X — it's Y" / "isn't just X, it's Y" | State the thing plainly. Drop the reversal. |
| Rule-of-three flourishes ("fast, clean, and calm") | Two items, or a normal list. Triads everywhere = a model wrote it. |
| Aphoristic closers ("Scarcity reads as confidence.") | Delete them, or make it a plain observation. |
| Hedging ("it's worth noting", "arguably", "in many ways") | Just say it. |
| Inflated verbs ("leverage", "utilize", "boasts", "seamless", "robust", "elevate", "delve") | "use", "has", "works", plain words. |
| Every sentence balanced/parallel | Break the symmetry on purpose. |
| A tidy "In conclusion" wrap-up | End on a concrete detail or a real next step. |
| Section opener that restates the heading | Start with the actual content. |

**Before / after** (real edit from `/work/ground-control`):
> ❌ The terminal isn't just a hand-placed component — it's how _all_ code renders. Faint
> grid, drifting scanlines, low-glow cyan — without turning into a screensaver.
>
> ✅ Rather than make a one-off terminal component, I wired it into the markdown pipeline
> so every fenced block gets the same treatment. I kept dialing the glow down until it
> stopped looking like a screensaver.

When you finish a draft, **re-read it once just for voice** and strip anything from the
table above. A post that passes `npm run build` can still read like a robot.

## Design guardrails (from CLAUDE.md — honor them)
- Use semantic tokens only; **never raw hex or `dark:` classes** in any embedded HTML.
- One spot color, one loud thing per screen — don't pile on emphasis.
- Test a post with code/embeds in **both light and dark mode** before publishing.

## Common mistakes
| Mistake | Fix |
|---|---|
| `.md` file with a `<YouTube>` tag | Rename to `.mdx` — components need MDX. |
| Adding `featured: true` to a blog post | Posts have no `featured` field; feature via newest `publishDate`. |
| `tags: [Astro, ground control]` | lowercase-kebab: `[astro, ground-control]`. |
| New category for a one-off | Reuse an existing category unless a new section is truly warranted. |
| Hand-writing terminal HTML around code | Just use a fenced block; the pipeline wraps it. |
| Starting body with `# Title` | Title comes from frontmatter; start at `##`. |
| Inventing a frontmatter field | Check `src/content.config.ts` — unknown fields fail the build. |
| Prose full of em-dashes, triads, "isn't just X, it's Y" | Reads as AI. Do a voice pass — see Voice. |
| Third-person/detached "the developer built…" tone | Write in first person; it's the owner's own post. |

## Verify before done
`npm run check && npm run build` must both pass. A bad date format, unknown field, or
`.md` containing a component will fail the build — that's the signal to fix frontmatter
or rename to `.mdx`.
