import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, or, setDoc } from "firebase/firestore";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSignUp = () => {
        const auth = FIREBASE_AUTH;
        createUserWithEmailAndPassword(auth, email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
                try {
                    const userDocRef = doc(FIRESTORE_DB, "users", user.uid);
                    setDoc(userDocRef, {
                        name: name,
                        username,
                        email: email,
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
                        activeSplitIndex: 0,
                        hiddenStats: { bench: { "2021-01-01": 135 } },
                        exerciseHistory: { bench: { "2021-01-01": 135 } },
                    });


                    console.log('User data saved successfully');
                    navigation.navigate('Home');
                } catch (error) {
                    console.error('Error saving user data: ', error);
                }
            })
            .catch(error => setErrorMessage(error.message));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.greeting}>Welcome to LiftX!</Text>

            <View style={styles.errorMessage}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>

            <View style={styles.form}>
                <View>
                    <Text style={styles.inputTitle}>Full Name</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={setName}
                        value={name}
                    />
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Username</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={setUsername}
                        value={username}
                    />
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Email Address</Text>
                    <TextInput
                        style={styles.input}
                        autoCapitalize="none"
                        onChangeText={setEmail}
                        value={email}
                    />
                </View>

                <View style={{ marginTop: 32 }}>
                    <Text style={styles.inputTitle}>Password</Text>
                    <TextInput
                        style={styles.input}
                        secureTextEntry
                        autoCapitalize="none"
                        onChangeText={setPassword}
                        value={password}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
                <Text style={{ color: "white" }}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}>
                <Text style={{ color: "#414959", fontSize: 13 }}>
                    Already a member of LiftX?
                    <Text style={{ fontWeight: "500", color: "black" }} onPress={() => navigation.navigate("Login")}> Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    },
    greeting: {
        marginTop: 32,
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center"
    },
    errorMessage: {
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
        color: "red"
    },
    error: {
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30
    },
    inputTitle: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase"
    },
    input: {
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        height: 40,
        fontSize: 15,
        color: "#161F3D"
    },
    loginButton: {
        marginHorizontal: 30,
        backgroundColor: "black",
        borderRadius: 4,
        height: 52,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default RegisterScreen;
