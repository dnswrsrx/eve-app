import React, { createRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faDoorOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
import firebase from '../../../config/firebaseConfig';
import './Header.scss';

const Header = (): JSX.Element => {
  const menuRef = createRef<HTMLElement>();
  const firstLinkRef = createRef<HTMLAnchorElement>();
  const mobileOverlay = createRef<HTMLDivElement>();

  const logOut = (): void => {
    firebase.auth().signOut();
  }

  const toggleMobileMenu = (): void => {
    menuRef.current?.classList.toggle('show');
    mobileOverlay.current?.classList.toggle('show');
    if(menuRef.current?.classList.contains('show')) firstLinkRef.current?.focus();
  }

  const hideMobileMenu = useCallback((): void => {
    menuRef.current?.classList.remove('show')
    mobileOverlay.current?.classList.remove('show');
  }, [menuRef, mobileOverlay]);

  useEffect((): (() => void) => {
    const escapeHandler = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        if(menuRef.current?.classList.contains('show')) hideMobileMenu();
      }
    }

    window.addEventListener('keydown', escapeHandler);

    return (): void => {
      window.removeEventListener('keydown', escapeHandler);
    }
  }, [hideMobileMenu, menuRef]);

  return (
    <header className="header">
      <div className="header__wrapper page-wrapper">
        <div className="header__heading">
          <Link to="/admin-dashboard">
            EVE - Admin Dashboard
          </Link>
        </div>
        <div className="admin-header__mobile-overlay" ref={mobileOverlay} onClick={hideMobileMenu} />
        <nav className="admin-header__nav" ref={menuRef}>
          <button className="admin-header__close-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <ul className="admin-header__nav-list">
            <li>
              <Link to="/admin-dashboard" ref={firstLinkRef}>All Options</Link>
            </li>
            <li>
              <Link to="/admin-dashboard/word-categories">Edit Word Categories</Link>
            </li>
            <li>
              <button className="admin-header__logout-button" onClick={logOut} title="Log Out">
                <FontAwesomeIcon icon={faDoorOpen} />
              </button>
            </li>
          </ul>
        </nav>
        <button className="header__burger-button" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
      </div>
    </header>
  )
}

export default Header;
