import React from 'react';
import { Helmet } from 'react-helmet';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { CollectionNames, Category } from '../../models/models';
import Loading from '../../general/loading/Loading';
import CategoryCard from './category-card/CategoryCard';
import Ads from '../ads/Ads';
import './WordCategories.scss';

const WordCategories = (): JSX.Element => {
  useFirestoreConnect([
    { collection: CollectionNames.Categories, orderBy: ['name', 'desc'] },
  ]);

  const topLevelCategories = useSelector(({ firestore: { ordered } }: any) => ordered[CollectionNames.Categories], isEqual);

  if(!isLoaded(topLevelCategories)) return <Loading />;

  const renderCategories = (): JSX.Element[] => {
    return topLevelCategories.map((category: Category): JSX.Element => (
      <li key={category.id}>
        <CategoryCard category={category} />
      </li>
    ));
  }

  return (
    <section className="word-categories">
      <Helmet>
        <meta name="description"
          content="Word categories for English Vocabulary Exercises. There are two main categories the words and exercises are broadly organised in."
        />
        <meta property="og:title" content="Word Categories - English Vocabulary Exercises" />
        <meta property="og:description" content="Word categories for English Vocabulary Exercises. There are two main categories the words and exercises are broadly organised in." />
        <link rel="canonical" href={`https://www.englishvocabularyexercises.com${window.location.pathname}`} />
        <title>Word Categories - English Vocabulary Exercises</title>
      </Helmet>

      <div className="word-categories__wrapper page-wrapper">
        <h1 className="word-categories__heading">Word Categories</h1>
        <p className="word-categories__description">
          Please select a category.
        </p>
        {
          topLevelCategories.length
            ? <ul className="word-categories__category-list">
                { renderCategories() }
              </ul>
            : <p>There are no categories to display.</p>
        }
        <Ads slot="6473651538" />
      </div>
    </section>
  )
}

export default WordCategories;
