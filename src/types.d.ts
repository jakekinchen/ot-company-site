// types.d.ts
import type { z } from 'astro:content';
import type { collections } from '../content/config';

type EventSchema = z.infer<(typeof collections.events)['schema']>;

export type Event = {
  id: string;
  slug: string;
  body: string;
  collection: 'events';
  data: EventSchema;
};

export type Post = {
  id: string;
  slug: string;
  body: string;
  category: enum['Company News'| 'Editorial'];
  collection: 'posts';
  description: string;
  pubDate: Date;
  updatedDate: Date;
  heroImage: string;
  share: {
    image: string;
    title: string;
    description: string;
  };
  data: z.infer<(typeof collections.posts)['schema']>;
};


export type ProductInfo = {
    label: string;
    title: string;
    subtitle: string;
    iconSrc: string;
    iconAlt: string;
    href: string;
    pageContent?: {
      title: string;
      subtitle: string;
      benefits: {
        subtitle: string;
        graphicSrc: string;
        graphicAlt: string;
      };
      features: {
        iconSrc: string;
        title: string;
        description: string;
      }[];
      "visual-guide": {
        subtitle: string;
        graphicSrc: string;
      };
    };
  };

  export type Clients = {
    label: string;
    iconSrc: string;
    alt: string;
    href: string;
  };
  
  export type CompanyLink = {
    href: string;
    iconSrc: string;
    label: string;
    subLinks?: string[];
  };
  
  export type SolutionLink = {
    href: string;
    iconSrc: string;
    label: string;
  };
  
  export type PartnerLink = {
    href: string;
    iconSrc: string;
    label: string;
  };

export type TeamMember = {
  name: string;
  title: string;
  imageSrc: string;
};

export type Initiative = {
  iconSrc: string;
  description: string;
};

// Update the AppData type to include these new arrays
export type AppData = {
  products: ProductInfo[];
  company: CompanyLink[];
  solutions: SolutionLink[];
  partners: PartnerLink[];
  clients: Clients[];
  teamMembers: TeamMember[];
  initiatives: Initiative[];
};