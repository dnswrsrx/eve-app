import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEqual } from 'lodash';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { MatchProps, CollectionNames } from '../../models/models';
import Loading from '../../general/loading/Loading';
import ExerciseForm from './exercise-form/ExerciseForm';
import './Exercise.scss';

interface ExerciseProps {
  match: MatchProps,
}

const Exercise = ({ match }: ExerciseProps): JSX.Element => {
  const subcategoryId = match.params.subcategoryId;
  const groupId = match.params.groupId;
  const exerciseId = match.params.exerciseId;

  useFirestoreConnect(
    groupId
    ? [
      { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: exerciseId,
        subcollections: [{ collection: CollectionNames.Groups, doc: groupId,
          subcollections: [{ collection: CollectionNames.Exercises, doc: exerciseId }]
        }]
      }
    ]
    : [
      { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: exerciseId,
        subcollections: [{ collection: CollectionNames.Tests, doc: exerciseId }]
      }
    ]
  );

  const exercise = useSelector(({ firestore: { data } }: any) => data[exerciseId], isEqual);
  
  if(!isLoaded(exercise)) return <Loading />;

  if(!exercise) {
    return (
      <section className="exercise-admin">
        <div className="exercise-admin__wrapper page-wrapper">
          <div className="exercise-admin__header">
            <h1 className="exercise-admin__heading">
              {groupId ? 'Exercise' : 'Test'} Not Found
            </h1>
            <Link to="/admin-dashboard/word-categories">Back to Top Level Categories</Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="exercise-admin">
      <div className="exercise-admin__wrapper page-wrapper">
        <div className="exercise-admin__header">
          <h1 className="exercise-admin__heading">
            Editing {groupId ? 'Exercise' : 'Test'} { exercise.number }
          </h1>
          <Link
            to={
              groupId
              ? `/admin-dashboard/group/${subcategoryId}/${groupId}`
              : `/admin-dashboard/subcategories/${subcategoryId}`
            }
          >
            Back to {groupId ? 'Group' : 'Subcategory'}
          </Link>
        </div>
        <p className="exercise-admin__description">
          This is the interface for editing {groupId ? 'an exercise' : 'a test'}.
          Please upload an HTM export from Gerry's Vocabulary Teacher to proceed.
        </p>
        <ExerciseForm
          exercise={exercise}
          subcategoryId={subcategoryId}
          groupId={groupId}
          exerciseId={exerciseId}
        />
      </div>
    </section>
  )
}

export default Exercise;
