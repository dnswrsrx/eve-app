import React from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CollectionNames, Product } from '../../../models/models';

import useSubscription from '../../../../utils/userSubscription';

import './Subscribe.scss';

interface SubscribeToProductProps {
  product: Product,
  cartOrPortal: Function,
  loading: string|null,
  auth: FirebaseReducer.AuthState,
}

const SubscribeToProduct = ({ product, cartOrPortal, loading, auth }: SubscribeToProductProps) => {

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

  return (
    <div className="subscribe__col">
      <h3>{product.name}</h3>
      { window.location.pathname.includes('/subscription') && product.description && <p>{product.description}</p> }
      { priceID && price &&
          <button
            className="subscribe__subscribe"
            disabled={Boolean(loading) || !auth.uid || !auth.emailVerified || isSubscribed}
            onClick={() => cartOrPortal(priceID)}
          >
            { subscription
              ? ( isSubscribed
                    ? `Currently subscribed (${amount} CAD/year)`
                    : `Update subscription (${amount} CAD/year)`
                )
              : `Subscribe for ${amount} CAD/year`
            }
          </button>
      }
    </div>
  )
}

export default SubscribeToProduct;
