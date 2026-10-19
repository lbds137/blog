// Renders public/og-card.png (1200×630) for Open Graph / Twitter link previews.
// Re-run with `pnpm og-card` after changing the sigil (src/components/Sigil.astro) or the title
// or tagline (src/site.ts): the card keeps its own copy of each. Requires "Noto Serif" to be
// installed system-wide so sharp/librsvg can rasterize the text elements.
import sharp from 'sharp';

const root = new URL('../', import.meta.url);
const font = 'font-family="Noto Serif, serif"';
const italic = `${font} font-style="italic" font-size="32" fill="#a89fae"`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#4a1942" stop-opacity="0.55" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#000000" />
  <circle cx="260" cy="315" r="260" fill="url(#glow)" />
  <svg
    x="80"
    y="135"
    width="360"
    height="360"
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
  <text x="500" y="240" ${font} font-size="76" fill="#ece6da">Sigil &amp; Silicon</text>
  <rect x="500" y="274" width="140" height="2" fill="#4a1942" />
  <text x="500" y="336" ${italic}>Old magic, new circuits,</text>
  <text x="500" y="380" ${italic}>and whatever else strikes my fancy.</text>
  <text x="500" y="525" ${font} font-size="24" fill="#a89fae">lbds137.github.io/blog</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9 })
  .toFile(new URL('public/og-card.png', root).pathname);
