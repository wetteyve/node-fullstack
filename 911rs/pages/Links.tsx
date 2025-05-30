import { Image } from '#rs911/components/building-blocks/image/Image';
import { Lead } from '#rs911/components/building-blocks/Lead';
import { type LinksContent } from '#rs911/utils/strapi.utils';

export const Links = ({ content: { links } }: { content: LinksContent }) => {
  return (
    <>
      <h1 className='typo-headline-lg my-8'>{links.title.toUpperCase()}</h1>
      <div className='relative'>
        <Lead lead={{ title: '', description: links.description }} className='pb-12 lg:w-1/2' />
        <div className='lg:absolute lg:bottom-0 lg:right-0 lg:max-w-3/5 mb-12'>
          <Image file={links.picture} twAspect='apsect-video' />
        </div>
      </div>
    </>
  );
};
