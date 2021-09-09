import { useState, useEffect } from 'react';
import firebase from '../config/firebaseConfig';

const useSubscription = (wordCategory: string|null = null): string|boolean|null => {
  // Return a string if
  //  - user is subscribed to something (returns product's name)
  //  - empty string if there is a user but not subscribed to anything
  // Return a boolean if
  //  - wordCategory is passed in and whether the user's subscription includes that category
  //  - false if no user
  // Return null if waiting for user to load

  const [subscription, setSubscription] = useState<string|null>(null);
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      firebase.firestore().collection('users').doc(user.uid)
        .onSnapshot(observer => setSubscription(observer?.data()?.main || ''))
    }
  }, [user])

  if (!user || !user.uid) return false;

  if (subscription !== null && wordCategory) return subscription.includes(wordCategory);

  return subscription;
}

export default useSubscription;
