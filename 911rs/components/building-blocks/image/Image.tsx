import clsx, { type ClassValue } from 'clsx';
import { getImage } from './get-image';

type Props = {
  height?: string;
  width?: string;
  url: string;
  alt?: string;
};

export const Image = ({ file, twAspect = 'aspect-video' }: { file: Props; twAspect?: ClassValue }) => {
  const { url, alternativeText } = getImage(file);

  return (
    <div className='overflow-hidden h-auto'>
      <img src={url} alt={alternativeText} className={clsx('w-full h-full object-cover', twAspect)} />
    </div>
  );
};
