import { type LoaderFunctionArgs } from 'react-router';
import { onCallScheduler } from '#app/utils/app-paths';
import { fetchStrapiPages as fetch911rsPages } from '#rs911/utils/page.utils';
import { fetchStrapiPages as fetchUhtPages } from '#uht-herisau/utils/page.utils';

// This loader is used to provide dynamic links for the 911rs and uht-herisau pages in development mode.

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (ENV.MODE === 'development') {
    const rs911Pages = await fetch911rsPages();
    const rs911links = Object.values(rs911Pages).reduce((acc: { [key: string]: string }, page) => {
      const slug = page.slug ?? 'unknown';
      acc[slug] = `${request.url}911rs/${slug}`;
      return acc;
    }, {});
    const uhtPages = await fetchUhtPages();
    const uhtlinks = Object.values(uhtPages).reduce((acc: { [key: string]: string }, page) => {
      const path = page.path ?? 'unknown';
      acc[path] = `${request.url}uht-herisau/${path}`;
      return acc;
    }, {});

    return {
      '911rs': { ...rs911links, sitemap: `${request.url}911rs/sitemap.xml` },
      'uht-herisau': {
        ...uhtlinks,
        downloadRegistrations: `${request.url}uht-herisau/download-registrations`,
        sitemap: `${request.url}uht-herisau/sitemap.xml`,
      },
      scheduler: {
        home: `${request.url}${onCallScheduler.base.replace(/\//g, '')}/${onCallScheduler.home}`,
      },
    };
  }

  throw new Response('Not Found', { status: 404 });
};
