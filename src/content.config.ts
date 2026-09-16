import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const homepage = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/homepage' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_image: z.string().optional(),
    hero_title: z.string().optional(),
    hero_description: z.string().optional(),
    hero_cta_text: z.string().optional(),
    hero_cta_link: z.string().optional(),
    hero_image: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    custom_slug: z.string().optional(),
    slug_en: z.string().optional(),
    slug_id: z.string().optional(),
    translation_key: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    custom_slug: z.string().optional(),
    translation_key: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_image: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(),
    category: z.string().default('Information'),
    author: z.string().default('Ahmad Muzakki'),
    draft: z.boolean().default(false),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/authors' }),
  schema: z.object({
    name: z.string(),
    role: z.string().optional(),
    bio: z.string().optional(),
    avatar: z.string().optional(),
    email: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '**/*.{md,json}', base: './src/content/categories' }),
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    custom_slug: z.string().optional(),
    slug_en: z.string().optional(),
    slug_id: z.string().optional(),
    translation_key: z.string().optional(),
  }),
});

export const collections = { homepage, pages, posts, authors, categories };
