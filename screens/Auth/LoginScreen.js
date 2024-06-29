import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { loginUser } from "../../api/auth";
import { GreetingMsg } from "./Components/GreetingMsg";
import { Input } from "./Components/Input";
import { SignInButton } from "./Components/SignInButton";
import { Footer } from "./Components/Footer";

import { useTheme } from "../ThemeProvider";
import * as Haptics from 'expo-haptics';


const { height, width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);    

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const handleLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        loginUser(email, password, setErrorMessage);
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.circle}/>
            <GreetingMsg msg="Welcome Back"></GreetingMsg>
            <View style={styles.inputContainer}>
                <Input 
                    mode="email" 
                    backgroundColor={theme.inputBackgroundColor}
                    onChangeText={setEmail}
                    value={email}
                    placeholder="Email"
                    placeholderTextColor={theme.textColor}
                />
                <Input 
                    mode="password" 
                    backgroundColor={theme.inputBackgroundColor}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Password"
                    placeholderTextColor={theme.textColor}
                />
            </View>
            <View style={styles.errorContainer}>
                {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
            </View>
            <View style={styles.buttonContainer}>
                <SignInButton text="Log In" onPress={handleLogin}/>
            </View>
            <View style={styles.footerContainer}>
                <Footer msg="New to LiftX?" button="Sign Up" whenClicked="Register" />
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
    circle: {
        position: 'absolute',
        width: width * 1.6, 
        height: width * 1.6, 
        borderRadius: (width * 1.6) / 2,
        backgroundColor: theme.backdropColor,
        top: -width * 0.75, 
        left: -width * 0.50,
        zIndex: -1, 
    },
    error: {
        color: "#E9446A", // Error text color
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"
    },
    
});

export default LoginScreen;