import { useContext } from 'react';
import { isEqual } from 'lodash';
import { useSelector } from 'react-redux';
import {useFirestoreConnect, isLoaded } from 'react-redux-firebase';
import { AuthContext } from '../components/main/Main';

const useSubscription = (wordCategory: string|null = null): string|boolean|null => {
  // Return a string if
  //  - user is subscribed to something (returns product's name)
  //  - empty string if there is a user but not subscribed to anything
  // Return a boolean if
  //  - wordCategory is passed in and whether the user's subscription includes that category
  //  - false if no user
  // Return null if waiting for user to load

  const auth = useContext(AuthContext);

  useFirestoreConnect([
    {collection: 'users', doc: auth.uid, storeAs: 'currentUser'}
  ])
  const userInfo = useSelector(({ firestore: { data } }: any) => data['currentUser'], isEqual);

  if (!auth.uid) return false;

  const subscription:string|null = isLoaded(userInfo) ? userInfo.main : null;

  if (subscription !== null && wordCategory) return subscription.includes(wordCategory);

  return subscription;
}

export default useSubscription;
