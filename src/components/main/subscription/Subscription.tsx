import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';

import Loading from '../../general/loading/Loading';
import Instructions from './Instructions/Instructions';
import RegisterForm from './RegisterForm/RegisterForm';

import useSubscription from '../../../utils/userSubscription';

import Subscribe from '../utils/subscribe/Subscribe';
import './Subscription.scss'

const Subscription = (): JSX.Element => {

  const auth = useSelector((state: RootState) => state.firebase.auth, shallowEqual);
  const subscription  = useSubscription();

  if (!auth.isLoaded) return <Loading />;

  return (
    <section className="subscription-page">
      <div className="subscription-page__wrapper page-wrapper">
        <h1 className="subscription-page__heading">Subscription</h1>
        { auth.uid && !auth.emailVerified &&
          <h3 className="subscription-page__unverified">You are now signed up! Please go to your email and click on the verification link.</h3>
        }
        { auth.uid && subscription && <h3 className="success">You are currently subscribed to {subscription}.</h3> }

        <p>We currently offer the following subscription tiers.</p>
        <Subscribe />

        <hr />

        <div className={!auth.uid ? "subscription-page__register" : ""}>
          <Instructions auth={auth} subscription={subscription} />
          {!auth.uid && <RegisterForm /> }
        </div>

        <hr />

        <article>
          <h2>How It Works</h2>
          <ul>
            <li>
              We use Stripe Billing to manage subscriptions and process payments.
              You may subscribe once you sign up and verify the email address provided.
            </li>
            <li>
              Stripe will securely store your credit card details that you provide for the subscription. You may update these details on the customer portal.
            </li>
            <li>
              Every year while you are subscribed, Stripe will charge the credit card on your account.
              You will be notified 7 days before you are charged.
            </li>
            <li>
              You may change your subscription on the customer portal and it should be reflected immediately.
              The price difference when changing tiers will be prorated to the remaining time left for that year.
              <strong> Note:</strong> if you switch to a tier with a lower rate, the prorated difference will be stored on your Stripe customer account. This difference will then be applied on your next payment.
            </li>
            <li>
              You may cancel your subscription on the customer portal.
              This will inform Stripe to not renew your subscription when the next payment is due.
            </li>
            <li>
              Your billing history is available for you to view on the customer portal.
            </li>
          </ul>
        </article>
      </div>
    </section>
  )
}

export default Subscription;
