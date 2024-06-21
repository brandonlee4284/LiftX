
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