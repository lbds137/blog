// Renders public/apple-touch-icon.png (180×180) for iOS home-screen bookmarks, from the same
// sigil drawing as src/components/Sigil.astro (og-card.mjs's source; not favicon.svg, whose
// stroke weights differ). Re-run with `pnpm apple-touch-icon` after changing the sigil — Unlike the SVG favicon, the background must be opaque: iOS composites transparency
// onto black. Same pipeline as og-card.mjs (sharp rasterizing an inline SVG); no text, so no
// system font is needed.
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = new URL('../', import.meta.url);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4a1942" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="180" height="180" fill="#000000" />
  <circle cx="90" cy="90" r="90" fill="url(#glow)" />
  <svg
    x="14"
    y="14"
    width="152"
    height="152"
    viewBox="0 0 32 32"
    fill="none"
    stroke="#ffd700"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="16" cy="16" r="13.5" />
    <path d="M11 9.6a7 7 0 0 1 10 0" />
    <path d="M16 6.5v19" />
    <path d="M16 13h-4.5l-3 3" />
    <path d="M16 19h4.5l3-3" />
    <circle cx="16" cy="6.5" r="1.4" fill="#ffd700" />
    <circle cx="16" cy="25.5" r="1.4" fill="#ffd700" />
    <circle cx="8.5" cy="16" r="1.4" fill="#ffd700" />
    <circle cx="23.5" cy="16" r="1.4" fill="#ffd700" />
  </svg>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL('public/apple-touch-icon.png', root)));
