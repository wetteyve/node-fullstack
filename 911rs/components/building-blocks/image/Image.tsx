import clsx, { type ClassValue } from 'clsx';
import { useHydrated } from '#app/utils/use-hydrated';
import { getImage } from './get-image';

export const Image = ({ file, twAspect = 'aspect-video' }: { file: any; twAspect?: ClassValue }) => {
  const hdyrated = useHydrated();
  const { url: initialUrl, alternativeText, caption } = getImage(file, 'medium');
  const { url: clientUrl } = getImage(file);
  const url = hdyrated ? clientUrl : initialUrl;

  return (
    <div className='h-auto'>
      <img src={url} alt={alternativeText} className={clsx('w-full h-full object-cover', twAspect)} />
      {caption && <caption className='w-full whitespace-nowrap mt-6 typo-display-md'>{caption}</caption>}
    </div>
  );
};

export const CarouselImage = ({ file, twAspect = 'aspect-video' }: { file: any; twAspect?: ClassValue }) => {
  const hdyrated = useHydrated();
  const { url: initialUrl, alternativeText } = getImage(file, 'medium');
  const { url: clientUrl } = getImage(file);
  const url = hdyrated ? clientUrl : initialUrl;

  return (
    <div className='flex-shrink-0 w-full h-full snap-center flex items-center justify-center'>
      <img src={url} alt={alternativeText} className={clsx('w-full h-full object-cover', twAspect)} />
    </div>
  );
};
