import axios from 'axios';
import { isRouteErrorResponse } from 'react-router';
import {
  type LandingContent,
  type MakrdownContent,
  type NaviagtionExtensions,
  type OrganisationContent,
  type PicturesContent,
  type RankingsContent,
  type RegistrationContent,
  type SponsorsContent,
  type CategoriesContent,
} from '#uht-herisau/utils/strapi.utils';

export type SeoDataItem = {
  allow_indexing: boolean;
  title?: string;
  description?: string;
  keywords?: string;
  previewImage?: any;
};

export type PageContent =
  | CategoriesContent
  | LandingContent
  | MakrdownContent
  | OrganisationContent
  | PicturesContent
  | RankingsContent
  | RegistrationContent
  | SponsorsContent;

export type Page<Representation = PageContent> = {
  path: string;
  title: string;
  linkage: 'navbar' | 'footer';
  seo_data: SeoDataItem;
  navigation_extensions?: NaviagtionExtensions;
  content: Representation;
};

export const fetchStrapiPages = async (): Promise<{ [key: string]: Page<PageContent> }> => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${ENV.UHT_CMS_API}/pages?sort[0]=linkage:desc&sort[1]=linkage_position&populate[seo_data][populate]=*`,
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {
    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = { ...page.attributes };
      acc[page.attributes.path] = pageObject;
      return acc;
    }, {});
  });
};

export const fetchStrapiContent = async (path: string) => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${ENV.UHT_CMS_API}/pages?filters[path][$eq]=${path}&populate=deep,5`,
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {
    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = {
        ...page.attributes,
        content: (page.attributes.content[0] as unknown as PageContent) || {},
      };

      acc[page.attributes.path] = pageObject;
      return acc;
    }, {});
  });
};

export const getRouteElement = (content: { __component: string }) => {
  switch (content.__component) {
    case 'representation.landing': {
      return <div>Landing Representation not implemented</div>;
    }
    case 'representation.categories': {
      return <div>Categories Representation not implemented</div>;
    }
    case 'representation.rankings': {
      return <div>Rankings Representation not implemented</div>;
    }
    case 'representation.markdown': {
      return <div>Markdown Representation not implemented</div>;
    }
    case 'representation.organisation': {
      return <div>Organisation Representation not implemented</div>;
    }
    case 'representation.sponsors': {
      return <div>Sponsors Representation not implemented</div>;
    }
    case 'representation.registration': {
      return <div>Registration Representation not implemented</div>;
    }
    default:
      return <div>Representation not implemented</div>;
  }
};

export const handleError = (error: unknown): 'NotFound' | 'NotImplemented' | 'ServerError' => {
  if (error instanceof Response || isRouteErrorResponse(error)) {
    return error.status === 404 ? 'NotFound' : error.status === 501 ? 'NotImplemented' : 'ServerError';
  }
  return 'ServerError';
};
