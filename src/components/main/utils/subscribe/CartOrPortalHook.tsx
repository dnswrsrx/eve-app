import { useState, useContext } from 'react';
import firebase from '../../../../config/firebaseConfig';
import stripePromise from '../../../../config/stripeConfig';
import { AuthContext } from '../../Main';
import useSubscription from '../UserSubscriptionHook';


interface hookSignature {
  cartOrPortal: Function,
  loadingCartOrPortal: string|null,
  error: string|null
}


const useCartOrPortalHook = (): hookSignature => {

  const auth = useContext(AuthContext);
  const user = auth.isLoaded && !auth.isEmpty && firebase.firestore().collection('users').doc(auth.uid);

  const [error, setError] = useState<'cart'|'portal'|null>(null);
  const [loadingCartOrPortal, setLoadingCartOrPortal] = useState<'cart'|'portal'|null>(null);

  const subscription = useSubscription();

  const customerPortal = () => {
    const getPortalLink = firebase.app().functions('us-central1').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');

    setLoadingCartOrPortal('portal');

    getPortalLink({ returnUrl: window.location.origin }).then(({data}) => {
      window.location.assign(data.url);
    }).catch(e => {
      console.log(e);
      setError('portal');
      setLoadingCartOrPortal(null);
    })
  }

  const checkout = (priceID: string, quantity?: number) => {

    if (user) {
      setLoadingCartOrPortal('cart');

      // Set up a checkout session that is inserted into Firestore.
      // Once session is in Firestore, it'll ping Stripe to verify.
      user.collection('checkout_sessions').add({
        price: priceID,
        quantity: quantity || 1,
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
              setLoadingCartOrPortal(null);
            })
          }
        }, (e: string) => {
          setError('cart');
        })
      }).catch(e => {
        setError('cart');
        setLoadingCartOrPortal(null);
      })
    }
  }

  const cartOrPortal = (productName: string): Function => {
    if (user && auth.uid && auth.emailVerified) {
      if (!subscription) return checkout;
      if (subscription !== productName) return customerPortal;
    }
    return () => {};
  }

  return { cartOrPortal, loadingCartOrPortal, error }
}


export default useCartOrPortalHook;
