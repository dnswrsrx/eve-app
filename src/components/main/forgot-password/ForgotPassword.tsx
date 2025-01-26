import React, { useContext, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../../config/firebaseConfig';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Main';
import './ForgotPassword.scss';

const ForgotPassword = (): JSX.Element => {
  const auth = useContext(AuthContext);

  const [resetResponse, setResetResponse] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  if (auth.uid) return <Navigate to='/' />;

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
    <section className="register-page page-wrapper">
      <Helmet>
        <meta name="description"
          content="Password reset page for English Vocabulary Exercises."
        />
        <meta property="og:title" content="Forgot Password - English Vocabulary Exercises" />
        <meta property="og:description" content="Password reset page for English Vocabulary Exercises." />
        <title>Forgot Password - English Vocabulary Exercises</title>
      </Helmet>

      <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
        <h2 className="register-form__heading">Reset Your Password</h2>
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
    </section>
  )
}

export default ForgotPassword;
