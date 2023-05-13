import { useNavigate, Link, NavLink } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import logo from '../../images/logo.svg';

import classes from './Header.module.css';
import { useState, useContext } from 'react';

import AuthContext from '../../shared/context/auth-context';

const Header = () => {
  const [showLinks, setShowLinks] = useState(false);

  const toggleLinks = () => {
    setShowLinks((state) => !state);
  };

  const { logout, isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  return (
    <header>
      <nav className={classes.navbar}>
        <div className={classes['nav-center']}>
          <div className={classes['nav-header']}>
            <div className="center">
              <button onClick={toggleLinks} className={classes['nav-toggle']}>
                <FontAwesomeIcon icon={faBars} />
              </button>
              <Link to="/welcome">
                <img src={logo} className={classes.logo} alt="" />
              </Link>
            </div>

            {!isLoggedIn ? (
              <Link to="/auth">
                <button className={classes['btn-login-mobile']}>Login</button>
              </Link>
            ) : (
              <button
                onClick={logoutHandler}
                className={classes['btn-login-mobile']}
              >
                Logout
              </button>
            )}
          </div>

          <ul
            className={`${classes['nav-links']} ${
              showLinks ? classes['show-links'] : ''
            }`}
          >
            <li>
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? `${classes['nav-link']} + ${classes.active}`
                    : classes['nav-link']
                }
                to="/welcome"
              >
                home
              </NavLink>
            </li>

            <li>
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? `${classes['nav-link']} + ${classes.active}`
                    : classes['nav-link']
                }
                to="/tours"
              >
                Tours
              </NavLink>
            </li>

            <li>
              <NavLink
                className={(navData) =>
                  navData.isActive
                    ? `${classes['nav-link']} + ${classes.active}`
                    : classes['nav-link']
                }
                to="/add-tour"
              >
                Add Tour
              </NavLink>
            </li>
          </ul>

          {!isLoggedIn ? (
            <Link to="/auth">
              <button className={classes['btn-login-desktop']}>Login</button>
            </Link>
          ) : (
            <button
              onClick={logoutHandler}
              className={classes['btn-login-desktop']}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Header;
