import { shuffle } from '#app/utils/array.utils';
import {
  fetchStrapiCategories,
  fetchStrapiContent,
  fetchStrapiSponsors,
  getRouteElement,
  handleError,
  type Page,
} from '#uht-herisau/utils/page.utils';
import { type Route } from './+types';

export const loader = async ({ params }: Route.LoaderArgs) => {
  const { level1, level2 } = params;
  const path = `${level1}${level2 ? `/${level2}` : ''}`;
  const [pages, sponsors, categories] = await Promise.all([fetchStrapiContent(path), fetchStrapiSponsors(), fetchStrapiCategories()]);
  const pageData: Page | undefined = pages[path];
  if (!pageData) {
    throw new Response('Not Found', { status: 404 });
  }
  return { content: { ...pageData.content, sponsors: shuffle(sponsors), categories } };
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

const UhtPage = ({ loaderData: { content } }: Route.ComponentProps) => {
  return getRouteElement(content);
};

export default UhtPage;
