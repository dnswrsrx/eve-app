import React from 'react';
import { Link } from 'react-router-dom';
import './Home.scss';

const Home = (): JSX.Element => {
  return (
    <section className="admin-home">
      <div className="admin-home__wrapper page-wrapper">
        <h1 className="admin-home__heading">Welcome to the Admin Dashboard!</h1>
        <p className="admin-home__description">Please select what you would like to edit.</p>
        <div className="admin-home__link-list">
          <Link className="admin-home__link-card" to="/admin-dashboard/home-languages">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/home.svg)' }} />
            <h2 className="admin-home__card-heading">Home Page</h2>
          </Link>
          <Link className="admin-home__link-card" to="/admin-dashboard/word-categories">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/category.svg)' }} />
            <h2 className="admin-home__card-heading">Word Categories</h2>
          </Link>
          {/* <Link className="admin-home__link-card" to="/admin-dashboard/weekly-study-guides">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/study.svg)' }} />
            <h2 className="admin-home__card-heading">Weekly Study Guides</h2>
          </Link> */}
          <Link className="admin-home__link-card" to="/admin-dashboard/pages">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/private.svg)' }} />
            <h2 className="admin-home__card-heading">Private Pages</h2>
          </Link>
          <Link className="admin-home__link-card" to="/admin-dashboard/privacy-policy">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/privacy_policy.svg)' }}></div>
            <h2 className="admin-home__card-heading">Privacy Policy</h2>
          </Link>
          <Link className="admin-home__link-card" to="/admin-dashboard/teacher-notes">
            <div className="admin-home__card-image" style={{ backgroundImage: 'url(/images/education.svg)' }}></div>
            <h2 className="admin-home__card-heading">Note to Teachers</h2>
          </Link>

        </div>
      </div>
    </section>
  )
}

export default Home;
