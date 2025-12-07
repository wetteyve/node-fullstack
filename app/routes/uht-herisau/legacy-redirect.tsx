import { redirect } from 'react-router';
import { getTenant } from '#app/utils/middlewares/app-load.context';
import { type Route } from './+types/legacy-redirect';

// This redirects weird routes from old versions of the app towards the new start page.
export const loader = ({ context }: Route.LoaderArgs) => {
  const tenant = getTenant(context);
  return redirect(`${tenant ? '' : '/uht-herisau'}/start`);
};
