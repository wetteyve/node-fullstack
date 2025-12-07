import { redirect } from 'react-router';
import { type Route } from './+types/legacy-redirect';

// This redirects weird routes from old versions of the app towards the new start page.
export const loader = ({ context: { tenant } }: Route.LoaderArgs) => {
  return redirect(`${tenant ? '' : '/uht-herisau'}/start`);
};
