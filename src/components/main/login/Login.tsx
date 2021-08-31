import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../../store/reducers/rootReducer';
import { Redirect } from 'react-router-dom';
import LoginForm from './LoginForm/LoginForm';
import './Login.scss';

const Login = (): JSX.Element => {
  const auth = useSelector((state: RootState) => state.firebase.auth, shallowEqual);

  if(!auth.isLoaded) {
    return <></>;
  }
  if(auth.uid) {
    return <Redirect to='/' />
  }

  return (
    <section className="login-page">
      <div className="login-page__wrapper page-wrapper">
        <LoginForm />
        <div className="login-page__link-container">
          <div className="login-page__link">
            <Link to="/subscription">Don't have an account? Register here.</Link>
          </div>
          <div className="login-page__link">
            <Link to="/forgot-password">Forgot your password?</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login;
