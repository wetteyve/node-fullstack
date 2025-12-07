import axios, { type AxiosRequestConfig } from 'axios';
import { sendEmailToRegistrar } from '#uht-herisau/utils/mail.utils';
import { type Registration, RegistrationSchema } from '#uht-herisau/utils/registration.utils';
import { type Route } from './+types/registration';

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

  // Create the registration in Strapi
  const {
    data: {
      data: { id },
    },
  } = await axios.request(reqConfig({ method: 'POST', registration })).catch((e: Error) => {
    console.error(e.message, e.stack);
    throw new Response('Strapi registration failed', { status: 500 });
  });

  // Send email to registrar
  await sendEmailToRegistrar(registration).catch(async () => {
    // Revert registration in Strapi if email sending fails
    await axios.request(reqConfig({ method: 'DELETE', registrationId: id })).catch((e: Error) => {
      console.error('Failed to revert registration in Strapi after email failure:', e.message, e.stack);
    });
    throw new Response('Failed to send registration email', { status: 500 });
  });
  console.log('Registration email sent for ID:', id);
  return new Response('Registration successful', { status: 200 });
};

type ConfigSignature = { method: 'POST'; registration: Registration } | { method: 'DELETE'; registrationId: string };
const reqConfig = (props: ConfigSignature): AxiosRequestConfig => {
  const { method } = props;
  const config: AxiosRequestConfig = {
    method,
    maxBodyLength: Infinity,
    headers: {
      Authorization: `Bearer ${ENV.UHT_CMS_SERVER_KEY}`,
      'Content-Type': 'application/json',
    },
  };
  if (method === 'POST') {
    config.url = `${ENV.UHT_CMS_API}/registrations`;
    config.data = { data: props.registration };
  } else if (method === 'DELETE') {
    config.url = `${ENV.UHT_CMS_API}/registrations/${props.registrationId}`;
  }
  return config;
};
