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

// Fetch user's private data from either local storage or cloud db (Firestore)
export const fetchPrivateUserData = async () => {
    return await fetchAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'data'), '@PrivateUserData');
}

// Get the currently logged in users username
export const getUsername = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.username;
};  

// Get the currently logged in users display name
export const getDisplayName = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.displayName;
};  

// get the active split of user
export const getActiveSplit = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.activeSplit;
};

// gets active split day names
export const getActiveSplitDayNames = async () => {
    try {
        // Fetch the active split data
        const activeSplit = await getActiveSplit();
                
        // Check if activeSplit and days are valid
        if (activeSplit && Array.isArray(activeSplit.days)) {
            // Extract the day names
            const dayNames = activeSplit.days.map(day => day.dayName);
            
            // Return the list of day names
            return dayNames;
        } else {
            console.warn('No valid days found in the active split');
            return [];
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching active split:', error);
        return [];
    }
};

// sets split to the Active Split
export const setActiveSplit = async (split) => {
    let publicUserData = await fetchPublicUserData();
    publicUserData.activeSplit = split;
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
};  

// gets scores as an array in the order: [overall, chest, back, shoulders, arms, legs]
export const getUserScores = async () => {
    try {
        // Fetch the public user data
        const publicUserData = await fetchPublicUserData();        

        // Check if publicUserData and displayScore are valid
        if (publicUserData && publicUserData.displayScore) {
            // Extract and order the scores
            const displayScore = publicUserData.displayScore;
            const orderedScores = [
                displayScore.overall.toFixed(1),
                displayScore.chest.toFixed(1),
                displayScore.back.toFixed(1),
                displayScore.shoulders.toFixed(1),
                displayScore.arms.toFixed(1),
                displayScore.legs.toFixed(1)
            ];

            // Return the ordered scores
            return orderedScores;
        } else {
            console.warn('DisplayScore data is not in the expected format or is missing');
            return [];
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching user scores:', error);
        return [];
    }
};

// sets the weight of a user
export const setUserWeight = async (newWeight) => {
    let privateUserData = await fetchPrivateUserData();
    privateUserData.weight = newWeight;
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'data'), '@PrivateUserData', privateUserData);
}; 

// sets the gender of a user
export const setUserGender = async (newGender) => {
    let privateUserData = await fetchPrivateUserData();
    privateUserData.gender = newGender;
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'data'), '@PrivateUserData', privateUserData);
}; 