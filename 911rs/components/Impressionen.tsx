import { useState, useEffect, useRef, type Ref } from 'react';
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from 'react-icons/io';
import { CarouselImage, Image } from './building-blocks/image/Image';

export const Impressionen = ({ impressionen }: { impressionen: { data: any[] } }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const displayCarousel = impressionen.data.length > 1;

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
        threshold: 0.35, // Adjust as needed for sensitivity
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
      {impressionen.data.map((image: any, index: number) => (
        <div
          key={index}
          ref={((el: HTMLDivElement) => (itemRefs.current[index] = el)) as unknown as Ref<HTMLDivElement>}
          className='snap-center shrink-0 w-full'
        >
          <CarouselImage file={image} />
        </div>
      ))}
    </div>
  );

  const backClick = () => handleSetActiveIndex((activeIndex - 1 + impressionen.data.length) % impressionen.data.length);
  const nextClick = () => handleSetActiveIndex((activeIndex + 1) % impressionen.data.length);

  const PointerButtons = (
    <div className='touch:hidden absolute bottom-0 right-0 z-10 size-1/5 bg-secondary flex items-center text-white typo-headline-xs justify-center px-8 gap-12'>
      <span>{`${activeIndex + 1}/${impressionen.data.length}`}</span>
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

  const TouchButtons = (
    <>
      <button
        className='absolute top-1/2 left-1 cursor-pointer md:size-14 size-8 p-2 bg-secondary/60 text-center rounded-full'
        aria-label='previous image'
        onClick={backClick}
      >
        <IoIosArrowRoundBack className='text-white w-full text-[15px] md:text-[35px]' />
      </button>
      <button
        className='absolute top-1/2 right-1 cursor-pointer md:size-14 size-8 p-2 bg-secondary/60 text-center rounded-full'
        aria-label='next image'
        onClick={nextClick}
      >
        <IoIosArrowRoundForward className='text-white w-full text-[15px] md:text-[35px]' />
      </button>
    </>
  );

  return (
    <div className='py-10 w-full'>
      <h2 className='typo-headline-lg mb-6'>Impressionen Werkstatt</h2>
      <div className='relative'>
        {displayCarousel ? (
          <>
            {Carousel}
            {PointerButtons}
            {TouchButtons}
          </>
        ) : (
          <Image file={impressionen.data[0]} />
        )}
      </div>
    </div>
  );
};
