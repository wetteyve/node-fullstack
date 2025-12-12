import { type LoaderFunctionArgs } from 'react-router';
import { onCallScheduler } from '#app/utils/app-paths';
import { fetchStrapiPages as fetch911rsPages } from '#rs911/utils/page.utils';
import { fetchStrapiPages as fetchUhtPages } from '#uht-herisau/utils/page.utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (ENV.MODE === 'development') {
    const rs911Pages = await fetch911rsPages();
    const rs911links = Object.values(rs911Pages).reduce((acc: { [key: string]: string }, page) => {
      acc[page.slug] = `${request.url}911rs/${page.slug}`;
      return acc;
    }, {});
    const uhtPages = await fetchUhtPages();
    const uhtlinks = Object.values(uhtPages).reduce((acc: { [key: string]: string }, page) => {
      acc[page.path] = `${request.url}uht-herisau/${page.path}`;
      return acc;
    }, {});

    return {
      '911rs': { ...rs911links, sitemap: `${request.url}911rs/sitemap.xml` },
      'uht-herisau': { ...uhtlinks, sitemap: `${request.url}uht-herisau/sitemap.xml` },
      scheduler: {
        home: `${request.url}${onCallScheduler.base.replace(/\//g, '')}/${onCallScheduler.home}`,
      },
    };
  }

  throw new Response('Not Found', { status: 404 });
};
