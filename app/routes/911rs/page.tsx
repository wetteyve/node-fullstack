import { fetchStrapiContent, getRouteElement, handleError, type Page } from '#rs911/utils/page.utils';
import { groupEventsByYearAndMonth } from '#rs911/utils/strapi.utils';
import { type Route } from './+types/page';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { page } = params;
  const pageData: Page | undefined = (await fetchStrapiContent(page))[page];
  if (!pageData) {
    throw new Response('Not Found', { status: 404 });
  }

  // presort agenda events if the page is an agenda page
  if (pageData.content.__component === 'pages.agenda-page') {
    if (Array.isArray(pageData.content.events)) {
      pageData.content.events = groupEventsByYearAndMonth(pageData.content.events);
    }
  }

  return { content: pageData.content };
};

export const ErrorBoundary = ({ error }: Route.ErrorBoundaryProps) => {
  const errorType = handleError(error);
  switch (errorType) {
    case 'NotFound':
      return <div>Seite nicht gefunden</div>;
    case 'NotImplemented':
      return <div>Darstellung nicht implementiert</div>;
    default:
      console.error(error);
      return <div>Ups, da ist etwas schief gelaufen</div>;
  }
};

const Page = ({ loaderData: { content } }: Route.ComponentProps) => {
  return getRouteElement(content);
};

export default Page;
