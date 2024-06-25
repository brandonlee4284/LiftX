import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Update the user's friends data in Firestore and local storage
export const createPrivateFriends = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateFriendsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends');
        try {
            await AsyncStorage.setItem('@PrivateFriendsData', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private friends to local storage: ', e)
        }

        try {
            await setDoc(privateFriendsDocRef, data );
        } catch (error) {
            console.error('Error updating private friends: ', error);
        }
    }
};