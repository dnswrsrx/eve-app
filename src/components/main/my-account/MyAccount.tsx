import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { AuthContext } from '../Main';
import AccountForm from './AccountForm/AccountForm';
import SubscriptionForm from './SubscriptionForm/SubscriptionForm';
import './MyAccount.scss';

const MyAccount = (): JSX.Element => {
  const auth = useContext(AuthContext);

  if (!auth.uid) return <Redirect to='/' />

  return (
    <section className="account-page">
      <div className="account-page__wrapper page-wrapper">
        <h1 className="account-page__heading">{'Welcome Back' + (auth.displayName ? ` ${auth.displayName}` : '!')}</h1>
        <div className="account-page__overview">
          <p>
            This is where you can find information about your account or update your profile.
          </p>
        </div>
        <AccountForm auth={auth} />
        <SubscriptionForm auth={auth}/>
      </div>
    </section>
  )
}

export default MyAccount;
