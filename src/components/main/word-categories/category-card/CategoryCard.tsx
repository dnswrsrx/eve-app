import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../../../models/models';
import './CategoryCard.scss';

interface CategoryCardProps {
  category: Category,
}

const CategoryCard = ({ category }: CategoryCardProps): JSX.Element => {
  const imageUrl = `/images/${category.name.includes('General') ? 'friends' : 'educator'}.svg`
  const altText = `/images/${category.name.includes('General') ? 'coffee with friends' : 'classroom'}.svg`

  return (
    <Link to={`/subcategories/${category.id}`} className="category-card">
      <h2 className="category-card__heading">
        {category.name}
      </h2>
      <img src={ imageUrl } alt={ altText } />
    </Link>
  )
}

export default CategoryCard;
