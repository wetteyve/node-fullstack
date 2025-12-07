import { type ReactNode } from 'react';
import { IoLogoInstagram, IoLogoFacebook } from 'react-icons/io';
import { NavLink } from 'react-router';
import { Image } from '#uht-herisau/components/building-blocks/Image';
import { type Page } from '#uht-herisau/utils/page.utils';

const Footer = ({
  footerEntries,
  navigation_extensions,
}: {
  footerEntries: Page[];
  navigation_extensions: Page['navigation_extensions'];
}) => {
  const { uht_contact, facebook_url, insta_url, jwbr_logo, jwbr_url } = navigation_extensions || {};
  return (
    <div className='z-10 bg-white text-black font-semibold'>
      <div className='app-container typo-xs'>
        <div className='flex h-full items-center justify-between'>
          <div className='my-auto flex flex-col flex-wrap justify-between gap-4'>
            {footerEntries.map((e, i) => (
              <NavLink key={i} to={`./${e.path}`}>
                <span className='hover:cursor-pointer'>{` ${e.title}`}</span>
              </NavLink>
            ))}
            <a href={`mailto:${uht_contact}`}>Kontakt</a>
          </div>
          {jwbr_logo && jwbr_url && <SocialLink url={jwbr_url} Component={<Image file={jwbr_logo} />} />}
          <div className='flex flex-col'>
            {facebook_url || insta_url ? (
              <div className='flex w-full justify-end gap-4'>
                {insta_url && <SocialLink url={insta_url} Component={<IoLogoInstagram size={48} />} />}
                {facebook_url && <SocialLink url={facebook_url} Component={<IoLogoFacebook size={48} />} />}
              </div>
            ) : null}
            <span className='my-auto'>{`© ${new Date().getFullYear()} - UHT Herisau`}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;

const SocialLink = ({ url, Component }: { url: string; Component: ReactNode }) => (
  <a href={url} target='_blank' rel='noopener noreferrer' className='max-w-32'>
    {Component}
  </a>
);
