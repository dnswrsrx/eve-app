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

        <div className={`subscription-page__${auth.uid ? 'instructions' : 'register'}`}>
          <Instructions auth={auth} subscription={subscription} />
          {!auth.uid && <RegisterForm /> }
        </div>
      </div>
    </section>
  )
}

export default Subscription;
