import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

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

  if (activeLanguage?.name === 'English') {
    return (
      <div className="home-content-container page-wrapper">
        <h1 className="home-content-container__banner-heading anchor">Welcome to English Vocabulary Exercises</h1>
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

        <div>
          <h2 style={{textAlign: 'center'}}>This website has been created especially for&nbsp;<strong>you</strong>!</h2>
          <h3 style={{textAlign: 'center'}}>Start growing your English vocabulary today, with over 2700 carefully chosen words in over 900 exercises.</h3>
          <h3 style={{textAlign: 'center'}}>New content added regularly!</h3>
          <br />
          <h4 style={{textAlign: 'center'}}>
            In January 2024, we added to General Vocabulary:
          </h4>
          <h5 style={{textAlign: 'center'}}>
            How's the Weather?
            <br />
            Korean Elementary School English Vocabulary
          </h5>
        </div>
        <br />

        {/*}{activeLanguage.bannerText.split('\n').map(e => <div dangerouslySetInnerHTML={{ __html: e }}></div>)}{*/}

        <Link className="home-content-container__start-today" to="/subscription">Get Started and Subscribe!</Link>

        <div className="home-content-container__try">
          <h3><FontAwesomeIcon icon={faStar}/> Try free exercises in the <Link to="/subcategories/0zwuF8q0eHklNDFZJAH9">General</Link> and <Link to="/subcategories/VQvdu2OoscCzjxPk1C5s">Academic</Link> categories</h3>
        </div>

        <Ads slot="8767665789" />

        <h2 className="anchor">There are two main categories to learn and practise your new vocabulary:</h2>
        <h2 className="anchor">General Vocabulary & Academic Vocabulary.</h2>

        <h3>Each category is divided into subcategories of 10 to 17 words.</h3>

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
        <h1 className="home-content-container__banner-heading">{ activeLanguage?.bannerHeading }</h1>
        <div className="home-content-container__banner-text" dangerouslySetInnerHTML={{ __html: activeLanguage?.bannerText || '' }}></div>
      </div>
      <Ads slot="8767665789" />
      <div className="home-content-container__banner-wrapper">
        <div className="home-content-container__main-content" dangerouslySetInnerHTML={{ __html: activeLanguage?.mainContent || '' }}></div>
      </div>
      <Ads slot="1252137845" />
    </div>
  )
}

export default HomeContent;
