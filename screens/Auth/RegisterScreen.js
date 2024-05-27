import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { createNewUser } from "../../api/auth";

const RegisterScreen = ({ navigation }) => {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const handleSignUp = () => {
        createNewUser(name, username, email, password, setErrorMessage);
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
