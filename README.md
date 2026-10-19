# blog

An Astro site on GitHub Pages, served at <https://lbds137.github.io/blog/>.

- Posts: one Markdown file each in `src/content/posts/` (`title`, `date`, optional
  `originalUrl` for posts moved from Blogger).
- `pnpm dev` to preview; `pnpm build` runs `astro check` and the build.
- Pushes to `main` deploy through `.github/workflows/deploy.yml` (the repo's Pages source is
  "GitHub Actions").

The code is MIT-licensed (`LICENSE`).
