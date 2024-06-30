import { getDoc, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Update the user's friends data in Firestore and local storage
export const createPrivateFriends = async (data) => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const privateFriendsDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'public', 'friends');
        try {
            await AsyncStorage.setItem('@PublicUserFriends', JSON.stringify(data));
        } catch (e) {
            console.log('Error saving public friends to local storage: ', e)
        }

        try {
            await setDoc(privateFriendsDocRef, data);
        } catch (error) {
            console.error('Error updating public friends: ', error);
        }
    }
};

const synchronizeFriends = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const userRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqSent');
    const receivedRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqReceived');
    const friendsRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fList');

    try {
        const userDoc = await getDoc(userRef);
        const receivedDoc = await getDoc(receivedRef);

        if (!userDoc.exists || !receivedDoc.exists) return;

        const sentRequests = userDoc.data().friendRequests || [];
        const receivedRequests = receivedDoc.data().friendRequests || [];

        const updatedSentRequests = [...sentRequests];
        const updatedReceivedRequests = [...receivedRequests];

        sentRequests.forEach((sentRequest) => {
            const match = receivedRequests.find(
                (receivedRequest) =>
                    receivedRequest.senderUid === sentRequest.receiverUid &&
                    receivedRequest.receiverUid === sentRequest.senderUid
            );

            if (match) {
                // Add to friend list
                const newFriend = {
                    uid: sentRequest.receiverUid,
                    username: sentRequest.receiverUsername
                };

                // Update the friend list
                updateDoc(friendsRef, {
                    friends: arrayUnion(newFriend)
                });

                // Remove matched requests
                updateDoc(userRef, {
                    friendRequests: arrayRemove(sentRequest)
                });

                updateDoc(receivedRef, {
                    friendRequests: arrayRemove(match)
                });
            }
        });

        console.log('Synchronization complete');
    } catch (error) {
        console.error('Error synchronizing friends:', error);
    }
};

const sendFriendRequest = async (receiverUid, receiverUsername) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const senderUid = user.uid;
    const senderUsername = user.displayName; // Assuming username is stored in displayName
    const timestamp = new Date().toISOString();

    const senderRef = doc(FIRESTORE_DB, 'users', senderUid, 'friends', 'fReqSent');
    const receiverRef = doc(FIRESTORE_DB, 'users', receiverUid, 'friends', 'fReqReceived');

    const friendRequest = {
        senderUid,
        receiverUid,
        senderUsername,
        receiverUsername,
        timestamp
    };

    try {
        await updateDoc(senderRef, {
            friendRequests: arrayUnion(friendRequest)
        });

        await updateDoc(receiverRef, {
            friendRequests: arrayUnion(friendRequest)
        });

        console.log('Friend request sent');
    } catch (error) {
        console.error('Error sending friend request:', error);
    }
};

const acceptFriendRequest = async (senderUid, senderUsername) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const receiverUid = user.uid;
    const receiverUsername = user.displayName; // Assuming username is stored in displayName

    await sendFriendRequest(senderUid, receiverUsername);

    // Sync the friend lists
    await synchronizeFriends(receiverUid);
    await synchronizeFriends(senderUid);
};

const denyFriendRequest = async (senderUid) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const receiverUid = user.uid;

    const senderRef = doc(FIRESTORE_DB, 'users', senderUid, 'friends', 'fReqSent');
    const receiverRef = doc(FIRESTORE_DB, 'users', receiverUid, 'friends', 'fReqReceived');

    try {
        const receiverDoc = await getDoc(receiverRef);
        const receiverData = receiverDoc.data();
        const friendRequest = receiverData.friendRequests.find(req => req.senderUid === senderUid);

        if (!friendRequest) {
            console.error('Friend request not found');
            return;
        }

        await updateDoc(senderRef, {
            friendRequests: arrayRemove(friendRequest)
        });

        await updateDoc(receiverRef, {
            friendRequests: arrayRemove(friendRequest)
        });

        console.log('Friend request denied');
    } catch (error) {
        console.error('Error denying friend request:', error);
    }
};