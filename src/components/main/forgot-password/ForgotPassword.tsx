import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { useForm } from 'react-hook-form';

import firebase from '../../../config/firebaseConfig';
import { RootState } from '../../../store/reducers/rootReducer';
import { Redirect } from 'react-router-dom';
import './ForgotPassword.scss';

const ForgotPassword = (): JSX.Element => {
  const auth = useSelector((state: RootState) => state.firebase.auth, shallowEqual);

  const [resetResponse, setResetResponse] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, errors } = useForm();

  if(!auth.isLoaded) {
    return <></>;
  }
  if (auth.uid) return <Redirect to='/' />

  const onSubmit = (data: any) : void => {
    setSubmitting(true);
    setResetResponse('');
    firebase.auth().sendPasswordResetEmail(data.email).then(() => {
      setResetResponse('success');
      setSubmitting(false);
    }).catch((error: {message: string}) => {
      setResetResponse(error.message);
      setSubmitting(false);
    });
  }

  return (
    <section className="register-page">
      <div className="register-page__wrapper page-wrapper">
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

        <div className="register-page__register-container">
          <Link to="/login">Know your password? Log in here.</Link>
        </div>
      </div>
    </section>
  )
}

export default ForgotPassword;
