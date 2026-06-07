import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, useParams } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, Group } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import Loading from '../../general/loading/Loading';
import GroupCard from './group-card/GroupCard';
import Exercises from '../exercises/Exercises';
import './Groups.scss';
import Ads from '../ads/Ads';

const Subcategories = (): JSX.Element => {
  let { subcategoryId } = useParams();
  subcategoryId = subcategoryId || '';

  useFirestoreConnect([
    { collection: 'top-level-categories', storeAs: 'topLevels' },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: subcategoryId },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: `groups-${subcategoryId}`,
      subcollections: [{
        collection: CollectionNames.Groups,
        orderBy: ['number', 'asc']
      }]
    },
    { collection: CollectionNames.Subcategories, doc: subcategoryId, storeAs: `tests-${subcategoryId}`,
      subcollections: [{
        collection: CollectionNames.Tests,
        orderBy: ['number', 'asc']
      }]
    }
  ]);

  const subcategory = useSelector(({ firestore: { data } }: any) => data[subcategoryId || ''], isEqual);
  const groups = useSelector(({ firestore: { ordered } }: any) => ordered[`groups-${subcategoryId}`], isEqual);
  const topLevels = useSelector(( {firestore: { data }}: any ) => data['topLevels']);

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
    return groups.map((group: Group): JSX.Element => (
      <GroupCard
        subcategoryId={subcategoryId || ''}
        group={group}
        key={group.id}
      />
    ))
  }

  return (
    <section className="groups">
      <Helmet>
        <meta name="description"
          content={`Groups of the ${subcategory.name} subcategory.`}
        />
        <meta property="og:title" content={`${subcategory.name} - English Vocabulary Exercises`} />
        <meta property="og:description" content={`Groups of the ${subcategory.name} word category.`} />
        <link rel="canonical" href={`https://www.englishvocabularyexercises.com${window.location.pathname}`} />
        <title>{subcategory.name} - English Vocabulary Exercises</title>
      </Helmet>

      <div className="groups__wrapper page-wrapper">
        <div className="groups__header">
          <h1 className="groups__heading">
            Groups in {subcategory.name}
          </h1>
          <Link to={`/subcategories/${subcategory.parent}`}>
            Back to Subcategories
          </Link>
        </div>
        <p>Select a group to begin work on the exercises!</p>

        { groups.length
            ? <ul className="groups__list">{ renderGroups() }</ul>
            : <p>There are no groups to display.</p>
        }
        { subcategory.name.includes('Academic') && tests && <Exercises exercises={tests} subcategoryId={subcategoryId} groupId={null}/> }
        <Ads slot="3488411459" />
      </div>
    </section>
  )
}

export default Subcategories;
