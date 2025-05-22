import { IoIosArrowRoundBack } from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router';
import { useHydrated } from '#app/utils/use-hydrated';
import { Baugruppen } from '#rs911/components/Baugruppen';
import HeaderPicture from '#rs911/components/building-blocks/image/HeaderPicture';
import { Image } from '#rs911/components/building-blocks/image/Image';
import Lead from '#rs911/components/building-blocks/Lead';
import { fetchStrapiContent } from '#rs911/utils/page.utils';
import { type Route } from './+types';

export const loader = async () => {
  const path = 'leistungen';
  const { content } = (await fetchStrapiContent(path))[path];
  return { content };
};

const Page = ({ loaderData: { content } }: Route.ComponentProps) => {
  const navigate = useNavigate();
  const hydrated = useHydrated();
  const baugruppeIndex = useLocation().hash.split('-')[1];
  const baugruppe = hydrated && baugruppeIndex && content.baugruppen[Number(baugruppeIndex)];

  const BaugruppeOverlay = baugruppe && (
    <div className='relative'>
      <h1 className='typo-headline-lg my-8'>{baugruppe.title}</h1>
      <Image file={baugruppe.picture} twAspect='aspect-video' />
      <Lead lead={{ title: '', description: baugruppe.description }} className='py-12' />
      <button
        aria-label='go back to "leistungen"'
        className='text-primary position md:absolute relative bottom-6 p-6 pl-0 md:pl-6 right-0 flex items-center gap-4 hover:cursor-pointer'
        onClick={() => navigate('#')}
      >
        <IoIosArrowRoundBack size={35} />
        zurück
      </button>
    </div>
  );

  return baugruppe ? (
    BaugruppeOverlay
  ) : (
    <>
      <HeaderPicture file={content.header_picture} />
      <Lead lead={content.lead} className='py-12' titleStyles='text-secondary' />
      <Baugruppen content={content} />
    </>
  );
};

export default Page;
