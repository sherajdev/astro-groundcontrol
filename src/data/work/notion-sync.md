---
title: 'Notion-to-markdown build pipeline'
excerpt: 'Download Notion assets at build time and rewrite the markdown, before the expiring image URLs silently break the site.'
thumbLabel: 'notion sync'
publishDate: 2026-04-03T00:00:00Z
year: 2026
role: 'Build'
stack:
  - Node
  - Notion API
  - Markdown
tags:
  - node
  - tooling
order: 3
---

Notion makes a tempting CMS — until you ship it. Image URLs in Notion's API are
**signed and expire after about an hour.** Embed them directly and your site looks
fine at deploy and breaks by lunch.

## Fetch at build, rewrite the links

The fix is to treat Notion as a source, not a host. At build time, walk the exported
markdown, download every asset locally, and rewrite the URLs to point at your own
`/public` folder.

```ts title="scripts/notion-assets.ts"
const EXPIRING = /https:\/\/.*\.amazonaws\.com\/secure\/.+?\?.+/g;

async function localize(md: string) {
  for (const url of md.match(EXPIRING) ?? []) {
    const file = await download(url); // -> public/notion/<hash>.png
    md = md.replace(url, `/notion/${file}`);
  }
  return md;
}
```

Now the images are part of the build artifact. Nothing expires, and the site is the
same a year later as it is at deploy.
