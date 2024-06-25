import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPrivateWorkout = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateWorkoutDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'workout');
        try {
            await AsyncStorage.setItem('@PrivateUserWorkout', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private friends to local storage: ', e)
        }

        try {
            await setDoc(privateWorkoutDocRef, data );
        } catch (error) {
            console.error('Error updating private friends: ', error);
        }
    }
};