import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FirebaseReducer } from 'react-redux-firebase';
import firebase from '../../../../config/firebaseConfig';
import './AccountForm.scss';

interface AccountFormProps {
  auth: FirebaseReducer.AuthState,
}

const AccountForm = ({ auth }: AccountFormProps): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, errors, watch, reset, formState: { isDirty } } = useForm();

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

  return (
    <div className="account-form">
      <h2 className="account-form__heading">Account Details</h2>
      <form className="account-form__containers" onSubmit={handleSubmit(onSubmit)}>

        <div className="account-form__container">
          <div className="account-form__row">
            <h3 className="account-form__row-heading">Email:</h3>
            <p>{auth.email}</p>
          </div>
          <div className="account-form__row">
            <h3 className="account-form__row-heading">Email Verified:</h3>
            <p>{auth.emailVerified ? 'Verified' : 'Not Verified'}</p>
          </div>
          <div className="account-form__row">
            <h3 className="account-form__row-heading">Member Since:</h3>
            <p>{createdDate.toDateString()}</p>
          </div>
        </div>

        <div className="account-form__container" onSubmit={handleSubmit(onSubmit)}>
          <div className="account-form__row">
          <label className="account-form__form-label" htmlFor="displayName">Current Password:</label>
            <input
              id="password"
              className={ errors.password ? 'account-form__input error' : 'account-form__input' }
              autoComplete="off"
              name="password"
              type="password"
              ref={register()}
            />
            { errors.password && <p className="account-form__error error">{ errors.changePassword.message }</p> }
          </div>
          <div className="account-form__row">
            <label className="account-form__form-label" htmlFor="displayName">New Password:</label>
            <input
              id="changePassword"
              className={ errors.changePassword ? 'account-form__input error' : 'account-form__input' }
              autoComplete="new-password"
              name="changePassword"
              type="password"
              ref={register()}
            />
            { errors.changePassword && <p className="account-form__error error">{ errors.changePassword.message }</p> }
          </div>
          <div className="account-form__row">
            <label className="account-form__form-label" htmlFor="changePassword">Confirm New Password:</label>
            <input
              id="confirmPassword"
              className={ errors.confirmPassword ? 'account-form__input error' : 'account-form__input' }
              autoComplete="new-password"
              name="confirmPassword"
              type="password"
              ref={register({ validate: (value) => value === getValues('changePassword') || 'Please enter matching passwords.' })}
            />
            { errors.confirmPassword && <p className="account-form__error error">{ errors.confirmPassword.message }</p> }
          </div>
              { authError && <p className="account-form__error error">{ authError }</p> }
              { authSuccess && <p className="account-form__success success">{ authSuccess }</p> }
              { submitting && <span className="account-form__spinner" aria-hidden="true"></span> }
        </div>
        <button className="account-form__submit" type="submit" disabled={submitting || !password || !newPassword || !confirmation }>Update Password</button>
      </form>
    </div>
  )
}

export default AccountForm;
