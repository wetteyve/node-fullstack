import { type Route } from './+types/contact-form';

export const loader = ({ context }: Route.LoaderArgs) => {
  return { data: 'This is the contact form API endpoint for the mailer service.', tenant: context.tenant };
};
