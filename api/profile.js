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

// Get the currently logged in users bio
export const getBio = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.bio;
};  

// Get the currently logged in users pfp
export const getProfilePicture = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.profilePicture;
};  

// Get the currently logged in users number of friends
export const getNumFriends = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.numFriends;
};  

// get the active split of user
export const getActiveSplit = async () => {
    let publicUserData = await fetchPublicUserData();
    return publicUserData.activeSplit;
};

// increase number of friends by one of the current user
export const updateFriendCount = async () => {
    let publicUserData = await fetchPublicUserData();
    publicUserData.numFriends = publicUserData.numFriends + 1;
};  


// sets split to the Active Split and moves split to front of the array in private splits
export const setActiveSplit = async (split) => {
    try {
        // Fetch public user data
        let publicUserData = await fetchPublicUserData();
        publicUserData.activeSplit = split;

        // Update public user data with active split
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);

    } catch (error) {
        console.error("Error setting active split: ", error);
    }
};  

// gets scores as an array in the order: [overall, chest, back, shoulders, arms, legs]
export const getUserScores = async () => {
    try {
        // Fetch the public user data
        const publicUserData = await fetchPublicUserData();        

        // Check if publicUserData and displayScore are valid
        if (publicUserData && publicUserData.displayScore) {
            // Extract and order the scores
            return {
                displayScores: publicUserData.displayScore
                    ? {
                        overall: publicUserData.displayScore.overall.toFixed(1),
                        chest: publicUserData.displayScore.chest.toFixed(1),
                        back: publicUserData.displayScore.back.toFixed(1),
                        shoulders: publicUserData.displayScore.shoulders.toFixed(1),
                        arms: publicUserData.displayScore.arms.toFixed(1),
                        legs: publicUserData.displayScore.legs.toFixed(1)
                    }
                    : null
            }
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

// updates user profile
export const updateProfile = async (newPFP, newDisplayName, newUsername) => {
    
}; 
