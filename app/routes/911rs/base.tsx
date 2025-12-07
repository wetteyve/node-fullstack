import { useEffect } from 'react';
import { Outlet } from 'react-router';
import { resourceBase } from '#app/utils/app-paths';
import { splitArrayByKey } from '#app/utils/array.utils';
import { appLoadContext } from '#app/utils/middlewares/app-load.context';
import { useScreenStore } from '#app/utils/store/screen.store';
import Footer from '#rs911/components/footer/footer';
import { LoadingBar } from '#rs911/components/loadingbar/Loadingbar';
import Navbar from '#rs911/components/navbar/navbar';
import { fetchStrapiPages, generateMetaTags } from '#rs911/utils/page.utils';
import { type Route } from './+types/base';
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

export const loader = async ({ request, context }: Route.LoaderArgs) => {
  const tenant = context.get(appLoadContext)?.tenant;
  const pages = await fetchStrapiPages();
  const [navbarEntries, footerEntries] = splitArrayByKey(Object.values(pages), 'linkage');
  const url = new URL(request.url);
  const faviconUrl = `${ENV.MODE !== 'development' ? resourceBase : ''}/${tenant ? `favicon-${tenant}` : 'favicon'}.ico`;
  const publicUrl = `${url.origin}${url.pathname.replace(`/${tenant}`, '')}`;

  // Generate meta tags
  const meta = generateMetaTags({ navbarEntries, footerEntries, publicUrl, faviconUrl });

  return { navbarEntries, footerEntries, faviconUrl, publicUrl, meta };
};

const Page = ({ loaderData: { navbarEntries, footerEntries } }: Route.ComponentProps) => {
  const updateScreenSize = useScreenStore.use.updateScreenSize();

  useEffect(() => {
    // track screen size
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, [updateScreenSize]);

  return (
    <div className='relative overflow-x-hidden'>
      <Navbar navbarEntries={navbarEntries} />
      <LoadingBar />
      <div className='app-container !pb-0 min-h-[calc(100svh-96px-96px)]'>
        <Outlet />
      </div>
      <Footer footerEntries={footerEntries} />
    </div>
  );
};

export default Page;
