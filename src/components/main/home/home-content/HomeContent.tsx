import React, { useState } from 'react';
import { HomeLanguage } from '../../../models/models';
import './HomeContent.scss';

interface HomeContentProps {
  homeLanguages: HomeLanguage[],
}

const HomeContent = ({ homeLanguages }: HomeContentProps): JSX.Element => {
  const [activeLanguage, setActiveLanguage] = useState<HomeLanguage>(homeLanguages[0]);

  const renderLanguages = (): JSX.Element[] => {
    return homeLanguages.map((homeLanguage: HomeLanguage, index: number): JSX.Element => (
      <button
        key={homeLanguage.id}
        className={`home-content-container__language-button ${homeLanguage === activeLanguage ? 'active' : ''}`}
        onClick={():void => setActiveLanguage(homeLanguages[index])}
      >
        { homeLanguage.name }
      </button>
    ));
  }

  return (
    <div className="home-content-container">
      <div className="home-content-container__banner">
        <div className="home-content-container__banner-wrapper page-wrapper">
          <h1 className="home-content-container__banner-heading">{ activeLanguage.bannerHeading }</h1>
          <div className="home-content-container__banner-text" dangerouslySetInnerHTML={{ __html: activeLanguage.bannerText }}></div>
          <div className="home-content-container__language-buttons">
            { renderLanguages() }
          </div>
        </div>
      </div>
      <div className="home-content-container__banner-wrapper page-wrapper">
        <div className="home-content-container__main-content" dangerouslySetInnerHTML={{ __html: activeLanguage.mainContent }}></div>
      </div>
    </div>
  )
}

export default HomeContent;
