import { Beitraege } from '#rs911/components/building-blocks/Beitraege';
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
      <Lead lead={content.lead} className='pb-12' titleStyles='text-secondary' />
      <Beitraege content={content} />
    </>
  );
};

export default Page;
