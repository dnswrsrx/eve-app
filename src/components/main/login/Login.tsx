import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../Main';
import LoginForm from './LoginForm/LoginForm';
import './Login.scss';

const Login = (): JSX.Element => {
  const auth = useContext(AuthContext);

  if (auth.uid) return <Navigate to='/' />;

  return (
    <section className="login-page page-wrapper">
      <Helmet>
        <meta name="description"
          content="Login page for English Vocabulary Exercises."
        />
        <meta property="og:title" content="Log In - English Vocabulary Exercises" />
        <meta property="og:description" content="Login page for English Vocabulary Exercises." />
        <link rel="canonical" href={`https://www.englishvocabularyexercises.com${window.location.pathname}`} />
        <title>Log In - English Vocabulary Exercises</title>
      </Helmet>

      <LoginForm />
      <div className="login-page__link-container">
        <div className="login-page__link">
          <Link to="/subscription">Don't have an account? Register here.</Link>
        </div>
        <div className="login-page__link">
          <Link to="/forgot-password">Forgot your password?</Link>
        </div>
      </div>
    </section>
  )
}

export default Login;
