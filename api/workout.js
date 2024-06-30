import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const createPrivateWorkout = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateWorkoutDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'workout');
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

// given a dayName and a split, returns the day in that split
export const getWorkoutDay = async (dayName, split) => {
    try {
        // Find the day in the split by dayName
        const day = split.days.find(day => day.dayName === dayName);
        
        // If the day is found, return it
        if (day) {
            return day;
        } else {
            throw new Error(`Day with name ${dayName} not found in split ${split.splitName}`);
        }
    } catch (error) {
        console.error('Error getting workout day:', error);
        throw error;
    }
};

export const newWorkoutDay = () => {
    try {
        const emptyDay = {
            dayName: "New Day",
            exercises: [
               
            ]
        };
        return emptyDay;
    } catch (error) {
        console.error('Error creating new workout day:', error);
        throw error;
    }
};