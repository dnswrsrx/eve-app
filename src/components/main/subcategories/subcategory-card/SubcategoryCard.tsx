import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { Category } from '../../../models/models';
import './SubcategoryCard.scss';

interface SubcategoryCardProps {
  subcategory: Category,
  notSubscribed: boolean,
}

const SubcategoryCard = ({ subcategory, notSubscribed }: SubcategoryCardProps) => {
  return (
    <Link to={`/groups/${subcategory.id}`} className="subcategory-card">
      <h2 className="subcategory-card__heading">
        {subcategory.name}
        { notSubscribed && (subcategory?.numberOfFreeGroups || 0) > 0 &&
          <span><FontAwesomeIcon icon={faStar} /></span>
        }
      </h2>
    </Link>
  )
}

export default SubcategoryCard;
