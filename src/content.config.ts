import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One Markdown file per post in src/content/posts/. Posts moved from Blogger keep their
// original date and link back to where they first ran.
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      originalUrl: z.url().optional(),
      tags: z.array(z.string()).default([]),
      // Both optional, for link previews and search: a one-sentence summary and a preview
      // image path relative to the post's .md file (e.g. ./images/foo.jpg).
      description: z.string().optional(),
      image: image().optional(),
    }),
});

export const collections = { posts };
