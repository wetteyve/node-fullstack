import { type LoaderFunctionArgs, redirect } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (process.env.NODE_ENV === 'development') {
    const links = {
      '911rs': {
        home: `${request.url}911rs/home`,
      },
      'uht-herisau': {
        home: `${request.url}uht-herisau/home`,
      },
    };

    return new Response(JSON.stringify(links), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  return redirect(`${request.url}home`);
};
