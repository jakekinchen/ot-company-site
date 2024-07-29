import { defineCollection, z } from 'astro:content';

export const collections = {
  posts: defineCollection({
    schema: z.object({
      draft: z.boolean().default(false),
      pubDate: z.date().transform((str) => new Date(str)),
      title: z.string(),
      href: z.string().optional(),
      category: z.enum(['Company News', 'Editorial']),
      tags: z.array(z.string().optional()),
      share: z.object({
        image: z.string().optional(),
        title: z.string(),
        description: z.string(),
      }).strict(),
    }),
  }),

  events: defineCollection({
    schema: z.object({
        title: z.string(),
        subtitle: z.string(),
        imageSrc: z.string(),
        imageAlt: z.string(),
        eventDate: z.date(),
        moreInfo: z.string(),
        href: z.string().optional(),
        category: z.enum(['Webinar', 'Out and About', 'Conference', 'Exposition']),
        share: z.object({
            image: z.string().optional(),
            title: z.string(),
            description: z.string(),
          }).strict(),
    })
  }),

  products: defineCollection({
    schema: z.object({
      label: z.string(),
      title: z.string(),
      subtitle: z.string(),
      iconSrc: z.string(),
      iconAlt: z.string(),
      href: z.string(),
      pageContent: z.object({
        title: z.string(),
        subtitle: z.string(),
        benefits: z.object({
          subtitle: z.string(),
          graphicSrc: z.string(),
          graphicAlt: z.string(),
        }),
        features: z.array(z.object({
          iconSrc: z.string(),
          title: z.string(),
          description: z.string(),
        })),
        visualGuide: z.object({
          subtitle: z.string(),
          graphicSrc: z.string(),
          isVideo: z.boolean().default(false),
        }),
      }),
    }),
  }),

  company: defineCollection({
    schema: z.object({
      href: z.string(),
      iconSrc: z.string(),
      label: z.string(),
      subLinks: z.array(z.string()).optional(),
    }),
  }),

  solutions: defineCollection({
    schema: z.object({
      href: z.string(),
      iconSrc: z.string(),
      label: z.string(),
    }),
  }),

  partners: defineCollection({
    schema: z.object({
      href: z.string(),
      iconSrc: z.string(),
      label: z.string(),
    }),
  }),

  clients: defineCollection({
    schema: z.object({
      label: z.string(),
      iconSrc: z.string(),
      alt: z.string(),
      href: z.string(),
    }),
  }),

  teamMembers: defineCollection({
    schema: z.object({
      name: z.string(),
      title: z.string(),
      imageSrc: z.string(),
    }),
  }),

  initiatives: defineCollection({
    schema: z.object({
      iconSrc: z.string(),
      description: z.string(),
    }),
  }),
};