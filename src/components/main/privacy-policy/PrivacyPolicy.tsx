import React from 'react';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { isEqual } from 'lodash';

import Loading from '../../general/loading/Loading';
import PageNotFound from '../../general/404/PageNotFound';

import {CollectionNames} from '../../models/models';
import {useSelector} from 'react-redux';

import './PrivacyPolicy.scss'

const PrivacyPolicy = (): JSX.Element => {
  useFirestoreConnect([
    { collection:  CollectionNames.Pages, where:['name', '==', 'Privacy Policy'], storeAs: 'page' }
  ])

  const pageContent = useSelector(({ firestore: { ordered } }: any) => ordered['page'], isEqual);

  if (!isLoaded(pageContent)) return <Loading />;

  if (!pageContent || !pageContent[0]) return <PageNotFound />;

  return (
    <div className="privacy-policy">
      <div className="privacy-policy__wrapper page-wrapper">
        <div className="privacy-policy__main-content" dangerouslySetInnerHTML={{ __html: pageContent[0].mainContent }}></div>
      </div>
    </div>
  )
}

export default PrivacyPolicy;
