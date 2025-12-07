import { fetchStrapiPages } from '#uht-herisau/utils/page.utils';
import { type Route } from './+types/sitemap';

export const loader = async ({ request, context: { tenant } }: Route.LoaderArgs) => {
  const pages = await fetchStrapiPages();
  const { pathname, host } = new URL(request.url);
  const cleanPathname = tenant ? pathname.replace(`/${tenant}`, '') : pathname;
  const locations = Object.keys(pages)
    .map((slug) => {
      const fullUrl = `${ENV.MODE === 'production' ? 'https' : 'http'}://${host}${cleanPathname.replace('/sitemap.xml', `/${slug}`)}`;
      return `<url><loc>${fullUrl}</loc></url>`;
    })
    .join();

  const body = `
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${locations}
  </urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
    },
  });
};
