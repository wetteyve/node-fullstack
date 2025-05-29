import { useNavigate } from 'react-router';
import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import Slider from '#uht-herisau/components/building-blocks/Slider';
import UhtCard, { SponsorCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { Button } from '#uht-herisau/components/ui/button';
import { type Sponsor, type LandingContent } from '#uht-herisau/utils/strapi.utils';

export const LandingRepresentation = ({
  current_news: lead,
  caroussel_images: { pictures: strapiSlider },
  sign_up_button,
  sponsors: allSponsors,
}: LandingContent & { sponsors: Sponsor[] }) => {
  const mainIndex = allSponsors.findIndex((sponsor) => sponsor.type === 'main_sponsor');
  const mainSponsor = allSponsors[mainIndex] || undefined;
  const sponsors = allSponsors.splice(0, mainIndex).concat(allSponsors.slice(mainIndex + 1));
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-5 pb-5'>
      <section className='-mt-5 w-full'>
        <Slider slider={strapiSlider} autoPlay={{ delay: 7000, playOnInit: true }} />
      </section>
      <section>
        <UhtCard title={lead.label}>
          <StyledMarkdown markdown={lead.text} />
        </UhtCard>
      </section>
      {sign_up_button.show_on_page && (
        <section>
          <Button
            onClick={() => navigate(`/${sign_up_button.path}`)}
            variant='ghost'
            className='w-full r-text-l text-center font-semibold rounded-sm outline hover:outline-white h-[200px]'
          >
            {sign_up_button.label}
          </Button>
        </section>
      )}
      <section>
        <div className='flex flex-col gap-5 lg:flex-row'>
          {mainSponsor && <SponsorCard sponsor={mainSponsor} titleOverride='Hauptsponsor:in' />}
          <UhtCard title={'Sponsor:innen'}>
            <div className='p-5 w-full'>
              <Slider
                slider={{
                  data: sponsors.map((sponsor) => ({ ...sponsor.picture.data, link: sponsor.url })),
                }}
                autoPlay={{ delay: 3500, playOnInit: true }}
              />
            </div>
          </UhtCard>
        </div>
      </section>
    </div>
  );
};
