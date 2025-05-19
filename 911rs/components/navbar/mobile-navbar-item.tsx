import { NavLink } from 'react-router';

type MobileNavbarItemProps = {
  href: string;
  text: string;
  onClick?: () => void;
};

const MobileNavbarItem = (props: MobileNavbarItemProps) => {
  return (
    <NavLink
      className={({ isActive }) =>`mt-6 typo-headline-md w-full whitespace-nowrap px-4 py-4${isActive ? " text-primary" : " text-black"}`}
      to={props.href}
      onClick={props.onClick}
    >
      {props.text.toUpperCase()}
    </NavLink>
  );
};

export default MobileNavbarItem;
