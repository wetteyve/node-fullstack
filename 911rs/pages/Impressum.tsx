import { Image } from '#rs911/components/building-blocks/image/Image';
import { Lead } from '#rs911/components/building-blocks/Lead';
import { type ImpressumContent } from '#rs911/utils/strapi.utils';

export const Impressum = ({
  content: {
    impressum: { description, picture, title },
  },
}: {
  content: ImpressumContent;
}) => (
  <>
    <h1 className='typo-headline-lg my-8'>{title.toUpperCase()}</h1>
    <div className='flex flex-col sm:flex-row gap-0 sm:gap-12 mb-12'>
      <Lead lead={{ title: '', description: description }} className='pb-12 !max-w-[350px]' smallBreaks />
      <div className='pt-4 w-full'>
        <Image file={picture} />
      </div>
    </div>
  </>
);
