import { type LoaderFunctionArgs } from 'react-router';
import { fetchStrapiPages } from '#rs911/utils/page.utils';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (ENV.MODE === 'development') {
    const rs911Pages = await fetchStrapiPages();
    const rs9111links = Object.values(rs911Pages).reduce((acc: { [key: string]: string }, page) => {
      acc[page.slug] = `${request.url}911rs.yveswetter/${page.slug}`;
      return acc;
    }, {});

    return {
      '911rs': { ...rs9111links, sitemap: `${request.url}911rs.yveswetter/sitemap.xml` },
      'uht-herisau': {
        home: `${request.url}new.uht-herisau/home`,
      },
    };
  }
};
