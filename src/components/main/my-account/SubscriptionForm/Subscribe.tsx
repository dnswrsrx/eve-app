import React from 'react';

import { Price } from '../../../models/models';
import '../SubscriptionForm/SubscriptionForm.scss';

interface SubscribeProps {
  price: Price,
  handleClick: Function,
  loadingCheckout: boolean,
}

const Subscribe = ({ price, handleClick, loadingCheckout }: SubscribeProps) => {

  return (
    <div className="subscription__col">
      <h3>{price.description}</h3>
      <button
          className="subscription__subscribe"
          onClick={() => handleClick(price.id, price.description)}
          disabled={loadingCheckout}
      >
        Subscribe for {price.unit_amount / 100} {price.currency.toUpperCase()}/{price.interval}
      </button>
    </div>
  )
}

export default Subscribe;
