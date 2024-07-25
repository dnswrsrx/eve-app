import React, { useState, useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames } from '../../models/models';
import firebase from '../../../config/firebaseConfig';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import useSubscription from '../utils/UserSubscriptionHook';
import Loading from '../../general/loading/Loading';
import WordList from './word-list/WordList';
import Exercises from '../exercises/Exercises';
import Ads from '../ads/Ads';
import './Group.scss';

const Group = (): JSX.Element => {
  let { subcategoryId, groupId } = useParams();
  subcategoryId = subcategoryId || '';
  groupId = groupId || '';

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

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId || ''], isEqual);
  const group = useSelector(({ firestore: { data } }: any) => data[groupId || ''], isEqual);
  const exercises = useSelector(({ firestore: { ordered } }: any) => ordered[`exercises-${groupId}`], isEqual);

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

  if(!isLoaded(subcategory) || !isLoaded(group) || !isLoaded(exercises)) return <Loading />;

  if(!subcategory || !group) {
    return (
      <section className="group">
        <div className="group__wrapper page-wrapper">
        <div className="group__header">
            <h1 className="group__heading">
              Group not Found
            </h1>
            <Link to={'/word-categories'}>
              Back to Word Categories
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Redirect back to groups if viewing a non-free group as an unsubscribed user
  if (!isSubscribed && !group.free) return <Navigate to={`/groups/${subcategoryId}` }/>;

  const wordList = Object.keys(group.words).sort();

  return (
    <section className="group">
      <div className="group__wrapper page-wrapper">
        <div className="group__header">
          <h1 className="group__heading">
            Group {group.number} in {subcategory.name}
          </h1>
          <Link to={`/groups/${subcategoryId}`}>
            Back to {subcategory.name}
          </Link>
        </div>
        <p>
          Select a word to see a definition or select an exercise to practise the vocabulary in context.
          { isSubscribed ? '' : ` Consider subscribing for full access to ${category}.`}
        </p>
        {
          wordList.length
            ? <WordList wordInfo={group.words} wordList={wordList} />
            : <>
                <h2>Word List</h2>
                <p>There are no words to display in this group.</p>
              </>
        }
        {
          exercises.length
            ? <Exercises exercises={exercises} subcategoryId={subcategoryId} groupId={groupId} />
            : <>
                <h2>Exercises</h2>
                <p>There are no exercises to display in this group.</p>
              </>
        }
        <Ads slot="5400258929" />
      </div>
    </section>
  )
}

export default Group;
