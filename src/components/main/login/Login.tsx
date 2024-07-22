import React, { useContext } from 'react';
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
