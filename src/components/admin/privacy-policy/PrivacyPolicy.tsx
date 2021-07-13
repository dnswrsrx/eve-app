import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import Loading from '../../general/loading/Loading';
import { CollectionNames } from '../../models/models';
import PrivacyPolicyForm from './form/PrivacyPolicyForm';
import './PrivacyPolicy.scss';

const PrivacyPolicy = (): JSX.Element => {
  useFirestoreConnect([
    { collection: CollectionNames.Pages, where: ['name', '==', 'Privacy Policy'], storeAs: 'page' }
  ])
  const policy = useSelector(({ firestore: { ordered } }: any) => ordered['page'], isEqual);

  if (!isLoaded(policy)) return <Loading />;

  if (!policy || !policy[0] || !policy[0].mainContent) {
    return (
      <section className="single-page-admin">
        <div className="single-page-admin__wrapper page-wrapper">
          <div className="single-page-admin__header">
            <h1 className="single-page-admin__heading">
              Privacy Policy Not Found
            </h1>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="privacy-policy">
      <div className="privacy-policy__wrapper page-wrapper">
        <h1 className="privacy-policy__heading">Privacy Policy</h1>
        <p className="privacy-policy__description">This is the interface for editing the privacy policy.</p>
        <PrivacyPolicyForm content={policy[0].mainContent} docID={policy[0].id} />
      </div>
    </section>
  )
}

export default PrivacyPolicy;
