import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { CollectionNames, Product } from '../../../models/models';

import '../SubscriptionForm/SubscriptionForm.scss';

interface SubscribeProps {
  product: Product,
  handleClick: Function,
  disable: boolean,
}

const Subscribe = ({ product, handleClick, disable }: SubscribeProps) => {

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

  return (
    <div className="subscription__col">
      <h3>{product.name}</h3>
      { priceKey && price &&
          <button
            className="subscription__subscribe"
            onClick={() => handleClick(priceKey, product.name)}
            disabled={disable}
          >
            Subscribe for {price.unit_amount / 100} CAD/year
          </button>
      }
    </div>
  )
}

export default Subscribe;
