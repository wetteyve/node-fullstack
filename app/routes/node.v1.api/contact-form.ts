import { getTenant } from '#app/utils/middlewares/app-load.context';
import { type Route } from './+types/contact-form';

export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  return { data: 'This is the contact form API endpoint for the mailer service.', tenant };
};
