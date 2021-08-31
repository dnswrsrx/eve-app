import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import firebase from '../../../../config/firebaseConfig';
import './ForgotPassword.scss';

const RegisterForm = (): JSX.Element => {
  const [resetResponse, setResetResponse] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    firebase.auth().sendPasswordResetEmail(data.email).then(() => {
      setResetResponse('success');
      setSubmitting(false);
    }).catch((error: {message: string}) => {
      setResetResponse(error.message);
      setSubmitting(false);
    });
  }

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="register-form__heading">Reset Your Password</h2>
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
      { resetResponse && 
        resetResponse === 'success'
          ? <p className="register-form_success success">A password reset link has been sent. Please check your email.</p>
          : <p className="register-form__error error">{ resetResponse }</p>
      }
      <div className="register-form__row">
        { submitting && <span className="register-form__spinner" aria-hidden="true"></span> }
        <button className="register-form__submit" type="submit" disabled={submitting}>Request Link</button>
      </div>
    </form>
  )
}

export default RegisterForm;
