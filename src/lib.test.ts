import { describe, expect, it } from 'vitest';
import { excerpt, postDescription, smartQuotes } from './lib';

describe('excerpt', () => {
  it('takes the first paragraph that has text, as plain text', () => {
    const body = '![cover](img.png)\n\nSee [the *film*](https://x.test/a_(b)) and `code`.\n\nLater.';
    expect(excerpt(body)).toBe('See the film and code.');
  });

  it('keeps markers that are not paired emphasis', () => {
    expect(excerpt('a snake_case name and 2*3')).toBe('a snake_case name and 2*3');
  });

  it('cuts at a word boundary, drops trailing punctuation and adds an ellipsis', () => {
    expect(excerpt('one two, three four', 9)).toBe('one two…');
  });

  it('returns short text whole', () => {
    expect(excerpt('short', 9)).toBe('short');
  });
});

describe('smartQuotes', () => {
  it('curls quotes and apostrophes', () => {
    expect(smartQuotes(`It's "here"`)).toBe('It’s “here”');
  });
});

describe('postDescription', () => {
  const longBody = `${'word '.repeat(50)}end`;

  it('prefers the front-matter description, trimmed and curled', () => {
    const post = { data: { description: `  A post's summary  ` }, body: 'ignored' };
    expect(postDescription(post)).toBe('A post’s summary');
  });

  it('falls back to the excerpt, cut at 160 by default', () => {
    const text = postDescription({ data: {}, body: longBody });
    expect(text?.length).toBeLessThanOrEqual(161);
    expect(text?.endsWith('…')).toBe(true);
  });

  it('cuts the excerpt at the given max (the feed passes 300)', () => {
    const text = postDescription({ data: {}, body: longBody }, 300);
    expect(text).toBe(`${'word '.repeat(50)}end`);
  });

  it('returns undefined when there is no text at all', () => {
    expect(postDescription({ data: { description: '   ' }, body: '' })).toBeUndefined();
  });
});
