import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPublicUser, createPrivateUser, fetchPublicUserData } from './profile';
import { createPrivateSplits } from './splits';
import { createPrivateFriends } from './friends';
import { createPrivateWorkout } from './workout';
import { clearAsyncStorage } from "./helperFuncs";
import dayjs from "dayjs";
import { getFirestore, collection, query, where, getDocs, addDoc } from 'firebase/firestore'; // Import Firestore utilities


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
    showNotification(error.message, "rgb(114, 47, 55)");
    setErrorMessage(error.message);
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

  if (username.length > 30) {
    showNotification("Username cannot exceed 30 characters", "rgb(114, 47, 55)");
    setErrorMessage("Username cannot exceed 30 characters");
    return;
  }

  // Check if the name contains only letters
  if (!/^[a-zA-Z]+$/.test(name)) {
    showNotification("Name can only contain letters", "rgb(114, 47, 55)");
    setErrorMessage("Name can only contain letters");
    return;
  }
  
  if (name.length > 30) {
    showNotification("Display name cannot exceed 30 characters", "rgb(114, 47, 55)");
    setErrorMessage("Display name cannot exceed 30 characters");
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
          displayName: name,
          username: username,
          bio: "This is a sample bio.", // Placeholder bio
          profilePicture: null, // Placeholder image
          numFriends: 0,
          displayScore: { overall: {score: 0, change: 0}, chest: {score: 0, change: 0}, back: {score: 0, change: 0}, legs: {score: 0, change: 0}, shoulders: {score: 0, change: 0}, arms: {score: 0, change: 0} },
          activeSplit: {
            splitName: "PPL",
            days: [
              {
                dayName: "push",
                exercises: [
                  { name: "bench", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                  { name: "overhead press", sets: 3, reps: 12, weight: 95, notes: "on cables" },
                  { name: "tricep pushdown", sets: 3, reps: 12, weight: 50, notes: "on cables" },
                ]
              },
              {
                dayName: "pull",
                exercises: [
                  { name: "deadlift", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                  { name: "pullups", sets: 3, reps: 12, weight: 0, notes: "on bar" },
                  { name: "rows", sets: 3, reps: 12, weight: 95, notes: "use barbells" },
                ]
              },
              {
                dayName: "legs",
                exercises: [
                  { name: "squats", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                  { name: "leg press", sets: 3, reps: 12, weight: 180, notes: "on machine"  },
                  { name: "leg curls", sets: 3, reps: 12, weight: 50, notes: "on machine"  },
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
                  dayName: "push",
                  exercises: [
                    { name: "bench", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                    { name: "overhead press", sets: 3, reps: 12, weight: 95, notes: "on cables" },
                    { name: "tricep pushdown", sets: 3, reps: 12, weight: 50, notes: "on cables" },
                  ]
                },
                {
                  dayName: "pull",
                  exercises: [
                    { name: "deadlift", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                    { name: "pullups", sets: 3, reps: 12, weight: 0, notes: "on bar" },
                    { name: "rows", sets: 3, reps: 12, weight: 95, notes: "using barbell" },
                  ]
                },
                {
                  dayName: "legs",
                  exercises: [
                    { name: "squats", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                    { name: "leg press", sets: 3, reps: 12, weight: 180, notes: "on machine" },
                    { name: "leg curls", sets: 3, reps: 12, weight: 50, notes: "on machine" },
                  ]
                }
              ],
            },

            {
              splitName: "Upper/Lower",
              days: [
                {
                  dayName: "upper",
                  exercises: [
                    { name: "bench", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                    { name: "overhead press", sets: 3, reps: 12, weight: 95, notes: "on cable" },
                    { name: "tricep pushdown", sets: 3, reps: 12, weight: 50, notes: "on cable" },
                  ]
                },
                {
                  dayName: "lower",
                  exercises: [
                    { name: "deadlift", sets: 3, reps: 12, weight: 135, notes: "working sets only" },
                    { name: "pullups", sets: 3, reps: 12, weight: 0, notes: "on bar" },
                    { name: "rows", sets: 3, reps: 12, weight: 95, notes: "using barbell" },
                  ]
                },
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
                  console.log('User data saved successfully');
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

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(FIREBASE_AUTH, email);
  } catch (error) {
    throw error;
  }
};