import React, { useState, useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Navigate } from 'react-router-dom';
import firebase from '../../../config/firebaseConfig';
import useSubscription from '../utils/UserSubscriptionHook';
import useCartOrPortalHook from '../utils/subscribe/CartOrPortalHook';
import { AuthContext } from '../Main';
import './MyAccount.scss';


const MyAccount = (): JSX.Element => {

  const auth = useContext(AuthContext);

  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors }, watch, reset, formState: { isDirty } } = useForm();

  const [verificationError, setVerificationError] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);

  const subscription = useSubscription();
  const { cartOrPortal, loadingCartOrPortal, error } = useCartOrPortalHook();

  const createdDate = new Date(parseInt(auth.createdAt));

  const password = watch('password');
  const newPassword = watch('changePassword');
  const confirmation = watch('confirmPassword');

  useEffect(() => {
    if (isDirty) {
      setAuthError('');
      setAuthSuccess('');
    }
  }, [isDirty])

  if (!auth.uid) return <Navigate to='/' />;

  const onSubmit = (data: any) : void => {

    const password = data['password']
    const newPassword = data['changePassword'];
    const newPasswordConfirmation = data['confirmPassword'];

    if (password && newPassword && newPasswordConfirmation && newPassword === newPasswordConfirmation && auth.email) {
      setSubmitting(true);

      firebase.auth().signInWithEmailAndPassword(auth.email, password).then((credentials: firebase.auth.UserCredential) => {
        const user = credentials.user;
        if (user) {
          setSubmitting(true);
          user.updatePassword(newPassword).then(() => {
            setAuthError('');
            reset();
            setAuthSuccess('Password changed successfully.');
          }).catch((error: {message: string}) => {
            setAuthSuccess('');
            setAuthError(error.message)
          }).finally(() => setSubmitting(false))
        } else {
          setAuthSuccess('');
          setAuthError('Failed to log in with the credentials provided.');
          setSubmitting(false);
        }
      }).catch((error) => {
        setAuthSuccess('');
        setAuthError(error.code === 'auth/wrong-password' ? 'Wrong current password.' : error.message);
        setSubmitting(false);
      })
    }
  }

  const resendVerification = (): void => {
    setVerificationSubmitting(true);
    firebase.auth().currentUser?.sendEmailVerification()
      .then(() => setVerificationSuccess(true))
      .catch(e => {
        console.log(e);
        setVerificationError(true);
      })
      .finally(() => setVerificationSubmitting(false))
  }

  return (
    <section className="account-page">
      <div className="account-page__wrapper page-wrapper">
        <h1 className="account-page__heading">{'Welcome Back' + (auth.displayName ? ` ${auth.displayName}` : '!')}</h1>
        <div className="account-page__overview">
          <p>
            This is where you can find information about your account or update your profile.
          </p>
        </div>

        <div className="account-page__form">
          <h2>Account Details</h2>
          <form className="account-page__containers" onSubmit={handleSubmit(onSubmit)}>

            <div className="account-page__container">
              <div className="account-page__row">
                <h3 className="account-page__row-heading">Email:</h3>
                <p>{auth.email}</p>
              </div>
              <div className="account-page__row">
                <h3 className="account-page__row-heading">Email Verified:</h3>
                {
                  verificationSuccess
                    ? <p className="success">Email verification re-sent</p>
                    : <p>{auth.emailVerified ? 'Verified' : 'Not Verified'}</p>
                }

                { verificationError && <p className="error">Something went wrong. Please refresh the page and try again.</p> }
                { !auth.emailVerified && !verificationSuccess && (
                    <button type="button" className="account-page__verification" onClick={resendVerification} disabled={verificationSubmitting}>
                      { verificationSubmitting ? <span className="account-page__spinner" aria-hidden="true"></span> : 'Re-send Verification' }
                    </button> )}
              </div>
              <div className="account-page__row">
                <h3 className="account-page__row-heading">Member Since:</h3>
                <p>{createdDate.toDateString()}</p>
              </div>
            </div>

            <div className="account-page__container" onSubmit={handleSubmit(onSubmit)}>
              <div className="account-page__row">
                <label className="account-page__form-label" htmlFor="displayName">Current Password:</label>
                <input
                  id="password"
                  className={ errors.password ? 'account-page__input error' : 'account-page__input' }
                  autoComplete="off"
                  type="password"
                  {...register('password')}
                />
                { errors.password?.message && <p className="account-page__error error">{ errors.password.message?.toString() }</p> }
              </div>
              <div className="account-page__row">
                <label className="account-page__form-label" htmlFor="displayName">New Password:</label>
                <input
                  id="changePassword"
                  className={ errors.changePassword ? 'account-page__input error' : 'account-page__input' }
                  autoComplete="new-password"
                  type="password"
                  {...register('changePassword')}
                />
                { errors.changePassword?.message && <p className="account-page__error error">{ errors.changePassword.message.toString() }</p> }
              </div>
              <div className="account-page__row">
                <label className="account-page__form-label" htmlFor="changePassword">Confirm New Password:</label>
                <input
                  id="confirmPassword"
                  className={ errors.confirmPassword ? 'account-page__input error' : 'account-page__input' }
                  autoComplete="new-password"
                  type="password"
                  {...register('confirmPassword', { validate: (value) => value === getValues('changePassword') || 'Please enter matching passwords.' })}
                />
                { errors.confirmPassword?.message && <p className="account-page__error error">{ errors.confirmPassword.message.toString() }</p> }
              </div>
              { authError && <p className="account-page__error error">{ authError }</p> }
              { authSuccess && <p className="account-page__success success">{ authSuccess }</p> }
              { submitting && <span className="account-page__spinner" aria-hidden="true"></span> }
            </div>
            <button className="account-page__submit" type="submit" disabled={submitting || !password || !newPassword || !confirmation }>Update Password</button>
          </form>

          { subscription && !subscription.includes('Institutional-') &&
          <div className="account-page__portal">
            <h2>Subscription</h2>
            <p>
              Navigate to your Customer Portal to manage your subscription.
              You may switch or cancel your subscription, and update your payment details.
              If you have an Institutional Subscription, you may update your quantities as well.
            </p>

            <button
              className="account-page__manage"
              disabled={!!loadingCartOrPortal}
              onClick={cartOrPortal()}
            >
              { !!loadingCartOrPortal ? 'Loading portal...' : 'Manage your subscription' }
              { !!loadingCartOrPortal && <span className="account-page__spinner"></span>}

            </button>

            { error && <p className="error">Failed to load the Customer Portal. Please refresh the page and try again.</p> }
          </div>
          }
        </div>
      </div>
    </section>
  )
}

export default MyAccount;
