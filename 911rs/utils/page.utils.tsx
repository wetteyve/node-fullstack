import axios from 'axios';
import { isRouteErrorResponse } from 'react-router';
import { About } from '#rs911/pages/About';
import { Agenda } from '#rs911/pages/Agenda';
import { Impressum } from '#rs911/pages/Impressum';
import { Kontakt } from '#rs911/pages/Kontakt';
import { Leistungen } from '#rs911/pages/Leistungen';
import { Links } from '#rs911/pages/Links';
import { Start } from '#rs911/pages/Start';
import {
  type LinksContent,
  type AboutContent,
  type HomeContent,
  type LeistungenContent,
  type AgendaContent,
  type KontaktContent,
  type ImpressumContent,
} from './strapi.utils';

type PageContent = HomeContent | LeistungenContent | AboutContent | LinksContent | AgendaContent | KontaktContent | ImpressumContent;

export type Page<Representation = PageContent> = {
  slug: string;
  linkage: 'navbar' | 'footer';
  navigation_title: string;
  seo_settings: {
    title: string;
    description: string;
    keywords: string;
    allow_indexing: boolean;
    previewImage?: any;
  };
  content: Representation;
};

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
      return <About content={content as AboutContent} />;
    case 'pages.links-page':
      return <Links content={content as LinksContent} />;
    case 'pages.agenda-page':
      return <Agenda content={content as AgendaContent} />;
    case 'pages.kontakt-page':
      return <Kontakt content={content as KontaktContent} />;
    case 'pages.impressum-page':
      return <Impressum content={content as ImpressumContent} />;
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
