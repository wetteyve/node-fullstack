import clsx, { type ClassValue } from 'clsx';
import Markdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { type BuildingBlockLead } from '#rs911/utils/strapi.utils';

type Props = {
  lead: BuildingBlockLead;
  className?: ClassValue;
  titleStyles?: ClassValue;
};

const Lead = ({ lead, className = '', titleStyles }: Props) => {
  return (
    <div className={clsx('w-full max-w-[912px]', className)}>
      <h2 className={clsx('typo-headline-lg', titleStyles)}>{lead.title}</h2>
      <Markdown
        className='pt-4 max-w-[950px] typo-display-md whitespace-pre-wrap'
        remarkPlugins={[remarkGfm, remarkBreaks]}
        children={lead.description}
      />
    </div>
  );
};

export default Lead;
