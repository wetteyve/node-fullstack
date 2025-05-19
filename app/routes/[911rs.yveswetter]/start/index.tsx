import HeaderPicture from '#rs911/components/building-blocks/image/HeaderPicture';
import Lead from '#rs911/components/building-blocks/Lead';
import { fetchStrapiContent } from '#rs911/utils/page.utils';
import { type Route } from './+types';

export const loader = async () => {
  const path = 'start';
  const { content } = (await fetchStrapiContent(path))[path];
  return { content };
};

const Page = ({ loaderData: { content } }: Route.ComponentProps) => {
  return (
    <div className='pb-4'>
      <HeaderPicture file={content.header_picture} />
      <h1 className='typo-headline-lg pt-6 text-primary'>{'Wartung, Pflege und Restauration'.toUpperCase()}</h1>
      <Lead lead={content.lead} />
      <div className='w-full h-96 relative'>
        <div className='w-screen h-full bg-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' />
        <Lead lead={content.beitrag_lead} />
      </div>
    </div>
  );
};

export default Page;
