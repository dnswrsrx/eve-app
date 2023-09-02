import React, { createRef, useEffect, useCallback, useContext } from 'react';
import { Link, useHistory  } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faGlobe } from '@fortawesome/free-solid-svg-icons';
import { HomeLanguage } from '../../models/models';
import firebase from '../../../config/firebaseConfig';
import { AuthContext } from '../Main';
import './Header.scss';


interface HeaderProps {
  homeLanguages: HomeLanguage[],
  setActiveLanguage: React.Dispatch<React.SetStateAction<HomeLanguage|null>>
}

const Header = ({ homeLanguages, setActiveLanguage }: HeaderProps): JSX.Element => {

  const history = useHistory();
  const menuRef = createRef<HTMLElement>();
  const mobileOverlay = createRef<HTMLDivElement>();
  const languageMenu = createRef<HTMLUListElement>();

  const currentPath = window.location.pathname.split('/')[1] || null;
  const wordCategoryPaths: (string | null)[] = ['word-categories', 'subcategories', 'groups', 'group', 'exercise'];
  const accountPaths: (string | null)[] = ['login', 'my-account'];
  const subscriptionPath: (string | null)[] = ['subscription'];

  const auth = useContext(AuthContext);

  const logOut = (): void => {
    firebase.auth().signOut();
    history.push('/');
    window.location.reload();
  }

  const toggleMobileMenu = useCallback((e: React.MouseEvent|null, force: boolean|undefined = undefined) => {
    menuRef.current?.classList.toggle('show', force);
    mobileOverlay.current?.classList.toggle('show', force);
  }, [menuRef, mobileOverlay])

  const toggleLanguageMenu = useCallback((e: React.MouseEvent|null, force: boolean = true) => {
    languageMenu.current?.classList.toggle('show', force);
  }, [languageMenu])

  const checkCurrentPath = (pathList: (string | null)[]): string | undefined => {
    return pathList.includes(currentPath) ? 'current' : undefined;
  }

  useEffect((): (() => void) => {
    const escapeHandler = (e: KeyboardEvent) => {
      if(e.key === 'Escape') {
        if(menuRef.current?.classList.contains('show')) toggleMobileMenu(null, false);
        if(languageMenu.current?.classList.contains('show')) toggleLanguageMenu(null, false);
      }
    }

    window.addEventListener('keydown', escapeHandler);
    document.addEventListener('click', (e: any) => toggleLanguageMenu(e, false));


    return (): void => {
      window.removeEventListener('keydown', escapeHandler);
      document.removeEventListener('click', (e: any) => toggleLanguageMenu(e, false));
    }
  }, [toggleMobileMenu, menuRef, languageMenu, toggleLanguageMenu]);


  const renderLanguages = (): JSX.Element[] => {
    return homeLanguages.map((homeLanguage: HomeLanguage, index: number): JSX.Element => (
      <li key={index}>
        <Link
          to="#"
          key={homeLanguage.id}
          onClick={():void => {
            setActiveLanguage(homeLanguages[index]);
            toggleLanguageMenu(null, false);
          }}
        >
          { homeLanguage.name }
        </Link>
      </li>
    ));
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
            <li>
              <Link to={auth.uid ? '/my-account' : '/login'} className={checkCurrentPath(accountPaths)}>{auth.uid ? 'My Account' : 'Log In'}</Link>
            </li>
            { auth.uid && <li><Link to='/' onClick={logOut}>Log Out</Link></li> }
            { window.location.pathname.length === 1 &&
              <li className="header__language">
                <Link to="#" onClick={toggleLanguageMenu} className="header__language-icon"><FontAwesomeIcon icon={faGlobe} /> &#9662;</Link>
                { homeLanguages &&
                  <ul ref={languageMenu}>
                    { renderLanguages() }
                  </ul>
                }
              </li>
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
