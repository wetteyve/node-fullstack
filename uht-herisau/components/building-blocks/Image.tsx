type Props = {
  height?: string;
  width?: string;
  url: string;
  alt?: string;
  link?: string;
};

export const Image = ({ height, url, alt, width = '100%', link }: Props) => {
  const Image = (
    <div className={`m-auto overflow-hidden `} style={{ maxHeight: height }}>
      <img className='object-contain' style={{ width }} src={url} alt={alt} />
    </div>
  );

  return (
    <>
      {link ? (
        <a href={link} target='_blank' referrerPolicy='no-referrer'>
          {Image}
        </a>
      ) : (
        Image
      )}
    </>
  );
};
