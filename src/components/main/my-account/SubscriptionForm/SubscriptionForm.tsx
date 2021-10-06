import React, { useState } from 'react';
import { FirebaseReducer } from 'react-redux-firebase';

import firebase from '../../../../config/firebaseConfig';
import Subscribe from '../../utils/subscribe/Subscribe';
import useSubscription from '../../../../utils/userSubscription';

import '../SubscriptionForm/SubscriptionForm.scss';


interface SubscriptionFormProps {
  auth: FirebaseReducer.AuthState,
}

const SubscriptionForm = ({ auth }: SubscriptionFormProps): JSX.Element => {

  const [portalError, setPortalError] = useState(false);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const subscription = useSubscription();

  const customerPortal = () => {
    if (subscription) {
      const getPortalLink = firebase.app().functions('us-central1').httpsCallable('ext-firestore-stripe-subscriptions-createPortalLink');

      setLoadingPortal(true);

      getPortalLink({ returnUrl: window.location.origin }).then(({data}) => {
        window.location.assign(data.url);
      }).catch(e => {
        console.log(e);
        setPortalError(true);
        setLoadingPortal(false);
      })
    }
  }

  return (
    <div className="subscription">
      <h2 className="subscription__heading">Subscription</h2>

      { auth.uid && !auth.emailVerified &&
        <h3 className="subscription__unverified">You are now signed up! Please go to your email and click on the verification link.</h3>
      }
      { auth.uid && subscription && <h3 className="success">You are currently subscribed to {subscription}.</h3> }

      {portalError && <p className="error">Failed to load customer portal. Please refresh the page and try again.</p>}

      { subscription &&
        <button
          className="subscription__subscribe"
          onClick={customerPortal}
          disabled={loadingPortal}
        >
          { loadingPortal
            ? 'Loading portal...'
            : 'Manage your subscription and payment method'
          }
          { loadingPortal && <span className="subscription__spinner"></span>}
        </button>
      }

      <Subscribe />
    </div>
  )
}

export default SubscriptionForm;
