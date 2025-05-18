import axios from 'axios';
import { type AboutContent, type HomeContent, type LeistungenContent } from './strapi.utils';

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

export const fetchStrapiPages = async () => {
  const config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${import.meta.env['VITE_RS911_API_URL']}/pages?sort[0]=linkage:desc&sort[1]=linkage_position`,
    headers: {
      Authorization: `Bearer ${import.meta.env['VITE_RS911_API_KEY']}`,
    },
  };

  return axios.request(config).then(async (response: { data: { data: any } }) => {

    //transform the data to the format we need
    return response.data.data.reduce((acc: { [key: string]: Page }, page: any) => {
      const pageObject: Page = page.attributes;
      acc[page.attributes.slug] = pageObject;
      return acc;
    }, {});
  });
};