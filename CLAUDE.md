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
- Node 24, pnpm 10 (`packageManager` pin). `pnpm build` = `astro check && astro build`.
- The shell's setup mirrors ~/Projects/the-night-house (deploy.yml, CodeQL, Dependabot).
