---
title: 'Ground Control — this portfolio'
excerpt: 'How I rebuilt the AstroWind starter into a calm, editorial portfolio and blog, with a steel palette, a comic avatar, and terminal-styled code blocks.'
thumbLabel: 'ground control'
publishDate: 2026-06-01T00:00:00Z
year: 2026
role: 'Design + build'
stack:
  - Astro
  - Tailwind v4
  - TypeScript
  - Shiki
tags:
  - astro
  - design-system
sourceUrl: 'https://github.com/sherajdev/astro-groundcontrol'
featured: true
order: 1
---

This is the site you're reading. I didn't start it from scratch. It's built on
[AstroWind](https://astrowind.vercel.app/), a free Astro 6 + Tailwind starter (that
link goes to the template's own demo, which is roughly where mine looked on day one).
AstroWind gets you a working, fast site in minutes. The problem is it looks like a SaaS
landing page, and I wanted a portfolio with a real blog attached. So most of the work
was subtraction, then giving what was left a face.

The look I was going for is calm and a little severe: muted steel, IBM Plex Mono on
every label, lots of white space, and exactly one thing shouting on any given screen.

## Stripping the template down

Out of the box AstroWind is loaded with marketing parts I'd never use, like hero
variants, pricing tables, feature grids, FAQs, testimonials, and call-to-action
blocks. I deleted all of it.

What I kept is the boring, useful machinery underneath: the blog content collection,
RSS, tags and categories, MDX support, reading-time, the SEO meta, and the sitemap.
The base layout, header, footer, and the existing dark-mode toggle stayed too. After
that pass I had a portfolio-and-blog skeleton that still booted but had no opinions of
its own yet.

The opinions come from one file. The whole design lives in a static
`design/ground-control.html` mockup, and I built every component to match that instead
of designing in my head as I went. When something looked off, I had a reference to
check it against.

## Theming without a fight

Re-skinning a template usually turns into a game of whack-a-mole where you override one
component, find three more, and never quite win. I avoided that. Ground Control defines
its own semantic tokens (page surface, ink, hairlines, the steel accent, the spot
color) and then I pointed AstroWind's internal `--aw-color-*` variables at those
tokens. After that, AstroWind's own components just inherited the theme, light and dark
both, without me touching them one by one.

```css title="src/assets/styles/tailwind.css"
/* GC tokens flip automatically in dark mode */
:root {
  --gc-bg: #f4f1ea; /* paper */
  --gc-ink: #1a1a1a; /* soft black */
  --gc-steel: #5b7a8c; /* the calm accent */
  --gc-spot: #c0560a; /* burnt orange — once per page */
}
.dark {
  --gc-bg: #14171a;
  --gc-ink: #e8e6e0;
}
```

I also swapped out AstroWind's Inter for three fonts, all served through Fontsource:
Bricolage Grotesque for headings, Newsreader for the body copy, and IBM Plex Mono for
anything that reads as metadata or code.

## One loud thing per page

The rule I kept coming back to is that each page gets a single spot color and a single
loud element, and that's it. When everything is restrained, the one thing you let off
the leash actually lands. Everything else is 1px hairlines and space. No heavy borders,
no drop shadows.

## A terminal for every code block

The bit I'm most happy with is the code styling. Rather than make a one-off
terminal-looking component, I wired it into the markdown pipeline so every fenced block
on the site gets the same treatment. They all run through a custom Shiki theme and a
small transformer that wraps each one in faux-terminal chrome.

```ts title="src/theme/tron.ts"
// fixed syntax tones — the terminal is always dark, in both modes
const tron = {
  name: 'gc-tron',
  type: 'dark',
  settings: [
    { scope: 'comment', settings: { foreground: '#6E8799', fontStyle: 'italic' } },
    { scope: 'keyword', settings: { foreground: '#74BBD8' } },
    { scope: 'string', settings: { foreground: '#86B8A6' } },
  ],
};
```

It's got a faint grid, slow scanlines, window dots, and a low cyan glow. I kept dialing
the glow down until it stopped looking like a screensaver. If you put a `title="…"` on
a fence it shows up in the window bar, and there's a copy button on every block.

## The comic panel

There's one drawn avatar panel that breaks the calm on purpose: a 3px ink border, a
hard 7px offset shadow, a halftone pattern rotated behind it, tilted about a degree and
a half. The border and shadow are drawn with the ink token, so the frame still works
when the page flips to dark. I only let it show up twice, on the home hero and the
about page, because it's meant to be the loud thing and putting it everywhere would
ruin that.

## The pages

- **Home** opens with a big headline next to the comic panel, then a grid of featured
  work, then a few of the latest posts.
- **`/work`** has its own content collection (fields like `thumbLabel`, `year`, `role`,
  `stack`, `featured`, `order`) and renders as project cards with halftone thumbnails.
  This write-up is one of those entries.
- **The blog** is AstroWind's blog plumbing wearing the new theme: featured cards on
  top of a quiet dated list, posts set in Newsreader with mono metadata and reading
  time, the terminal code blocks, and tag chips. RSS, `/tags`, and `/categories` all
  still work.
- There's also an **about** page and a custom **404** built out of the same terminal.

## How it got built

I built the whole thing with Claude Code, one step at a time, stopping to review after
each of eight stages: strip the template, set up tokens and fonts, the header and
footer, the core components and code pipeline, then home, work, the blog, and finally
the about and 404 pages. There's a `CLAUDE.md` at the repo root spelling out the design
rules so I don't drift between sessions. It's deployed on Cloudflare Pages.
