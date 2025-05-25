import clsx, { type ClassValue } from 'clsx';
import Markdown, { defaultUrlTransform } from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { type BuildingBlockLead } from '#rs911/utils/strapi.utils';

type Props = {
  lead: BuildingBlockLead;
  className?: ClassValue;
  titleStyles?: ClassValue;
  linkColor?: boolean;
  smallBreaks?: boolean;
};

export const Lead = ({ lead, className = '', titleStyles, linkColor = true, smallBreaks = false }: Props) => {
  return (
    <div className={clsx('w-full max-w-[912px]', className)}>
      {lead.title && <h2 className={clsx('typo-headline-lg', titleStyles)}>{lead.title}</h2>}
      <Markdown
        className={clsx(
          'pt-4 max-w-[950px] typo-display-md [&>*>a]:touch:!underline mouse:style-link',
          linkColor ? '[&>*>a]:text-primary' : '',
          smallBreaks ? '' : 'whitespace-pre-wrap'
        )}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        children={lead.description}
        urlTransform={(url) => (url.startsWith('tel:') ? url : defaultUrlTransform(url))}
      />
    </div>
  );
};
