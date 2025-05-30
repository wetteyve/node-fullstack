import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type MakrdownContent } from '#uht-herisau/utils/strapi.utils';

const MarkdownRepresentation = ({ markdown: { label, text } }: MakrdownContent) => (
  <UhtCard title={label} className='mb-5'>
    <StyledMarkdown align='text-left' markdown={text} />
  </UhtCard>
);

export default MarkdownRepresentation;
