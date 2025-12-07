import axios from 'axios';
import { type MetaDescriptor, isRouteErrorResponse } from 'react-router';
import { getImage } from '#app/utils/get-strapi-image.utils';
import { About } from '#rs911/pages/About';
import { Agenda } from '#rs911/pages/Agenda';
import { Datenschutz } from '#rs911/pages/Datenschutz';
import { Impressum } from '#rs911/pages/Impressum';
import { Kontakt } from '#rs911/pages/Kontakt';
import { Leistungen } from '#rs911/pages/Leistungen';
import { Links } from '#rs911/pages/Links';
import { Start } from '#rs911/pages/Start';
import { getCachedData } from '#rs911/utils/cache.utils';
import {
  type LinksContent,
  type AboutContent,
  type HomeContent,
  type LeistungenContent,
  type AgendaContent,
  type KontaktContent,
  type ImpressumContent,
  type DatenschutzContent,
} from '#rs911/utils/strapi.utils';

type PageContent =
  | HomeContent
  | LeistungenContent
  | AboutContent
  | LinksContent
  | AgendaContent
  | KontaktContent
  | ImpressumContent
  | DatenschutzContent;

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

export const fetchStrapiPages = async (): Promise<{ [key: string]: Page<PageContent> }> => {
  return getCachedData('strapi-pages', 'all', async () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${ENV.RS911_CMS_API}/pages?sort[0]=linkage:desc&sort[1]=linkage_position&populate[seo_settings][populate]=*`,
      headers: {
        Authorization: `Bearer ${ENV.RS911_CMS_KEY}`,
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
  });
};

export const fetchStrapiContent = async (path: string) => {
  return getCachedData(`strapi-content`, path, async () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${ENV.RS911_CMS_API}/pages?filters[slug][$eq]=${path}&populate=deep,5`,
      headers: {
        Authorization: `Bearer ${ENV.RS911_CMS_KEY}`,
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
  });
};

export const getRouteElement = (content: PageContent) => {
  switch (content.__component) {
    case 'pages.home-page': {
      return <Start content={content} />;
    }
    case 'pages.leistungen-page':
      return <Leistungen content={content} />;
    case 'pages.about-page':
      return <About content={content} />;
    case 'pages.links-page':
      return <Links content={content} />;
    case 'pages.agenda-page':
      return <Agenda content={content} />;
    case 'pages.kontakt-page':
      return <Kontakt content={content} />;
    case 'pages.impressum-page':
      return <Impressum content={content} />;
    case 'pages.datenschutz-page':
      return <Datenschutz content={content} />;
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

export const generateMetaTags = ({
  navbarEntries,
  footerEntries,
  publicUrl,
  faviconUrl,
}: {
  navbarEntries: Page[] | undefined;
  footerEntries: Page[] | undefined;
  publicUrl: string;
  faviconUrl: string;
}): MetaDescriptor[] => {
  const { seo_settings } =
    [...(navbarEntries || []), ...(footerEntries || [])].find((entry: Page) => publicUrl.endsWith(`/${entry.slug}`)) || {};
  const siteName = seo_settings?.title || 'Alte 11er Garage';
  const description = seo_settings?.description || 'Alte 11er Garage';
  const { url, width, height } = seo_settings?.previewImage.data
    ? getImage(seo_settings.previewImage, 'small')
    : {
        url: 'https://res.cloudinary.com/djngkbkmp/image/upload/v1706558292/small_911_martini_george_7d3968f9f6.png',
        width: 320,
        height: 180,
      };
  const keywords =
    seo_settings?.keywords ||
    'Alte 11er Garage, Oldtimer Restauration, Klassiker Wartung, Oldtimer Pflege, Oldtimer Werkstatt Arbon, George Wetter, Oldtimer Spezialist Schweiz, Klassiker 1965–1993, Fahrzeugrestauration Arbon, Oldtimer Service Thurgau, Restauration Oldtimer';
  const noIndex = !seo_settings?.allow_indexing;

  const metaData: MetaDescriptor[] = [
    { title: siteName },
    // Open Graph Tags
    { property: 'og:title', content: siteName },
    { property: 'og:site_name', content: siteName },
    { property: 'og:description', content: description },
    { property: 'og:url', content: publicUrl },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:image',
      content: url,
    },
    {
      property: 'og:image:width',
      content: width,
    },
    {
      property: 'og:image:height',
      content: height,
    },
    { property: 'og:image:type', content: 'image/png' },
    {
      property: 'og:image:secure_url',
      content: url,
    },
    { property: 'og:image:alt', content: 'Alte 11er Garage - 911 RSR Martini' },
    // Meta Tags
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'max-image-preview:large' },
    {
      tagname: 'link',
      rel: 'icon',
      href: faviconUrl,
    },
  ];
  if (noIndex) metaData.push({ name: 'robots', content: 'noindex, nofollow' });
  return metaData;
};
