import { type ClassValue } from 'clsx';
import { useState, useEffect, useRef, type Ref } from 'react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { CarouselImage, Image } from '#uht-herisau/components/building-blocks/Image';

export const Slider = ({ slides, twFit }: { slides: { data: any[] }; twFit?: ClassValue }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const displayCarousel = slides.data.length > 1;

  useEffect(() => {
    if (!displayCarousel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = itemRefs.current.findIndex((el) => el === visibleEntry.target);
          if (index !== -1 && index !== activeIndex) {
            setActiveIndex(index);
          }
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5, // Adjust as needed for sensitivity
      }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      itemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [displayCarousel, activeIndex]);

  const scrollToIndex = (index: number) => {
    const ref = itemRefs.current[index];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const handleSetActiveIndex = (index: number) => {
    scrollToIndex(index);
  };

  const Carousel = (
    <div className='overflow-x-auto snap-x snap-mandatory flex scroll-smooth w-full hide-scrollbar'>
      {slides.data.map((image: any, index: number) => (
        <div
          key={index}
          ref={((el: HTMLDivElement) => (itemRefs.current[index] = el)) as unknown as Ref<HTMLDivElement>}
          className='snap-center shrink-0 w-full'
        >
          <CarouselImage file={image} twFit={twFit} />
        </div>
      ))}
    </div>
  );

  const backClick = () => handleSetActiveIndex((activeIndex - 1 + slides.data.length) % slides.data.length);
  const nextClick = () => handleSetActiveIndex((activeIndex + 1) % slides.data.length);

  const PointerButtons = (
    <div className='touch:hidden absolute bottom-0 right-0 z-10 size-1/5 bg-uht-red flex items-center text-white typo-headline-xs justify-center px-8 gap-12'>
      <span>{`${activeIndex + 1}/${slides.data.length}`}</span>
      <div className='h-full flex items-center'>
        <button className='h-full cursor-pointer px-2' aria-label='previous image' onClick={backClick}>
          <IoIosArrowRoundBack size={35} />
        </button>
        <button className='h-full cursor-pointer px-2' aria-label='next image' onClick={nextClick}>
          <IoIosArrowRoundForward size={35} />
        </button>
      </div>
    </div>
  );

  const TouchIndicator = (
    <div className='mouse:hidden absolute bottom-0 right-0 z-10 size-1/5 bg-uht-red flex items-center text-white typo-headline-xs justify-center px-8 gap-12'>
      <span>{`${activeIndex + 1}/${slides.data.length}`}</span>
    </div>
  );

  return (
    <div className='relative'>
      {displayCarousel ? (
        <>
          {Carousel}
          {PointerButtons}
          {TouchIndicator}
        </>
      ) : (
        <Image file={slides.data[0]} twFit={twFit} />
      )}
    </div>
  );
};
