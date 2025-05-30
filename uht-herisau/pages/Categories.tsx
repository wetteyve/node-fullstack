import { groupBy } from '#app/utils/array.utils';
import { AccordionWrapper } from '#uht-herisau/components/building-blocks/Accordion';
import { CategoryCard } from '#uht-herisau/components/building-blocks/CategoryCard';
import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type CategoriesContent, type Category } from '#uht-herisau/utils/strapi.utils';

export const CategoryRepresentation = ({ lead, categories }: CategoriesContent & { categories: Category[] }) => {
  const groupedCategories = groupBy(categories, 'name');
  const items = Object.entries(groupedCategories).map(([name, c]) => ({ title: name, children: <CategoryCard categories={c} /> }));

  return (
    <div className='flex flex-col gap-5 pb-5'>
      <section>
        <UhtCard title={lead.label}>
          <StyledMarkdown align='text-left' markdown={lead.text} />
        </UhtCard>
      </section>
      <section>
        <AccordionWrapper items={items} />
      </section>
    </div>
  );
};
