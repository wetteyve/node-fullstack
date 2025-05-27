import { NavLink, useLocation } from 'react-router';

type MobileNavbarItemProps = {
  href: string;
  text: string;
  onClick?: () => void;
};

export const MobileNavbarItem = (props: MobileNavbarItemProps) => {
  const pathname = useLocation().pathname.substring(1);

  return (
    <NavLink
      className={`typo-xl w-full whitespace-nowrap px-4 py-4 text-center font-light text-black ${pathname === props.href ? 'text-primary' : ''}`}
      to={`./${props.href}`}
      onClick={props.onClick}
    >
      {props.text.toUpperCase()}
    </NavLink>
  );
};
