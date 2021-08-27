import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CollectionNames, Product } from '../../../models/models';

import useSubscription from '../../../../utils/userSubscription';

import './Subscribe.scss';

interface SubscribeToProductProps {
  product: Product,
  handleClick: Function,
  disabled: boolean,
}

const SubscribeToProduct = ({ product, handleClick, disabled }: SubscribeToProductProps) => {

  useFirestoreConnect([{
    collection: CollectionNames.Products,
    where: ['active', '==', true],
    doc: product.id,
    storeAs: `prices-${product.id}`,
    subcollections: [{ collection: 'prices' }]
  }]);

  const prices = useSelector(( {firestore: { data }}: any ) => data[`prices-${product.id}`])
  const priceKey = isLoaded(prices) && Object.keys(prices).length ? Object.keys(prices)[0] : null;
  const price = priceKey ? prices[priceKey] : null;
  const amount = price && price.unit_amount / 100;

  const subscription = useSubscription();
  const isSubscribed = Boolean(subscription && subscription === product.name);

  return (
    <div className="subscribe__col">
      <h3>{product.name}</h3>
      { window.location.pathname.includes('/subscription') && product.description && <p>{product.description}</p> }
      { priceKey && price &&
          <button
            className="subscribe__subscribe"
            onClick={() => handleClick(priceKey)}
            disabled={disabled || isSubscribed}
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
