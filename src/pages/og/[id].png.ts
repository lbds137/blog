// One Open Graph card per post, at /blog/og/<post id>.png, rendered at build time so a new post
// gets its card without a script to remember. src/og.ts draws it.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { postDescription, postTitle } from '../../lib';
import { renderCard } from '../../og';

export const getStaticPaths = (async () => {
  const posts = await getCollection('posts');
  return posts.map((post) => ({ params: { id: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ post: CollectionEntry<'posts'> }> = async ({ props }) => {
  const { post } = props;
  const png = await renderCard(postTitle(post),postDescription(post));
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
