import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, useFirestoreConnect, isLoaded } from 'react-redux-firebase';

import firebase from '../../../../config/firebaseConfig';
import stripePromise from '../../../../config/stripeConfig';
import { CollectionNames, Price } from '../../../models/models';
import '../SubscriptionForm/SubscriptionForm.scss';
import Subscribe from './Subscribe';

interface SubscriptionFormProps {
  auth: FirebaseReducer.AuthState,
}

const generalSubscriptions = 'prod_IoVR4WqzEfaXiT';

const SubscriptionForm = ({ auth }: SubscriptionFormProps): JSX.Element => {

  useFirestoreConnect([{
    collection: CollectionNames.Products,
    doc: generalSubscriptions,
    subcollections: [{ collection: 'prices' }]
  }]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);
  const prices: Price[] = products ? products[0].prices : [];

  const [error, setError] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const checkout_sessions = firebase.firestore().collection('users').doc(auth.uid).collection('checkout_sessions');

  const handleClick = (priceId: string, priceDescription: string) => {

    setLoadingCheckout(true);

    // Set up a checkout session that is inserted into Firestore.
    // Once session is in Firestore, it'll ping Stripe to verify.
    checkout_sessions.add({
      price: priceId,
      customerEmail: auth.email,
      mode: 'subscription',
      success_url: window.location.href,
      cancel_url: window.location.href,
      metadata: { subscription: priceDescription }
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
            !isLoaded(products) && prices
              ? <p>Loading...</p>
              : <div className="subscription__product-container">
                  {prices.map((p: Price, index: number) => {
                    return <Subscribe key={index} price={p} handleClick={handleClick} loadingCheckout={loadingCheckout} />
                  })}
                </div>
          )
          : <p>Your email has not been verified yet. Please check your email for a verification link to do so.</p>
      }
    </div>
  )
}

export default SubscriptionForm;
