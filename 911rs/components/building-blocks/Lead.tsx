import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { type BuildingBlockLead } from '#rs911/utils/strapi.utils';

type Props = {
  lead: BuildingBlockLead;
};

const Lead = ({ lead }: Props) => {
  return (
    <div className='w-full max-w-[912px]'>
      <h2 className='typo-headline-lg'>{lead.title}</h2>
      <Markdown className='pt-4 max-w-[950px] typo-display-md' remarkPlugins={[remarkGfm, remarkBreaks]} children={lead.description} />
    </div>
  );
};

export default Lead;
