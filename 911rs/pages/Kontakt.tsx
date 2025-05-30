import { Lead } from '#rs911/components/building-blocks/Lead';
import { type KontaktContent } from '#rs911/utils/strapi.utils';

export const Kontakt = ({ content: { title, lead, address } }: { content: KontaktContent }) => (
  <>
    <div className='relative text-white pb-8'>
      <div className=' w-screen h-[calc(100%+52px)] bg-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[calc(50%+52px)] -z-1' />
      <h1 className='typo-headline-lg my-8'>{title.toUpperCase()}</h1>
      <Lead lead={{ title: '', description: lead }} className='pb-12' linkColor={false} smallBreaks />
      <Lead lead={{ title: '', description: address }} className='pb-12' linkColor={false} smallBreaks />
    </div>
    <div className='my-8 w-full'>
      <iframe
        src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2694.8125291370316!2d9.427637177440225!3d47.5130420711814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479ade29d770c415%3A0x56ab1013c9638930!2sAlte%2011er%20Garage%20GmbH!5e0!3m2!1sde!2sch!4v1748161350125!5m2!1sde!2sch'
        className='w-full sm:aspect-video aspect-2/3 border-0'
        loading='lazy'
        referrerPolicy='no-referrer-when-downgrade'
      ></iframe>
    </div>
  </>
);
