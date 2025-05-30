import clsx, { type ClassValue } from 'clsx';
import { getImage } from '#app/utils/get-strapi-image.utils';
import { useHydrated } from '#app/utils/use-hydrated';

type ImageProps = {
  file: any;
  twAspect?: ClassValue;
  twFit?: ClassValue;
};

export const Image = ({ file, twAspect = 'aspect-video', twFit = 'object-cover' }: ImageProps) => {
  const hdyrated = useHydrated();
  const { url: initialUrl, alternativeText } = getImage(file, 'medium');
  const { url: clientUrl } = getImage(file);
  const url = hdyrated ? clientUrl : initialUrl;

  return (
    <div className='h-auto'>
      <WrappedImage url={url} alternativeText={alternativeText} twAspect={twAspect} twFit={twFit} link={file?.link} />
    </div>
  );
};

export const CarouselImage = ({ file, twAspect = 'aspect-video', twFit = 'object-cover' }: ImageProps) => {
  const hdyrated = useHydrated();
  const { url: initialUrl, alternativeText } = getImage(file, 'medium');
  const { url: clientUrl } = getImage(file);
  const url = hdyrated ? clientUrl : initialUrl;

  return (
    <div className='flex-shrink-0 w-full h-full snap-center flex items-center justify-center'>
      <WrappedImage url={url} alternativeText={alternativeText} twAspect={twAspect} twFit={twFit} link={file?.link} />
    </div>
  );
};

export const WrappedImage = ({
  url,
  link,
  alternativeText,
  twAspect,
  twFit,
}: {
  url: string;
  link?: string;
  alternativeText?: string;
  twAspect?: ClassValue;
  twFit?: ClassValue;
}) => {
  const Image = <img src={url} alt={alternativeText} className={clsx('w-full h-full', twAspect, twFit)} />;
  return link ? (
    <a href={link} target='_blank' referrerPolicy='no-referrer'>
      {Image}
    </a>
  ) : (
    Image
  );
};
