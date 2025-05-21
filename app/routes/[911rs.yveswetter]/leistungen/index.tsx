import { Baugruppen } from '#rs911/components/Baugruppen';
import HeaderPicture from '#rs911/components/building-blocks/image/HeaderPicture';
import Lead from '#rs911/components/building-blocks/Lead';
import { fetchStrapiContent } from '#rs911/utils/page.utils';
import { type Route } from './+types';

export const loader = async () => {
  const path = 'leistungen';
  const { content } = (await fetchStrapiContent(path))[path];
  return { content };
};

const Page = ({ loaderData: { content } }: Route.ComponentProps) => {
  return (
    <>
      <HeaderPicture file={content.header_picture} />
      <Lead lead={content.lead} className='py-12' titleStyles='text-secondary' />
      <Baugruppen content={content} />
    </>
  );
};

export default Page;
