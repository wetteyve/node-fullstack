import { type Route } from '../../+types/_index';

export const loader = ({ context }: Route.LoaderArgs) => {
  return { data: 'This is the uht-herisau API endpoint for the fässlicup counting service.', tenant: context.tenant };
};
