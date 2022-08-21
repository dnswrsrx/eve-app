import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { HomeLanguage, CollectionNames, Product } from '../../../models/models';

import Loading from '../../../general/loading/Loading';
import Ads from '../../ads/Ads';
import SubscribeToProduct from '../../utils/subscribe/SubscribeToProduct';
import './HomeContent.scss';

interface HomeContentProps {
  activeLanguage: HomeLanguage|null,
}

const HomeContent = ({ activeLanguage }: HomeContentProps): JSX.Element => {

  useFirestoreConnect([{ collection: CollectionNames.Products, where: ['active', '==', true]}]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  if (!isLoaded(products)) return <Loading />

  if (!activeLanguage || activeLanguage.name === 'English') {
    return (
      <div className="home-content-container page-wrapper">
        <h1 className="home-content-container__banner-heading">Welcome to English Vocabulary Exercises</h1>
        <div className="home-content-container__banner-text">
          <div className="home-content-container__banner-questions">
            <div className="home-content-container__banner-question">
              <h3>Trying to speak better and understand more?</h3>
              <img className="home-content-container__banner-image" src='/images/speaking.svg' />
            </div>

            <div className="home-content-container__banner-question {activeLanguage.name}">
              <h3>Looking to improve your reading and writing?</h3>
              <img className="home-content-container__banner-image" src="/images/study.svg"  />
            </div>

            <div className="home-content-container__banner-question">
              <h3>Need to score well on English tests?</h3>
              <img className="home-content-container__banner-image" src='/images/education.svg' />
            </div>
          </div>
        </div>
        <h2>This website has been created especially for you!</h2>
        <h3>
          With 2000+ carefully chosen words and 800+ exercises, start growing your English vocabulary.
        </h3>

        <Link className="home-content-container__start-today" to="/subscription#instructions">Get Started and Subscribe!</Link>

        <Ads slot="8767665789" />

        <h2>There are two main categories for you to learn and practise.</h2>
        <div className="subscribe__products">
          { products.map((p: Product, index: number) => {
            return <SubscribeToProduct
              key={index}
              product={p}
            />
          })}
        </div>

        <h3>Each category is further divided into subcategories of 14 to 17 words.</h3>

        <h3>Each subcategory contains 5 gap-fill exercises with the words of that subcategory.</h3>

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
