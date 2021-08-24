import { useState, useEffect } from 'react';
import firebase from '../config/firebaseConfig';

const useSubscription = (wordCategory: string|null = null): string|boolean => {
  const [subscription, setSubscription] = useState('');
  const user = firebase.auth().currentUser;

  useEffect(() => {
    if (user) {
      firebase.firestore().collection('users').doc(user.uid)
        .onSnapshot(observer => setSubscription(observer?.data()?.main || ''))
    }
  }, [user])

  if (wordCategory) return subscription.includes(wordCategory);

  return subscription;
}

export default useSubscription;
