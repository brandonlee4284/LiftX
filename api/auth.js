import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPublicUser, createPrivateUser, fetchPublicUserData, getUsername } from './profile';
import { createPrivateSplits } from './splits';
import { createPrivateFriends } from './friends';
import { createPrivateWorkout } from './workout';
import { clearAsyncStorage } from "./helperFuncs";
import dayjs from "dayjs";
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'; // Import Firestore utilities
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

// Login user with email and password
export const loginUser = async (email, password, setErrorMessage, showNotification) => {
  const auth = FIREBASE_AUTH;
  
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if the email is verified
    if (!userCredential.user.emailVerified) {
      showNotification("Please verify your email before logging in.", "rgb(114, 47, 55)");
      setErrorMessage("Please verify your email before logging in.");
      await auth.signOut(); // Sign out the user
      return;
    }

    // Delete user data from local storage
    await clearAsyncStorage();

    // Get user data from Firestore and save to local storage
    await fetchPublicUserData();
  } catch (error) {
    const customMessage = "Invalid email or password. Try again.";
    showNotification(customMessage, "rgb(114, 47, 55)");
    setErrorMessage(customMessage);
    //showNotification(error.message, "rgb(114, 47, 55)");
    //setErrorMessage(error.message);
  }
};

export const createNewUser = async (gender = "male", weight = 135, age, name, username, email, password, setErrorMessage, navigation, showNotification) => {
  const auth = FIREBASE_AUTH;
  const db = getFirestore();

  // Check if any required field is empty
  if (!username.trim() || !email.trim() || !password.trim() || !name.trim()) {
    showNotification("All fields are required", "rgb(114, 47, 55)");
    setErrorMessage("All fields are required");
    return;
  }

  if (username.length > 25) {
    showNotification("Username cannot exceed 25 characters", "rgb(114, 47, 55)");
    setErrorMessage("Username cannot exceed 25 characters");
    return;
  }

  // Check if the name contains only letters
  if (!/^[a-zA-Z\s]+$/.test(name)) {
    showNotification("Display name can only contain letters and/or a space", "rgb(114, 47, 55)");
    setErrorMessage("Display name can only contain letters and/or a space");
    return;
  }
  
  if (name.length > 25) {
    showNotification("Display name cannot exceed 25 characters", "rgb(114, 47, 55)");
    setErrorMessage("Display name cannot exceed 25 characters");
    return;
  }

  // Check if the username contains only lowercase letters, numbers, periods, and underscores
  if (!/^[a-z0-9._]+$/.test(username)) {
    showNotification("Username can only contain lowercase letters, numbers, periods, and underscores", "rgb(114, 47, 55)");
    setErrorMessage("Username can only contain lowercase letters, numbers, periods, and underscores");
    return;
  }

  // Check if the username contains white spaces
  if (/\s/.test(username)) {
    showNotification("Username has invalid characters", "rgb(114, 47, 55)");
    setErrorMessage("Username has invalid characters");
    return;
  }

  // Check if the username already exists
  const usernamesRef = collection(db, 'usernames'); // Adjust this to your actual collection name
  const usernameQuery = query(usernamesRef, where('username', '==', username));
  const querySnapshot = await getDocs(usernameQuery);
  if (!querySnapshot.empty) {
    showNotification("Username already exists! Please try another one.", "rgb(114, 47, 55)");
    setErrorMessage("Username already exists! Please try another one.");
    return;
  }

  try {
    await addDoc(usernamesRef, { username: username });
  } catch (error) {
    console.log(error);
    showNotification("Error saving username. Please try again.", "rgb(114, 47, 55)");
    setErrorMessage("Error saving username. Please try again.");
    return;
  }

  navigation.navigate("Login", {showNotification: {message: "Email Verification Sent! Please check your email", color: "#50C878"}});
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      sendEmailVerification(userCredential.user); // Send verification email
      try {
        // Initialize schema for new user

        let initPublicUser = {
          displayName: name.trim(),
          username: username,
          bio: "Bio", // Placeholder bio
          profilePicture: null, // Placeholder image
          numFriends: 0,
          displayScore: { overall: {score: 0, change: 0}, chest: {score: 0, change: 0}, back: {score: 0, change: 0}, legs: {score: 0, change: 0}, shoulders: {score: 0, change: 0}, arms: {score: 0, change: 0} },
          activeSplit: {
            splitName: "PPL",
            days: [
              {
                dayName: "Push",
                exercises: [
                  { name: "Bench", sets: 3, reps: 5, weight: 165, notes: "Working sets only" },
                  { name: "Incline Dumbbell Press", sets: 3, reps: 8, weight: 70, notes: "" },
                  { name: "Dumbbell Shoulder Press", sets: 2, reps: 6, weight: 55, notes: "" },
                  { name: "Cable Lateral Raise", sets: 3, reps: 6, weight: 15, notes: "To failure" },
                  { name: "JM Press", sets: 3, reps: 6, weight: 105, notes: "On smith machine" },
                  { name: "Tricep Pressdown", sets: 3, reps: 12, weight: 50, notes: "On cables" },
                ]
              },
              {
                dayName: "Pull",
                exercises: [
                  { name: "Lat Pulldown", sets: 3, reps: 6, weight: 145, notes: "" },
                  { name: "One Arm Seated Cable Row", sets: 2, reps: 8, weight: 55, notes: "Working sets" },
                  { name: "One Arm Lat Pulldown", sets: 2, reps: 8, weight: 155, notes: "Machine" },
                  { name: "Preacher Curl", sets: 2, reps: 8, weight: 100, notes: "Machine" },
                  { name: "Dumbbell Hammer Curl", sets: 2, reps: 8, weight: 35, notes: "" },
                  { name: "Reverse Curl", sets: 2, reps: 8, weight: 27.5, notes: "Cable" },
                ]
              },
              {
                dayName: "Legs",
                exercises: [
                  { name: "Machine Calf Raise", sets: 3, reps: 8, weight: 100, notes: "" },
                  { name: "Hamstring Curl", sets: 3, reps: 8, weight: 130, notes: ""  },
                  { name: "Squat", sets: 2, reps: 6, weight: 225, notes: "Working sets"  },
                  { name: "Hip Abduction", sets: 2, reps: 6, weight: 215, notes: ""  },
                  { name: "Leg Extension", sets: 2, reps: 6, weight: 160, notes: ""  },
                  { name: "Cable Crunches", sets: 3, reps: 10, weight: 70, notes: ""  },
                ]
              }
            ],
          },
          privateActiveSplitMode: false, // Controls display active split
          privateScoreMode: false, // Controls display scores
          onboardingCompleted: false,
        };

        let initPrivateUserData = {
          gender: gender,
          weight: weight,
          age: age,
          email: email,
        };

        let initPrivateUserSplits = {
          splits: [
            {
              splitName: "PPL",
              days: [
                {
                  dayName: "Push",
                  exercises: [
                    { name: "Bench", sets: 3, reps: 5, weight: 165, notes: "Working sets only" },
                    { name: "Incline Dumbbell Press", sets: 3, reps: 8, weight: 70, notes: "" },
                    { name: "Dumbbell Shoulder Press", sets: 2, reps: 6, weight: 55, notes: "" },
                    { name: "Cable Lateral Raise", sets: 3, reps: 6, weight: 15, notes: "To failure" },
                    { name: "JM Press", sets: 3, reps: 6, weight: 105, notes: "On smith machine" },
                    { name: "Tricep Pressdown", sets: 3, reps: 12, weight: 50, notes: "On cables" },
                  ]
                },
                {
                  dayName: "Pull",
                  exercises: [
                    { name: "Lat Pulldown", sets: 3, reps: 6, weight: 145, notes: "" },
                    { name: "One Arm Seated Cable Row", sets: 2, reps: 8, weight: 55, notes: "Working sets" },
                    { name: "One Arm Lat Pulldown", sets: 2, reps: 8, weight: 155, notes: "Machine" },
                    { name: "Preacher Curl", sets: 2, reps: 8, weight: 100, notes: "Machine" },
                    { name: "Dumbbell Hammer Curl", sets: 2, reps: 8, weight: 35, notes: "" },
                    { name: "Reverse Curl", sets: 2, reps: 8, weight: 27.5, notes: "Cable" },
                  ]
                },
                {
                  dayName: "Legs",
                  exercises: [
                    { name: "Machine Calf Raise", sets: 3, reps: 8, weight: 100, notes: "" },
                    { name: "Hamstring Curl", sets: 3, reps: 8, weight: 130, notes: ""  },
                    { name: "Squat", sets: 2, reps: 6, weight: 225, notes: "Working sets"  },
                    { name: "Hip Abduction", sets: 2, reps: 6, weight: 215, notes: ""  },
                    { name: "Leg Extension", sets: 2, reps: 6, weight: 160, notes: ""  },
                    { name: "Cable Crunches", sets: 3, reps: 10, weight: 70, notes: ""  },
                  ]
                }
              ],
            },

           
          ],
        };

        let initPrivateFriendsData = {
          friendList: [],
          friendRequestsSent: [],
          friendRequestsReceived: [],
        };

        let initPrivateWorkoutData = {
          stats: {},
          overallScore: {
            overall: { score: 0, change: 0 },
            chest: { score: 0, change: 0 },
            back: { score: 0, change: 0 },
            legs: { score: 0, change: 0 },
            shoulders: { score: 0, change: 0 },
            arms: { score: 0, change: 0 },
            core: { score: 0, change: 0 },
          },
        };

        createPublicUser(initPublicUser).then(
          createPrivateUser(initPrivateUserData).then(
            createPrivateSplits(initPrivateUserSplits).then(
              createPrivateFriends(initPrivateFriendsData).then(
                createPrivateWorkout(initPrivateWorkoutData).then(() => {
                  //console.log('User data saved successfully');
                  //navigation.navigate('Login'); // Redirect to login screen
                })
              )
            )
          )
        );
      } catch (error) {
        console.error('Error saving user data: ', error);
      }
    })
    .catch(error => setErrorMessage(error.message));
};

export const logoutUser = async () => {
  // Delete user data from local storage
  await clearAsyncStorage();
  FIREBASE_AUTH.signOut();
};

export const deleteUser = async () => {
  try {
    // Get the current user
    const user = FIREBASE_AUTH.currentUser;

    if (!user) {
      console.error('No user is logged in.');
      return;
    }

    const username = await getUsername();
    //console.log(username)

    // Step 1: Delete profile picture from Firebase Storage (if exists)
    
    if (username) {
      const profilePictureRef = ref(FIREBASE_STORAGE, `/profile_pictures/${username}.jpg`);
      try {
        await deleteObject(profilePictureRef);
        //console.log('Profile picture deleted');
      } catch (error) {
        console.warn('Profile picture not found or already deleted:', error.message);
      }
    }
    

    // Step 2: Delete user data from Firestore
    try {
      const userDocRef = doc(FIRESTORE_DB, 'users', FIREBASE_AUTH.currentUser.uid); // Adjust the 'users' collection path if different
      await deleteDoc(userDocRef);
      //console.log('User data deleted from Firestore');
    } catch (error) {
      console.warn('Failed to delete Firestore data:', error.message);
    }

    // Step 3: Delete the user's username from the `usernames` collection
    try {
      const usernamesRef = collection(FIRESTORE_DB, 'usernames'); // Adjust this to your actual collection name
      const usernameQuery = query(usernamesRef, where('username', '==', username)); // Assuming you store `uid` alongside the username
      const querySnapshot = await getDocs(usernameQuery);

      if (!querySnapshot.empty) {
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(docSnap.ref); // Delete each matching document
        }
        //console.log('Username deleted from usernames collection');
      } else {
        console.warn('No username found for this user in the usernames collection');
      }
    } catch (error) {
      console.warn('Failed to delete username:', error.message);
    }

    // Step 3: Sign out the user
    await FIREBASE_AUTH.signOut();
    //console.log('User signed out');

    // Step 4: Delete user account from Firebase Authentication
    try {
      await user.delete();
      //console.log('User account deleted from Firebase Authentication');
    } catch (error) {
      console.error('Failed to delete user account:', error.message);
    }

    // Step 5: Clear local storage
    await clearAsyncStorage();
  } catch (error) {
    console.error('Error deleting user:', error.message);
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(FIREBASE_AUTH, email);
  } catch (error) {
    throw error;
  }
};