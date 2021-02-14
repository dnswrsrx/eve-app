import React from 'react';

import { Product } from '../../../models/models';
import '../SubscriptionForm/SubscriptionForm.scss';

interface SubscribeProps {
  product: Product,
  handleClick: Function,
  loadingCheckout: boolean,
}

const Subscribe = ({ product, handleClick, loadingCheckout }: SubscribeProps) => {

  return (
    <div className="subscription__col">
      <h3>{product.name}</h3>
      <div className="subscription__description">
        {product.description}
      </div>
      <button
          className="subscription__subscribe"
          onClick={() => handleClick(product.stripe_metadata_price_id)}
          disabled={loadingCheckout}
      >
        Subscribe for {product.stripe_metadata_price} CAD/year
      </button>
    </div>
  )
}

export default Subscribe;
