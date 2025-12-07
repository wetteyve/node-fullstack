import { isRouteErrorResponse, Links, Outlet, Scripts, ScrollRestoration } from 'react-router';

import { findMetaInMatches, MetaTags } from '#app/utils/meta.utils';
import { appLoadContext, getTenantHack } from '#app/utils/middlewares/app-load.context';
import { type Route } from './+types/root';

export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenantHack(context);
  context.set(appLoadContext, { tenant });
  return { tenant };
};

export default function App({ loaderData: { tenant }, matches }: Route.ComponentProps) {
  const metaDescriptors = findMetaInMatches(matches.filter((match): match is NonNullable<typeof match> => match !== undefined));

  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <MetaTags descriptors={metaDescriptors} />
        <Links />
        <script
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: `
              window.__TENANT__ = ${JSON.stringify({ tenant })};`,
          }}
        />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!';
  let details = 'An unexpected error occurred.';
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error';
    details = error.status === 404 ? 'The requested page could not be found.' : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
