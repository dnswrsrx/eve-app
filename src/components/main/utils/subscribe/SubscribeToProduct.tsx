import React, { useState, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { AuthContext } from '../../Main';
import { CollectionNames, Product, Price } from '../../../models/models';
import useSubscription from '../UserSubscriptionHook';
import './Subscribe.scss';


interface SubscribeToProductProps {
  product: Product,
  cartOrPortal?: Function|null,
  loadingCartPortal?: string|null,
}


const SubscribeToProduct = ({ product, cartOrPortal, loadingCartPortal }: SubscribeToProductProps) => {

  const auth = useContext(AuthContext);

  useFirestoreConnect([{
    collection: CollectionNames.Products,
    where: ['active', '==', true],
    doc: product.id,
    storeAs: `prices-${product.id}`,
    subcollections: [{ collection: 'prices' }]
  }]);

  const prices = useSelector(( {firestore: { data }}: any ) => data[`prices-${product.id}`]) || {};
  
  const subscription = useSubscription();
  const isSubscribed = Boolean(subscription && subscription === product.name);

  const [loading, setLoading] = useState(false);

  useEffect(() => {if (loadingCartPortal === null) setLoading(false)}, [loadingCartPortal]);

  if (!isLoaded(prices)) return <></>

  const [priceID, price]: [string|null, Price|null] = Object.entries(prices).length ? Object.entries(prices)[0] as [string|null, Price|null] : [null, null];
  const amount = (price?.unit_amount || 0) / 100;

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
        { window.location.pathname === '/' && product.name.includes('Academic Vocabulary') &&
          <small> (+ General Vocabulary)</small>
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
          ? <p className="subscribe__text bold">${amount} USD/year</p>
          : price
              ? <button
                  className="subscribe__subscribe"
                  onClick={() => manageSubscription(priceID || '')}
                  disabled={Boolean(loadingCartPortal) || loading || !auth.uid || !auth.emailVerified || isSubscribed || !['admin@eve.com', 'gerry@cpr4esl.com', 'dennissaw12@gmail.com'].includes(auth.email)}
                >
                  { loading
                      ? `Loading ${isSubscribed ? 'portal' : 'cart'}...`
                      : !subscription
                        ? `Subscribe for $${amount} USD/year`
                        : `${isSubscribed ? 'Currently subscribed' : 'Update subscription'} ($${amount} USD/year)`
                  }
                  { loading && <span className="subscribe__spinner"></span> }
                </button>
              : <p className="subscribe__text bold">${amount} USD/year</p>
      }
    </div>
  )
}

export default SubscribeToProduct;
