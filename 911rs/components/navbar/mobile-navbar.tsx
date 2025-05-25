import { useEffect, useState } from 'react';
import { TfiClose } from 'react-icons/tfi';
import { VscMenu } from 'react-icons/vsc';
import { useLocation } from 'react-router';
import MobileNavbarItem from './mobile-navbar-item';

type NavbarProps = {
  navbarEntries: any;
};

const MobileNavbar = ({ navbarEntries }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.removeProperty('overflow');
  }, [isOpen]);

  return (
    <div>
      <div>
        <button
          className={`bg-transparent p-6 pr-0 text-black transition-all focus-visible:outline-none active:scale-95 `}
          onClick={() => setIsOpen((o) => !o)}
        >
          {isOpen ? <TfiClose size={32} /> : <VscMenu size={32} />}
        </button>
      </div>
      <nav
        style={{
          translate: isOpen ? 0 : '100vw',
          opacity: isOpen ? 1 : 0,
        }}
        className='fixed left-0 top-24 -z-10 flex h-[calc(100%-96px)] w-full flex-col justify-between gap-2 overflow-auto bg-white transition-all duration-300'
      >
        <div className='flex flex-col gap-16 justify-around pt-12'>
          {navbarEntries.map((e: any, i: any) => (
            <MobileNavbarItem onClick={() => setIsOpen(false)} key={i} href={e.slug} text={e.navigation_title} />
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MobileNavbar;
