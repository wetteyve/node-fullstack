import { type Page } from "#app/utils/911rs/page.type";
import { type Route } from "./+types";


export const loader= async({request}:Route.LoaderArgs) => {
    const {pathname} = new URL(request.url);
    return {pathname}
};

const Page = ({loaderData: {pathname}}: Route.ComponentProps) => {
  return (
    <div>
      {pathname}
    </div>
  );
}

export default Page;