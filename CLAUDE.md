# CLAUDE.md

Astro static site, deployed to GitHub Pages as a **project site** at lbds137.github.io/blog/.

- `base: '/blog'`: build every internal link with `url()` from `src/lib.ts`, never a bare `/path`.
- Known exception: the older posts hard-code `/blog/` in their internal links (~9 files). Leave
  them; switch a post to `url()` only when it is already open for another edit.
- `lbds137.github.io` is a separate repo (a Google Cloud project's homepage and legal pages). Never
  change it from here. Consequence: this repo's `public/robots.txt` is inert — crawlers only
  honor robots.txt at the host root, which that repo owns. Sitemap discovery therefore needs
  Search Console (or a root-repo line), not this file.
- Posts live in `src/content/posts/*.md` (schema in `src/content.config.ts`). Every post gets a
  deadname pass before it is committed: the repo is public.
- Node 24, pnpm 10 (`packageManager` pin). `pnpm build` = `astro check && pnpm test && astro build`
  (withastro/action runs it in CI); `pnpm test` = `vitest run`, tests next to the code
  (`src/lib.test.ts`).
- The `@emnapi/runtime` ^1.11.3 devDependency only pins `@astrojs/check`'s optional peer: left to
  pnpm it resolves to 2.0.0-beta.2, which crashes on import, and `astro check` then misreports
  "@astrojs/check and typescript are required". Drop it once `pnpm why @emnapi/runtime` without
  it shows no 2.x under `@astrojs/check`.
- The `retext` and `retext-smartypants` pins (`smartQuotes` in `src/lib.ts`, for front-matter
  text) track the versions Astro's Markdown uses via `remark-smartypants`, so card and meta text
  curl like the post body. On an Astro bump, check `pnpm why retext-smartypants` shows one version.
- Each post's Open Graph card is `og/<id>.png` (`src/pages/og/[id].png.ts`), a stable URL, so
  Facebook keeps its cached copy: after editing a post's title or description, re-scrape the post
  in Facebook's Sharing Debugger (developers.facebook.com/tools/debug).
- The shell's setup mirrors ~/Projects/the-night-house (deploy.yml, CodeQL, Dependabot).
