import { getImage } from './get-image';
import { Image } from './Image';

type Props = {
  file: any;
};
const HeaderPicture = ({ file }: Props) => {
  const { url, alternativeText } = getImage(file);

  return (
    <div className='-translate-x-[calc(50svw-50%)]'>
      <div className='-mt-5 w-svw bg-cover'>
        <Image height='min(60vh,692px)' url={url} alt={alternativeText} />
      </div>
    </div>
  );
};

export default HeaderPicture;
