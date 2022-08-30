import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CollectionNames, Product } from '../../../models/models';

import useSubscription from '../../../../utils/userSubscription';

import './Subscribe.scss';

interface SubscribeToProductProps {
  product: Product,
  cartOrPortal?: Function|null,
  loadingCartPortal?: string|null,
  auth?: FirebaseReducer.AuthState|null,
}

const SubscribeToProduct = ({ product, cartOrPortal, loadingCartPortal, auth }: SubscribeToProductProps) => {

  useFirestoreConnect([{
    collection: CollectionNames.Products,
    where: ['active', '==', true],
    doc: product.id,
    storeAs: `prices-${product.id}`,
    subcollections: [{ collection: 'prices' }]
  }]);

  const prices = useSelector(( {firestore: { data }}: any ) => data[`prices-${product.id}`])
  const priceID = isLoaded(prices) && Object.keys(prices).length ? Object.keys(prices)[0] : null;
  const price = priceID ? prices[priceID] : null;
  const amount = price && price.unit_amount / 100;

  const subscription = useSubscription();
  const isSubscribed = Boolean(subscription && subscription === product.name);

  const [loading, setLoading] = useState(false);

  useEffect(() => {if (loadingCartPortal === null) setLoading(false)}, [loadingCartPortal]);

  const manageSubscription = (priceID: string) => {
    setLoading(true);
    if (cartOrPortal) {
      cartOrPortal(priceID);
    }
  }

  const images = window.location.pathname === '/' && (
    product.name.includes('Academic Vocabulary')
      ? ['exams', 'teaching', 'book_lover']
      : ['multitasking', 'travel_mode', 'having_fun']
  );

  return (
    <div className="subscribe__col">
      <h3>
        { // Home page describes the categories and not the subscription/
          window.location.pathname === '/'
            ? product.name.replace('General Vocabulary + ', '')
            : product.name
        }
      </h3>

      { images &&
        <div className="subscribe__images">
          { images.map((name, index) => <img key={index} className="subscribe__image" src={`/images/${name}.svg`} alt={name} />) }
        </div>
      }

      { (window.location.pathname.includes('/subscription') || window.location.pathname === '/') && product.description && <p>{product.description}</p> }
      {

        window.location.pathname === '/'
          ? <p className="subscribe__text bold">
              { product.name.includes('Academic Vocabulary') ? '$8 USD/year for both' : `$${amount} USD/year`}
            </p>
          : priceID && price &&
              ( auth && auth.uid && auth.email
                ? <button
                    className="subscribe__subscribe"
                    onClick={() => manageSubscription(priceID)}
                    disabled={Boolean(loadingCartPortal) || loading || !auth.uid || !auth.emailVerified || isSubscribed || !['admin@eve.com', 'gerry@cpr4esl.com', 'dennissaw12@gmail.com'].includes(auth.email)}
                  >
                    { subscription
                      ? ( isSubscribed
                            ? `Currently subscribed ($${amount} USD/year)`
                            : loading ? 'Loading portal...' : `Update subscription ($${amount} USD/year)`
                        )
                      : loading ? 'Loading cart...' : `Subscribe for $${amount} USD/year`
                    }
                    { loading && <span className="subscribe__spinner"></span> }
                  </button>
                : <p className="subscribe__text bold">${amount} USD/year</p>
              )
      }
    </div>
  )
}

export default SubscribeToProduct;
