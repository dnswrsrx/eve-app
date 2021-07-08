import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FirebaseReducer } from 'react-redux-firebase';
import firebase from '../../../../config/firebaseConfig';
import moment from 'moment';
import './AccountForm.scss';

interface AccountFormProps {
  auth: FirebaseReducer.AuthState,
}

const AccountForm = ({ auth }: AccountFormProps): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, errors } = useForm();

  const createdDate = new Date(parseInt(auth.createdAt));

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    setSubmitting(false);
  }

  return (
    <form className="account-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="account-form__heading">Account Details</h2>
      <div className="account-form__field-containers">
        <div className="account-form__row">
          <h3 className="account-form__row-heading">Member Since:</h3>
          <p>{moment(createdDate).format('LLLL')}</p>
        </div>
        <div className="account-form__row">
          <h3 className="account-form__row-heading">Email Verified:</h3>
          <p>{auth.emailVerified ? 'Verified' : 'Not Verified'}</p>
        </div>
        <div className="account-form__row">
          <h3 className="account-form__row-heading">Email:</h3>
          <p>{auth.email}</p>
        </div>
        <div className="account-form__row">
          <label className="account-form__form-label" htmlFor="displayName">Display Name:</label>
          <input
            id="displayName"
            className={ errors.displayName ? 'account-form__input error' : 'account-form__input' }
            name="displayName"
            type="text"
            ref={register({ required: 'Please enter a valid display name.' })}
          />
          { errors.displayName && <p className="account-form__error error">{ errors.displayName.message }</p> }
        </div>
        <div className="account-form__row">
          <label className="account-form__form-label" htmlFor="displayName">New Password:</label>
          <input
            id="changePassword"
            className={ errors.changePassword ? 'account-form__input error' : 'account-form__input' }
            name="changePassword"
            type="password"
            ref={register()}
          />
          { errors.changePassword && <p className="account-form__error error">{ errors.changePassword.message }</p> }
        </div>
        <div className="account-form__row">
          <label className="account-form__form-label" htmlFor="changePassword">Confirm Password:</label>
          <input
            id="confirmPassword"
            className={ errors.confirmPassword ? 'account-form__input error' : 'account-form__input' }
            name="confirmPassword"
            type="password"
            ref={register({ validate: (value) => value === getValues('changePassword') || 'Please enter matching passwords.' })}
          />
          { errors.confirmPassword && <p className="account-form__error error">{ errors.confirmPassword.message }</p> }
        </div>
      </div>
      { authError && <p className="account-form__error error">{ authError }</p> }
      <div className="account-form__submit-row">
        { submitting && <span className="account-form__spinner" aria-hidden="true"></span> }
        <button className="account-form__submit" type="submit" disabled={submitting}>Save Changes</button>
      </div>
    </form>
  )
}

export default AccountForm;
