import clsx, { type ClassValue } from 'clsx';
import { getImage } from './get-image';

export const Image = ({ file, twAspect = 'aspect-video' }: { file: any; twAspect?: ClassValue }) => {
  const { url, alternativeText } = getImage(file);

  return (
    <div className='overflow-hidden h-auto'>
      <img src={url} alt={alternativeText} className={clsx('w-full h-full object-cover', twAspect)} />
    </div>
  );
};

export const CarouselImage = ({ file, twAspect = 'aspect-video' }: { file: any; twAspect?: ClassValue }) => {
  const { url, alternativeText } = getImage(file);

  return (
    <div className='flex-shrink-0 w-full h-full snap-center flex items-center justify-center'>
      <img src={url} alt={alternativeText} className={clsx('w-full h-full object-cover', twAspect)} />
    </div>
  );
};
