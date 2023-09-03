import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/functions';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: "english-vocabulary-exercises.firebaseapp.com",
  databaseURL: "https://english-vocabulary-exercises.firebaseio.com",
  projectId: "english-vocabulary-exercises",
  storageBucket: "english-vocabulary-exercises.appspot.com",
  messagingSenderId: "151491480145",
  appId: "1:151491480145:web:b84d187eb9e25d7690c670",
  measurementId: "G-KYW2SLNT0V"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebase.firestore();

export default firebase;
