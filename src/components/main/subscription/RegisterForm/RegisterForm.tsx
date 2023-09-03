import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import './RegisterForm.scss';

const RegisterForm = (): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, formState: { errors } } = useForm();

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    firebase.auth().createUserWithEmailAndPassword(data.email, data.password).then((response: any) => {
      response.user.sendEmailVerification();
      setSubmitting(false);
    }).catch((error: {message: string}) => {
      setAuthError(error.message);
      setSubmitting(false);
    });
  }

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="register-form__heading">Sign Up</h2>
      <div className="register-form__row">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          className={ errors.email ? 'register-form__input error' : 'register-form__input' }
          type="text"
          {...register('email', { required: 'Please enter an email address.' })}
        />
        { errors.email?.message && <p className="register-form__error error">{ errors.email.message.toString() }</p> }
      </div>
      <div className="register-form__row">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          className={ errors.password ? 'register-form__input error' : 'register-form__input' }
          type="password"
          {...register('password', { required: 'Please enter a password.' })}
        />
        { errors.password?.message && <p className="register-form__error error">{ errors.password.message.toString() }</p> }
      </div>
      <div className="register-form__row">
        <label htmlFor="confirm">Confirm Password:</label>
        <input
          id="confirm"
          className={ errors.confirm ? 'register-form__input error' : 'register-form__input' }
          type="password"
          {...register('confirm', { validate: (value) => value === getValues('password') || 'Please enter matching passwords.' })}
        />
        { errors.confirm?.message && <p className="register-form__error error">{ errors.confirm.message.toString() }</p> }
      </div>
      { authError && <p className="register-form__error error">{ authError }</p> }
      <div className="register-form__row">
        { submitting && <span className="register-form__spinner" aria-hidden="true"></span> }
        <button className="register-form__submit" type="submit" disabled={submitting}>Sign Up</button>
      </div>
      <div className="register-form__login">
        <Link to="/login">Already have an account? Log in here.</Link>
      </div>
      </form>
  )
}

export default RegisterForm;
