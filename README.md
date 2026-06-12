# Ground Control

A customizable developer portfolio with a first-class blog, built on **[Astro v6](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/)**.

Calm editorial layout, IBM Plex Mono as connective tissue, a comic-panel avatar, and a "ghosted Tron" terminal that renders every code block — including the ones in blog posts. The visual design is fixed and lives in `design/ground-control.html` (the single source of truth for the look).

## Design principles

1. **One loud thing per screen** — the comic avatar, OR the terminal, OR a spot of orange. Never two at once.
2. **Mono is the connective tissue** — every label, date, tag, nav item, and code block uses IBM Plex Mono.
3. **Hairlines over boxes** — separate with 1px lines and whitespace, not heavy borders or shadows.
4. **One spot color per page** — burnt orange appears exactly once on any page.
5. **Texture, not decoration** — halftone and gridlines live at low opacity.

Type: Bricolage Grotesque (display) · Newsreader (body serif) · IBM Plex Mono (labels/meta/code), all loaded via Fontsource. Class-based dark mode flips automatically via semantic tokens.

See [`CLAUDE.md`](./CLAUDE.md) for the full working agreement and `BUILD.md` for the original build plan.

## Built on AstroWind

This site is built on the [**AstroWind**](https://github.com/arthelokyo/astrowind) template by [arthelokyo](https://github.com/arthelokyo) — the blog plumbing (content collections, RSS, tags, categories, MDX, reading time, SEO, sitemap) is kept and re-skinned to Ground Control. AstroWind is licensed under MIT (see [LICENSE](./LICENSE.md)).

To start a fresh AstroWind project of your own:

```shell
npm create astro@latest -- --template arthelokyo/astrowind
```

## Getting started

> **Note:** Requires **Node.js >= 22.12.0**.

```shell
npm install      # install dependencies
npm run dev      # start dev server at localhost:4321
```

### Commands

| Command             | Action                                             |
| :------------------ | :------------------------------------------------- |
| `npm install`       | Installs dependencies                              |
| `npm run dev`       | Starts local dev server at `localhost:4321`        |
| `npm run build`     | Build your production site to `./dist/`            |
| `npm run preview`   | Preview your build locally, before deploying       |
| `npm run check`     | Check your project for errors                      |
| `npm run fix`       | Run ESLint and format code with Prettier           |
| `npm run astro ...` | Run CLI commands like `astro add`, `astro preview` |

## Where things live

- **GC components** → `src/components/ui/` (`Pill`, `Button`, `ListRow`, `ProjectCard`, `ComicPanel`, `CodeBlock`)
- **Tokens + component CSS** → `src/assets/styles/tailwind.css` (`--gc-*` tokens flip in `.dark`)
- **Fonts + `--aw-*` remap** → `src/components/CustomStyles.astro`
- **Code pipeline** → `astro.config.ts` (`markdown.shikiConfig`) + `src/theme/tron.ts` + `src/theme/tronTerminal.ts`
- **Content** → blog posts in `src/data/post/`, work projects in `src/data/work/`
- **Site config / brand name** → `src/config.yaml`

## Customize it

Before publishing your own site:

- Replace the placeholder copy in `src/pages/about.astro`.
- Replace `src/assets/images/avatar.png` with your own artwork.
- Update site metadata and deployment URL in `src/config.yaml`.
- Update project links and demo content in `src/data/work/` and `src/data/post/`.
- Update navigation and social links in `src/navigation.ts`.

## Deploy

Build a production bundle with `npm run build` (output in `dist/`), then deploy to any static host. This project targets **Cloudflare Pages** (see `BUILD.md` §7).

## License

Licensed under the MIT license — see [LICENSE](./LICENSE.md).
