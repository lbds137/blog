// @ts-check
import { defineConfig } from 'astro/config';

// A project site: GitHub Pages serves this repo at lbds137.github.io/blog/, so every
// internal link goes through import.meta.env.BASE_URL. lbds137.github.io itself is a
// different repo and is never touched from here.
export default defineConfig({
  site: 'https://lbds137.github.io',
  base: '/blog',
  trailingSlash: 'always',
});
