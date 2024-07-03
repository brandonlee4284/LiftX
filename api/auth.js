import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createPublicUser, createPrivateUser, fetchPublicUserData } from './profile';
import { createPrivateSplits } from './splits';
import { createPrivateFriends } from './friends';
import { createPrivateWorkout } from './workout';
import { clearAsyncStorage } from "./helperFuncs";
import dayjs from "dayjs";

// Login user with email and password
export const loginUser = async (email, password, setErrorMessage) => {
  const auth = FIREBASE_AUTH;
  signInWithEmailAndPassword(auth, email, password).then(async () => {
    // Delete user data from local storage
    await clearAsyncStorage();

    // Get user data from firestore and save to local storage
    await fetchPublicUserData()
    await fetchPublicUserData()
  }
  ).catch(error => setErrorMessage(error.message));
};

export const createNewUser = async (gender = "male", weight = 135, name, username, email, password, setErrorMessage, navigation) => {
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
          displayScore: { overall: 1.0, chest: 1.0, back: 1.0, legs: 1.0, shoulders: 1.0, arms: 1.0 },
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
        }

        let initPrivateFriendsData = {
          friendList: [],
          friendRequestsSent: [],
          friendRequestsReceived: [],
        }

        let initPrivateWorkoutData = {
          stats: { 
            chest: {
              bench: {totalSets: [dayjs(), dayjs(), dayjs()], repMax: 135, score: 30, change: 0},
            }
          },
          overallScore: {
            overall: {score:0, change:0},
            chest: {score:30, change:0},
            back: {score:0, change:0},
            legs: {score:0, change:0},
            shoulders: {score:0, change:0},
            arms: {score:0, change:0},
            core: {score:0, change:0},
          },
        }

        createPublicUser(initPublicUser).then(
          createPrivateUser(initPrivateUserData).then(
            createPrivateSplits(initPrivateUserSplits).then(
              createPrivateFriends(initPrivateFriendsData).then(
                createPrivateWorkout(initPrivateWorkoutData).then(() => {
                  console.log('User data saved successfully');
                  signInWithEmailAndPassword(auth, email, password)
                  .then(() => {
                    navigation.navigate('Onboarding');
                  });
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
  await clearAsyncStorage();
  FIREBASE_AUTH.signOut();
}