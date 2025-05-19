import { Link } from 'react-router';

const Footer = ({footerEntries}: {footerEntries: any}) => (
    <div className='z-10 min-h-24 bg-primary text-white'>
      <div className='app-container h-full'>
        <div className='flex h-full flex-col-reverse items-center justify-between gap-4 md:flex-row'>
          <span className='typo-headline-xs my-auto'>{`© ${new Date().getFullYear()} - 911 RS - Alte 11er Garage Arbon`}</span>
          <div className='my-auto flex flex-wrap justify-between gap-6 md:gap-14 xl:gap-28'>
            {footerEntries.map((e: any, i: any) => (
              <Link key={i} to={e.slug}>
                <span className='typo-headline-xs hover:cursor-pointer'>{` ${e.navigation_title}`}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

export default Footer;
