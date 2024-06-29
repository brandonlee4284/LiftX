import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAsyncCloud, setAsyncCloud } from './helperFuncs';
import { getActiveSplit, setActiveSplit } from './profile';

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

// gets all private user split data
export const getSplits = async () => {
    return await fetchAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits');
};


// returns an array of how many days are in each split
export const getSplitDescriptions = async () => {
    try {
        // Fetch the splits data
        const privateUserSplits = await getSplits();
        
        // Log the fetched splits data for debugging
        
        // Check if privateUserSplits is valid and contains the splits array
        if (privateUserSplits && Array.isArray(privateUserSplits.splits)) {
            // Map over each split and get the number of days in each
            const splitDescriptions = privateUserSplits.splits.map(split => split.days.length);
            // Return the array of day counts
            return splitDescriptions;
        } else {
            console.warn('No valid splits found or splits data is not in expected format');
            return [];
        }
    } catch (error) {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching splits:', error);
        return [];
    }
};

// adds a empty split w default name "New Split"
export const addSplits = async () => {
    const newSplit =
    {
        splitName: "New Split",
        days: [],
    }
    const docSnap = await getSplits();
    let currentSplits = docSnap.exists() ? docSnap.data().splits : [];
    currentSplits.push(newSplit)
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};

export const deleteSplit = async (data) => {
    const docSnap = await getSplits();
    let currentSplits = docSnap.exists() ? docSnap.data().splits : [];
    currentSplits = currentSplits.filter(split => split.splitName !== data.splitName);
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};

export const editSplit = async (data) => {
    let currentSplits = await getSplits();
    // remove old split
    currentSplits = currentSplits.splits.filter(split => split.splitName !== data.splitName);
    //add updated split
    currentSplits.push(data);
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};


export const addExercise = async (splitName, dayName, exercise) => {
    const docSnap = await getSplits();
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
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};

export const deleteExercise = async (splitName, dayName, exerciseName) => {
    const docSnap = await getSplits();
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
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};

export const editExercise = async (splitName, dayName, updatedExercise) => {
    const docSnap = await getSplits();
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
    setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', currentSplits);
};

// updates the entire exercise array for private split
export const updateExercises = async (splitName, dayName, updatedExercises) => {
    let currentSplits = await getSplits();
    currentSplits = currentSplits.splits;
    // Find the specified split
    const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
    if (splitIndex !== -1) {
        // Find the specified day in the split
        const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
        if (dayIndex !== -1) {
            
            currentSplits[splitIndex].days[dayIndex].exercises = updatedExercises;
            

        } else {
            console.error('Day not found');
            return;
        }
    } else {
        console.error('Split not found');
        return;
    }
    const updatedSplits = { splits: currentSplits };
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
};

// updates the entire exercise array for active split
export const updateActiveSplitExercises = async (dayName, updatedExercises) => {
    let activeSplit = await getActiveSplit();
    const dayIndex = activeSplit.days.findIndex(day => day.dayName === dayName);
    if (dayIndex !== -1) {
        activeSplit.days[dayIndex].exercises = updatedExercises;
        setActiveSplit(activeSplit);
    } else {
        console.error('Day not found');
        return;
    }
};


// edit day name for private split (must call this before any exercise updates)
export const editDayName = async (splitName, oldDayName, newDayName) => {
    let currentSplits = await getSplits();
    currentSplits = currentSplits.splits;
    // Find the specified split
    const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
    if (splitIndex !== -1) {
        // Find the specified day in the split
        const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === oldDayName);
        if (dayIndex !== -1) {
            
            currentSplits[splitIndex].days[dayIndex].dayName = newDayName;
            

        } else {
            console.error('Day not found');
            return;
        }
    } else {
        console.error('Split not found');
        return;
    }
    const updatedSplits = { splits: currentSplits };
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
};

// edit day name for active split (must call this before any exercise updates)
export const editActiveSplitDayName = async (oldDayName, newDayName) => {
    let activeSplit = await getActiveSplit();
    const dayIndex = activeSplit.days.findIndex(day => day.dayName === oldDayName);
    if (dayIndex !== -1) {
        activeSplit.days[dayIndex].dayName = newDayName;
        setActiveSplit(activeSplit);
    } else {
        console.error('Day not found');
        return;
    }
};

// delete a day workout in private split
export const deleteDayPrivate = async (splitName, dayName) => {
    let currentSplits = await getSplits();
    currentSplits = currentSplits.splits;
    // Find the specified split
    const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
    if (splitIndex !== -1) {
        // Find the specified day in the split
        const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
        if (dayIndex !== -1) {
            currentSplits[splitIndex].days.splice(dayIndex, 1);
        } else {
            console.error('Day not found');
            return;
        }
    } else {
        console.error('Split not found');
        return;
    }
    const updatedSplits = { splits: currentSplits };
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
};

// delete a day workout in active split
export const deleteDayActive = async (dayName) => {
    let activeSplit = await getActiveSplit();
    const dayIndex = activeSplit.days.findIndex(day => day.dayName === dayName);
    if (dayIndex !== -1) {
        activeSplit.days.splice(dayIndex, 1);
        setActiveSplit(activeSplit);
    } else {
        console.error('Day not found');
        return;
    }
};

// edits split name private
export const editSplitNamePrivate = async (oldSplitName, newSplitName) => {
    const docSnap = await getSplits();
    
};

// edits split name active 
export const editSplitNameActive = async (oldSplitName, newSplitName) => {
    const docSnap = await getSplits();
    
};
