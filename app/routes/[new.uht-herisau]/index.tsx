import { useEffect } from 'react';
import { Outlet } from 'react-router';
import '#uht-herisau/styles/app.css';
import { splitArrayByKey } from '#app/utils/array.utils';
import { getImage } from '#app/utils/get-strapi-image.utils';
import { resourceBasePath } from '#app/utils/path';
import { useScreenStore } from '#app/utils/store/screen.store';
import Footer from '#uht-herisau/components/footer/footer';
import { Navbar } from '#uht-herisau/components/navbar/navbar';
import { fetchStrapiPages, type Page } from '#uht-herisau/utils/page.utils';
import { type Route } from './+types';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Quicksand:wght@300..700&display=swap',
  },
];

export const loader = async ({ request, context: { tenant } }: Route.LoaderArgs) => {
  const pages = await fetchStrapiPages();
  const [navbarEntries, footerEntries] = splitArrayByKey(Object.values(pages), 'linkage');
  const url = new URL(request.url);
  const faviconUrl = `${ENV.MODE !== 'development' ? resourceBasePath : ''}/${tenant ? `favicon-${tenant}` : 'favicon'}.ico`;
  return { navbarEntries, footerEntries, faviconUrl, publicUrl: `${url.origin}${url.pathname.replace(`/${tenant}`, '')}` };
};

// todo: fallback UHT Herisau meta data
export const meta = ({ data: { navbarEntries, footerEntries, publicUrl, faviconUrl } }: Route.MetaArgs): Route.MetaDescriptors => {
  const { seo_data } =
    [...(navbarEntries || []), ...(footerEntries || [])].find((entry: Page) => publicUrl.endsWith(`/${entry.path}`)) || {};
  const siteName = seo_data?.title || 'UHT Herisau';
  const description = seo_data?.description || 'UHT Herisau';
  const { url, width, height, alternativeText } = seo_data?.preview_image.data ? getImage(seo_data?.preview_image, 'small') : {};
  console.log(getImage(seo_data?.preview_image, 'small'));
  const keywords =
    seo_data?.keywords ||
    'Unihockeyturnier, Herisau, Indoor-Sport, News, Ergebnisse, Spielpläne, Ostschweiz, Veranstaltung, Bilder, Impressionen';
  const noIndex = !seo_data?.allow_indexing;

  const metaData: Route.MetaDescriptors = [
    { title: siteName },
    // Open Graph Tags
    { property: 'og:title', content: siteName },
    { property: 'og:site_name', content: siteName },
    { property: 'og:description', content: description },
    { property: 'og:url', content: publicUrl },
    { property: 'og:type', content: 'website' },
    // Meta Tags
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'robots', content: 'max-image-preview:large' },
    {
      tagName: 'link',
      rel: 'icon',
      href: faviconUrl,
    },
  ];
  // If a preview image is set, add Open Graph image tags
  if (url && width && height) {
    metaData.concat([
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
      { property: 'og:image:alt', content: alternativeText || 'Unihockeyturnier Herisau' },
    ]);
  }
  // If noIndex is true, add noindex meta tag
  if (noIndex) metaData.push({ name: 'robots', content: 'noindex, nofollow' });
  return metaData;
};

const UhtLayout = ({ loaderData: { navbarEntries, footerEntries } }: Route.ComponentProps) => {
  const updateScreenSize = useScreenStore.use.updateScreenSize();

  useEffect(() => {
    // track screen size
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [updateScreenSize]);

  return (
    <div className='relative overflow-x-hidden bg-primary text-white'>
      <Navbar navbarEntries={navbarEntries ?? []} />
      <div className='app-container !pb-0 min-h-[calc(100svh-96px-96px)]'>
        <Outlet />
      </div>
      <Footer footerEntries={footerEntries ?? []} />
    </div>
  );
};

export default UhtLayout;
