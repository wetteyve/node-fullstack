import { Image } from './Image';

type Props = {
  file: any;
};
const HeaderPicture = ({ file }: Props) => {
  return (
    <div className='-translate-x-[calc(50svw-50%)]'>
      <div className='-mt-5 w-svw'>
        <Image file={file} twAspect='aspect-16/7' />
      </div>
    </div>
  );
};

export default HeaderPicture;
