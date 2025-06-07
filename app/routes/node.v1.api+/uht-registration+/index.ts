import axios, { type AxiosRequestConfig } from 'axios';
import { RegistrationSchema } from '#uht-herisau/utils/registration.utils';
import { type Route } from './+types';

export const action = async ({ request }: Route.ActionArgs) => {
  // Throw an error if the request method is not POST
  if (request.method !== 'POST') {
    throw new Response('Method not allowed', { status: 405 });
  }
  // Parse and validate the request body
  const body = await request.json();
  const { success, data: registration, error } = RegistrationSchema.safeParse(body);
  if (!success) {
    throw new Response(error.message, { status: 400 });
  }

  console.log('Parsed registration data:', registration);

  const config: AxiosRequestConfig = {
    method: 'POST',
    maxBodyLength: Infinity,
    url: `${ENV.UHT_CMS_API}/registrations`,
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
    data: { data: registration },
  };
  return (
    await axios.request(config).catch((e: Error) => {
      console.error(e.message, e.stack);
      throw new Response('strapi registration failed', { status: 500 });
    })
  ).data;
};
