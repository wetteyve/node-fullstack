import HeaderPicture from "#rs911/components/building-blocks/image/HeaderPicture";
import Lead from "#rs911/components/building-blocks/Lead";
import { fetchStrapiContent } from "#rs911/utils/page.utils";
import { type Route } from "./+types";

export const loader= async() => {
  const path = 'start'
  const {content} = (await fetchStrapiContent(path))[path]
  return {content}
};

const Page = ({loaderData: {content}}: Route.ComponentProps) => {
  return (
    <div className='pb-4'>
      <HeaderPicture file={content.header_picture} />
      <h1 className='typo-headline-lg pt-6 text-primary'>{'Wartung, Pflege und Restauration'.toUpperCase()}</h1>
      <Lead lead={content.lead} />
  </div>
  );
}

export default Page;