import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAsyncCloud, setAsyncCloud } from './helperFuncs';
import { set } from 'firebase/database';

// Create the user's public data in the cloud (Firestore), store it in local storage
export const createPublicUser = async (data) => {
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', data);
};

// Create the user's private workout data in Firestore, store it in local storage
export const createPrivateUser = async (data) => {
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'data'), '@PrivateUserData', data);
};

// Fetch the user's public data from either local storage or cloud db (Firestore)
export const fetchPublicUserData = async () => {
    return await fetchAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData'); 
}

// Get the currently logged in users username
export const getUsername = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.username;
};  

// get the active split of user
export const getActiveSplit = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.activeSplit;
};  

// sets split to the Active Split
export const setActiveSplit = async (split) => {
    let publicUserData = await fetchPublicUserData();
    publicUserData.activeSplit = split;

    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
};  