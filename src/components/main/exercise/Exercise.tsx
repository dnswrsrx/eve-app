import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, MatchProps } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import firebase from '../../../config/firebaseConfig';
import useSubscription from '../../../utils/userSubscription';
import Loading from '../../general/loading/Loading';
import ExerciseForm from './exercise-form/ExerciseForm';

interface ExerciseProps {
  match: MatchProps,
}

const Exercise = ({ match }: ExerciseProps): JSX.Element => {
  const subcategoryId = match.params.subcategoryId;
  const groupId = match.params.groupId;
  const exerciseId = match.params.exerciseId;

  useFirestoreConnect([
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: groupId,
      subcollections: [{ collection: CollectionNames.Groups, doc: groupId }]
    },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: exerciseId,
      subcollections: [{ collection: CollectionNames.Groups, doc: groupId,
        subcollections: [{ collection: CollectionNames.Exercises, doc: exerciseId }]
      }]
    }
  ]);

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId], isEqual);
  const group = useSelector(({ firestore: { data } }: any) => data[groupId], isEqual);
  const exercise = useSelector(({ firestore: { data } }: any) => data[exerciseId], isEqual);

  const [category, setCategory] = useState(null);
  useEffect(() => {
    if (subcategory && subcategory.parent) {
      firebase.firestore().collection(CollectionNames.Categories).doc(subcategory.parent)
        .onSnapshot(observer => {
          setCategory(observer.data()?.name)
        })
    }
  }, [subcategory])

  const isSubscribed = useSubscription(category);

  if (!isLoaded(exercise)) return <Loading />;

  // Redirect back to groups if viewing an exercise of a non-free group
  if (isSubscribed === false && !group.free) window.location.assign(`/groups/${subcategoryId}`);

  return (
    <section className="group">
      <div className="group__wrapper page-wrapper">
        <div className="group__header">
          <h1 className="group__heading">
            Exercise
          </h1>
          <Link to={`/group/${subcategoryId}/${groupId}`}>
            Back to Group
          </Link>
        </div>
        <p className="exercise__description">
          Please select the words that best complete the following sentences.
        </p>
        {
          exercise.questions.length
            ? <ExerciseForm exerciseId={exerciseId} questions={exercise.questions} />
            : <p>No questions have been added to this exercise yet.</p>
        }
      </div>
    </section>
  )
}

export default Exercise;
