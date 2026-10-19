import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_TAGLINE, SITE_TITLE } from '../site';
import { excerpt, url } from '../lib';

// The blog's RSS feed: newest first, each item a summary linking to the full post.
export async function GET(context: APIContext) {
  const posts = (await getCollection('posts')).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  return rss({
    title: SITE_TITLE,
    description: SITE_TAGLINE,
    site: new URL(url(), context.site),
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post.body ?? ''),
      link: url(`posts/${post.id}/`),
      categories: post.data.tags,
    })),
    trailingSlash: true,
  });
}
