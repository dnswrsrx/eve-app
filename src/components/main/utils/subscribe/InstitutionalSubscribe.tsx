import React, { useState, useRef, useContext } from 'react';
import { useSelector } from 'react-redux';
import { FirebaseReducer, isLoaded, useFirestoreConnect } from 'react-redux-firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { CollectionNames, Product, Price } from '../../../models/models';

import { ProductsContext } from '../../Main';

import useCartOrPortal from '../../utils/subscribe/CartOrPortalHook';

import './InstitutionalSubscribe.scss';


interface SubscribeToProductProps {
  auth?: FirebaseReducer.AuthState|null,
  subscription: string|null
}


const TIERS = [
  { perUnit: 8, max: 4 },
  { perUnit: 7, max: 16 },
  { perUnit: 6.5, max: 15 },
  { perUnit: 6, max: 15 },
  { perUnit: 5.5 },
];


const calculateCost = (unitsAsString: string): string => {

  let units = parseInt(unitsAsString);

  if (units < 1) return '0';

  let cost = 0;
  let level = 0;

  while (units) {
    const currentTier = TIERS[level];

    if (!currentTier.max || units < currentTier.max) {
      cost += currentTier.perUnit * units
      units -= units
    } else {
      cost += currentTier.perUnit * currentTier.max;
      units -= currentTier.max;
      level += 1;
    }
  }

  return cost.toFixed(cost.toString().includes('.') ? 2 : 0);
 }


const InstitutionalSubscribe = ({ auth, subscription }: SubscribeToProductProps): JSX.Element => {

  const { cartOrPortal, loadingCartOrPortal, error } = useCartOrPortal();

  const products = useContext(ProductsContext);
  const product: Product = products.filter((p: Product) => p.name.includes('Institutional'))[0];

  useFirestoreConnect([
    {
      collection: CollectionNames.Products,
      where: [['active', '==', true], ['billing_scheme', '==', 'tiered']],
      doc: product.id,
      storeAs: `prices-${product.id}`,
      subcollections: [{ collection: 'prices' }],
    }
  ]);

  const prices = useSelector(( { firestore: { data } }: any ) => data[`prices-${product.id}`]);

  const quantityInput = useRef<HTMLInputElement>(null);
  const [cost, setCost] = useState('0');

  if (!isLoaded(prices)) return <></>;

  const [priceID, price]: [string|null, Price|null] = Object.entries(prices).length ? Object.entries(prices)[0] as [string|null, Price|null] : [null, null];

  const purchase = (): void => {
     if (cartOrPortal) {
       const name = subscription && subscription.includes('Institutional') ? null : product.name
       cartOrPortal(name)(priceID, quantityInput.current?.value);
     }
   }

  return (
    <div className="institutional">
      <h2>Institutional Pricing</h2>
      <div className="institutional__info">
        <table>
          <thead>
            <tr>
              <th>Number of subscriptions</th>
              <th>Cost per unit (USD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Under 5</td>
              <td>$8</td>
            </tr>
            <tr>
              <td>5 &mdash; 20</td>
              <td>$7</td>
            </tr>
            <tr>
              <td>21 &mdash; 35</td>
              <td>$6.50</td>
            </tr>
            <tr>
              <td>36 &mdash; 50</td>
              <td>$6</td>
            </tr>
            <tr>
              <td>Above 50</td>
              <td>$5.50</td>
            </tr>
          </tbody>
        </table>

        <article>
          <p>
            Purchase multiple subscriptions and provide access to others <em>e.g.</em> for a class or institution. Subscriptions include both General and Academic categories of vocabulary.
          </p>
        </article>
      </div>
      { !subscription &&
        <div className="institutional__units">
          <input type="number" ref={quantityInput} min="1" placeholder="Number of units" onChange={e => setCost(calculateCost(e.currentTarget.value))}/>
          <p>Total: ${cost}</p>
        </div>
      }
      {/* {
        price && subscription && subscription.includes('Institutional ') &&
          <p className="institutional__reduction-warning">
            <FontAwesomeIcon icon={faExclamationTriangle} /> If you reduced the number of subscription units and there were more subscribers than units purchased,
            we will remove the additional subscribers. Older subscribers will be removed first.
          </p>
      } */}
      {
        price && (!subscription || subscription.includes('Institutional ')) &&
          <button
            disabled={!auth?.uid || !!loadingCartOrPortal || (!subscription && parseInt(cost) <= 0)}
            onClick={purchase}
          >
            { !subscription ? 'Purchase' : 'Manage your subscription' }
            { !!loadingCartOrPortal && <span className="institutional__spinner"></span> }
          </button>
      }
      { error && <p className="error">An error occured. Please refresh the page and try again.</p> }
    </div>
  )
}

export default InstitutionalSubscribe;
