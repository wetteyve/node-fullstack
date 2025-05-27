import { NavLink } from 'react-router';
import { type Page } from '#uht-herisau/utils/page.utils';

const Footer = ({ footerEntries }: { footerEntries: Page[] }) => {
  return (
    <div className='z-10 bg-white text-black font-semibold'>
      <div className='app-container h-24'>
        <div className='flex h-full flex-col-reverse items-center justify-between gap-4 md:flex-row'>
          <span className='typo-xs my-auto'>{`© ${new Date().getFullYear()} - UHT Herisau`}</span>
          <div className='my-auto flex flex-wrap justify-between gap-6 md:gap-14 xl:gap-28'>
            {footerEntries.map((e, i) => (
              <NavLink key={i} to={`./${e.path}`}>
                <span className='typo-xs hover:cursor-pointer'>{` ${e.title}`}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
