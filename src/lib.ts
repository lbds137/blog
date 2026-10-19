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

// A post's first paragraph with text in it, as plain text cut at a word boundary: the
// feed's summary.
export function excerpt(body: string, max = 300): string {
  const text = body.split(/\n\s*\n/).map(plainText).find((p) => p) ?? '';
  if (text.length <= max) return text;
  const cut = text.lastIndexOf(' ', max);
  return `${text.slice(0, cut > 0 ? cut : max).replace(/[,;:.]$/, '')}…`;
}
