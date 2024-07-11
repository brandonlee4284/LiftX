import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { loginUser, resetPassword } from "../../api/auth";
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
        setErrorMessage("");
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        loginUser(email, password, setErrorMessage);
    };

    const handleForgotPassword = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setErrorMessage("");
        navigation.navigate("ForgotPassword");
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.circle}/>
                <GreetingMsg msg="Welcome Back"></GreetingMsg>
                <View style={styles.errorContainer}>
                    {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
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
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableWithoutFeedback onPress={handleForgotPassword}>
                            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                        </TouchableWithoutFeedback>
                    </View>
                </KeyboardAvoidingView>
                
                <View style={styles.buttonContainer}>
                    <SignInButton text="Log In" onPress={handleLogin}/>
                </View>
                <View style={styles.footerContainer}>
                    <Footer msg="New to LiftX?" button="Sign Up" whenClicked="Register" />
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
const getResponsiveFontSize = (baseFontSize) => {
    const scale = width / 425; 
    return Math.round(baseFontSize * scale);
};
const createStyles = (theme) => StyleSheet.create({    
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
        paddingHorizontal: 20,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        //marginBottom: 20,
    },
    inputContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    buttonContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    footerContainer: {
        alignItems: 'center',
        marginBottom: 100,
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
    forgotPasswordContainer: {  
        paddingRight: 50
    },
    forgotPasswordText: {
        color: theme.grayTextColor,
        fontSize: getResponsiveFontSize(12),
        textDecorationLine: 'underline',
        textAlign: 'right',
    },
});

export default LoginScreen;