import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CollectionNames, Product } from '../../../models/models';

import useSubscription from '../../../../utils/userSubscription';

import './Subscribe.scss';

interface SubscribeToProductProps {
  product: Product,
  cartOrPortal: Function,
  loadingCartPortal: string|null,
  auth: FirebaseReducer.AuthState,
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
    cartOrPortal(priceID);
  }

  return (
    <div className="subscribe__col">
      <h3>{product.name}</h3>
      { window.location.pathname.includes('/subscription') && product.description && <p>{product.description}</p> }
      { priceID && price &&
          ( auth.uid
            ? <button
                className="subscribe__subscribe"
                onClick={() => manageSubscription(priceID)}
                disabled={Boolean(loadingCartPortal) || loading || !auth.uid || !auth.emailVerified || isSubscribed || !['Yj929Tkf8jaUf1rgam2zBvaNvii1', 'aZPHdaxNVag9xcXtMf8m72r8PEj2'].includes(auth.uid)}
              >
                { subscription
                  ? ( isSubscribed
                        ? `Currently subscribed (${amount} CAD/year)`
                        : loading ? 'Loading portal...' : `Update subscription ($${amount} CAD/year)`
                    )
                  : loading ? 'Loading cart...' : `Subscribe for $${amount} CAD/year`
                }
                { loading && <span className="subscribe__spinner"></span> }
              </button>
            : <p className="subscribe__text bold">${amount} CAD/year</p>
          )
      }
    </div>
  )
}

export default SubscribeToProduct;
