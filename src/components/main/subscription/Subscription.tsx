import React, { useContext } from 'react';

import Instructions from './Instructions/Instructions';
import RegisterForm from './RegisterForm/RegisterForm';

import useSubscription from '../../../utils/userSubscription';
import { AuthContext } from '../Main';

import Subscribe from '../utils/subscribe/Subscribe';
import './Subscription.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';


const Subscription = (): JSX.Element => {

  const auth = useContext(AuthContext);
  const subscription  = useSubscription();

  return (
    <section className="subscription-page">
      <div className="subscription-page__wrapper page-wrapper">
        <h1 className="subscription-page__heading">Subscription</h1>

        <Subscribe />

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

        { subscription &&
            <div className="subscription-page__subscribed">
              <h3>
                <span><FontAwesomeIcon icon={faCheckCircle} /></span>
                You are now subscribed to { subscription }.
                Start growing your English vocabulary today!
              </h3>
            </div>
        }

        { (!auth.uid || !subscription) &&
          <div className={`subscription-page__${auth.uid ? 'instructions' : 'register'}`}>
            <Instructions auth={auth} subscription={subscription} />
            {!auth.uid && <RegisterForm /> }
          </div>
        }
      </div>
    </section>
  )
}

export default Subscription;
