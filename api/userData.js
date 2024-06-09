import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const convertSplitsTo3DArray = (splits) => {
    return splits.order.map(splitIndex => {
        const split = splits[splitIndex];
        return {
            splitName: split.splitName,
            days: split.day.order.map(dayIndex => {
                const day = split.day[dayIndex];
                return {
                    dayName: day.dayName,
                    exercises: day.exercises.order.map(exerciseIndex => {
                        return day.exercises[exerciseIndex];
                    })
                };
            })
        };
    });
};

export const convert3DArrayToSplits = (array) => {
    const splits = {};
    const splitOrder = [];

    array.forEach((split, splitIndex) => {
        splitOrder.push(splitIndex);
        splits[splitIndex] = {
            splitName: split.splitName,
            day: {
                order: []
            }
        };

        split.days.forEach((day, dayIndex) => {
            splits[splitIndex].day.order.push(dayIndex);
            splits[splitIndex].day[dayIndex] = {
                dayName: day.dayName,
                exercises: {
                    order: []
                }
            };

            day.exercises.forEach((exercise, exerciseIndex) => {
                splits[splitIndex].day[dayIndex].exercises.order.push(exerciseIndex);
                splits[splitIndex].day[dayIndex].exercises[exerciseIndex] = exercise;
            });
        });
    });

    splits.order = splitOrder;
    return splits;
};

// Fetch the user's public data from cloud db (Firestore) 
export const cloudFetchPublicUserData = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        try {
            const docData = await getDoc(userDocRef);
            if (docData.exists()) {
                return docData.data();
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching public data: ', error);
        }
    }
};

// Fetch the user's public data, attempts to use local storage (username, strength levels, bio, etc.)
export const fetchPublicUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@PublicUserData');
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }
        console.log('Local storage empty, reverting to cloud backup');
        return await cloudFetchPublicUserData();
    } catch (e) {
        console.log('Error fetching public data from local storage, reverting to cloud backup: ', e);
        return await cloudFetchPublicUserData();
    }
};

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

// Cloud fetch for private user data
const cloudFetchPrivateUserData = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
        try {
            const docData = await getDoc(privateDataDocRef);
            if (docData.exists()) {
                return docData.data();
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching private data: ', error);
        }
    }
    return null;
};

// Update the user's public data in the cloud (Firestore) and local storage
export const fetchPrivateUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@PrivateUserData');
        if (jsonValue != null) {
            return JSON.parse(jsonValue);
        }
        console.log('Local storage empty, reverting to cloud backup');
        return await cloudFetchPrivateUserData();
    } catch (e) {
        console.log('Error fetching private data from local storage, reverting to cloud backup: ', e);
        return await cloudFetchPrivateUserData();
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

// Cloud fetch for private user splits
const cloudFetchPrivateUserSplits = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'splits');
        try {
            const docData = await getDoc(privateDataDocRef);
            if (docData.exists()) {
                const data = docData.data();
                return convertSplitsTo3DArray(data.splits.splits);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching private data: ', error);
        }
    }
    return null;
};

// Fetch the user's split data from local storage or Firestore
export const fetchPrivateUserSplits = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('@PrivateUserSplits');
        if (jsonValue != null) {
            data = convertSplitsTo3DArray(JSON.parse(jsonValue));
        } else {
            console.log('Local storage empty, reverting to cloud backup');
            data = await cloudFetchPrivateUserSplits();
        }

        return data;
    } catch (e) {
        console.log('Error fetching private splits from local storage, reverting to cloud backup: ', e);
        return await cloudFetchPrivateUserSplits();
    }
};

// Update the user's split data in Firestore and local storage
export const updatePrivateUserSplits = async (data, flat = false) => {
    const splits = (!flat) ? convert3DArrayToSplits(data) : data;
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'splits');
        try {
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(splits));
        } catch (e) {
            console.log('Error saving private splits to local storage: ', e)
        }

        try {
            await setDoc(privateDataDocRef, { splits }, { merge: true });
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};

export const logoutUser = async () => {
    try {
        await AsyncStorage.clear();
        // Navigate to login screen or any other action needed on logout
        // Example: navigation.navigate('LoginScreen');
    } catch (error) {
        console.error('Error clearing local storage: ', error);
    }
};