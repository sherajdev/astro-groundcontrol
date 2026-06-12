---
# Rename this file to <slug>.md (or .mdx if you embed components) in src/data/work/
title: 'Project name'
excerpt: 'One line — the card blurb. What it does, in plain language.'
thumbLabel: 'project' # big blended word on the card thumbnail; short, lowercase reads best
publishDate: 2026-06-09T00:00:00Z
year: 2026 # number; first half of the card meta row
role: 'Design + build' # optional
stack: # first TWO items show in the card meta — order by importance
  - Astro
  - TypeScript
tags: # lowercase-kebab
  - astro
  - tooling
# liveUrl: 'https://example.com'
# sourceUrl: 'https://github.com/you/repo'
featured: false # true surfaces it on the home page
order: 10 # lower sorts first on /work (ties break by newest publishDate)
# draft: true
---

Open with what the project is and the problem it solved. Start the body at `##`; the
title above is the page h1.

## What it does

Plain serif prose. Keep it to a tight writeup — what it does and how it was built.

## How it's built

Code renders in the terminal chrome automatically. Title the window with `title="..."`:

```ts title="scripts/example.ts"
const result = await build();
```

Close with the outcome — what shipped, what you'd change. Verify with
`npm run check && npm run build`.
