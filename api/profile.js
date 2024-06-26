import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create the user's public data in the cloud (Firestore), store it in local storage
export const createPublicUser = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const publicUserDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        try {
            await AsyncStorage.setItem('@PublicUserData', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving public data to local storage: ', e)
        }

        try {
            await setDoc(publicUserDocRef, data);
        } catch (error) {
            console.error('Error updating public data: ', error);
        }
    }
};

// Create the user's private workout data in Firestore, store it in local storage
export const createPrivateUser = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'data');
        try {
            await AsyncStorage.setItem('@PrivateUserData', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private data to local storage: ', e)
        }

        try {
            await setDoc(privateUserDataDocRef, data);
        } catch (error) {
            console.error('Error updating private data: ', error);
        }
    }
};

// Fetch the user's public data from either local storage or cloud db (Firestore)
export const fetchPublicUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@PublicUserData');
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            throw new Error('No public user data in local storage');
        }
    } catch (e) {
        console.log(e);
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
            try {
                const docData = await getDoc(userDocRef);
                if (docData.exists()) {
                    await AsyncStorage.setItem('@PublicUserData', JSON.stringify(docData.data()));
                    return docData.data();
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching public data: ', error);
            }
        }  
    }
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
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        let publicUserData = await fetchPublicUserData();

        // Set the active split
        publicUserData.activeSplit = split;

        // get doc
        const publicUserDocRef = getDoc(FIRESTORE_DB, 'users', user.uid, 'public');

        try {
            // Update Firestore document
            await updateDoc(publicUserDocRef, { activeSplit: publicUserData.activeSplit });
        } catch (error) {
            console.error('Error updating active split: ', error);
        }
    }
    
};  