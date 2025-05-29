import { type ReactNode } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#uht-herisau/components/ui/accordion';

type Props = {
  items: { title: string; children: ReactNode }[];
};

export const AccordionWrapper = ({ items }: Props) => {
  return (
    <Accordion className='bg-white text-black rounded-sm r-text-xs' type='single' collapsible>
      {items.map((item, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className='px-5'>{item.title}</AccordionTrigger>
          <AccordionContent className='px-5'>{item.children}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
