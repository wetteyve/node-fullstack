import { useEffect } from 'react';
import { Outlet } from 'react-router';
import '#uht-herisau/styles/app.css';
import { resourceBase } from '#app/utils/app-paths';
import { splitArrayByKey } from '#app/utils/array.utils';
import { getTenant } from '#app/utils/middlewares/app-load.context';
import { measurePerformance } from '#app/utils/middlewares/timings.context';
import { useScreenStore } from '#app/utils/store/screen.store';
import Footer from '#uht-herisau/components/footer/footer';
import { Navbar } from '#uht-herisau/components/navbar/navbar';
import { fetchStrapiPages, generateMetaTags } from '#uht-herisau/utils/page.utils';
import { type Route } from './+types/base';

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

export const shouldRevalidate = () => false;

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  const pages = await measurePerformance({ context, promise: fetchStrapiPages() });
  const navigationExtensions = Object.values(pages).find((page) => page.navigation_extensions)?.navigation_extensions;
  const [navbarEntries, footerEntries] = splitArrayByKey(Object.values(pages), 'linkage');
  const url = new URL(request.url);
  const faviconUrl = `${ENV.MODE !== 'development' ? resourceBase : ''}/${tenant ? `favicon-${tenant}` : 'favicon'}.ico`;
  const publicUrl = `${url.origin}${url.pathname.replace(`/${tenant}`, '')}`;

  // Generate meta tags
  const meta = generateMetaTags({ navbarEntries, footerEntries, publicUrl, faviconUrl });

  return {
    navbarEntries,
    footerEntries,
    navigationExtensions,
    faviconUrl,
    publicUrl,
    meta,
  };
};

const UhtLayout = ({ loaderData: { navbarEntries, footerEntries, navigationExtensions } }: Route.ComponentProps) => {
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
      <Footer footerEntries={footerEntries ?? []} navigation_extensions={navigationExtensions} />
    </div>
  );
};

export default UhtLayout;
