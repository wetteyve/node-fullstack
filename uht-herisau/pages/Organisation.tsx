import { Image } from '#uht-herisau/components/building-blocks/Image';
import { UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type OrganisationContent } from '#uht-herisau/utils/strapi.utils';

const OrganisationRepresentation = ({ ok_ressorts }: OrganisationContent) => (
  <div className='grid grid-flow-row lg:grid-cols-2 grid-cols-1 gap-5 pb-5'>
    {ok_ressorts.map((ressort, index) => (
      <UhtCard key={index} title={ressort.ressort_name}>
        <Image file={ressort.icon} twFit='object-contain' />
        <p className='typo-lg pb-5 px-5 whitespace-normal'>{ressort.members}</p>
      </UhtCard>
    ))}
  </div>
);

export default OrganisationRepresentation;
