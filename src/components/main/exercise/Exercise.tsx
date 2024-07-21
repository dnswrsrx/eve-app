import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import firebase from '../../../config/firebaseConfig';
import useSubscription from '../utils/UserSubscriptionHook';
import Loading from '../../general/loading/Loading';
import ExerciseForm from './exercise-form/ExerciseForm';
import Ads from '../ads/Ads';

const Exercise = (): JSX.Element => {
  let { subcategoryId, groupId, exerciseId } = useParams();
  subcategoryId = subcategoryId || '';
  groupId = groupId || '';
  exerciseId = exerciseId || '';

  useFirestoreConnect(
    groupId
      ? [
          { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
          { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: groupId,
            subcollections: [{ collection: CollectionNames.Groups, doc: groupId }]
          },
          { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: exerciseId,
            subcollections: [{ collection: CollectionNames.Groups, doc: groupId,
              subcollections: [{ collection: CollectionNames.Exercises, doc: exerciseId }]
            }]
          }
      ]
      : [
          { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
          { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: exerciseId,
              subcollections: [{ collection: CollectionNames.Tests, doc: exerciseId }]
          }
      ]
  );

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId || ''], isEqual);
  const group = useSelector(({ firestore: { data } }: any) => data[groupId || ''], isEqual);
  const exercise = useSelector(({ firestore: { data } }: any) => data[exerciseId || ''], isEqual);

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

  // Redirect back to groups if viewing exercise/test of a non-free group/subcategory
  if (!isSubscribed && (!groupId || (group && !group.free))) {
    window.location.assign(`/groups/${subcategoryId}`);
  }

  return (
    <section className="group">
      <div className="group__wrapper page-wrapper">
        <div className="group__header">
          <h1 className="group__heading">
            {groupId ? 'Exercise' : 'Test'} { exercise.number }
          </h1>
          <Link to={groupId ? `/group/${subcategoryId}/${groupId}` : `/groups/${subcategoryId}`}>
            Back to {groupId ? `Group ${group.number || ''}` : 'Sublist'}
          </Link>
        </div>
        <p className="exercise__description">
          Please select the words that best complete the following sentences.
        </p>
        {
          exercise.questions.length
            ? <ExerciseForm exerciseId={exerciseId} questions={exercise.questions} />
            : <p>No questions have been added to this {groupId ? 'exercise' : 'test'} yet.</p>
        }
      </div>
      <Ads slot="5645970816" />
    </section>
  )
}

export default Exercise;
