import { type LinksFunction, Outlet } from 'react-router';
import '#uht-herisau/styles/app.css';

export const links: LinksFunction = () => [
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

const UhtLayout = () => <Outlet />;

export default UhtLayout;
