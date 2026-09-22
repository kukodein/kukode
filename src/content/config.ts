import { defineCollection, reference, z } from 'astro:content';

// 1. Koleksi Posts (Artikel)
const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    custom_slug: z.string().optional(),
    translation_key: z.string().optional(),
    description: z.string().optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      image: z.string().optional(),
    }).optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    category: z.string().optional(), // atau reference('categories') jika menggunakan relasi
    author: z.string().optional(),   // atau reference('authors') jika menggunakan relasi
    draft: z.boolean().default(false),
  }),
});

// 2. Koleksi Categories
const categories = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    translation_key: z.string().optional(),
    description: z.string().optional(),
  }),
});

// 3. Koleksi Authors
const authors = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    custom_slug: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    email: z.string().optional(),
  }),
});

// Export seluruh koleksi agar dikenali oleh Astro
export const collections = {
  posts,
  categories,
  authors,
};