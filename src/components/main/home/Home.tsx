import React from 'react';
import HomeContent from './home-content/HomeContent';
import { HomeLanguage } from '../../models/models';
import './Home.scss';

interface HomeProps {
  activeLanguage: HomeLanguage|null
}

const Home = ({ activeLanguage }: HomeProps): JSX.Element => {
  return (
    <section className="home">
      { <HomeContent activeLanguage={activeLanguage} /> }
    </section>
  )
}

export default Home;
