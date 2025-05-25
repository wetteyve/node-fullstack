import { type HomeContent } from '#rs911/utils/strapi.utils';
import { Image } from './building-blocks/image/Image';
import { Lead } from './building-blocks/Lead';

export const Beitraege = ({ content }: { content: HomeContent }) => (
  <div className='w-full relative'>
    <div className=' w-screen h-full bg-secondary/[0.08] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
    <Lead lead={content.beitrag_lead} className='pt-10' />
    <div className='grid grid-cols-1 gap-12 md:gap-28 md:grid-cols-2 pt-5 pb-10'>
      {content.beitrag_collection.map((b, i) => (
        <LinkCard beitrag={b} key={`${b.title}-${i}`} />
      ))}
    </div>
  </div>
);

const LinkCard = ({ beitrag }: { beitrag: HomeContent['beitrag_collection'][number] }) => (
  <a href={beitrag.external_link} target='_blank' rel='noreferrer' className='group block'>
    <div className='w-full mt-auto'>
      <h3 className='typo-headline-sm mb-4'>{beitrag.title}</h3>
      <Image file={beitrag.lead_picture} />
      <p className='typo-display-md mt-4 relative inline-block text-primary mouse:underline-on-hover touch:!underline'>Mehr erfahren</p>
    </div>
  </a>
);
