import { NavLink } from 'react-router';

const Footer = ({ footerEntries }: { footerEntries: any }) => (
  <div className='z-10 min-h-24 bg-primary text-white'>
    <div className='app-container h-full'>
      <div className='flex h-full flex-col-reverse justify-between gap-4 md:flex-row'>
        <span className='typo-headline-xs my-auto'>{`© ${new Date().getFullYear()} - 911 RS - Alte 11er Garage Arbon`}</span>
        <div className='my-auto flex flex-wrap gap-14 xl:gap-28'>
          {footerEntries.map((e: any, i: any) => (
            <NavLink key={i} to={e.slug} className={({ isActive }) => `${isActive ? 'pointer-events-none' : ''}`}>
              <span className='typo-headline-xs hover:cursor-pointer'>{` ${e.navigation_title}`}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
