import { PiCheck, PiIdentificationCard, PiMoney } from 'react-icons/pi';
import StyledMarkdown from '#uht-herisau/components/building-blocks/Markdown';
import { UhtCard } from '#uht-herisau/components/building-blocks/UhtCard';
import { type Category } from '#uht-herisau/utils/strapi.utils';

export const CategoryCard = ({ categories }: { categories: Category[] }) => {
  return categories.map((category, index) => (
    <div className='border last:mb-0 mb-5 rounded-sm' key={index}>
      <UhtCard title={`${category.short_key} - ${category.name}`}>
        <ul className='py-5 text-center r-text-s font-semibold'>
          <li className='grid grid-flow-row grid-cols-4'>
            <PiCheck className='m-auto' />
            <span>Jahrgänge</span>
            <span>-</span>
            <span>{category.max_age ? `bis ${new Date().getFullYear() - category.max_age}` : 'frei'}</span>
          </li>
          <li className='grid grid-flow-row grid-cols-4'>
            <PiMoney className='m-auto' />
            <span>Preis</span>
            <span>-</span>
            <span>{`${category.price} CHF`}</span>
          </li>
          <li className='grid grid-flow-row grid-cols-4'>
            <PiIdentificationCard className='m-auto' />
            <span className='text-ellipsis overflow-hidden'>Lizenzspieler:innen</span>
            <span>-</span>
            <span>{category.licenced_players_allowed ? 'erlaubt' : 'nicht erlaubt'}</span>
          </li>
        </ul>
        {category.description ? <StyledMarkdown align='text-left' markdown={category.description} /> : null}
      </UhtCard>
    </div>
  ));
};
