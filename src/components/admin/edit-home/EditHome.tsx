import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';

import SinglePageForm from '../single-page/single-page-form/SinglePageForm';
import { PageTypes, CollectionNames } from '../../models/models';
import Loading from '../../general/loading/Loading';
import './EditHome.scss';

const EditHome = (): JSX.Element => {

  useFirestoreConnect({ collection: CollectionNames.HomeLanguages, doc: 'english', storeAs: 'home-content' });

  const homeContent = useSelector(({ firestore: { data } }: any) => data['home-content'], isEqual);

  if(!isLoaded(homeContent)) return <Loading />;

  return (
    <section className="edit-home">
      <div className="edit-home__wrapper page-wrapper">
        <h1 className="edit-home__heading">Home Page Languages</h1>
        <p className="edit-home__description">This is the interface for editing the banner of the home page.</p>
        <SinglePageForm pageId='english' page={homeContent} type={PageTypes.Language} />
      </div>
    </section>
  )
}

export default EditHome;
