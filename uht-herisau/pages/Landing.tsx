import { NavLink } from 'react-router';
import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { Slider } from '#uht-herisau/components/building-blocks/Slider';
import { SponsorCard, UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type Sponsor, type LandingContent } from '#uht-herisau/utils/strapi.utils';

export const LandingRepresentation = ({
  current_news: lead,
  caroussel_images: { pictures: strapiSlider },
  sign_up_button,
  sponsors: allSponsors,
}: LandingContent & { sponsors: Sponsor[] }) => {
  const mainSponsor = allSponsors.find((sponsor) => sponsor.type === 'main_sponsor');
  const sponsors = allSponsors.filter((sponsor) => sponsor.type !== 'main_sponsor' && sponsor.show_on_page);

  return (
    <div className='flex flex-col gap-5 pb-5'>
      <section className='-mt-5 w-full'>
        <Slider slides={{ data: strapiSlider.data }} />
      </section>
      <section>
        <UhtCard title={lead.label}>
          <StyledMarkdown markdown={lead.text} />
        </UhtCard>
      </section>
      {sign_up_button.show_on_page && (
        <NavLink
          to={`../${sign_up_button.path}`}
          className='w-full typo-lg text-center font-semibold outline rounded-sm hover:bg-white hover:text-primary h-[200px] flex items-center justify-center'
        >
          {sign_up_button.label}
        </NavLink>
      )}
      <section>
        <div className='flex flex-col gap-5 lg:flex-row'>
          {mainSponsor && <SponsorCard sponsor={mainSponsor} titleOverride='Hauptsponsor:in' />}
          <UhtCard title={'Sponsor:innen'}>
            <div className='p-5 w-full'>
              <Slider
                slides={{ data: sponsors.map((sponsor) => ({ ...sponsor.picture.data, link: sponsor.url })) }}
                twFit='object-contain'
              />
            </div>
          </UhtCard>
        </div>
      </section>
    </div>
  );
};
