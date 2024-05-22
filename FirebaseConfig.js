// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBneArfHLJ5aAdKa8fKtBzo_uOqsakm4J4",
  authDomain: "liftx-4eda1.firebaseapp.com",
  projectId: "liftx-4eda1",
  storageBucket: "liftx-4eda1.appspot.com",
  messagingSenderId: "23507113759",
  appId: "1:23507113759:web:504c9db8ac6b243d75022a",
  measurementId: "G-9TWPW81ZWB"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
