import React, { useState } from 'react';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import firebase from '../../../../config/firebaseConfig';
import stripePromise from '../../../../config/stripeConfig';

import { RootState } from '../../../../store/reducers/rootReducer';
import { CollectionNames, Product } from '../../../models/models';

import Loading from '../../../general/loading/Loading';

import './Subscribe.scss';
import SubscribeToProduct from './SubscribeToProduct';
import useSubscription from '../../../../utils/userSubscription';

const Subscribe = (): JSX.Element => {

  useFirestoreConnect([{ collection: CollectionNames.Products, where: ['active', '==', true]}]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  const auth = useSelector((state: RootState) => state.firebase.auth, isEqual);

  const user = auth.isLoaded && !auth.isEmpty && firebase.firestore().collection('users').doc(auth.uid);

  const [error, setError] = useState<'cart'|'portal'|null>(null);
  const [loadingCartPortal, setLoadingCartPortal] = useState<'cart'|'portal'|null>(null);

  const subscription = useSubscription();

  if (!isLoaded(products) || !auth.isLoaded) return <Loading />;

  const _customerPortal = () => {
    const getPortalLink = firebase.app().functions('us-central1').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');

    setLoadingCartPortal('portal');

    getPortalLink({ returnUrl: window.location.origin }).then(({data}) => {
      window.location.assign(data.url);
    }).catch(e => {
      console.log(e);
      setError('portal');
      setLoadingCartPortal(null);
    })
  }

  const _checkout = (priceID: string) => {

    if (user) {
      setLoadingCartPortal('cart');

      // Set up a checkout session that is inserted into Firestore.
      // Once session is in Firestore, it'll ping Stripe to verify.
      user.collection('checkout_sessions').add({
        price: priceID,
        customerEmail: auth.email,
        mode: 'subscription',
        success_url: window.location.href,
        cancel_url: window.location.href,
      }).then((snap: firebase.firestore.DocumentData) => {

        snap.onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {


          // If verification successful, Stripe will insert a sessionId into this checkout_session document.
          const sessionId: string = snapshot?.data()?.sessionId;

          // Using that sessionId, we redirect to Stripe's checkout page.
          // User can supply the card details for the subscription.
          if (sessionId) {
            stripePromise.then(stripe => {
              stripe?.redirectToCheckout({sessionId})
            }).catch(e => {
              setError('cart');
              setLoadingCartPortal(null);
            })
          }
        }, (e: string) => {
          setError('cart');
        })
      }).catch(e => {
        setError('cart');
        setLoadingCartPortal(null);
      })
    }
  }

  const cartOrPortal = (productName: string): Function => {
    if (user && auth.uid && auth.emailVerified) {
      if (!subscription) return _checkout;
      if (subscription !== productName) return _customerPortal;
    }
    return () => {};
  }

  return (
    <div className="subscribe">

      {error && <p className="error">Error creating the {error}. Please refresh the page and try again.</p>}

      <div className="subscribe__products">
        { products.map((p: Product, index: number) => {
          return <SubscribeToProduct
            key={index}
            product={p}
            cartOrPortal={cartOrPortal(p.name)}
            loadingCartPortal={loadingCartPortal}
            auth={auth}
          />
        })}
      </div>
    </div>
  )
}

export default Subscribe;
