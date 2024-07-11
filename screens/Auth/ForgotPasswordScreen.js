import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, Dimensions, Animated } from 'react-native';
import { loginUser, resetPassword } from "../../api/auth";
import { GreetingMsg } from "./Components/GreetingMsg";
import { Input } from "./Components/Input";
import { SignInButton } from "./Components/SignInButton";
import { Footer } from "./Components/Footer";
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';

import { useTheme } from "../ThemeProvider";
import * as Haptics from 'expo-haptics';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const { height, width } = Dimensions.get('window');

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);    

    const { theme } = useTheme();
    const styles = createStyles(theme);
    const route = useRoute();

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

    const handleForgotPassword = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setErrorMessage("");
        resetPassword(email)
            .then(() => {
                //alert("Password reset email sent. Please check your email.");
                //navigation.navigate("Login");
                showNotification("Password reset email sent. Please check your email.", theme.primaryColor);
                setEmail("");
            })
            .catch((error) => {
                setErrorMessage(error.message);
                showNotification(error.message, theme.dangerColor);
            });
    };
    
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <Ionicons name="chevron-back" onPress={() => navigation.goBack()} size={getResponsiveFontSize(25)} color={theme.textColor} style={styles.backIcon}/>
                    <Text style={styles.header}>Reset Password</Text>
                </View>
                <View style={styles.body}>
                    <Text style={styles.title}>Enter your LiftX email</Text>
                    <View style={styles.inputContainer}>
                        <Input 
                            mode="email" 
                            backgroundColor={theme.inputBackgroundColor}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Email"
                            placeholderTextColor={theme.textColor}
                        />
                        
                    </View>
                    <TouchableOpacity style={styles.buttonContainer} onPress={handleForgotPassword}>
                        <Text style={styles.buttonText}>Reset Password</Text>
                    </TouchableOpacity>
                </View>
                {notification.visible && (
                    <Animated.View style={[styles.notificationContainer, { backgroundColor: notification.color, transform: [{ translateY: slideAnim }] }]}>
                        <Text style={styles.notificationText}>{notification.message}</Text>
                    </Animated.View>
                )}
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
    title: {
        fontSize: getResponsiveFontSize(20),
        color: theme.textColor,
    },
    body: {
        marginTop: 50,
        paddingHorizontal: 45
    },
    inputContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    buttonContainer: {
        height: height * 0.050,
        width: width * 0.35,
        borderRadius: 15,
        backgroundColor: theme.primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: theme.backgroundColor,
        fontSize: getResponsiveFontSize(16),
        fontWeight: 'bold',
        textAlign: 'center'
    },
    headerContainer: {
        marginTop: height > 850 ? 60 : 50,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        right: width*0.15
    },
    header: {
        color: theme.textColor,
        fontSize: getResponsiveFontSize(26),
        fontWeight: '800',
        left: -0.0347*width
    },
    notificationContainer: {
        position: 'absolute',
        width: width,
        paddingTop: height*0.065,
        padding: 10,
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

export default ForgotPasswordScreen;