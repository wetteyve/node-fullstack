import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import { getImage } from '#app/utils/get-strapi-image.utils';
import { Image } from '#uht-herisau/components/building-blocks/Image';
import { Carousel, CarouselContent, CarouselItem } from '#uht-herisau/components/ui/carousel';

type SliderItem = any;
type AutoplayOptions = {
  playOnInit: boolean;
  delay: number;
};

type SliderProps = {
  slider: {
    data: SliderItem[];
  };
  autoPlay?: AutoplayOptions;
};

const getLazyImage = (image: SliderItem): React.ReactNode => {
  const { url, alternativeText } = getImage({ data: image });
  return <Image url={url} alt={alternativeText} link={image.link} />;
};

const Slider = ({ slider, autoPlay }: SliderProps) => {
  const plugins = autoPlay ? [Autoplay({ playOnInit: autoPlay.playOnInit, delay: autoPlay.delay })] : [];

  return (
    <Carousel plugins={plugins} className='w-full'>
      <CarouselContent className='bg-white'>
        {slider.data.map((item) => (
          <CarouselItem key={item.id}>{getLazyImage(item)}</CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default Slider;
