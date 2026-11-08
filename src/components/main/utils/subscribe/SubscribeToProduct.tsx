import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { CollectionNames, Product } from '../../../models/models';
import './Subscribe.scss';


interface SubscribeToProductProps {
  product: Product,
}


const SubscribeToProduct = ({ product }: SubscribeToProductProps) => {

  useFirestoreConnect([{
    collection: CollectionNames.Products,
    where: ['active', '==', true],
    doc: product.id,
    storeAs: `prices-${product.id}`,
    subcollections: [{ collection: 'prices' }]
  }]);

  const prices = useSelector(( {firestore: { data }}: any ) => data[`prices-${product.id}`]) || {};

  if (!isLoaded(prices)) return <></>

  const images = window.location.pathname === '/' && (
    product.name.includes('Academic Vocabulary')
      ? ['exams', 'teaching', 'book_lover']
      : ['multitasking', 'travel_mode', 'having_fun']
  );

  return (
    <div className="subscribe__col">
      <h3>
        { // Home page describes the categories and not the subscription/
          window.location.pathname === '/'
            ? product.name.replace('General Vocabulary + ', '')
            : product.name
        }
      </h3>

      { images &&
        <div className="subscribe__images">
          { images.map((name, index) => <img key={index} className="subscribe__image" src={`/images/${name}.svg`} alt={name} />) }
        </div>
      }

      { (window.location.pathname.includes('/subscription') || window.location.pathname === '/') && product.description && <p>{product.description}</p> }
    </div>
  )
}

export default SubscribeToProduct;
