import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PageNotFound.scss';

const PageNotFound = (): JSX.Element => {
  const navigate = useNavigate()

  const p = window.location.pathname

  if (p === '/index.html' || p === '/index.htm' || p === '/index') {
    navigate('/')
  } else if (p.includes('/eve-exercises') || p.includes('/general-vocabulary')) {
    navigate('/subcategories/0zwuF8q0eHklNDFZJAH9')
  } else if (p.includes('/academic-word-list') || p.includes('/AWL')) {
    navigate('/subcategories/VQvdu2OoscCzjxPk1C5s')
  }

  return (
    <section className="page-not-found">
      <div className="page-not-found__wrapper page-wrapper">
        <h1 className="page-not-found__message">This page does not exist.</h1>
      </div>
    </section>
  )
}

export default PageNotFound;
