import axios from 'axios';
import { isRouteErrorResponse } from 'react-router';
import { Leistungen } from '#rs911/pages/Leistungen';
import { Start } from '#rs911/pages/Start';
import { type AboutContent, type HomeContent, type LeistungenContent } from './strapi.utils';

export type PageContent = HomeContent | LeistungenContent | AboutContent;

export type Page<Representation = PageContent> = {
  slug: string;
  linkage: 'navbar' | 'footer';
  navigation_title: string;
  seo_settings: {
    title: string;
    description: string;
    keywords: string;
    allow_indexing: boolean;
  };
  content: Representation;
};

export type HomePage = Page<HomeContent>;
export type LeistungenPage = Page<LeistungenContent>;
export type AboutPage = Page<AboutContent>;

export const fetchStrapiPages = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env['RS911_API_URL']}/pages?sort[0]=linkage:desc&sort[1]=linkage_position&populate[seo_settings][populate]=*`,
    headers: {
      Authorization: `Bearer ${process.env['RS911_API_KEY']}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {
    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = { ...page.attributes };
      acc[page.attributes.slug] = pageObject;
      return acc;
    }, {});
  });
};

export const fetchStrapiContent = async (path: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${process.env['RS911_API_URL']}/pages?filters[slug][$eq]=${path}&populate=deep,5`,
    headers: {
      Authorization: `Bearer ${process.env['RS911_API_KEY']}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {
    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = {
        ...page.attributes,
        content: (page.attributes.content[0] as unknown as PageContent) || {},
      };

      acc[page.attributes.slug] = pageObject;
      return acc;
    }, {});
  });
};

export const getRouteElement = (content: { __component: string }) => {
  switch (content.__component) {
    case 'pages.home-page': {
      return <Start content={content as HomeContent} />;
    }
    case 'pages.leistungen-page':
      return <Leistungen content={content as LeistungenContent} />;
    case 'pages.about-page':
      return <div>Über mich</div>;
    case 'pages.links-page':
      return <div>Links</div>;
    case 'pages.agenda-page':
      return <div>Agenda</div>;
    case 'pages.kontakt-page':
      return <div>Kontakt</div>;
    case 'pages.impressum-page':
      return <div>Impressum</div>;
    case 'pages.datenschutz-page':
      return <div>Datenschutz</div>;
    default:
      throw new Response('Representation not found', { status: 501 });
  }
};

export const handleError = (error: unknown): 'NotFound' | 'NotImplemented' | 'ServerError' => {
  if (error instanceof Response || isRouteErrorResponse(error)) {
    return error.status === 404 ? 'NotFound' : error.status === 501 ? 'NotImplemented' : 'ServerError';
  }
  return 'ServerError';
};
