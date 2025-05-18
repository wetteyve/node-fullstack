import { fetchStrapiContent } from "#rs911/utils/page.utils";
import { type Route } from "./+types";

export const loader= async() => {
  const path = 'kontakt'
  const {content} = (await fetchStrapiContent(path))[path]
  return {content}
};

const Page = ({loaderData: {content}}: Route.ComponentProps) => {
  return (
    <div>
      {content.__component}
    </div>
  );
}

export default Page;