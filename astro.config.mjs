// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkBreaks from 'remark-breaks';
import { rehypeFigures } from './src/figures.ts';

// A project site: GitHub Pages serves this repo at lbds137.github.io/blog/, so every
// internal link goes through import.meta.env.BASE_URL. lbds137.github.io itself is a
// different repo and is never touched from here.
export default defineConfig({
  site: 'https://lbds137.github.io',
  base: '/blog',
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    // Posts embed images at the resolution Blogger exported them at; 'constrained' gives
    // each one a multi-width srcset (the intrinsic width as the desktop slot), so phones
    // download a fraction of the bytes.
    layout: 'constrained',
  },
  markdown: {
    // The posts came from Blogger through pandoc with no wrapping, so a newline inside a
    // paragraph is a line break the author made (poems, quoted verse).
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [rehypeFigures],
  },
});
