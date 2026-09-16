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

    // Hero section
    hero: z.object({
      badge_text: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional(),
      cta_text: z.string().optional(),
      cta_link: z.string().optional(),
      secondary_cta_text: z.string().optional(),
      secondary_cta_link: z.string().optional(),
      image: z.string().optional(),
      stat_1: z.string().optional(),
      stat_2: z.string().optional(),
    }).optional(),
    hero_title: z.string().optional(),
    hero_description: z.string().optional(),
    hero_cta_text: z.string().optional(),
    hero_cta_link: z.string().optional(),
    hero_image: z.string().optional(),

    // Trusted By section
    trusted: z.object({
      title: z.string().optional(),
      items: z.array(z.string()).optional(),
    }).optional(),

    // Marquee
    marquee: z.object({
      items: z.array(z.string()).optional(),
    }).optional(),

    // Numbers / Metrics
    numbers: z.object({
      items: z.array(z.object({
        number: z.string(),
        label: z.string(),
      })).optional(),
    }).optional(),

    // About section
    about: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      p1: z.string().optional(),
      p2: z.string().optional(),
      image: z.string().optional(),
      cta_text: z.string().optional(),
      cta_link: z.string().optional(),
    }).optional(),

    // Services section
    services: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      items: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string(),
        col_class: z.string().optional(),
      })).optional(),
    }).optional(),

    // Process section
    process: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      items: z.array(z.object({
        step_number: z.union([z.string(), z.number()]),
        title: z.string(),
        description: z.string(),
      })).optional(),
    }).optional(),

    // Portfolio section
    portfolio: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      cta_text: z.string().optional(),
      cta_link: z.string().optional(),
      items: z.array(z.object({
        title: z.string(),
        category: z.string(),
        image: z.string(),
        link: z.string().optional(),
      })).optional(),
    }).optional(),

    // Tech Stack section
    stack: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      categories: z.array(z.object({
        name: z.string(),
        tools: z.array(z.string()),
      })).optional(),
    }).optional(),

    // Testimonials section
    testimonials: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      items: z.array(z.object({
        quote: z.string(),
        icon: z.string().optional(),
        name: z.string(),
        role: z.string(),
      })).optional(),
    }).optional(),

    // Why Choose Us section
    why_us: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      items: z.array(z.object({
        icon: z.string().optional(),
        title: z.string(),
        description: z.string(),
      })).optional(),
    }).optional(),

    // Pricing section
    pricing: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      plans: z.array(z.object({
        name: z.string(),
        is_popular: z.boolean().optional(),
        badge: z.string().optional(),
        price: z.string(),
        approx: z.string().optional(),
        description: z.string(),
        features: z.array(z.string()),
        cta_text: z.string(),
        cta_link: z.string().optional(),
      })).optional(),
    }).optional(),

    // FAQ section
    faq: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      cta_text: z.string().optional(),
      cta_link: z.string().optional(),
      items: z.array(z.object({
        question: z.string(),
        answer: z.string(),
      })).optional(),
    }).optional(),

    // CTA Band section
    cta: z.object({
      eyebrow: z.string().optional(),
      heading: z.string().optional(),
      description: z.string().optional(),
      primary_text: z.string().optional(),
      primary_link: z.string().optional(),
      secondary_text: z.string().optional(),
      secondary_link: z.string().optional(),
    }).optional(),
  }).passthrough(),
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
    custom_slug: z.string().optional(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_image: z.string().optional(),
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

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    custom_slug: z.string().optional(),
    category: z.string().default('Web Development'),
    client: z.string().optional(),
    year: z.string().optional(),
    image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    live_url: z.string().optional(),
    tools: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    seo_image: z.string().optional(),
  }),
});

export const collections = { homepage, pages, posts, authors, categories, portfolio };
