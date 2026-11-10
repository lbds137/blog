# blog

An Astro site on GitHub Pages, served at <https://lbds137.github.io/blog/>.

- Posts: one Markdown file each in `src/content/posts/` (`title`, `date`, optional
  `originalUrl` for posts moved from Blogger).
- `pnpm dev` to preview; `pnpm build` runs `astro check` and the build.
- Pushes to `main` deploy through `.github/workflows/deploy.yml` (the repo's Pages source is
  "GitHub Actions").

The code is MIT-licensed (`LICENSE`). Posts and images in `src/content/posts/` are © 2013-2026 Vladlena Costescu, all rights reserved; the MIT license does not cover them.
