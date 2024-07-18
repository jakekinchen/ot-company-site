// types.d.ts

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
  
  export type AppData = {
    products: ProductInfo[];
    company: CompanyLink[];
    solutions: SolutionLink[];
    partners: PartnerLink[];
  };