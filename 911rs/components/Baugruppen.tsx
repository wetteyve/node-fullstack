import clsx, { type ClassValue } from 'clsx';
import { Image } from './building-blocks/image/Image';
import Lead from './building-blocks/Lead';

export const Baugruppen = ({ content }: { content: any }) => (
  <div className='w-full relative'>
    <div className=' w-screen h-full bg-secondary/[0.08] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
    <Lead lead={content.baugruppen_lead} className='pt-10' />
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-12'>
      {content.baugruppen.map((baugruppe: any, i: number) => (
        <Link key={i} url={`#baugruppe-${i}`} className='w-full mt-auto grayscale-100 brightness-80 hover:grayscale-0 hover:brightness-100'>
          <Image twAspect='aspect-square' file={baugruppe.picture} />
          <h3 className='mt-4 typo-display-sm'>{baugruppe.title}</h3>
        </Link>
      ))}
    </div>
  </div>
);

const Link = ({ url, children, className }: { url: string; children: React.ReactNode; className?: ClassValue }) => (
  <div className={clsx(className)}>
    <a href={url}>{children}</a>
  </div>
);
