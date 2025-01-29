import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';

import Instructions from './Instructions/Instructions';
import RegisterForm from './RegisterForm/RegisterForm';
import AccessCode from './AccessCode/AccessCode';

import useSubscription from '../utils/UserSubscriptionHook';
import { AuthContext } from '../Main';

import Subscribe from '../utils/subscribe/Subscribe';
import InstitutionalSubscribe from '../utils/subscribe/InstitutionalSubscribe';
import './Subscription.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


const Subscription = (): JSX.Element => {

  const auth = useContext(AuthContext);
  const subscription  = useSubscription();

  return (
    <section className="subscription-page">
      <Helmet>
        <meta name="description"
          content="Subscription and sign-up page for English Vocabulary Exercises. There are pricing and description for the three forms of subscription."
        />
        <meta property="og:title" content="Subscription - English Vocabulary Exercises" />
        <meta property="og:description" content="Subscription and sign-up page for English Vocabulary Exercises. There are pricing and description for the three forms of subscription." />
        <link rel="canonical" href={`https://www.englishvocabularyexercises.com${window.location.pathname}`} />
        <title>Subscription - English Vocabulary Exercises</title>
      </Helmet>

      <div className="subscription-page__wrapper page-wrapper">
        <h1 className="subscription-page__heading">Subscription</h1>

        { auth.uid && !auth.emailVerified &&
          <div className="subscription-page__unverified">
            <h3>
              <span><FontAwesomeIcon icon={faExclamationTriangle} /></span>
              You are now signed up!
              Please go to your email and click on the verification link.
            </h3>
            <p>If you don't see the verification email, please check your junk mail or spam folder.</p>
          </div>
        }

        { subscription && !subscription.includes('Institutional ') &&
            <div className="subscription-page__subscribed">
              <h3>
                <span><FontAwesomeIcon icon={faCheckCircle} /></span>
                {
                    subscription.includes('Institutional-')
                      ? 'You now have access to both Academic and General categories. Start growing your English vocabulary today!'
                      : `You are now subscribed to ${subscription}. Start growing your English vocabulary today!`
                }
              </h3>
            </div>
        }

        <Subscribe />

        { (!auth.uid || !subscription) &&
          <div className="subscription-page__actions">
            <Instructions auth={auth} subscription={subscription} />
            {!auth.uid && <RegisterForm /> }
          </div>
        }

        <div className="subscription-page__actions">
          <InstitutionalSubscribe auth={auth} subscription={subscription} />
          {(!subscription || subscription.includes('Institutional')) && <AccessCode auth={auth} subscription={subscription} />}
        </div>
      </div>
    </section>
  )
}

export default Subscription;
