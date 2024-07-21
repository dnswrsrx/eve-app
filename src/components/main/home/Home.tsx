import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

import Ads from '../ads/Ads';
import SubscribeToProduct from '../utils/subscribe/SubscribeToProduct';
import { ProductsContext } from '../Main';
import { CollectionNames, Product } from '../../models/models';
import './Home.scss';


const Home = (): JSX.Element => {

  const products = useContext(ProductsContext);
  const individualProducts = products.filter((p: Product) => p.name !== 'Institutional Pricing');

  useFirestoreConnect({ collection: CollectionNames.HomeLanguages, doc: 'english', storeAs: 'home-content' })
  const bannerText = useSelector(({ firestore: { data } }: any) => data['home-content'])

  return (
    <section className="home page-wrapper">
      <h1 className="home__banner-heading anchor">Welcome to English Vocabulary Exercises</h1>
      <div className="home__banner-text">
        <div className="home__banner-questions">
          <h3>Want to speak better and understand more?</h3>
          <img className="home__banner-image" src='/images/speaking.svg' alt="speaking"/>

          <h3>Looking to improve your reading and writing?</h3>
          <img className="home__banner-image" src="/images/study.svg" alt="writing"/>

          <h3>Need to score well on English tests, including the IELTS, TOEFL, and TOEIC?</h3>
          <img className="home__banner-image" src='/images/education.svg' alt="someone standing on a book and tossing a graduation cap"/>
        </div>
      </div>

      <div>
        <h2 style={{textAlign: 'center'}}>This website has been created especially for <strong>you</strong>!</h2>
        {
          (isLoaded(bannerText) && bannerText?.bannerText.length) ?
            <>
              { bannerText.bannerText.split('\n').map((e: string) => <div dangerouslySetInnerHTML={{ __html: e }}></div>) }
            </>
            :
            <>
              <h3 style={{textAlign: 'center'}}>Start growing your English vocabulary today, with over 2700 carefully chosen words in over 900 exercises.</h3>
              <h3 style={{textAlign: 'center'}}>New content added regularly-ish!</h3>
            </>
         }
      </div>
      <br />

      <Link className="home__start-today" to="/subscription">Get Started and Subscribe!</Link>

      <div className="home__try">
        <h3><FontAwesomeIcon icon={faStar}/> Try free exercises in the <Link to="/subcategories/0zwuF8q0eHklNDFZJAH9">General</Link> and <Link to="/subcategories/VQvdu2OoscCzjxPk1C5s">Academic</Link> categories</h3>
      </div>

      <Ads slot="1016492488" />

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

      <Ads slot="7321180411" />
    </section>
  )
}

export default Home;
