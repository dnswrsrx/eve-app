import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import firebase from '../../../../config/firebaseConfig';
import stripePromise from '../../../../config/stripeConfig';
import { CollectionNames, Product } from '../../../models/models';
import '../SubscriptionForm/SubscriptionForm.scss';
import Subscribe from './Subscribe';

interface SubscriptionFormProps {
  auth: FirebaseReducer.AuthState,
}

const SubscriptionForm = ({ auth }: SubscriptionFormProps): JSX.Element => {

  useFirestoreConnect([{
    collection: CollectionNames.Products,
  }]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  const [error, setError] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const checkout_sessions = firebase.firestore().collection('users').doc(auth.uid).collection('checkout_sessions');

  const handleClick = async (price_id: string) => {

    setLoadingCheckout(true);

    // Set up a checkout session that is inserted into Firestore.
    const session: Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>> = checkout_sessions.add({
      price: price_id,
      customerEmail: auth.email,
      mode: 'subscription',
      successUrl: window.location.href,
      success_url: window.location.href,
      cancelUrl: window.location.href,
      cancel_url: window.location.href,
    })

    // Once in Firestore, it'll ping Stripe to verify.
    Promise.resolve(session).then((snap: firebase.firestore.DocumentData) => {

      snap.onSnapshot((snapshot: firebase.firestore.DocumentSnapshot) => {

        // If verification successful, Stripe will insert a sessionId into Firestore where this session is.
        const sessionId: string = snapshot?.data()?.sessionId;

        // Using that sessionId, we redirect to Stripe's checkout page.
        if (sessionId) {
          stripePromise.then(stripe => {
            stripe?.redirectToCheckout({sessionId})
          }).catch(e => {
            setError(e);
            setLoadingCheckout(false);
          })
        }
      }, (e: string) => {
        setError(e);
      })
    }).catch(e => {
      setError(e);
      setLoadingCheckout(false);
    })
  }

  return (
    <div className="subscription">
      <h2 className="subscription__heading">Subscription</h2>

      {loadingCheckout && <p>Cart loading...</p>}
      {error && <p className="error">Error creating a cart. Please refresh the page and try again.</p>}

    {/* replace with auth.emailVerified when ready */}
      { !auth.emailVerified ?
          (
            !isLoaded(products)
              ? <p>Loading...</p>
              : <div className="subscription__product-container">
                  {products.map((p: Product, index: number) => {
                    return <Subscribe key={index} product={p} handleClick={handleClick} loadingCheckout={loadingCheckout} />
                  })}
                </div>
          )
          : <p>Your email has not been verified yet. Please check your email for a verification link to do so.</p>
      }
    </div>
  )
}

export default SubscriptionForm;
