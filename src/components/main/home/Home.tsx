import React from 'react';
import HomeContent from './home-content/HomeContent';
import { HomeLanguage } from '../../models/models';
import './Home.scss';
import Loading from '../../general/loading/Loading';

interface HomeProps {
  activeLanguage: HomeLanguage|null
}

const Home = ({ activeLanguage }: HomeProps): JSX.Element => {
  return (
    <section className="home">
      { activeLanguage ? <HomeContent activeLanguage={activeLanguage} /> : <Loading /> }
    </section>
  )
}

export default Home;
