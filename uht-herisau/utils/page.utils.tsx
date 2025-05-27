import axios from 'axios';
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
