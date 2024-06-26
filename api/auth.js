import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPublicUser, createPrivateUser } from './profile';
import { createPrivateSplits } from './splits';
import { createPrivateFriends } from './friends';
import { createPrivateWorkout } from './workout';

// Login user with email and password
export const loginUser = async (email, password, setErrorMessage) => {
  const auth = FIREBASE_AUTH;
  signInWithEmailAndPassword(auth, email, password).then(async () => {
    // Delete user data from local storage
    const keys = ['@PublicUser', '@PrivateUserData', '@PrivateUserSplits', '@PrivateUserFriends', '@PrivateUserWorkout']
    try {
      await AsyncStorage.multiRemove(keys)
    } catch (e) {
      console.log('Error removing user data from local storage: ', e);
    }
  }
  ).catch(error => setErrorMessage(error.message));
};

export const createNewUser = async (gender="male", weight=135, name, username, email, password, setErrorMessage, navigation) => {
  const auth = FIREBASE_AUTH;
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      try {
        // Initalize schema for new user

        let initPublicUser =
        {
          displayName: name,
          username: username,
          bio: "This is a sample bio.", // Placeholder bio
          profilePicture: null, // Placeholder image
          numFriends: 0,
          displayScore: { overall: 1.0, chest: 1.0, back: 1.0, legs: 1.0, shoulders: 1.0, arms: 1.0, core: 1.0 },
          activeSplit: {
            splitName: "PPL",
            days: [
              {
                dayName: "push",
                exercises: [
                  { name: "bench", sets: 3, reps: 12, weight: 135 },
                  { name: "overhead press", sets: 3, reps: 12, weight: 95 },
                  { name: "tricep pushdown", sets: 3, reps: 12, weight: 50 },
                ]
              },
              {
                dayName: "pull",
                exercises: [
                  { name: "deadlift", sets: 3, reps: 12, weight: 135 },
                  { name: "pullups", sets: 3, reps: 12, weight: 0 },
                  { name: "rows", sets: 3, reps: 12, weight: 95 },
                ]
              },
              {
                dayName: "legs",
                exercises: [
                  { name: "squats", sets: 3, reps: 12, weight: 135 },
                  { name: "leg press", sets: 3, reps: 12, weight: 180 },
                  { name: "leg curls", sets: 3, reps: 12, weight: 50 },
                ]
              }
            ],
          },
          privateMode: false, // Controls display stats & active split
          autoUpdateWeight: true, // Controls whether to update weight automatically
        }

        let initPrivateUserData =
        {
          gender: gender,
          weight: weight,
          email: email,
        }

        let initPrivateUserSplits =
        {
          splits: [
            {
              splitName: "PPL",
              days: [
                {
                  dayName: "push",
                  exercises: [
                    { name: "bench", sets: 3, reps: 12, weight: 135 },
                    { name: "overhead press", sets: 3, reps: 12, weight: 95 },
                    { name: "tricep pushdown", sets: 3, reps: 12, weight: 50 },
                  ]
                },
                {
                  dayName: "pull",
                  exercises: [
                    { name: "deadlift", sets: 3, reps: 12, weight: 135 },
                    { name: "pullups", sets: 3, reps: 12, weight: 0 },
                    { name: "rows", sets: 3, reps: 12, weight: 95 },
                  ]
                },
                {
                  dayName: "legs",
                  exercises: [
                    { name: "squats", sets: 3, reps: 12, weight: 135 },
                    { name: "leg press", sets: 3, reps: 12, weight: 180 },
                    { name: "leg curls", sets: 3, reps: 12, weight: 50 },
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
                    { name: "bench", sets: 3, reps: 12, weight: 135 },
                    { name: "overhead press", sets: 3, reps: 12, weight: 95 },
                    { name: "tricep pushdown", sets: 3, reps: 12, weight: 50 },
                  ]
                },
                {
                  dayName: "lower",
                  exercises: [
                    { name: "deadlift", sets: 3, reps: 12, weight: 135 },
                    { name: "pullups", sets: 3, reps: 12, weight: 0 },
                    { name: "rows", sets: 3, reps: 12, weight: 95 },
                  ]
                },
              ],
            },
          ],
        }

        let initPrivateFriendsData = {
          friendList: [],
          friendRequestsSent: [],
          friendRequestsReceived: [],
        }

        let initPrivateWorkoutData = {
          hiddenStats: { // Calculated after ending a workout based on 2-weeks rolling average of 1RM from exercise history
            bench: 135,
            deadlift: 135
          },
          exerciseHistory: { // Score calculated using weight and onerep, adj calculated using score and pos/neg feedback
            bench: [{ oneRep: 135, score: 30, adj: 1.01 }],
            deadlift: [{ oneRep: 135, score: 30, adj: 1.01 },],
          },
        }

        createPublicUser(initPublicUser).then(
          createPrivateUser(initPrivateUserData).then(
            createPrivateSplits(initPrivateUserSplits).then(
              createPrivateFriends(initPrivateFriendsData).then(
                createPrivateWorkout(initPrivateWorkoutData).then(() => {
                  console.log('User data saved successfully');
                  signInWithEmailAndPassword(auth, email, password);
                }
                )
              )
            )
          )
        )
      } catch (error) {
        console.error('Error saving user data: ', error);
      }
    })
    .catch(error => setErrorMessage(error.message));
};

export const logoutUser = async () => {
  // Delete user data from local storage
  try {
    AsyncStorage.getAllKeys()
    .then(keys => AsyncStorage.multiRemove(keys))
    .then(() => alert('Logout Successful!'));
  } catch (e) {
    console.log('Error removing user data from local storage: ', e);
  }
  FIREBASE_AUTH.signOut();
}