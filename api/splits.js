import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Update the user's split data in Firestore and local storage
export const createPrivateSplits = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private splits to local storage: ', e)
        }

        try {
            await setDoc(privateUserSplitsDocRef, data);
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const getSplits = async (data) => {
    const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
    try {
        const data = await AsyncStorage.getItem('@PrivateUserSplits');
        if (data == null) {
            console.log('Local storage empty, reverting to cloud backup');
            data = await getDoc(privateUserSplitsDocRef, data);
        }
        return data;
    } catch (e) {
        console.log('Error fetching private splits from local storage, reverting to cloud backup: ', e);
        return await getDoc(privateUserSplitsDocRef, data);
    }
};

export const addSplits = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const newSplit =
        { 
            splitName: "New Split",
            days: [],
        }
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            const docSplit = await getSplits(privateUserSplitsDocRef);
            let currentSplits = docSplit.exists() ? docSplit.data().splits : [];
            currentSplits.push(newSplit)
            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const deleteSplit = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            const docSplit = await getSplits(privateUserSplitsDocRef);
            let currentSplits = docSplit.exists() ? docSplit.data().splits : [];

            currentSplits = currentSplits.filter(split => split.splitName !== data.splitName);

            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const editSplit = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            const docSplit = await getSplits(privateUserSplitsDocRef);
            let currentSplits = docSplit.exists() ? docSplit.data().splits : [];
            // remove old split
            currentSplits = currentSplits.filter(split => split.splitName !== data.splitName);
            //add updated split
            currentSplits.push(data);
            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const addExercise = async (splitName, dayName, exercise) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            const docSplit = await getSplits(privateUserSplitsDocRef);
            let currentSplits = docSnap.exists() ? docSnap.data().splits : [];

            // Find the specified split
            const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
            if (splitIndex !== -1) {
                // Find the specified day in the split
                const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
                if (dayIndex !== -1) {
                    // Add the exercise to the day's exercises
                    currentSplits[splitIndex].days[dayIndex].exercises.push(exercise);
                } else {
                    console.error('Day not found: ', dayName);
                }
            } else {
                console.error('Split not found: ', splitName);
            }

            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const deleteExercise = async (splitName, dayName, exerciseName) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            // Fetch the current splits
            const docSnap = await getDoc(privateUserSplitsDocRef);
            let currentSplits = docSnap.exists() ? docSnap.data().splits : [];

            // Find the specified split
            const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
            if (splitIndex !== -1) {
                // Find the specified day in the split
                const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
                if (dayIndex !== -1) {
                    // Remove the exercise from the day's exercises
                    currentSplits[splitIndex].days[dayIndex].exercises = currentSplits[splitIndex].days[dayIndex].exercises.filter(exercise => exercise.exerciseName !== exerciseName);
                } else {
                    console.error('Day not found');
                    return;
                }
            } else {
                console.error('Split not found');
                return;
            }

            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const editExercise = async (splitName, dayName, updatedExercise) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateUserSplitsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'private', 'splits');
        try {
            // Fetch the current splits
            const docSnap = await getDoc(privateUserSplitsDocRef);
            let currentSplits = docSnap.exists() ? docSnap.data().splits : [];

            // Find the specified split
            const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
            if (splitIndex !== -1) {
                // Find the specified day in the split
                const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
                if (dayIndex !== -1) {
                    // Find the specified exercise in the day's exercises
                    const exerciseIndex = currentSplits[splitIndex].days[dayIndex].exercises.findIndex(exercise => exercise.exerciseName === updatedExercise.exerciseName);
                    if (exerciseIndex !== -1) {
                        // Update the exercise
                        currentSplits[splitIndex].days[dayIndex].exercises[exerciseIndex] = updatedExercise;
                    } else {
                        console.error('Exercise not found');
                        return;
                    }
                } else {
                    console.error('Day not found');
                    return;
                }
            } else {
                console.error('Split not found');
                return;
            }
            // Save to local storage
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(currentSplits));
            // Update Firestore document
            await updateDoc(privateUserSplitsDocRef, { splits: currentSplits });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};