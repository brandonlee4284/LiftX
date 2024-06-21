import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update the user's public data in the cloud (Firestore) and local storage
export const updatePublicUserData = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        try {
            await AsyncStorage.setItem('@PublicUserData', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving public data to local storage: ', e)
        }

        try {
            await setDoc(userDocRef, data);
        } catch (error) {
            console.error('Error updating public data: ', error);
        }
    }
};

// Update the user's private workout data in Firestore and local storage
export const updatePrivateUserData = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
        try {
            await AsyncStorage.setItem('@PrivateUserData', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private data to local storage: ', e)
        }

        try {
            await setDoc(privateDataDocRef, data);
        } catch (error) {
            console.error('Error updating private data: ', error);
        }
    }
};

