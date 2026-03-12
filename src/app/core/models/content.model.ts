export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: ServiceItem[];
  counters: CounterItem[];
  portfolio: PortfolioItem[];
  testimonials: TestimonialItem[];
  currentProject: CurrentProjectContent;
  contact: ContactContent;
  projects: ProjectDetail[];
}

export interface HeroContent {
  logo: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AboutContent {
  title: string;
  description: string;
  highlightText: string;
}

export interface ServiceItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  backgroundImage: string;
}

export interface CounterItem {
  id: string;
  value: number;
  prefix: string;
  label: string;
  icon: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  link: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  text: string;
  image: string;
}

export interface CurrentProjectContent {
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface ContactContent {
  location: string;
  phone: string;
  email: string;
  instagram: string;
  instagramUrl: string;
  linkedin: string;
  linkedinUrl: string;
  tagline: string;
}

export interface ProjectDetail {
  id: string;
  title: string;
  year: string;
  thumbnail: string;
  images: ProjectImage[];
  description?: string;
}

export interface ProjectImage {
  url: string;
  alt: string;
  cols?: number;
}
