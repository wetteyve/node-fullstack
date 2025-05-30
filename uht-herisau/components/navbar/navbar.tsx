import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import { groupBy } from '#app/utils/array.utils';
import { MobileNavbar } from '#uht-herisau/components/navbar/mobile-navbar';
import { type Page } from '#uht-herisau/utils/page.utils';

export type NavbarProps = {
  navbarEntries: Page[];
};

const resetDropdownSettings = (navbarEntriesGrouped: Record<string, Page[]>) => {
  return Object.keys(navbarEntriesGrouped).reduce((acc: { [key: string]: boolean }, key) => {
    if (navbarEntriesGrouped[key]!.length > 1) {
      acc[key] = false;
    }
    return acc;
  }, {});
};

export const Navbar = ({ navbarEntries: entriesRaw }: NavbarProps) => {
  const navbarEntries = entriesRaw.slice(1); // Remove Home from navbar
  const navbarEntriesGrouped = groupBy(navbarEntries, 'path', '/');
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState<{ [key: string]: boolean }>(resetDropdownSettings(navbarEntriesGrouped));
  const { pathname } = useLocation();

  const handleScroll = () => {
    const currentScrollPos = window.scrollY;
    setVisible(currentScrollPos <= prevScrollPos);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  useEffect(() => {
    setShowDropdown(resetDropdownSettings(navbarEntriesGrouped));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const handleMouseLeave = () => {
    setShowDropdown(resetDropdownSettings(navbarEntriesGrouped));
  };

  return (
    <div
      className={`sticky z-20 bg-white text-primary shadow-md ${visible && 'top-0 motion-safe:animate-fadeIn md:motion-safe:animate-fadeInLight'}`}
    >
      <div className='container mx-auto flex h-24 justify-between px-5 py-2'>
        <div className='flex'>
          <NavLink to={`./${entriesRaw[0]?.path}`} className='my-auto mr-5 flex flex-col items-center hover:cursor-pointer'>
            <p className='typo-md text-black whitespace-nowrap font-semibold leading-none'>Unihockey Turnier</p>
            <p className='typo-sm whitespace-nowrap leading-none'>Herisau</p>
          </NavLink>
        </div>
        <div className='touch:hidden md:flex'>
          {Object.keys(navbarEntriesGrouped).map((key) => {
            const isDropdown = navbarEntriesGrouped[key]!.length > 1;
            const showDropdownForKey = showDropdown[key];
            const title = isDropdown ? key.charAt(0).toUpperCase() + key.slice(1) : navbarEntriesGrouped[key]![0]?.title;

            return isDropdown ? (
              <div key={key} className='relative mb-6 ml-12 mt-auto'>
                <button
                  className='hover:cursor-pointer'
                  onMouseEnter={() => setShowDropdown({ ...showDropdown, [key]: true })}
                  onMouseLeave={handleMouseLeave}
                  onFocus={() => setShowDropdown({ ...showDropdown, [key]: true })}
                >
                  <p className={`typo-xs font-semibold transition-all duration-150 ease-in hover:scale-105`}>{title}</p>
                  {showDropdownForKey && (
                    <div className='absolute left-0 top-full rounded-sm bg-white p-4 text-black shadow-md'>
                      {navbarEntriesGrouped[key]?.map((item) => (
                        <NavLink key={item.path} className='mb-6 ml-12 mt-auto hover:cursor-pointer' to={`./${item.path}`}>
                          {({ isActive }) => (
                            <p
                              className={clsx(
                                'typo-xs font-semibold transition-all duration-150 ease-in hover:scale-105',
                                isActive && 'underline'
                              )}
                            >
                              {item.title}
                            </p>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <NavLink key={key} className='mb-6 ml-12 mt-auto' to={`./${navbarEntriesGrouped[key]![0]?.path}`}>
                {({ isActive }) => (
                  <p className={clsx('typo-xs font-semibold transition-all duration-150 ease-in hover:scale-105', isActive && 'underline')}>
                    {title}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
        <div className='block mouse:hidden'>
          <MobileNavbar navbarEntries={navbarEntries} />
        </div>
      </div>
    </div>
  );
};
