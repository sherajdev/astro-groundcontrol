---
title: 'Generic project entry'
excerpt: 'A simple placeholder case study that keeps the work page populated while the real project writeups are being edited.'
thumbLabel: 'project'
publishDate: 2026-06-16T00:00:00Z
year: 2026
role: 'Design + build'
stack:
  - Astro
  - TypeScript
  - Tailwind CSS
tags:
  - astro
  - portfolio
featured: false
order: 2
---

This is a quiet placeholder for the work page. I use entries like this when the layout
needs real content to breathe, but the final case study is still being shaped.

## What it does

The page shows the same card rhythm, metadata, and prose treatment as a finished
project. It gives the work index a second entry without pretending to be a shipped case
study.

## How it's built

It's plain markdown in the `work` collection. The card pulls from frontmatter, and the
body uses the same serif article layout as the rest of the portfolio.

```bash title="local preview"
npm run dev -- --host 0.0.0.0 --port 4323
```

When the real project is ready, this file can be replaced with a proper writeup and a
more specific thumbnail label.
