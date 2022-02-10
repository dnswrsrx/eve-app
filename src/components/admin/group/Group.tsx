import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { MatchProps, CollectionNames } from '../../models/models';
import Loading from '../../general/loading/Loading';
import WordList from './list-container/WordList';
import Exercises from '../exercises/Exercises';
import './Group.scss';

interface GroupProps {
  match: MatchProps,
}

const Group = ({ match }: GroupProps): JSX.Element => {
  const [successMessage, setSuccessMessage] = useState<string>('');
  const subcategoryId = match.params.subcategoryId;
  const groupId = match.params.groupId;

  useFirestoreConnect([
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: groupId,
      subcollections: [{ collection: CollectionNames.Groups, doc: groupId }]
    },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: `exercises-${groupId}`,
      subcollections: [{ collection: CollectionNames.Groups, doc: groupId,
        subcollections: [{ collection: CollectionNames.Exercises, orderBy: ['createdAt', 'asc'] }]
      }]
    }
  ]);

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId], isEqual);
  const group = useSelector(({ firestore: { data } }: any) => data[groupId], isEqual);
  const exercises = useSelector(({ firestore: { ordered } }: any) => ordered[`exercises-${groupId}`], isEqual);

  if(!isLoaded(subcategory) || !isLoaded(group) || !isLoaded(exercises)) return <Loading />;

  if(!subcategory || !group) {
    return (
      <section className="group-admin">
        <div className="group-admin__wrapper page-wrapper">
          <div className="group-admin__header">
            <h1 className="group-admin__heading">
              Group Not Found
            </h1>
            <Link to="/admin-dashboard/word-categories">Back to Top Level Categories</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="group-admin">
      <div className="group-admin__wrapper page-wrapper">
        <div className="group-admin__header">
          <h1 className="group-admin__heading">
            Editing Group
          </h1>
          <Link to={`/admin-dashboard/subcategories/${subcategoryId}`}>
            Back to {subcategory.name}
          </Link>
        </div>
        <p className="group-admin__description">This is the interface for editing a group inside of a subcategory.</p>
        { successMessage && <p className="group-admin__success-message success">{ successMessage }</p> }
        <WordList
          words={group.words}
          setSuccessMessage={setSuccessMessage}
          subcategoryId={subcategoryId}
          groupId={groupId}
        />
        <Exercises
          exercises={exercises}
          setSuccessMessage={setSuccessMessage}
          subcategoryId={subcategoryId}
          groupId={groupId}
        />
      </div>
    </section>
  )
}

export default Group;
