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

// checks if day exists in split
export const dayExist = async (splitName, dayName) => {
    let currentSplits = await getSplits();
    currentSplits = currentSplits.splits;
    // Find the specified split
    const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
    if (splitIndex !== -1) {
        // Find the specified day in the split
        const dayIndex = currentSplits[splitIndex].days.findIndex(day => day.dayName === dayName);
        if (dayIndex !== -1) {
            return true;
        } else {
            return false;
        }
    } else {
        console.log('Split not found');
        return false;
    }
};

// adds new day to active split
export const addDayNameActive = async (dayName) => {
    try {
        // Retrieve the active split
        const activeSplit = await getActiveSplit();
        
        // Create a new day object
        const newDay = { dayName: dayName, exercises: [] };
        
        // Add the new day to the active split's days array
        activeSplit.days.push(newDay);
        
        // Save the updated splits
        await setActiveSplit(activeSplit);
    } catch (error) {
        console.error('Error adding new day to active split:', error);
        throw error;
    }
};

// adds new day to private split
export const addDayNamePrivate = async (splitName, dayName) => {
    let currentSplits = await getSplits();
    currentSplits = currentSplits.splits;
    // Create a new day object
    const newDay = { dayName: dayName, exercises: [] };
    // Find the specified split
    const splitIndex = currentSplits.findIndex(split => split.splitName === splitName);
    if (splitIndex !== -1) {
        // Find the specified day in the split
        currentSplits[splitIndex].days.push(newDay);
        
    } else {
        console.log('Split not found');
    }
    const updatedSplits = { splits: currentSplits };
    await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
};


// adds split in private splits
export const addSplitPrivate = async (newSplitName) => {
    try {
        // Retrieve all existing splits
        let currentSplits = await getSplits();
        currentSplits = currentSplits.splits;
        // Create a new split object
        const newSplit = { splitName: newSplitName, days: [] };
        
        // Add the new split to the existing splits array
        currentSplits.push(newSplit);
        
        const updatedSplits = { splits: currentSplits };
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
        
        console.log(`New split '${newSplitName}' added to private splits`);
    } catch (error) {
        console.error('Error adding new split to private splits:', error);
        throw error;
    }
};

// checks if split name exists
export const splitNameExist = async (splitName) => {
    try {
        let currentSplits = await getSplits();
        currentSplits = currentSplits.splits;
        
        // Check if any split already has the provided splitName
        const splitExists = currentSplits.some(split => split.splitName === splitName);
        
        return splitExists;
    } catch (error) {
        console.error('Error checking split name existence:', error);
        throw error;
    }
    
};

// removes a split
export const removeSplit = async (splitName) => {
    try {
        let currentSplits = await getSplits();
        currentSplits = currentSplits.splits;
        currentSplits = currentSplits.filter(split => split.splitName !== splitName);

        // Save the updated splits
        const updatedSplits = { splits: currentSplits };
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);
    } catch (error) {
        console.error('Error removing split:', error);
        throw error;
    }
};


export const editSplitNamePrivate = async (oldSplitName, newSplitName) => {
    try {
        // Get all splits
        let currentSplits = await getSplits();
        currentSplits = currentSplits.splits;

        // Find the split with the oldSplitName
        const splitIndex = currentSplits.findIndex(split => split.splitName === oldSplitName);

        if (splitIndex === -1) {
            console.error(`Split with name "${oldSplitName}" not found.`);
            return;
        }

        // Update the split's name
        currentSplits[splitIndex].splitName = newSplitName;

        // Save the updated splits
        const updatedSplits = { splits: currentSplits };
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);

        console.log(`Split name updated from "${oldSplitName}" to "${newSplitName}" successfully.`);
    } catch (error) {
        console.error('Failed to edit split name:', error);
    }
};