import { getDoc, doc, setDoc, updateDoc, collection, query, where, getDocs, arrayUnion, arrayRemove, writeBatch } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../FirebaseConfig';
import { fetchAsyncCloud, setAsyncCloud } from './helperFuncs';
import { fetchPublicUserData, getDisplayName, getProfilePicture, getUsername } from './profile';


// Update the user's friends data in Firestore and local storage
export const createPrivateFriends = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
        const fReqReceivedDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqReceived');
        const fReqSentDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqSent');
        const fListDocRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fList');

        const initPrivateFriendsData = {
            friendRequests: []
        };

        const initFriendListData = {
            friends: []
        };

        try {
            await setDoc(fReqReceivedDocRef, initPrivateFriendsData);
            await setDoc(fReqSentDocRef, initPrivateFriendsData);
            await setDoc(fListDocRef, initFriendListData);

            setAsyncCloud(fReqSentDocRef, 'fReqSent', initPrivateFriendsData);
            setAsyncCloud(fListDocRef, 'fList', initFriendListData);
        } catch (e) {
            console.error('Error initializing private friends: ', e);
        }
    }
};

/*
export const synchronizeFriends = async () => {
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
*/

export const synchronizeFriends = async () => {
    const startSync = Date.now();
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const userRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqSent');
    const receivedRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqReceived');
    const friendsRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fList');

    try {
        const [userDoc, receivedDoc, publicUserData] = await Promise.all([getDoc(userRef), getDoc(receivedRef), fetchPublicUserData()]);

        if (!userDoc.exists || !receivedDoc.exists || !publicUserData) return;

        const sentRequests = userDoc.data().friendRequests || [];
        const receivedRequests = receivedDoc.data().friendRequests || [];

        const receivedMap = new Map(receivedRequests.map(req => [`${req.senderUid}-${req.receiverUid}`, req]));

        const batch = writeBatch(FIRESTORE_DB);
        let friendAdded = false;

        sentRequests.forEach((sentRequest) => {
            const matchKey = `${sentRequest.receiverUid}-${sentRequest.senderUid}`;
            const match = receivedMap.get(matchKey);

            if (match) {
                // Add to friend list
                const newFriend = {
                    uid: sentRequest.receiverUid,
                    username: sentRequest.receiverUsername
                };

                // Update the friend list
                batch.update(friendsRef, {
                    friends: arrayUnion(newFriend)
                });

                // Remove matched requests
                batch.update(userRef, {
                    friendRequests: arrayRemove(sentRequest)
                });

                batch.update(receivedRef, {
                    friendRequests: arrayRemove(match)
                });

                friendAdded = true;
            }
        });

        if (friendAdded) {
            // update friend count
            publicUserData.numFriends = publicUserData.numFriends + 1;
            await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid), '@PublicUserData', publicUserData);
        }

        await batch.commit();
        const endSync = Date.now();
        console.log(`Synchronization took ${endSync - startSync} ms`);
    } catch (error) {
        console.error('Error synchronizing friends:', error);
    }
};

export const sendFriendRequest = async (receiverUid, receiverUsername) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const senderUid = user.uid;
    const senderUsername = await getUsername();
    const senderPFP = await getProfilePicture();
    const senderDisplayName = await getDisplayName();
    const timestamp = new Date().toISOString();

    if (senderUid === receiverUid) {
        throw new Error('You cannot add yourself as a friend.');
    }

    const senderRef = doc(FIRESTORE_DB, 'users', senderUid, 'friends', 'fReqSent');
    const senderFriendRef = doc(FIRESTORE_DB, 'users', senderUid, 'friends', 'fList');
    const receiverRef = doc(FIRESTORE_DB, 'users', receiverUid, 'friends', 'fReqReceived');
    const receiverSentRef = doc(FIRESTORE_DB, 'users', receiverUid, 'friends', 'fReqSent');

    const friendRequest = {
        senderUid,
        receiverUid,
        senderUsername,
        receiverUsername,
        senderPFP,
        senderDisplayName,
        timestamp
        
    };

    try {
        // check if friend req already sent
        const receiverDoc = await getDoc(receiverRef);
        if (receiverDoc.exists()) {
            const data = receiverDoc.data();
            const existingRequests = data.friendRequests || [];
            
            // Check if a friend request from the sender already exists
            const alreadyRequested = existingRequests.some(request => request.senderUid === senderUid);
            if (alreadyRequested) {
                throw new Error('Friend request already sent.');
            }
        }

        // Check if the sender is already friends with the receiver
        const senderFriendsDoc = await getDoc(senderFriendRef);
        if (senderFriendsDoc.exists()) {
            const data = senderFriendsDoc.data();
            const friendsList = data.friends || [];
            const alreadyFriends = friendsList.some(friend => friend.uid === receiverUid);
            if (alreadyFriends) {
                throw new Error('This user is already your friend.');
            }
        }

        await updateDoc(senderRef, {
            friendRequests: arrayUnion(friendRequest)
        });

        await updateDoc(receiverRef, {
            friendRequests: arrayUnion(friendRequest)
        });

        console.log('Friend request sent');
    } catch (error) {
        //console.error('Error sending friend request:', error);
        throw error;
    }
};

export const acceptFriendRequest = async (senderUid, senderUsername) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return;

    const receiverUid = user.uid;
    const receiverUsername = await getUsername(); 

    await sendFriendRequest(senderUid, senderUsername);

    // Sync the friend lists
    await synchronizeFriends(receiverUid);
    await synchronizeFriends(senderUid);
};

export const denyFriendRequest = async (senderUid) => {
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

        try {
            await updateDoc(receiverRef, {
                friendRequests: arrayRemove(friendRequest)
            });
        } catch (error) {
            console.log('cannot write recieverRef');
        }
        
        console.log('Friend request denied');
    } catch (error) {
        console.error('Error denying friend request:', error);
    }
};



// gets fReqRecieved of the user
export const getFriendRequests = async () => {
    try {
        const user = FIREBASE_AUTH.currentUser;
        if (!user) throw new Error('User is not authenticated.');

        // Reference to the fReqReceived document in the friends sub-collection
        const friendRequestsRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fReqReceived');
        const friendRequestsDoc = await getDoc(friendRequestsRef);

        if (friendRequestsDoc.exists()) {
            // Retrieve and return the friendRequests array
            return friendRequestsDoc.data().friendRequests || [];
        } else {
            // If the document does not exist, return an empty array
            return [];
        }
    } catch (error) {
        console.error('Error fetching friend requests: ', error);
        throw error;
    }
};

// gets friends of the user logged in
export const getFriendList = async () => {
    try {
        const startSync = Date.now();
        const user = FIREBASE_AUTH.currentUser;
        if (!user) throw new Error('User is not authenticated.');

        // Reference to the fReqReceived document in the friends sub-collection
        const friendListRef = doc(FIRESTORE_DB, 'users', user.uid, 'friends', 'fList');
        // Use getDoc with caching enabled
        const friendListDoc = await getDoc(friendListRef, { source: 'cache' });
        
        if (!friendListDoc.exists()) {
            // If not in cache, fetch from server
            const friendListDocServer = await getDoc(friendListRef, { source: 'server' });
            if (friendListDocServer.exists()) {
                return friendListDocServer.data().friends || [];
            } else {
                return [];
            }
        }
        const endSync = Date.now();
        console.log(`Fetching Friend List took ${endSync - startSync} ms`);
        return friendListDoc.data().friends || [];
    } catch (error) {
        console.error('Error fetching friend list: ', error);
        throw error;
    }
};

// checks if the senderUsername is in fReqRecieved 
export const usernameRecieved = async (senderUsername) => {
    const user = FIREBASE_AUTH.currentUser;
    if (!user) return false; // or throw an error, depending on your needs

    const receiverUid = user.uid;
    const receiverRef = doc(FIRESTORE_DB, 'users', receiverUid, 'friends', 'fReqReceived');

    try {
        // Get the document for the received friend requests
        const receiverDoc = await getDoc(receiverRef);
        if (receiverDoc.exists()) {
            const data = receiverDoc.data();
            const existingRequests = data.friendRequests || [];

            // Check if a request from the given senderUsername exists
            const usernameExists = existingRequests.some(request => request.senderUsername === senderUsername);
            if(usernameExists){
                throw new Error('User has already sent you a friend request.');
            }
        } 
    } catch (error) {
        //console.error('Error checking friend request:', error);
        throw error; // Re-throw the error to handle it in your calling function
    }
};


export const getUserUIDByUsername = async (username) => {
    try {
        const usersRef = collection(FIRESTORE_DB, 'users');
        const q = query(usersRef, where('username', '==', username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Assuming usernames are unique, we'll take the first matching document
            const userDoc = querySnapshot.docs[0];
            return userDoc.id; // The document ID is the UID
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching user UID: ', error);
        throw error;
    }
};


// Get all details of the user with the given UID
export const getUserDetails = async (uid) => {  
    try {
        const startSync = Date.now();
        const userRef = doc(FIRESTORE_DB, 'users', uid);
        const userDoc = await getDoc(userRef, {
            fieldMask: ['profilePicture', 'displayName', 'numFriends', 'bio', 'activeSplit', 'displayScore']
        });

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const endSync = Date.now();
            console.log(`Fetching User Data took ${endSync - startSync} ms`);
            return {
                profilePicture: userData.profilePicture || null,
                displayName: userData.displayName || null,
                friendCount: userData.numFriends !== undefined ? userData.numFriends : null,
                bio: userData.bio || null,
                activeSplit: userData.activeSplit || null,
                displayScores: userData.displayScore
                    ? {
                        overall: userData.displayScore.overall.toFixed(1),
                        chest: userData.displayScore.chest.toFixed(1),
                        back: userData.displayScore.back.toFixed(1),
                        shoulders: userData.displayScore.shoulders.toFixed(1),
                        arms: userData.displayScore.arms.toFixed(1),
                        legs: userData.displayScore.legs.toFixed(1)
                    }
                    : null,
            };
            
        } else {
            return null;
        }
       
    } catch (error) {
        console.error('Error fetching user details: ', error);
        throw error;
    }
};

// adds friends active split to your private splits
export const downloadFriendSplit = async (friendUID) => {  
    try {
        // Retrieve the friend's active split
        const userRef = doc(FIRESTORE_DB, 'users', friendUID);
        const userDoc = await getDoc(userRef);
        const friendUserData = userDoc.data();
        
        if (!friendUserData.activeSplit) {
            console.error('Friend\'s active split not found');
            return;
        }

        
        const activeSplitData = friendUserData.activeSplit;

        // Get the current user's UID
        const currentUserUID = FIREBASE_AUTH.currentUser.uid;

        // Get the current user's splits
        const userSplitsRef = doc(FIRESTORE_DB, 'users', currentUserUID, 'private', 'splits');
        const userSplitsDoc = await getDoc(userSplitsRef);

        let currentSplits = userSplitsDoc.exists() ? userSplitsDoc.data().splits : [];

        // Check if the split name already exists
        const splitExists = currentSplits.some(split => split.splitName === activeSplitData.splitName);
        
        if (splitExists) {
            throw new Error('A split with this name already exists');
        }

        // Create the new split based on the friend's active split
        const newSplit = {
            splitName: activeSplitData.splitName,
            days: activeSplitData.days,
        };

        // Add the new split to the current user's splits
        currentSplits.push(newSplit);
        //console.log(currentSplits);
        // Update the user's splits in Firestore
        const updatedSplits = { splits: currentSplits };
        await setAsyncCloud(doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid, 'private', 'splits'), '@PrivateUserSplits', updatedSplits);

        console.log('Friend\'s split downloaded and added to your private splits');
        
    } catch (error) {
        throw error;
    }
};