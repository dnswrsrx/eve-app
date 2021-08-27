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

  const customerPortal = () => {
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

  const subscription = useSubscription();

  return (
    <div className="subscription">
      <h2 className="subscription__heading">Subscription</h2>

      {portalError && <p className="error">Failed to load customer portal. Please refresh the page and try again.</p>}

      <button
        className="subscription__subscribe"
        onClick={customerPortal}
        disabled={loadingPortal}
      >
        { loadingPortal
          ? 'Loading portal...'
          : 'Manage your subscription and billing details'
        }
      </button>

      { subscription
        ? <p>You are currently subscribed to { subscription }.</p>
        : <p>You currently do not have a subscription.</p>
      }

      {/* replace with auth.emailVerified when ready */}
      { !auth.emailVerified &&
        <p>Your email has not been verified yet. Please check your email for the verification link. Once you're verified, you may subscribe!</p>
      }

      <Subscribe />
    </div>
  )
}

export default SubscriptionForm;
