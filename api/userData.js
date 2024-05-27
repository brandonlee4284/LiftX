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


// Fetch the user's public data from Firestore (username, strength levels, bio, etc.)
export const fetchPublicUserData = async () => {
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

export const updatePublicUserData = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
        try {
            await setDoc(userDocRef, data);
        } catch (error) {
            console.error('Error updating public data: ', error);
        }
    }
}

// Fetch the user's private workout data from Firestore (1rm stats and history)
export const fetchPrivateUserData = async () => {
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

export const updatePrivateUserData = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'data');
        try {
            await setDoc(privateDataDocRef, data);
        } catch (error) {
            console.error('Error updating private data: ', error);
        }
    }
};

// Fetch the user's split data from Firestore (split names and days)
export const fetchPrivateUserSplits = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'splits');
        try {
            const docData = await getDoc(privateDataDocRef);
            if (docData.exists()) {
                const data = docData.data();
                return convertSplitsTo3DArray(data.splits);
            } else {
                console.log('No such document!');
            }
        } catch (error) {
            console.error('Error fetching private data: ', error);
        }
    }
    return null;
};

export const updatePrivateUserSplits = async (data) => {
    const splits = convert3DArrayToSplits(data);
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'splits');
        try {
            await setDoc(privateDataDocRef, { splits }, { merge: true });
        } catch (error) {
            console.error('Error updating private data: ', error);
        }
    }
};