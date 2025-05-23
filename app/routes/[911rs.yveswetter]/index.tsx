import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { resourceBasePath } from '#app/utils/path';
import Footer from '#rs911/components/footer/footer';
import { LoadingBar } from '#rs911/components/loadingbar/Loadingbar';
import Navbar from '#rs911/components/navbar/navbar';
import { useScreenStore } from '#rs911/store/screen.store';
import { splitArrayByKey } from '#rs911/utils/array.utils';
import { fetchStrapiPages, type Page } from '#rs911/utils/page.utils';
import { type Route } from './+types';
import '#rs911/styles/app.css';

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@100;200;300;400;500;600;700;800;900&display=swap',
  },
];

export const loader = async ({ request, context: { tenant } }: Route.LoaderArgs) => {
  const pages: { [key: string]: Page } = await fetchStrapiPages();
  const [navbarEntries, footerEntries] = splitArrayByKey(Object.values(pages), 'linkage');
  const url = new URL(request.url);
  const faviconUrl = `${process.env.NODE_ENV !== 'development' ? resourceBasePath : ''}/${tenant ? `favicon-${tenant}` : 'favicon'}.ico`;
  return { navbarEntries, footerEntries, faviconUrl, publicUrl: `${url.origin}${url.pathname.replace(`/${tenant}`, '')}` };
};

export const meta = ({ data: { navbarEntries, footerEntries, publicUrl, faviconUrl } }: Route.MetaArgs): Route.MetaDescriptors => {
  const { seo_settings } =
    [...(navbarEntries || []), ...(footerEntries || [])].find((entry: Page) => publicUrl.endsWith(`/${entry.slug}`)) || {};
  const siteName = seo_settings?.title || 'Alte 11er Garage';
  const description = seo_settings?.description || 'Alte 11er Garage';
  const noIndex = !seo_settings?.allow_indexing;

  const metaData = [
    { title: siteName },
    // Open Graph Tags
    { property: 'og:title', content: siteName },
    { property: 'og:site_name', content: siteName },
    { property: 'og:description', content: description },
    { property: 'og:url', content: publicUrl },
    // Meta Tags
    { name: 'description', content: description },
    { name: 'robots', content: 'max-image-preview:large' },
    {
      tagName: 'link',
      rel: 'icon',
      href: faviconUrl,
    },
  ];
  if (noIndex) metaData.push({ name: 'robots', content: 'noindex, nofollow' });
  return metaData;
};

const Page = ({ loaderData: { navbarEntries, footerEntries } }: Route.ComponentProps) => {
  const updateScreenSize = useScreenStore.use.updateScreenSize();

  useEffect(() => {
    // track screen size
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [updateScreenSize]);

  return (
    <div className='relative'>
      <Navbar navbarEntries={navbarEntries} />
      <LoadingBar />
      <div className='app-container !pb-0'>
        <Outlet />
      </div>
      <Footer footerEntries={footerEntries} />
    </div>
  );
};

export default Page;
