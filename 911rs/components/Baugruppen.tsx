import Lead from './building-blocks/Lead';

export const Baugruppen = ({ content }: { content: any }) => (
  <div className='w-full relative'>
    <div className=' w-screen h-full bg-secondary/[0.08] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
    <Lead lead={content.bildstrecken_lead} className='pt-10' />
  </div>
);
