import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView, Animated } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { createNewUser } from "../../api/auth";
import { GreetingMsg } from "./Components/GreetingMsg";
import { Input } from "./Components/Input";
import { SignInButton } from "./Components/SignInButton";
import { useTheme } from "../ThemeProvider";
import { Footer } from "./Components/Footer";
import * as Haptics from 'expo-haptics';

const { height, width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [weight, setWeight] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const route = useRoute();

    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [notification, setNotification] = useState({ message: '', visible: false, color: theme.primaryColor });
    const notificationTimeoutRef = useRef(null);
    const slideAnim = useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        if (route.params?.showNotification) {
            const { message, color } = route.params.showNotification;
            showNotification(message, color);
        }
    }, [route.params]);

    const showNotification = (message, color) => {
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        setNotification({ message, visible: true, color });

        // Slide the notification in
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        notificationTimeoutRef.current = setTimeout(() => {
            // Slide the notification out
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setNotification({ message: '', visible: false, color: theme.primaryColor });
            });
        }, 5000);
    };

    const handleSignUp = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setErrorMessage("");
        await createNewUser(gender, weight, age, displayName, username, email, password, setErrorMessage, navigation);
        
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.innerContainer}>
                        <View style={styles.circle} />
                        <GreetingMsg msg="Create Account" />
                        <View style={styles.errorContainer}>
                            {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
                        </View>

                        <View style={styles.inputContainer}>
                            <Input
                                mode="displayName"
                                onChangeText={setDisplayName}
                                value={displayName}
                                backgroundColor="#2C3033"
                                placeholderTextColor={theme.textColor}
                            />

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
                            <SignInButton text="Sign Up" onPress={handleSignUp} />
                        </View>

                        <View style={styles.footerContainer}>
                            <Footer msg="Have an account?" button="Log In" whenClicked="Login" />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
            {notification.visible && (
                <Animated.View style={[styles.notificationContainer, { backgroundColor: notification.color, transform: [{ translateY: slideAnim }] }]}>
                    <Text style={styles.notificationText}>{notification.message}</Text>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
};

const createStyles = (theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.backgroundColor,
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    circle: {
        position: 'absolute',
        width: width * 1.7,
        height: width * 1.7,
        borderRadius: (width * 1.7) / 2,
        backgroundColor: theme.backdropColor,
        bottom: -width * 0.25,
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
        textAlign: "center",
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: height*0.057,
        padding: 5,
        backgroundColor: theme.primaryColor,
        borderRadius: 20,
        alignItems: 'center',
    },
    notificationText: {
        color: theme.textColor,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default RegisterScreen;