export type Category = {
  name: string;
  short_key: string;
  price: number;
  licenced_players_allowed: boolean;
  max_age?: number;
  max_teams?: number;
  description?: string;
};

export type Sponsor = {
  id: number;
  name: string;
  type: 'main_sponsor' | 'regular_sponsor';
  url?: string;
  show_on_page: boolean;
  picture: any;
};

type MakrdownBlock = { id: number; label: string; text?: string };
type RegistrationBlock = { id: number; label?: string; text: string };

export type CategoriesContent = {
  __component: 'representation.categories';
  lead: MakrdownBlock;
};
export type LandingContent = {
  __component: 'representation.landing';
  caroussel_images: { id: number; name: string; pictures: any };
  current_news: MakrdownBlock;
  sign_up_button: { id: number; label: string; path: string; show_on_page: boolean };
};
export type MakrdownContent = {
  __component: 'representation.markdown';
  markdown: MakrdownBlock;
};
export type OrganisationContent = {
  __component: 'representation.organisation';
  ok_ressorts: { ressort_name: string; members: string; icon: any }[];
};
export type PicturesContent = {
  __component: 'representation.pictures';
};
export type RankingsContent = {
  __component: 'representation.rankings';
  pdf: { file: any; show_on_page: boolean };
};
export type RegistrationContent = {
  __component: 'representation.registration';
  allow_registration: boolean;
  checks: RegistrationBlock[];
  faesslicup: RegistrationBlock;
  id: number;
  price: Price;
};
export type SponsorsContent = {
  __component: 'representation.sponsors';
  lead: MakrdownBlock;
};
export type DownloadContent = {
  __component: 'representation.download';
};

export type NaviagtionExtensions = {
  uht_contact: string;
  jwbr_logo?: any;
  jwbr_url?: string;
  insta_url?: string;
  facebook_url?: string;
};

export type ComponentLead = {
  label?: string;
  text: string;
};

export type Price = {
  id: number;
  label: string;
  description: string;
  show_on_page: boolean;
  nr_of_prices_per_team: number;
  cost: number;
  paidCat: { data: { id: number; attributes: Category }[] };
};

export type Faesslicup = {
  faesslicup_checkbox_label: string;
  faesslicup_checkbox_description: string;
};
