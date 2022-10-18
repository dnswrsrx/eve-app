import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, MatchProps, Category } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

import Loading from '../../general/loading/Loading';
import { AuthContext } from '../Main';
import useSubscription from '../../../utils/userSubscription';
import { sortAWLSubcategories } from '../../../utils/utils';
import SubcategoryCard from './subcategory-card/SubcategoryCard';
import './Subcategories.scss';

interface SubcategoriesProps {
  match: MatchProps,
}

const Subcategories = ({ match }: SubcategoriesProps): JSX.Element => {
  const categoryId = match.params.categoryId;

  useFirestoreConnect([
    { collection: CollectionNames.Categories, doc: categoryId, storeAs: categoryId },
    { collection: CollectionNames.Subcategories, orderBy: ['name', 'asc'], where: ['parent', '==', categoryId], storeAs: `subcategories-${categoryId}` }
  ]);

  const topLevelCategory = useSelector(({ firestore: { data } }: any) => data[categoryId], isEqual);
  const subcategories = useSelector(({ firestore: { ordered } }: any) => ordered[`subcategories-${categoryId}`], isEqual);
  const isSubscribed = useSubscription(topLevelCategory && topLevelCategory.name);

  const auth = useContext(AuthContext);

  if (!isLoaded(topLevelCategory) || !isLoaded(subcategories) ) return <Loading />;

  const renderSubcategories = () => {
    const sortedSubcategories = topLevelCategory.name.includes('Academic Vocabulary') ? [...subcategories].sort(sortAWLSubcategories) : subcategories;
    return sortedSubcategories
      // render subcategory with [test] in name if admin
      .filter((subcategory: Category) => auth.uid === process.env.REACT_APP_ADMIN_UID || !subcategory?.name?.includes('[test]'))
      .map((subcategory: Category): JSX.Element => (
        <li key={subcategory.id}>
          <SubcategoryCard subcategory={subcategory} notSubscribed={!isSubscribed} />
        </li>
      ));
  }

  if(!topLevelCategory) {
    return (
      <section className="subcategories">
        <div className="subcategories__wrapper page-wrapper">
          <div className="subcategories__header">
            <h1 className="subcategories__heading">
              Category not Found
            </h1>
            <Link to={'/word-categories'}>
              Back to Word Categories
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="subcategories">
      <div className="subcategories__wrapper page-wrapper">
        <div className="subcategories__header">
          <h1 className="subcategories__heading">
            Subcategories of {topLevelCategory.name}
          </h1>
          <Link to={'/word-categories'}>
            Back to Word Categories
          </Link>
        </div>
        { isSubscribed ? <p>Select a subcategory!.</p>
          : <>
              <p>
                As you are not subscribed to {topLevelCategory.name}, only the subcategories with the star (<FontAwesomeIcon icon={faStar} />) contain free groups.
                Explore the subcategories: each contains groups of words, their definitions, and exercises.
              </p>
            </>
        }
        {
          subcategories.length
            ? <ul className="subcategories__list">
                { renderSubcategories() }
              </ul>
            : <p>There are no subcategories to display.</p>
        }
      </div>
    </section>
  )
}

export default Subcategories;
