---
title: 'Stateless polling with overlapping windows'
excerpt: 'A 10-minute poll with a 15-minute lookback kills stored state entirely — and triggers clean Cloudflare deploys.'
thumbLabel: 'learning bytes'
publishDate: 2026-05-12T00:00:00Z
year: 2026
role: 'Architecture + build'
stack:
  - Cloudflare Workers
  - Cron Triggers
  - TypeScript
tags:
  - cloudflare
  - architecture
featured: true
order: 2
---

A scheduled job that polls an upstream API usually needs to remember **where it left
off** — a cursor, a last-seen timestamp, some durable state. That state is a liability:
it drifts, it corrupts, it needs migrations.

## Overlap instead of state

Run the poll every 10 minutes, but **look back 15 minutes** every time. The windows
overlap by 5 minutes, so nothing slips through the cracks between runs — and you never
have to store a cursor at all. Downstream just needs to be idempotent.

```ts title="src/poll.ts"
export async function poll(now: number) {
  const LOOKBACK = 15 * 60_000; // 15 min, > the 10 min cadence
  const since = now - LOOKBACK;
  const items = await fetchSince(since);
  // idempotent upsert — overlap is harmless
  return upsertAll(items);
}
```

The cron config is the whole "state":

```bash title="wrangler.toml"
[triggers]
crons = ["*/10 * * * *"]
```

No KV, no D1, no cursor table. The deploy is clean because there's nothing to migrate.
