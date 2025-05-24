import { HeaderPicture } from '#rs911/components/building-blocks/image/HeaderPicture';
import { Image } from '#rs911/components/building-blocks/image/Image';
import { Lead } from '#rs911/components/building-blocks/Lead';
import { type ScreenSize, useScreenStore } from '#rs911/store/screen.store';
import { type AboutContent } from '#rs911/utils/strapi.utils';

// this screen sizes are considered small
const smallSceenSize: ScreenSize[] = ['sm', 'md'];

export const About = ({ content: { about, car } }: { content: AboutContent }) => {
  const screenSize = useScreenStore.use.screenSize();
  const isSmallScreen = smallSceenSize.includes(screenSize);
  const AboutImage = isSmallScreen ? (
    <HeaderPicture file={about.picture} />
  ) : (
    <Image file={about.picture} twAspect='w-[36%] !object-contain' />
  );
  const AboutTitle = <h1 className='typo-headline-lg mt-8'>{about.title}</h1>;
  const AboutDescription = <Lead lead={{ title: '', description: about.description }} className='pb-12' />;

  return (
    <>
      <section>
        {isSmallScreen ? (
          <>
            {AboutImage}
            {AboutTitle}
            {AboutDescription}
          </>
        ) : (
          <>
            {AboutTitle}
            <div className='flex gap-12 items-start'>
              {AboutDescription}
              {AboutImage}
            </div>
          </>
        )}
      </section>
      <section>
        <h2 className='typo-headline-md-lg mb-4'>{car.title}</h2>
        <Image file={car.picture} twAspect='aspect-video' />
        <Lead lead={{ title: '', description: car.description }} className='py-12' />
      </section>
    </>
  );
};
