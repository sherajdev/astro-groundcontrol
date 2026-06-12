---
publishDate: 2026-06-09T00:00:00Z
title: 'Ghosted-Tron code blocks'
excerpt: 'A pipeline check — every fenced block should render inside the terminal chrome with the Ground Control syntax tones.'
category: Tutorials
tags:
  - astro
  - ground-control
  - shiki
---

This post exists to verify the markdown code pipeline: a fenced **TypeScript**
block and a **bash** block, both wrapped in the ghosted-Tron terminal chrome —
faint grid, drifting scanlines, window dots, low-glow cyan.

The syntax tones should read: comment → dim italic, keyword → cyan,
function → steel-blue, string → green, number → burnt orange.

```ts title="src/content.config.ts"
// ground control — ship work, not noise
import { defineCollection, z } from 'astro:content';

const work = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    stack: z.array(z.string()),
    year: z.number().default(2026),
    shipped: z.boolean(),
  }),
});

export const collections = { work };
```

And a shell block — note the title comes from the fence meta:

```bash title="deploy.sh"
# build, then ship to cloudflare
npm run build
npx wrangler pages deploy ./dist --project-name ground-control
echo "shipped ✦"
```

Inline `code` stays inline and untouched — only fenced blocks get the chrome.
