import { getDoc, doc, setDoc, updateDoc, getFirestore } from 'firebase/firestore';
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
                        overall: {
                            score: publicUserData.displayScore.overall.score.toFixed(1),
                            change: publicUserData.displayScore.overall.change.toFixed(2),
                        },
                        chest: {
                            score: publicUserData.displayScore.chest.score.toFixed(1),
                            change: publicUserData.displayScore.chest.change.toFixed(2),
                        },
                        back: {
                            score: publicUserData.displayScore.back.score.toFixed(1),
                            change: publicUserData.displayScore.back.change.toFixed(2),
                        },
                        shoulders: {
                            score: publicUserData.displayScore.shoulders.score.toFixed(1),
                            change: publicUserData.displayScore.shoulders.change.toFixed(2),
                        },
                        arms: {
                            score: publicUserData.displayScore.arms.score.toFixed(1),
                            change: publicUserData.displayScore.arms.change.toFixed(2),
                        },
                        legs: {
                            score: publicUserData.displayScore.legs.score.toFixed(1),
                            change: publicUserData.displayScore.legs.change.toFixed(2),
                        },
                    }
                    : null,
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

// sets the age of a user
export const setUserAge = async (newAge) => {
    let privateUserData = await fetchPrivateUserData();
    privateUserData.age = newAge;
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'data'), '@PrivateUserData', privateUserData);
}; 

export const updateUserProfile = async (newPFP, newDisplayName, newBio) => {
    try {
        // Fetch public user data
        let publicUserData = await fetchPublicUserData();

        if (newPFP) {
            publicUserData.profilePicture = newPFP;
        }
        if (newDisplayName) {
            const trimmedDisplayName = newDisplayName.trim().replace(/(\r\n|\n|\r)/gm, "");
            publicUserData.displayName = trimmedDisplayName;
        }
       
        const trimmedBio = newBio.trim().replace(/(\r\n|\n|\r)/gm, "");

        publicUserData.bio = trimmedBio;
        

        // Update public user data with active split
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
        console.log("updated user profile");

    } catch (error) {
        console.error("Error setting active split: ", error);
    }
    
};

// toggle the private mode of active split of a user
export const togglePrivateActiveSplitMode = async () => {
    let publicUserData = await fetchPublicUserData();
    if(publicUserData.privateActiveSplitMode){
        publicUserData.privateActiveSplitMode = false;
    } else {
        publicUserData.privateActiveSplitMode = true;
    }
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
}; 

// toggle the private mode of active split of a user
export const togglePrivateScoreMode = async () => {
    let publicUserData = await fetchPublicUserData();
    if(publicUserData.privateScoreMode){
        publicUserData.privateScoreMode = false;
    } else {
        publicUserData.privateScoreMode = true;
    }
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
}; 

// sets onboarding to true
export const completeOnboarding = async () => {
    let publicUserData = await fetchPublicUserData();
    publicUserData.onboardingCompleted = true;
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
    
};