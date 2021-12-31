import React from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import Loading from '../../general/loading/Loading';
import { CollectionNames } from '../../models/models';
import SSPForm from './form/SSPForm';
import './SimpleSinglePage.scss';

const SimpleSinglePage = (): JSX.Element => {

  const page = window.location.pathname.includes('/privacy-policy') ? 'Privacy Policy' : window.location.pathname.includes('/teacher-notes') ? 'Note to Teachers' : '';

  useFirestoreConnect([
    { collection: CollectionNames.Pages, where: ['name', '==', page], storeAs: 'page' }
  ])
  const currentPage = useSelector(({ firestore: { ordered } }: any) => ordered['page'], isEqual);

  if (!isLoaded(currentPage)) return <Loading />;

  if (!currentPage || !currentPage[0] || !currentPage[0].mainContent) {
    return (
      <section className="single-page-admin">
        <div className="single-page-admin__wrapper page-wrapper">
          <div className="single-page-admin__header">
            <h1 className="single-page-admin__heading">
              Page Not Found
            </h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="ssp">
      <div className="ssp__wrapper page-wrapper">
        <h1 className="ssp__heading">{ page }</h1>
        <p className="ssp__description">This is the interface for editing the { page }.</p>
        <SSPForm page={currentPage[0]} />
      </div>
    </section>
  )
}

export default SimpleSinglePage;
