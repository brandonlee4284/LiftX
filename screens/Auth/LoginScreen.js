import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { loginUser } from "../../api/auth";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleLogin = () => {
        loginUser(email, password, setErrorMessage);
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.greeting}>LiftX Login</Text>
                <Text style={styles.subGreeting}>Login to your LiftX account</Text>

                <View style={styles.errorMessage}>
                    {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            autoCapitalize="none"
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor="#8A8F9E"
                        />
                    </View>

                    <View style={[styles.inputContainer, { marginTop: 16 }]}>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            autoCapitalize="none"
                            onChangeText={setPassword}
                            value={password}
                            placeholder="Password"
                            placeholderTextColor="#8A8F9E"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={{ color: "black", fontWeight: "600" }}>Log In</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={{ alignSelf: "center", marginTop: 32 }}>
                <Text style={{ color: "#8A8F9E", fontSize: 13 }}>
                    New to LiftX?
                    <Text style={{ fontWeight: "500", color: "white" }} onPress={() => navigation.navigate("Register")}> Sign Up</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#121212", // Dark background color
        paddingHorizontal: 20,
    },
    card: {
        backgroundColor: "black", // Darker card background color
        borderRadius: 10,
        padding: 30,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    greeting: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        color: "white", // Light text color
    },
    subGreeting: {
        fontSize: 14,
        textAlign: "center",
        color: "#8A8F9E", // Lighter text color
        marginTop: 8,
    },
    errorMessage: {
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30,
    },
    error: {
        color: "#E9446A", // Error text color
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    form: {
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#121212", // Darker input background color
        borderRadius: 12,
        height: 40,
        fontSize: 15,
        color: "white", // Light text color
        paddingHorizontal: 10,
    },
    optionsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 16,
    },
    rememberMeContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    loginButton: {
        backgroundColor: "white", // Button color
        borderRadius: 12,
        height: 52,
        alignItems: "center",
        justifyContent: "center",
    }
});

export default LoginScreen;