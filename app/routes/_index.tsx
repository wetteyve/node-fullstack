import { type LoaderFunctionArgs } from 'react-router';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (process.env.NODE_ENV === 'development') {
    const links = {
      '911rs': {
        start: `${request.url}911rs.yveswetter/start`,
        leistungen: `${request.url}911rs.yveswetter/leistungen`,
        ueberMich: `${request.url}911rs.yveswetter/ueber-mich`,
        links: `${request.url}911rs.yveswetter/links`,
        agenda: `${request.url}911rs.yveswetter/agenda`,
        kontakt: `${request.url}911rs.yveswetter/kontakt`,
      },
      'uht-herisau': {
        home: `${request.url}new.uht-herisau/home`,
      },
    };

    return new Response(JSON.stringify(links), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
