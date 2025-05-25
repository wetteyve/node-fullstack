import { Lead } from '#rs911/components/building-blocks/Lead';
import { type DatenschutzContent } from '#rs911/utils/strapi.utils';

export const Datenschutz = ({
  content: {
    datenschutz: { description, title },
  },
}: {
  content: DatenschutzContent;
}) => (
  <>
    <h1 className='typo-headline-lg my-8'>{title}</h1>
    <Lead lead={{ title: '', description: description }} className='pb-12 !max-w-[full] [&>*>p]:mb-8' smallBreaks />
  </>
);
