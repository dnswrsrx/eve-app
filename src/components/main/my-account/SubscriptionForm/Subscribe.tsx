import React from 'react';

import { Product } from '../../../models/models';

import '../SubscriptionForm/SubscriptionForm.scss';

interface SubscribeProps {
  product: Product,
  handleClick: Function,
  disable: boolean,
}

const Subscribe = ({ product, handleClick, disable }: SubscribeProps) => {

    return (
      <div className="subscription__col">
        <h3>{product.name}</h3>
        <button
            className="subscription__subscribe"
            onClick={() => handleClick(product.stripe_metadata_price_id, product.name)}
            disabled={disable}
        >
          Subscribe for {product.stripe_metadata_price} CAD/year
        </button>
      </div>
  )
}

export default Subscribe;
