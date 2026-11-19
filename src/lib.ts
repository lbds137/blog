import { retext } from 'retext';
import retextSmartypants from 'retext-smartypants';

// Prefixes a site-relative path with the project-site base (/blog/).
export function url(path = ''): string {
  return `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

// A link target, allowing one level of parentheses inside it (Wikipedia's `Foo_(bar)`).
const TARGET = String.raw`\((?:[^()]|\([^()]*\))*\)`;
const IMAGE = new RegExp(String.raw`!\[[^\]]*\]${TARGET}`, 'g');
const LINK = new RegExp(String.raw`\[([^\]]*)\]${TARGET}`, 'g');

function plainText(markdown: string): string {
  return markdown
    .replace(IMAGE, '')
    .replace(LINK, '$1')
    .replace(/^[>\s]*(?:#+|[-*+]|\d+\.)?\s+/gm, '')
    // Emphasis and code markers in pairs, so `snake_case` and `2*3` keep theirs.
    .replace(/(?<![\w*`])(\*\*|__|\*|_|`)(\S(?:.*?\S)?)\1(?![\w*`])/g, '$2')
    .replace(/\\(.)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// A post's first paragraph with text in it, as plain text cut at a word boundary.
export function excerpt(body: string, max: number): string {
  const text = body.split(/\n\s*\n/).map(plainText).find((p) => p) ?? '';
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return `${text.slice(0, cut > 0 ? cut : max).replace(/[,;:.]$/, '')}…`;
}

// Curly quotes, dashes and ellipses for front-matter text, by the same library and defaults
// Astro's Markdown uses (retext-smartypants), so it matches the post body.
const smartypants = retext().use(retextSmartypants);
export function smartQuotes(text: string): string {
  return String(smartypants.processSync(text));
}

// A post's title as every page, preview, card and the feed show it: curled like the body.
export function postTitle(post: { data: { title: string } }): string {
  return smartQuotes(post.data.title);
}

// A post's summary for link previews, its Open Graph card and the feed: the front-matter
// description, else the opening excerpt (cut at `max`). One function, so they share the source
// and the curling; only the excerpt's length differs (the feed passes 300).
export function postDescription(
  post: { data: { description?: string }; body?: string },
  max = 160,
): string | undefined {
  const text = post.data.description?.trim() || excerpt(post.body ?? '', max);
  return text ? smartQuotes(text) : undefined;
}
