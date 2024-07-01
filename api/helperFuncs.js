import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Async/Cloud function helper for fetching data
export const fetchAsyncCloud = async (docRef, asyncTag) => {
    try {
        const jsonValue = await AsyncStorage.getItem(asyncTag);
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        } else {
            throw new Error('No public user data in local storage');
        }
    } catch (e) {
        console.log("Reverting to cloud backup for ", asyncTag, "; Error: ", e);
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            try {
                const docData = await getDoc(docRef);
                if (docData.exists()) {
                    await AsyncStorage.setItem(asyncTag, JSON.stringify(docData.data()));
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

// Async/Cloud function helper for setting data
export const setAsyncCloud = async (docRef, asyncTag, data) => {
    try {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            try {
                await setDoc(docRef, data);
            } catch (error) {
                throw new error("Error updating cloud for, ", asyncTag, "; Error: ", e);
            }
        }

        await AsyncStorage.setItem(asyncTag, JSON.stringify(data));
    } catch (e) {
        console.log("Error updating ", asyncTag, "; Error: ", e)
    }
}

export const clearAsyncStorage = () => {
    try {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
    } catch (e) {
        console.log('Error removing user data from local storage: ', e);
    }
}
