import { NavLink } from 'react-router';
import './NavBar.css';

import { useUser } from '../../hooks/useUser';

function NavBar() {
  const { user } = useUser();

  return (
    <nav className='navbar'>
      <NavLink key={'home'} to={'/'} className={`navbar-link`}>
        Home
      </NavLink>
      {user ? (
        <NavLink
          key={'account'}
          to={'/auth/sign-out'}
          replace
          className={`navbar-link`}
        >
          Sign Out
        </NavLink>
      ) : (
        <NavLink key={'sign-in'} to={'/auth/sign-in'} className={`navbar-link`}>
          Sign In
        </NavLink>
      )}
    </nav>
  );
}

export default NavBar;
