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
