
// Update the user's split data in Firestore and local storage
export const createSplits = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateDataDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'splits');
        try {
            await AsyncStorage.setItem('@PrivateUserSplits', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving private splits to local storage: ', e)
        }

        try {
            await setDoc(privateDataDocRef, data);
        } catch (error) {
            console.error('Error updating private splits: ', error);
        }
    }
};
