import { type AboutContent, type HomeContent, type LeistungenContent } from './strapi.type';

export type PageContent = HomeContent | LeistungenContent | AboutContent;

export type Page<Representation = PageContent> = {
  slug: string;
  linkage: 'navbar' | 'footer';
  navigation_title: string;
  content: Representation;
};

export type HomePage = Page<HomeContent>;
export type LeistungenPage = Page<LeistungenContent>;
export type AboutPage = Page<AboutContent>;
