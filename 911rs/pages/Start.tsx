import { Beitraege } from '#rs911/components/Beitraege';
import { HeaderPicture } from '#rs911/components/building-blocks/image/HeaderPicture';
import { Lead } from '#rs911/components/building-blocks/Lead';
import { Impressionen } from '#rs911/components/Impressionen';
import { type HomeContent } from '#rs911/utils/strapi.utils';

export const Start = ({ content }: { content: HomeContent }) => {
  return (
    <>
      <HeaderPicture file={content.header_picture} />
      <h1 className='typo-headline-lg pt-6 text-primary'>{'Wartung, Pflege und Restauration'.toUpperCase()}</h1>
      <Lead lead={content.lead} className='pb-12' titleStyles='text-secondary' />
      <Beitraege content={content} />
      <Impressionen impressionen={content.impressionen} />
    </>
  );
};
