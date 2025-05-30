import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { SponsorCard, UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type Sponsor, type SponsorsContent } from '#uht-herisau/utils/strapi.utils';

const SponsorsRepresentation = ({ lead: { label, text }, sponsors: allSponsors }: SponsorsContent & { sponsors: Sponsor[] }) => {
  const mainSponsor = allSponsors.find((sponsor) => sponsor.type === 'main_sponsor')!;
  const sponsors = allSponsors.filter((sponsor) => sponsor.type !== 'main_sponsor' && sponsor.show_on_page);

  return (
    <>
      <section className='mb-5'>
        <UhtCard title={label}>
          <StyledMarkdown align='text-left' markdown={text} />
        </UhtCard>
      </section>
      <section className='mb-5'>
        <SponsorCard className='mb-5' sponsor={mainSponsor} titleOverride={`Hauptsponsor:in - ${mainSponsor.name}`} />
        <div className='grid grid-flow-row lg:grid-cols-2 grid-cols-1 gap-5'>
          {sponsors.map((sponsor) => (
            <SponsorCard sponsor={sponsor} key={sponsor.id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default SponsorsRepresentation;
