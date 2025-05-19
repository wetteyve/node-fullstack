import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import MobileNavbar from './mobile-navbar';

type NavbarProps = {
  navbarEntries: any;
  footerEntries: any;
};

const Navbar = ({navbarEntries, footerEntries}: NavbarProps) => {
  const pathname = useLocation().pathname.substring(1);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const navbarEntriesWithoutFirst = navbarEntries.slice(1);

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;

    if (currentScrollPos > prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className={`sticky z-20 bg-white shadow-md ${visible && 'top-0 motion-safe:animate-fadeIn md:motion-safe:animate-fadeInLight'}`}>
      <div className='container mx-auto flex h-24 justify-between px-5 py-2'>
        <div className='flex'>
          <NavLink to={`./${navbarEntries[0]?.slug}`} className='my-auto mr-5 flex flex-col items-center hover:cursor-pointer'>
            <p className='whitespace-nowrap text-primary typo-headline-xl'>911 RS</p>
            <p className='whitespace-nowrap typo-display-sm font-bold'>ALTE 11ER GARAGE</p>
            <p className='typo-display-sm'>ARBON</p>
          </NavLink>
        </div>
        <div className='hidden md:flex'>
          {navbarEntriesWithoutFirst.map((e:any, i:any) => (
            <NavLink 
              key={i}
              to={e.slug}
              className={({ isActive }) =>
                  `mb-6 ml-12 mt-auto hover:cursor-pointer${isActive ? " text-primary" : ""}`
                }
            >
              <p
                className={`typo-headline-md transition-all duration-150 ease-in hover:scale-105 ${pathname === e.slug && 'text-primary'}`}
              >
                {e.navigation_title.toUpperCase()}
              </p>
            </NavLink>
          ))}
        </div>
        <div className='block md:hidden'>
          <MobileNavbar navbarEntries={navbarEntries} footerEntries={footerEntries} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
