import React from 'react';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { isEqual } from 'lodash';

import Loading from '../../general/loading/Loading';
import PageNotFound from '../../general/404/PageNotFound';

import {CollectionNames} from '../../models/models';
import {useSelector} from 'react-redux';

import './SimpleSinglePage.scss'

const SimpleSinglePage = (): JSX.Element => {

  const page = window.location.pathname.includes('/privacy-policy') ? 'Privacy Policy' : window.location.pathname.includes('/teacher-notes') ? 'Note to Teachers' : '';

  useFirestoreConnect([
    { collection:  CollectionNames.Pages, where:['name', '==', page], storeAs: 'page' }
  ])

  const pageContent = useSelector(({ firestore: { ordered } }: any) => ordered['page'], isEqual);

  if (!isLoaded(pageContent)) return <Loading />;

  if (!pageContent || !pageContent[0]) return <PageNotFound />;

  return (
    <div className="ssp">
      <div className="ssp__wrapper page-wrapper">
        <div className="ssp__main-content" dangerouslySetInnerHTML={{ __html: pageContent[0].mainContent }}></div>
      </div>
    </div>
  )
}

export default SimpleSinglePage;
