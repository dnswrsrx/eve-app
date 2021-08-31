import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import './LoginForm.scss';

const LoginForm = (): JSX.Element => {
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then((user: any) => {
      setSubmitting(false);
    }).catch((error: {message: string}) => {
      setAuthError(error.message);
      setSubmitting(false);
    });
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="login-form__heading">Log In</h2>
      <div className="login-form__row">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          className={ errors.email ? 'login-form__input error' : 'login-form__input' }
          name="email"
          type="text"
          ref={register({ required: 'Please enter an email address.' })}
        />
        { errors.email && <p className="login-form__error error">{ errors.email.message }</p> }
      </div>
      <div className="login-form__row">
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          className={ errors.password ? 'login-form__input error' : 'login-form__input' }
          name="password"
          type="password"
          ref={register({ required: 'Please enter your password.' })}
        />
        { errors.password && <p className="login-form__error error">{ errors.password.message }</p> }
      </div>
      { authError && <p className="login-form__error error">{ authError }</p> }
      <div className="login-form__row">
        { submitting && <span className="login-form__spinner" aria-hidden="true"></span> }
        <button className="login-form__submit" type="submit" disabled={submitting}>Log In</button>
      </div>
    </form>
  )
}

export default LoginForm;
