import { isRouteErrorResponse } from 'react-router';
import { Leistungen } from '#rs911/pages/Leistungen';
import { Start } from '#rs911/pages/Start';
import { fetchStrapiContent } from '#rs911/utils/page.utils';
import { type LeistungenContent, type HomeContent } from '#rs911/utils/strapi.utils';
import { type Route } from './+types';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { page } = params;
  const content = (await fetchStrapiContent(page))[page]?.content;
  if (!content) {
    throw new Response('Not Found', { status: 404 });
  }

  return { content };
};

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>Seite nicht gefunden</div>;
  }
  return <div>Ups, da ist etwas schief gelaufen</div>;
};

const Page = ({ loaderData: { content } }: Route.ComponentProps) => {
  return getRouteElement(content);
};

export default Page;

export const getRouteElement = (content: { __component: string }) => {
  switch (content.__component) {
    case 'pages.home-page': {
      return <Start content={content as HomeContent} />;
    }
    case 'pages.leistungen-page':
      return <Leistungen content={content as LeistungenContent} />;
    default:
      return <div>Representation not implemented</div>;
  }
};
