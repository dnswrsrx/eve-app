import React from 'react';
import { Link } from 'react-router-dom';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import { CollectionNames, MatchProps, Category } from '../../models/models';
import { useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import Loading from '../../general/loading/Loading';
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

  if(!isLoaded(topLevelCategory) || !isLoaded(subcategories)) return <Loading />;

  const renderSubcategories = () => {
    return subcategories.map((subcategory: Category): JSX.Element => (
      <li key={subcategory.id}>
        <SubcategoryCard subcategory={subcategory} />
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
        <p className="subcategories__description">
          Please select a subcategory to view.
        </p>
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
