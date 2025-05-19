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
  bildstrecken_lead: BuildingBlockLead;
  bildstrecken_collection: BuildingBlockBildstrecke[];
};

export type AboutContent = {
  __component: 'pages.about-page';
  header_picture: any;
  lead: BuildingBlockLead;
  lead_picture: any;
  impressionen: any;
};

export type BuildingBlockBeitrag = {
  external_link?: string | undefined;
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
