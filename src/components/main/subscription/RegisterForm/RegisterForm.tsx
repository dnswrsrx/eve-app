import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import './RegisterForm.scss';

const RegisterForm = (): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, getValues, errors } = useForm();

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
      <h2 className="register-form__heading">Register</h2>
      <div className="register-form__row">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          className={ errors.email ? 'register-form__input error' : 'register-form__input' }
          name="email"
          type="text"
          ref={register({ required: 'Please enter an email address.' })}
        />
        { errors.email && <p className="register-form__error error">{ errors.email.message }</p> }
      </div>
      <div className="register-form__row">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          className={ errors.password ? 'register-form__input error' : 'register-form__input' }
          name="password"
          type="password"
          ref={register({ required: 'Please enter a password.' })}
        />
        { errors.password && <p className="register-form__error error">{ errors.password.message }</p> }
      </div>
      <div className="register-form__row">
        <label htmlFor="confirm">Confirm Password:</label>
        <input
          id="confirm"
          className={ errors.confirm ? 'register-form__input error' : 'register-form__input' }
          name="confirm"
          type="password"
          ref={register({ validate: (value) => value === getValues('password') || 'Please enter matching passwords.' })}
        />
        { errors.confirm && <p className="register-form__error error">{ errors.confirm.message }</p> }
      </div>
      { authError && <p className="register-form__error error">{ authError }</p> }
      <div className="register-form__row">
        { submitting && <span className="register-form__spinner" aria-hidden="true"></span> }
        <button className="register-form__submit" type="submit" disabled={submitting}>Register</button>
      </div>
      <div className="register-form__login">
        <Link to="/login">Already have an account? Log in here.</Link>
      </div>
      </form>
  )
}

export default RegisterForm;
