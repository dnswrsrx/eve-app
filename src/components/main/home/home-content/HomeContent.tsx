import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { HomeLanguage, Product } from '../../../models/models';

import { ProductsContext } from '../../Main';
import Ads from '../../ads/Ads';
import SubscribeToProduct from '../../utils/subscribe/SubscribeToProduct';
import './HomeContent.scss';

interface HomeContentProps {
  activeLanguage: HomeLanguage|null,
}

const HomeContent = ({ activeLanguage }: HomeContentProps): JSX.Element => {
  const products = useContext(ProductsContext);
  const individualProducts = products.filter((p: Product) => p.name !== 'Institutional Pricing');

  if (!activeLanguage || activeLanguage.name === 'English') {
    return (
      <div className="home-content-container page-wrapper">
        <h1 className="home-content-container__banner-heading">Welcome to English Vocabulary Exercises</h1>
        <div className="home-content-container__banner-text">
          <div className="home-content-container__banner-questions">
            <h3>Want to speak better and understand more?</h3>
            <img className="home-content-container__banner-image" src='/images/speaking.svg' alt="speaking"/>

            <h3>Looking to improve your reading and writing?</h3>
            <img className="home-content-container__banner-image" src="/images/study.svg" alt="writing"/>

            <h3>Need to score well on English tests, including the IELTS, TOEFL, and TOEIC?</h3>
            <img className="home-content-container__banner-image" src='/images/education.svg' alt="someone standing on a book and tossing a graduation cap"/>
          </div>
        </div>
        <h2>This website has been created especially for you!</h2>
        <h3>
           Start growing your English vocabulary today, with over 2300 carefully chosen words and over 840 exercises.
        </h3>

        <h3>
          New content added regularly.
        </h3>

        <Link className="home-content-container__start-today" to="/subscription">Get Started and Subscribe!</Link>

        <Ads slot="8767665789" />

        <h2>There are two main categories to learn and practise your new vocabulary:</h2>
        <h2>General Vocabulary & Academic Vocabulary.</h2>

        <h3>Each category is further divided into subcategories of 10 to 17 words.</h3>

        <h3>Each subcategory contains 5 gap-fill exercises to practise each word in 5 different contexts.</h3>

        <div className="subscribe__products">
          { individualProducts.map((p: Product, index: number) => {
            return <SubscribeToProduct
              key={index}
              product={p}
            />
          })}
        </div>

        <div className="subscribe__institutional">
          <h3>Visit our <a href="/subscription">subscription page</a> for institutional rates!</h3>
          <img src="/images/meeting.svg" alt="Meeting" />
        </div>

        <Ads slot="1252137845" />

      </div>
    )}

  return (
    <div className="home-content-container page-wrapper">
      <div className="home-content-container__banner-wrapper">
        <h1 className="home-content-container__banner-heading">{ activeLanguage.bannerHeading }</h1>
        <div className="home-content-container__banner-text" dangerouslySetInnerHTML={{ __html: activeLanguage.bannerText }}></div>
      </div>
      <Ads slot="8767665789" />
      <div className="home-content-container__banner-wrapper">
        <div className="home-content-container__main-content" dangerouslySetInnerHTML={{ __html: activeLanguage.mainContent }}></div>
      </div>
      <Ads slot="1252137845" />
    </div>
  )
}

export default HomeContent;
