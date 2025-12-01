import { type ClassValue } from 'clsx';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '#uht-herisau/utils/shadcn.utils';

type Props = {
  markdown?: string;
  align?: 'text-left' | 'text-center' | 'text-right';
  className?: ClassValue;
};

const StyledMarkdown = ({ markdown, align = 'text-center', className }: Props) => (
  <div className={cn('w-full typo-xs whitespace-pre-wrap p-6 a-markdown', align, className)}>
    <Markdown remarkPlugins={[remarkGfm]}>{markdown}</Markdown>
  </div>
);

export default StyledMarkdown;
