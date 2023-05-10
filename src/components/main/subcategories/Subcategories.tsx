import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, MatchProps, Category } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faStar} from '@fortawesome/free-solid-svg-icons';

import { sortAWLSubcategories } from '../../../utils/utils';
import Loading from '../../general/loading/Loading';
import { UserInfoContext } from '../Main';
import useSubscription from '../utils/UserSubscriptionHook';
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

  const userInfo = useContext(UserInfoContext);

  if (!isLoaded(topLevelCategory) || !isLoaded(subcategories) ) return <Loading />;

  const renderSubcategories = () => {
    let sortedSubcategories = [subcategories];

    if (topLevelCategory.name.includes('Academic Vocabulary')) {
      const regularAWL = subcategories.filter((subcategory: Category) => !subcategory.name.includes('More'));
      const moreAWL = subcategories.filter((subcategory: Category) => subcategory.name.includes('More'));
      sortedSubcategories = [regularAWL.sort(sortAWLSubcategories), moreAWL];
    }

    return <>
      {
        sortedSubcategories.map((subcategories, i) => {
          return <ul className="subcategories__list" key={i}>
            {
              subcategories
                // render subcategory with [test] in name if admin
                .filter((subcategory: Category) => userInfo?.isAdmin || !subcategory?.name?.includes('[test]'))
                .map((subcategory: Category): JSX.Element => (
                  <li key={subcategory.id}>
                    <SubcategoryCard subcategory={subcategory} notSubscribed={!isSubscribed} />
                  </li>
                ))
            }
          </ul>
        })
      }
    </>
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
        { isSubscribed ? <p>Select a subcategory!</p>
          : <>
              <p>
                As you are not subscribed to {topLevelCategory.name}, only the subcategories with the star (<FontAwesomeIcon icon={faStar} />) contain free groups.
                Explore the subcategories: each contains groups of words, their definitions, and exercises.
              </p>
            </>
        }
        {
          subcategories.length
            ? renderSubcategories()
            : <p>There are no subcategories to display.</p>
        }
      </div>
    </section>
  )
}

export default Subcategories;
