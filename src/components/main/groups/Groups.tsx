import React from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, MatchProps, Group } from '../../models/models';
import useSubscription from '../utils/UserSubscriptionHook';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import Loading from '../../general/loading/Loading';
import GroupCard from './group-card/GroupCard';
import Exercises from '../exercises/Exercises';
import './Groups.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

interface SubcategoriesProps {
  match: MatchProps,
}

const Subcategories = ({ match }: SubcategoriesProps): JSX.Element => {
  const subcategoryId = match.params.subcategoryId;

  useFirestoreConnect([
    { collection: 'top-level-categories', storeAs: 'topLevels' },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: `groups-${subcategoryId}`,
      subcollections: [{
        collection: CollectionNames.Groups,
        orderBy: ['createdAt', 'asc']
      }]
    },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: `tests-${subcategoryId}`,
      subcollections: [{
        collection: CollectionNames.Tests,
        orderBy: ['createdAt', 'asc']
      }]
    }
  ]);

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId], isEqual);
  const groups = useSelector(({ firestore: { ordered } }: any) => ordered[`groups-${subcategoryId}`], isEqual);
  const topLevels = useSelector(( {firestore: { data }}: any ) => data['topLevels']);
  const topLevelName = subcategory && topLevels && topLevels[subcategory.parent]?.name;
  const isSubscribed = useSubscription(topLevelName);
  
  const tests = useSelector(({ firestore: { ordered } }: any) => ordered[`tests-${subcategoryId}`], isEqual);

  if ([subcategory, groups, topLevels, tests].some(v => !isLoaded(v))) return <Loading />;

  if(!subcategory) {
    return (
      <section className="groups">
        <div className="groups__wrapper page-wrapper">
        <div className="groups__header">
            <h1 className="groups__heading">
              Subcategory not Found
            </h1>
            <Link to={'/word-categories'}>
              Back to Word Categories
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const renderGroups = (): JSX.Element => {
    return groups.map((group: Group, index: number): JSX.Element => (
      <GroupCard
        number={index + 1}
        subcategoryId={subcategoryId}
        group={group}
        notSubscribed={!isSubscribed}
        key={group.id}
      />
    ))
  }

  return (
    <section className="groups">
      <div className="groups__wrapper page-wrapper">
        <div className="groups__header">
          <h1 className="groups__heading">
            Groups in {subcategory.name}
          </h1>
          <Link to={`/subcategories/${subcategory.parent}`}>
            Back to Subcategories
          </Link>
        </div>
        {
          isSubscribed
            ? <p>Select a group to begin work on the exercises!</p>
            : <p>
                As you are not subscribed to {topLevelName}, only groups with the star (<FontAwesomeIcon icon={faStar}/>) are available.
                Each group contains words, their definitions, and exercises.
              </p>
        }
        { groups.length
            ? <ul className="groups__list">{ renderGroups() }</ul>
            : <p>There are no groups to display.</p>
        }
        { subcategory.name.includes('Academic') && tests && (
          isSubscribed
            ? <Exercises exercises={tests} subcategoryId={subcategoryId} groupId={null}/>
            : <>
                <h1>Achievement Tests</h1>
                <p>
                  {
                    isSubscribed
                      ? 'Once you have completed the exercises in each group, check your knowledge of all the vocabulary with the following Achievement Tests'
                      : `Subscribe to ${topLevelName} to access the tests for this sublist.`
                  }
                </p>
              </>
          )
        }
      </div>
    </section>
  )
}

export default Subcategories;
