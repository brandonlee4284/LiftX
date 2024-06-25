import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { createNewUser } from "../../api/auth";
import { GreetingMsg } from "./Components/GreetingMsg";
import { Input } from "./Components/Input";
import { SignInButton } from "./Components/SignInButton";
import { useTheme } from "../ThemeProvider";
import { Footer } from "./Components/Footer";


const { height, width } = Dimensions.get('window');



const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);

    const { theme } = useTheme();
    const styles = createStyles(theme);


    const handleSignUp = () => {
        createNewUser(gender, weight, displayName, username, email, password, setErrorMessage, navigation);
    };

    return (
        <View style={styles.container}>
                <View style={styles.circle}/>
                <GreetingMsg msg="Create Account"></GreetingMsg>
                <View style={styles.errorContainer}>
                    {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
                </View>

                <View style={styles.inputContainer}>
                    <Input
                        mode="username"
                        onChangeText={setUsername}
                        value={username}
                        backgroundColor="#2C3033"
                        placeholderTextColor={theme.textColor}
                    />

                    <Input
                        mode="email"
                        onChangeText={setEmail}
                        value={email}
                        backgroundColor="#2C3033"
                        placeholderTextColor={theme.textColor}
                    />

                    <Input
                        mode="password"
                        onChangeText={setPassword}
                        value={password}
                        backgroundColor="#2C3033"
                        placeholderTextColor={theme.textColor}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <SignInButton text="Sign Up" onPress={handleSignUp}/>
                </View>

                <View style={styles.footerContainer}>
                    <Footer msg="Have an account?" button="Log In" whenClicked="Login" />
                </View>

        
        </View>
    );
};

const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        paddingHorizontal: 20,
    },
    circle: {
        position: 'absolute',
        width: width * 1.6, 
        height: width * 1.6, 
        borderRadius: (width * 1.6) / 2,
        backgroundColor: theme.backdropColor,
        bottom: -width * 0.35,  
        right: -width * 0.40,  
        zIndex: -1,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: height * 0.03,
    },
    errorContainer: {
        alignItems: 'center',
        marginBottom: height * 0.03,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: height * 0.08,
    },
    error: {
        color: "#E9446A", // Error text color
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
});

export default RegisterScreen;