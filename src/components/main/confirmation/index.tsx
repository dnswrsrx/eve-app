import React, { useState, useEffect } from 'react';
import firebase from '../../../config/firebaseConfig';
import PWReset from './PWResetForm'
import './confirmation.scss';

// Docs for email action handlers
// https://firebase.google.com/docs/auth/custom-email-handler#web-namespaced-api_2


const Confirmation = (): JSX.Element => {

  const params = new URLSearchParams(window.location.search);
  const mode = params.get('mode');
  const oobCode = params.get('oobCode') || '';
  const isApp = params.get('apiKey') === process.env.REACT_APP_FIREBASE_KEY;

  const auth = firebase.auth();

  const [header, setHeader] = useState('Information Confirmation');
  const [body, setBody] = useState('<p>No information provided to confirm. You will be redirected shortly...</p>');

  const [email, setEmail] = useState('');

  useEffect(() => {
    if (mode === 'verifyEmail' && oobCode.length > 0 && isApp) {
      setHeader('Email Verification')
      setBody('<p>Verifying email...</p>');

      auth.applyActionCode(oobCode)
        .then(() => {
          setBody('<p>Email verification successful. You will be redirected shortly...</p>');
          setTimeout(() => window.location.href = '/subscription', 3000);
        })
        .catch(err => {
          if ((err.code || '').includes('-action-code')) {
            setBody('<p>Invalid link. Please visit <a href="/my-account">My Account</a> to send a new verification link.</p>');
          } else {
            setBody('<p>No account found. You will be redirected shortly...</p>')
            setTimeout(() => window.location.href = '/', 3000);
          }
        });

    } else if (mode === 'resetPassword' && oobCode.length > 0 && isApp) {
      setHeader('Password Reset');
      setBody('<p>You may reset your password using the form below.</p>')

      auth.verifyPasswordResetCode(oobCode)
        .then(email => setEmail(email))
        .catch(err => {
          if ((err.code || '').includes('-action-code')) {
            setBody('<p>Invalid link. Please visit the <a href="/login">Login page</a> and click the <strong>Forgot your password?</strong> link again.</p>');
          } else {
            setBody('<p>No account found. You will be redirected shortly...</p>')
            setTimeout(() => window.location.href = '/', 3000);
          }
        })

    } else {
      setTimeout(() => window.location.href = '/', 3000);
    }
  }, [])

  return (
    <section className="confirmation__wrapper page-wrapper">
      <h1 className="confirmation__header">{ header }</h1>
      <div dangerouslySetInnerHTML={{__html: body}} />
      { (header === 'Password Reset' && email.length > 0) && <PWReset oobCode={oobCode} auth={auth} email={email} /> }
    </section>
  )
}

export default Confirmation;
