import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';

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
      <div className="home__maintenance">
        <p>
          We have recently decided to make this website totally FREE and available to everyone.
        </p>
        <p>
          If you have a subscription, it will not be renewed and
          there will be no more payments.
        </p>
        <p>
          For a refund of the prorated amount for the remaining time of your subscription:
        </p>
        <ol>
          <li>Log into the vocabulary website.</li>
          <li>Click on My Account.</li>
          <li>Click on Manage Your Subscription.</li>
          <li>Click on Cancel Subscription.</li>
          <li>Send me an email, saying "I would like a refund." You can find my email address on the <Link to="/terms-of-use">Terms of Use page</Link>.</li>
        </ol>
        <p>
          If you do not need a refund, the funds will be used to continue to grow this website.
        </p>
        <p>
          ALL THE EXERCISES ON THIS SITE WILL NOW BE FREE FOR EVERYONE.
        </p>
      </div>

      <h1 className="home__banner-heading anchor">Welcome to English Vocabulary Exercises</h1>
      <div className="home__banner-text">
        <div className="home__banner-questions">
          <h3>Want to speak better and understand more?</h3>
          <img className="home__banner-image" src='/images/speaking.svg' alt="speaking"/>

          <h3>Looking to improve your reading and writing?</h3>
          <img className="home__banner-image" src="/images/study.svg" alt="writing"/>

          <h3>Need to improve your vocabulary for English tests, including the IELTS, TOEFL, and TOEIC?</h3>
          <img className="home__banner-image" src='/images/education.svg' alt="someone standing on a book and tossing a graduation cap"/>
        </div>
      </div>

      <div>
        <h2 style={{textAlign: 'center'}}>This website has been created especially for <strong>you</strong>!</h2>
        {
          (isLoaded(bannerText) && bannerText?.bannerText.length) ?
            <>
              { bannerText.bannerText.split('\n').map((e: string, i: number) => <div key={i} dangerouslySetInnerHTML={{ __html: e }}></div>) }
            </>
            :
            <>
              <h3 style={{textAlign: 'center'}}>Start growing your English vocabulary today, with over 2700 carefully chosen words in over 900 exercises.</h3>
              <h3 style={{textAlign: 'center'}}>New content added regularly-ish!</h3>
            </>
         }
      </div>
      <br />

      {/* <Link className="home__start-today" to="/support">Consider Supporting</Link> */}

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
    </section>
  )
}

export default Home;
