// Renders a post's Open Graph card (1200×630 PNG): the post's title and summary under the site's
// sigil and name, in the colors of public/og-card.png (the site-wide card, from
// scripts/og-card.mjs). satori turns the text into paths with the fonts loaded here from
// node_modules, so the build needs no system fonts; sharp rasterizes the SVG.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_TITLE } from './site';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const INK = '#000000';
const TEXT = '#ece6da';
const MUTED = '#a89fae';
const GOLD = '#ffd700';
const PLUM = '#4a1942';

// fontsource's `exports` map only exposes its CSS, so the font files are read by path. Astro
// builds from the project root, the directory holding node_modules.
const FONT_DIR = join(process.cwd(), 'node_modules/@fontsource/noto-serif/files');

let fonts: Promise<Parameters<typeof satori>[1]['fonts']> | undefined;
function loadFonts() {
  const load = (file: string) => readFile(join(FONT_DIR, file));
  fonts ??= Promise.all([
    load('noto-serif-latin-400-normal.woff'),
    load('noto-serif-latin-400-italic.woff'),
  ]).then(([regular, italic]) => [
    { name: 'Noto Serif', data: regular, weight: 400, style: 'normal' },
    { name: 'Noto Serif', data: italic, weight: 400, style: 'italic' },
  ]);
  return fonts;
}

// The sigil from src/components/Sigil.astro (stroke 1.6), in gold.
const SIGIL = `data:image/svg+xml;base64,${Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="${GOLD}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="16" cy="16" r="13.5" />
  <path d="M11 9.6a7 7 0 0 1 10 0" />
  <path d="M16 6.5v19" />
  <path d="M16 13h-4.5l-3 3" />
  <path d="M16 19h4.5l3-3" />
  <circle cx="16" cy="6.5" r="1.4" fill="${GOLD}" />
  <circle cx="16" cy="25.5" r="1.4" fill="${GOLD}" />
  <circle cx="8.5" cy="16" r="1.4" fill="${GOLD}" />
  <circle cx="23.5" cy="16" r="1.4" fill="${GOLD}" />
</svg>`,
).toString('base64')}`;

type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderCard(title: string, description?: string): Promise<Buffer> {
  const card = h(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      // satori sizes boxes as content-box by default, which would add the padding to the card.
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      padding: '56px 80px',
      backgroundColor: INK,
      backgroundImage: `radial-gradient(circle at 120px 100px, ${PLUM}cc 0%, ${INK}00 420px)`,
      fontFamily: 'Noto Serif',
      color: TEXT,
    },
    [
      h('div', { display: 'flex', alignItems: 'center' }, [
        h('img', { width: 72, height: 72 }, undefined, { src: SIGIL, width: 72, height: 72 }),
        h('div', { marginLeft: 24, fontSize: 36, color: TEXT }, SITE_TITLE),
      ]),
      h('div', { width: 140, height: 2, marginTop: 24, backgroundColor: PLUM }),
      // Fixed line caps keep the layout inside the card: two title lines hold ~56 characters
      // (the longest title is 50), four description lines ~280 (the longest is 265). satori's
      // ellipsis cuts mid-word, so the caps sit above what posts use.
      h(
        'div',
        { display: 'block', marginTop: 28, fontSize: 64, lineHeight: 1.15, lineClamp: 2 },
        title,
      ),
      description
        ? h(
            'div',
            {
              display: 'block',
              marginTop: 20,
              fontSize: 32,
              fontStyle: 'italic',
              lineHeight: 1.35,
              color: MUTED,
              lineClamp: 4,
            },
            description,
          )
        : null,
      h('div', { marginTop: 'auto', fontSize: 24, color: MUTED }, 'lbds137.github.io/blog'),
    ].filter(Boolean),
  );
  // satori's types want a React element; a plain { type, props } tree is what it walks.
  const svg = await satori(card as unknown as Parameters<typeof satori>[0], {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: await loadFonts(),
  });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
