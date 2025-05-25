import { Lead } from '#rs911/components/building-blocks/Lead';
import { type BuildingBlockEvent, type AgendaContent, type groupEventsByYearAndMonth } from '#rs911/utils/strapi.utils';

export const Agenda = ({
  content: { events, title, lead: description },
}: {
  content: Omit<AgendaContent, 'events'> & { events: ReturnType<typeof groupEventsByYearAndMonth> };
}) => (
  <>
    <h1 className='typo-headline-lg my-8'>{title}</h1>
    <div className='w-fll border-b-2 border-primary'>
      <Lead lead={{ title: '', description }} className='pb-12' smallBreaks />
    </div>
    {Object.keys(events).map((year, yIndex) => (
      <section key={`${year}-${yIndex}`} className='sm:px-12'>
        <h2 className='text-primary typo-headline-lg pt-8'>{year}</h2>
        {Object.entries(events[Number(year)]!).map(([monthNr, events], mIndex) => (
          <div key={`${year}-${monthNr}`} className='py-8 relative'>
            {mIndex % 2 ? (
              <div className=' w-screen h-full bg-secondary/[0.08] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -z-1' />
            ) : null}
            <h3 className='typo-headline-md-lg mb-6'>
              {new Date(Number(year), Number(monthNr)).toLocaleString('de-CH', { month: 'long' })}
            </h3>
            <div className='flex flex-col gap-8'>
              {events.map((event, eIndex) => (
                <Event key={`${year}-${monthNr}-${eIndex}`} event={event} />
              ))}
            </div>
          </div>
        ))}
      </section>
    ))}
  </>
);

const Event = ({ event: { start, end, title, lead, link, important } }: { event: BuildingBlockEvent }) => {
  return (
    <a href={link} target='_blank' rel='noreferrer' className='group block'>
      <div className='typo-display-md'>
        <p className='text-primary'>{getEventDate(start, end)}</p>
        <p className='font-bold'>{title}</p>
        <p>{lead}</p>
        {link && <p className='relative inline-block text-primary mouse:underline-on-hover touch:!underline'>Mehr erfahren</p>}
        {important && <p className='text-primary mt-4 font-bold'>{important}</p>}
      </div>
    </a>
  );
};

const getEventDate = (start: string, end?: string) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : undefined;
  const sameMonth = startDate.getMonth() === (endDate ? endDate.getMonth() : startDate.getMonth());
  return endDate
    ? `${startDate.toLocaleDateString('de-CH', sameMonth ? { day: 'numeric' } : { day: 'numeric', month: 'numeric' })}${sameMonth ? '.' : ''} - ${endDate.toLocaleDateString('de-CH')}`
    : new Date(start).toLocaleDateString('de-CH');
};
