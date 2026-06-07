import React from 'react';
import { Link } from 'react-router-dom';

import { Category } from '../../../models/models';
import './SubcategoryCard.scss';

interface SubcategoryCardProps {
  subcategory: Category,
}

const SubcategoryCard = ({ subcategory }: SubcategoryCardProps) => {
  return (
    <Link to={`/groups/${subcategory.id}`} className="subcategory-card">
      <h2 className="subcategory-card__heading">
        {subcategory.name}
      </h2>
    </Link>
  )
}

export default SubcategoryCard;
