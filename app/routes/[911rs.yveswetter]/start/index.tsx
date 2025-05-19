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
    <>
      <HeaderPicture file={content.header_picture} />
      <h1 className='typo-headline-lg pt-6 text-primary'>{'Wartung, Pflege und Restauration'.toUpperCase()}</h1>
      <Lead lead={content.lead} className='pb-12' />
      <div className='w-full h-96 relative'>
        <div className=' w-screen h-full bg-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
        <Lead lead={content.beitrag_lead} className='pt-10' />
        <div className='grid grid-cols-1 md:grid-cols-2 pt-5'>
          {content.beitrag_collection.map((b: any) => (
            <div className='w-full' key={b.id}>
              <>{b.title}</>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Page;
