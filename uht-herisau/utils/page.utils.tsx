import axios from 'axios';
import { isRouteErrorResponse } from 'react-router';
import { CategoryRepresentation } from '#uht-herisau/pages/Categories';
import { DownloadRepresentation } from '#uht-herisau/pages/Download';
import { LandingRepresentation } from '#uht-herisau/pages/Landing';
import MarkdownRepresentation from '#uht-herisau/pages/Markdown';
import OrganisationRepresentation from '#uht-herisau/pages/Organisation';
import { RankingRepresentation } from '#uht-herisau/pages/Ranking';
import RegistrationRepresentation from '#uht-herisau/pages/Registration';
import SponsorsRepresentation from '#uht-herisau/pages/Sponsors';
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
  type Sponsor,
  type Category,
  type DownloadContent,
} from '#uht-herisau/utils/strapi.utils';
import { getReqConfig } from './api.utils';
import { getCachedData } from './cache.utils';

export type SeoDataItem = {
  allow_indexing: boolean;
  title: string;
  description: string;
  keywords?: string;
  preview_image?: any;
};

export type PageContent =
  | CategoriesContent
  | LandingContent
  | MakrdownContent
  | OrganisationContent
  | PicturesContent
  | RankingsContent
  | RegistrationContent
  | SponsorsContent
  | DownloadContent;

export type Page<Representation = PageContent> = {
  path: string;
  title: string;
  linkage: 'navbar' | 'footer';
  seo_data: SeoDataItem;
  navigation_extensions?: NaviagtionExtensions;
  content: Representation;
};

export const fetchStrapiPages = async (): Promise<{ [key: string]: Page<PageContent> }> => {
  return getCachedData('strapi-pages', 'all', async () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${ENV.UHT_CMS_API}/pages?sort[0]=linkage:desc&sort[1]=linkage_position&populate[seo_data][populate]=*&populate[navigation_extensions][populate]=*`,
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
  });
};

export const fetchStrapiContent = async (path: string) => {
  return getCachedData(`strapi-content`, path, async () => {
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
  });
};

export const fetchStrapiContentById = async (id: number) => {
  return getCachedData(`strapi-content-by-id`, id.toString(), async () => {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${ENV.UHT_CMS_API}/pages/${id}?populate=deep,5`,
      headers: {
        Authorization: `Bearer ${ENV.UHT_CMS_KEY}`,
      },
    };
    const response = await axios.request(config);
    if (!response.data.data) {
      throw new Error(`Content with ID ${id} not found`);
    }
    //transform the data to the format we need
    return {
      ...response.data.data.attributes,
      content: (response.data.data.attributes.content[0] as unknown as PageContent) || {},
    } as Page;
  });
};

export const fetchStrapiSponsors = async () => {
  return getCachedData('strapi-sponsors', 'all', async () => {
    const config = getReqConfig('sponsors', {
      filters: {
        'show_on_page][$eq': 'true',
      },
    });

    return axios.request(config).then(async (response: { data: { data: any[] } }) => {
      //transform the data to the format we need
      return response.data.data.map(
        (sponsor) =>
          ({
            ...sponsor.attributes,
            id: sponsor.id,
          }) as Sponsor
      );
    });
  });
};

export const fetchStrapiCategories = async () => {
  return getCachedData('strapi-categories', 'all', async () => {
    const config = getReqConfig('categories', {
      sort: {
        0: 'short_key:asc',
      },
    });

    return axios.request(config).then(async (response: { data: { data: any[] } }) => {
      //transform the data to the format we need
      return response.data.data.map(
        (category) =>
          ({
            ...category.attributes,
            id: category.id,
          }) as Category
      );
    });
  });
};

export const getRouteElement = (content: PageContent & { sponsors: Sponsor[]; categories: Category[] }) => {
  switch (content.__component) {
    case 'representation.landing': {
      return <LandingRepresentation {...content} />;
    }
    case 'representation.categories': {
      return <CategoryRepresentation {...content} />;
    }
    case 'representation.rankings': {
      return <RankingRepresentation {...content} />;
    }
    case 'representation.markdown': {
      return <MarkdownRepresentation {...content} />;
    }
    case 'representation.organisation': {
      return <OrganisationRepresentation {...content} />;
    }
    case 'representation.sponsors': {
      return <SponsorsRepresentation {...content} />;
    }
    case 'representation.registration': {
      return <RegistrationRepresentation {...content} />;
    }
    case 'representation.download': {
      return <DownloadRepresentation />;
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
