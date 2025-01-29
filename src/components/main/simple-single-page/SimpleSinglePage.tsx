import React from 'react';
import { Helmet } from 'react-helmet';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { isEqual } from 'lodash';

import Loading from '../../general/loading/Loading';
import PageNotFound from '../../general/404/PageNotFound';

import {CollectionNames} from '../../models/models';
import {useSelector} from 'react-redux';

import './SimpleSinglePage.scss'

const SimpleSinglePage = (): JSX.Element => {

  const page = window.location.pathname.includes('/terms-of-use') ? 'Terms of Use' : window.location.pathname.includes('/teacher-notes') ? 'Note to Teachers' : '';

  useFirestoreConnect([
    { collection:  CollectionNames.Pages, where:['name', '==', page], storeAs: 'page' }
  ])

  const pageContent = useSelector(({ firestore: { ordered } }: any) => ordered['page'], isEqual);

  if (!isLoaded(pageContent)) return <Loading />;

  if (!pageContent || !pageContent[0]) return <PageNotFound />;

  const isTermsPage = window.location.pathname === '/terms-of-use';

  return (
    <div className="ssp">
      <Helmet>
        <meta name="description"
          content={isTermsPage ? "Terms of use for English Vocabulary Exercises. Contains info about the services the site uses and some additional terms regarding subscriptions." : "Curated collection of fill-in-the-blank exercises to expand your English vocabulary. The vocabulary are broadly categorised into general and academic use-cases."}
        />
        <meta property="og:title" content={`${isTermsPage ? 'Terms of Use - ' : ''}English Vocabulary Exercises`} />
        <meta property="og:description" content={isTermsPage ? "Terms of use for English Vocabulary Exercises. Contains info about the services the site uses and some additional terms regarding subscriptions." : "Curated collection of fill-in-the-blank exercises to expand your English vocabulary. The vocabulary are broadly categorised into general and academic use-cases."} />
        <link rel="canonical" href={`https://www.englishvocabularyexercises.com${window.location.pathname}`} />
        <title>{isTermsPage ? 'Terms of Use - ' : ''}English Vocabulary Exercises</title>
      </Helmet>
      <div className="ssp__wrapper page-wrapper">
        <div className="ssp__main-content" dangerouslySetInnerHTML={{ __html: pageContent[0].mainContent }}></div>
      </div>
    </div>
  )
}

export default SimpleSinglePage;
