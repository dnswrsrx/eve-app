import React, { useContext } from 'react';
import { Product } from '../../../models/models';
import { ProductsContext } from '../../Main';
import './Subscribe.scss';
import SubscribeToProduct from './SubscribeToProduct';

const Subscribe = (): JSX.Element => {

  const products = useContext(ProductsContext);
  const individualProducts = products.filter((p: Product) => p.name !== 'Institutional Pricing');

  return (
    <div className="subscribe">
      <p>These are the current subscription tiers.</p>

      <div className="subscribe__products">
        { individualProducts.map((p: Product, index: number) => {
          return <SubscribeToProduct
            key={index}
            product={p}
          />
        })}
      </div>
    </div>
  )
}

export default Subscribe;
