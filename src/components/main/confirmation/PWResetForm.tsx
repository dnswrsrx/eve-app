import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../../config/firebaseConfig';

interface RegisterFormProps {
  oobCode: string;
  auth: firebase.auth.Auth;
  email: string;
}

const PWReset = ({ oobCode, auth, email }: RegisterFormProps): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const onSubmit = (data: any) : void => {
    setSubmitting(true);

    auth.confirmPasswordReset(oobCode, data.password).then(() => {
      setSuccess(true);
      setTimeout(() => window.location.href = '/login', 3000);
    })
      .catch((error: { message: string }) => setAuthError(error.message))
      .finally(() => setSubmitting(false))
  }

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="register-form__row">
        <label htmlFor="email">Email:</label>
        <p>{ email }</p>
      </div>
      <div className="register-form__row">
        <label htmlFor="password">New Password:</label>
        <input
          id="password"
          className={ errors.password ? 'register-form__input error' : 'register-form__input' }
          type="password"
          {...register('password', { required: 'Please enter a password.' })}
        />
        { errors.password?.message && <p className="register-form__error error">{ errors.password.message.toString() }</p> }
      </div>
      <div className="register-form__row">
        <label htmlFor="confirm">Confirm New Password:</label>
        <input
          id="confirm"
          className={ errors.confirm ? 'register-form__input error' : 'register-form__input' }
          type="password"
          {...register('confirm', { validate: (value) => value === getValues('password') || 'Please enter matching passwords.' })}
        />
        { errors.confirm?.message && <p className="register-form__error error">{ errors.confirm.message.toString() }</p> }
      </div>

      { authError && <p className="register-form__error error">{ authError }</p> }
      { success && <p className="success">Password reset successful. Redirecting to login page shortly...</p> }

      <div className="register-form__row">
        <button className="register-form__submit" type="submit" disabled={submitting || success}>
          { submitting ? <span className="register-form__spinner" aria-hidden="true"></span> : 'Reset' }
        </button>
      </div>
      <div className="register-form__login">
        <Link to="/login">Remembered your password? Log in here.</Link>
      </div>
      </form>
  )
}

export default PWReset;
