import React, { createRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';
import { isEqual } from 'lodash';
import { Link, useHistory  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  const accountPaths: (string | null)[] = ['login', 'my-account'];
  const subscriptionPath: (string | null)[] = ['subscription'];

  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);

  const logOut = (): void => {
    firebase.auth().signOut();
    history.push('/');
    window.location.reload();
  }

  const toggleMobileMenu = (e: React.MouseEvent|null, force: boolean|undefined = undefined): void => {
    menuRef.current?.classList.toggle('show', force);
    mobileOverlay.current?.classList.toggle('show', force);
  }

  const checkCurrentPath = (pathList: (string | null)[]): string | undefined => {
    return pathList.includes(currentPath) ? 'current' : undefined;
  }

  useEffect((): (() => void) => {
    const escapeHandler = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        if(menuRef.current?.classList.contains('show')) toggleMobileMenu(null, false);
      }
    }

    window.addEventListener('keydown', escapeHandler);

    return (): void => {
      window.removeEventListener('keydown', escapeHandler);
    }
  }, [toggleMobileMenu, menuRef]);

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
        <div className="header__mobile-overlay" ref={mobileOverlay} onClick={(e: React.MouseEvent) => toggleMobileMenu(e, false)} />
        <nav className="header__nav" ref={menuRef}>
          <button className="header__close-button" onClick={toggleMobileMenu}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <ul className="header__nav-list">
            <li>
              <Link to="/subscription" className={checkCurrentPath(subscriptionPath)}>
                { auth.uid ? 'Subscription' : 'Sign Up and Subscribe' }
              </Link>
            </li>
            <li>
              <Link to="/word-categories" className={checkCurrentPath(wordCategoryPaths)}>Word Categories</Link>
            </li>
            {/* <li>
              <Link to="/weekly-study-guides" className={checkCurrentPath(studyGuidePaths)}>Weekly Study Guides</Link>
            </li> */}
            <li>
              <Link to={auth.uid ? '/my-account' : '/login'} className={checkCurrentPath(accountPaths)}>{auth.uid ? 'My Account' : 'Log In'}</Link>
            </li>
            { auth.uid && <li><Link to='/' onClick={logOut}>Log Out</Link></li> }
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
