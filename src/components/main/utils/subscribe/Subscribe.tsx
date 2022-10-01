import React from 'react';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import { RootState } from '../../../../store/reducers/rootReducer';
import { CollectionNames, Product } from '../../../models/models';

import Loading from '../../../general/loading/Loading';

import './Subscribe.scss';
import SubscribeToProduct from './SubscribeToProduct';

import useCartOrPortal from '../../utils/subscribe/CartOrPortalHook';

const Subscribe = (): JSX.Element => {

  useFirestoreConnect([{ collection: CollectionNames.Products, where: ['active', '==', true]}]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);

  const { cartOrPortal, loadingCartOrPortal, error } = useCartOrPortal();

  if (!isLoaded(products) || !auth.isLoaded) return <Loading />;


  return (
    <div className="subscribe">

      {error && <p className="error">Error creating the {error}. Please refresh the page and try again.</p>}

      <div className="subscribe__products">
        { products.map((p: Product, index: number) => {
          return <SubscribeToProduct
            key={index}
            product={p}
            cartOrPortal={cartOrPortal(p.name)}
            loadingCartPortal={loadingCartOrPortal}
            auth={auth}
          />
        })}
      </div>
    </div>
  )
}

export default Subscribe;
