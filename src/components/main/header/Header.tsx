import React, { createRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';
import { isEqual } from 'lodash';
import { Link, useHistory  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faDoorOpen, faTimes } from '@fortawesome/free-solid-svg-icons';
import firebase from '../../../config/firebaseConfig';
import './Header.scss';
import Loading from '../../general/loading/Loading';

const Header = (): JSX.Element => {
  const history = useHistory()
  const menuRef = createRef<HTMLElement>();
  const mobileOverlay = createRef<HTMLDivElement>();
  const currentPath = window.location.pathname.split('/')[1] || null;
  const wordCategoryPaths: (string | null)[] = ['word-categories', 'subcategories', 'groups', 'group', 'exercise'];
  // const studyGuidePaths: (string | null)[] = ['weekly-study-guides', 'weekly-study-guide'];
  const accountPaths: (string | null)[] = ['login', 'register', 'my-account'];
  const subscriptionPath: (string | null)[] = ['subscription'];

  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);

  const logOut = (): void => {
    firebase.auth().signOut();
    history.push('/')
  }

  const toggleMobileMenu = (): void => {
    menuRef.current?.classList.toggle('show');
    mobileOverlay.current?.classList.toggle('show');
  }

  const hideMobileMenu = useCallback((): void => {
    menuRef.current?.classList.remove('show')
    mobileOverlay.current?.classList.remove('show');
  }, [menuRef, mobileOverlay]);

  const checkCurrentPath = (pathList: (string | null)[]): string | undefined => {
    return pathList.includes(currentPath) ? 'current' : undefined;
  }

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

  if(!auth.isLoaded) {
    return (
      <section className="admin-dashboard">
        <Loading />
      </section>
    );
  }

  return (
    <header className="header">
      <div className="header__wrapper page-wrapper">
        <div className="header__heading">
          <Link to="/">
            English Vocabulary Exercises
          </Link>
        </div>
        <div className="header__mobile-overlay" ref={mobileOverlay} onClick={hideMobileMenu} />
        <nav className="header__nav" ref={menuRef}>
          <button className="header__close-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <ul className="header__nav-list">
            <li>
              <Link to="/subscription" className={checkCurrentPath(subscriptionPath)}>Subscription</Link>
            </li>
            <li>
              <Link to="/word-categories" className={checkCurrentPath(wordCategoryPaths)}>Word Categories</Link>
            </li>
            {/* <li>
              <Link to="/weekly-study-guides" className={checkCurrentPath(studyGuidePaths)}>Weekly Study Guides</Link>
            </li> */}
            <li>
              <Link to={auth.uid ? '/my-account' : '/login'} className={checkCurrentPath(accountPaths)}>{auth.uid ? 'My Account' : 'Login / Register'}</Link>
            </li>
            {
              auth.uid
                ? <li>
                    <button className="admin-header__logout-button" onClick={logOut} title="Log Out">
                      <FontAwesomeIcon icon={faDoorOpen} />
                    </button>
                  </li>
                : <></>
            }
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
