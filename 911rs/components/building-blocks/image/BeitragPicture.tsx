import { getImage } from './get-image';

type Props = {
  file: any;
};

export const BeitragPicture = ({ file }: Props) => {
  const { url, alternativeText } = getImage(file);

  return (
    <div className='overflow-hidden mb-4'>
      <img src={url} alt={alternativeText} className='w-full h-full object-cover' />
    </div>
  );
};
