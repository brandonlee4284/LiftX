export const logWorkout = async (workoutData) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const logDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'userData', 'logs', workoutData.date);
        try {
            await setDoc(logDocRef, workoutData);
        } catch (error) {
            console.error('Error logging workout: ', error);
        }
    }
}