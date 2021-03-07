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

  useFirestoreConnect([{ collection: CollectionNames.Products}]);
  const products = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Products]);

  const [error, setError] = useState('');
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const user = firebase.firestore().collection('users').doc(auth.uid);

  const handleClick = (priceId: string, productName: string) => {

    setLoadingCheckout(true);

    // Set up a checkout session that is inserted into Firestore.
    // Once session is in Firestore, it'll ping Stripe to verify.
    user.collection('checkout_sessions').add({
      price: priceId,
      customerEmail: auth.email,
      mode: 'subscription',
      success_url: window.location.href,
      cancel_url: window.location.href,
      metadata: { subscription: productName }
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


  const [subscription, setSubscription] = useState(null);

  user.get().then(u => {
    setSubscription(u?.data()?.main);
  })

  return (
    <div className="subscription">
      <h2 className="subscription__heading">Subscription</h2>

      {loadingCheckout && <p>Loading cart...</p>}
      {error && <p className="error">Error creating a cart. Please refresh the page and try again.</p>}

      { subscription
        ? <p>You are currently subscribed to { subscription }.</p>
        : <p>You currently do not have a subscription.</p>
      }


      {/* replace with auth.emailVerified when ready */}
      { !auth.emailVerified
          ? (isLoaded(products)
              ? (
               <div className="subscription__product-container">
                 {products.map((p: Product, index: number) => {
                   return <Subscribe
                     key={index}
                     product={p}
                     handleClick={handleClick}
                     disable={loadingCheckout || p.name === subscription}
                   />
                 })}
               </div>
              )
              : <p>Loading...</p>
          )
          : <p>Your email has not been verified yet. Please check your email for a verification link to do so.</p>
    }
    </div>
  )
}

export default SubscriptionForm;
