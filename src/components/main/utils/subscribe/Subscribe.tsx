import React, { useContext } from 'react';
import { Product } from '../../../models/models';
import { ProductsContext } from '../../Main';
import './Subscribe.scss';
import SubscribeToProduct from './SubscribeToProduct';
import useCartOrPortal from '../../utils/subscribe/CartOrPortalHook';

const Subscribe = (): JSX.Element => {

  const products = useContext(ProductsContext);
  const individualProducts = products.filter((p: Product) => p.name !== 'Institutional Pricing');

  const { cartOrPortal, loadingCartOrPortal, error } = useCartOrPortal();

  return (
    <div className="subscribe">

      {error && <p className="error">Error creating the {error}. Please refresh the page and try again.</p>}

      <div className="subscribe__products">
        { individualProducts.map((p: Product, index: number) => {
          return <SubscribeToProduct
            key={index}
            product={p}
            cartOrPortal={cartOrPortal(p.name)}
            loadingCartPortal={loadingCartOrPortal}
          />
        })}
      </div>
    </div>
  )
}

export default Subscribe;
