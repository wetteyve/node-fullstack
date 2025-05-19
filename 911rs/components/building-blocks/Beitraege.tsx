import { BeitragPicture } from './image/BeitragPicture';
import Lead from './Lead';

export const Beitraege = ({ content }: { content: any }) => (
  <div className='w-full relative'>
    <div className=' w-screen h-full bg-secondary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
    <Lead lead={content.beitrag_lead} className='pt-10' />
    <div className='grid grid-cols-1 gap-12 md:gap-28 md:grid-cols-2 pt-5 pb-10'>
      {content.beitrag_collection.map((b: any) => (
        <div className='w-full' key={b.id}>
          <h3 className='typo-headline-sm mb-4'>{b.title}</h3>
          <BeitragPicture file={b.lead_picture} />
          <a href={b.external_link} className='text-primary underline typo-display-md' target='_blank' rel='noreferrer'>
            Mehr erfahren
          </a>
        </div>
      ))}
    </div>
  </div>
);
