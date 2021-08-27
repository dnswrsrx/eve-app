import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';

import Loading from '../../general/loading/Loading';

import Subscribe from '../utils/subscribe/Subscribe';
import './Subscription.scss'

const Subscription = (): JSX.Element => {

  const auth = useSelector((state: RootState) => state.firebase.auth, shallowEqual);

  if (!auth.isLoaded) return <Loading />;

  return (
    <section className="subscription-page">
      <div className="subscription-page__wrapper page-wrapper">
        <h1 className="subscription-page__heading">Subscription</h1>
        <p>We currently offer the following subscription tiers.</p>
        <Subscribe />
        <hr />

        <div className="how">
          <div>
            <h2>How It Works</h2>
            <ul>
              <li>
                We use Stripe Billing to manage subscriptions and process payments.
                You may subscribe once you register and verify the email address provided.
              </li>
              <li>
                Stripe will securely store the information that you provide for the subscription: your email, billing address, and credit card details. You may update these details on the customer portal.
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
                You may cancel your subscription on the customer portal or by contacting us.
                Canceling on the customer portal informs Stripe not to renew your subscription when the next payment is due.
                Contacting us will allow us to cancel your subscription immediately and issue a prorated refund.
              </li>
              <li>
                Your billing history is available for you to view on the customer portal.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Subscription;
