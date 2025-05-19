type Props = {
  height?: string;
  width?: string;
  url: string;
  alt?: string;
};

export const Image = ({ height, url, alt, width = '100%' }: Props) => {
  return (
    <div className={`mx-auto w-full max-w-[1440px] overflow-hidden`} style={{ maxHeight: height }}>
      <img style={{ width }} src={url} alt={alt} />
    </div>
  );
};
