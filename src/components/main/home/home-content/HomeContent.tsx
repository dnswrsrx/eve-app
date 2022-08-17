import React from 'react';
import { HomeLanguage } from '../../../models/models';
import Ads from '../../ads/Ads';
import './HomeContent.scss';

interface HomeContentProps {
  activeLanguage: HomeLanguage,
}

const HomeContent = ({ activeLanguage }: HomeContentProps): JSX.Element => {


  return (
    <div className="home-content-container">
      <div className="home-content-container__banner">
        <div className="home-content-container__banner-wrapper page-wrapper">
          <h1 className="home-content-container__banner-heading">{ activeLanguage.bannerHeading }</h1>
          <div className="home-content-container__banner-text" dangerouslySetInnerHTML={{ __html: activeLanguage.bannerText }}></div>
        </div>
      </div>
      <Ads slot="8767665789" />
      <div className="home-content-container__banner-wrapper page-wrapper">
        <div className="home-content-container__main-content" dangerouslySetInnerHTML={{ __html: activeLanguage.mainContent }}></div>
      </div>
      <Ads slot="1252137845" />
    </div>
  )
}

export default HomeContent;
