import { Image } from '#rs911/components/building-blocks/image/Image';

type Props = {
  file: any;
};
export const HeaderPicture = ({ file }: Props) => {
  return (
    <div className='-translate-x-[calc(50svw-50%)]'>
      <div className='-mt-5 w-svw'>
        <Image file={file} twAspect='aspect-16/7' />
      </div>
    </div>
  );
};
