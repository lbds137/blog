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

// A post's opening paragraph as plain text, cut at a word boundary: the feed's summary.
export function excerpt(body: string, max = 300): string {
  const first = body.trim().split(/\n\s*\n/)[0] ?? '';
  const text = first
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^[>\s]+/gm, '')
    .replace(/[*_`]/g, '')
    .replace(/\\(.)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max)).replace(/[,;:.]$/, '')}…`;
}
