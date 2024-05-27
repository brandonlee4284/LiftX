import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../FirebaseConfig";


export const loginUser = async (email, password, setErrorMessage) => {
    const auth = FIREBASE_AUTH;
    signInWithEmailAndPassword(auth, email, password)
        .catch(error => setErrorMessage(error.message));
};

export const createNewUser = async (name, username, email, password, setErrorMessage) => {
    const auth = FIREBASE_AUTH;
    createUserWithEmailAndPassword(auth, email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            try {
                const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
                setDoc(userDocRef, {
                    username: username,
                    bio: "This is a sample bio.", // Placeholder bio
                    profilePicture: null, // Placeholder image
                    numFriends: 0,
                    friends: {},
                    displayStats: { bench: "135" },
                    activeSplit: {
                        splitName: "PPL",
                        day: {
                            0: {
                                dayName: "push",
                                exercises: {
                                    0: { name: "bench", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                    1: { name: "overhead press", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                    2: { name: "tricep pushdown", sets: 3, reps: [12, 12, 12], weight: [50, 50, 50] },
                                    order: [0, 1, 2],
                                },
                            },
                            1: {
                                dayName: "pull",
                                exercises: {
                                    0: { name: "deadlift", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                    1: { name: "pullups", sets: 3, reps: [12, 12, 12], weight: [0, 0, 0] },
                                    2: { name: "rows", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                    order: [0, 1, 2],
                                },
                            },
                            2: {
                                dayName: "legs",
                                exercises: {
                                    0: { name: "squats", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                    1: { name: "leg press", sets: 3, reps: [12, 12, 12], weight: [180, 180, 180] },
                                    2: { name: "leg curls", sets: 3, reps: [12, 12, 12], weight: [50, 50, 50] },
                                    order: [0, 1, 2],
                                },
                            },
                            order: [0, 1, 2],
                        },
                    },
                    privateMode: false,
                });

                const privateDataDocRef = doc(userDocRef, "userData", "data");
                setDoc(privateDataDocRef, {
                    name: name,
                    email: email,
                    hiddenStats: { bench: { "2021-01-01": 135 } },
                    exerciseHistory: { bench: { "2021-01-01": 135 } },
                });

                const privateSplitsDocRef = doc(userDocRef, "userData", "splits");
                setDoc(privateSplitsDocRef, {
                    splits: {
                        0: {
                            splitName: "PPL",
                            day: {
                                0: {
                                    dayName: "push",
                                    exercises: {
                                        0: { name: "bench", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                        1: { name: "overhead press", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                        2: { name: "tricep pushdown", sets: 3, reps: [12, 12, 12], weight: [50, 50, 50] },
                                        order: [0, 1, 2],
                                    },
                                },
                                1: {
                                    dayName: "pull",
                                    exercises: {
                                        0: { name: "deadlift", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                        1: { name: "pullups", sets: 3, reps: [12, 12, 12], weight: [0, 0, 0] },
                                        2: { name: "rows", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                        order: [0, 1, 2],
                                    },
                                },
                                2: {
                                    dayName: "legs",
                                    exercises: {
                                        0: { name: "squats", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                        1: { name: "leg press", sets: 3, reps: [12, 12, 12], weight: [180, 180, 180] },
                                        2: { name: "leg curls", sets: 3, reps: [12, 12, 12], weight: [50, 50, 50] },
                                        order: [0, 1, 2],
                                    },
                                },
                                order: [0, 1, 2],
                            },
                        },
                        1: {
                            splitName: "Upper/Lower",
                            day: {
                                0: {
                                    dayName: "upper",
                                    exercises: {
                                        0: { name: "bench", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                        1: { name: "overhead press", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                        2: { name: "tricep pushdown", sets: 3, reps: [12, 12, 12], weight: [50, 50, 50] },
                                        order: [0, 1, 2],
                                    },
                                },
                                1: {
                                    dayName: "lower",
                                    exercises: {
                                        0: { name: "deadlift", sets: 3, reps: [12, 12, 12], weight: [135, 135, 135] },
                                        1: { name: "pullups", sets: 3, reps: [12, 12, 12], weight: [0, 0, 0] },
                                        2: { name: "rows", sets: 3, reps: [12, 12, 12], weight: [95, 95, 95] },
                                        order: [0, 1, 2],
                                    },
                                },
                                order: [0, 1],
                            },
                        },
                        order: [0, 1],
                    },
                });

                console.log('User data saved successfully');
                signInWithEmailAndPassword(auth, email, password)
            } catch (error) {
                console.error('Error saving user data: ', error);
            }
        })
        .catch(error => setErrorMessage(error.message));
};

export const logoutUser = async () => {
    FIREBASE_AUTH.signOut();
}