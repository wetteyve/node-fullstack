export type HomeContent = {
  __component: 'pages.home-page';
  header_picture: any;
  lead: BuildingBlockLead;
  lead_picture: any;
  beitrag_lead: BuildingBlockLead;
  beitrag_collection: BuildingBlockBeitrag[];
  impressionen: any;
};
export type LeistungenContent = {
  __component: 'pages.leistungen-page';
  header_picture: any;
  lead: BuildingBlockLead;
  baugruppen_lead: BuildingBlockLead;
  baugruppen: BuildingBlockInformation[];
};

export type AboutContent = {
  __component: 'pages.about-page';
  about: BuildingBlockInformation;
  car: BuildingBlockInformation;
};

export type LinksContent = {
  __component: 'pages.links-page';
  links: BuildingBlockInformation;
};

export type AgendaContent = {
  __component: 'pages.agenda-page';
  events: BuildingBlockEvent[] | ReturnType<typeof groupEventsByYearAndMonth>;
  title: string;
  lead: string;
};

export type BuildingBlockBeitrag = {
  external_link: string;
  lead_picture: any;
  title: string;
};

export type BuildingBlockLead = { description?: string | undefined } & {
  title: string;
};

export type BuildingBlockBildstrecke = {
  title: string;
  bilder: any;
};

export type BuildingBlockInformation = {
  title: string;
  description: string;
  picture: any;
};

export type BuildingBlockEvent = {
  start: string;
  end?: string;
  title: string;
  lead: string;
  link?: string;
  important?: string;
};

/**
 * Groups an array of events by year and month, sorting events within each month by their start date.
 *
 * @param events - The array of events to group, each event must have a `start` property that can be parsed as a date.
 * @returns A nested record object where the first key is the year, the second key is the month (0-based), and the value is an array of events for that month, sorted by start date.
 */
export const groupEventsByYearAndMonth = (events: BuildingBlockEvent[]): Record<number, Record<number, BuildingBlockEvent[]>> => {
  return events.reduce(
    (acc, event) => {
      const startDate = new Date(event.start);
      const yearNr = startDate.getFullYear();
      const currentYear = new Date().getFullYear();
      if (yearNr < currentYear) {
        return acc; // Skip events in the past years
      }

      const monthNr = startDate.getMonth();
      acc[yearNr] = acc[yearNr] || {};
      acc[yearNr][monthNr] = [...(acc[yearNr][monthNr] || []), event].sort((a, b) => {
        const aDate = new Date(a.start);
        const bDate = new Date(b.start);
        return aDate.getTime() - bDate.getTime();
      });
      return acc;
    },
    {} as Record<number, Record<number, BuildingBlockEvent[]>>
  );
};
