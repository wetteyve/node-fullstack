import { IoLogoInstagram, IoLogoFacebook } from 'react-icons/io';
import { type IconType } from 'react-icons/lib';
import { NavLink } from 'react-router';
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
        <div className='flex h-full items-center justify-between gap-4'>
          <div className='my-auto flex flex-col flex-wrap justify-between xl:gap-28'>
            {footerEntries.map((e, i) => (
              <NavLink key={i} to={`./${e.path}`}>
                <span className='hover:cursor-pointer'>{` ${e.title}`}</span>
              </NavLink>
            ))}
            <a href={`mailto:${uht_contact}`}>Kontakt</a>
          </div>
          {jwbr_logo && jwbr_url && <div>im the logo</div>}
          <div className='flex flex-col'>
            {facebook_url || insta_url ? (
              <div className='flex w-full justify-end gap-4'>
                {insta_url && <SocialLink url={insta_url} Icon={IoLogoInstagram} />}
                {facebook_url && <SocialLink url={facebook_url} Icon={IoLogoFacebook} />}
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

const SocialLink = ({ url, Icon }: { url: string; Icon: IconType }) => (
  <a href={url} target='_blank' rel='noopener noreferrer'>
    <Icon size={48} />
  </a>
);
