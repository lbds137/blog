import { describe, expect, it } from 'vitest';
import { excerpt, postDescription, postTitle, smartQuotes } from './lib';

describe('excerpt', () => {
  it('takes the first paragraph that has text, as plain text', () => {
    const body = '![cover](img.png)\n\nSee [the *film*](https://x.test/a_(b)) and `code`.\n\nLater.';
    expect(excerpt(body, 300)).toBe('See the film and code.');
  });

  it('strips heading, list and blockquote markers', () => {
    expect(excerpt('# Title', 300)).toBe('Title');
    expect(excerpt('- one\n- two', 300)).toBe('one two');
    expect(excerpt('1. first', 300)).toBe('first');
    expect(excerpt('> quoted', 300)).toBe('quoted');
  });

  it('unwraps strong emphasis and backslash escapes', () => {
    expect(excerpt('**bold** and __also__ and 3\\*4', 300)).toBe('bold and also and 3*4');
  });

  it('keeps markers that are not paired emphasis', () => {
    expect(excerpt('a snake_case name and 2*3', 300)).toBe('a snake_case name and 2*3');
  });

  it('cuts at a word boundary and adds an ellipsis', () => {
    expect(excerpt('one two three four', 9)).toBe('one two…');
  });

  it.each([',', '.', ';', ':'])('drops a trailing "%s" before the ellipsis', (mark) => {
    expect(excerpt(`one two${mark} three four`, 9)).toBe('one two…');
  });

  it('cuts mid-word when there is no space to cut at', () => {
    expect(excerpt('abcdefghijkl', 5)).toBe('abcde…');
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

describe('postTitle', () => {
  it('curls the front-matter title', () => {
    expect(postTitle({ data: { title: "The One Thing It Can't Do" } })).toBe(
      'The One Thing It Can’t Do',
    );
  });
});

describe('postDescription', () => {
  // 253 characters: over the 160 default, under the feed's 300.
  const longBody = `${'word '.repeat(50)}end`;

  it('prefers the front-matter description, trimmed and curled', () => {
    const post = { data: { description: `  A post's summary  ` }, body: 'ignored' };
    expect(postDescription(post)).toBe('A post’s summary');
  });

  it('falls back to the excerpt, cut at 160 by default', () => {
    expect(postDescription({ data: {}, body: longBody })).toBe(`${'word '.repeat(31)}word…`);
  });

  it('uses the given max instead (the feed passes 300, which keeps this body whole)', () => {
    expect(postDescription({ data: {}, body: longBody }, 300)).toBe(longBody);
  });

  it('returns undefined when there is no text at all', () => {
    expect(postDescription({ data: { description: '   ' }, body: '' })).toBeUndefined();
  });
});
