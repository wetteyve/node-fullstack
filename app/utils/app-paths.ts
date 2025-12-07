// Define (backend) resource paths here
export const resourceBase = '/node/v1';
export const resource = {
  images: `${resourceBase}/images`,
  fonts: `${resourceBase}/fonts`,
  api: `${resourceBase}/api`,
  // API endpoints below (prefix with resource.api in runtime)
  contactForm: `mailer/contact-form`,
  uhtRegistration: 'uht-registration',
  fcCount: `fc-count`,
  downloadRegistrations: `download-registrations`,
} as const;

// Define 911rs app paths here
export const rs911 = {
  base: '/911rs',
  page: ':page',
  sitemap: 'sitemap.xml',
  legacyRedirect: '*',
} as const;

// Define UHT Herisau app paths here
export const uhtHerisau = {
  base: '/uht-herisau',
  page: ':level1/:level2?',
  sitemap: 'sitemap.xml',
  legacyRedirect: '*',
} as const;

// Define On-Call Sheduler Yves Wetter app paths here
export const onCallSheduler = {
  base: '/sheduler.yveswetter',
  home: 'home',
} as const;

// Add more app paths as needed down the line
